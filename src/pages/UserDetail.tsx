import { useApp } from '../store';
import { computeMatch } from '../utils/matching';
import Avatar from '../components/Avatar';
import SkillTag from '../components/SkillTag';
import { ArrowLeftIcon, PinIcon } from '../components/Icons';

export default function UserDetail() {
  const { me, users, params, navigate, back, openAddSkill } = useApp();
  const userId = params.userId as string;
  const user = users.find((u) => u.id === userId);

  if (!me) return null;
  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center text-[#9a9082]">
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

  return (
    <div className="animate-fade mx-auto max-w-3xl px-6 py-8">
      <button
        onClick={back}
        className="mb-4 inline-flex items-center gap-1 text-sm text-[#5c5446] transition hover:text-brand-600"
      >
        <ArrowLeftIcon width={16} height={16} /> 返回
      </button>

      <div className="card flex flex-col items-center p-6 text-center sm:flex-row sm:text-left">
        <Avatar name={user.name} size={72} ring />
        <div className="mt-3 sm:ml-5 sm:mt-0">
          <h1 className="text-2xl font-bold text-[#211c16]">{user.name}</h1>
          <p className="mt-1 flex items-center justify-center gap-1 text-sm text-[#9a9082] sm:justify-start">
            <PinIcon width={14} height={14} /> {user.city}
          </p>
          <p className="mt-2 max-w-md text-sm text-[#5c5446]">{user.bio}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="card p-5">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-brand-600">
            <span className="h-2 w-2 rounded-full bg-brand-500" /> 我能教
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {user.canTeach.map((s) => (
              <SkillTag key={s.id} name={s.name} category={s.category} />
            ))}
          </div>
        </div>
        <div className="card p-5">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-accent-600">
            <span className="h-2 w-2 rounded-full bg-accent-500" /> 我想学
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
          <span className="text-[#9a9082]">所在城市</span>
          <p className="font-medium text-[#5c5446]">{user.city}</p>
        </div>
        <div>
          <span className="text-[#9a9082]">可接受方式</span>
          <p className="font-medium text-[#5c5446]">{methods.join(' / ') || '待协商'}</p>
        </div>
        <div>
          <span className="text-[#9a9082]">可交流时间</span>
          <p className="font-medium text-[#5c5446]">{times.join(' / ') || '待协商'}</p>
        </div>
      </div>

      {/* relationship */}
      <div className="card mt-4 p-5">
        <h2 className="mb-3 text-sm font-semibold text-[#211c16]">你们可以怎么互相帮</h2>
        {m.type === '无匹配' ? (
          <p className="text-sm text-[#9a9082]">目前你们的技能暂时没有直接互补，可以继续完善技能后再次查看。</p>
        ) : (
          <div className="space-y-2">
            {m.iTeachThem.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 rounded-xl bg-[#f1edfd] px-3 py-2.5 text-sm">
                <span className="font-medium text-[#5739c4]">你可以教 TA</span>
                <span className="text-[#9a9082]">：</span>
                {m.iTeachThem.map((s) => (
                  <span key={s} className="ex-teach !px-2 !py-0.5 text-xs">{s}</span>
                ))}
              </div>
            )}
            {m.iLearnFromThem.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 rounded-xl bg-[#fdebe3] px-3 py-2.5 text-sm">
                <span className="font-medium text-[#bc4424]">TA 可以教你</span>
                <span className="text-[#9a9082]">：</span>
                {m.iLearnFromThem.map((s) => (
                  <span key={s} className="ex-learn !px-2 !py-0.5 text-xs">{s}</span>
                ))}
              </div>
            )}
            <button className="btn-primary mt-1 w-full" onClick={() => navigate('exchangeOffer', { userId: user.id })}>
              试着和 TA 交换一下 →
            </button>
          </div>
        )}
      </div>

      {!me.canTeach.length && (
        <p className="mt-3 text-center text-xs text-[#9a9082]">
          还没发布你能教的技能？
          <button className="ml-1 text-[#6a4fe0] hover:underline" onClick={() => openAddSkill('teach')}>
            去添加
          </button>
        </p>
      )}
    </div>
  );
}
