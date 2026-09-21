import type { ReactNode } from 'react';

interface Props {
  icon?: ReactNode;
  title: string;
  desc?: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, desc, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E2E2E2] bg-[#FFFFFF] px-6 py-12 text-center">
      {icon && <div className="mb-4 text-[#d8d0fb]">{icon}</div>}
      <h3 className="text-base font-semibold text-[#18181B]">{title}</h3>
      {desc && <p className="mt-1.5 max-w-sm text-sm text-[#737373]">{desc}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
