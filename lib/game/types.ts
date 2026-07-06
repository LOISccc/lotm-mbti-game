export type Stage = "ACADEMIC" | "PERSONALITY" | "PATH" | "LIFE" | "ASCENSION";

export type StatKey = "insight" | "luck" | "action" | "stability";
export type HiddenKey = "danger" | "entropy" | "corruption";
export type MbtiSignal = "I" | "E" | "N" | "S" | "T" | "F" | "J" | "P";

export type PathName =
  | "Path of the Fool"
  | "Path of the Door"
  | "Path of the Error"
  | "Path of the Visionary"
  | "Path of the Warrior"
  | "Path of the Reader"
  | "Path of the Hunter"
  | "Path of the Demoness";

export type Tag =
  | "mystery"
  | "knowledge"
  | "danger"
  | "ritual"
  | "entity"
  | "illusion"
  | "corruption"
  | "interaction";

export type EventType = "atomic" | "template" | "key" | "ascension";

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
  choice?: "A" | "B";
  text: string;
  dice?: DiceResult;
};

export type EngineResult = {
  state: PlayerState;
  event: GameEvent;
  logEntry: GameLogEntry;
};
