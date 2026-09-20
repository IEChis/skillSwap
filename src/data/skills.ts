import type { Category } from '../types';

export const CATEGORIES: Category[] = [
  '编程',
  '语言',
  '设计',
  '摄影',
  '音乐',
  '运动',
  '职业技能',
  '生活技能',
  '其他',
];

/** Skills offered in the onboarding picker (name + category). */
export const ONBOARD_SKILLS: { name: string; category: Category }[] = [
  { name: 'Python', category: '编程' },
  { name: '前端开发', category: '编程' },
  { name: '数据分析', category: '编程' },
  { name: '英语口语', category: '语言' },
  { name: '日语', category: '语言' },
  { name: '西班牙语', category: '语言' },
  { name: 'UI设计', category: '设计' },
  { name: 'Figma', category: '设计' },
  { name: '摄影', category: '摄影' },
  { name: 'Photoshop', category: '设计' },
  { name: '吉他', category: '音乐' },
  { name: '钢琴', category: '音乐' },
  { name: '音乐理论', category: '音乐' },
  { name: '健身', category: '运动' },
  { name: '瑜伽', category: '运动' },
  { name: '烹饪', category: '生活技能' },
  { name: '插画', category: '设计' },
  { name: '产品思维', category: '职业技能' },
];

/** A few ready-made profiles so the demo shows data immediately even on "快速体验". */
export const SAMPLE_PROFILES: {
  teach: { name: string; category: Category }[];
  learn: { name: string; category: Category }[];
} = {
  teach: [
    { name: 'Python', category: '编程' },
    { name: '数据分析', category: '编程' },
  ],
  learn: [
    { name: '摄影', category: '摄影' },
    { name: '吉他', category: '音乐' },
  ],
};
