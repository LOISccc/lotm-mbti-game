export const CHAPTERS = ["GRADUATION", "SUMMER", "UNIVERSITY", "SEQUENCE", "ASCENSION", "ENDING"] as const;
export type Chapter = (typeof CHAPTERS)[number];

export const STAT_KEYS = ["knowledge", "logic", "emotion", "courage", "wealth", "health", "charisma"] as const;
export type StatKey = (typeof STAT_KEYS)[number];

export const HIDDEN_STAT_KEYS = ["curiosity", "obsession", "sanity", "luck", "destiny", "faith", "loneliness"] as const;
export type HiddenStatKey = (typeof HIDDEN_STAT_KEYS)[number];

export const PERSONALITY_SIGNALS = [
  "introversion",
  "extraversion",
  "intuition",
  "sensing",
  "thinking",
  "feeling",
  "judging",
  "perceiving"
] as const;
export type PersonalitySignal = (typeof PERSONALITY_SIGNALS)[number];

export const WORLD_AFFINITIES = ["science", "mystery", "fate"] as const;
export type WorldAffinity = (typeof WORLD_AFFINITIES)[number];

export const EVENT_RARITIES = ["common", "rare", "hidden", "destiny"] as const;
export type EventRarity = (typeof EVENT_RARITIES)[number];

export const CHOICE_KEYS = ["A", "B", "C", "D"] as const;
export type ChoiceKey = (typeof CHOICE_KEYS)[number];

export type StrangeLevel = 0 | 1 | 2;
export type DiceOutcome = "critical_failure" | "failure" | "success" | "critical_success";
export type AscensionResult = "ascended" | "failed" | "hidden_ending";

export type TagBucket = {
  scene: string[];
  behavior: string[];
  emotion: string[];
  world: string[];
  npc: string[];
  item: string[];
  event: string[];
  memory: string[];
  trigger: string[];
  sequence: string[];
};

export type StatBlock = Record<StatKey, number>;
export type HiddenStatBlock = Record<HiddenStatKey, number>;
export type PersonalityProgress = Record<PersonalitySignal, number>;
export type WorldAffinityBlock = Record<WorldAffinity, number>;

export type SequenceId =
  | "fool"
  | "door"
  | "error"
  | "visionary"
  | "sun"
  | "tyrant"
  | "reader"
  | "secret_supplicant"
  | "darkness"
  | "death"
  | "twilight_giant"
  | "demoness"
  | "red_priest"
  | "hermit"
  | "paragon"
  | "wheel_of_fortune"
  | "mother"
  | "moon"
  | "abyss"
  | "chained"
  | "black_emperor"
  | "justiciar";

export type SequenceProfile = {
  id: SequenceId;
  order: number;
  name: string;
  pathwayName: string;
  archetype: string;
  preferredMbti: string[];
  preferredAffinity: WorldAffinity[];
  preferredBehavior: string[];
  requiredTags: string[];
  specialTrigger?: string;
  weights: {
    IE: number;
    NS: number;
    TF: number;
    JP: number;
  };
};

export type SequenceCandidate = {
  id: SequenceId;
  name: string;
  pathwayName: string;
  score: number;
};

export type NpcMemory = {
  firstMetEventId: string;
  relationship: number;
  affinity: "friendly" | "distant" | "uncertain" | "hostile";
  keyEvents: string[];
  faction?: string;
  canReappear: boolean;
};

export type ItemMemory = {
  tag: string;
  description: string;
  firstSeenEventId: string;
  futureUsage: string[];
};

export type EventMemory = {
  eventId: string;
  title: string;
  choice: ChoiceKey;
  tags: string[];
  summary: string;
};

export type ChoiceEffects = {
  stats?: Partial<StatBlock>;
  hiddenStats?: Partial<HiddenStatBlock>;
  personality?: Partial<PersonalityProgress>;
  worldAffinity?: Partial<WorldAffinityBlock>;
  sequenceProgress?: Partial<Record<SequenceId, number>>;
  addTags?: string[];
  addFlags?: string[];
  addItems?: ItemMemory[];
  npcMemory?: Record<string, Partial<NpcMemory> & { firstMetEventId?: string }>;
  eventSummary?: string;
};

export type Choice = {
  text: string;
  tone: string;
  effects: ChoiceEffects;
};

export type DiceCheck = {
  stat: StatKey;
  dc: number;
  reason: string;
  visible: boolean;
};

export type TriggerCondition = {
  minTurn?: number;
  maxTurn?: number;
  requiredTags?: string[];
  requiredFlags?: string[];
  chapter?: Chapter;
  minStats?: Partial<StatBlock>;
  minHiddenStats?: Partial<HiddenStatBlock>;
  minWorldAffinity?: Partial<WorldAffinityBlock>;
  noCurrentSequence?: boolean;
  hasCurrentSequence?: boolean;
};

export type GameEvent = {
  id: string;
  chapter: Chapter;
  rarity: EventRarity;
  title: string;
  scene: string;
  narrative: string;
  tags: TagBucket;
  weight: number;
  strangeLevel: StrangeLevel;
  trigger?: TriggerCondition;
  diceCheck?: DiceCheck;
  choices: Record<ChoiceKey, Choice>;
  followUpEvents: string[];
};

export type PlayerState = {
  turn: number;
  chapter: Chapter;
  stats: StatBlock;
  hiddenStats: HiddenStatBlock;
  personality: PersonalityProgress;
  worldAffinity: WorldAffinityBlock;
  currentSequence?: SequenceId;
  sequenceCandidates: SequenceCandidate[];
  sequenceProgress: Record<SequenceId, number>;
  inventory: Record<string, ItemMemory>;
  npcMemory: Record<string, NpcMemory>;
  eventMemory: EventMemory[];
  tags: string[];
  flags: string[];
  seenEventIds: string[];
  diceHistory: DiceResult[];
  ascensionResult?: AscensionResult;
  seed: number;
};

export type DiceResult = {
  eventId: string;
  roll: number;
  stat: StatKey;
  modifier: number;
  finalValue: number;
  dc: number;
  outcome: DiceOutcome;
  reason: string;
};

export type GameLogEntry = {
  turn: number;
  chapter: Chapter;
  eventId: string;
  title: string;
  choice: ChoiceKey;
  summary: string;
  dice?: DiceResult;
  sequenceCandidates?: SequenceCandidate[];
  awakenedSequence?: SequenceCandidate;
  ascensionResult?: AscensionResult;
};

export type EngineResult = {
  state: PlayerState;
  event: GameEvent;
  logEntry: GameLogEntry;
};
