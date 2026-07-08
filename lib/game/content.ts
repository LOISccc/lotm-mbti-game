import type { GameEvent, SequenceProfile } from "./types";

export const SEQUENCE_PROFILES: SequenceProfile[] = [
  {
    id: "fool",
    order: 1,
    name: "占卜家序列",
    pathwayName: "Fool",
    archetype: "INFP / INFJ",
    preferredMbti: ["INFP", "INFJ", "INTP"],
    preferredAffinity: ["fate"],
    preferredBehavior: ["observe", "record", "sacrifice", "help"],
    requiredTags: ["coincidence", "prophecy", "dream"],
    weights: { IE: 3, NS: 3, TF: 1, JP: 1 }
  },
  {
    id: "error",
    order: 2,
    name: "偷盗者序列",
    pathwayName: "Error",
    archetype: "ENTP / INTP",
    preferredMbti: ["ENTP", "INTP"],
    preferredAffinity: ["mystery"],
    preferredBehavior: ["lie", "risk", "create", "challenge"],
    requiredTags: ["unknown", "key", "mirror"],
    weights: { IE: 1, NS: 2, TF: 2, JP: -3 }
  },
  {
    id: "door",
    order: 3,
    name: "学徒序列",
    pathwayName: "Door",
    archetype: "INTP / INTJ",
    preferredMbti: ["INTP", "INTJ", "ENFP"],
    preferredAffinity: ["science", "mystery"],
    preferredBehavior: ["explore", "investigate", "study"],
    requiredTags: ["library", "book", "dream"],
    specialTrigger: "第一次接触未知知识",
    weights: { IE: 1, NS: 3, TF: 1, JP: -2 }
  },
  {
    id: "visionary",
    order: 4,
    name: "观众序列",
    pathwayName: "Visionary",
    archetype: "INFJ / INTJ",
    preferredMbti: ["INFJ", "INTJ"],
    preferredAffinity: ["mystery"],
    preferredBehavior: ["observe", "communicate", "plan"],
    requiredTags: ["conversation", "dream", "stranger"],
    weights: { IE: 2, NS: 2, TF: 1, JP: 3 }
  },
  {
    id: "sun",
    order: 5,
    name: "歌颂者序列",
    pathwayName: "Sun",
    archetype: "ENFJ / ESFJ",
    preferredMbti: ["ENFJ", "ESFJ"],
    preferredAffinity: ["fate"],
    preferredBehavior: ["help", "protect", "cooperate", "sacrifice"],
    requiredTags: ["hope", "trust", "saved_npc"],
    weights: { IE: -3, NS: 0, TF: -3, JP: 2 }
  },
  {
    id: "tyrant",
    order: 6,
    name: "水手序列",
    pathwayName: "Tyrant",
    archetype: "ESTP / ESTJ",
    preferredMbti: ["ESTP", "ESTJ", "ENTJ"],
    preferredAffinity: ["science"],
    preferredBehavior: ["challenge", "risk", "protect"],
    requiredTags: ["rain", "conflict", "travel"],
    weights: { IE: -3, NS: -3, TF: 2, JP: -1 }
  },
  {
    id: "reader",
    order: 7,
    name: "阅读者序列",
    pathwayName: "White Tower",
    archetype: "INTP / INTJ",
    preferredMbti: ["INTP", "INTJ"],
    preferredAffinity: ["science"],
    preferredBehavior: ["study", "record", "investigate"],
    requiredTags: ["library", "book", "research"],
    weights: { IE: 3, NS: 2, TF: 3, JP: 1 }
  },
  {
    id: "secret_supplicant",
    order: 8,
    name: "秘祈人序列",
    pathwayName: "Hanged Man",
    archetype: "INFP / INFJ",
    preferredMbti: ["INFP", "INFJ"],
    preferredAffinity: ["mystery", "fate"],
    preferredBehavior: ["sacrifice", "wait", "record"],
    requiredTags: ["unknown", "faith", "lonely"],
    weights: { IE: 3, NS: 3, TF: -2, JP: 1 }
  },
  {
    id: "darkness",
    order: 9,
    name: "不眠者序列",
    pathwayName: "Darkness",
    archetype: "ISTJ / INTJ",
    preferredMbti: ["ISTJ", "INTJ", "INFP"],
    preferredAffinity: ["mystery"],
    preferredBehavior: ["wait", "protect", "plan"],
    requiredTags: ["dream", "night", "guard"],
    weights: { IE: 2, NS: 1, TF: 2, JP: 3 }
  },
  {
    id: "death",
    order: 10,
    name: "收尸人序列",
    pathwayName: "Death",
    archetype: "ISTP / ISTJ",
    preferredMbti: ["ISTP", "ISTJ", "INTJ"],
    preferredAffinity: ["mystery"],
    preferredBehavior: ["observe", "record", "help"],
    requiredTags: ["hospital", "regret", "ending"],
    weights: { IE: 3, NS: -1, TF: 3, JP: 1 }
  },
  {
    id: "twilight_giant",
    order: 11,
    name: "战士序列",
    pathwayName: "Twilight Giant",
    archetype: "ESTJ / ISTJ",
    preferredMbti: ["ESTJ", "ISTJ"],
    preferredAffinity: ["fate"],
    preferredBehavior: ["protect", "challenge", "plan"],
    requiredTags: ["conflict", "protect", "critical_success"],
    weights: { IE: -1, NS: -3, TF: 2, JP: 3 }
  },
  {
    id: "demoness",
    order: 12,
    name: "刺客序列",
    pathwayName: "Demoness",
    archetype: "ISFP / ESTP",
    preferredMbti: ["ISFP", "ESTP", "ENFP"],
    preferredAffinity: ["mystery"],
    preferredBehavior: ["escape", "lie", "risk"],
    requiredTags: ["mask", "stranger", "conflict"],
    weights: { IE: 1, NS: -2, TF: -1, JP: -3 }
  },
  {
    id: "red_priest",
    order: 13,
    name: "猎人序列",
    pathwayName: "Red Priest",
    archetype: "ESTP / ENTP",
    preferredMbti: ["ESTP", "ENTP", "ENTJ"],
    preferredAffinity: ["fate"],
    preferredBehavior: ["challenge", "investigate", "risk"],
    requiredTags: ["street", "conflict", "travel"],
    weights: { IE: -3, NS: -1, TF: 2, JP: -2 }
  },
  {
    id: "hermit",
    order: 14,
    name: "窥秘人序列",
    pathwayName: "Hermit",
    archetype: "INTP / INFJ",
    preferredMbti: ["INTP", "INFJ"],
    preferredAffinity: ["science", "mystery"],
    preferredBehavior: ["investigate", "record", "study"],
    requiredTags: ["library", "unknown", "notebook"],
    weights: { IE: 3, NS: 3, TF: 2, JP: 0 }
  },
  {
    id: "paragon",
    order: 15,
    name: "通识者序列",
    pathwayName: "Paragon",
    archetype: "INTP / ENTP",
    preferredMbti: ["INTP", "ENTP", "INTJ"],
    preferredAffinity: ["science"],
    preferredBehavior: ["create", "study", "plan"],
    requiredTags: ["research", "create", "old_book"],
    weights: { IE: 1, NS: 1, TF: 3, JP: -1 }
  },
  {
    id: "wheel_of_fortune",
    order: 16,
    name: "怪物序列",
    pathwayName: "Wheel of Fortune",
    archetype: "INFP / ENFP",
    preferredMbti: ["INFP", "ENFP"],
    preferredAffinity: ["fate"],
    preferredBehavior: ["risk", "explore", "wait"],
    requiredTags: ["coincidence", "ticket", "rain"],
    weights: { IE: 1, NS: 3, TF: -1, JP: -3 }
  },
  {
    id: "mother",
    order: 17,
    name: "耕种者序列",
    pathwayName: "Mother",
    archetype: "ISFJ / ESFJ",
    preferredMbti: ["ISFJ", "ESFJ"],
    preferredAffinity: ["fate"],
    preferredBehavior: ["help", "protect", "cooperate"],
    requiredTags: ["hospital", "hope", "saved_npc"],
    weights: { IE: 0, NS: -2, TF: -3, JP: 2 }
  },
  {
    id: "moon",
    order: 18,
    name: "药师序列",
    pathwayName: "Moon",
    archetype: "ISFJ / ISTJ",
    preferredMbti: ["ISFJ", "ISTJ", "INFP"],
    preferredAffinity: ["mystery"],
    preferredBehavior: ["help", "study", "protect"],
    requiredTags: ["hospital", "medicine", "dream"],
    weights: { IE: 1, NS: -3, TF: -1, JP: 2 }
  },
  {
    id: "abyss",
    order: 19,
    name: "罪犯序列",
    pathwayName: "Abyss",
    archetype: "ESTP / ENTP",
    preferredMbti: ["ESTP", "ENTP"],
    preferredAffinity: ["mystery"],
    preferredBehavior: ["risk", "lie", "challenge"],
    requiredTags: ["conflict", "ignored_warning", "unknown"],
    weights: { IE: -2, NS: -1, TF: 1, JP: -3 }
  },
  {
    id: "chained",
    order: 20,
    name: "囚犯序列",
    pathwayName: "Chained",
    archetype: "ISFP / INFP",
    preferredMbti: ["ISFP", "INFP"],
    preferredAffinity: ["mystery"],
    preferredBehavior: ["wait", "sacrifice", "escape"],
    requiredTags: ["lonely", "regret", "low_sanity"],
    weights: { IE: 3, NS: 0, TF: -2, JP: 1 }
  },
  {
    id: "black_emperor",
    order: 21,
    name: "律师序列",
    pathwayName: "Black Emperor",
    archetype: "ENTJ / ENTP",
    preferredMbti: ["ENTJ", "ENTP"],
    preferredAffinity: ["science"],
    preferredBehavior: ["trade", "communicate", "plan", "lie"],
    requiredTags: ["conversation", "trade", "organization_member"],
    weights: { IE: -2, NS: 1, TF: 3, JP: 2 }
  },
  {
    id: "justiciar",
    order: 22,
    name: "仲裁人序列",
    pathwayName: "Justiciar",
    archetype: "ESTJ / ENTJ",
    preferredMbti: ["ESTJ", "ENTJ"],
    preferredAffinity: ["science"],
    preferredBehavior: ["plan", "protect", "challenge"],
    requiredTags: ["teacher", "conflict", "rule"],
    weights: { IE: -2, NS: -1, TF: 3, JP: 3 }
  }
];

