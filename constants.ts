import { Suit, CardValue, RuleType, CardRule, Card, AIChallengeResponse } from './types';

// Local Fallback Databases (Used when AI is slow or offline)
export const LOCAL_TRUTHS = [
  "如果必须和在场的一位异性流落荒岛，你会选谁？",
  "你上一次哭是因为什么？",
  "你手机里最不想让人看到的照片是什么？",
  "在场的谁最符合你的择偶标准？",
  "你做过最丢脸的一件事是什么？",
  "如果你能隐身一小时，你会做什么？",
  "你是否曾经对在场的人撒过谎？是什么？",
  "描述一下你初吻的经历。",
  "你最讨厌在场谁的一个缺点？",
  "你最近一次搜索记录是什么？"
];

export const LOCAL_DARES = [
  "模仿一种动物叫声，直到大家满意为止。",
  "选一位异性对视30秒，不许笑。",
  "大声朗读你手机里最近的一条短信。",
  "做10个俯卧撑或深蹲。",
  "让右边的人在你的脸上画一个图案。",
  "用屁股写出你的名字。",
  "给前任或者暗恋对象发一条“我想你了”。",
  "跳一段性感的舞蹈持续20秒。",
  "让在场的每一个人拍一下你的头。",
  "深情地对着墙壁表白1分钟。"
];

export const LOCAL_CHALLENGES: AIChallengeResponse[] = [
  { title: "成语接龙", description: "从你开始，顺时针进行成语接龙。接不上的人罚酒。", intensity: "Low" },
  { title: "真心话炸弹", description: "你必须回答三个真心话问题，或者直接干一杯。", intensity: "High" },
  { title: "我是演员", description: "模仿在场的一个人，让大家猜是谁。猜不出来你自己喝。", intensity: "Medium" },
  { title: "定格挑战", description: "保持现在的姿势不动，坚持到下一个人完成任务。", intensity: "Medium" },
  { title: "异手挑战", description: "接下来的5分钟，你只能用非惯用手拿杯子。", intensity: "Low" }
];

// Standard "King's Cup" Style Rules tailored for Chinese context
export const RULES: Record<string, CardRule> = {
  [CardValue.ACE]: {
    title: "逛三园 (Categories)",
    description: "例如：水果园、蔬菜园、动物园。从你开始，每人说一个园内的东西，重复或卡壳的人喝酒。",
    type: RuleType.GAME
  },
  [CardValue.TWO]: {
    title: "小姐牌 (You Drink)",
    description: "指定的“小姐”。此后任何人喝酒，都要礼貌地对你说“小姐请喝酒”，你需陪喝一半。直到下一张2出现。",
    type: RuleType.PASSIVE
  },
  [CardValue.THREE]: {
    title: "逛三园/玩7 (Game)",
    description: "你可以选择玩“逛三园”或者“逢7过”（数数，遇到7或7的倍数拍手跳过）。输的人喝。",
    type: RuleType.GAME
  },
  [CardValue.FOUR]: {
    title: "在这停顿 (Freeze)",
    description: "所有人此时此刻保持静止动作，谁先动谁喝酒。",
    type: RuleType.GAME
  },
  [CardValue.FIVE]: {
    title: "照相机 (Photo)",
    description: "你是摄影师。在游戏任何时候，你突然喊“照相”，所有人必须定格不动。最后定格的人喝酒。",
    type: RuleType.PASSIVE
  },
  [CardValue.SIX]: {
    title: "摸鼻子 (Touch Nose)",
    description: "你可以随时摸自己的鼻子。其他人看到后必须跟着摸。最后一个摸鼻子的人喝酒。",
    type: RuleType.PASSIVE
  },
  [CardValue.SEVEN]: {
    title: "指天 (Point Heaven)",
    description: "你将手指指向天空，其他人必须立刻跟着指。最后一个指天的人喝酒。",
    type: RuleType.ACTION
  },
  [CardValue.EIGHT]: {
    title: "厕所牌 (Toilet)",
    description: "通常是唯一的尿点卡。只有拥有这张牌的人才能去上厕所，或者你可以卖给急需的人换酒喝。",
    type: RuleType.PASSIVE
  },
  [CardValue.NINE]: {
    title: "自己喝 (Self)",
    description: "运气不好，这杯酒你自己干了。",
    type: RuleType.ACTION
  },
  [CardValue.TEN]: {
    title: "神经病 (Question Master)",
    description: "你变成“神经病”。你问任何人问题，如果他们回答了你，他们就得喝。直到下一张10出现。",
    type: RuleType.PASSIVE
  },
  [CardValue.JACK]: {
    title: "左边喝 (Left)",
    description: "你左手边的那个人喝酒。",
    type: RuleType.ACTION
  },
  [CardValue.QUEEN]: {
    title: "右边喝 (Right)",
    description: "你右手边的那个人喝酒。",
    type: RuleType.ACTION
  },
  [CardValue.KING]: {
    title: "国王杯 (King's Cup)",
    description: "前三位抽到K的人，往中间的“国王杯”里倒酒（随意量）。第四位抽到K的人，必须把这一大杯混合酒喝完！",
    type: RuleType.ACTION
  },
  [CardValue.JOKER]: {
    title: "AI 乱入 (Wildcard)",
    description: "Gemini AI 正在为你生成一个专属的疯狂挑战...",
    type: RuleType.AI
  }
};

export const createDeck = (): Card[] => {
  const suits = [Suit.HEARTS, Suit.DIAMONDS, Suit.CLUBS, Suit.SPADES];
  const values = [
    CardValue.ACE, CardValue.TWO, CardValue.THREE, CardValue.FOUR, CardValue.FIVE,
    CardValue.SIX, CardValue.SEVEN, CardValue.EIGHT, CardValue.NINE, CardValue.TEN,
    CardValue.JACK, CardValue.QUEEN, CardValue.KING
  ];

  let deck: Card[] = [];

  suits.forEach(suit => {
    values.forEach(value => {
      deck.push({
        suit,
        value,
        id: `${suit}-${value}`,
        isRed: suit === Suit.HEARTS || suit === Suit.DIAMONDS
      });
    });
  });

  // Add 2 Jokers
  deck.push({ suit: Suit.JOKER, value: CardValue.JOKER, id: 'JOKER-1', isRed: true });
  deck.push({ suit: Suit.JOKER, value: CardValue.JOKER, id: 'JOKER-2', isRed: false });

  return shuffle(deck);
};

function shuffle(array: Card[]): Card[] {
  let currentIndex = array.length,  randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}