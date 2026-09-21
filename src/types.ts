export type Category =
  | '编程'
  | '语言'
  | '设计'
  | '摄影'
  | '音乐'
  | '运动'
  | '职业技能'
  | '生活技能'
  | '其他';

export type Proficiency = '入门' | '熟练' | '精通';
export type TeachLevel = '入门' | '进阶' | '都可以';
export type LearnLevel = '零基础' | '入门' | '进阶';
export type Method = '线上' | '线下' | '都可以';

export interface TeachSkill {
  id: string;
  name: string;
  category: Category;
  proficiency: Proficiency;
  canTeach: TeachLevel;
  content: string;
  method: Method;
  availableTime: string;
}

export interface LearnSkill {
  id: string;
  name: string;
  category: Category;
  currentLevel: LearnLevel;
  goal: string;
  preferredMethod: Method;
  weeklyTime: string;
}

export interface User {
  id: string;
  name: string;
  bio: string;
  city: string;
  canTeach: TeachSkill[];
  wantToLearn: LearnSkill[];
  /** marks the local current user created during onboarding */
  isCurrentUser?: boolean;
}

export type MatchType = '双向互补' | '单向学习匹配' | '单向教学匹配' | '无匹配';

export interface MatchResult {
  user: User;
  score: number;
  type: MatchType;
  /** skill names I can teach & they want to learn */
  iTeachThem: string[];
  /** skill names they can teach & I want to learn */
  iLearnFromThem: string[];
  reasons: string[];
}

export type ExchangeStatus = 'pending' | 'ongoing' | 'completed';

/** 交换方案：4 周、双方对等，由 AI 生成或双方共建 */
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

/** 持久化的方案：记录是否已获双方确认，以及我方提交、待对方确认的修改 */
export interface StoredPlan extends ExchangePlan {
  /** 当前方案是否已获双方确认 */
  confirmed: boolean;
  /** 我方提交、等待对方确认的修改版；null / undefined 表示没有待确认修改 */
  pendingEdit?: ExchangePlan | null;
}

export interface ExchangeMessage {
  from: 'me' | 'them';
  text: string;
  at: number;
}

export interface Exchange {
  id: string;
  meId: string;
  otherId: string;
  otherName: string;
  otherAvatar: string;
  iTeach: string;
  iLearn: string;
  method: string;
  weekly: string;
  message: string;
  status: ExchangeStatus;
  /** 邀请方向：out = 我发给对方（等对方确认）；in = 对方发给我（等我确认）。缺省视为 out */
  direction?: 'out' | 'in';
  /** 已生成的交换方案（确认 / 编辑均需双方认同） */
  plan?: StoredPlan;
  createdAt: number;
  messages: ExchangeMessage[];
}

export type ToastType = 'success' | 'info' | 'error';