const emptySequenceTags: string[] = [];

export const CONTENT_POOL: GameEvent[] = [
  {
    id: "grad_001_gate",
    chapter: "GRADUATION",
    rarity: "common",
    title: "校门外的等待",
    scene: "高考结束后的校门口",
    narrative:
      "我从考场出来时，校门口挤满了人。有人大声喊我的名字，有人把花塞进怀里。一个同班同学站在人群边缘，像是想说话，又像是不知道该不该靠近。我手里的准考证被汗浸软，忽然觉得这张纸比任何告别都轻。",
    tags: {
      scene: ["campus", "street"],
      behavior: ["communicate", "observe", "help", "escape"],
      emotion: ["nostalgia", "confusion"],
      world: ["reality"],
      npc: ["classmate"],
      item: ["admission_ticket"],
      event: ["conversation", "choice"],
      memory: ["first_choice"],
      trigger: [],
      sequence: emptySequenceTags
    },
    weight: 12,
    strangeLevel: 0,
    choices: {
      A: {
        text: "走过去问同学是不是有事",
        tone: "主动交流",
        effects: {
          stats: { charisma: 1, emotion: 1 },
          personality: { extraversion: 2, feeling: 1 },
          worldAffinity: { fate: 1 },
          addTags: ["classmate", "communicate"],
          eventSummary: "我主动走向了校门口犹豫的同学。"
        }
      },
      B: {
        text: "先站在原地观察人群",
        tone: "保持距离",
        effects: {
          stats: { logic: 1 },
          hiddenStats: { curiosity: 1 },
          personality: { introversion: 2, intuition: 1 },
          worldAffinity: { science: 1 },
          addTags: ["observe"],
          eventSummary: "我在人群边缘停留，先观察每个人的反应。"
        }
      },
      C: {
        text: "把准考证仔细收好再离开",
        tone: "维持秩序",
        effects: {
          stats: { knowledge: 1 },
          personality: { judging: 2, sensing: 1 },
          worldAffinity: { science: 1 },
          addTags: ["plan", "admission_ticket"],
          eventSummary: "我把准考证收好，像是在给过去做一个标记。"
        }
      },
      D: {
        text: "避开人群，从侧门回家",
        tone: "独自离开",
        effects: {
          hiddenStats: { loneliness: 1, sanity: 1 },
          personality: { introversion: 2, perceiving: 1 },
          addTags: ["escape", "lonely"],
          eventSummary: "我没有告别，从侧门离开了学校。"
        }
      }
    },
    followUpEvents: ["summer_001_rain_bookstore"]
  },
  {
    id: "grad_002_old_man",
    chapter: "GRADUATION",
    rarity: "rare",
    title: "路边的老人",
    scene: "回家路上的公交站",
    narrative:
      "公交站旁有位老人坐在长椅上，手里攥着一枚很旧的硬币。他问我附近有没有能打电话的地方，声音很轻。车快到了，司机已经把门打开。老人看起来并不危险，只是像忘记了自己为什么来到这里。",
    tags: {
      scene: ["street", "bus"],
      behavior: ["help", "ignore", "wait", "investigate"],
      emotion: ["trust", "anxiety"],
      world: ["reality", "coincidence"],
      npc: ["old_man"],
      item: ["coin"],
      event: ["encounter", "choice"],
      memory: ["met_old_man"],
      trigger: [],
      sequence: emptySequenceTags
    },
    weight: 9,
    strangeLevel: 1,
    choices: {
      A: {
        text: "陪老人去找电话",
        tone: "帮助陌生人",
        effects: {
          stats: { emotion: 2, charisma: 1 },
          hiddenStats: { destiny: 1, faith: 1 },
          personality: { feeling: 2, judging: 1 },
          worldAffinity: { fate: 2 },
          addTags: ["help", "old_man", "saved_npc"],
          npcMemory: {
            old_man: {
              firstMetEventId: "grad_002_old_man",
              relationship: 2,
              affinity: "friendly",
              keyEvents: ["met_at_bus_stop"],
              canReappear: true
            }
          },
          eventSummary: "我错过了车，陪一位老人去找电话。"
        }
      },
      B: {
        text: "问清楚硬币从哪里来",
        tone: "追问细节",
        effects: {
          stats: { logic: 1, knowledge: 1 },
          hiddenStats: { curiosity: 2 },
          personality: { thinking: 2, intuition: 1 },
          worldAffinity: { mystery: 1, science: 1 },
          addTags: ["investigate", "old_man", "coin"],
          eventSummary: "我没有立刻帮忙，而是追问那枚旧硬币的来历。"
        }
      },
      C: {
        text: "把自己的零钱递给他",
        tone: "快速处理",
        effects: {
          stats: { wealth: -1, emotion: 1 },
          personality: { sensing: 1, feeling: 1, perceiving: 1 },
          worldAffinity: { fate: 1 },
          addTags: ["help", "coin"],
          eventSummary: "我把零钱递给老人，然后上了车。"
        }
      },
      D: {
        text: "上车，不介入陌生人的事",
        tone: "保持边界",
        effects: {
          stats: { logic: 1 },
          hiddenStats: { loneliness: 1 },
          personality: { introversion: 1, thinking: 1 },
          addTags: ["ignore", "ignored_warning"],
          eventSummary: "我上了车，没有介入老人的请求。"
        }
      }
    },
    followUpEvents: ["summer_003_old_coin"]
  },
  {
    id: "grad_destiny_first_dice",
    chapter: "GRADUATION",
    rarity: "destiny",
    title: "第一次骰检",
    scene: "回家后的夜晚",
    narrative:
      "夜里，我把今天带回来的东西放在桌上。手机屏幕亮了一下，没有新消息。窗外有人经过，脚步声停在楼下，又很快远去。我忽然意识到，今天的某个选择不会停在今天。",
    tags: {
      scene: ["home"],
      behavior: ["record", "wait", "plan", "risk"],
      emotion: ["confusion", "nostalgia"],
      world: ["coincidence"],
      npc: [],
      item: ["admission_ticket", "coin"],
      event: ["dice_check"],
      memory: ["first_failure", "critical_success"],
      trigger: ["first_dice"],
      sequence: emptySequenceTags
    },
    weight: 100,
    strangeLevel: 1,
    trigger: { chapter: "GRADUATION", minTurn: 3 },
    diceCheck: { stat: "courage", dc: 10, reason: "第一次感到世界回应选择", visible: true },
    choices: {
      A: {
        text: "把今天发生的事写下来",
        tone: "记录记忆",
        effects: {
          stats: { knowledge: 1 },
          hiddenStats: { curiosity: 1, sanity: 1 },
          personality: { introversion: 1, judging: 1 },
          worldAffinity: { science: 1 },
          addTags: ["record", "notebook"],
          eventSummary: "我把高考结束这天写进了笔记。"
        }
      },
      B: {
        text: "给同学发消息确认平安",
        tone: "连接他人",
        effects: {
          stats: { emotion: 1, charisma: 1 },
          personality: { extraversion: 1, feeling: 1 },
          worldAffinity: { fate: 1 },
          addTags: ["communicate", "classmate"],
          eventSummary: "我主动给同学发了消息。"
        }
      },
      C: {
        text: "检查门窗后睡觉",
        tone: "现实防备",
        effects: {
          stats: { health: 1, logic: 1 },
          personality: { sensing: 1, judging: 1 },
          worldAffinity: { science: 1 },
          addTags: ["plan", "home"],
          eventSummary: "我检查了门窗，把一切归为普通的一天。"
        }
      },
      D: {
        text: "盯着窗外等脚步声再出现",
        tone: "靠近异常",
        effects: {
          hiddenStats: { curiosity: 2, obsession: 1 },
          personality: { intuition: 2, perceiving: 1 },
          worldAffinity: { mystery: 2 },
          addTags: ["wait", "unknown"],
          eventSummary: "我没有睡，等着楼下的脚步声再次出现。"
        }
      }
    },
    followUpEvents: ["summer_001_rain_bookstore"]
  },
  {
    id: "summer_001_rain_bookstore",
    chapter: "SUMMER",
    rarity: "common",
    title: "雨里的旧书店",
    scene: "暑假的一个雨天",
    narrative:
      "雨下得很突然。我钻进街角一家旧书店，门铃响得像很久没有被使用。老板没有抬头，只说湿伞放门口。我在靠窗的架子上看到一本没有书名的旧书，封面夹着一张泛黄的车票。",
    tags: {
      scene: ["bookstore", "street"],
      behavior: ["study", "explore", "trade", "ignore"],
      emotion: ["curious", "calm"],
      world: ["dream", "unknown"],
      npc: ["bookstore_owner"],
      item: ["old_book", "ticket"],
      event: ["discovery", "choice"],
      memory: ["opened_book", "kept_item"],
      trigger: ["rain"],
      sequence: emptySequenceTags
    },
    weight: 14,
    strangeLevel: 1,
    choices: {
      A: {
        text: "翻开那本没有书名的旧书",
        tone: "接触未知",
        effects: {
          stats: { knowledge: 2 },
          hiddenStats: { curiosity: 2, obsession: 1 },
          personality: { intuition: 2, thinking: 1 },
          worldAffinity: { mystery: 2 },
          addTags: ["old_book", "opened_book", "book"],
          addItems: [
            {
              tag: "old_book",
              description: "没有书名的旧书，夹着一张车票。",
              firstSeenEventId: "summer_001_rain_bookstore",
              futureUsage: ["sequence_awakening", "university_research"]
            }
          ],
          eventSummary: "我翻开了旧书，看到一张泛黄车票。"
        }
      },
      B: {
        text: "先问老板这本书的价格",
        tone: "交易与规则",
        effects: {
          stats: { wealth: -1, charisma: 1, logic: 1 },
          personality: { extraversion: 1, thinking: 1, judging: 1 },
          worldAffinity: { science: 1 },
          addTags: ["trade", "bookstore_owner", "old_book"],
          eventSummary: "我没有急着翻书，而是先问老板价格。"
        }
      },
      C: {
        text: "记下书的位置，假装没看见",
        tone: "延迟行动",
        effects: {
          stats: { logic: 1 },
          hiddenStats: { sanity: 1, curiosity: 1 },
          personality: { introversion: 1, judging: 2 },
          addTags: ["record", "wait", "old_book"],
          eventSummary: "我记住了旧书的位置，却没有立刻碰它。"
        }
      },
      D: {
        text: "抽出那张车票带走",
        tone: "越界尝试",
        effects: {
          hiddenStats: { luck: 1, destiny: 1, obsession: 1 },
          personality: { perceiving: 2, thinking: 1 },
          worldAffinity: { fate: 1, mystery: 1 },
          addTags: ["risk", "ticket", "kept_item"],
          addItems: [
            {
              tag: "ticket",
              description: "一张泛黄车票，没有目的地。",
              firstSeenEventId: "summer_001_rain_bookstore",
              futureUsage: ["hidden_location", "sequence_awakening"]
            }
          ],
          eventSummary: "我从旧书里抽走了没有目的地的车票。"
        }
      }
    },
    followUpEvents: ["summer_002_library_message", "univ_002_professor_index"]
  },
  {
    id: "summer_002_library_message",
    chapter: "SUMMER",
    rarity: "common",
    title: "图书馆里的匿名消息",
    scene: "暑假的一个下午",
    narrative:
      "我在图书馆避暑时，电脑右下角弹出一条匿名消息：别坐在第三排。图书馆很安静，第三排只有一个背着黑包的人。他没有看我，却把桌上的笔记本往旁边推了推，像是在给谁让位置。",
    tags: {
      scene: ["library"],
      behavior: ["investigate", "ignore", "communicate", "escape"],
      emotion: ["anxiety", "curious"],
      world: ["unknown", "coincidence"],
      npc: ["stranger", "librarian"],
      item: ["notebook"],
      event: ["encounter", "investigation"],
      memory: ["ignored_warning", "kept_item"],
      trigger: ["anonymous_message"],
      sequence: emptySequenceTags
    },
    weight: 12,
    strangeLevel: 1,
    choices: {
      A: {
        text: "坐到第三排旁边",
        tone: "主动接近",
        effects: {
          stats: { courage: 1 },
          hiddenStats: { curiosity: 2, sanity: -1 },
          personality: { intuition: 1, perceiving: 1 },
          worldAffinity: { mystery: 2 },
          addTags: ["risk", "stranger", "unknown"],
          eventSummary: "我无视匿名消息，坐到了第三排旁边。"
        }
      },
      B: {
        text: "找管理员确认电脑是否中毒",
        tone: "现实求证",
        effects: {
          stats: { logic: 2, knowledge: 1 },
          personality: { thinking: 2, sensing: 1 },
          worldAffinity: { science: 2 },
          addTags: ["investigate", "librarian"],
          eventSummary: "我把匿名消息当作技术问题，去找管理员确认。"
        }
      },
      C: {
        text: "假装离开，在书架后观察",
        tone: "隐蔽观察",
        effects: {
          stats: { logic: 1 },
          hiddenStats: { curiosity: 1 },
          personality: { introversion: 2, judging: 1 },
          worldAffinity: { science: 1, mystery: 1 },
          addTags: ["observe", "library", "stranger"],
          eventSummary: "我离开座位，却躲在书架后继续观察。"
        }
      },
      D: {
        text: "关掉电脑，立刻离开",
        tone: "拒绝卷入",
        effects: {
          stats: { health: 1 },
          hiddenStats: { sanity: 1, loneliness: 1 },
          personality: { sensing: 1, introversion: 1 },
          addTags: ["escape", "ignored_warning"],
          eventSummary: "我关掉电脑，没有继续追查匿名消息。"
        }
      }
    },
    followUpEvents: ["summer_hidden_notebook"]
  },
  {
    id: "summer_hidden_notebook",
    chapter: "SUMMER",
    rarity: "hidden",
    title: "被推来的笔记本",
    scene: "图书馆的闭馆前",
    narrative:
      "闭馆音乐响起时，我发现那本被推开的笔记本留在桌上。第一页只有一句话：不要把第一次看见的东西当成真相。后面几页被撕掉，纸屑里有一小块像是旧车票的边角。",
    tags: {
      scene: ["library"],
      behavior: ["record", "investigate", "ignore", "risk"],
      emotion: ["confusion", "curious"],
      world: ["memory", "unknown"],
      npc: ["stranger"],
      item: ["notebook", "ticket"],
      event: ["discovery"],
      memory: ["kept_item", "opened_book"],
      trigger: ["has_old_book", "high_mystery"],
      sequence: emptySequenceTags
    },
    weight: 8,
    strangeLevel: 1,
    trigger: { requiredTags: ["stranger"], minWorldAffinity: { mystery: 2 } },
    choices: {
      A: {
        text: "把笔记本带走",
        tone: "保存线索",
        effects: {
          stats: { knowledge: 1 },
          hiddenStats: { obsession: 1 },
          personality: { judging: 1, intuition: 1 },
          worldAffinity: { mystery: 1 },
          addTags: ["notebook", "kept_item"],
          addItems: [
            {
              tag: "notebook",
              description: "陌生人留下的笔记本，几页被撕掉。",
              firstSeenEventId: "summer_hidden_notebook",
              futureUsage: ["university_research", "sequence_awakening"]
            }
          ],
          eventSummary: "我带走了陌生人留下的笔记本。"
        }
      },
      B: {
        text: "只拍照，不拿走",
        tone: "谨慎留证",
        effects: {
          stats: { logic: 1 },
          hiddenStats: { sanity: 1 },
          personality: { thinking: 1, judging: 1 },
          worldAffinity: { science: 1 },
          addTags: ["record", "notebook"],
          eventSummary: "我拍下笔记内容，没有带走它。"
        }
      },
      C: {
        text: "交给管理员",
        tone: "交还秩序",
        effects: {
          stats: { charisma: 1 },
          personality: { feeling: 1, judging: 1 },
          worldAffinity: { fate: 1 },
          addTags: ["librarian", "cooperate"],
          eventSummary: "我把笔记本交给了图书馆管理员。"
        }
      },
      D: {
        text: "撕下第一页自己保留",
        tone: "隐秘越界",
        effects: {
          hiddenStats: { destiny: 1, obsession: 2 },
          personality: { perceiving: 2, thinking: 1 },
          worldAffinity: { mystery: 2 },
          addTags: ["lie", "notebook", "ignored_warning"],
          eventSummary: "我撕下了笔记本第一页。"
        }
      }
    },
    followUpEvents: ["summer_destiny_awakening"]
  },
  {
    id: "summer_destiny_awakening",
    chapter: "SUMMER",
    rarity: "destiny",
    title: "第一次序列开启",
    scene: "暑假的某个夜晚",
    narrative:
      "我醒来时，桌上的物品被摆成一条并不对称的线。准考证、车票、旧书、笔记本，或者只是它们留下的空位。窗外没有风，纸页却自己翻到中间。我没有听见声音，却清楚地知道：世界正在等待我回应。",
    tags: {
      scene: ["home"],
      behavior: ["record", "risk", "wait", "sacrifice"],
      emotion: ["confusion", "fear", "hope"],
      world: ["dream", "unknown", "sequence"],
      npc: ["stranger", "old_man"],
      item: ["old_book", "ticket", "notebook"],
      event: ["awakening", "dice_check"],
      memory: ["opened_book", "kept_item", "first_failure", "critical_success"],
      trigger: ["sequence_awakening"],
      sequence: ["sequence"]
    },
    weight: 100,
    strangeLevel: 2,
    trigger: { chapter: "SUMMER", minTurn: 7, noCurrentSequence: true },
    diceCheck: { stat: "knowledge", dc: 12, reason: "序列开启时的稳定性检定", visible: true },
    choices: {
      A: {
        text: "按笔记里的句子重新排列物品",
        tone: "遵循线索",
        effects: {
          stats: { knowledge: 1, logic: 1 },
          hiddenStats: { obsession: 1 },
          personality: { judging: 2, thinking: 1 },
          worldAffinity: { science: 1, mystery: 1 },
          addTags: ["record", "sequence", "old_book"],
          eventSummary: "我按笔记里的句子重新排列了物品。"
        }
      },
      B: {
        text: "闭上眼，回忆所有巧合",
        tone: "接受命运",
        effects: {
          hiddenStats: { destiny: 2, faith: 1 },
          personality: { intuition: 2, feeling: 1 },
          worldAffinity: { fate: 2 },
          addTags: ["coincidence", "dream", "sequence"],
          eventSummary: "我闭上眼，把所有巧合串成了一条线。"
        }
      },
      C: {
        text: "把东西全部收进抽屉",
        tone: "保持现实",
        effects: {
          stats: { health: 1, logic: 1 },
          hiddenStats: { sanity: 2 },
          personality: { sensing: 2, judging: 1 },
          worldAffinity: { science: 2 },
          addTags: ["plan", "sequence"],
          eventSummary: "我把所有东西收进抽屉，试图让房间恢复正常。"
        }
      },
      D: {
        text: "撕下一页纸，写下自己的名字",
        tone: "主动交换",
        effects: {
          hiddenStats: { destiny: 2, sanity: -1, obsession: 1 },
          stats: { courage: 1 },
          personality: { perceiving: 2, intuition: 1 },
          worldAffinity: { mystery: 2, fate: 1 },
          addTags: ["risk", "sacrifice", "sequence"],
          eventSummary: "我撕下一页纸，写下自己的名字。"
        }
      }
    },
    followUpEvents: ["univ_001_roommate"]
  },
  {
    id: "univ_001_roommate",
    chapter: "UNIVERSITY",
    rarity: "common",
    title: "新寝室的第一晚",
    scene: "大学宿舍",
    narrative:
      "寝室里每个人都在整理行李。有人提议晚上一起吃饭，有人已经戴上耳机。我把东西放到床位下方，发现桌面里侧刻着一串很浅的数字。数字不完整，像被人故意磨掉了一半。",
    tags: {
      scene: ["dormitory", "campus"],
      behavior: ["communicate", "record", "ignore", "investigate"],
      emotion: ["hope", "confusion"],
      world: ["reality", "memory"],
      npc: ["roommate"],
      item: ["notebook"],
      event: ["conversation", "discovery"],
      memory: ["entered_campus"],
      trigger: [],
      sequence: emptySequenceTags
    },
    weight: 14,
    strangeLevel: 1,
    choices: {
      A: {
        text: "接受室友的晚饭邀请",
        tone: "建立关系",
        effects: {
          stats: { charisma: 2, emotion: 1 },
          personality: { extraversion: 2, feeling: 1 },
          worldAffinity: { fate: 1 },
          addTags: ["roommate", "communicate"],
          npcMemory: {
            roommate: {
              firstMetEventId: "univ_001_roommate",
              relationship: 2,
              affinity: "friendly",
              keyEvents: ["first_dinner"],
              canReappear: true
            }
          },
          eventSummary: "我接受了室友的晚饭邀请。"
        }
      },
      B: {
        text: "先把桌上的数字抄下来",
        tone: "记录异常",
        effects: {
          stats: { knowledge: 1, logic: 1 },
          hiddenStats: { curiosity: 1 },
          personality: { introversion: 1, thinking: 1, judging: 1 },
          worldAffinity: { science: 1, mystery: 1 },
          addTags: ["record", "dormitory"],
          eventSummary: "我先把桌面里侧的数字抄了下来。"
        }
      },
      C: {
        text: "问室友有没有听过这些数字",
        tone: "共享线索",
        effects: {
          stats: { charisma: 1, logic: 1 },
          personality: { extraversion: 1, thinking: 1 },
          worldAffinity: { science: 1 },
          addTags: ["communicate", "roommate"],
          eventSummary: "我把数字告诉了室友，试探他们的反应。"
        }
      },
      D: {
        text: "把那串数字磨得更干净",
        tone: "切断痕迹",
        effects: {
          hiddenStats: { sanity: 1, loneliness: 1 },
          personality: { sensing: 1, perceiving: 1 },
          addTags: ["ignore", "escape"],
          eventSummary: "我把桌上的数字磨掉，像什么都没发生。"
        }
      }
    },
    followUpEvents: ["univ_002_professor_index"]
  },
  {
    id: "univ_002_professor_index",
    chapter: "UNIVERSITY",
    rarity: "rare",
    title: "教授的索引卡",
    scene: "大学图书馆的研究室",
    narrative:
      "一位教授在研究室门口叫住我，说我借过的书里夹着他的索引卡。我确定自己没见过他。卡片背面写着一个地点：旧城区博物馆。教授把卡递给我时，没有问我愿不愿意去。",
    tags: {
      scene: ["library", "campus"],
      behavior: ["study", "investigate", "communicate", "wait"],
      emotion: ["curious", "anxiety"],
      world: ["unknown", "supernatural"],
      npc: ["professor", "researcher"],
      item: ["card", "old_book"],
      event: ["encounter", "investigation"],
      memory: ["opened_book", "entered_campus"],
      trigger: ["has_old_book"],
      sequence: ["sequence"]
    },
    weight: 10,
    strangeLevel: 2,
    trigger: { minTurn: 9, hasCurrentSequence: true },
    choices: {
      A: {
        text: "接受索引卡，去旧城区博物馆",
        tone: "追索未知",
        effects: {
          stats: { knowledge: 2, courage: 1 },
          hiddenStats: { curiosity: 2 },
          personality: { intuition: 1, thinking: 1, perceiving: 1 },
          worldAffinity: { mystery: 2 },
          addTags: ["museum", "investigate", "professor"],
          eventSummary: "我接过索引卡，决定去旧城区博物馆。"
        }
      },
      B: {
        text: "要求教授说明他怎么知道我",
        tone: "理性追问",
        effects: {
          stats: { logic: 2, charisma: 1 },
          personality: { thinking: 2, judging: 1 },
          worldAffinity: { science: 2 },
          addTags: ["communicate", "professor", "rule"],
          eventSummary: "我要求教授解释他为什么认识我。"
        }
      },
      C: {
        text: "把卡片交给图书馆前台",
        tone: "拒绝私下接触",
        effects: {
          stats: { health: 1, logic: 1 },
          hiddenStats: { sanity: 1 },
          personality: { sensing: 1, judging: 1 },
          worldAffinity: { science: 1 },
          addTags: ["cooperate", "librarian"],
          eventSummary: "我把索引卡交给了图书馆前台。"
        }
      },
      D: {
        text: "收下卡片，但不按地点行动",
        tone: "保留选择",
        effects: {
          hiddenStats: { luck: 1, destiny: 1 },
          personality: { perceiving: 2, introversion: 1 },
          worldAffinity: { fate: 1 },
          addTags: ["wait", "card"],
          eventSummary: "我收下索引卡，却没有立刻照做。"
        }
      }
    },
    followUpEvents: ["seq_001_growth"]
  },
  {
    id: "seq_001_growth",
    chapter: "SEQUENCE",
    rarity: "common",
    title: "路线开始回望我",
    scene: "旧城区与校园之间",
    narrative:
      "从某一刻开始，我发现自己不再只是做选择。某些选择会变得更容易，某些念头像被提前放进脑中。城市仍然普通，课程仍然继续，但我知道，已经开启的那条路正在用自己的方式理解我。",
    tags: {
      scene: ["street", "campus"],
      behavior: ["study", "protect", "risk", "record"],
      emotion: ["calm", "fear", "hope"],
      world: ["sequence", "supernatural"],
      npc: ["roommate", "professor", "stranger"],
      item: ["old_book", "notebook", "card"],
      event: ["choice", "discovery"],
      memory: ["sequence_growth"],
      trigger: ["has_sequence"],
      sequence: ["sequence"]
    },
    weight: 14,
    strangeLevel: 2,
    trigger: { hasCurrentSequence: true },
    choices: {
      A: {
        text: "继续追查所有线索",
        tone: "深化认知",
        effects: {
          stats: { knowledge: 2, logic: 1 },
          hiddenStats: { obsession: 1 },
          personality: { thinking: 1, intuition: 1 },
          worldAffinity: { science: 1, mystery: 1 },
          addTags: ["investigate", "sequence_growth"],
          eventSummary: "我继续追查所有线索，让已开启的路线变得更清晰。"
        }
      },
      B: {
        text: "优先保护身边人不被卷入",
        tone: "守护关系",
        effects: {
          stats: { emotion: 2, courage: 1 },
          hiddenStats: { faith: 1 },
          personality: { feeling: 2, judging: 1 },
          worldAffinity: { fate: 1 },
          addTags: ["protect", "roommate", "sequence_growth"],
          eventSummary: "我决定先保护身边人，不让他们被卷进来。"
        }
      },
      C: {
        text: "把经历整理成可验证的档案",
        tone: "建立系统",
        effects: {
          stats: { logic: 2, knowledge: 1 },
          personality: { judging: 2, thinking: 1 },
          worldAffinity: { science: 2 },
          addTags: ["record", "research", "sequence_growth"],
          eventSummary: "我把所有经历整理成可验证的档案。"
        }
      },
      D: {
        text: "主动制造一次小小的异常",
        tone: "测试边界",
        effects: {
          hiddenStats: { luck: 1, sanity: -1, destiny: 1 },
          personality: { perceiving: 2, intuition: 1 },
          worldAffinity: { mystery: 2 },
          addTags: ["risk", "unknown", "sequence_growth"],
          eventSummary: "我主动制造了一次小小的异常，测试世界的边界。"
        }
      }
    },
    followUpEvents: ["asc_destiny_final"]
  },
  {
    id: "asc_destiny_final",
    chapter: "ASCENSION",
    rarity: "destiny",
    title: "飞升判定",
    scene: "记忆尽头的房间",
    narrative:
      "所有曾经被我保存、忽略、帮助、拒绝的东西都回到这里。它们不是证据，也不是审判，只是我走过的路。已经开启的序列沉默地等待着。我知道，这一次不是选择它，而是承认自己已经成为了什么。",
    tags: {
      scene: ["home", "dream"],
      behavior: ["record", "sacrifice", "plan", "risk"],
      emotion: ["hope", "regret", "fear"],
      world: ["ascension", "sequence", "supernatural"],
      npc: ["old_man", "roommate", "professor", "stranger"],
      item: ["old_book", "ticket", "notebook", "card"],
      event: ["ascension", "ending", "dice_check"],
      memory: ["critical_success", "first_failure", "saved_npc", "ignored_warning"],
      trigger: ["ascension"],
      sequence: ["ascension"]
    },
    weight: 100,
    strangeLevel: 2,
    trigger: { chapter: "ASCENSION", minTurn: 16, hasCurrentSequence: true },
    diceCheck: { stat: "courage", dc: 16, reason: "飞升时的自我一致性判定", visible: true },
    choices: {
      A: {
        text: "承认所有选择都是我的一部分",
        tone: "整合自我",
        effects: {
          stats: { courage: 2, emotion: 1 },
          hiddenStats: { sanity: 2, destiny: 1 },
          personality: { judging: 1, feeling: 1 },
          worldAffinity: { fate: 1 },
          addTags: ["ascension", "record"],
          eventSummary: "我承认所有选择都是我的一部分。"
        }
      },
      B: {
        text: "只保留能被证明的事实",
        tone: "现实锚定",
        effects: {
          stats: { logic: 2, knowledge: 1 },
          hiddenStats: { sanity: 2 },
          personality: { thinking: 2, judging: 1 },
          worldAffinity: { science: 2 },
          addTags: ["ascension", "research"],
          eventSummary: "我只保留能被证明的事实。"
        }
      },
      C: {
        text: "回应那些曾经向我求助的人",
        tone: "回应关系",
        effects: {
          stats: { emotion: 2, charisma: 1 },
          hiddenStats: { faith: 2 },
          personality: { feeling: 2, extraversion: 1 },
          worldAffinity: { fate: 2 },
          addTags: ["ascension", "saved_npc"],
          eventSummary: "我回应了那些曾经向我求助的人。"
        }
      },
      D: {
        text: "走向房间里唯一没有影子的门",
        tone: "穿过未知",
        effects: {
          hiddenStats: { destiny: 2, obsession: 1 },
          personality: { intuition: 2, perceiving: 1 },
          worldAffinity: { mystery: 2 },
          addTags: ["ascension", "door", "unknown"],
          eventSummary: "我走向了房间里唯一没有影子的门。"
        }
      }
    },
    followUpEvents: []
  }
];
