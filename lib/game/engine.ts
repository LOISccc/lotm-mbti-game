import { CONTENT_POOL, PATHS } from "./content";
import type {
  ChoiceEffects,
  DiceResult,
  GameEvent,
  GameLogEntry,
  HiddenKey,
  PlayerState,
  Stage,
  StatKey,
  Tag
} from "./types";

const STAGE_ORDER: Stage[] = ["ACADEMIC", "PERSONALITY", "PATH", "LIFE", "ASCENSION"];

export function createInitialState(seed = Date.now() % 100000): PlayerState {
  return {
    stage: "ACADEMIC",
    turn: 0,
    stats: { insight: 1, luck: 1, action: 1, stability: 1 },
    hidden: { danger: 0, entropy: 0, corruption: 0 },
    mbtiProgress: { I: 0, E: 0, N: 0, S: 0, T: 0, F: 0, J: 0, P: 0 },
    pathAffinity: Object.fromEntries(PATHS.map((path) => [path, 0])) as PlayerState["pathAffinity"],
    seenEventIds: [],
    preferredTags: ["mystery", "knowledge"],
    seed
  };
}

export function selectEvent(state: PlayerState): GameEvent {
  const stagePool = CONTENT_POOL.filter((event) => event.stage === state.stage);
  const triggeredKeyEvents = stagePool.filter((event) => event.type === "key" && matchesTrigger(event, state));

  if (triggeredKeyEvents.length > 0) {
    return weightedPick(triggeredKeyEvents, state);
  }

  const regularPool = stagePool.filter((event) => event.type !== "key");
  return weightedPick(regularPool.length > 0 ? regularPool : stagePool, state);
}

export function resolveTurn(
  state: PlayerState,
  event: GameEvent,
  choiceKey: "A" | "B"
): { state: PlayerState; logEntry: GameLogEntry } {
  const choice = event.choices?.[choiceKey];
  let nextState: PlayerState = {
    ...state,
    turn: state.turn + 1,
    seenEventIds: [...state.seenEventIds, event.id].slice(-10)
  };

  if (choice) {
    nextState = applyEffects(nextState, choice.effects);
  }

  let dice: DiceResult | undefined;
  let eventText = choice ? `${event.text} 选择：${choice.text}` : event.text;

  if (event.type === "key" && event.check) {
    dice = rollCheck(nextState, event.check.stat, event.check.dc);
    const branch = dice.success ? event.success : event.fail;
    if (branch) {
      nextState = applyEffects(nextState, branch.effects);
      eventText = branch.text;
    }
  }

  if (event.type === "ascension") {
    const ascensionSuccess = canAscend(nextState);
    nextState = {
      ...nextState,
      ascensionResult: ascensionSuccess ? "success" : "collapse"
    };
    eventText = ascensionSuccess ? event.success?.text ?? event.text : event.fail?.text ?? event.text;
  }

  nextState = advanceStage(nextState);
  nextState = updatePreferredTags(nextState, event.tags);

  return {
    state: nextState,
    logEntry: {
      turn: nextState.turn,
      eventId: event.id,
      stage: event.stage,
      choice: choiceKey,
      text: eventText,
      dice
    }
  };
}

export function resolveAscension(state: PlayerState) {
  const mbti = state.mbti;

  // 基础成功值
  let score = 0;

  // 1. 属性贡献
  score += Object.values(state.stats).reduce((a, b) => a + b, 0);

  // 2. 隐藏压力（越低越好）
  score -= Object.values(state.hidden).reduce((a, b) => a + b, 0);

  // 3. MBTI修正
  if (mbti?.includes("N")) score += 2;
  if (mbti?.includes("J")) score += 1;

  // 4. 随机骰子
  const dice = Math.floor(Math.random() * 6) + 1;
  score += dice;

  return {
    success: score > 15,
    score,
    dice
  };
}

export function inferMbti(state: PlayerState) {
  const pairs: Array<[string, string]> = [
    ["I", "E"],
    ["N", "S"],
    ["T", "F"],
    ["J", "P"]
  ];

  return pairs
    .map(([left, right]) =>
      state.mbtiProgress[left as keyof PlayerState["mbtiProgress"]] >=
      state.mbtiProgress[right as keyof PlayerState["mbtiProgress"]]
        ? left
        : right
    )
    .join("");
}

export function leadingPath(state: PlayerState) {
  return Object.entries(state.pathAffinity).sort((a, b) => b[1] - a[1])[0]?.[0] ?? PATHS[0];
}

