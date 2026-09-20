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
    <svg
      viewBox="0 -3 120 18"
      className={className}
      style={style}
      fill="none"
      preserveAspectRatio="none"
      overflow="visible"
      aria-hidden
    >
      <path
        d="M3 6c10-6 20 6 30 0s20-6 30 0 20 6 30 0 20-6 24-1"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * 记号笔手绘下划线（随手笔记涂鸦风）：
 * 主线幅度不规则、微微上下漂移，右侧叠一道短促的第二笔回描，
 * 像用记号笔随手划了两下，比规整波浪更有手写感。
 */
export function MarkerUnderline({ className, style }: D) {
  return (
    <svg
      viewBox="0 0 200 18"
      className={className}
      style={style}
      fill="none"
      preserveAspectRatio="none"
      overflow="visible"
      aria-hidden
    >
      {/* 第一笔：贯穿整句的不规则波浪 */}
      <path
        d="M3 10C18 5 30 13 47 9c14-3 22 4 38 3 15-1 21-6 38-5 14 1 20 6 36 5 13-1 24-5 38-3"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* 第二笔：右段短促回描，略微压过第一笔 */}
      <path
        d="M116 12c16-4 34-1 50 1 12 2 22 0 30-3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.75"
      />
    </svg>
  );
}

/**
 * 随手圈选线（笔记里「把这个圈出来」的一笔）：
 * 椭圆不闭合——起点在左中、终点停在左下，首尾留出明显缺口。
 */
export function CircleScribble({ className, style }: D) {
  return (
    <svg
      viewBox="0 0 100 44"
      className={className}
      style={style}
      fill="none"
      preserveAspectRatio="none"
      overflow="visible"
      aria-hidden
    >
      <path
        d="M10 23C7 11 26 4 50 4c24 0 44 7 44 19 0 12-21 19-45 19-19 0-34-4-37-12"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** 快速双横线（「在下面划两道」的强调笔） */
export function QuickLines({ className, style }: D) {
  return (
    <svg
      viewBox="0 0 120 12"
      className={className}
      style={style}
      fill="none"
      preserveAspectRatio="none"
      overflow="visible"
      aria-hidden
    >
      <path d="M4 4C32 2.5 72 5 116 3.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M16 9.5C46 8 82 10 106 8.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
}

/** 手绘小皇冠（涂鸦风，三尖一底，线条略歪） */
export function CrownDoodle({ className, style }: D) {
  return (
    <svg viewBox="0 0 36 30" className={className} style={style} fill="none" overflow="visible" aria-hidden>
      {/* 主笔：一条流畅的波浪线——左尖起笔，圆滑下凹、中尖窜高、再圆滑下凹、右尖收笔甩尾 */}
      <path
        d="M4.2 18.6C3.4 14.8 2.8 11 2.2 7.6c-.3-1.6.9-1.5 1.9-.4 2 2.3 3.9 4.9 5.8 7.3 1.5-3.7 3.3-7.3 5.9-10.5 2 3.3 3.4 7 5.6 10.4 2.3-2 4.4-4.4 7.5-6.3-1.1 4-2.3 7.9-3.9 11.6-.3.7-.9.9-1.7.8-6.2 1.2-12.5 1.2-19.1-.9Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* 闪闪发光的三笔火花：分别悬在左尖、中尖、右尖正上方，长短角度各不相同 */}
      <path d="M3.8 1.0c.1-1 .3-1.9.5-2.7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M15.6 -0.5c.2-.8.5-1.5.9-2.1" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
      <path d="M28.4 1.6c.4-.8.9-1.5 1.5-2.1" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      {/* 底部托笔：改短，收在皇冠宽度内，不再向右甩出 */}
      <path
        d="M8.2 25.8c5.8 1.4 11.8 1.3 17.6-.4"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * 手写「:-D」涂鸦：就按这串字符本来的样子画——
 * 两颗歪点（冒号）+ 一小截短线（连字符）+ 一个鼓肚的大写 D，
 * 笔画歪扭、不闭合、D 的竖笔略有倾斜，像随手写在纸边上的。
 */
export function FaceDoodle({ className, style }: D) {
  return (
    <svg viewBox="0 0 46 32" className={className} style={style} fill="none" aria-hidden>
      {/* 冒号：两颗一大一小的歪点 */}
      <path d="M5.4 9.8c.1-.8.2-1.4.4-2.1" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M5 24.2c.2-.9.4-1.6.7-2.3" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      {/* 连字符：短短一横，略上扬 */}
      <path
        d="M12.2 15.6c2-.4 4-.6 6-.5"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
      />
      {/* D：歪斜的竖笔 + 鼓出去的大肚弧，收笔甩出一点点 */}
      <path
        d="M25.6 4.6c-.9 7.4-1.2 14.9-.9 22.4"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M24.9 5.4c6.4-.8 12.9 1.8 14.9 7.2 2.1 5.7-1.7 12.1-8.3 14-2.2.6-4.4.9-6.6.8"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * 手绘放大镜（随手涂鸦风）：镜圈是宽窄不匀的歪椭圆、不闭合，
 * 叠一道更淡的回描让圆看起来是「描了两下画出来的」，
 * 镜内两道歪斜的高光短笔，手柄微弯、收笔甩出，整体明显歪头。
 */
export function MagnifierDoodle({ className, style }: D) {
  return (
    <svg viewBox="0 0 38 38" className={className} style={style} fill="none" overflow="visible" aria-hidden>
      {/* 镜圈：一圈歪椭圆，上窄下宽、左轻右重，起点终点错开留缺口 */}
      <path
        d="M15.2 3.8c-6.2-1-11.4 3.2-11.9 9-.5 6.2 4.4 10.6 10.4 10.4 5.8-.2 10.3-4.1 10-9.6-.1-2.8-1.3-5.3-3.3-7"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
      />
      {/* 回描：只在右下段补了半笔，更淡更细，像描圆时手抖又描了一下 */}
      <path
        d="M23.4 9.4c.8 1.6 1.1 3.3.9 5.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.55"
      />
      {/* 镜内高光：两道平行的斜向短笔（玻璃反光），方向一致、一长一短 */}
      <path
        d="M8.9 13.9c.3-1.9 1.3-3.6 2.8-4.8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path d="M13.7 10.8c.3-1 .8-1.9 1.5-2.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.45" />
      {/* 手柄：带一点弯的斜笔，接在镜圈外，收笔甩出 */}
      <path
        d="M21.8 21.2c2.8 2.6 5.4 5.3 8.2 8.2.5.5 1 .6 1.5.1"
        stroke="currentColor"
        strokeWidth="2.6"
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
