import type { GameEvent, PathName } from "./types";

export const PATHS: PathName[] = [
  "Path of the Fool",
  "Path of the Door",
  "Path of the Error",
  "Path of the Visionary",
  "Path of the Warrior",
  "Path of the Reader",
  "Path of the Hunter",
  "Path of the Demoness"
];

export const CONTENT_POOL: GameEvent[] = [
  {
    id: "a_001",
    stage: "ACADEMIC",
    type: "atomic",
    text: "理科训练让你习惯把异常拆成可测量的问题。",
    tags: ["knowledge"],
    choices: {
      A: { text: "建立变量表", effects: { stats: { insight: 2 } } },
      B: { text: "先做实验", effects: { stats: { action: 2 } } }
    }
  },
  {
    id: "a_002",
    stage: "ACADEMIC",
    type: "atomic",
    text: "一门冷门选修课要求你在混乱资料里找到论证线索。",
    tags: ["knowledge", "illusion"],
    choices: {
      A: { text: "追踪引用源头", effects: { stats: { insight: 1, stability: 1 } } },
      B: { text: "赌一个反直觉结论", effects: { stats: { luck: 2 } } }
    }
  },
  {
    id: "p_001",
    stage: "PERSONALITY",
    type: "atomic",
    text: "小组陷入争执时，所有人都看向你。",
    tags: ["interaction"],
    choices: {
      A: { text: "独自整理结论", effects: { mbtiBias: { I: 2, J: 1 } } },
      B: { text: "把讨论推向白板", effects: { mbtiBias: { E: 2, P: 1 } } }
    }
  },
  {
    id: "p_002",
    stage: "PERSONALITY",
    type: "atomic",
    text: "你梦见一座没有门牌的图书馆，醒来后细节仍然清晰。",
    tags: ["mystery", "knowledge"],
    choices: {
      A: { text: "记录象征结构", effects: { mbtiBias: { N: 2, T: 1 } } },
      B: { text: "回忆真实触感", effects: { mbtiBias: { S: 2, F: 1 } } }
    }
  },
  {
    id: "path_001",
    stage: "PATH",
    type: "template",
    text: "你开始意识到，某些选择会让世界用同一种语法回应你。",
    tags: ["illusion", "ritual"],
    choices: {
      A: {
        text: "向未知处开门",
        effects: {
          pathAffinity: { "Path of the Door": 2, "Path of the Fool": 1 },
          hidden: { entropy: 1 }
        }
      },
      B: {
        text: "给异常编号",
        effects: {
          pathAffinity: { "Path of the Reader": 2, "Path of the Error": 1 },
          stats: { insight: 1 }
        }
      }
    }
  },
  {
    id: "path_002",
    stage: "PATH",
    type: "template",
    text: "一个陌生账户向你发送了八个路径名称，没有解释。",
    tags: ["mystery", "interaction"],
    choices: {
      A: {
        text: "回复一个问题",
        effects: {
          pathAffinity: { "Path of the Visionary": 2, "Path of the Demoness": 1 },
          hidden: { danger: 1 }
        }
      },
      B: {
        text: "追踪来源",
        effects: {
          pathAffinity: { "Path of the Hunter": 2, "Path of the Warrior": 1 },
          stats: { action: 1 }
        }
      }
    }
  },
  {
    id: "l_001",
    stage: "LIFE",
    type: "atomic",
    text: "你收到一封无名信件，信纸边缘像被水浸过，却没有任何湿痕。",
    tags: ["mystery"],
    pathAffinity: { "Path of the Fool": 1, "Path of the Door": 1 },
    choices: {
      A: { text: "打开信件", effects: { hidden: { danger: 1 }, pathAffinity: { "Path of the Door": 1 } } },
      B: { text: "把它锁进抽屉", effects: { hidden: { entropy: 1 }, stats: { stability: 1 } } }
    }
  },
  {
    id: "l_002",
    stage: "LIFE",
    type: "template",
    text: "街角的旧书摊摆出一本写着你名字的索引册。",
    tags: ["knowledge", "illusion"],
    pathAffinity: { "Path of the Reader": 2, "Path of the Error": 1 },
    choices: {
      A: { text: "翻到最后一页", effects: { stats: { insight: 1 }, hidden: { corruption: 1 } } },
      B: { text: "买下但不阅读", effects: { stats: { stability: 1 }, pathAffinity: { "Path of the Reader": 1 } } }
    }
  },
  {
    id: "l_003",
    stage: "LIFE",
    type: "atomic",
    text: "你在电梯镜面里看见另一个自己晚了一拍才转身。",
    tags: ["illusion", "danger"],
    pathAffinity: { "Path of the Visionary": 2 },
    choices: {
      A: { text: "盯住镜中动作", effects: { hidden: { danger: 1 }, stats: { insight: 1 } } },
      B: { text: "按下所有楼层", effects: { hidden: { entropy: 1 }, stats: { luck: 1 } } }
    }
  },
  {
    id: "l_004",
    stage: "LIFE",
    type: "template",
    text: "一场临时集会在地下通道开始，参与者都戴着空白名牌。",
    tags: ["ritual", "interaction"],
    pathAffinity: { "Path of the Demoness": 1, "Path of the Warrior": 1 },
    choices: {
      A: { text: "加入队列", effects: { hidden: { corruption: 1 }, pathAffinity: { "Path of the Demoness": 1 } } },
      B: { text: "打断领誓人", effects: { stats: { action: 1 }, hidden: { danger: 1 }, pathAffinity: { "Path of the Warrior": 1 } } }
    }
  },
  {
    id: "l_005",
    stage: "LIFE",
    type: "atomic",
    text: "你发现每次改变路线，城市里的路灯都会熄灭一盏。",
    tags: ["entity", "mystery"],
    pathAffinity: { "Path of the Hunter": 2, "Path of the Fool": 1 },
    choices: {
      A: { text: "反向追踪熄灯顺序", effects: { stats: { action: 1 }, pathAffinity: { "Path of the Hunter": 1 } } },
      B: { text: "故意制造错误路线", effects: { hidden: { entropy: 1 }, pathAffinity: { "Path of the Error": 1 } } }
    }
  },
  {
    id: "k_001",
    stage: "LIFE",
    type: "key",
    text: "你感到被注视。下一秒，所有窗户都映出同一个影子。",
    tags: ["danger", "entity"],
    trigger: { danger: ">= 3" },
    check: { stat: "stability", dc: 14 },
    success: {
      text: "你稳住呼吸，影子从玻璃上退去。",
      effects: { hidden: { danger: -1 }, stats: { stability: 1 } }
    },
    fail: {
      text: "你移开视线的瞬间，它记住了你的名字。",
      effects: { hidden: { corruption: 2, danger: 1 } }
    }
  },
  {
    id: "k_002",
    stage: "LIFE",
    type: "key",
    text: "索引册自动翻页，停在一条尚未发生的事故记录上。",
    tags: ["knowledge", "corruption"],
    trigger: { corruption: ">= 3" },
    check: { stat: "insight", dc: 16 },
    success: {
      text: "你找出记录里的伪造字段，污染被迫显形。",
      effects: { hidden: { corruption: -2 }, stats: { insight: 1 } }
    },
    fail: {
      text: "你读懂了它，也因此成了它的一部分。",
      effects: { hidden: { corruption: 2, entropy: 1 } }
    }
  },
  {
    id: "asc_001",
    stage: "ASCENSION",
    type: "ascension",
    text: "门、书页、影子和错误同时向你收束。你必须决定是否越过认知边界。",
    tags: ["ritual", "knowledge", "corruption"],
    choices: {
      A: { text: "尝试飞升", effects: {} },
      B: { text: "保持人类尺度", effects: { hidden: { corruption: -1 }, stats: { stability: 1 } } }
    },
    success: {
      text: "你突破认知限制，路径不再支配你，而是成为语言。",
      effects: {}
    },
    fail: {
      text: "意识在过多解释中崩塌，只剩一串无法关闭的注释。",
      effects: {}
    }
  }
];
