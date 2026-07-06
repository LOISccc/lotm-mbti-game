export const STAGES = ["ACADEMIC", "PERSONALITY", "PATH", "LIFE", "ASCENSION"] as const;
export type Stage = (typeof STAGES)[number];

export const STAT_KEYS = ["insight", "luck", "action", "stability"] as const;
export type StatKey = (typeof STAT_KEYS)[number];

export const HIDDEN_KEYS = ["danger", "entropy", "corruption"] as const;
export type HiddenKey = (typeof HIDDEN_KEYS)[number];

export const MBTI_SIGNALS = ["I", "E", "N", "S", "T", "F", "J", "P"] as const;
export type MbtiSignal = (typeof MBTI_SIGNALS)[number];

export const PATHS = [
  "Path of the Fool",
  "Path of the Door",
  "Path of the Error",
  "Path of the Visionary",
  "Path of the Warrior",
  "Path of the Reader",
  "Path of the Hunter",
  "Path of the Demoness"
] as const;
export type PathName = (typeof PATHS)[number];

export const TAGS = [
  "mystery",
  "knowledge",
  "danger",
  "ritual",
  "entity",
  "illusion",
  "corruption",
  "interaction"
] as const;
export type Tag = (typeof TAGS)[number];

export const EVENT_TYPES = ["atomic", "template", "key", "ascension"] as const;
export type EventType = (typeof EVENT_TYPES)[number];

export type ChoiceKey = "A" | "B";

export type PlayerStats = Record<StatKey, number>;
export type HiddenState = Record<HiddenKey, number>;

export type ChoiceEffects = {
  stats?: Partial<PlayerStats>;
  hidden?: Partial<HiddenState>;
  mbtiBias?: Partial<Record<MbtiSignal, number>>;
  pathAffinity?: Partial<Record<PathName, number>>;
};

export type Choice = {
  text: string;
  effects: ChoiceEffects;
};

export type Condition = Partial<Record<HiddenKey | StatKey, string | number>>;

export type DiceCheck = {
  stat: StatKey;
  dc: number;
};

export type GameEvent = {
  id: string;
  stage: Stage;
  type: EventType;
  text: string;
  tags: Tag[];
  pathAffinity?: Partial<Record<PathName, number>>;
  choices?: {
    A: Choice;
    B: Choice;
  };
  trigger?: Condition;
  check?: DiceCheck;
  success?: {
    text: string;
    effects: ChoiceEffects;
  };
  fail?: {
    text: string;
    effects: ChoiceEffects;
  };
};

export type PlayerState = {
  stage: Stage;
  turn: number;
  stats: PlayerStats;
  hidden: HiddenState;
  mbtiProgress: Record<MbtiSignal, number>;
  pathAffinity: Record<PathName, number>;
  seenEventIds: string[];
  preferredTags: Tag[];
  seed: number;
  ascensionResult?: "success" | "collapse";
};

export type DiceResult = {
  roll: number;
  total: number;
  dc: number;
  stat: StatKey;
  success: boolean;
};

export type GameLogEntry = {
  turn: number;
  eventId: string;
  stage: Stage;
  choice?: ChoiceKey;
  text: string;
  dice?: DiceResult;
};

export type EngineResult = {
  state: PlayerState;
  event: GameEvent;
  logEntry: GameLogEntry;
};
