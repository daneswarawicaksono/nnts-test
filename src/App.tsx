import { useState, useEffect } from 'react';
import { WelcomeView } from './views/Welcome/WelcomeView';
import { OnboardingView } from './views/Onboarding/OnboardingView';
import { LoginView } from './views/Login/LoginView';
import { ParentDashboard } from './views/Parent/ParentDashboard';
import { CadreDashboard } from './views/Cadre/CadreDashboard';
import { DoctorDashboard } from './views/Doctor/DoctorDashboard';
import { GameSessionContainer } from './views/Game/GameSessionContainer';
import { ComponentShowcase } from './views/Dev/ComponentShowcase';
import { api } from './services/api/client';
import type { AuthSession } from './types/role';

export function App() {
  const [isDevRoute, setIsDevRoute] = useState(false);
  const [currentView, setCurrentView] = useState<'welcome' | 'onboarding' | 'login' | 'game'>('welcome');
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    // Check if user navigated to /dev or ?dev=1
    const searchParams = new URLSearchParams(window.location.search);
    const hasDevParam = searchParams.get('dev') === '1';
    const isDevPath = window.location.pathname.startsWith('/dev');
    setIsDevRoute(hasDevParam || isDevPath);

    // Check URL route parameters for direct testing
    const viewParam = searchParams.get('view');
    if (viewParam === 'onboarding') {
      setCurrentView('onboarding');
    } else if (viewParam === 'login') {
      setCurrentView('login');
    } else if (viewParam === 'game') {
      setCurrentView('game');
    }
    const roleParam = searchParams.get('role');
    if (roleParam === 'parent') {
      setSession({ token: 'demo-parent', user: { id: 'u-parent', fullName: 'Ibu Siti Rahma', role: 'parent', avatarId: 'av-1' } });
    } else if (roleParam === 'cadre') {
      setSession({ token: 'demo-cadre', user: { id: 'u-cadre', fullName: 'Kader Nurul Hidayah', role: 'cadre', avatarId: 'av-2', posyanduId: 'POSYANDU-MLT-01' } });
    } else if (roleParam === 'doctor') {
      setSession({ token: 'demo-doctor', user: { id: 'u-doctor', fullName: 'dr. Budi Santoso, Sp.A', role: 'doctor', avatarId: 'av-3', faskesId: 'PUSK-TEGALREJO' } });
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

  // Clinical & Cadre roles expand to a professional workstation layout on desktop/laptop
  const isExpandedWorkstation =
    Boolean(session && (session.user.role === 'doctor' || session.user.role === 'cadre') && currentView !== 'game');

  return (
    <div className="min-h-screen w-full bg-white sm:bg-slate-100 flex items-center justify-center sm:p-4 font-sans">
      <div
        className={
          isExpandedWorkstation
            ? 'w-full h-[100dvh] bg-slate-50 overflow-hidden relative flex flex-col'
            : 'w-full sm:max-w-[420px] h-[100dvh] sm:h-[min(860px,96vh)] bg-slate-50 overflow-hidden relative flex flex-col'
        }
      >
        {/* Dynamic Notch Pill on Desktop Frame (only shown on mobile-frame mode) */}
        {!isExpandedWorkstation && (
          <div className="hidden sm:block absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-800 rounded-pill z-50 pointer-events-none" />
        )}

        {/* Dynamic View Router */}
        <div className="flex-1 w-full h-full overflow-hidden flex flex-col relative">
          {currentView === 'game' ? (
            <GameSessionContainer
              childId="c-demo"
              childName="Anisa"
              onExit={() => setCurrentView(session ? 'welcome' : 'welcome')}
              onFinishSession={() => {
                if (session) {
                  setCurrentView('welcome');
                } else {
                  setCurrentView('welcome');
                }
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
          ) : currentView === 'welcome' ? (
            <WelcomeView
              onStart={() => setCurrentView('onboarding')}
              onLogin={() => setCurrentView('login')}
            />
          ) : currentView === 'login' ? (
            <LoginView
              onBack={() => setCurrentView('welcome')}
              onRegister={() => setCurrentView('onboarding')}
              onLoginSuccess={(newSession) => setSession(newSession)}
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
