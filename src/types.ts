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
  createdAt: number;
  messages: ExchangeMessage[];
}

export type ToastType = 'success' | 'info' | 'error';
