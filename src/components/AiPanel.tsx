import type { ReactNode } from 'react';
import { SparkIcon } from './Icons';

/**
 * 统一的 AI 模块容器：仅用一个克制的 spark 图标 + 极小的「AI」标记，
 * 不引入 AI 头像 / 聊天机器人，只作为「辅助解释 / 建议」的视觉归属。
 * 标题一律用人话，不写「智能 / 系统 / 推荐」等产品套话。
 */
export default function AiPanel({
  title,
  children,
  footer,
}: {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <section className="mt-4 overflow-hidden rounded-2xl border border-[#EAEAEA] bg-white">
      <header className="flex items-center gap-2 border-b border-[#f0ebe2] bg-[#F7F7F7] px-5 py-3">
        <SparkIcon width={16} height={16} className="text-[#7C5CFC]" />
        <span className="text-sm font-semibold text-[#18181B]">{title}</span>
        <span className="ml-auto rounded-full bg-[#F5F3FF] px-2 py-0.5 text-[10px] font-semibold text-[#6D44F2]">
          AI
        </span>
      </header>
      <div className="p-5">{children}</div>
      {footer && <div className="border-t border-[#f0ebe2] px-5 py-3">{footer}</div>}
    </section>
  );
}
