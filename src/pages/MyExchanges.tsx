import { useState } from 'react';
import { useApp } from '../store';
import Avatar from '../components/Avatar';
import { ArrowLeftIcon, SendIcon, CheckIcon, ClockIcon, SwapIcon, CheckCircleIcon } from '../components/Icons';
import PlanModal from '../components/PlanModal';
import type { Exchange, ExchangeStatus } from '../types';

const TABS: { key: ExchangeStatus; label: string }[] = [
  { key: 'pending', label: '待确认' },
  { key: 'ongoing', label: '进行中' },
  { key: 'completed', label: '已完成' },
];

const STATUS: Record<ExchangeStatus, { label: string; cls: string }> = {
  pending: { label: '等待对方确认', cls: 'bg-[#F4F4F5] text-[#525252]' },
  ongoing: { label: '交换进行中', cls: 'bg-brand-50 text-brand-700' },
  completed: { label: '已完成', cls: 'bg-success-50 text-success-700' },
};

function ExchangeCard({ ex, onAccepted }: { ex: Exchange; onAccepted?: () => void }) {
  const { navigate, updateExchangeStatus, removeExchange, sendMessage, toast } = useApp();
  const [openChat, setOpenChat] = useState(false);
  const [draft, setDraft] = useState('');
  const [showPlan, setShowPlan] = useState(false);

  const send = () => {
    if (!draft.trim()) return;
    sendMessage(ex.id, draft.trim());
    setDraft('');
  };

  const isIncoming = ex.direction === 'in';
  const s =
    ex.status === 'pending' && isIncoming
      ? { label: '等你确认', cls: 'bg-[#FFF3EC] text-[#E2702F]' }
      : STATUS[ex.status];

  return (
    <div className="card card-hover animate-rise p-4">
      <div className="flex items-center gap-3">
        <Avatar name={ex.otherName} size={42} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#18181B]">{ex.otherName}</span>
            <span className={`badge ${s.cls}`}>{s.label}</span>
          </div>
          <div className="mt-0.5 flex items-center gap-1.5 text-sm text-[#525252]">
            <span className="ex-teach !px-2 !py-0.5 text-xs">{ex.iTeach}</span>
            <SwapIcon width={14} height={14} className="text-[#A1A1AA]" />
            <span className="ex-learn !px-2 !py-0.5 text-xs">{ex.iLearn}</span>
          </div>
        </div>
        {ex.status === 'ongoing' && (
          <button
            className="inline-flex shrink-0 items-center gap-1 self-start rounded-full border border-[#EAEAEA] px-2.5 py-1 text-xs text-[#737373] transition hover:border-[#C5E3D2] hover:bg-[#F4FAF7] hover:text-[#4E8A6C]"
            onClick={() => updateExchangeStatus(ex.id, 'completed')}
          >
            <CheckIcon width={12} height={12} /> 标记完成
          </button>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-[#737373]">
        <span className="flex items-center gap-1">
          <ClockIcon width={13} height={13} /> 预计每周 {ex.weekly}
        </span>
        <span>方式：{ex.method}</span>
      </div>

      {ex.status === 'pending' && isIncoming && (
        <div className="mt-3">
          <p className="rounded-xl bg-[#F7F7F7] px-3 py-2 text-xs leading-relaxed text-[#525252]">“{ex.message}”</p>
          <div className="mt-2.5 flex items-center gap-2">
            <button
              className="btn-playful btn-playful-flip flex-[2] !py-2.5 text-sm"
              onClick={() => {
                updateExchangeStatus(ex.id, 'ongoing');
                onAccepted?.();
                toast(`已和 ${ex.otherName} 开始交换`, 'success');
              }}
            >
              接受，开始交换
            </button>
            <button
              className="btn-outline flex-1 !rounded-full !border-[1.5px] !border-[#C4C4C8] !text-[#A1A1AA] hover:!border-[#A1A1AA] hover:!text-[#71717A] !py-2.5 justify-center text-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:!bg-[#F7F7F8] hover:shadow-[0_10px_20px_-10px_rgba(82,82,82,0.22)] active:translate-y-0 active:scale-[0.98]"
              onClick={() => {
                removeExchange(ex.id);
                toast('已婉拒 TA 的邀请', 'info');
              }}
            >
              婉拒了哈
            </button>
          </div>
        </div>
      )}

      {ex.status === 'pending' && !isIncoming && (
        <div className="mt-3 flex gap-2">
          <button
            className="btn-outline flex-1 !rounded-full !border-[1.5px] !border-[#7C5CFC] !py-2.5 justify-center text-sm font-medium text-[#6D44F2] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:!bg-[#F8F6FF] hover:shadow-[0_10px_20px_-10px_rgba(124,92,252,0.5)] active:translate-y-0 active:scale-[0.98]"
            onClick={() => setShowPlan(true)}
          >
            查看方案
          </button>
          <button
            className="btn-playful flex-[2] !py-2.5 text-sm"
            onClick={() => {
              updateExchangeStatus(ex.id, 'ongoing');
              onAccepted?.();
            }}
          >
            对方接受了
          </button>
        </div>
      )}

      {showPlan && <PlanModal ex={ex} onClose={() => setShowPlan(false)} />}

      {ex.status === 'ongoing' && (
        <div className="mt-3">
          <div className="flex items-center gap-2">
            <button className="btn-outline !bg-transparent flex-1 rounded-xl text-sm" onClick={() => navigate('userDetail', { userId: ex.otherId })}>
              查看对方资料
            </button>
            <button className="btn-swap-cta !px-5 text-sm" onClick={() => setOpenChat((v) => !v)}>
              {openChat ? '收起消息' : '发送消息'}
            </button>
          </div>

          {openChat && (
            <div className="mt-3 rounded-xl border border-[#EAEAEA] bg-[#F7F7F7] p-3">
              <div className="max-h-56 space-y-2 overflow-y-auto">
                {ex.messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[80%] rounded-2xl px-3 py-1.5 text-sm ${
                        msg.from === 'me'
                          ? 'rounded-br-sm bg-brand-600 text-white'
                          : 'rounded-bl-sm bg-white text-[#525252] shadow-card'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <input
                  className="input !py-2 text-sm"
                  placeholder="写条消息…"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && send()}
                />
                <button
                  className="btn-primary !h-[38px] !w-[38px] shrink-0 !rounded-full !p-0"
                  onClick={send}
                  aria-label="发送"
                >
                  <SendIcon width={16} height={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {ex.status === 'completed' && (
        <div className="mt-3 flex items-center gap-1.5 text-sm font-medium text-success-700">
          <CheckCircleIcon width={16} height={16} /> 交换已完成，期待下次再合作！
        </div>
      )}
    </div>
  );
}

export default function MyExchanges() {
  const { exchanges, navigate } = useApp();
  const [tab, setTab] = useState<ExchangeStatus>('pending');

  const list = exchanges.filter((e) => e.status === tab);
  const counts = {
    pending: exchanges.filter((e) => e.status === 'pending').length,
    ongoing: exchanges.filter((e) => e.status === 'ongoing').length,
    completed: exchanges.filter((e) => e.status === 'completed').length,
  };

  return (
    <div className="animate-fade pb-10 pt-6 sm:pt-7">
      <div className="mt-2 flex gap-1 border-b border-[#EAEAEA] pb-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`relative px-3 py-2 text-sm font-medium transition ${
              tab === t.key ? 'text-brand-600' : 'text-[#737373] hover:text-[#525252]'
            }`}
          >
            {t.label}
            <span className="ml-1 text-xs text-[#A1A1AA]">{counts[t.key]}</span>
            {tab === t.key && <span className="absolute inset-x-2 -bottom-2 h-0.5 rounded bg-brand-600" />}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        {list.length > 0 ? (
          list.map((ex) => <ExchangeCard key={ex.id} ex={ex} onAccepted={tab === 'pending' ? () => setTab('ongoing') : undefined} />)
        ) : (
          <div className="card flex flex-col items-center gap-3 p-10 text-center">
            <SwapIcon width={32} height={32} className="text-[#A1A1AA]" />
            <p className="text-sm text-[#525252]">
              {tab === 'pending' && '暂时没有新的交换邀请，去匹配页向感兴趣的小伙伴发起邀请吧。'}
              {tab === 'ongoing' && '进行中的交换会显示在这里。'}
              {tab === 'completed' && '完成的交换会出现在这里。'}
            </p>
            {tab === 'pending' && (
              <button className="btn-playful px-6 py-2.5 text-sm" onClick={() => navigate('matches')}>
                去寻找伙伴
                <span className="btn-arrow" aria-hidden>
                  →
                </span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
