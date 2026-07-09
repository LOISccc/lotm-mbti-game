import { CHOICE_KEYS, type Chapter, type GameEvent, type TagBucket } from "./types";

const TAG_BUCKETS: Array<keyof TagBucket> = [
  "scene",
  "behavior",
  "emotion",
  "world",
  "npc",
  "item",
  "event",
  "memory",
  "trigger",
  "sequence"
];

const REQUIRED_NON_EMPTY_BUCKETS: Array<keyof TagBucket> = ["scene", "behavior", "event"];

const WORLD_TAGS_BY_CHAPTER: Record<Chapter, Set<string>> = {
  GRADUATION: new Set(["reality", "coincidence"]),
  SUMMER: new Set(["reality", "coincidence", "dream", "memory", "unknown", "sequence"]),
  UNIVERSITY: new Set(["reality", "coincidence", "dream", "memory", "illusion", "prophecy", "ritual", "unknown", "supernatural", "sequence"]),
  SEQUENCE: new Set(["reality", "coincidence", "dream", "memory", "illusion", "prophecy", "ritual", "unknown", "supernatural", "sequence"]),
  ASCENSION: new Set(["dream", "memory", "prophecy", "ritual", "unknown", "supernatural", "sequence", "ascension"]),
  ENDING: new Set(["memory", "sequence", "ascension"])
};

const WORLD_TAGS_BY_STRANGE_LEVEL = {
  0: new Set(["reality"]),
  1: new Set(["coincidence", "memory", "dream"]),
  2: new Set(["unknown", "supernatural", "sequence", "ascension", "illusion", "prophecy", "ritual"])
} as const;

export function validateContentPool(events: GameEvent[]) {
  const errors: string[] = [];
  const ids = new Set<string>();

  for (const event of events) {
    validateEventSchema(event, ids, errors);
  }

  for (const event of events) {
    validateTags(event, errors);
    validateChapterWorldRules(event, errors);
    validateChoices(event, errors);
    validateFollowUps(event, ids, errors);
    validateDestinyEvents(event, errors);
  }

  if (errors.length > 0) {
    throw new Error(`Content Pool 校验失败:\n${errors.map((error) => `- ${error}`).join("\n")}`);
  }
}

function validateEventSchema(event: GameEvent, ids: Set<string>, errors: string[]) {
  if (!event.id || !isSnakeCase(event.id)) {
    errors.push(`${event.id || "(missing id)"}: id 必须是英文 snake_case`);
  }
  if (ids.has(event.id)) {
    errors.push(`${event.id}: id 重复`);
  }
  ids.add(event.id);

  if (!event.chapter) {
    errors.push(`${event.id}: 缺少 chapter`);
  }
  if (!event.rarity) {
    errors.push(`${event.id}: 缺少 rarity`);
  }
  if (!event.title || !event.scene || !event.narrative) {
    errors.push(`${event.id}: 必须包含 title、scene、narrative`);
  }
  if (event.narrative.length < 50 || event.narrative.length > 180) {
    errors.push(`${event.id}: narrative 建议保持 50 到 150 字左右，当前 ${event.narrative.length} 字`);
  }
  if (typeof event.weight !== "number" || event.weight <= 0) {
    errors.push(`${event.id}: weight 必须是正数`);
  }
  if (![0, 1, 2].includes(event.strangeLevel)) {
    errors.push(`${event.id}: strangeLevel 必须是 0、1 或 2`);
  }
  if (!Array.isArray(event.followUpEvents)) {
    errors.push(`${event.id}: followUpEvents 必须存在并为数组`);
  }
}

function validateTags(event: GameEvent, errors: string[]) {
  for (const bucket of TAG_BUCKETS) {
    if (!Array.isArray(event.tags[bucket])) {
      errors.push(`${event.id}: tags.${bucket} 必须是数组`);
      continue;
    }
    for (const tag of event.tags[bucket]) {
      if (!isSnakeCase(tag)) {
        errors.push(`${event.id}: tag "${tag}" 必须是英文 snake_case`);
      }
    }
  }

  for (const bucket of REQUIRED_NON_EMPTY_BUCKETS) {
    if (event.tags[bucket].length === 0) {
      errors.push(`${event.id}: tags.${bucket} 至少需要一个 Tag`);
    }
  }
}

function validateChapterWorldRules(event: GameEvent, errors: string[]) {
  const allowedWorldTags = WORLD_TAGS_BY_CHAPTER[event.chapter];
  for (const tag of event.tags.world) {
    if (!allowedWorldTags.has(tag)) {
      errors.push(`${event.id}: ${event.chapter} 章节不允许 world tag "${tag}"`);
    }
  }

  const allowedLevelTags = WORLD_TAGS_BY_STRANGE_LEVEL[event.strangeLevel];
  const hasMatchingWorldLevel = event.tags.world.some((tag) => allowedLevelTags.has(tag));
  if (!hasMatchingWorldLevel) {
    errors.push(`${event.id}: strangeLevel ${event.strangeLevel} 与 world_tags 不匹配`);
  }

  if (event.chapter === "GRADUATION" && (event.tags.world.includes("sequence") || event.tags.world.includes("ascension"))) {
    errors.push(`${event.id}: 第一章禁止 sequence 或 ascension`);
  }
}

function validateChoices(event: GameEvent, errors: string[]) {
  const choiceKeys = Object.keys(event.choices ?? {});
  for (const key of CHOICE_KEYS) {
    if (!choiceKeys.includes(key)) {
      errors.push(`${event.id}: 缺少选项 ${key}`);
    }
  }
  if (choiceKeys.length !== CHOICE_KEYS.length) {
    errors.push(`${event.id}: 必须恰好包含 A/B/C/D 四个选项`);
  }

  for (const key of CHOICE_KEYS) {
    const choice = event.choices[key];
    if (!choice?.text || !choice?.tone || !choice.effects) {
      errors.push(`${event.id}: 选项 ${key} 必须包含 text、tone、effects`);
    }
  }
}

function validateFollowUps(event: GameEvent, ids: Set<string>, errors: string[]) {
  for (const followUpId of event.followUpEvents) {
    if (!ids.has(followUpId)) {
      errors.push(`${event.id}: followUpEvents 引用了不存在的事件 "${followUpId}"`);
    }
  }
}

function validateDestinyEvents(event: GameEvent, errors: string[]) {
  if (event.rarity !== "destiny") {
    return;
  }

  const requiresDice = event.tags.event.includes("dice_check");
  if (requiresDice && !event.diceCheck?.visible) {
    errors.push(`${event.id}: destiny 骰检事件必须配置 visible diceCheck`);
  }
  if (event.id.includes("awakening") && !event.tags.event.includes("awakening")) {
    errors.push(`${event.id}: 序列开启事件必须包含 awakening event tag`);
  }
  if (event.id.includes("asc") && !event.tags.event.includes("ascension")) {
    errors.push(`${event.id}: 飞升事件必须包含 ascension event tag`);
  }
}

function isSnakeCase(value: string) {
  return /^[a-z][a-z0-9]*(?:_[a-z0-9]+)*$/.test(value);
}
