import Avatar from './Avatar';
import { SwapIcon } from './Icons';
import { SquiggleArrow, StarDoodle } from './Doodles';
import type { MatchResult } from '../types';

interface Props {
  match: MatchResult;
  onView: () => void;
  cta?: string;
}

export default function MatchCard({ match, onView, cta = '交换看看 →' }: Props) {
  const u = match.user;
  const bidirectional = match.type === '双向互补';

  // 把 cta 里的箭头拆出来，hover 时做滑动动画
  const hasArrow = cta.includes('→');
  const ctaLabel = cta.replace('→', '').trim();

  // 每一行：TA 想学 X（橙）↔ 你可以教 X（紫）/ TA 可以教 Y（紫）↔ 你想学 Y（橙）
  const teachRows = match.iTeachThem.slice(0, bidirectional ? 2 : 2);
  const learnRows = match.iLearnFromThem.slice(0, bidirectional ? 2 : 2);

  return (
    <div className="animate-rise card match-card relative flex flex-col p-5">
      {/* hover 时弹出的两颗小星星（一大一小，卡片右上角，橙星贴近红框标注位） */}
      <StarDoodle className="match-star absolute -top-3 right-9 !h-7 !w-7 text-[#FF8A4C]" aria-hidden />
      <StarDoodle
        className="match-star match-star-sm absolute top-0.5 right-5 !h-4 !w-4 text-[#C4B6FB]"
        aria-hidden
      />

      {/* 人物信息：弱化为头部 */}
      <div className="flex items-center gap-3">
        <Avatar name={u.name} size={44} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-bold text-[#18181B]">{u.name}</h3>
            <span className="shrink-0 text-xs text-[#737373]">{u.city}</span>
          </div>
          <p className="mt-0.5 line-clamp-1 text-xs text-[#525252]">{u.bio}</p>
        </div>
        {bidirectional ? (
          <span className="badge shrink-0 border border-[#DED7FE] bg-[#F5F3FF] text-[#6D44F2]">
            <SwapIcon width={12} height={12} /> 双向匹配
          </span>
        ) : (
          <span className="badge shrink-0 border border-[#EAEAEA] bg-[#F7F7F7] text-[#737373]">可以交换</span>
        )}
      </div>

      {/* 交换关系：卡片主角 */}
      <div className="match-panel mt-4 rounded-2xl bg-[#F7F7F7] p-4">
        {/* TA 想学 ←→ 你可以教 */}
        {teachRows.map((s) => (
          <div key={'t' + s} className="pair-x flex items-center justify-between gap-2 py-1">
            <div className="flex min-w-0 items-center gap-1.5">
              <span className="shrink-0 text-xs text-[#737373]">TA想学</span>
              <span className="ex-learn min-w-0 truncate !px-2.5 !py-1 text-sm">{s}</span>
            </div>
            <SquiggleArrow className="pair-swap pair-swap-flip mx-1 w-9 shrink-0 text-[#c9bfae]" />
            <div className="flex min-w-0 items-center justify-end gap-1.5">
              <span className="shrink-0 text-xs text-[#737373]">你可以教</span>
              <span className="ex-teach min-w-0 truncate !px-2.5 !py-1 text-sm">{s}</span>
            </div>
          </div>
        ))}

        {/* 双向时，中间一条手绘感的竖向点线 */}
        {teachRows.length > 0 && learnRows.length > 0 && (
          <div className="flex flex-col items-center py-0.5">
            <span className="h-2.5 border-l-2 border-dotted border-[#C4B6FB]" />
            <SwapIcon width={15} height={15} className="match-swap my-0.5 text-[#7C5CFC]" />
            <span className="h-2.5 border-l-2 border-dotted border-[#FFB98C]" />
          </div>
        )}

        {/* TA 可以教 ←→ 你想学 */}
        {learnRows.map((s) => (
          <div key={'l' + s} className="pair-x flex items-center justify-between gap-2 py-1">
            <div className="flex min-w-0 items-center gap-1.5">
              <span className="shrink-0 text-xs text-[#737373]">TA可以教</span>
              <span className="ex-teach min-w-0 truncate !px-2.5 !py-1 text-sm">{s}</span>
            </div>
            <SquiggleArrow className="pair-swap mx-1 w-9 shrink-0 -scale-x-100 text-[#c9bfae]" />
            <div className="flex min-w-0 items-center justify-end gap-1.5">
              <span className="shrink-0 text-xs text-[#737373]">你想学</span>
              <span className="ex-learn min-w-0 truncate !px-2.5 !py-1 text-sm">{s}</span>
            </div>
          </div>
        ))}

        {teachRows.length + learnRows.length < match.iTeachThem.length + match.iLearnFromThem.length && (
          <p className="mt-1 text-center text-[11px] text-[#737373]">还有更多能换的…</p>
        )}
      </div>

      {/* 底部：匹配度放次要位置，主 CTA 在右侧 */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-[#737373]">
          {bidirectional ? '你们刚好互补' : '先从这一件小事开始'}
          <span className="ml-2 opacity-70">互补指数 {match.score}</span>
        </span>
        <button onClick={onView} className="btn-playful shrink-0 px-4 py-2 text-sm">
          {ctaLabel}
          {hasArrow && <span className="btn-arrow">→</span>}
        </button>
      </div>
    </div>
  );
}
