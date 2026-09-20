import { useEffect, type ReactNode } from 'react';
import { CloseIcon } from './Icons';

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxWidth?: number;
}

export default function Modal({ open, onClose, title, children, maxWidth = 480 }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#211c16]/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="animate-pop w-full rounded-t-3xl bg-white shadow-2xl sm:rounded-2xl"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-[#f0ebe2] px-5 py-4">
            <h3 className="text-base font-semibold text-[#211c16]">{title}</h3>
            <button className="btn-ghost rounded-full p-1.5" onClick={onClose} aria-label="关闭">
              <CloseIcon width={18} height={18} />
            </button>
          </div>
        )}
        <div className="max-h-[78vh] overflow-y-auto px-5 py-5">{children}</div>
      </div>
    </div>
  );
}
