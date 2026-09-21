import type { User, Exchange } from '../types';

const ME_KEY = 'skillswap_me_v1';
const EXCHANGES_KEY = 'skillswap_exchanges_v1';
const SEED_FLAG = 'skillswap_inv_seed_v1';

/** 演示用「别人发给我」的待确认邀请（只注入一次） */
const SEED_INVITE: Exchange = {
  id: 'ex_in_zhenghao',
  meId: 'me',
  otherId: 'u_zhenghao',
  otherName: '郑昊',
  otherAvatar: '郑昊',
  iTeach: '摄影',
  iLearn: '日语',
  method: '线上',
  weekly: '1~2 小时',
  message: '看到你想学日语！我可以带你从五十音入门到日常会话，也想请你教教摄影，要不要互相交流一下～',
  status: 'pending',
  direction: 'in',
  plan: {
    youTeach: '摄影',
    theyTeach: '日语',
    weeklyHours: '每周各 1 小时',
    confirmed: false,
    pendingEdit: null,
    weeks: [
      { week: 1, youTopic: '构图与取景', theyTopic: '五十音与发音' },
      { week: 2, youTopic: '光线与曝光', theyTopic: '基础句型' },
      { week: 3, youTopic: '手机摄影实拍', theyTopic: '日常会话' },
      { week: 4, youTopic: '主题拍摄与作品整理', theyTopic: '短文阅读' },
    ],
    reciprocityNote:
      '每周你教摄影与郑昊教日语的时间保持一致（各约 1 小时），双方投入对等、互惠进行，避免出现一方持续教学、另一方只接受学习的情况。',
  },
  createdAt: Date.now(),
  messages: [
    {
      from: 'them',
      text: '看到你想学日语！我可以带你从五十音入门到日常会话，也想请你教教摄影，要不要互相交流一下～',
      at: Date.now(),
    },
  ],
};

export function loadMe(): User | null {
  try {
    const raw = localStorage.getItem(ME_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function saveMe(me: User | null): void {
  try {
    if (me) localStorage.setItem(ME_KEY, JSON.stringify(me));
    else localStorage.removeItem(ME_KEY);
  } catch {
    /* ignore quota errors */
  }
}

export function loadExchanges(): Exchange[] {
  try {
    const raw = localStorage.getItem(EXCHANGES_KEY);
    const list: Exchange[] = raw ? (JSON.parse(raw) as Exchange[]) : [];
    // 首次加载时注入一条「对方发给我」的待确认邀请，让「待确认」tab 有真实内容；只注入一次
    if (!localStorage.getItem(SEED_FLAG)) {
      localStorage.setItem(SEED_FLAG, '1');
      if (!list.some((e) => e.direction === 'in')) {
        list.unshift(SEED_INVITE);
        saveExchanges(list);
      }
    }
    return list;
  } catch {
    return [];
  }
}

export function saveExchanges(list: Exchange[]): void {
  try {
    localStorage.setItem(EXCHANGES_KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}
