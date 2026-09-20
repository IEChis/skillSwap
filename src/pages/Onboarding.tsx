import { useState, type CSSProperties, type ReactNode } from 'react';
import { useApp } from '../store';
import { ONBOARD_SKILLS, SAMPLE_PROFILES } from '../data/skills';
import { MOCK_USERS } from '../data/mockUsers';
import { getMatches } from '../utils/matching';
import { SwapIcon, CheckIcon } from '../components/Icons';
import { StarDoodle, ArcDoodle, CurlyUnderline, HalfRingDoodle } from '../components/Doodles';
import { ExchangeCard } from '../components/SwapPrimitives';
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

/* 与首页「开始探索」完全同款的灵动胶囊按钮：微倾 + hover 翘起 + 星星弹出 */
function PlayfulCta({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="group relative inline-block">
      <StarDoodle className="btn-star pointer-events-none absolute -right-4 -top-3 !h-4 !w-4 text-[#f2734e]" />
      <button
        onClick={onClick}
        disabled={disabled}
        className="inline-flex -rotate-1 items-center gap-2 rounded-full bg-[#6a4fe0] px-7 py-3 text-[15px] font-bold text-white shadow-[0_12px_26px_-12px_rgba(106,79,224,0.65)] transition-all duration-200 hover:-rotate-3 hover:bg-[#5a3fd0] hover:shadow-[0_16px_30px_-12px_rgba(106,79,224,0.7)] active:rotate-1 active:shadow-[0_8px_18px_-10px_rgba(106,79,224,0.6)] disabled:pointer-events-none disabled:opacity-50"
      >
        {label}
        <span className="inline-block transition-transform duration-200 group-hover:translate-x-1.5">
          →
        </span>
      </button>
    </div>
  );
}

