import { useApp } from '../store';
import { computeMatch } from '../utils/matching';
import Avatar from '../components/Avatar';
import SkillTag from '../components/SkillTag';
import { ArrowLeftIcon, PinIcon } from '../components/Icons';

export default function UserDetail() {
  const { me, users, params, navigate, back, openAddSkill, exchanges } = useApp();
  const userId = params.userId as string;
  const user = users.find((u) => u.id === userId);

  if (!me) return null;
  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center text-[#737373]">
        未找到该用户。
        <button className="btn-outline ml-3" onClick={() => navigate('find')}>
          返回
        </button>
      </div>
    );
  }

  const m = computeMatch(me, user);
  const methods = Array.from(new Set(user.canTeach.map((t) => t.method)));
  const times = Array.from(new Set(user.canTeach.map((t) => t.availableTime)));
  // 与该用户正在进行的交换：此时不应再展示「发起交换」入口，改为引导去发消息
  const ongoingEx = exchanges.find((e) => e.otherId === user.id && e.status === 'ongoing');

  return (
    <div className="animate-fade mx-auto max-w-3xl px-6 py-8">
      <button
        onClick={back}
        className="mb-4 inline-flex items-center gap-1 text-sm text-[#525252] transition hover:text-brand-600"
      >
        <ArrowLeftIcon width={16} height={16} /> 返回
      </button>

      <div className="card flex flex-col items-center p-6 text-center sm:flex-row sm:text-left">
        <Avatar name={user.name} size={72} ring />
        <div className="mt-3 sm:ml-5 sm:mt-0">
          <h1 className="text-2xl font-bold text-[#18181B]">{user.name}</h1>
          <p className="mt-1 flex items-center justify-center gap-1 text-sm text-[#737373] sm:justify-start">
            <PinIcon width={14} height={14} /> {user.city}
          </p>
          <p className="mt-2 max-w-md text-sm text-[#525252]">{user.bio}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="card p-5">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-brand-600">
            <span className="h-2 w-2 rounded-full bg-brand-500" /> TA能教
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {user.canTeach.map((s) => (
              <SkillTag key={s.id} name={s.name} category={s.category} />
            ))}
          </div>
        </div>
        <div className="card p-5">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-accent-600">
            <span className="h-2 w-2 rounded-full bg-accent-500" /> TA想学
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {user.wantToLearn.map((s) => (
              <SkillTag key={s.id} name={s.name} category={s.category} />
            ))}
          </div>
        </div>
      </div>

      <div className="card mt-4 flex flex-wrap gap-x-8 gap-y-2 p-5 text-sm">
        <div>
          <span className="text-[#737373]">所在城市</span>
          <p className="font-medium text-[#525252]">{user.city}</p>
        </div>
        <div>
          <span className="text-[#737373]">可接受方式</span>
          <p className="font-medium text-[#525252]">{methods.join(' / ') || '待协商'}</p>
        </div>
        <div>
          <span className="text-[#737373]">可交流时间</span>
          <p className="font-medium text-[#525252]">{times.join(' / ') || '待协商'}</p>
        </div>
      </div>

      {/* relationship */}
      <div className="card mt-4 p-5">
        <h2 className="mb-3 text-sm font-semibold text-[#18181B]">你们可以怎么互相帮</h2>
        {m.type === '无匹配' ? (
          <p className="text-sm text-[#737373]">目前你们的技能暂时没有直接互补，可以继续完善技能后再次查看。</p>
        ) : (
          <div className="space-y-2">
            {m.iTeachThem.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 rounded-xl bg-[#F5F3FF] px-3 py-2.5 text-sm">
                <span className="font-medium text-[#6D44F2]">你可以教 TA</span>
                <span className="text-[#737373]">：</span>
                {m.iTeachThem.map((s) => (
                  <span key={s} className="ex-teach !px-2 !py-0.5 text-xs">{s}</span>
                ))}
              </div>
            )}
            {m.iLearnFromThem.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 rounded-xl bg-[#FFF3EC] px-3 py-2.5 text-sm">
                <span className="font-medium text-[#E2702F]">TA 可以教你</span>
                <span className="text-[#737373]">：</span>
                {m.iLearnFromThem.map((s) => (
                  <span key={s} className="ex-learn !px-2 !py-0.5 text-xs">{s}</span>
                ))}
              </div>
            )}
            <div className="mt-1 flex flex-col items-center gap-1.5">
              {ongoingEx ? (
                <>
                  <p className="text-xs text-[#737373]">
                    你们正在进行 {ongoingEx.iTeach} <span className="mx-0.5">⇄</span> {ongoingEx.iLearn} 的交换
                  </p>
                  <button className="btn-swap-cta" onClick={() => navigate('exchanges')}>
                    给 TA 发消息 <span className="btn-arrow">→</span>
                  </button>
                </>
              ) : (
                <button className="btn-swap-cta" onClick={() => navigate('exchangeOffer', { userId: user.id })}>
                  试着和 TA 交换一下 <span className="btn-arrow">→</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {!me.canTeach.length && (
        <p className="mt-3 text-center text-xs text-[#737373]">
          还没发布你能教的技能？
          <button className="ml-1 text-[#7C5CFC] hover:underline" onClick={() => openAddSkill('teach')}>
            去添加
          </button>
        </p>
      )}
    </div>
  );
}
