import { useApp } from '../store';
import { CATEGORY_COLOR } from '../utils/matching';
import { EditIcon, TrashIcon, PlusIcon, SwapIcon } from '../components/Icons';
import { SquiggleArrow, HalfRingDoodle } from '../components/Doodles';
import { SkillChip } from '../components/SwapPrimitives';
import EmptyState from '../components/EmptyState';
import type { TeachSkill, LearnSkill } from '../types';

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
  const color = CATEGORY_COLOR[category as keyof typeof CATEGORY_COLOR] ?? '#6a4fe0';
  return (
    <div className="group flex items-center gap-3 border-t border-[#e9e2d6] py-3 first:border-t-0 sm:px-1">
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold"
        style={{ background: color + '14', color }}
      >
        {name[0]}
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-bold text-[#211c16]">{name}</h3>
        <p className="mt-0.5 truncate text-xs text-[#9a9082]">{meta}</p>
        {note && <p className="mt-0.5 line-clamp-1 text-xs text-[#b3a99a]">{note}</p>}
      </div>
      <SkillChip variant="neutral" className="hidden shrink-0 sm:inline-flex" title={category}>
        {category}
      </SkillChip>
      {/* 编辑/删除：桌面 hover 出现，移动端常显 */}
      <div className="flex shrink-0 gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
        <button
          className="rounded-lg p-1.5 text-[#9a9082] transition hover:bg-[#f1ece3] hover:text-[#6a4fe0]"
          onClick={onEdit}
          aria-label="编辑"
        >
          <EditIcon width={16} height={16} />
        </button>
        <button
          className="rounded-lg p-1.5 text-[#9a9082] transition hover:bg-[#fde8e8] hover:text-[#e23b3b]"
          onClick={onDelete}
          aria-label="删除"
        >
          <TrashIcon width={16} height={16} />
        </button>
      </div>
    </div>
  );
}

export default function MySkills() {
  const { me, openAddSkill, updateTeachSkill, removeTeachSkill, updateLearnSkill, removeLearnSkill, toast } = useApp();

  if (!me) return null;
  const noSkills = me.canTeach.length === 0 && me.wantToLearn.length === 0;

  return (
    <div className="animate-fade mx-auto max-w-4xl px-6 py-8 sm:py-10">
      <h1 className="section-title">我的技能</h1>
      <p className="section-sub">把你愿意教的、想学的都放进来，匹配会更准。</p>

      {noSkills && (
        <div className="mt-6">
          <EmptyState
            icon={<SwapIcon width={34} height={34} />}
            title="这里还空着"
            desc="先放一点你会的东西进来？或者挑一个你一直想学的。"
            action={
              <button className="btn-primary" onClick={() => openAddSkill('teach')}>
                加一个技能
              </button>
            }
          />
        </div>
      )}

      {/* ---------------- 我能教 ---------------- */}
      {!noSkills && (
        <section className="tint-purple mt-7 rounded-3xl p-5 sm:p-6">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-bold text-[#211c16]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#6a4fe0]" /> 我能教
              </h2>
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#9a9082]">
                这些是我可以拿出来交换的东西
                <SquiggleArrow className="w-9 text-[#b9aaf7]" />
              </p>
            </div>
            <button
              className="btn-outline shrink-0 bg-white/70 px-3 py-2 text-sm"
              onClick={() => openAddSkill('teach')}
            >
              <PlusIcon width={16} height={16} /> 添加
            </button>
          </div>
          <div className="grid grid-cols-1">
            {me.canTeach.map((s: TeachSkill) => (
              <SkillMiniCard
                key={s.id}
                name={s.name}
                category={s.category}
                meta={`${s.proficiency} · ${s.method}`}
                note={s.canTeach ? `愿意帮助：${s.canTeach}` : undefined}
                onEdit={() => openAddSkill('teach', s.id)}
                onDelete={() => {
                  removeTeachSkill(s.id);
                  toast('已删除该技能', 'info');
                }}
              />
            ))}
            {me.canTeach.length === 0 && (
              <button
                onClick={() => openAddSkill('teach')}
                className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-[#cbbfe8] bg-white/60 p-6 text-sm text-[#9a9082] transition hover:border-[#6a4fe0] hover:text-[#6a4fe0]"
              >
                <PlusIcon width={18} height={18} /> 添加我能教的
              </button>
            )}
          </div>
        </section>
      )}

      {/* ---------------- 我想学 ---------------- */}
      {!noSkills && (
        <section className="tint-orange mt-5 rounded-3xl p-5 sm:p-6">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-bold text-[#211c16]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#f2734e]" /> 我想学
              </h2>
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#9a9082]">
                这些是我正在寻找的东西
                <HalfRingDoodle className="w-5 text-[#f3b7a3]" />
              </p>
            </div>
            <button
              className="btn-outline shrink-0 bg-white/70 px-3 py-2 text-sm"
              onClick={() => openAddSkill('learn')}
            >
              <PlusIcon width={16} height={16} /> 添加
            </button>
          </div>
          <div className="grid grid-cols-1">
            {me.wantToLearn.map((s: LearnSkill) => (
              <SkillMiniCard
                key={s.id}
                name={s.name}
                category={s.category}
                meta={`${s.currentLevel} · ${s.preferredMethod}`}
                note={s.goal ? `学习目标：${s.goal}` : undefined}
                onEdit={() => openAddSkill('learn', s.id)}
                onDelete={() => {
                  removeLearnSkill(s.id);
                  toast('已删除该需求', 'info');
                }}
              />
            ))}
            {me.wantToLearn.length === 0 && (
              <button
                onClick={() => openAddSkill('learn')}
                className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-[#f3b7a3] bg-white/60 p-6 text-sm text-[#9a9082] transition hover:border-[#f2734e] hover:text-[#f2734e]"
              >
                <PlusIcon width={18} height={18} /> 添加我想学的
              </button>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
