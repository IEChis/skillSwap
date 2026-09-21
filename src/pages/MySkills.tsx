import { useApp } from '../store';
import { SquiggleArrow, HalfRingDoodle } from '../components/Doodles';
import { SkillSection } from '../components/SkillSection';
import EmptyState from '../components/EmptyState';
import { SwapIcon } from '../components/Icons';
import type { TeachSkill, LearnSkill } from '../types';

export default function MySkills() {
  const { me, openAddSkill, removeTeachSkill, removeLearnSkill, toast } = useApp();

  if (!me) return null;
  const noSkills = me.canTeach.length === 0 && me.wantToLearn.length === 0;

  return (
    <div className="animate-fade pb-10 pt-6 sm:pt-7">
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

      {!noSkills && (
        <>
          {/* 我能教 —— 去卡片化：仅细分隔线 + 紫色小圆点 */}
          <SkillSection
            tone="teach"
            title="我能教"
            subtitle="这些是我可以拿出来交换的东西"
            doodle={<SquiggleArrow className="w-9 text-[#C4B6FB]" />}
            onAdd={() => openAddSkill('teach')}
            items={me.canTeach}
            renderMeta={(s: TeachSkill) => `${s.proficiency} · ${s.method}`}
            renderNote={(s: TeachSkill) => (s.canTeach ? `愿意帮助：${s.canTeach}` : undefined)}
            onEdit={(s) => openAddSkill('teach', s.id)}
            onDelete={(s) => {
              removeTeachSkill(s.id);
              toast('已删除该技能', 'info');
            }}
            emptyLabel="添加我能教的"
          />

          {/* 我想学 */}
          <SkillSection
            tone="learn"
            title="我想学"
            subtitle="这些是我正在寻找的东西"
            doodle={<HalfRingDoodle className="w-5 text-[#FFB98C]" />}
            onAdd={() => openAddSkill('learn')}
            items={me.wantToLearn}
            renderMeta={(s: LearnSkill) => `${s.currentLevel} · ${s.preferredMethod}`}
            renderNote={(s: LearnSkill) => (s.goal ? `学习目标：${s.goal}` : undefined)}
            onEdit={(s) => openAddSkill('learn', s.id)}
            onDelete={(s) => {
              removeLearnSkill(s.id);
              toast('已删除该需求', 'info');
            }}
            emptyLabel="添加我想学的"
          />
        </>
      )}
    </div>
  );
}
