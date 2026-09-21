import Avatar from './Avatar';
import { HomeIcon, SearchIcon, SwapIcon, UserIcon, BellIcon } from './Icons';
import type { User } from '../types';

interface Props {
  view: string;
  history?: { view: string }[];
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

/* ---------------- 高亮归属：子页面跟随导航历史回到所属主分区 ---------------- */
const SECTION_VIEWS = ['home', 'find', 'matches', 'mySkills'];
/** 历史里找不到主分区时的兜底归属 */
const FALLBACK_SECTION: Record<string, string> = {
  skillDetail: 'find',
  matchDetail: 'matches',
  exchangeOffer: 'matches',
  exchanges: 'mySkills',
  userDetail: 'mySkills',
};

function activeSection(view: string, history: { view: string }[]): string {
  if (SECTION_VIEWS.includes(view)) return view;
  // 「我的交换」(exchanges) 是「我的」下固定的叶子页面，永远跟随「我的」，
  // 不随导航历史回溯（避免从匹配进入后错误高亮「匹配」）
  if (view === 'exchanges') return 'mySkills';
  // 其余子页面：从最近的记录往前找所属主分区（例如 找技能 → 技能详情 → TA 主页 仍归「找技能」）
  for (let i = history.length - 1; i >= 0; i--) {
    if (SECTION_VIEWS.includes(history[i].view)) return history[i].view;
  }
  return FALLBACK_SECTION[view] ?? 'home';
}

export default function Navbar({ view, history = [], onNavigate, me, onAccount }: Props) {
  const active = activeSection(view, history);
  return (
    <>
      {/* ---------------- Desktop top nav ---------------- */}
      <header className="sticky top-0 z-40 hidden border-b border-[#EAEAEA] bg-white/80 backdrop-blur-md md:block">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-8 px-6">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-[#18181B]"
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
                  active === l.key
                    ? 'bg-[#F2EFFF] text-[#6D44F2]'
                    : 'text-[#525252] hover:bg-[#F4F4F5]'
                }`}
              >
                {l.label}
              </button>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => onNavigate('exchanges')}
              className={`relative rounded-full p-2 transition ${
                view === 'exchanges'
                  ? 'bg-[#F2EFFF] text-[#6D44F2]'
                  : 'text-[#737373] hover:bg-[#F4F4F5] hover:text-[#7C5CFC]'
              }`}
              aria-label="我的交换"
            >
              <BellIcon />
            </button>
            <button
              onClick={onAccount}
              className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 transition hover:bg-[#F4F4F5]"
              aria-label="我的账户"
            >
              <Avatar name={me?.name ?? '我'} size={34} />
              <span className="text-sm font-medium text-[#18181B]">我的账户</span>
            </button>
          </div>
        </div>
      </header>

      {/* ---------------- Mobile bottom tab ---------------- */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#EAEAEA] bg-white/90 backdrop-blur-md md:hidden">
        <div className="mx-auto flex max-w-md items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
          {BOTTOM_TABS.map((t) => {
            const active = activeSection(view, history) === t.key;
            return (
              <button
                key={t.key}
                onClick={() => onNavigate(t.key)}
                className="flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium"
              >
                <t.Icon
                  width={21}
                  height={21}
                  className={active ? 'text-brand-600' : 'text-[#A1A1AA]'}
                />
                <span className={active ? 'text-brand-600' : 'text-[#A1A1AA]'}>{t.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
