import type { ReactNode } from 'react';

/**
 * SkillSwap 统一设计原语
 * 围绕「交换」母题：↔ 连接 / 靠近 / 互补。
 * 所有页面共用同一套 SkillChip · ConnectionLine · ExchangeCard，
 * 让技能标签、连接线、交换关系形成一致的视觉语言。
 */

/* ----------------------------------------------------------------
   SkillChip —— 统一的技能标签
   四种语义状态，颜色只用于帮助用户理解信息：
   - teach    我能教     紫
   - learn    我想学     橙
   - neutral  普通/中性  灰暖
   - matched  双向互补   紫+橙
----------------------------------------------------------------- */
export function SkillChip({
  children,
  variant = 'neutral',
  className = '',
  onClick,
  title,
  tint,
}: {
  children: ReactNode;
  variant?: 'teach' | 'learn' | 'neutral' | 'matched';
  className?: string;
  onClick?: () => void;
  title?: string;
  /** 柔和类别色（如分类色）；传入时覆盖底色/文字/边框，用于普通技能 */
  tint?: string;
}) {
  const styles: Record<typeof variant, string> = {
    teach: 'bg-[#f1edfd] text-[#5739c4] border-[#d9d0fb]',
    learn: 'bg-[#fdebe3] text-[#bc4424] border-[#fbd3c5]',
    neutral: 'bg-[#f1ece3] text-[#5c5446] border-[#ece6dc]',
    matched: 'bg-[#fbf7f0] text-[#211c16] border-[#e7ddf5]',
  };
  const tintStyle = tint
    ? { background: tint + '14', color: tint, borderColor: tint + '33' }
    : undefined;
  const Tag = onClick ? 'button' : 'span';
  return (
    <Tag
      title={title}
      onClick={onClick}
      style={tintStyle}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-sm font-bold transition ${
        onClick ? 'cursor-pointer hover:-translate-y-px' : ''
      } ${tint ? '' : styles[variant]} ${className}`}
    >
      {variant === 'matched' && (
        <span className="inline-flex">
          <span className="h-2 w-2 rounded-full bg-[#6a4fe0]" />
          <span className="-ml-1 h-2 w-2 rounded-full bg-[#f2734e]" />
        </span>
      )}
      {children}
    </Tag>
  );
}

/* ----------------------------------------------------------------
   ConnectionLine —— 统一的手绘连接线
   细、圆角、略带手绘感，不走流程图风格。
   - lr / rl：单向，箭头指向 to
   - bi      ：双向交叉（紫→橙 / 橙→紫），表达互相交换
----------------------------------------------------------------- */
export function ConnectionLine({
  to = 'lr',
  className = '',
  color = '#c9bfae',
}: {
  to?: 'lr' | 'rl' | 'bi';
  className?: string;
  color?: string;
}) {
  if (to === 'bi') {
    return (
      <svg viewBox="0 0 64 38" className={className} fill="none" aria-hidden>
        {/* 紫：上方一道弧，左 → 右（我教你） */}
        <path d="M5 14C18 4 46 4 58 13" stroke="#6a4fe0" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M51 6l8 6.5-10 3" stroke="#6a4fe0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        {/* 橙：下方一道弧，右 → 左（TA 教你） */}
        <path d="M59 24C46 34 18 34 6 25" stroke="#f2734e" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M13 32l-8-6.5 10-3" stroke="#f2734e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  const d = to === 'lr' ? 'M2 15C12 7 26 7 38 15' : 'M38 15C26 7 12 7 2 15';
  return (
    <svg viewBox="0 0 40 30" className={className} fill="none" aria-hidden>
      <path d={d} stroke={color} strokeWidth="2" strokeLinecap="round" />
      {to === 'lr' ? (
        <path d="M32 10l6 5-8 3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M8 10l-6 5 8 3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

/* ----------------------------------------------------------------
   ExchangeCard —— 最有辨识度的组件：一次交换的两面
   「我能教 X」↔「我想学 Y」，紫橙对照，中间用连接符号。
   可复用于：首页 Hero / 匹配详情 / 发起交换。
   - tilt：核心交换卡允许轻微错位旋转（灵动），普通信息卡保持规整
   - centerNode：默认双向连接线；Hero 可传入品牌交叉箭头
----------------------------------------------------------------- */
export function ExchangeCard({
  leftLabel,
  leftSkill,
  leftVariant = 'teach',
  rightLabel,
  rightSkill,
  rightVariant = 'learn',
  tilt = false,
  centerNode,
  className = '',
}: {
  leftLabel: string;
  leftSkill: string;
  leftVariant?: 'teach' | 'learn';
  rightLabel: string;
  rightSkill: string;
  rightVariant?: 'teach' | 'learn';
  tilt?: boolean;
  centerNode?: ReactNode;
  className?: string;
}) {
  const side = (label: string, skill: string, variant: 'teach' | 'learn', rotate: string) => (
    <div
      className={`flex flex-1 flex-col rounded-2xl border bg-[#fffdf9] p-4 transform-gpu will-change-transform transition-[transform,box-shadow] duration-300 ease-out ${
        variant === 'teach'
          ? 'border-[#d9d0fb] group-hover:-translate-y-1 group-hover:-translate-x-0.5 group-hover:rotate-0 group-hover:shadow-[0_16px_30px_-18px_rgba(106,79,224,0.4)]'
          : 'border-[#fbd3c5] group-hover:-translate-y-1 group-hover:translate-x-0.5 group-hover:rotate-0 group-hover:shadow-[0_16px_30px_-18px_rgba(242,115,78,0.4)]'
      } ${tilt ? rotate : ''}`}
    >
      <span className={`text-xs font-bold ${variant === 'teach' ? 'text-[#5739c4]' : 'text-[#bc4424]'}`}>
        {label}
      </span>
      <span className="mt-1.5 truncate text-lg font-extrabold text-[#211c16]">{skill}</span>
    </div>
  );

  return (
    <div className={`group flex items-stretch gap-2 sm:gap-3 ${className}`}>
      {side(leftLabel, leftSkill, leftVariant, tilt ? '-rotate-2' : '')}
      <div className="flex shrink-0 items-center justify-center">
        {centerNode ?? (
          <ConnectionLine
            to="bi"
            className="w-8 transform-gpu transition-[transform] duration-300 ease-out group-hover:rotate-6 group-hover:scale-110 sm:w-10"
          />
        )}
      </div>
      {side(rightLabel, rightSkill, rightVariant, tilt ? 'rotate-2' : '')}
    </div>
  );
}
