import { useMemo } from 'react';
import { useApp } from '../store';
import { norm } from '../utils/matching';
import Avatar from '../components/Avatar';
import { SwapIcon, CodeIcon, CameraIcon } from '../components/Icons';
import {
  StarDoodle,
  ArcDoodle,
  HalfRingDoodle,
  CardLinkArrows,
  CircleScribble,
  QuickLines,
} from '../components/Doodles';

export default function Home() {
  const { allUsers, me, matches, navigate } = useApp();

  // 「大家最近都在交换什么」——完全来自真实数据：
  // 统计同一个人「会 T + 想学 L」的组合出现次数，取最热门的几组。
  const pairs = useMemo(() => {
    const count = new Map<string, { t: string; l: string; n: number; cat: string }>();
    for (const u of allUsers) {
      if (u.id === 'me') continue;
      for (const t of u.canTeach) {
        for (const l of u.wantToLearn) {
          if (norm(t.name) === norm(l.name)) continue;
          const k = `${norm(t.name)}~${norm(l.name)}`;
          const e = count.get(k);
          if (e) e.n += 1;
          else count.set(k, { t: t.name, l: l.name, n: 1, cat: t.category });
        }
      }
    }
    return Array.from(count.values())
      .sort((a, b) => b.n - a.n)
      .slice(0, 6);
  }, [allUsers]);

  return (
    <div className="animate-fade">
      {/* ================= Hero ================= */}
      <section className="relative overflow-hidden">
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 pb-10 pt-12 sm:pt-16 lg:grid-cols-2">
          {/* 左：slogan + 大标题 + 唯一 CTA */}
          <div>
            <p className="text-sm font-bold text-[#7C5CFC]">
              <span className="relative inline-block px-1.5">
                技能交换
                <CircleScribble className="pointer-events-none absolute -left-1.5 -top-1.5 !h-[calc(100%+10px)] !w-[calc(100%+12px)] text-[#C4B6FB]" />
              </span>
              {' · '}
              <span className="relative inline-block">
                遇见更好的自己
                <QuickLines className="pointer-events-none absolute -bottom-2.5 left-0 h-2.5 w-full text-[#C4B6FB]" />
              </span>
            </p>
            <h1 className="display mt-5">
              你<span className="text-[#7C5CFC]">会</span>什么？
              <br />
              想<span className="text-[#FF8A4C]">学</span>什么？
            </h1>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-[#525252]">
              用你会的，换你想学的。
              <br />
              在这里，遇见刚好互补的伙伴。
            </p>
            <div className="group relative mt-8 inline-block">
              <StarDoodle className="btn-star pointer-events-none absolute -right-4 -top-3 !h-4 !w-4 text-[#FF8A4C]" />
              <button
                onClick={() => navigate('find')}
                className="inline-flex -rotate-1 items-center gap-2 rounded-full bg-[#7C5CFC] px-7 py-3 text-base font-bold text-white shadow-[0_12px_26px_-12px_rgba(106,79,224,0.65)] transition-all duration-200 hover:-rotate-3 hover:bg-[#5a3fd0] hover:shadow-[0_16px_30px_-12px_rgba(106,79,224,0.7)] active:rotate-1 active:shadow-[0_8px_18px_-10px_rgba(106,79,224,0.6)]"
              >
                开始探索
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-1.5">
                  →
                </span>
              </button>
            </div>
          </div>

          {/* 右：技能交换卡（桌面端）—— 两张倾斜卡 + 跨卡连接箭头 */}
          <div className="relative mx-auto hidden h-[320px] w-full max-w-md sm:block" aria-hidden>
            {/* 我能教 Python */}
            <button
              onClick={() => navigate('find')}
              className="swap-card absolute left-0 top-8 w-44 -rotate-6 p-4 text-left"
              style={{ borderColor: '#d8d0fb' }}
            >
              <span className="text-xs font-bold text-[#6D44F2]">我能教</span>
              <div className="mt-2.5 flex items-center justify-between gap-2">
                <span className="text-lg font-extrabold text-[#18181B]">Python</span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F5F3FF] text-[#7C5CFC]">
                  <CodeIcon width={18} height={18} />
                </span>
              </div>
            </button>

            {/* 我想学 摄影 */}
            <button
              onClick={() => navigate('find')}
              className="swap-card absolute bottom-10 right-0 w-44 rotate-6 p-4 text-left"
              style={
                {
                  borderColor: '#FFD6C0',
                  '--swap-glow-border': '#FFB98C',
                  '--swap-glow': 'rgba(242, 162, 75, 0.35)',
                  '--swap-glow-soft': 'rgba(242, 162, 75, 0.08)',
                } as React.CSSProperties
              }
            >
              <span className="text-xs font-bold text-[#E2702F]">我想学</span>
              <div className="mt-2.5 flex items-center justify-between gap-2">
                <span className="text-lg font-extrabold text-[#18181B]">摄影</span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFF3EC] text-[#FF8A4C]">
                  <CameraIcon width={18} height={18} />
                </span>
              </div>
            </button>

            {/* 两张卡之间的交叉连接箭头：分别从各卡边缘出发、指向对方卡片 */}
            <CardLinkArrows className="bob pointer-events-none absolute inset-0 h-full w-full" />

            {/* 克制的装饰：星星 / 弧线 / 点 */}
            <StarDoodle className="twinkle absolute right-8 top-4 !h-5 !w-5 text-[#FF8A4C]" />
            <StarDoodle
              className="twinkle absolute bottom-4 left-14 !h-3.5 !w-3.5 text-[#C4B6FB]"
              style={{ ['--d' as string]: '1.3s' } as React.CSSProperties}
            />
            <ArcDoodle className="absolute bottom-2 right-16 w-16 text-[#d8d0fb]" />
            <HalfRingDoodle className="absolute left-28 top-2 w-6 text-[#FFD6C0]" />
          </div>

          {/* 移动端：紧凑版交换视觉 */}
          <div className="relative mx-auto flex items-center gap-3 sm:hidden" aria-hidden>
            <div className="swap-card w-32 -rotate-3 p-3" style={{ borderColor: '#d8d0fb' }}>
              <p className="text-[11px] font-bold text-[#6D44F2]">我能教</p>
              <p className="mt-1 text-base font-extrabold">Python</p>
            </div>
            <SwapIcon width={20} height={20} className="animate-swap shrink-0 text-[#7C5CFC]" />
            <div
              className="swap-card w-32 rotate-3 p-3"
              style={
                {
                  borderColor: '#FFD6C0',
                  '--swap-glow-border': '#FFB98C',
                  '--swap-glow': 'rgba(242, 162, 75, 0.35)',
                  '--swap-glow-soft': 'rgba(242, 162, 75, 0.08)',
                } as React.CSSProperties
              }
            >
              <p className="text-[11px] font-bold text-[#E2702F]">我想学</p>
              <p className="mt-1 text-base font-extrabold">摄影</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 大家最近都在交换什么 ================= */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <h2 className="heading">大家最近都在交换什么？</h2>
        <div className="mt-5 flex flex-wrap gap-3">
          {pairs.map((p, i) => (
            <button
              key={`${p.t}~${p.l}`}
              onClick={() => navigate('skillDetail', { skill: norm(p.t), name: p.t, category: p.cat })}
              className="pair-x flex items-center gap-2 rounded-full border border-[#EAEAEA] bg-white px-4 py-2 shadow-card transition hover:-translate-y-0.5 hover:border-[#DED7FE] sm:even:translate-y-2 sm:even:hover:translate-y-1.5"
              title={`${p.n} 位小伙伴身上都有这个组合`}
            >
              <span className="pair-side text-sm font-bold text-[#6D44F2]">{p.t}</span>
              <SwapIcon width={15} height={15} className="pair-swap text-[#c9bfae]" />
              <span className="pair-side text-sm font-bold text-[#E2702F]">{p.l}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ================= 和你互补的人（轻量入口条） ================= */}
      {me && matches.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-12">
          <div className="band flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2.5">
                {matches.slice(0, 3).map((m) => (
                  <span key={m.user.id} className="rounded-full ring-2 ring-white">
                    <Avatar name={m.user.name} size={30} />
                  </span>
                ))}
              </div>
              <p className="text-sm text-[#525252]">
                已经有 <span className="font-bold text-[#18181B]">{matches.length}</span> 个人和你刚好互补
              </p>
            </div>
            <button className="link-cta group" onClick={() => navigate('matches')}>
              看看是谁
              <span className="ml-1 inline-block transition-transform duration-200 group-hover:translate-x-1.5">
                →
              </span>
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
