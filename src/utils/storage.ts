import type { User, Exchange } from '../types';

const ME_KEY = 'skillswap_me_v1';
const EXCHANGES_KEY = 'skillswap_exchanges_v1';

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
    return raw ? (JSON.parse(raw) as Exchange[]) : [];
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
