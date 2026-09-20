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
      <svg viewBox="0 0 64 30" className={className} fill="none" aria-hidden>
        {/* 紫：左 → 右（我教你） */}
        <path d="M4 19C16 9 34 9 32 15" stroke="#6a4fe0" strokeWidth="2" strokeLinecap="round" />
        <path d="M26 12l6 3-4 4" stroke="#6a4fe0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {/* 橙：右 → 左（TA 教你） */}
        <path d="M60 11C48 21 30 21 32 15" stroke="#f2734e" strokeWidth="2" strokeLinecap="round" />
        <path d="M38 18l-6-3 4-4" stroke="#f2734e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
      className={`flex flex-1 flex-col rounded-2xl border p-4 ${
        variant === 'teach' ? 'border-[#d9d0fb] bg-[#f1edfd]' : 'border-[#fbd3c5] bg-[#fdebe3]'
      } ${tilt ? rotate : ''}`}
    >
      <span className={`text-xs font-bold ${variant === 'teach' ? 'text-[#5739c4]' : 'text-[#bc4424]'}`}>
        {label}
      </span>
      <span className="mt-1.5 truncate text-lg font-extrabold text-[#211c16]">{skill}</span>
    </div>
  );

  return (
    <div className={`flex items-stretch gap-2 sm:gap-3 ${className}`}>
      {side(leftLabel, leftSkill, leftVariant, tilt ? '-rotate-2' : '')}
      <div className="flex shrink-0 items-center justify-center">
        {centerNode ?? <ConnectionLine to="bi" className="w-8 sm:w-10" />}
      </div>
      {side(rightLabel, rightSkill, rightVariant, tilt ? 'rotate-2' : '')}
    </div>
  );
}
