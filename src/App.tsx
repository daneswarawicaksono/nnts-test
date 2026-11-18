import { useState, useEffect } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import { WelcomeView } from './views/Welcome/WelcomeView';
import { OnboardingView } from './views/Onboarding/OnboardingView';
import { GameSessionContainer } from './views/Game/GameSessionContainer';
import { ComponentShowcase } from './views/Dev/ComponentShowcase';
import { RoleGuard } from './routes/RoleGuard';

// Modular Cadre Pages
import { QueueView } from './views/Cadre/pages/QueueView';
import { WeighMeasureView } from './views/Cadre/pages/WeighMeasureView';
import { RecapView } from './views/Cadre/pages/RecapView';

// Modular Doctor Pages
import { WorklistView } from './views/Doctor/pages/WorklistView';
import { CDSSAnalysisView } from './views/Doctor/pages/CDSSAnalysisView';
import { InterventionView } from './views/Doctor/pages/InterventionView';

// Modular Parent Pages
import { HomeOverviewView } from './views/Parent/pages/HomeOverviewView';
import { KMSDigitalView } from './views/Parent/pages/KMSDigitalView';
import { NutritionKitchenView } from './views/Parent/pages/NutritionKitchenView';

import { coreClient } from './services/api/coreClient';
import type { AuthSession } from './types/role';

export function App() {
  const [session, setSession] = useState<AuthSession | null>(() => coreClient.getSession<AuthSession>());
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Demo query params handler
    const params = new URLSearchParams(window.location.search);
    const roleParam = params.get('role');
    
    if (roleParam === 'parent') {
      const s: AuthSession = { token: 'demo-parent', user: { id: 'u-parent', fullName: 'Ibu Siti Rahma', role: 'parent', avatarId: 'av-1' } };
      coreClient.setSession(s);
      setSession(s);
      setLocation('/parent/home');
    } else if (roleParam === 'cadre') {
      const s: AuthSession = { token: 'demo-cadre', user: { id: 'u-cadre', fullName: 'Kader Nurul Hidayah', role: 'cadre', avatarId: 'av-2', posyanduId: 'POSYANDU-MLT-01' } };
      coreClient.setSession(s);
      setSession(s);
      setLocation('/cadre/queue');
    } else if (roleParam === 'doctor') {
      const s: AuthSession = { token: 'demo-doctor', user: { id: 'u-doctor', fullName: 'dr. Budi Santoso, Sp.A', role: 'doctor', avatarId: 'av-3', faskesId: 'PUSK-TEGALREJO' } };
      coreClient.setSession(s);
      setSession(s);
      setLocation('/doctor/worklist');
    }
  }, [setLocation]);

  const handleCompleteOnboarding = (newSession: AuthSession) => {
    coreClient.setSession(newSession);
    setSession(newSession);
    const target = 
      newSession.user.role === 'cadre' ? '/cadre/queue' : 
      newSession.user.role === 'doctor' ? '/doctor/worklist' : '/parent/home';
    setLocation(target);
  };

  return (
    <Switch>
      {/* Dev Route */}
      <Route path="/dev" component={ComponentShowcase} />

      {/* Public Landing & Onboarding */}
      <Route path="/">
        <WelcomeView
          onStart={() => setLocation('/onboarding')}
          onLogin={() => setLocation('/onboarding')}
        />
      </Route>

      <Route path="/onboarding">
        <OnboardingView
          onBackToWelcome={() => setLocation('/')}
          onComplete={handleCompleteOnboarding}
        />
      </Route>

      {/* Interactive Child Game Screen */}
      <Route path="/game/:childId">
        {(params) => (
          <GameSessionContainer
            childId={params.childId || 'c-demo'}
            childName="Anisa"
            onExit={() => {
              if (session) {
                const target = session.user.role === 'cadre' ? '/cadre/queue' : '/parent/home';
                setLocation(target);
              } else {
                setLocation('/');
              }
            }}
            onFinishSession={() => {
              setLocation(session?.user.role === 'cadre' ? '/cadre/queue' : '/parent/home');
            }}
          />
        )}
      </Route>

      {/* Role: Kader Posyandu Pages */}
      <Route path="/cadre/queue">
        <RoleGuard session={session} allowedRole="cadre">
          <QueueView />
        </RoleGuard>
      </Route>
      <Route path="/cadre/weigh">
        <RoleGuard session={session} allowedRole="cadre">
          <WeighMeasureView />
        </RoleGuard>
      </Route>
      <Route path="/cadre/recap">
        <RoleGuard session={session} allowedRole="cadre">
          <RecapView />
        </RoleGuard>
      </Route>

      {/* Role: Dokter Puskesmas Pages */}
      <Route path="/doctor/worklist">
        <RoleGuard session={session} allowedRole="doctor">
          <WorklistView />
        </RoleGuard>
      </Route>
      <Route path="/doctor/cdss/:id">
        <RoleGuard session={session} allowedRole="doctor">
          <CDSSAnalysisView />
        </RoleGuard>
      </Route>
      <Route path="/doctor/interventions">
        <RoleGuard session={session} allowedRole="doctor">
          <InterventionView />
        </RoleGuard>
      </Route>

      {/* Role: Orang Tua Pages */}
      <Route path="/parent/home">
        <RoleGuard session={session} allowedRole="parent">
          <HomeOverviewView />
        </RoleGuard>
      </Route>
      <Route path="/parent/kms">
        <RoleGuard session={session} allowedRole="parent">
          <KMSDigitalView />
        </RoleGuard>
      </Route>
      <Route path="/parent/nutrition">
        <RoleGuard session={session} allowedRole="parent">
          <NutritionKitchenView />
        </RoleGuard>
      </Route>

      {/* Fallback 404 */}
      <Route>
        <div className="min-h-screen flex items-center justify-center p-4 text-center">
          <div>
            <h1 className="text-xl font-bold text-slate-900">404 - Halaman Tidak Ditemukan</h1>
            <button
              onClick={() => setLocation('/')}
              className="mt-4 px-4 py-2 bg-teal-700 text-white text-xs font-bold rounded-xl"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </Route>
    </Switch>
  );
}

export default App;
