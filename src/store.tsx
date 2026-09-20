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
  }) => void;
  updateExchangeStatus: (id: string, status: ExchangeStatus) => void;
  sendMessage: (id: string, text: string) => void;
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
  const [view, setView] = useState<string>(() => (loadMe() ? 'home' : 'onboarding'));
  const [params, setParams] = useState<any>({});
  const [history, setHistory] = useState<string[]>([]);
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
    setHistory((h) => [...h, next]);
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
      const prev = h[h.length - 2];
      setView(prev);
      setParams({});
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
    }) => {
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
        createdAt: Date.now(),
        messages: [
          { from: 'me', text: e.message, at: Date.now() },
          { from: 'them', text: `收到你的交换邀请啦，我们聊聊「${e.iTeach} × ${e.iLearn}」吧～`, at: Date.now() + 1000 },
        ],
      };
      const next = [ex, ...exchanges];
      setExchanges(next);
      saveExchanges(next);
      toast('交换邀请已发送', 'success');
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
    sendMessage,
    resetDemo,
    addSkillModal,
    openAddSkill,
    closeAddSkill,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
