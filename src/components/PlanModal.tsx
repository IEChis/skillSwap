import { useEffect, useState } from 'react';
import { useApp } from '../store';
import { computeMatch } from '../utils/matching';
import { buildExchangePlan, type ExchangePlan } from '../utils/ai';
import type { Exchange } from '../types';
import Modal from './Modal';
import { SkillChip, ConnectionLine } from './SwapPrimitives';
import { CheckCircleIcon, ClockIcon, EditIcon } from './Icons';

function StatusBadge({ ex }: { ex: Exchange }) {
  if (ex.plan?.pendingEdit) {
    return (
      <span className="badge bg-[#EFF4FF] text-[#3B6FE0]">
        <EditIcon width={13} height={13} /> 修改待对方确认
      </span>
    );
  }
  return ex.plan?.confirmed ? (
    <span className="badge bg-success-50 text-success-700">
      <CheckCircleIcon width={13} height={13} /> 双方已确认
    </span>
  ) : (
    <span className="badge bg-[#FFF6EC] text-[#E2702F]">
      <ClockIcon width={13} height={13} /> 待双方确认
    </span>
  );
}

export default function PlanModal({ ex, onClose }: { ex: Exchange; onClose: () => void }) {
  const { me, users, savePlan, confirmPlan, proposePlanEdit } = useApp();
  const other = users.find((u) => u.id === ex.otherId);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<ExchangePlan | null>(null);

  // 旧数据没有持久化方案时，同步生成一份用于「点开即见」（纯函数、零等待），并在挂载后落库
  const canBuild = !!me && !!other;
  const fallback =
    canBuild && !ex.plan ? buildExchangePlan(me!, other!, computeMatch(me!, other!)) : null;
  const plan = ex.plan?.pendingEdit ?? ex.plan ?? fallback;

  useEffect(() => {
    if (!ex.plan && fallback) savePlan(ex.id, fallback);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ex.id, fallback]);

  const startEdit = () => {
    if (!plan) return;
    setDraft({
      youTeach: plan.youTeach,
      theyTeach: plan.theyTeach,
      weeklyHours: plan.weeklyHours,
      weeks: plan.weeks.map((w) => ({ ...w })),
      reciprocityNote: plan.reciprocityNote,
    });
    setEditing(true);
  };

  const saveEdit = () => {
    if (!draft) return;
    proposePlanEdit(ex.id, draft);
    setEditing(false);
    setDraft(null);
  };

  return (
    <Modal open={true} onClose={onClose} title="交换方案" maxWidth={640}>
      {!plan ? (
        <p className="py-10 text-center text-sm text-[#737373]">暂时没有可展示的交换方案。</p>
      ) : editing && draft ? (
        <div className="animate-rise">
          <p className="mb-3 text-sm text-[#525252]">
            修改后的方案会先发送给对方，<span className="font-semibold text-[#18181B]">经对方确认才会生效</span>。
          </p>

          <div className="mb-4 flex items-center justify-center gap-3 rounded-xl bg-[#F5F3FF] px-4 py-3 text-sm">
            <SkillChip variant="teach">{draft.youTeach} 入门</SkillChip>
            <ConnectionLine to="bi" className="w-7" />
            <SkillChip variant="learn">{draft.theyTeach} 基础</SkillChip>
          </div>

          <div className="mb-3">
            <label className="label">每周投入</label>
            <input
              className="input"
              value={draft.weeklyHours}
              onChange={(e) => setDraft({ ...draft, weeklyHours: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            {draft.weeks.map((w, i) => (
              <div key={w.week} className="rounded-xl border border-[#EAEAEA] bg-white px-3 py-2.5">
                <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-[#6D44F2]">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F5F3FF]">
                    {w.week}
                  </span>
                  第{w.week}周
                </div>
                <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center">
                <div className="flex flex-1 items-center gap-1.5">
                  <SkillChip variant="teach" className="shrink-0 whitespace-nowrap !px-2 !py-0.5 text-xs">
                    你教
                  </SkillChip>
                  <input
                    className="input min-w-0 flex-1 !py-1.5 text-xs"
                    value={w.youTopic}
                      onChange={(e) => {
                        const weeks = draft.weeks.map((x, j) => (j === i ? { ...x, youTopic: e.target.value } : x));
                        setDraft({ ...draft, weeks });
                      }}
                    />
                  </div>
                  <ConnectionLine to="bi" className="w-6 shrink-0" />
                <div className="flex flex-1 items-center gap-1.5">
                  <SkillChip variant="learn" className="shrink-0 whitespace-nowrap !px-2 !py-0.5 text-xs">
                    TA 教
                  </SkillChip>
                  <input
                    className="input min-w-0 flex-1 !py-1.5 text-xs"
                    value={w.theyTopic}
                      onChange={(e) => {
                        const weeks = draft.weeks.map((x, j) => (j === i ? { ...x, theyTopic: e.target.value } : x));
                        setDraft({ ...draft, weeks });
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <button className="btn-outline flex-1 text-sm" onClick={() => { setEditing(false); setDraft(null); }}>
              取消
            </button>
            <button className="btn-swap-cta flex-1 text-sm" onClick={saveEdit}>
              保存修改
            </button>
          </div>
        </div>
      ) : (
        <div className="animate-rise">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#18181B]">
              <CheckCircleIcon width={18} height={18} className="text-[#18b884]" /> 技能交换计划
            </div>
            <StatusBadge ex={ex} />
          </div>

          {ex.plan?.pendingEdit && (
            <p className="mb-3 flex items-start gap-1.5 rounded-xl bg-[#EFF4FF] px-3 py-2 text-xs leading-relaxed text-[#3B6FE0]">
              <EditIcon width={13} height={13} className="mt-0.5 shrink-0" />
              你提交了修改，正在等待 {ex.otherName} 确认。确认前仍按原方案执行。
            </p>
          )}

          <div className="mb-4 flex items-center justify-center gap-3 rounded-xl bg-[#F5F3FF] px-4 py-3 text-sm">
            <SkillChip variant="teach">{plan.youTeach} 入门</SkillChip>
            <ConnectionLine to="bi" className="w-7" />
            <SkillChip variant="learn">{plan.theyTeach} 基础</SkillChip>
          </div>

          <div className="space-y-2">
            {plan.weeks.map((w) => (
              <div
                key={w.week}
                className="flex items-center gap-2 rounded-xl border border-[#EAEAEA] bg-white px-3 py-2.5 text-sm sm:gap-3"
              >
                <span className="flex h-7 min-w-[3rem] shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-[#F5F3FF] px-1.5 text-xs font-semibold text-[#6D44F2]">
                  第{w.week}周
                </span>
                <div className="flex flex-1 items-center gap-1.5">
                  <SkillChip variant="teach" className="!px-2 !py-0.5 text-xs">你教 · {w.youTopic}</SkillChip>
                </div>
                <ConnectionLine to="bi" className="hidden w-6 shrink-0 sm:block" />
                <div className="flex flex-1 items-center justify-end gap-1.5">
                  <SkillChip variant="learn" className="!px-2 !py-0.5 text-xs">TA 教 · {w.theyTopic}</SkillChip>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-3 flex items-start gap-1.5 rounded-xl bg-[#F7F7F7] px-3 py-2 text-xs leading-relaxed text-[#525252]">
            <ClockIcon width={13} height={13} className="mt-0.5 shrink-0 text-[#737373]" />
            {plan.weeklyHours} · {plan.reciprocityNote}
          </p>

          {!ex.plan?.pendingEdit && (
            <div className="mt-4 flex gap-2">
              {!ex.plan?.confirmed && (
                <button className="btn-swap-cta flex-1 text-sm" onClick={() => confirmPlan(ex.id)}>
                  确认方案
                </button>
              )}
              <button className="btn-outline flex-1 text-sm" onClick={startEdit}>
                <span className="inline-flex items-center gap-1.5">
                  <EditIcon width={15} height={15} /> 编辑方案
                </span>
              </button>
            </div>
          )}

          {ex.plan?.pendingEdit && (
            <p className="mt-4 text-center text-xs text-[#737373]">
              等待对方确认中，可在「我的交换」稍后查看最新状态。
            </p>
          )}
        </div>
      )}
    </Modal>
  );
}
