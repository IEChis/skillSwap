import { useEffect, useRef, useState } from 'react';
import { useApp } from '../store';
import { computeMatch } from '../utils/matching';
import { generateMatchReason, generateExchangePlan, type ExchangePlan } from '../utils/ai';
import Avatar from '../components/Avatar';
import AiPanel from '../components/AiPanel';
import { ArrowLeftIcon, CheckIcon, SwapIcon, CheckCircleIcon, ClockIcon } from '../components/Icons';
import { StarDoodle } from '../components/Doodles';
import { ExchangeCard, SkillChip, ConnectionLine } from '../components/SwapPrimitives';

const PLAN_STEPS = ['正在分析双方技能…', '正在设计交换内容…', '正在生成 4 周交换计划…'];

export default function MatchDetail() {
  const { me, users, params, navigate, back } = useApp();
  const userId = params.userId as string;
  const other = users.find((u) => u.id === userId);

  const [reason, setReason] = useState<string | null>(null);
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

  // AI 匹配解释：组件挂载即基于真实数据生成（同步完成，无额外 loading）。
  useEffect(() => {
    if (!me || !other) return;
    let alive = true;
    const m0 = computeMatch(me, other);
    generateMatchReason(me, other, m0).then((t) => {
      if (alive) setReason(t);
    });
    return () => {
      alive = false;
    };
  }, [me, other, userId]);

  if (!me || !other) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center text-[#9a9082]">
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
  };

  const Lane = ({ from, to, skills, dir }: { from: string; to: string; skills: string[]; dir: 'teach' | 'learn' }) => (
    <div className="flex flex-col gap-2">
      {skills.map((s) => (
        <div key={s} className="flex items-center gap-2 text-sm">
          <span className="ex-self">{from}</span>
          <ConnectionLine to="lr" className="w-7 shrink-0" color="#c9bfae" />
          <SkillChip variant={dir === 'teach' ? 'teach' : 'learn'}>{s}</SkillChip>
          <span className="text-xs text-[#9a9082]">给</span>
          <span className="ex-self">{to}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="animate-fade mx-auto max-w-3xl px-6 py-8">
      <button
        onClick={back}
        className="mb-4 inline-flex items-center gap-1 text-sm text-[#5c5446] transition hover:text-[#6a4fe0]"
      >
        <ArrowLeftIcon width={16} height={16} /> 返回
      </button>

      {/* 你们俩刚好可以互相帮忙 —— 交换关系视觉（统一 ExchangeCard） */}
      <div className="card relative overflow-hidden p-6">
        {/* 克制点缀：仅在标题旁出现一颗小星，像产品的“标点” */}
        <StarDoodle className="twinkle absolute right-5 top-4 text-[#f2734e]" aria-hidden />

        <div className="flex items-center justify-center gap-4">
          <div className="text-center">
            <Avatar name="你" size={48} />
            <p className="mt-1 text-xs font-bold text-[#211c16]">你</p>
          </div>
          <SwapIcon width={18} height={18} className="animate-swap text-[#c9bfae]" />
          <div className="text-center">
            <Avatar name={other.name} size={48} />
            <p className="mt-1 text-xs font-bold text-[#211c16]">{other.name}</p>
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

        <h1 className="mt-5 text-center text-2xl font-extrabold text-[#211c16]">
          {bidirectional ? '你们刚好可以交换' : '你们可以凑一对'}
        </h1>
        <p className="mt-1 text-center text-sm text-[#5c5446]">
          {bidirectional
            ? `${youTeach} ↔ ${theyTeach}，听起来不错吧。`
            : m.iTeachThem.length > 0
            ? `你可以教 TA「${youTeach}」，也许还能聊更多。`
            : `TA 可以教你「${theyTeach}」，先从这里开始。`}
        </p>
        {bidirectional && (
          <div className="mt-3 flex justify-center">
            <span className="badge border border-[#e2dafb] bg-[#f1edfd] text-[#5739c4]">
              <SwapIcon width={13} height={13} /> 双向匹配
            </span>
          </div>
        )}
      </div>

      {/* 全部互补技能（细节） */}
      {(m.iTeachThem.length > 0 || m.iLearnFromThem.length > 0) && (
        <div className="card mt-4 space-y-3 p-5">
          <p className="text-sm font-semibold text-[#211c16]">你们具体怎么换</p>
          <div className="flex flex-col gap-3">
            {m.iTeachThem.length > 0 && <Lane from="你" to={other.name} skills={m.iTeachThem} dir="teach" />}
            {m.iTeachThem.length > 0 && m.iLearnFromThem.length > 0 && (
              <div className="flex justify-center py-0.5">
                <SwapIcon width={18} height={18} className="animate-swap text-[#6a4fe0]" />
              </div>
            )}
            {m.iLearnFromThem.length > 0 && <Lane from={other.name} to="你" skills={m.iLearnFromThem} dir="learn" />}
          </div>
        </div>
      )}

      {/* AI 匹配解释 */}
      <AiPanel title="你们为什么刚好合得来？">
        {reason ? (
          <p className="text-sm leading-relaxed text-[#5c5446]">{reason}</p>
        ) : (
          <p className="text-sm text-[#b3a99a]">正在分析你们俩的技能…</p>
        )}
      </AiPanel>

      {/* 为什么刚好合得上（确定性清单，弱化分数） */}
      <div className="card mt-4 p-5">
        <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-[#211c16]">
          <CheckIcon width={15} height={15} className="text-[#6a4fe0]" /> 为什么你们刚好可以交换？
        </h2>
        <ul className="space-y-2">
          {m.reasons.map((r, i) => (
            <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-[#5c5446]">
              <CheckIcon width={16} height={16} className="mt-0.5 shrink-0 text-[#18b884]" />
              <span>{r}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-center gap-3 border-t border-[#ece6dc] pt-4">
          <div>
            <p className="text-xs text-[#9a9082]">互补指数</p>
            <p className="text-2xl font-bold text-[#6a4fe0]">{m.score}</p>
          </div>
          <span className="ml-auto rounded-full bg-[#f1edfd] px-3 py-1 text-sm font-medium text-[#5739c4]">
            {m.type}
          </span>
        </div>
      </div>

      {/* AI 交换方案 */}
      <AiPanel title="帮你搭个交换计划">
        {!planLoading && !plan && (
          <div className="text-center">
            <p className="mb-4 text-sm text-[#5c5446]">
              根据你们俩刚好互补的技能，帮你排出一份 4 周、每周对等的计划。
            </p>
            <button className="btn-primary" onClick={startPlan}>
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
                    i <= planStep ? 'text-[#211c16]' : 'text-[#b3a99a]'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      i < planStep ? 'bg-[#18b884]' : i === planStep ? 'animate-pulsering bg-[#6a4fe0]' : 'bg-[#e1d8c9]'
                    }`}
                  />
                  {s}
                  {i < planStep && <span className="ml-1 text-[#0e9c70]">完成</span>}
                  {i === planStep && <span className="ml-1 text-[#6a4fe0]">进行中</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {plan && (
          <div className="animate-rise">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#211c16]">
              <CheckCircleIcon width={18} height={18} className="text-[#18b884]" /> 技能交换计划
            </div>

            <div className="mb-4 flex items-center justify-center gap-3 rounded-xl bg-[#f1edfd] px-4 py-3 text-sm">
              <SkillChip variant="teach">{plan.youTeach} 入门</SkillChip>
              <ConnectionLine to="bi" className="w-7" />
              <SkillChip variant="learn">{plan.theyTeach} 基础</SkillChip>
            </div>

            <div className="space-y-2">
              {plan.weeks.map((w) => (
                <div
                  key={w.week}
                  className="flex items-center gap-3 rounded-xl border border-[#ece6dc] bg-white px-3 py-2.5 text-sm"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f1edfd] text-xs font-semibold text-[#5739c4]">
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

            <p className="mt-3 flex items-start gap-1.5 rounded-xl bg-[#fbf7f0] px-3 py-2 text-xs leading-relaxed text-[#5c5446]">
              <ClockIcon width={13} height={13} className="mt-0.5 shrink-0 text-[#9a9082]" />
              {plan.weeklyHours} · {plan.reciprocityNote}
            </p>

            <button className="btn-ghost mt-2 text-xs" onClick={startPlan}>
              重新生成方案
            </button>
          </div>
        )}
      </AiPanel>

      {/* actions */}
      <div className="mt-5 flex gap-3">
        <button className="btn-primary flex-1 py-3" onClick={() => navigate('exchangeOffer', { userId })}>
          试着交换一下 →
        </button>
        <button className="btn-outline flex-1 py-3" onClick={back}>
          先看看
        </button>
      </div>
    </div>
  );
}
