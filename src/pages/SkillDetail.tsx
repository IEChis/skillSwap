import { useApp } from '../store';
import { norm, CATEGORY_COLOR } from '../utils/matching';
import Avatar from '../components/Avatar';
import { ArrowLeftIcon } from '../components/Icons';
import type { User } from '../types';

export default function SkillDetail() {
  const { allUsers, params, navigate, back } = useApp();
  const key = (params.skill as string) ?? '';
  const name = (params.name as string) ?? key;
  const category = params.category as keyof typeof CATEGORY_COLOR;

  const learners: User[] = allUsers.filter(
    (u) => u.id !== 'me' && u.wantToLearn.some((l) => norm(l.name) === key),
  );
  const teachers: User[] = allUsers.filter(
    (u) => u.id !== 'me' && u.canTeach.some((t) => norm(t.name) === key),
  );

  const color = category ? CATEGORY_COLOR[category] : '#4f46e5';

  const Row = ({ u, role }: { u: User; role: 'learn' | 'teach' }) => {
    const skill = role === 'learn' ? u.wantToLearn.find((l) => norm(l.name) === key) : u.canTeach.find((t) => norm(t.name) === key);
    return (
      <button
        onClick={() => navigate('userDetail', { userId: u.id })}
        className="card flex w-full items-center gap-3 p-3 text-left transition hover:shadow-soft"
      >
        <Avatar name={u.name} size={42} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-[#18181B]">{u.name}</span>
            <span className="text-xs text-[#737373]">{u.city}</span>
          </div>
          <p className="truncate text-xs text-[#737373]">{u.bio}</p>
        </div>
        {skill && (
          <span
            className="tag border text-[11px]"
            style={{ background: color + '14', color, borderColor: color + '33' }}
          >
            {role === 'learn' ? (skill as any).currentLevel ?? '想学' : (skill as any).proficiency}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="animate-fade mx-auto max-w-3xl px-6 py-8">
      <button onClick={back} className="mb-4 inline-flex items-center gap-1 text-sm text-[#525252] transition hover:text-brand-600">
        <ArrowLeftIcon width={16} height={16} /> 返回
      </button>

      <div className="card p-6">
        <span
          className="tag border"
          style={{ background: color + '14', color, borderColor: color + '33' }}
        >
          {category}
        </span>
        <h1 className="mt-3 text-3xl font-bold text-[#18181B]">{name}</h1>
        <div className="mt-3 flex gap-6 text-sm">
          <div>
            <span className="text-2xl font-bold text-[#18181B]">{learners.length}</span>
            <span className="ml-1 text-[#737373]">人想学</span>
          </div>
          <div>
            <span className="text-2xl font-bold text-[#18181B]">{teachers.length}</span>
            <span className="ml-1 text-[#737373]">人可以教</span>
          </div>
        </div>
      </div>

      <section className="mt-6">
        <h2 className="mb-3 text-lg font-semibold text-[#18181B]">想学这个技能的人</h2>
        <div className="space-y-2.5">
          {learners.length ? (
            learners.map((u) => <Row key={u.id} u={u} role="learn" />)
          ) : (
            <p className="text-sm text-[#737373]">暂无用户。</p>
          )}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="mb-3 text-lg font-semibold text-[#18181B]">可以教这个技能的人</h2>
        <div className="space-y-2.5">
          {teachers.length ? (
            teachers.map((u) => <Row key={u.id} u={u} role="teach" />)
          ) : (
            <p className="text-sm text-[#737373]">暂无用户。</p>
          )}
        </div>
      </section>
    </div>
  );
}
