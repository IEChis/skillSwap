import { useEffect, useRef, useState } from 'react';
import { useApp } from '../store';
import { computeMatch } from '../utils/matching';
import { generateExchangePlan, type ExchangePlan } from '../utils/ai';
import Avatar from '../components/Avatar';
import AiPanel from '../components/AiPanel';
import { ArrowLeftIcon, SwapIcon, CheckCircleIcon, ClockIcon } from '../components/Icons';
import { StarDoodle } from '../components/Doodles';
import { ExchangeCard, SkillChip, ConnectionLine } from '../components/SwapPrimitives';

const PLAN_STEPS = ['正在分析双方技能…', '正在设计交换内容…', '正在生成 4 周交换计划…'];

export default function MatchDetail() {
  const { me, users, params, navigate, back, setGeneratedPlan } = useApp();
  const userId = params.userId as string;
  const other = users.find((u) => u.id === userId);

  const [planLoading, setPlanLoading] = useState(false);
  const [planStep, setPlanStep] = useState(0);
  const [plan, setPlan] = useState<ExchangePlan | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  if (!me || !other) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center text-[#737373]">
        未找到该用户。
        <button className="btn-outline ml-3" onClick={() => navigate('matches')}>
          返回匹配
        </button>
      </div>
    );
  }

  const m = computeMatch(me, other);
  const bidirectional = m.type === '双向互补';
  const youTeach = m.iTeachThem[0];
  const theyTeach = m.iLearnFromThem[0];

  const startPlan = async () => {
    setPlanLoading(true);
    setPlan(null);
    setPlanStep(0);
    const t1 = setTimeout(() => mounted.current && setPlanStep(1), 500);
    const t2 = setTimeout(() => mounted.current && setPlanStep(2), 1000);
    const result = await generateExchangePlan(me, other, m);
    if (!mounted.current) return;
    clearTimeout(t1);
    clearTimeout(t2);
    setPlan(result);
    setPlanLoading(false);
    if (other) setGeneratedPlan(other.id, result);
  };

  return (
    <div className="animate-fade mx-auto max-w-3xl px-6 py-8">
      <button
        onClick={back}
        className="mb-4 inline-flex items-center gap-1 text-sm text-[#525252] transition hover:text-[#7C5CFC]"
      >
        <ArrowLeftIcon width={16} height={16} /> 返回
      </button>

      {/* 你们俩刚好可以互相帮忙 —— 交换关系视觉（统一 ExchangeCard） */}
      <div className="card relative overflow-hidden p-6">
        {/* 克制点缀：仅在标题旁出现一颗小星，像产品的“标点” */}
        <StarDoodle className="twinkle absolute right-5 top-4 text-[#FF8A4C]" aria-hidden />

        <div className="flex items-center justify-center gap-4">
          <div className="text-center">
            <Avatar name="你" size={48} />
            <p className="mt-1 text-xs font-bold text-[#18181B]">你</p>
          </div>
          <SwapIcon width={18} height={18} className="animate-swap text-[#c9bfae]" />
          <div className="text-center">
            <Avatar name={other.name} size={48} />
            <p className="mt-1 text-xs font-bold text-[#18181B]">{other.name}</p>
          </div>
        </div>

        {/* 核心：你们恰好互补的交换关系 */}
        <div className="mt-5">
          {bidirectional ? (
            <ExchangeCard
              leftLabel="你 教 TA"
              leftSkill={youTeach ?? '—'}
              leftVariant="teach"
              rightLabel="TA 教你"
              rightSkill={theyTeach ?? '—'}
              rightVariant="learn"
            />
          ) : youTeach ? (
            <div className="flex justify-center">
              <SkillChip variant="teach">你教 TA · {youTeach}</SkillChip>
            </div>
          ) : (
            <div className="flex justify-center">
              <SkillChip variant="learn">TA 教你 · {theyTeach}</SkillChip>
            </div>
          )}
        </div>

        <h1 className="mt-5 text-center text-2xl font-extrabold text-[#18181B]">
          {bidirectional ? '你们刚好可以交换' : '你们可以凑一对'}
        </h1>
        <p className="mt-1 text-center text-sm text-[#525252]">
          {bidirectional
            ? `${youTeach} ↔ ${theyTeach}，听起来不错吧。`
            : m.iTeachThem.length > 0
            ? `你可以教 TA「${youTeach}」，也许还能聊更多。`
            : `TA 可以教你「${theyTeach}」，先从这里开始。`}
        </p>
        {bidirectional && (
          <div className="mt-3 flex justify-center">
            <span className="badge border border-[#e2dafb] bg-[#F5F3FF] text-[#6D44F2]">
              <SwapIcon width={13} height={13} /> 双向匹配
            </span>
          </div>
        )}
      </div>

      {/* AI 交换方案 */}
      <AiPanel title="帮你搭个交换计划">
        {!planLoading && !plan && (
          <div className="text-center">
            <p className="mb-4 text-sm text-[#525252]">
              根据你们俩刚好互补的技能，帮你排出一份 4 周、每周对等的计划。
            </p>
            <button className="btn-swap-cta" onClick={startPlan}>
              帮我搭个计划
            </button>
          </div>
        )}

        {planLoading && (
          <div className="flex flex-col items-center gap-5 py-3">
            <span className="relative flex h-12 w-12 items-center justify-center">
              <span className="absolute inset-0 animate-pulsering rounded-full bg-[#9985f2]" />
              <span className="spinner" />
            </span>
            <div className="w-full max-w-xs space-y-2">
              {PLAN_STEPS.map((s, i) => (
                <div
                  key={s}
                  className={`flex items-center gap-2 text-sm transition ${
                    i <= planStep ? 'text-[#18181B]' : 'text-[#A1A1AA]'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      i < planStep ? 'bg-[#18b884]' : i === planStep ? 'animate-pulsering bg-[#7C5CFC]' : 'bg-[#E2E2E2]'
                    }`}
                  />
                  {s}
                  {i < planStep && <span className="ml-1 text-[#0e9c70]">完成</span>}
                  {i === planStep && <span className="ml-1 text-[#7C5CFC]">进行中</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {plan && (
          <div className="animate-rise">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#18181B]">
              <CheckCircleIcon width={18} height={18} className="text-[#18b884]" /> 技能交换计划
            </div>

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
                  <ConnectionLine to="bi" className="w-6 shrink-0" />
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

            <button className="btn-ghost mt-2 text-xs" onClick={startPlan}>
              重新生成方案
            </button>
          </div>
        )}
      </AiPanel>

      {/* actions —— 居中轻胶囊主 CTA + ghost 次按钮，不再整行铺色 */}
      <div className="mt-6 flex items-center justify-center gap-3">
        <button className="btn-playful px-8 py-3 text-sm" onClick={() => navigate('exchangeOffer', { userId })}>
          试着交换一下 <span className="btn-arrow">→</span>
        </button>
        <button className="btn-ghost px-4 py-3 text-sm" onClick={back}>
          先看看
        </button>
      </div>
    </div>
  );
}
