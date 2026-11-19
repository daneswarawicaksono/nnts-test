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
  const [isCleanFrame, setIsCleanFrame] = useState(false);
  const [isDevRoute, setIsDevRoute] = useState(false);
  const [currentView, setCurrentView] = useState<'welcome' | 'login' | 'onboarding' | 'game'>('welcome');
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    // Check if user navigated to /dev or ?dev=1
    const searchParams = new URLSearchParams(window.location.search);
    const hasDevParam = searchParams.get('dev') === '1';
    const isDevPath = window.location.pathname.startsWith('/dev');
    setIsDevRoute(hasDevParam || isDevPath);

    // Check clean/pure mode for Figma html.to.design capture
    const hasCleanParam =
      searchParams.get('clean') === '1' ||
      searchParams.get('pure') === '1' ||
      searchParams.get('figma') === '1';
    setIsCleanFrame(hasCleanParam);

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

  const isDoctor = session?.user.role === 'doctor';
  const isExpandedWorkstation =
    Boolean(session && (session.user.role === 'doctor' || session.user.role === 'cadre') && currentView !== 'game');

  return (
    <div
      className={
        isDoctor
          ? 'min-h-screen w-full bg-[#F8F9FA] flex flex-col font-sans p-0'
          : isCleanFrame
          ? 'min-h-screen w-full bg-white flex items-center justify-center font-sans p-0'
          : 'min-h-screen w-full bg-white sm:bg-slate-100 flex items-center justify-center sm:p-4 font-sans'
      }
    >
      <div
        className={
          isDoctor
            ? 'w-full h-screen bg-[#F8F9FA] overflow-hidden relative flex flex-col'
            : isCleanFrame
            ? 'w-full max-w-[412px] min-h-[915px] bg-white overflow-hidden relative flex flex-col shadow-none border-0'
            : isExpandedWorkstation
            ? 'w-full max-w-6xl h-[100dvh] sm:h-[min(900px,96vh)] bg-white sm:rounded-3xl sm:shadow-2xl sm:border border-slate-200/90 overflow-hidden relative flex flex-col transition-all duration-normal'
            : 'w-full sm:max-w-[400px] h-[100dvh] sm:h-[min(820px,94vh)] bg-white sm:rounded-[44px] sm:shadow-2xl sm:border-[8px] sm:border-slate-800 overflow-hidden relative flex flex-col transition-all duration-normal'
        }
      >
        {/* Dynamic Notch Pill on Desktop Frame (only shown on mobile-frame mode) */}
        {!isExpandedWorkstation && !isCleanFrame && (
          <div className="hidden sm:block absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-800 rounded-pill z-50 pointer-events-none" />
        )}

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
