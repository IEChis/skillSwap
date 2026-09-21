import { useMemo } from 'react';
import { useApp } from '../store';
import MatchCard from '../components/MatchCard';
import EmptyState from '../components/EmptyState';
import { SwapIcon } from '../components/Icons';
import { FaceDoodle } from '../components/Doodles';

const LINES = [
  '你会的，可能正是别人想学的。',
  '说不定，你想学的就在某个人手里。',
  '有人正想学你会的技能。',
  '这个组合，好像可以交换一下。',
];

export default function MyMatches() {
  const { matches, navigate, me, openAddSkill } = useApp();

  const line = useMemo(() => LINES[Math.floor(Math.random() * LINES.length)], []);

  if (!me) return null;

  return (
    <div className="animate-fade mx-auto max-w-5xl px-6 py-8 sm:py-10">
      <div className="relative w-fit">
        <h1 className="text-2xl font-bold text-[#18181B]">
          刚好可以
          <span className="relative inline-block">
            交换
            <FaceDoodle className="absolute -right-11 -top-4 w-10 rotate-6 text-[#f2a24b]" />
          </span>
        </h1>
      </div>

      {matches.length > 0 ? (
        <>
          <p className="mt-2 text-sm text-[#737373]">{line}</p>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {matches.map((m, i) => (
              <div key={m.user.id} style={{ ['--d' as any]: `${i * 0.05}s` }}>
                <MatchCard
                  match={m}
                  cta="交换看看 →"
                  onView={() => navigate('matchDetail', { userId: m.user.id })}
                />
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="mt-6">
          <EmptyState
            icon={<SwapIcon width={34} height={34} />}
            title="还没找到交换伙伴"
            desc="告诉我你会什么，我再帮你找找。"
            action={
              <button className="btn-primary" onClick={() => openAddSkill('teach')}>
                加一个技能
              </button>
            }
          />
        </div>
      )}
    </div>
  );
}
