import type { User, MatchResult } from '../types';

/* ================================================================
 * SkillSwap · AI 技能交换助手
 * ----------------------------------------------------------------
 * 这三个函数是「AI 能力」的唯一集成点。当前为 mock 实现：完全基于真实
 * 用户 / 技能数据做确定性、模板化的生成（不接任何 LLM、不随机）。
 *
 * 将来接入真实大模型时，只需把每个函数体替换为一次 API 调用、返回相同
 * 的 shape 即可，所有调用方（页面）无需改动：
 *
 *   export async function generateMatchReason(...) {
 *     const res = await fetch('/api/ai/match-reason', {
 *       method: 'POST',
 *       body: JSON.stringify({ me, other, match }),
 *     });
 *     return (await res.json()).text;
 *   }
 *
 * 设计约束（与产品目标一致）：
 *   - 解释 / 方案 / 邀请必须来自真实技能数据，绝不编造与数据无关的理由。
 *   - 交换方案必须「互惠」：双方投入时间对等，避免出现一方只教、一方只学。
 *   - AI 只负责「解释 / 建议 / 撰文」，最终是否交换由用户决定。
 * ================================================================ */

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/** 常见技能的 4 周递进子主题；未收录时回退到通用结构。 */
const SUBTOPICS: Record<string, string[]> = {
  python: ['基础语法与运行环境', '函数与数据结构', '数据处理（Pandas）', '完成一个实战小项目'],
  摄影: ['构图与取景', '光线与曝光', '手机摄影实拍', '主题拍摄与作品整理'],
  英语口语: ['日常问候与自我介绍', '生活场景对话', '观点表达与讨论', '模拟真实交流'],
  吉他: ['持琴姿势与基础和弦', '扫弦与节奏', '简单歌曲弹唱', '完整曲目演绎'],
  ui设计: ['设计原则与排版', '色彩与字体搭配', 'Figma 实操', '完整界面设计'],
  数据分析: ['分析思路与指标', '数据清洗', '可视化呈现', '结论与报告'],
  日语: ['五十音与发音', '基础句型', '日常会话', '短文阅读'],
  photoshop: ['图层与选区', '调色与修图', '合成与创意', '成片输出'],
  figma: ['界面与组件', '自动布局', '原型交互', '协作与交付'],
  音乐理论: ['音阶与和弦', '节奏与节拍', '和声基础', '简单编配'],
  西班牙语: ['发音与字母', '基础句型', '日常对话', '短文阅读'],
  写作: ['结构与选题', '叙事与描写', '逻辑与论证', '完整成稿'],
  健身: ['动作与姿势', '计划与节奏', '力量与耐力', '阶段评估'],
  烹饪: ['刀工与火候', '调味基础', '家常菜实操', '一桌完整料理'],
};

const GENERIC_SUBTOPICS = ['基础概念', '核心方法', '实操练习', '综合应用'];

function subTopics(name: string): string[] {
  return SUBTOPICS[name.trim().toLowerCase()] ?? GENERIC_SUBTOPICS;
}

/* ----------------------------------------------------------------
 * 1) 匹配解释 —— 为什么你们适合交换？
 * ---------------------------------------------------------------- */
export async function generateMatchReason(
  _me: User,
  other: User,
  m: MatchResult,
): Promise<string> {
  const teach = m.iTeachThem; // 我教 TA 的
  const learn = m.iLearnFromThem; // TA 教我的

  if (teach.length && learn.length) {
    return `你们存在双向技能互补：你可以帮助 ${other.name} 学习 ${teach.join(
      '、',
    )}，而 ${other.name} 也可以帮助你学习 ${learn.join(
      '、',
    )}。相比单向关系，双向互补让双方在交换中同时「教」与「学」，投入对等、动力更足，因此最适合进行技能交换。`;
  }
  if (teach.length) {
    return `你擅长 ${teach.join(
      '、',
    )}，而 ${other.name} 正在学习这些技能。你可以用自己的经验帮对方入门或进阶，是一次有清晰收益的单向技能帮扶。`;
  }
  if (learn.length) {
    return `${other.name} 擅长 ${learn.join(
      '、',
    )}，而这正是你想学习的方向。你可以从对方身上获得针对性的指导，是一次清晰的单向学习机会。`;
  }
  return '当前没有发现可直接互补的技能关系。';
}

/* ----------------------------------------------------------------
 * 2) 交换计划 —— 具体应该怎么交换？（4 周、双方对等）
 * ---------------------------------------------------------------- */
export interface ExchangePlanWeek {
  week: number;
  youTopic: string; // 你教的内容
  theyTopic: string; // TA 教的内容
}

export interface ExchangePlan {
  youTeach: string;
  theyTeach: string;
  weeklyHours: string;
  weeks: ExchangePlanWeek[];
  reciprocityNote: string;
}

export async function generateExchangePlan(
  me: User,
  other: User,
  m: MatchResult,
): Promise<ExchangePlan> {
  await delay(1600); // 模拟「分析 / 设计 / 生成」耗时

  const youTeach = m.iTeachThem[0] ?? me.canTeach[0]?.name ?? '你的技能';
  const theyTeach = m.iLearnFromThem[0] ?? other.canTeach[0]?.name ?? '对方的技能';

  const yt = subTopics(youTeach);
  const tt = subTopics(theyTeach);

  const weeks: ExchangePlanWeek[] = [0, 1, 2, 3].map((i) => ({
    week: i + 1,
    youTopic: yt[i],
    theyTopic: tt[i],
  }));

  return {
    youTeach,
    theyTeach,
    weeklyHours: '每周各 1 小时',
    weeks,
    // 互惠约束：双方每周投入时间一致，谁都不只是「被教」的一方。
    reciprocityNote: `每周你教 ${youTeach} 与 ${other.name} 教 ${theyTeach} 的时间保持一致（各约 1 小时），双方投入对等、互惠进行，避免出现一方持续教学、另一方只接受学习的情况。`,
  };
}

/* ----------------------------------------------------------------
 * 3) 交换邀请文案 —— 让 AI 帮你写一段自然的邀请
 * ---------------------------------------------------------------- */
const INVITE_TEMPLATES: Array<(other: User, teach: string, learn: string) => string> = [
  (other, teach, learn) =>
    `你好！看到你正在学习 ${teach}，而我正好比较熟悉这方面；同时我也一直想学习 ${learn}，看到你有相关经验，所以想和你进行一次技能交换。如果你感兴趣，我们可以先从每周各 1 小时开始，互相教、互相学。`,
  (other, teach, learn) =>
    `嗨 ${other.name}，在 SkillSwap 上看到我们技能正好互补：我可以教你 ${teach}，而你也可以教我 ${learn}。觉得我们可以约个每周 1 小时左右的互换学习，你方便的话回复我呀～`,
];

export async function generateInvitation(
  me: User,
  other: User,
  m: MatchResult,
  variant = 0,
): Promise<string> {
  await delay(600); // 模拟文案生成耗时
  const teach = m.iTeachThem[0] ?? me.canTeach[0]?.name ?? '技能';
  const learn = m.iLearnFromThem[0] ?? other.canTeach[0]?.name ?? '技能';
  const tpl = INVITE_TEMPLATES[variant % INVITE_TEMPLATES.length];
  return tpl(other, teach, learn);
}
