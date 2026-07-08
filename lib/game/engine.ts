import { CONTENT_POOL, SEQUENCE_PROFILES } from "./content";
import type {
  Chapter,
  ChoiceEffects,
  ChoiceKey,
  DiceOutcome,
  DiceResult,
  EngineResult,
  EventMemory,
  GameEvent,
  GameLogEntry,
  HiddenStatBlock,
  NpcMemory,
  PersonalityProgress,
  PlayerState,
  SequenceCandidate,
  SequenceId,
  StatKey,
  TriggerCondition,
  WorldAffinityBlock
} from "./types";
import { CHAPTERS, HIDDEN_STAT_KEYS, PERSONALITY_SIGNALS, STAT_KEYS, WORLD_AFFINITIES } from "./types";

const CHAPTER_TURN_THRESHOLDS: Record<Chapter, number> = {
  GRADUATION: 4,
  SUMMER: 8,
  UNIVERSITY: 12,
  SEQUENCE: 16,
  ASCENSION: 18,
  ENDING: Number.POSITIVE_INFINITY
};

export function createInitialState(seed = Date.now() % 100000): PlayerState {
  return {
    turn: 0,
    chapter: "GRADUATION",
    stats: createRecord(STAT_KEYS, 1),
    hiddenStats: {
      curiosity: 0,
      obsession: 0,
      sanity: 4,
      luck: 0,
      destiny: 0,
      faith: 0,
      loneliness: 0
    },
    personality: createRecord(PERSONALITY_SIGNALS, 0),
    worldAffinity: createRecord(WORLD_AFFINITIES, 0),
    sequenceCandidates: [],
    sequenceProgress: createRecord(
      SEQUENCE_PROFILES.map((profile) => profile.id),
      0
    ),
    inventory: {},
    npcMemory: {},
    eventMemory: [],
    tags: [],
    flags: [],
    seenEventIds: [],
    diceHistory: [],
    seed
  };
}

export function selectEvent(state: PlayerState): GameEvent {
  const destinyEvent = CONTENT_POOL.find(
    (event) => event.chapter === state.chapter && event.rarity === "destiny" && matchesTrigger(event.trigger, state)
  );

  if (destinyEvent) {
    return destinyEvent;
  }

  const candidatePool = CONTENT_POOL.filter((event) => {
    if (event.rarity === "destiny") {
      return false;
    }
    if (event.chapter !== state.chapter) {
      return false;
    }
    return matchesTrigger(event.trigger, state);
  });

  if (candidatePool.length === 0) {
    const fallback = CONTENT_POOL.find((event) => event.chapter === state.chapter);
    if (!fallback) {
      throw new Error(`No content events available for chapter: ${state.chapter}`);
    }
    return fallback;
  }

  return weightedPick(candidatePool, state);
}

export function resolveTurn(state: PlayerState, event: GameEvent, choiceKey: ChoiceKey): EngineResult {
  const choice = event.choices[choiceKey];
  let nextState = applyEffects(state, choice.effects, event, choiceKey);

  let dice: DiceResult | undefined;
  let sequenceCandidates: SequenceCandidate[] | undefined;
  let awakenedSequence: SequenceCandidate | undefined;
  let ascensionResult = nextState.ascensionResult;

  if (event.diceCheck) {
    dice = rollDice(nextState, event, event.diceCheck.stat, event.diceCheck.dc, event.diceCheck.reason);
    nextState = applyDiceResult(nextState, dice);
  }

  if (event.id === "summer_destiny_awakening") {
    sequenceCandidates = calculateSequenceCandidates(nextState, dice);
    awakenedSequence = pickAwakenedSequence(sequenceCandidates, dice, nextState);
    nextState = {
      ...nextState,
      currentSequence: awakenedSequence.id,
      sequenceCandidates,
      sequenceProgress: {
        ...nextState.sequenceProgress,
        [awakenedSequence.id]: Math.max(20, nextState.sequenceProgress[awakenedSequence.id] + 20)
      },
      flags: addUnique(nextState.flags, ["sequence_awakened"]),
      tags: addUnique(nextState.tags, [awakenedSequence.id, "sequence"])
    };
  }

  if (event.id === "asc_destiny_final") {
    ascensionResult = resolveAscension(nextState, dice);
    nextState = {
      ...nextState,
      ascensionResult,
      chapter: "ENDING",
      flags: addUnique(nextState.flags, ["game_finished"])
    };
  } else {
    nextState = advanceChapter(nextState);
  }

  const logEntry: GameLogEntry = {
    turn: nextState.turn,
    chapter: event.chapter,
    eventId: event.id,
    title: event.title,
    choice: choiceKey,
    summary: choice.effects.eventSummary ?? `${event.title}: ${choice.text}`,
    dice,
    sequenceCandidates,
    awakenedSequence,
    ascensionResult
  };

  return {
    state: nextState,
    event: nextState.chapter === "ENDING" ? event : selectEvent(nextState),
    logEntry
  };
}