export default function Onboarding() {
  const { finishOnboarding } = useApp();
  const [step, setStep] = useState(0); // 0 teach, 1 learn, 2 loading, 3 result
  const [teach, setTeach] = useState<Pick[]>([]);
  const [learn, setLearn] = useState<Pick[]>([]);
  const [found, setFound] = useState(0);
  const [leaving, setLeaving] = useState(false);

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

  /* 结束引导：先整页淡出上移，再挂载首页（首页自带 animate-fade 入场），
     两段动画衔接成自然的交叉过渡，而不是生硬跳页 */
  const finish = () => {
    if (leaving) return;
    setLeaving(true);
    window.setTimeout(() => finishOnboarding(teach, learn), 340);
  };

  /* 共用外壳：与首页 Hero 同款的顶部氛围渐变 + 手绘涂鸦装饰 */
  const shell = (inner: ReactNode, key: string) => (
    <div
      className={`relative min-h-screen overflow-hidden transition-all duration-300 ease-out ${
        leaving ? 'pointer-events-none -translate-y-4 opacity-0' : 'opacity-100'
      }`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-[#f3f0fd] via-[#faf6ee]/60 to-transparent" />
      <StarDoodle className="twinkle pointer-events-none absolute right-[12%] top-16 !h-5 !w-5 text-[#f2734e]" />
      <StarDoodle
        className="twinkle pointer-events-none absolute left-[8%] top-44 !h-3.5 !w-3.5 text-[#b9aaf7]"
        style={{ ['--d' as string]: '1.3s' } as CSSProperties}
      />
      <ArcDoodle className="pointer-events-none absolute bottom-14 left-[10%] w-16 text-[#d8d0fb]" />
      <HalfRingDoodle className="pointer-events-none absolute bottom-24 right-[15%] w-6 -scale-x-100 text-[#fec9b7]" />
      <div key={key} className="relative mx-auto flex min-h-screen w-full max-w-2xl flex-col px-6 py-10">
        {inner}
      </div>
    </div>
  );

  /* ---------------- 匹配中 ---------------- */
  if (step === 2) {
    return shell(
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="relative mb-6 flex h-20 w-20 items-center justify-center">
          <span className="animate-pulsering absolute inset-0 rounded-full bg-[#e9e5fd]" />
          <span
            className="animate-pulsering absolute inset-0 rounded-full bg-[#e9e5fd]"
            style={{ animationDelay: '0.8s' }}
          />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#6a4fe0] text-white shadow-soft">
            <SwapIcon width={26} height={26} className="animate-swap" />
          </div>
        </div>
        <p className="text-lg font-medium text-[#211c16]">正在帮你物色刚好互补的人……</p>
        <p className="mt-2 text-sm text-[#9a9082]">很快就好</p>
      </div>,
      'loading'
    );
  }

  /* ---------------- 结果页 ---------------- */
  if (step === 3) {
    return shell(
      <div className="animate-pop flex flex-1 flex-col items-center justify-center text-center">
        <div className="relative mb-6 flex h-20 w-20 items-center justify-center">
          <span className="animate-pulsering absolute inset-0 rounded-full bg-[#e9e5fd]" />
          <span
            className="animate-pulsering absolute inset-0 rounded-full bg-[#e9e5fd]"
            style={{ animationDelay: '0.8s' }}
          />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#c9bcf8] bg-[#f1edfd] text-[#6a4fe0]">
            <CheckIcon width={30} height={30} />
          </div>
        </div>
        <h1 className="display">找到了！</h1>
        <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-[#5c5446]">
          你和 <span className="font-bold text-[#211c16]">{found}</span>{' '}
          个人刚好可以互相帮忙，先去看看都有谁。
        </p>

        {/* 用刚选的技能预览一张交换卡，与首页 Hero 的倾斜双卡自然呼应 */}
        {teach[0] && learn[0] && (
          <div className="relative mt-7 w-full max-w-sm">
            <StarDoodle className="twinkle absolute -right-2 -top-4 !h-4 !w-4 text-[#f2734e]" />
            <StarDoodle
              className="twinkle absolute -left-3 bottom-0 !h-3 !w-3 text-[#b9aaf7]"
              style={{ ['--d' as string]: '1.1s' } as CSSProperties}
            />
            <ExchangeCard
              tilt
              leftLabel="我能教"
              leftSkill={teach[0].name}
              rightLabel="我想学"
              rightSkill={learn[0].name}
            />
          </div>
        )}

        <div className="mt-9">
          <PlayfulCta label="进去逛逛" onClick={finish} />
        </div>
      </div>,
      'result'
    );
  }

  /* ---------------- 选技能（第 1 / 2 步） ---------------- */
  const isTeach = step === 0;
  const selected = isTeach ? teach : learn;
  const setSelected = isTeach ? setTeach : setLearn;

  const quickExperience = () => {
    setTeach(SAMPLE_PROFILES.teach as Pick[]);
    setLearn(SAMPLE_PROFILES.learn as Pick[]);
    goResult(SAMPLE_PROFILES.teach as Pick[], SAMPLE_PROFILES.learn as Pick[]);
  };

  return shell(
    <>
      {/* 品牌行：与导航栏同款 logo */}
      <div className="relative mb-8 inline-flex items-center gap-2 text-lg font-extrabold tracking-tight text-[#211c16]">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#6a4fe0] text-white shadow-[0_8px_18px_-8px_rgba(106,79,224,0.6)]">
          <SwapIcon width={18} height={18} />
        </span>
        SkillSwap
        <ArcDoodle className="absolute -right-11 top-0.5 w-9 text-[#d8d0fb]" />
      </div>

      {/* 进度：胶囊步骤 + 虚线连接 */}
      <div className="mb-7 flex items-center gap-2">
        {['你会什么', '你想学什么'].map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-bold transition-all duration-200 ${
                step > i
                  ? 'bg-[#f1edfd] text-[#5739c4]'
                  : step === i
                  ? 'bg-[#6a4fe0] text-white shadow-[0_8px_18px_-8px_rgba(106,79,224,0.65)]'
                  : 'border border-[#e1d8c9] text-[#9a9082]'
              }`}
            >
              {step > i ? (
                <CheckIcon width={14} height={14} />
              ) : (
                <span className="text-xs font-extrabold">{i + 1}</span>
              )}
              {label}
            </div>
            {i === 0 && (
              <span className="h-0 w-5 border-t-2 border-dashed border-[#d9d0fb]" aria-hidden />
            )}
          </div>
        ))}
      </div>

      <h1 className="relative display !text-[clamp(1.7rem,3.4vw,2.3rem)]">
        {isTeach ? (
          <>
            先来
            <span className="relative inline-block">
              认识一下
              <CurlyUnderline className="absolute -bottom-2 left-0 h-2.5 w-full text-[#c9bcf8]" />
            </span>
            你。
          </>
        ) : (
          '那，你想学什么？'
        )}
      </h1>
      <p className="mt-3 text-[15px] text-[#5c5446]">
        {isTeach
          ? '你有什么可以拿出来交换的？随便点几个就好。'
          : '有什么东西，你一直想学？'}
        <span className="ml-1 text-sm text-[#9a9082]">
          已选 {selected.length}/{MAX}
        </span>
      </p>

      {/* 技能选项：与平台一致的圆胶囊 chip，选中带语义色 + 微倾 */}
      <div className="mt-6 flex flex-wrap gap-2.5">
        {ONBOARD_SKILLS.map((s, idx) => {
          const active = selected.some((x) => x.name === s.name);
          const disabled = !active && selected.length >= MAX;
          return (
            <button
              key={s.name}
              disabled={disabled}
              onClick={() => toggle(selected, setSelected, s)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2.5 text-sm font-bold transition-all duration-150 active:scale-95 ${
                active
                  ? isTeach
                    ? '-rotate-1 border-[#6a4fe0] bg-[#f1edfd] text-[#5739c4] shadow-[0_6px_14px_-8px_rgba(106,79,224,0.5)]'
                    : 'rotate-1 border-[#f2734e] bg-[#fdebe3] text-[#bc4424] shadow-[0_6px_14px_-8px_rgba(242,115,78,0.5)]'
                  : disabled
                  ? 'border-[#ece6dc] bg-transparent text-[#c9bfae]'
                  : `border-[#e1d8c9] bg-white text-[#5c5446] shadow-card hover:-translate-y-0.5 ${
                      isTeach ? 'hover:border-[#c9bcf8]' : 'hover:border-[#f8c0ab]'
                    } ${idx % 2 === 0 ? 'hover:-rotate-1' : 'hover:rotate-1'}`
              }`}
            >
              {active && <CheckIcon width={14} height={14} />}
              {s.name}
            </button>
          );
        })}
      </div>

      <div className="mt-auto pt-10">
        <div className="flex items-center gap-3">
          {isTeach ? (
            <>
              <button className="btn-ghost" onClick={quickExperience}>
                快速体验
              </button>
              <div className="ml-auto">
                <PlayfulCta
                  label="下一步"
                  disabled={teach.length === 0}
                  onClick={() => setStep(1)}
                />
              </div>
            </>
          ) : (
            <>
              <button className="btn-outline !bg-transparent" onClick={() => setStep(0)}>
                上一步
              </button>
              <div className="ml-auto">
                <PlayfulCta
                  label="开始找人"
                  disabled={learn.length === 0}
                  onClick={() => goResult(teach, learn)}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>,
    `step-${step}`
  );
}
