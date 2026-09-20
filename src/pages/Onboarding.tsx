import { useState } from 'react';
import { useApp } from '../store';
import { ONBOARD_SKILLS, SAMPLE_PROFILES } from '../data/skills';
import { MOCK_USERS } from '../data/mockUsers';
import { getMatches } from '../utils/matching';
import { SparkIcon, CheckIcon, SwapIcon, CheckCircleIcon } from '../components/Icons';
import type { User, Category } from '../types';

const MAX = 5;
type Pick = { name: string; category: Category };

function buildTempUser(teach: Pick[], learn: Pick[]): User {
  return {
    id: 'me',
    name: '我',
    bio: '',
    city: '广州',
    canTeach: teach.map((t, i) => ({
      id: `t${i}`,
      name: t.name,
      category: t.category,
      proficiency: '熟练',
      canTeach: '都可以',
      content: '',
      method: '都可以',
      availableTime: '',
    })),
    wantToLearn: learn.map((l, i) => ({
      id: `l${i}`,
      name: l.name,
      category: l.category,
      currentLevel: '零基础',
      goal: '',
      preferredMethod: '都可以',
      weeklyTime: '',
    })),
  };
}

export default function Onboarding() {
  const { finishOnboarding } = useApp();
  const [step, setStep] = useState(0); // 0 teach, 1 learn, 2 loading, 3 result
  const [teach, setTeach] = useState<Pick[]>([]);
  const [learn, setLearn] = useState<Pick[]>([]);
  const [found, setFound] = useState(0);

  const toggle = (list: Pick[], set: (p: Pick[]) => void, item: Pick) => {
    if (list.some((x) => x.name === item.name)) {
      set(list.filter((x) => x.name !== item.name));
    } else if (list.length < MAX) {
      set([...list, item]);
    }
  };

  const goResult = (t: Pick[], l: Pick[]) => {
    setStep(2);
    const temp = buildTempUser(t, l);
    const count = getMatches(temp, MOCK_USERS).length;
    setFound(count);
    setTimeout(() => setStep(3), 1500);
  };

  const finish = () => finishOnboarding(teach, learn);

  if (step === 2) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="relative mb-6 flex h-20 w-20 items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-[#e9e5fd] animate-pulsering" />
          <span
            className="absolute inset-0 rounded-full bg-[#e9e5fd] animate-pulsering"
            style={{ animationDelay: '0.8s' }}
          />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#6a4fe0] text-white shadow-soft">
            <SwapIcon width={26} height={26} className="animate-swap" />
          </div>
        </div>
        <p className="text-lg font-medium text-[#211c16]">正在帮你物色刚好互补的人……</p>
        <p className="mt-2 text-sm text-[#9a9082]">很快就好</p>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="animate-check mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#edfbf4] text-[#18b884]">
          <CheckCircleIcon width={34} height={34} />
        </div>
        <h1 className="text-3xl font-bold text-[#211c16]">找到了！</h1>
        <p className="mt-3 max-w-xs text-sm text-[#5c5446]">
          你和 {found} 个人刚好可以互相帮忙。点下面进去看看都有谁。
        </p>
        <button className="btn-primary mt-7 px-8 py-3 text-[15px]" onClick={finish}>
          进去逛逛 →
        </button>
      </div>
    );
  }

  const isTeach = step === 0;
  const selected = isTeach ? teach : learn;
  const setSelected = isTeach ? setTeach : setLearn;

  const quickExperience = () => {
    setTeach(SAMPLE_PROFILES.teach as Pick[]);
    setLearn(SAMPLE_PROFILES.learn as Pick[]);
    goResult(SAMPLE_PROFILES.teach as Pick[], SAMPLE_PROFILES.learn as Pick[]);
  };

  return (
    <div className="flex min-h-screen flex-col px-6 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-8 flex items-center gap-2 text-lg font-extrabold tracking-tight text-[#211c16]">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6a4fe0] text-white">
            <SwapIcon width={18} height={18} />
          </span>
          SkillSwap
        </div>

        {/* 进度：一次只问一个 */}
        <div className="mb-6 flex items-center gap-2">
          {['你会什么', '你想学什么'].map((label, i) => (
            <div key={i} className="flex flex-1 items-center gap-2">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                  step >= i ? 'bg-[#6a4fe0] text-white' : 'bg-[#e1d8c9] text-[#9a9082]'
                }`}
              >
                {step > i ? <CheckIcon width={14} height={14} /> : i + 1}
              </div>
              <span className={`text-sm ${step >= i ? 'text-[#211c16]' : 'text-[#9a9082]'}`}>{label}</span>
            </div>
          ))}
        </div>

        <h1 className="text-2xl font-bold text-[#211c16]">
          {isTeach ? '先来认识一下你。' : '不错，那还有呢？'}
        </h1>
        <p className="mt-2 text-base text-[#5c5446]">
          {isTeach
            ? '你有什么可以拿出来交换的？随便点几个就好。'
            : '有什么东西，你一直想学？'}
          <span className="ml-1 text-sm text-[#9a9082]">已选 {selected.length}/{MAX}</span>
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {ONBOARD_SKILLS.map((s) => {
            const active = selected.some((x) => x.name === s.name);
            const disabled = !active && selected.length >= MAX;
            return (
              <button
                key={s.name}
                disabled={disabled}
                onClick={() => toggle(selected, setSelected, s)}
                className={`rounded-xl border px-3 py-3 text-sm font-medium transition active:scale-[0.97] ${
                  active
                    ? isTeach
                      ? 'border-[#6a4fe0] bg-[#f1edfd] text-[#5739c4]'
                      : 'border-[#f2734e] bg-[#fdebe3] text-[#bc4424]'
                    : disabled
                    ? 'border-[#ece6dc] text-[#c9bfae]'
                    : 'border-[#e1d8c9] text-[#5c5446] hover:border-[#6a4fe0]'
                }`}
              >
                {s.name}
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex items-center gap-3">
          {isTeach ? (
            <>
              <button className="btn-ghost" onClick={quickExperience}>
                快速体验
              </button>
              <button
                className="btn-primary ml-auto px-6"
                disabled={teach.length === 0}
                onClick={() => setStep(1)}
              >
                下一步
              </button>
            </>
          ) : (
            <>
              <button className="btn-outline" onClick={() => setStep(0)}>
                上一步
              </button>
              <button
                className="btn-primary ml-auto px-6"
                disabled={learn.length === 0}
                onClick={() => goResult(teach, learn)}
              >
                开始找人
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
