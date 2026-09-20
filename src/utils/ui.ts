const PALETTE = [
  '#6366f1',
  '#f97316',
  '#10b981',
  '#ec4899',
  '#0ea5e9',
  '#8b5cf6',
  '#f43f5e',
  '#14b8a6',
  '#0891b2',
  '#ca8a04',
];

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function avatarBg(seed: string): string {
  return PALETTE[hash(seed) % PALETTE.length];
}

export function initials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '?';
  // For CJK names use the last character (given-name feel); for latin use first letter.
  if (/[一-龥]/.test(trimmed)) return trimmed.slice(-1);
  return trimmed.slice(0, 1).toUpperCase();
}

export function uid(prefix = 'id'): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export function matchColor(score: number): string {
  if (score >= 90) return '#10b981';
  if (score >= 75) return '#4f46e5';
  return '#f97316';
}

export function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return '刚刚';
  if (m < 60) return `${m} 分钟前`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} 小时前`;
  return `${Math.floor(h / 24)} 天前`;
}
