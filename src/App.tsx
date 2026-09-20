import { useState } from 'react';
import { AppProvider, useApp } from './store';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import FindSkills from './pages/FindSkills';
import SkillDetail from './pages/SkillDetail';
import MySkills from './pages/MySkills';
import MyMatches from './pages/MyMatches';
import MatchDetail from './pages/MatchDetail';
import ExchangeOffer from './pages/ExchangeOffer';
import MyExchanges from './pages/MyExchanges';
import UserDetail from './pages/UserDetail';
import Onboarding from './pages/Onboarding';
import AddSkillModal from './pages/AddSkillModal';
import AccountModal from './pages/AccountModal';

function Toast() {
  const { toastState } = useApp();
  if (!toastState) return null;
  const color =
    toastState.type === 'error'
      ? 'bg-rose-500'
      : toastState.type === 'info'
      ? 'bg-[#211c16]'
      : 'bg-brand-600';
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex justify-center px-4 md:bottom-8">
      <div className={`animate-pop rounded-full ${color} px-5 py-2.5 text-sm font-medium text-white shadow-lg`}>
        {toastState.msg}
      </div>
    </div>
  );
}

function Shell() {
  const { view, me, navigate, toastState } = useApp();
  const [accountOpen, setAccountOpen] = useState(false);

  if (view === 'onboarding' || !me) {
    return <Onboarding />;
  }

  const renderPage = () => {
    switch (view) {
      case 'home':
        return <Home />;
      case 'find':
        return <FindSkills />;
      case 'skillDetail':
        return <SkillDetail />;
      case 'mySkills':
        return <MySkills />;
      case 'matches':
        return <MyMatches />;
      case 'matchDetail':
        return <MatchDetail />;
      case 'exchangeOffer':
        return <ExchangeOffer />;
      case 'exchanges':
        return <MyExchanges />;
      case 'userDetail':
        return <UserDetail />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Navbar view={view} onNavigate={navigate} me={me} onAccount={() => setAccountOpen(true)} />
      <main className="pb-10">{renderPage()}</main>
      <AddSkillModal />
      <AccountModal open={accountOpen} onClose={() => setAccountOpen(false)} />
      {toastState && <Toast />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
