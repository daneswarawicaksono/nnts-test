import { useState, useEffect } from 'react';
import { WelcomeView } from './views/Welcome/WelcomeView';
import { LoginView } from './views/Auth/LoginView';
import { OnboardingView } from './views/Onboarding/OnboardingView';
import { ParentDashboard } from './views/Parent/ParentDashboard';
import { CadreDashboard } from './views/Cadre/CadreDashboard';
import { DoctorDashboard } from './views/Doctor/DoctorDashboard';
import { GameSessionContainer } from './views/Game/GameSessionContainer';
import { ComponentShowcase } from './views/Dev/ComponentShowcase';
import { api } from './services/api/client';
import type { AuthSession } from './types/role';

export function App() {
  const [isDevRoute, setIsDevRoute] = useState(false);
  const [currentView, setCurrentView] = useState<'welcome' | 'login' | 'onboarding' | 'game'>('welcome');
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    // Check if user navigated to /dev or ?dev=1
    const searchParams = new URLSearchParams(window.location.search);
    const hasDevParam = searchParams.get('dev') === '1';
    const isDevPath = window.location.pathname.startsWith('/dev');
    setIsDevRoute(hasDevParam || isDevPath);

    // Check URL route parameters for direct testing / html.to.design import
    const viewParam = searchParams.get('view');
    const roleParam = searchParams.get('role');
    const tabParam = searchParams.get('tab');

    if (viewParam === 'onboarding') {
      setCurrentView('onboarding');
    } else if (viewParam === 'login' || viewParam === 'signin') {
      setCurrentView('login');
    } else if (viewParam === 'game-session' || viewParam === 'game') {
      setCurrentView('game');
    }

    // Direct role or parent dashboard view triggers (home, rekomendasi, game-hub)
    if (
      roleParam === 'parent' ||
      viewParam === 'home' ||
      viewParam === 'beranda' ||
      viewParam === 'parent' ||
      viewParam === 'rekomendasi' ||
      viewParam === 'dapur' ||
      viewParam === 'game-hub' ||
      viewParam === 'gamehub' ||
      tabParam === 'game' ||
      tabParam === 'rekomendasi' ||
      tabParam === 'dapur' ||
      tabParam === 'beranda'
    ) {
      setSession({
        token: 'demo-parent',
        user: { id: 'u-parent', fullName: 'Ibu Siti Rahma', role: 'parent', avatarId: 'av-1' },
      });
    } else if (roleParam === 'cadre' || viewParam === 'cadre') {
      setSession({
        token: 'demo-cadre',
        user: {
          id: 'u-cadre',
          fullName: 'Kader Nurul Hidayah',
          role: 'cadre',
          avatarId: 'av-2',
          posyanduId: 'POSYANDU-MLT-01',
        },
      });
    } else if (roleParam === 'doctor' || viewParam === 'doctor') {
      setSession({
        token: 'demo-doctor',
        user: {
          id: 'u-doctor',
          fullName: 'dr. Budi Santoso, Sp.A',
          role: 'doctor',
          avatarId: 'av-3',
          faskesId: 'PUSK-TEGALREJO',
        },
      });
    } else {
      // Check existing session in storage
      const activeSession = api.getSession();
      if (activeSession) {
        setSession(activeSession);
      }
    }
  }, []);

  const handleLogout = () => {
    api.logout();
    setSession(null);
    setCurrentView('welcome');
  };

  // Developer Showcase Route (Isolated for Component Inspection)
  if (isDevRoute) {
    return <ComponentShowcase />;
  }

  return (
    <div className={`min-h-[100dvh] w-full font-sans ${session?.user.role === 'doctor' ? 'bg-[#F8F9FA]' : 'bg-white'}`}>
      <div className="w-full h-[100dvh] bg-white overflow-hidden relative flex flex-col">

        {/* Dynamic View Router */}
        <div className="flex-1 w-full h-full overflow-hidden flex flex-col relative">
          {currentView === 'game' ? (
            <GameSessionContainer
              childId="c-demo"
              childName="Anisa"
              onExit={() => setCurrentView('welcome')}
              onFinishSession={() => {
                setCurrentView('welcome');
              }}
            />
          ) : session ? (
            session.user.role === 'parent' ? (
              <ParentDashboard session={session} onLogout={handleLogout} />
            ) : session.user.role === 'cadre' ? (
              <CadreDashboard session={session} onLogout={handleLogout} />
            ) : (
              <DoctorDashboard session={session} onLogout={handleLogout} />
            )
          ) : currentView === 'login' ? (
            <LoginView
              onBack={() => setCurrentView('welcome')}
              onSuccess={(newSession) => setSession(newSession)}
              onGoToRegister={() => setCurrentView('onboarding')}
            />
          ) : currentView === 'welcome' ? (
            <WelcomeView
              onStart={() => setCurrentView('onboarding')}
              onLogin={() => setCurrentView('login')}
            />
          ) : (
            <OnboardingView
              onBackToWelcome={() => setCurrentView('welcome')}
              onComplete={(newSession) => setSession(newSession)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
