import Avatar from './Avatar';
import { HomeIcon, SearchIcon, SwapIcon, UserIcon, BellIcon } from './Icons';
import type { User } from '../types';

interface Props {
  view: string;
  onNavigate: (view: string) => void;
  me: User | null;
  onAccount: () => void;
}

const TOP_LINKS = [
  { key: 'home', label: '首页' },
  { key: 'find', label: '找技能' },
  { key: 'matches', label: '匹配' },
  { key: 'mySkills', label: '我的' },
];

const BOTTOM_TABS = [
  { key: 'home', label: '首页', Icon: HomeIcon },
  { key: 'find', label: '找技能', Icon: SearchIcon },
  { key: 'matches', label: '匹配', Icon: SwapIcon },
  { key: 'mySkills', label: '我的', Icon: UserIcon },
];

export default function Navbar({ view, onNavigate, me, onAccount }: Props) {
  return (
    <>
      {/* ---------------- Desktop top nav ---------------- */}
      <header className="sticky top-0 z-40 hidden border-b border-[#ece6dc] bg-[#fffdf8]/85 backdrop-blur-md md:block">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-8 px-6">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-[#211c16]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-600 text-white shadow-soft">
              <SwapIcon width={18} height={18} />
            </span>
            SkillSwap
          </button>

          <nav className="flex items-center gap-1">
            {TOP_LINKS.map((l) => (
              <button
                key={l.key}
                onClick={() => onNavigate(l.key)}
                className={`rounded-lg px-3.5 py-2 text-sm font-medium transition ${
                  view === l.key
                    ? 'bg-[#f1edfd] text-[#5739c4]'
                    : 'text-[#5c5446] hover:bg-[#f5f1e8]'
                }`}
              >
                {l.label}
              </button>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => onNavigate('exchanges')}
              className="relative rounded-full p-2 text-[#9a9082] transition hover:bg-[#f5f1e8] hover:text-[#6a4fe0]"
              aria-label="消息"
            >
              <BellIcon />
            </button>
            <button
              onClick={onAccount}
              className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 transition hover:bg-[#f5f1e8]"
              aria-label="我的账户"
            >
              <Avatar name={me?.name ?? '我'} size={34} />
              <span className="text-sm font-medium text-[#211c16]">我的账户</span>
            </button>
          </div>
        </div>
      </header>

      {/* ---------------- Mobile bottom tab ---------------- */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#ece6dc] bg-[#fffdf8]/95 backdrop-blur-md md:hidden">
        <div className="mx-auto flex max-w-md items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
          {BOTTOM_TABS.map((t) => {
            const active = view === t.key;
            return (
              <button
                key={t.key}
                onClick={() => onNavigate(t.key)}
                className="flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium"
              >
                <t.Icon
                  width={21}
                  height={21}
                  className={active ? 'text-brand-600' : 'text-[#b3a99a]'}
                />
                <span className={active ? 'text-brand-600' : 'text-[#b3a99a]'}>{t.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
