import type { User, MatchResult, MatchType, Category } from '../types';

/** Normalize a skill name for matching (lowercase, trim, strip inner spaces). */
export function norm(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, '');
}

/**
 * Core matching algorithm.
 *
 * Rules (deterministic, rule-based — no AI / random):
 *   - A can teach X  AND  B wants to learn X  => "A teaches B" edge
 *   - A wants to learn Y  AND  B can teach Y  => "A learns from B" edge
 *   - both edges present  => 双向互补 (bidirectional), score 90-100
 *   - only learn edge     => 单向学习匹配, score 60-89
 *   - only teach edge     => 单向教学匹配, score 60-89
 *   - none                => 无匹配 (not recommended)
 */
export function computeMatch(me: User, other: User): MatchResult {
  const teachEdges = me.canTeach.filter((t) =>
    other.wantToLearn.some((l) => norm(l.name) === norm(t.name)),
  );
  const learnEdges = other.canTeach.filter((t) =>
    me.wantToLearn.some((l) => norm(l.name) === norm(t.name)),
  );

  const iTeachThem = teachEdges.map((s) => s.name);
  const iLearnFromThem = learnEdges.map((s) => s.name);

  const bidirectional = iTeachThem.length > 0 && iLearnFromThem.length > 0;

  let score = 0;
  let type: MatchType = '无匹配';

  if (bidirectional) {
    type = '双向互补';
    // 92 at 1+1, +2 per extra complementary skill, capped at 100
    score = Math.min(100, 92 + (iTeachThem.length + iLearnFromThem.length - 2) * 2);
  } else if (iLearnFromThem.length > 0) {
    type = '单向学习匹配';
    score = Math.min(89, 60 + iLearnFromThem.length * 10);
  } else if (iTeachThem.length > 0) {
    type = '单向教学匹配';
    score = Math.min(89, 60 + iTeachThem.length * 10);
  }

  const reasons: string[] = [];
  iTeachThem.forEach((name) => {
    reasons.push(`你可以教 ${name}，而 ${other.name} 正好想学习 ${name}`);
  });
  iLearnFromThem.forEach((name) => {
    reasons.push(`${other.name} 可以教 ${name}，而 ${name} 正是你正在学习的技能`);
  });

  return {
    user: other,
    score,
    type,
    iTeachThem,
    iLearnFromThem,
    reasons,
  };
}

/** Compute ranked matches for `me` against a list of candidate users (excluding self). */
export function getMatches(me: User, candidates: User[]): MatchResult[] {
  return candidates
    .filter((u) => u.id !== me.id)
    .map((u) => computeMatch(me, u))
    .filter((m) => m.type !== '无匹配')
    .sort((a, b) => b.score - a.score);
}

/** Platform-wide skill stats: how many people want to learn / can teach each skill. */
export function getSkillStats(users: User[]): Map<string, { learn: number; teach: number }> {
  const map = new Map<string, { learn: number; teach: number }>();
  const bump = (key: string, kind: 'learn' | 'teach') => {
    const e = map.get(key) ?? { learn: 0, teach: 0 };
    e[kind] += 1;
    map.set(key, e);
  };
  for (const u of users) {
    u.canTeach.forEach((t) => bump(norm(t.name), 'teach'));
    u.wantToLearn.forEach((l) => bump(norm(l.name), 'learn'));
  }
  return map;
}

export const CATEGORY_COLOR: Record<Category, string> = {
  编程: '#4f46e5',
  语言: '#0ea5e9',
  设计: '#ec4899',
  摄影: '#f97316',
  音乐: '#8b5cf6',
  运动: '#10b981',
  职业技能: '#0891b2',
  生活技能: '#ca8a04',
  其他: '#64748b',
};