export function inferMbti(state: PlayerState) {
  const p = state.personality;
  return [
    p.introversion >= p.extraversion ? "I" : "E",
    p.intuition >= p.sensing ? "N" : "S",
    p.thinking >= p.feeling ? "T" : "F",
    p.judging >= p.perceiving ? "J" : "P"
  ].join("");
}

export function getMbtiReveal(state: PlayerState) {
  const mbti = inferMbti(state);
  if (state.chapter === "GRADUATION") {
    return "????";
  }
  if (state.chapter === "SUMMER") {
    return `${mbti[0]}???`;
  }
  if (state.chapter === "UNIVERSITY") {
    return `${mbti[0]}${mbti[1]}??`;
  }
  if (state.chapter === "SEQUENCE") {
    return `${mbti[0]}${mbti[1]}${mbti[2]}?`;
  }
  return mbti;
}

export function getCurrentSequenceName(state: PlayerState) {
  if (!state.currentSequence) {
    return "未开启";
  }
  return SEQUENCE_PROFILES.find((profile) => profile.id === state.currentSequence)?.name ?? state.currentSequence;
}

export function calculateSequenceCandidates(state: PlayerState, dice?: DiceResult): SequenceCandidate[] {
  const mbti = inferMbti(state);
  const axis = getPersonalityAxis(state.personality);
  const allTags = new Set(state.tags);
  const dominantAffinity = getDominantWorldAffinity(state.worldAffinity);
  const diceBonus = dice ? Math.max(-4, Math.min(6, dice.finalValue - dice.dc)) : 0;

  return SEQUENCE_PROFILES.map((profile) => {
    const axisScore =
      axis.IE * profile.weights.IE +
      axis.NS * profile.weights.NS +
      axis.TF * profile.weights.TF +
      axis.JP * profile.weights.JP;
    const mbtiScore = profile.preferredMbti.includes(mbti) ? 10 : profile.preferredMbti.some((item) => item[0] === mbti[0]) ? 4 : 0;
    const affinityScore = profile.preferredAffinity.reduce((score, affinity) => {
      const value = state.worldAffinity[affinity];
      return score + value * (affinity === dominantAffinity ? 2 : 1);
    }, 0);
    const behaviorScore = profile.preferredBehavior.reduce((score, tag) => score + (allTags.has(tag) ? 3 : 0), 0);
    const requiredTagScore = profile.requiredTags.reduce((score, tag) => score + (allTags.has(tag) ? 4 : 0), 0);
    const hiddenScore = getHiddenSequenceBonus(state, profile.id);

    return {
      id: profile.id,
      name: profile.name,
      pathwayName: profile.pathwayName,
      score: Math.round(axisScore + mbtiScore + affinityScore + behaviorScore + requiredTagScore + hiddenScore + diceBonus)
    };
  })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

function applyEffects(state: PlayerState, effects: ChoiceEffects, event: GameEvent, choice: ChoiceKey): PlayerState {
  const stats = applyNumericPatch(state.stats, effects.stats);
  const hiddenStats = clampHiddenStats(applyNumericPatch(state.hiddenStats, effects.hiddenStats));
  const personality = applyNumericPatch(state.personality, effects.personality);
  const worldAffinity = applyNumericPatch(state.worldAffinity, effects.worldAffinity);
  const sequenceProgress = applyNumericPatchWithExisting(state.sequenceProgress, effects.sequenceProgress);
  const tags = addUnique(state.tags, [
    ...flattenEventTags(event),
    ...(effects.addTags ?? [])
  ]);
  const flags = addUnique(state.flags, effects.addFlags ?? []);
  const inventory = { ...state.inventory };

  for (const item of effects.addItems ?? []) {
    inventory[item.tag] = item;
  }

  const npcMemory = mergeNpcMemory(state.npcMemory, effects.npcMemory, event.id);
  const eventMemory: EventMemory[] = [
    {
      eventId: event.id,
      title: event.title,
      choice,
      tags: flattenEventTags(event),
      summary: effects.eventSummary ?? `${event.title}: ${event.choices[choice].text}`
    },
    ...state.eventMemory
  ].slice(0, 20);

  return {
    ...state,
    turn: state.turn + 1,
    stats,
    hiddenStats,
    personality,
    worldAffinity,
    sequenceProgress,
    inventory,
    npcMemory,
    eventMemory,
    tags,
    flags,
    seenEventIds: [...state.seenEventIds, event.id].slice(-18)
  };
}

function applyDiceResult(state: PlayerState, dice: DiceResult): PlayerState {
  const diceTags: string[] = [dice.outcome];
  const flags = dice.outcome === "critical_success" ? ["critical_success"] : dice.outcome === "critical_failure" ? ["first_failure"] : [];

  return {
    ...state,
    diceHistory: [dice, ...state.diceHistory].slice(0, 12),
    tags: addUnique(state.tags, diceTags),
    flags: addUnique(state.flags, flags),
    hiddenStats: {
      ...state.hiddenStats,
      destiny: dice.outcome === "critical_success" ? state.hiddenStats.destiny + 2 : state.hiddenStats.destiny,
      sanity: dice.outcome === "critical_failure" ? Math.max(0, state.hiddenStats.sanity - 1) : state.hiddenStats.sanity
    }
  };
}

function rollDice(state: PlayerState, event: GameEvent, stat: StatKey, dc: number, reason: string): DiceResult {
  const roll = Math.floor(seededRandom(state.seed + state.turn * 173 + dc * 19 + event.id.length) * 20) + 1;
  const modifier = state.stats[stat] + getTagModifier(state, event);
  const finalValue = roll + modifier;

  return {
    eventId: event.id,
    roll,
    stat,
    modifier,
    finalValue,
    dc,
    outcome: getDiceOutcome(roll, finalValue, dc),
    reason
  };
}

function getDiceOutcome(roll: number, finalValue: number, dc: number): DiceOutcome {
  if (roll === 1) {
    return "critical_failure";
  }
  if (roll >= 19) {
    return "critical_success";
  }
  return finalValue >= dc ? "success" : "failure";
}

function pickAwakenedSequence(candidates: SequenceCandidate[], dice: DiceResult | undefined, state: PlayerState) {
  if (candidates.length === 0) {
    throw new Error("Cannot awaken sequence without candidates");
  }

  if (!dice) {
    return candidates[0];
  }

  if (dice.outcome === "critical_failure" && candidates[1]) {
    return candidates[1];
  }

  if (dice.outcome === "critical_success") {
    return candidates[0];
  }

  const offset = Math.floor(seededRandom(state.seed + state.turn * 211) * Math.min(3, candidates.length));
  return candidates[offset] ?? candidates[0];
}

function resolveAscension(state: PlayerState, dice?: DiceResult) {
  const sequenceProgress = state.currentSequence ? state.sequenceProgress[state.currentSequence] : 0;
  const memoryScore = state.eventMemory.length + Object.keys(state.npcMemory).length * 2 + Object.keys(state.inventory).length * 2;
  const stabilityScore = state.hiddenStats.sanity + state.hiddenStats.faith + state.stats.courage;
  const pressure = state.hiddenStats.obsession + state.hiddenStats.loneliness;
  const diceScore = dice ? dice.finalValue - dice.dc : 0;
  const total = sequenceProgress + memoryScore + stabilityScore + diceScore - pressure;

  if (state.flags.includes("critical_success") && total >= 35) {
    return "hidden_ending";
  }
  return total >= 28 ? "ascended" : "failed";
}

function advanceChapter(state: PlayerState): PlayerState {
  if (state.turn < CHAPTER_TURN_THRESHOLDS[state.chapter]) {
    return state;
  }

  const currentIndex = CHAPTERS.indexOf(state.chapter);
  const nextChapter = CHAPTERS[Math.min(currentIndex + 1, CHAPTERS.length - 1)];

  if (nextChapter === state.chapter) {
    return state;
  }

  return {
    ...state,
    chapter: nextChapter,
    flags: addUnique(state.flags, [`entered_${nextChapter.toLowerCase()}`])
  };
}

function matchesTrigger(trigger: TriggerCondition | undefined, state: PlayerState) {
  if (!trigger) {
    return true;
  }

  if (trigger.chapter && trigger.chapter !== state.chapter) {
    return false;
  }
  if (trigger.minTurn !== undefined && state.turn < trigger.minTurn) {
    return false;
  }
  if (trigger.maxTurn !== undefined && state.turn > trigger.maxTurn) {
    return false;
  }
  if (trigger.noCurrentSequence && state.currentSequence) {
    return false;
  }
  if (trigger.hasCurrentSequence && !state.currentSequence) {
    return false;
  }
  if (trigger.requiredTags?.some((tag) => !state.tags.includes(tag))) {
    return false;
  }
  if (trigger.requiredFlags?.some((flag) => !state.flags.includes(flag))) {
    return false;
  }

  return (
    meetsMinimums(state.stats, trigger.minStats) &&
    meetsMinimums(state.hiddenStats, trigger.minHiddenStats) &&
    meetsMinimums(state.worldAffinity, trigger.minWorldAffinity)
  );
}

function weightedPick(events: GameEvent[], state: PlayerState) {
  const weighted = events.map((event) => ({
    event,
    weight: Math.max(1, getEventWeight(event, state))
  }));
  const total = weighted.reduce((sum, item) => sum + item.weight, 0);
  let cursor = seededRandom(state.seed + state.turn * 97 + state.hiddenStats.luck * 31) * total;

  for (const item of weighted) {
    cursor -= item.weight;
    if (cursor <= 0) {
      return item.event;
    }
  }

  return weighted[0].event;
}

function getEventWeight(event: GameEvent, state: PlayerState) {
  const eventTags = flattenEventTags(event);
  const tagMatch = eventTags.filter((tag) => state.tags.includes(tag)).length * 2;
  const repeatedPenalty = state.seenEventIds.includes(event.id) ? 14 : 0;
  const worldBonus = event.tags.world.reduce((score, tag) => {
    if (tag === "reality") {
      return score + Math.max(0, 5 - state.worldAffinity.mystery);
    }
    if (tag === "unknown" || tag === "supernatural") {
      return score + state.worldAffinity.mystery;
    }
    if (tag === "coincidence" || tag === "dream") {
      return score + state.worldAffinity.fate;
    }
    return score;
  }, 0);
  const rarityBonus = event.rarity === "rare" ? 2 : event.rarity === "hidden" ? -2 : 0;

  return event.weight + tagMatch + worldBonus + rarityBonus - repeatedPenalty;
}

function getPersonalityAxis(personality: PersonalityProgress) {
  return {
    IE: personality.introversion - personality.extraversion,
    NS: personality.intuition - personality.sensing,
    TF: personality.thinking - personality.feeling,
    JP: personality.judging - personality.perceiving
  };
}

function getDominantWorldAffinity(worldAffinity: WorldAffinityBlock) {
  return Object.entries(worldAffinity).sort((a, b) => b[1] - a[1])[0]?.[0] as keyof WorldAffinityBlock;
}

function getHiddenSequenceBonus(state: PlayerState, sequence: SequenceId) {
  const hidden = state.hiddenStats;
  const stat = state.stats;

  const bonusBySequence: Partial<Record<SequenceId, number>> = {
    red_priest: stat.courage + hidden.luck,
    tyrant: stat.courage + stat.health,
    twilight_giant: stat.courage + hidden.faith,
    fool: hidden.destiny + hidden.luck,
    wheel_of_fortune: hidden.destiny + hidden.luck * 2,
    reader: stat.knowledge + stat.logic,
    hermit: stat.knowledge + hidden.curiosity,
    door: hidden.curiosity + stat.knowledge,
    secret_supplicant: hidden.faith + hidden.loneliness,
    chained: hidden.loneliness + hidden.obsession,
    sun: stat.emotion + hidden.faith,
    mother: stat.emotion + stat.health,
    moon: stat.emotion + hidden.curiosity,
    black_emperor: stat.logic + stat.charisma,
    justiciar: stat.logic + stat.courage
  };

  return bonusBySequence[sequence] ?? 0;
}

function getTagModifier(state: PlayerState, event: GameEvent) {
  const tagMemory = flattenEventTags(event).filter((tag) => state.tags.includes(tag)).length;
  const sequenceModifier = state.currentSequence ? Math.floor(state.sequenceProgress[state.currentSequence] / 20) : 0;
  return Math.min(8, tagMemory + sequenceModifier + state.hiddenStats.destiny);
}

function mergeNpcMemory(
  current: Record<string, NpcMemory>,
  patch: ChoiceEffects["npcMemory"],
  eventId: string
): Record<string, NpcMemory> {
  if (!patch) {
    return current;
  }

  const next = { ...current };
  for (const [npcTag, incoming] of Object.entries(patch)) {
    const existing = next[npcTag];
    next[npcTag] = {
      firstMetEventId: incoming.firstMetEventId ?? existing?.firstMetEventId ?? eventId,
      relationship: (existing?.relationship ?? 0) + (incoming.relationship ?? 0),
      affinity: incoming.affinity ?? existing?.affinity ?? "uncertain",
      keyEvents: addUnique(existing?.keyEvents ?? [], incoming.keyEvents ?? []),
      faction: incoming.faction ?? existing?.faction,
      canReappear: incoming.canReappear ?? existing?.canReappear ?? true
    };
  }
  return next;
}

function flattenEventTags(event: GameEvent) {
  return Object.values(event.tags).flat();
}

function clampHiddenStats(hiddenStats: HiddenStatBlock): HiddenStatBlock {
  const next = { ...hiddenStats };
  for (const key of HIDDEN_STAT_KEYS) {
    next[key] = Math.max(0, next[key]);
  }
  return next;
}

function applyNumericPatch<T extends Record<string, number>>(target: T, patch?: Partial<T>): T {
  if (!patch) {
    return target;
  }

  const next = { ...target };
  for (const [key, value] of Object.entries(patch)) {
    next[key as keyof T] = ((next[key as keyof T] ?? 0) + Number(value)) as T[keyof T];
  }
  return next;
}

function applyNumericPatchWithExisting<T extends Record<string, number>>(target: T, patch?: Partial<T>): T {
  return applyNumericPatch(target, patch);
}

function meetsMinimums<T extends Record<string, number>>(target: T, minimums?: Partial<T>) {
  if (!minimums) {
    return true;
  }
  return Object.entries(minimums).every(([key, value]) => target[key as keyof T] >= Number(value));
}

function createRecord<const T extends readonly string[]>(keys: T, value: number): Record<T[number], number> {
  return Object.fromEntries(keys.map((key) => [key, value])) as Record<T[number], number>;
}

function addUnique<T>(current: T[], additions: T[]) {
  return [...new Set([...current, ...additions])];
}

function seededRandom(seed: number) {
  const x = Math.sin(seed || 1) * 10000;
  return x - Math.floor(x);
}
