import { useApp } from '../store';
import MySkills from '../pages/MySkills';
import MyExchanges from '../pages/MyExchanges';
import { CrownDoodle, CurvedSwapArrows } from './Doodles';

/**
 * 「我的」统一分区：标题级切换 我的技能 ⇄ 我的交换
 * - 顶栏铃铛（消息）进入的是这里的「我的交换」分栏，与「我的技能」同属一个界面，
 *   解决「铃铛进来却像另一个页面顶着『我的』高亮」的逻辑割裂
 * - 激活项为深色标题并保留各自专属涂鸦（皇冠 / 交换箭头），未激活项浅色可点击
 * - 「我的交换」标题旁展示待确认数量气泡（有新邀请时）
 */
export default function MySection({ tab }: { tab: 'mySkills' | 'exchanges' }) {
  const { navigate, exchanges } = useApp();
  const pending = exchanges.filter((e) => e.status === 'pending').length;
  const isSkills = tab === 'mySkills';

  return (
    <div className="mx-auto max-w-4xl px-6">
      <div className="flex flex-wrap items-center gap-x-10 gap-y-3 pt-8 sm:pt-10">
        <button
          onClick={() => !isSkills && navigate('mySkills')}
          className="group relative inline-block cursor-pointer"
          aria-current={isSkills}
        >
          <span
            className={`text-2xl font-bold transition-colors duration-200 ${
              isSkills ? 'text-[#18181B]' : 'text-[#B3ADA3] group-hover:text-[#6F6A60]'
            }`}
          >
            我的技能
          </span>
          {isSkills && (
            <CrownDoodle className="absolute -right-9 -top-4 w-8 rotate-[12deg] text-[#eeb64f]" />
          )}
        </button>

        <button
          onClick={() => isSkills && navigate('exchanges')}
          className="group relative inline-block cursor-pointer"
          aria-current={!isSkills}
        >
          <span
            className={`inline-flex items-center gap-2 text-2xl font-bold transition-colors duration-200 ${
              !isSkills ? 'text-[#18181B]' : 'text-[#B3ADA3] group-hover:text-[#6F6A60]'
            }`}
          >
            我的交换
            {pending > 0 && (
              <span className="rounded-full bg-[#FFE9DB] px-2 py-0.5 text-xs font-bold text-[#E2702F]">
                {pending}
              </span>
            )}
          </span>
          {!isSkills && (
            <CurvedSwapArrows className="absolute -right-16 -top-6 w-16 -rotate-6" />
          )}
        </button>
      </div>

      {isSkills ? <MySkills key="skills" /> : <MyExchanges key="exchanges" />}
    </div>
  );
}
