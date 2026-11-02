import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTheme } from './hooks/useTheme';
import { useBackHandler } from './hooks/useBackHandler';
import { HomeView } from './components/HomeView';
import { PlanView } from './components/PlanView';
import { SettingsView } from './components/SettingsView';
import { SemesterScreen } from './components/SemesterScreen';
import { NewSemesterSheet } from './components/NewSemesterSheet';
import { TabBar, type Tab } from './components/TabBar';
import type { SemesterRecord, UserProfile } from './types';
import {
  loadSemesters,
  saveSemesters,
  loadProfile,
  saveProfile,
  createDefaultSemesters,
  DEFAULT_PROFILE,
} from './utils/storage';
import { normalizeCarryovers } from './utils/cgpaEngine';

export function App() {
  const { pref, setPref, isDark } = useTheme();
  const [tab, setTab] = useState<Tab>('home');
  const [profile, setProfile] = useState<UserProfile>(loadProfile);
  const [semesters, setSemesters] = useState<SemesterRecord[]>(() => normalizeCarryovers(loadSemesters()));
  const [activeSemesterId, setActiveSemesterId] = useState<string | null>(null);
  const [asOfId, setAsOfId] = useState<string | null>(null);
  const [showAddSemester, setShowAddSemester] = useState(false);

  useEffect(() => saveSemesters(semesters), [semesters]);
  useEffect(() => saveProfile(profile), [profile]);

  // Back from Plan/Settings goes to Home; back from Home exits.
  useBackHandler(tab !== 'home', () => setTab('home'));

  // Each tab keeps its own scroll position instead of inheriting the last one.
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollPos = useRef<Partial<Record<Tab, number>>>({});
  const changeTab = (t: Tab) => {
    if (t === tab) {
      scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    scrollPos.current[tab] = scrollRef.current?.scrollTop ?? 0;
    setTab(t);
  };
  useLayoutEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollPos.current[tab] ?? 0;
  }, [tab]);

  const update = (fn: (prev: SemesterRecord[]) => SemesterRecord[]) =>
    setSemesters(prev => normalizeCarryovers(fn(prev)));

  const handleDeleteSemester = (id: string) => {
    update(prev => prev.filter(s => s.id !== id));
    if (asOfId === id) setAsOfId(null);
    setActiveSemesterId(null);
  };

  const handleCreateSemester = (newSem: SemesterRecord) => {
    update(prev => [...prev, newSem]);
    setShowAddSemester(false);
    setActiveSemesterId(newSem.id);
  };

  const replaceAll = (data: { profile: UserProfile; semesters: SemesterRecord[] }) => {
    setProfile(data.profile);
    setSemesters(normalizeCarryovers(data.semesters));
    setAsOfId(null);
    setActiveSemesterId(null);
  };

  const activeSemester = activeSemesterId ? semesters.find(s => s.id === activeSemesterId) ?? null : null;

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-bg text-ink">
      <main ref={scrollRef} className="scroller px-safe flex-1">
        <div className="mx-auto w-full max-w-2xl">
          {tab === 'home' && (
            <HomeView
              profile={profile}
              semesters={semesters}
              asOfId={asOfId}
              onAsOf={setAsOfId}
              onOpen={setActiveSemesterId}
              onAddSemester={() => setShowAddSemester(true)}
              isDark={isDark}
              onToggleTheme={() => setPref(isDark ? 'light' : 'dark')}
            />
          )}

          {tab === 'plan' && (
            <PlanView
              profile={profile}
              semesters={semesters}
              onTarget={t => setProfile(p => ({ ...p, targetCGPA: t }))}
              onOpen={setActiveSemesterId}
            />
          )}

          {tab === 'settings' && (
            <SettingsView
              profile={profile}
              semesters={semesters}
              themePref={pref}
              onThemePref={setPref}
              onProfile={setProfile}
              onReplaceAll={replaceAll}
              onReset={() => replaceAll({ profile: DEFAULT_PROFILE, semesters: createDefaultSemesters() })}
            />
          )}
        </div>
      </main>

      <TabBar tab={tab} onChange={changeTab} />

      {activeSemester && (
        <SemesterScreen
          key={activeSemester.id}
          semester={activeSemester}
          allSemesters={semesters}
          profile={profile}
          backLabel={tab === 'plan' ? 'Plan' : 'Home'}
          onBack={() => setActiveSemesterId(null)}
          onChange={updated => update(prev => prev.map(s => (s.id === updated.id ? updated : s)))}
          onDelete={() => handleDeleteSemester(activeSemester.id)}
        />
      )}

      <NewSemesterSheet
        open={showAddSemester}
        onClose={() => setShowAddSemester(false)}
        semesters={semesters}
        onCreate={handleCreateSemester}
      />
    </div>
  );
}

export default App;
