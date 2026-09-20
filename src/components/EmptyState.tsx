import type { ReactNode } from 'react';

interface Props {
  icon?: ReactNode;
  title: string;
  desc?: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, desc, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#e1d8c9] bg-[#fffdf8] px-6 py-12 text-center">
      {icon && <div className="mb-4 text-[#d8d0fb]">{icon}</div>}
      <h3 className="text-base font-semibold text-[#211c16]">{title}</h3>
      {desc && <p className="mt-1.5 max-w-sm text-sm text-[#9a9082]">{desc}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
