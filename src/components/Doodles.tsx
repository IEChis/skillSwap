import type { CSSProperties } from 'react';

/**
 * SkillSwap 装饰语言 —— 只用简单 SVG 线条：
 * 弧线 / 星星 / 圆点 / 手绘箭头 / 小闪电 / 交叉交换箭头。
 * 原则：每个装饰都帮助建立品牌氛围，克制使用，不做填空。
 */

interface D {
  className?: string;
  style?: CSSProperties;
}

/** 四角星光（小星星） */
export function StarDoodle({ className, style }: D) {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} className={className} style={style} fill="currentColor" aria-hidden>
      <path d="M12 2c.6 5.4 4.6 9.4 10 10-5.4.6-9.4 4.6-10 10-.6-5.4-4.6-9.4-10-10 5.4-.6 9.4-4.6 10-10Z" />
    </svg>
  );
}

/** 手绘感弧线 */
export function ArcDoodle({ className, style }: D) {
  return (
    <svg viewBox="0 0 60 30" className={className} style={style} fill="none" aria-hidden>
      <path d="M2 26C14 6 40 4 58 14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

/** 半圆弧 */
export function HalfRingDoodle({ className, style }: D) {
  return (
    <svg viewBox="0 0 24 14" className={className} style={style} fill="none" aria-hidden>
      <path d="M2 13a10 10 0 0 1 20 0" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

/** 三个小圆点 */
export function DotsDoodle({ className, style }: D) {
  return (
    <svg viewBox="0 0 36 8" className={className} style={style} fill="currentColor" aria-hidden>
      <circle cx="4" cy="4" r="3" />
      <circle cx="18" cy="4" r="3" />
      <circle cx="32" cy="4" r="3" />
    </svg>
  );
}

/** 小闪电 */
export function BoltDoodle({ className, style }: D) {
  return (
    <svg viewBox="0 0 24 24" width={14} height={14} className={className} style={style} fill="currentColor" aria-hidden>
      <path d="M13 2 5 14h6l-1 8 8-12h-6l1-8Z" />
    </svg>
  );
}

/** 手绘波浪箭头（~~~~→） */
export function SquiggleArrow({ className, style }: D) {
  return (
    <svg viewBox="0 0 70 24" className={className} style={style} fill="none" aria-hidden>
      <path
        d="M2 12c6-7 12 7 18 0s12 7 18 0 12 7 18 0"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path d="M50 5l9 7-10 4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** 波浪下划线（用于 slogan / 标题点缀） */
export function CurlyUnderline({ className, style }: D) {
  return (
    <svg viewBox="0 0 120 10" className={className} style={style} fill="none" preserveAspectRatio="none" aria-hidden>
      <path
        d="M2 6c10-6 20 6 30 0s20-6 30 0 20 6 30 0 20-6 26-1"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Hero 专用：横跨两张交换卡的连接箭头（全容器覆盖层）。
 * viewBox 与 Hero 容器（max-w-md = 448px × 320px）一一对应，
 * 两条手绘曲线分别从「我能教」卡与「我想学」卡的边缘出发，
 * 交叉后指向对方卡片，把两张卡在视觉上连成一次交换。
 */
export function CardLinkArrows({ className, style }: D) {
  return (
    <svg
      viewBox="0 0 448 320"
      preserveAspectRatio="none"
      className={className}
      style={style}
      fill="none"
      aria-hidden
    >
      <defs>
        <marker
          id="cardlink-p"
          markerUnits="userSpaceOnUse"
          markerWidth="14"
          markerHeight="14"
          refX="11"
          refY="7"
          orient="auto"
        >
          <path d="M2 2 L12 7 L2 12" stroke="#6a4fe0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </marker>
        <marker
          id="cardlink-o"
          markerUnits="userSpaceOnUse"
          markerWidth="14"
          markerHeight="14"
          refX="11"
          refY="7"
          orient="auto"
        >
          <path d="M2 2 L12 7 L2 12" stroke="#f2734e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </marker>
      </defs>
      {/* 紫：从「我能教 Python」卡右缘外侧（红框标注高度）出发 → 指向「我想学 摄影」卡左上角
          （起点离开紫色卡片，不接触） */}
      <path
        d="M195 98 C 240 94 288 132 310 180"
        stroke="#6a4fe0"
        strokeWidth="2.6"
        strokeLinecap="round"
        markerEnd="url(#cardlink-p)"
      />
      {/* 橙：从「我想学 摄影」卡左缘外侧留出间隙出发 → 向左下方绕一道更大的弧，
          再向上指向「我能教 Python」卡的底部（起点刻意离开橙色卡片，不接触） */}
      <path
        d="M256 240 C 210 252 165 196 152 136"
        stroke="#f2734e"
        strokeWidth="2.6"
        strokeLinecap="round"
        markerEnd="url(#cardlink-o)"
      />
    </svg>
  );
}

/**
 * 交叉双向交换箭头（品牌签名）：
 * 紫 → 橙 / 橙 → 紫 两条微微弯曲的手绘箭头交叉，
 * 表达「A 教 B，B 教 A」。
 */
export function CurvedSwapArrows({ className, style }: D) {
  return (
    <svg viewBox="0 0 120 92" className={className} style={style} fill="none" aria-hidden>
      {/* 紫：左下 → 右上（我教你） */}
      <path d="M22 68C34 36 76 28 96 42" stroke="#6a4fe0" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M87 34l11 7-13 5" stroke="#6a4fe0" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      {/* 橙：右上 → 左下（TA 教你） */}
      <path d="M98 30C86 62 44 70 24 56" stroke="#f2734e" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M33 64l-11-7 13-5" stroke="#f2734e" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
