import { useState } from 'react';
import { useApp } from '../store';
import Modal from '../components/Modal';
import Avatar from '../components/Avatar';

export default function AccountModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { me, navigate, resetDemo } = useApp();
  const [confirm, setConfirm] = useState(false);

  return (
    <Modal open={open} onClose={onClose} title="我的账户" maxWidth={420}>
      {me ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Avatar name={me.name} size={52} />
            <div>
              <p className="font-semibold text-[#211c16]">{me.name}</p>
              <p className="text-xs text-[#9a9082]">{me.city}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="rounded-xl bg-[#f1edfd] py-3">
              <p className="text-xl font-bold text-[#5739c4]">{me.canTeach.length}</p>
              <p className="text-xs text-[#9a9082]">我能帮你</p>
            </div>
            <div className="rounded-xl bg-[#fdebe3] py-3">
              <p className="text-xl font-bold text-[#bc4424]">{me.wantToLearn.length}</p>
              <p className="text-xs text-[#9a9082]">我正在找</p>
            </div>
          </div>

          <button className="btn-outline w-full" onClick={() => { onClose(); navigate('mySkills'); }}>
            管理我的技能
          </button>

          {!confirm ? (
            <button className="btn-ghost w-full text-sm text-[#9a9082]" onClick={() => setConfirm(true)}>
              重置 Demo 数据
            </button>
          ) : (
            <div className="rounded-xl bg-rose-50 p-3 text-center">
              <p className="text-sm text-rose-600">确定要清空本地数据并重新开始吗？</p>
              <div className="mt-2 flex gap-2">
                <button className="btn-outline flex-1 text-sm" onClick={() => setConfirm(false)}>
                  取消
                </button>
                <button
                  className="btn flex-1 bg-rose-500 text-sm text-white hover:bg-rose-600"
                  onClick={() => { setConfirm(false); onClose(); resetDemo(); }}
                >
                  确认重置
                </button>
              </div>
            </div>
          )}
          <p className="text-center text-[11px] text-[#b3a99a]">数据仅保存在本机浏览器（localStorage）。</p>
        </div>
      ) : (
        <p className="py-6 text-center text-sm text-[#9a9082]">暂无账户信息。</p>
      )}
    </Modal>
  );
}
