import { useMemo, useRef, useState } from 'react';
import { useApp } from '../store';
import { computeMatch } from '../utils/matching';
import { generateInvitation } from '../utils/ai';
import AiPanel from '../components/AiPanel';
import { ArrowLeftIcon, CheckCircleIcon, RefreshIcon, EditIcon } from '../components/Icons';
import { StarDoodle, CurlyUnderline } from '../components/Doodles';
import { ExchangeCard, SkillChip } from '../components/SwapPrimitives';
import type { Method } from '../types';

const METHODS: Method[] = ['线上', '线下', '都可以'];

export default function ExchangeOffer() {
  const { me, users, params, navigate, back, createExchange } = useApp();
  const userId = params.userId as string;
  const other = users.find((u) => u.id === userId);

  const m = useMemo(() => (me && other ? computeMatch(me, other) : null), [me, other]);

  const [method, setMethod] = useState<Method>('线上');
  const [weekly, setWeekly] = useState('1～2 小时');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  // AI 邀请生成状态
  const [aiBusy, setAiBusy] = useState(false);
  const [aiDone, setAiDone] = useState(false);
  const [variant, setVariant] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  if (!me || !other || !m) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center text-[#9a9082]">
        信息缺失。
        <button className="btn-outline ml-3" onClick={() => navigate('matches')}>
          返回
        </button>
      </div>
    );
  }

  const iTeach = m.iTeachThem[0] ?? '我的技能';
  const iLearn = m.iLearnFromThem[0] ?? '你的技能';
  const autoMessage = `嗨，发现你正在学 ${iTeach}，而我刚好会；看到你会 ${iLearn}，我也一直想学。要不要找个时间互相教一下？`;

  const runAI = async () => {
    setAiBusy(true);
    const text = await generateInvitation(me, other, m, variant);
    setMessage(text);
    setAiDone(true);
    setAiBusy(false);
  };

  const regenerate = () => {
    setVariant((v) => v + 1);
    runAI();
  };

  const editDraft = () => {
    textareaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    textareaRef.current?.focus();
  };

  const send = () => {
    createExchange({
      otherId: other.id,
      otherName: other.name,
      iTeach,
      iLearn,
      method,
      weekly,
      message: message.trim() || autoMessage,
    });
    setSent(true);
    setTimeout(() => navigate('exchanges'), 1500);
  };

  if (sent) {
    return (
      <div className="animate-fade relative mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center">
        <StarDoodle className="twinkle absolute right-10 top-20 text-[#f2734e]" aria-hidden />
        <StarDoodle
          className="twinkle absolute bottom-24 left-10 !h-3.5 !w-3.5 text-[#b9aaf7]"
          style={{ ['--d' as string]: '1s' } as React.CSSProperties}
          aria-hidden
        />
        <div className="animate-check flex h-20 w-20 items-center justify-center rounded-full bg-[#edfbf4] text-[#18b884]">
          <CheckCircleIcon width={44} height={44} />
        </div>
        <h1 className="mt-6 flex items-center gap-2 text-2xl font-extrabold text-[#211c16]">
          交换邀请已发出 <StarDoodle className="!h-4 !w-4 text-[#f2734e]" />
        </h1>
        <p className="mt-2 text-sm text-[#5c5446]">
          已经送到 {other.name} 手上啦。等 TA 回个话，你们就能开始「{iTeach} × {iLearn}」的交换了。
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade mx-auto max-w-2xl px-6 py-8">
      <button
        onClick={back}
        className="mb-4 inline-flex items-center gap-1 text-sm text-[#5c5446] transition hover:text-[#6a4fe0]"
      >
        <ArrowLeftIcon width={16} height={16} /> 返回
      </button>

      <h1 className="heading relative w-fit">
        向 {other.name} 发起技能交换
        <CurlyUnderline className="absolute -bottom-2 left-0 h-2 w-full text-[#fec9b7]" />
      </h1>

      {/* 确认式摘要：我可以教 ↔ 我想学习（统一 ExchangeCard） */}
      <div className="mt-5">
        <ExchangeCard
          leftLabel="我可以教"
          leftSkill={iTeach}
          leftVariant="teach"
          rightLabel="我想学习"
          rightSkill={iLearn}
          rightVariant="learn"
        />
      </div>

      {/* 轻量确认项 */}
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 rounded-2xl bg-[#fbf7f0] px-4 py-3 text-sm text-[#5c5446]">
        <span>
          交换方式：<span className="font-semibold text-[#211c16]">{method}</span>
        </span>
        <span>
          每周：<span className="font-semibold text-[#211c16]">{weekly}</span>
        </span>
      </div>

      {/* AI 邀请文案 */}
      <AiPanel title="帮你写个邀请">
        {!aiBusy && !aiDone && (
          <div className="text-center">
            <p className="mb-4 text-sm text-[#5c5446]">
              根据你们真实的交换关系，帮你写一段自然的邀请，你可以改一改再发。
            </p>
            <button className="btn-primary" onClick={runAI}>
              帮我写邀请
            </button>
          </div>
        )}

        {aiBusy && (
          <div className="flex items-center justify-center gap-3 py-4 text-sm text-[#5c5446]">
            <span className="spinner" />
            正在想怎么开口…
          </div>
        )}

        {!aiBusy && aiDone && (
          <div className="animate-rise">
            <div className="rounded-xl border border-[#ece6dc] bg-[#fbf7f0] p-3.5 text-sm leading-relaxed text-[#211c16]">
              {message}
            </div>
            <div className="mt-3 flex gap-2">
              <button className="btn-outline flex-1 text-sm" onClick={regenerate} disabled={aiBusy}>
                <span className="inline-flex items-center gap-1.5">
                  <RefreshIcon width={15} height={15} /> 重新生成
                </span>
              </button>
              <button className="btn-ghost flex-1 text-sm" onClick={editDraft}>
                <span className="inline-flex items-center gap-1.5">
                  <EditIcon width={15} height={15} /> 编辑
                </span>
              </button>
            </div>
          </div>
        )}
      </AiPanel>

      <div className="mt-4 space-y-4 rounded-2xl border border-[#ece6dc] bg-white p-5">
        <div>
          <label className="label">交换方式</label>
          <div className="flex gap-2">
            {METHODS.map((x) => (
              <button
                key={x}
                type="button"
                className={`chip ${method === x ? 'chip-active' : ''}`}
                onClick={() => setMethod(x)}
              >
                {x}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="label">预计每周</label>
          <input className="input" value={weekly} onChange={(e) => setWeekly(e.target.value)} />
        </div>
        <div>
          <label className="label">想说的话</label>
          <textarea
            ref={textareaRef}
            className="input min-h-[88px] resize-none"
            placeholder={autoMessage}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <p className="mt-1 text-xs text-[#9a9082]">
            {aiDone ? '已经帮你写好文案了，直接改也行。' : '留空就用上面那段默认留言。'}
          </p>
        </div>
      </div>

      <div className="mt-5 flex gap-3">
        <button className="btn-primary flex-1 py-3" onClick={send}>
          发个交换邀请 →
        </button>
        <button className="btn-ghost px-5 py-3 text-sm" onClick={back}>
          再想想
        </button>
      </div>
    </div>
  );
}
