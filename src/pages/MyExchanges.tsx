import { useState } from 'react';
import { useApp } from '../store';
import Avatar from '../components/Avatar';
import { ArrowLeftIcon, SendIcon, CheckIcon, ClockIcon, SwapIcon, CheckCircleIcon } from '../components/Icons';
import type { Exchange, ExchangeStatus } from '../types';

const TABS: { key: ExchangeStatus; label: string }[] = [
  { key: 'pending', label: '待确认' },
  { key: 'ongoing', label: '进行中' },
  { key: 'completed', label: '已完成' },
];

const STATUS: Record<ExchangeStatus, { label: string; cls: string }> = {
  pending: { label: '等待对方确认', cls: 'bg-[#f1ece3] text-[#5c5446]' },
  ongoing: { label: '交换进行中', cls: 'bg-brand-50 text-brand-700' },
  completed: { label: '已完成', cls: 'bg-success-50 text-success-700' },
};

function ExchangeCard({ ex }: { ex: Exchange }) {
  const { navigate, updateExchangeStatus, sendMessage } = useApp();
  const [openChat, setOpenChat] = useState(false);
  const [draft, setDraft] = useState('');

  const send = () => {
    if (!draft.trim()) return;
    sendMessage(ex.id, draft.trim());
    setDraft('');
  };

  const s = STATUS[ex.status];

  return (
    <div className="card card-hover animate-rise p-4">
      <div className="flex items-center gap-3">
        <Avatar name={ex.otherName} size={42} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#211c16]">{ex.otherName}</span>
            <span className={`badge ${s.cls}`}>{s.label}</span>
          </div>
          <div className="mt-0.5 flex items-center gap-1.5 text-sm text-[#5c5446]">
            <span className="ex-teach !px-2 !py-0.5 text-xs">{ex.iTeach}</span>
            <SwapIcon width={14} height={14} className="text-[#b3a99a]" />
            <span className="ex-learn !px-2 !py-0.5 text-xs">{ex.iLearn}</span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-[#9a9082]">
        <span className="flex items-center gap-1">
          <ClockIcon width={13} height={13} /> 预计每周 {ex.weekly}
        </span>
        <span>方式：{ex.method}</span>
      </div>

      {ex.status === 'pending' && (
        <div className="mt-3 flex gap-2">
          <button className="btn-outline flex-1 text-sm" onClick={() => navigate('matchDetail', { userId: ex.otherId })}>
            查看方案
          </button>
          <button className="btn-playful flex-1 text-sm" onClick={() => updateExchangeStatus(ex.id, 'ongoing')}>
            对方接受了
          </button>
        </div>
      )}

      {ex.status === 'ongoing' && (
        <div className="mt-3">
          <div className="flex gap-2">
            <button className="btn-outline flex-1 text-sm" onClick={() => navigate('userDetail', { userId: ex.otherId })}>
              查看对方资料
            </button>
            <button className="btn-playful flex-1 text-sm" onClick={() => setOpenChat((v) => !v)}>
              {openChat ? '收起消息' : '发送消息'}
            </button>
          </div>

          {openChat && (
            <div className="mt-3 rounded-xl border border-[#ece6dc] bg-[#fbf7f0] p-3">
              <div className="max-h-56 space-y-2 overflow-y-auto">
                {ex.messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[80%] rounded-2xl px-3 py-1.5 text-sm ${
                        msg.from === 'me'
                          ? 'rounded-br-sm bg-brand-600 text-white'
                          : 'rounded-bl-sm bg-white text-[#5c5446] shadow-card'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex gap-2">
                <input
                  className="input py-2 text-sm"
                  placeholder="写条消息…"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && send()}
                />
                <button className="btn-primary px-3" onClick={send} aria-label="发送">
                  <SendIcon width={16} height={16} />
                </button>
              </div>
            </div>
          )}

          <button
            className="btn-soft mt-2 w-full py-1.5 text-xs"
            onClick={() => updateExchangeStatus(ex.id, 'completed')}
          >
            标记本次交换已完成
          </button>
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
    <div className="animate-fade mx-auto max-w-3xl px-6 py-8 sm:py-10">
      <h1 className="section-title">我的交换</h1>

      <div className="mt-4 flex gap-1 border-b border-[#ece6dc] pb-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`relative px-3 py-2 text-sm font-medium transition ${
              tab === t.key ? 'text-brand-600' : 'text-[#9a9082] hover:text-[#5c5446]'
            }`}
          >
            {t.label}
            <span className="ml-1 text-xs text-[#b3a99a]">{counts[t.key]}</span>
            {tab === t.key && <span className="absolute inset-x-2 -bottom-2 h-0.5 rounded bg-brand-600" />}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        {list.length > 0 ? (
          list.map((ex) => <ExchangeCard key={ex.id} ex={ex} />)
        ) : (
          <div className="card flex flex-col items-center gap-3 p-10 text-center">
            <SwapIcon width={32} height={32} className="text-[#b3a99a]" />
            <p className="text-sm text-[#5c5446]">
              {tab === 'pending' && '还没有待确认的交换，去匹配页发起邀请吧。'}
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