function weightedPick(events: GameEvent[], state: PlayerState) {
  const weighted = events.map((event) => ({
    event,
    weight: Math.max(1, getEventWeight(event, state))
  }));
  const total = weighted.reduce((sum, item) => sum + item.weight, 0);
  let cursor = seededRandom(state.seed + state.turn * 97 + state.hidden.entropy * 31) * total;

  for (const item of weighted) {
    cursor -= item.weight;
    if (cursor <= 0) {
      return item.event;
    }
  }

  return weighted[0].event;
}

function getEventWeight(event: GameEvent, state: PlayerState) {
  const base = event.type === "template" ? 8 : event.type === "key" ? 12 : 10;
  const tagMatch = event.tags.filter((tag) => state.preferredTags.includes(tag)).length * 2;
  const pathBonus = Object.entries(event.pathAffinity ?? {}).reduce((sum, [path, bonus]) => {
    return sum + Math.min(6, Math.max(0, state.pathAffinity[path as keyof PlayerState["pathAffinity"]] + bonus));
  }, 0);
  const repetitionPenalty = state.seenEventIds.includes(event.id) ? 12 : 0;

  return base + pathBonus + tagMatch - repetitionPenalty;
}

function matchesTrigger(event: GameEvent, state: PlayerState) {
  if (!event.trigger) {
    return true;
  }

  return Object.entries(event.trigger).every(([key, expected]) => {
    const current =
      key in state.hidden
        ? state.hidden[key as HiddenKey]
        : state.stats[key as StatKey];

    if (typeof expected === "number") {
      return current >= expected;
    }

    const match = expected.match(/(>=|<=|>|<|=)\s*(-?\d+)/);
    if (!match) {
      return false;
    }

    const [, operator, rawValue] = match;
    const value = Number(rawValue);

    switch (operator) {
      case ">=":
        return current >= value;
      case "<=":
        return current <= value;
      case ">":
        return current > value;
      case "<":
        return current < value;
      case "=":
        return current === value;
      default:
        return false;
    }
  });
}

function applyEffects(state: PlayerState, effects: ChoiceEffects): PlayerState {
  return {
    ...state,
    stats: applyNumericPatch(state.stats, effects.stats),
    hidden: applyNumericPatch(state.hidden, effects.hidden),
    mbtiProgress: applyNumericPatch(state.mbtiProgress, effects.mbtiBias),
    pathAffinity: applyNumericPatch(state.pathAffinity, effects.pathAffinity)
  };
}

function applyNumericPatch<T extends Record<string, number>>(target: T, patch?: Partial<T>): T {
  if (!patch) {
    return target;
  }

  const next = { ...target };
  for (const [key, value] of Object.entries(patch)) {
    next[key as keyof T] = Math.max(0, (next[key as keyof T] ?? 0) + Number(value)) as T[keyof T];
  }
  return next;
}

function rollCheck(state: PlayerState, stat: StatKey, dc: number): DiceResult {
  const roll = Math.floor(seededRandom(state.seed + state.turn * 131 + dc) * 20) + 1;
  const total = roll + state.stats[stat];

  return {
    roll,
    total,
    dc,
    stat,
    success: total >= dc
  };
}

function canAscend(state: PlayerState) {
  return state.stats.insight >= 5 && state.hidden.corruption <= 3 && state.stats.stability >= 3;
}

function advanceStage(state: PlayerState): PlayerState {
  if (state.ascensionResult) {
    return state;
  }

  const thresholdByStage: Record<Stage, number> = {
    ACADEMIC: 2,
    PERSONALITY: 4,
    PATH: 6,
    LIFE: 13,
    ASCENSION: Number.POSITIVE_INFINITY
  };

  if (state.turn >= thresholdByStage[state.stage]) {
    const currentIndex = STAGE_ORDER.indexOf(state.stage);
    return {
      ...state,
      stage: STAGE_ORDER[Math.min(currentIndex + 1, STAGE_ORDER.length - 1)]
    };
  }

  return state;
}

function updatePreferredTags(state: PlayerState, tags: Tag[]): PlayerState {
  return {
    ...state,
    preferredTags: [...new Set([...tags, ...state.preferredTags])].slice(0, 4)
  };
}

function seededRandom(seed: number) {
  const x = Math.sin(seed || 1) * 10000;
  return x - Math.floor(x);
}

export function resolveAscension(state: PlayerState) {
  const total =
    Object.values(state.stats).reduce((a, b) => a + b, 0) -
    Object.values(state.hidden).reduce((a, b) => a + b, 0);

  const roll = Math.floor(Math.random() * 20) + 1;

  const finalScore = total + roll;

  const success = finalScore > 25;

  return {
    success,
    finalScore,
    roll,
  };
}