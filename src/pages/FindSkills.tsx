import { useMemo, useState } from 'react';
import { useApp } from '../store';
import { CATEGORIES } from '../data/skills';
import { getSkillStats, norm, CATEGORY_COLOR } from '../utils/matching';
import { SearchIcon, ArrowLeftIcon } from '../components/Icons';
import { MagnifierDoodle } from '../components/Doodles';
import { SkillChip } from '../components/SwapPrimitives';
import type { Category } from '../types';

interface SkillEntry {
  key: string;
  name: string;
  category: Category;
  learn: number;
  teach: number;
}

export default function FindSkills() {
  const { allUsers, navigate } = useApp();
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<Category | '全部'>('全部');

  const catalog = useMemo<SkillEntry[]>(() => {
    const stats = getSkillStats(allUsers);
    const map = new Map<string, SkillEntry>();
    for (const u of allUsers) {
      [...u.canTeach, ...u.wantToLearn].forEach((s) => {
        const k = norm(s.name);
        if (!map.has(k)) map.set(k, { key: k, name: s.name, category: s.category, learn: 0, teach: 0 });
      });
    }
    return Array.from(map.values())
      .map((e) => ({ ...e, ...stats.get(e.key)! }))
      .sort((a, b) => b.learn + b.teach - (a.learn + a.teach));
  }, [allUsers]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return catalog.filter((s) => {
      const okCat = cat === '全部' || s.category === cat;
      const okQ = !q || s.name.toLowerCase().includes(q);
      return okCat && okQ;
    });
  }, [catalog, query, cat]);

  return (
    <div className="animate-fade mx-auto max-w-6xl px-6 py-8 sm:py-10">
      {/* 标题：带一点手绘感点缀 */}
      <h1 className="text-2xl font-bold w-fit text-[#211c16]">
        找你想学的
        <span className="relative inline-block">
          技能
          <MagnifierDoodle className="absolute -right-[52px] -top-5 w-12 -rotate-10 text-[#a394ec]" />
        </span>
      </h1>
      <p className="mt-3 text-sm text-[#5c5446]">看看大家都在学什么，说不定下一个就是你想要的。</p>

      {/* search */}
      <div className="relative mt-6 max-w-xl">
        <SearchIcon
          width={18}
          height={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#b3a99a]"
        />
        <input
          className="input rounded-full py-2.5 pl-11"
          placeholder="搜索技能，例如：Python、摄影、英语、吉他……"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* categories —— 内部 py/px 留出动效余量，外部负 margin 抵消；否则 overflow-x-auto 会把 hover 上浮/pop 动画裁掉 */}
      <div className="no-scrollbar -mx-1 -my-2 mt-6 flex gap-2 overflow-x-auto px-1 py-2">
        <button
          className={`chip chip-filter shrink-0 ${cat === '全部' ? 'chip-active chip-pop' : ''}`}
          onClick={() => setCat('全部')}
        >
          全部
        </button>
        {CATEGORIES.map((c) => {
          const cc = CATEGORY_COLOR[c];
          const active = cat === c;
          return (
            <button
              key={c}
              className={`chip chip-filter shrink-0 ${active ? 'chip-pop' : ''}`}
              style={
                active
                  ? { borderColor: cc, background: cc + '14', color: cc }
                  : undefined
              }
              onClick={() => setCat(c)}
            >
              {c}
            </button>
          );
        })}
      </div>

      {/* grid */}
      <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((s) => {
          const c = CATEGORY_COLOR[s.category];
          return (
            <button
              key={s.key}
              onClick={() => navigate('skillDetail', { skill: s.key, name: s.name, category: s.category })}
              className="card match-card arrow-reveal flex flex-col items-start p-4 text-left"
            >
              <div className="flex w-full items-start justify-between">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-base font-bold"
                  style={{ background: c + '14', color: c }}
                >
                  {s.name[0]}
                </span>
                <ArrowLeftIcon width={17} height={17} className="arrow mt-1 -scale-x-100 text-[#b3a99a]" />
              </div>
              <h3 className="mt-3 font-bold text-[#211c16]">{s.name}</h3>
              <SkillChip variant="neutral" tint={c} className="mt-1.5">
                {s.category}
              </SkillChip>
              <p className="mt-2 text-xs text-[#9a9082]">
                <span className="font-semibold text-[#5c5446]">{s.learn}</span> 人想学 ·{' '}
                <span className="font-semibold text-[#5c5446]">{s.teach}</span> 人可以教
              </p>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-[#9a9082]">
            没有找到相关技能，换个词试试？
          </p>
        )}
      </div>
    </div>
  );
}
