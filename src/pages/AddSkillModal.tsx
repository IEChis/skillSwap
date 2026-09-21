import { useEffect, useState } from 'react';
import { useApp } from '../store';
import Modal from '../components/Modal';
import { CATEGORIES } from '../data/skills';
import type {
  Category,
  Method,
  Proficiency,
  TeachLevel,
  LearnLevel,
} from '../types';

const METHODS: Method[] = ['线上', '线下', '都可以'];

export default function AddSkillModal() {
  const { addSkillModal, closeAddSkill, me, addTeachSkill, updateTeachSkill, addLearnSkill, updateLearnSkill, toast } =
    useApp();
  const { open, mode, editId } = addSkillModal;

  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('编程');
  const [proficiency, setProficiency] = useState<Proficiency>('熟练');
  const [canTeach, setCanTeach] = useState<TeachLevel>('都可以');
  const [content, setContent] = useState('');
  const [method, setMethod] = useState<Method>('都可以');
  const [availableTime, setAvailableTime] = useState('周末 / 工作日晚间');
  const [currentLevel, setCurrentLevel] = useState<LearnLevel>('零基础');
  const [goal, setGoal] = useState('');
  const [weeklyTime, setWeeklyTime] = useState('每周 1-2 小时');

  // reset / prefill when the modal opens or its target changes
  useEffect(() => {
    if (!open || !me) return;
    if (editId) {
      if (mode === 'teach') {
        const s = me.canTeach.find((x) => x.id === editId);
        if (s) {
          setName(s.name);
          setCategory(s.category);
          setProficiency(s.proficiency);
          setCanTeach(s.canTeach);
          setContent(s.content);
          setMethod(s.method);
          setAvailableTime(s.availableTime);
        }
      } else {
        const s = me.wantToLearn.find((x) => x.id === editId);
        if (s) {
          setName(s.name);
          setCategory(s.category);
          setCurrentLevel(s.currentLevel);
          setGoal(s.goal);
          setMethod(s.preferredMethod);
          setWeeklyTime(s.weeklyTime);
        }
      }
    } else {
      setName('');
      setCategory('编程');
      setProficiency('熟练');
      setCanTeach('都可以');
      setContent('');
      setMethod('都可以');
      setAvailableTime('周末 / 工作日晚间');
      setCurrentLevel('零基础');
      setGoal('');
      setWeeklyTime('每周 1-2 小时');
    }
  }, [open, editId, mode, me]);

  const submit = () => {
    if (!name.trim()) {
      toast('请填写技能名称', 'error');
      return;
    }
    if (mode === 'teach') {
      const payload = {
        name: name.trim(),
        category,
        proficiency,
        canTeach,
        content: content.trim() || '可分享基础到进阶内容',
        method,
        availableTime: availableTime.trim() || '待协商',
      };
      if (editId) updateTeachSkill(editId, payload);
      else addTeachSkill(payload);
    } else {
      const payload = {
        name: name.trim(),
        category,
        currentLevel,
        goal: goal.trim() || '能进行基础应用',
        preferredMethod: method,
        weeklyTime: weeklyTime.trim() || '待协商',
      };
      if (editId) updateLearnSkill(editId, payload);
      else addLearnSkill(payload);
    }
    toast(editId ? '已更新' : mode === 'teach' ? '技能已发布' : '学习需求已发布', 'success');
    closeAddSkill();
  };

  const MethodChips = (
    <div className="flex gap-2">
      {METHODS.map((m) => (
        <button
          key={m}
          type="button"
          className={`chip ${method === m ? 'chip-active' : 'border-[#EAEAEA] text-[#525252]'}`}
          onClick={() => setMethod(m)}
        >
          {m}
        </button>
      ))}
    </div>
  );

  return (
    <Modal
      open={open}
      onClose={closeAddSkill}
      title={mode === 'teach' ? (editId ? '编辑技能' : '添加我能教的') : editId ? '编辑需求' : '添加我想学的'}
      maxWidth={500}
    >
      <div className="space-y-4">
        <div>
          <label className="label">技能名称</label>
          <input className="input" placeholder="例如：Python、摄影、英语口语" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="label">技能分类</label>
          <select className="input" value={category} onChange={(e) => setCategory(e.target.value as Category)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {mode === 'teach' ? (
          <>
            <div>
              <label className="label">熟练程度</label>
              <select className="input" value={proficiency} onChange={(e) => setProficiency(e.target.value as Proficiency)}>
                <option>入门</option>
                <option>熟练</option>
                <option>精通</option>
              </select>
            </div>
            <div>
              <label className="label">可以教授的内容</label>
              <input className="input" placeholder="例如：从语法到项目实战" value={content} onChange={(e) => setContent(e.target.value)} />
            </div>
            <div>
              <label className="label">愿意帮助</label>
              <select className="input" value={canTeach} onChange={(e) => setCanTeach(e.target.value as TeachLevel)}>
                <option>入门</option>
                <option>进阶</option>
                <option>都可以</option>
              </select>
            </div>
            <div>
              <label className="label">授课方式</label>
              {MethodChips}
            </div>
            <div>
              <label className="label">可提供时间</label>
              <input className="input" placeholder="例如：周末全天" value={availableTime} onChange={(e) => setAvailableTime(e.target.value)} />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="label">目前水平</label>
              <select className="input" value={currentLevel} onChange={(e) => setCurrentLevel(e.target.value as LearnLevel)}>
                <option>零基础</option>
                <option>入门</option>
                <option>进阶</option>
              </select>
            </div>
            <div>
              <label className="label">学习目标</label>
              <input className="input" placeholder="例如：能弹唱简单歌曲" value={goal} onChange={(e) => setGoal(e.target.value)} />
            </div>
            <div>
              <label className="label">希望方式</label>
              {MethodChips}
            </div>
            <div>
              <label className="label">每周可投入时间</label>
              <input className="input" placeholder="例如：每周 2 小时" value={weeklyTime} onChange={(e) => setWeeklyTime(e.target.value)} />
            </div>
          </>
        )}

        <div className="flex gap-3 pt-2">
          <button className="btn-outline flex-1" onClick={closeAddSkill}>
            取消
          </button>
          <button className="btn-primary flex-1" onClick={submit}>
            {editId ? '保存' : mode === 'teach' ? '发布技能' : '发布学习需求'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
