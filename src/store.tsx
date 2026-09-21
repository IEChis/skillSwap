import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type {
  User,
  TeachSkill,
  LearnSkill,
  Exchange,
  ExchangeStatus,
  ExchangePlan,
  MatchResult,
  ToastType,
  Category,
  Method,
  Proficiency,
  TeachLevel,
  LearnLevel,
} from './types';
import { MOCK_USERS } from './data/mockUsers';
import { loadMe, saveMe, loadExchanges, saveExchanges } from './utils/storage';
import { getMatches } from './utils/matching';
import { uid } from './utils/ui';

interface AddSkillPayload {
  name: string;
  category: Category;
  method?: Method;
}

interface AppContextValue {
  me: User | null;
  users: User[]; // candidate mock users
  allUsers: User[]; // me + mock users
  matches: MatchResult[];
  exchanges: Exchange[];
  view: string;
  params: any;
  /** 导航历史栈，供导航栏推断子页面所属的主分区 */
  history: { view: string; params: any }[];
  navigate: (view: string, params?: any) => void;
  back: () => void;
  toast: (msg: string, type?: ToastType) => void;
  toastState: { msg: string; type: ToastType } | null;
  addTeachSkill: (s: Omit<TeachSkill, 'id'>) => void;
  updateTeachSkill: (id: string, s: Omit<TeachSkill, 'id'>) => void;
  removeTeachSkill: (id: string) => void;
  addLearnSkill: (s: Omit<LearnSkill, 'id'>) => void;
  updateLearnSkill: (id: string, s: Omit<LearnSkill, 'id'>) => void;
  removeLearnSkill: (id: string) => void;
  finishOnboarding: (teach: AddSkillPayload[], learn: AddSkillPayload[]) => void;
  createExchange: (e: {
    otherId: string;
    otherName: string;
    iTeach: string;
    iLearn: string;
    method: string;
    weekly: string;
    message: string;
    /** 在匹配详情页已生成的交换方案，随邀请一并保存 */
    plan?: ExchangePlan;
  }) => void;
  updateExchangeStatus: (id: string, status: ExchangeStatus) => void;
  removeExchange: (id: string) => void;
  sendMessage: (id: string, text: string) => void;
  /** 匹配详情页生成方案后暂存，供发起邀请时一并写入交换 */
  pendingPlans: Record<string, ExchangePlan>;
  setGeneratedPlan: (otherId: string, plan: ExchangePlan) => void;
  /** 将生成的方案写入某个交换（首次生成 / 查看方案时按需补全） */
  savePlan: (id: string, plan: ExchangePlan) => void;
  /** 方案在双方确认后若要修改，需先提交、待对方确认 */
  proposePlanEdit: (id: string, edited: ExchangePlan) => void;
  /** 确认方案：无待确认修改则直接确认；有待确认修改则采纳修改并确认 */
  confirmPlan: (id: string) => void;
  resetDemo: () => void;
  addSkillModal: { open: boolean; mode: 'teach' | 'learn'; editId?: string };
  openAddSkill: (mode: 'teach' | 'learn', editId?: string) => void;
  closeAddSkill: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

const DEFAULT_CITY = '广州';

export function AppProvider({ children }: { children: ReactNode }) {
  const [me, setMe] = useState<User | null>(() => loadMe());
  const [exchanges, setExchanges] = useState<Exchange[]>(() => loadExchanges());
  const [pendingPlans, setPendingPlans] = useState<Record<string, ExchangePlan>>({});
  const [view, setView] = useState<string>(() => (loadMe() ? 'home' : 'onboarding'));
  const [params, setParams] = useState<any>({});
  const [history, setHistory] = useState<{ view: string; params: any }[]>([]);
  const [toastState, setToastState] = useState<{ msg: string; type: ToastType } | null>(null);
  const [addSkillModal, setAddSkillModal] = useState<{
    open: boolean;
    mode: 'teach' | 'learn';
    editId?: string;
  }>({ open: false, mode: 'teach' });

  const allUsers = useMemo<User[]>(
    () => (me ? [me, ...MOCK_USERS] : MOCK_USERS),
    [me],
  );
  const matches = useMemo<MatchResult[]>(
    () => (me ? getMatches(me, MOCK_USERS) : []),
    [me],
  );

  // ---- navigation ----
  const navigate = useCallback((next: string, p?: any) => {
    setHistory((h) => [...h, { view: next, params: p ?? {} }]);
    setView(next);
    setParams(p ?? {});
    window.scrollTo({ top: 0 });
  }, []);
  const back = useCallback(() => {
    setHistory((h) => {
      if (h.length <= 1) {
        setView('home');
        setParams({});
        return [];
      }
      // 返回上一页时连同 params（如 userId）一起恢复，避免目标页丢参数
      const prev = h[h.length - 2];
      setView(prev.view);
      setParams(prev.params ?? {});
      return h.slice(0, -1);
    });
    window.scrollTo({ top: 0 });
  }, []);

  // ---- toast ----
  const toast = useCallback((msg: string, type: ToastType = 'success') => {
    setToastState({ msg, type });
  }, []);
  useEffect(() => {
    if (!toastState) return;
    const t = setTimeout(() => setToastState(null), 2600);
    return () => clearTimeout(t);
  }, [toastState]);

  // ---- skill ops ----
  const persistMe = useCallback((next: User | null) => {
    setMe(next);
    saveMe(next);
  }, []);

  const addTeachSkill = useCallback(
    (s: Omit<TeachSkill, 'id'>) => {
      if (!me) return;
      persistMe({ ...me, canTeach: [...me.canTeach, { ...s, id: uid('t') }] });
    },
    [me, persistMe],
  );
  const updateTeachSkill = useCallback(
    (id: string, s: Omit<TeachSkill, 'id'>) => {
      if (!me) return;
      persistMe({
        ...me,
        canTeach: me.canTeach.map((x) => (x.id === id ? { ...s, id } : x)),
      });
    },
    [me, persistMe],
  );
  const removeTeachSkill = useCallback(
    (id: string) => {
      if (!me) return;
      persistMe({ ...me, canTeach: me.canTeach.filter((x) => x.id !== id) });
    },
    [me, persistMe],
  );
  const addLearnSkill = useCallback(
    (s: Omit<LearnSkill, 'id'>) => {
      if (!me) return;
      persistMe({ ...me, wantToLearn: [...me.wantToLearn, { ...s, id: uid('l') }] });
    },
    [me, persistMe],
  );
  const updateLearnSkill = useCallback(
    (id: string, s: Omit<LearnSkill, 'id'>) => {
      if (!me) return;
      persistMe({
        ...me,
        wantToLearn: me.wantToLearn.map((x) => (x.id === id ? { ...s, id } : x)),
      });
    },
    [me, persistMe],
  );
  const removeLearnSkill = useCallback(
    (id: string) => {
      if (!me) return;
      persistMe({ ...me, wantToLearn: me.wantToLearn.filter((x) => x.id !== id) });
    },
    [me, persistMe],
  );

  const finishOnboarding = useCallback(
    (teach: AddSkillPayload[], learn: AddSkillPayload[]) => {
      const canTeach: TeachSkill[] = teach.map((t, i) => ({
        id: uid('t'),
        name: t.name,
        category: t.category,
        proficiency: '熟练' as Proficiency,
        canTeach: '都可以' as TeachLevel,
        content: '可分享基础到进阶内容',
        method: t.method ?? '都可以',
        availableTime: '周末 / 工作日晚间',
      }));
      const wantToLearn: LearnSkill[] = learn.map((l) => ({
        id: uid('l'),
        name: l.name,
        category: l.category,
        currentLevel: '零基础' as LearnLevel,
        goal: '能进行基础应用',
        preferredMethod: l.method ?? '都可以',
        weeklyTime: '每周 1-2 小时',
      }));
      const newMe: User = {
        id: 'me',
        name: '我',
        bio: '技能互换新成员，正在寻找互补的技能伙伴。',
        city: DEFAULT_CITY,
        canTeach,
        wantToLearn,
        isCurrentUser: true,
      };
      persistMe(newMe);
      navigate('home');
    },
    [persistMe, navigate],
  );

  // ---- exchanges ----
  const createExchange = useCallback(
    (e: {
      otherId: string;
      otherName: string;
      iTeach: string;
      iLearn: string;
      method: string;
      weekly: string;
      message: string;
      plan?: ExchangePlan;
    }) => {
      const plan = e.plan ?? pendingPlans[e.otherId];
      const ex: Exchange = {
        id: uid('ex'),
        meId: 'me',
        otherId: e.otherId,
        otherName: e.otherName,
        otherAvatar: e.otherName,
        iTeach: e.iTeach,
        iLearn: e.iLearn,
        method: e.method,
        weekly: e.weekly,
        message: e.message,
        status: 'pending',
        direction: 'out',
        plan: plan ? { ...plan, confirmed: false, pendingEdit: null } : undefined,
        createdAt: Date.now(),
        messages: [
          { from: 'me', text: e.message, at: Date.now() },
          { from: 'them', text: `收到你的交换邀请啦，我们聊聊「${e.iTeach} × ${e.iLearn}」吧～`, at: Date.now() + 1000 },
        ],
      };
      const next = [ex, ...exchanges];
      setExchanges(next);
      saveExchanges(next);
      // 该对象的临时方案已写入交换，清除缓存
      if (pendingPlans[e.otherId]) {
        setPendingPlans((p) => {
          const { [e.otherId]: _drop, ...rest } = p;
          return rest;
        });
      }
      toast('交换邀请已发送', 'success');
    },
    [exchanges, pendingPlans, toast],
  );

  const setGeneratedPlan = useCallback((otherId: string, plan: ExchangePlan) => {
    setPendingPlans((p) => ({ ...p, [otherId]: plan }));
  }, []);

  const savePlan = useCallback(
    (id: string, plan: ExchangePlan) => {
      const next = exchanges.map((x) =>
        x.id === id ? { ...x, plan: { ...plan, confirmed: x.plan?.confirmed ?? false, pendingEdit: x.plan?.pendingEdit ?? null } } : x,
      );
      setExchanges(next);
      saveExchanges(next);
    },
    [exchanges],
  );

  const confirmPlan = useCallback(
    (id: string) => {
      const next = exchanges.map((x) => {
        if (x.id !== id || !x.plan) return x;
        // 有待确认修改则采纳修改并确认；否则直接确认当前方案
        const adopted = x.plan.pendingEdit ?? x.plan;
        return { ...x, plan: { ...adopted, confirmed: true, pendingEdit: null } };
      });
      setExchanges(next);
      saveExchanges(next);
      const ex = exchanges.find((x) => x.id === id);
      if (ex) toast('交换方案已确认', 'success');
    },
    [exchanges, toast],
  );

  const proposePlanEdit = useCallback(
    (id: string, edited: ExchangePlan) => {
      const next = exchanges.map((x) =>
        x.id === id && x.plan ? { ...x, plan: { ...x.plan, pendingEdit: edited } } : x,
      );
      setExchanges(next);
      saveExchanges(next);
      const ex = exchanges.find((x) => x.id === id);
      toast('方案修改已发送给对方，等待确认…', 'info');
      // 单端演示：模拟对方在 2.6s 后同意修改
      setTimeout(() => {
        setExchanges((cur) =>
          cur.map((x) => {
            if (x.id !== id || !x.plan?.pendingEdit) return x;
            return { ...x, plan: { ...x.plan.pendingEdit, confirmed: true, pendingEdit: null } };
          }),
        );
        saveExchanges(
          exchanges.map((x) =>
            x.id === id && x.plan?.pendingEdit ? { ...x, plan: { ...x.plan.pendingEdit, confirmed: true, pendingEdit: null } } : x,
          ),
        );
        if (ex) toast(`${ex.otherName} 已同意你的方案修改`, 'success');
      }, 2600);
    },
    [exchanges, toast],
  );
  const updateExchangeStatus = useCallback(
    (id: string, status: ExchangeStatus) => {
      const next = exchanges.map((x) => (x.id === id ? { ...x, status } : x));
      setExchanges(next);
      saveExchanges(next);
    },
    [exchanges],
  );
  const removeExchange = useCallback(
    (id: string) => {
      const next = exchanges.filter((x) => x.id !== id);
      setExchanges(next);
      saveExchanges(next);
    },
    [exchanges],
  );
  const sendMessage = useCallback(
    (id: string, text: string) => {
      const next = exchanges.map((x) =>
        x.id === id
          ? { ...x, messages: [...x.messages, { from: 'me' as const, text, at: Date.now() }] }
          : x,
      );
      setExchanges(next);
      saveExchanges(next);
    },
    [exchanges],
  );

  const resetDemo = useCallback(() => {
    persistMe(null);
    setExchanges([]);
    saveExchanges([]);
    setHistory([]);
    setView('onboarding');
    setParams({});
    toast('已重置，可以重新体验', 'info');
  }, [persistMe, toast]);

  // ---- add skill modal ----
  const openAddSkill = useCallback((mode: 'teach' | 'learn', editId?: string) => {
    setAddSkillModal({ open: true, mode, editId });
  }, []);
  const closeAddSkill = useCallback(() => {
    setAddSkillModal({ open: false, mode: 'teach' });
  }, []);

  const value: AppContextValue = {
    me,
    users: MOCK_USERS,
    allUsers,
    matches,
    exchanges,
    view,
    params,
    history,
    navigate,
    back,
    toast,
    toastState,
    addTeachSkill,
    updateTeachSkill,
    removeTeachSkill,
    addLearnSkill,
    updateLearnSkill,
    removeLearnSkill,
    finishOnboarding,
    createExchange,
    updateExchangeStatus,
    removeExchange,
    sendMessage,
    pendingPlans,
    setGeneratedPlan,
    savePlan,
    confirmPlan,
    proposePlanEdit,
    resetDemo,
    addSkillModal,
    openAddSkill,
    closeAddSkill,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
