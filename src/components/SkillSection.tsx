import { CATEGORY_COLOR } from '../utils/matching';
import { EditIcon, TrashIcon, PlusIcon } from './Icons';
import { SkillChip } from './SwapPrimitives';
import type { TeachSkill, LearnSkill } from '../types';

type SkillLike = { id: string; name: string; category: string };

function SkillMiniCard({
  name,
  category,
  meta,
  note,
  onEdit,
  onDelete,
}: {
  name: string;
  category: string;
  meta: string;
  note?: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const color = CATEGORY_COLOR[category as keyof typeof CATEGORY_COLOR] ?? '#7C5CFC';
  return (
    <div className="group flex items-center gap-3 border-t border-[#EAEAEA] py-3 first:border-t-0 sm:px-1">
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold"
        style={{ background: color + '14', color }}
      >
        {name[0]}
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-bold text-[#18181B]">{name}</h3>
        <p className="mt-0.5 truncate text-xs text-[#737373]">{meta}</p>
        {note && <p className="mt-0.5 line-clamp-1 text-xs text-[#A1A1AA]">{note}</p>}
      </div>
      <SkillChip variant="neutral" className="hidden shrink-0 sm:inline-flex" title={category}>
        {category}
      </SkillChip>
      <div className="flex shrink-0 gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
        <button
          className="rounded-lg p-1.5 text-[#737373] transition hover:bg-[#F4F4F5] hover:text-[#7C5CFC]"
          onClick={onEdit}
          aria-label="编辑"
        >
          <EditIcon width={16} height={16} />
        </button>
        <button
          className="rounded-lg p-1.5 text-[#737373] transition hover:bg-[#FDECEC] hover:text-[#e23b3b]"
          onClick={onDelete}
          aria-label="删除"
        >
          <TrashIcon width={16} height={16} />
        </button>
      </div>
    </div>
  );
}

/**
 * 去卡片化的技能分区：只有一条细分隔线 + 标题小圆点，不再有整块圆角卡片。
 * tone 控制教(紫)/学(橙)的语义色。compact 模式把列表换成轻盈的 chip 行（用于首页复用）。
 */
export function SkillSection<T extends SkillLike = SkillLike>({
  tone,
  title,
  subtitle,
  doodle,
  compact = false,
  onAdd,
  items,
  renderMeta,
  renderNote,
  onEdit,
  onDelete,
  emptyLabel,
}: {
  tone: 'teach' | 'learn';
  title: string;
  subtitle?: string;
  doodle?: React.ReactNode;
  compact?: boolean;
  onAdd: () => void;
  items: T[];
  renderMeta: (s: T) => string;
  renderNote?: (s: T) => string | undefined;
  onEdit: (s: T) => void;
  onDelete: (s: T) => void;
  emptyLabel: string;
}) {
  const isTeach = tone === 'teach';
  const dot = isTeach ? '#7C5CFC' : '#FF8A4C';
  const emptyCls = isTeach
    ? 'border-[#DED7FE] hover:border-[#7C5CFC] hover:text-[#7C5CFC]'
    : 'border-[#FFB98C] hover:border-[#FF8A4C] hover:text-[#FF8A4C]';

  return (
    <section className="mt-7">
      <div className="mb-3 flex items-start justify-between gap-3 border-b border-[#EAEAEA] pb-2.5">
        <div className="min-w-0">
          <h2 className="flex items-center gap-2 text-base font-bold text-[#18181B]">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: dot }} /> {title}
          </h2>
          {subtitle && (
            <p className="mt-1 flex items-center gap-1.5 text-xs text-[#737373]">
              {subtitle}
              {doodle}
            </p>
          )}
        </div>
        <button className="btn-ghost shrink-0 px-3 py-1.5 text-sm" onClick={onAdd}>
          <PlusIcon width={16} height={16} /> 添加
        </button>
      </div>

      {compact ? (
        <div className="flex flex-wrap gap-2">
          {items.map((s) => {
            const color = CATEGORY_COLOR[s.category as keyof typeof CATEGORY_COLOR] ?? '#7C5CFC';
            return (
              <span
                key={s.id}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#EAEAEA] bg-white px-3 py-1.5 text-sm text-[#18181B]"
              >
                <span className="h-2 w-2 rounded-full" style={{ background: color }} />
                {s.name}
              </span>
            );
          })}
          {items.length === 0 && (
            <button
              onClick={onAdd}
              className={`flex items-center gap-1.5 rounded-full border border-dashed px-3 py-1.5 text-sm text-[#737373] transition ${emptyCls}`}
            >
              <PlusIcon width={16} height={16} /> {emptyLabel}
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1">
          {items.map((s) => (
            <SkillMiniCard
              key={s.id}
              name={s.name}
              category={s.category}
              meta={renderMeta(s)}
              note={renderNote?.(s)}
              onEdit={() => onEdit(s)}
              onDelete={() => onDelete(s)}
            />
          ))}
          {items.length === 0 && (
            <button
              onClick={onAdd}
              className={`flex items-center justify-center gap-2 rounded-2xl border border-dashed p-5 text-sm text-[#737373] transition ${emptyCls}`}
            >
              <PlusIcon width={18} height={18} /> {emptyLabel}
            </button>
          )}
        </div>
      )}
    </section>
  );
}

export type { TeachSkill, LearnSkill };
