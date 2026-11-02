import { useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import type { SemesterRecord, UserProfile } from '../types';
import type { ThemePref } from '../hooks/useTheme';
import { exportBackup, parseBackup } from '../utils/backup';
import { ConfirmSheet, GroupLabel, PageHeader, Segmented, Stepper, card } from './ui';

export function SettingsView({
  profile,
  semesters,
  themePref,
  onThemePref,
  onProfile,
  onReplaceAll,
  onReset,
}: {
  profile: UserProfile;
  semesters: SemesterRecord[];
  themePref: ThemePref;
  onThemePref: (p: ThemePref) => void;
  onProfile: (p: UserProfile) => void;
  onReplaceAll: (data: { profile: UserProfile; semesters: SemesterRecord[] }) => void;
  onReset: () => void;
}) {
  const [notice, setNotice] = useState<{ text: string; error?: boolean } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [pendingImport, setPendingImport] = useState<ReturnType<typeof parseBackup> | null>(null);

  const doExport = async () => {
    try {
      await exportBackup(profile, semesters);
      setNotice(null);
    } catch {
      setNotice({ text: "Couldn't save the backup. Try again.", error: true });
    }
  };

  const readImport = (file: File) => {
    file
      .text()
      .then(text => setPendingImport(parseBackup(text)))
      .catch(() => setNotice({ text: "That file doesn't look like a CGPA backup.", error: true }));
  };

  const set = <K extends keyof UserProfile>(k: K, v: UserProfile[K]) => onProfile({ ...profile, [k]: v });

  return (
    <div className="pb-8">
      <PageHeader title="Settings" />

      <section className="mx-4">
        <GroupLabel>Appearance</GroupLabel>
        <div className={`${card} p-3`}>
          <Segmented
            options={[
              { value: 'system' as ThemePref, label: 'System' },
              { value: 'light' as ThemePref, label: 'Light' },
              { value: 'dark' as ThemePref, label: 'Dark' },
            ]}
            value={themePref}
            onChange={onThemePref}
          />
        </div>
      </section>

      <section className="mx-4 mt-7">
        <GroupLabel>Profile</GroupLabel>
        <div className={`${card} divide-y divide-line overflow-hidden`}>
          <TextField label="Name" value={profile.name} onChange={v => set('name', v)} autoComplete="name" />
          <TextField label="Matric no." value={profile.matricNo} onChange={v => set('matricNo', v)} inputMode="numeric" />
          <TextField label="Department" value={profile.department} onChange={v => set('department', v)} />
          <Row label="Max units per semester">
            <Stepper value={profile.maxUnitsPerSemester} onChange={n => set('maxUnitsPerSemester', n)} min={12} max={30} />
          </Row>
        </div>
        <p className="mt-2 px-1 text-[12px] text-ink-3">5.0 scale: A 5 · B 4 · C 3 · D 2 · E 1 · F 0</p>
      </section>

      <section className="mx-4 mt-7">
        <GroupLabel>Data</GroupLabel>
        <div className={`${card} divide-y divide-line overflow-hidden text-[15px]`}>
          <ActionRow onClick={doExport}>Export backup</ActionRow>
          <label className="flex min-h-[52px] w-full cursor-pointer items-center justify-between px-4 text-ink active:bg-surface-2">
            Import backup
            <ChevronRight size={18} className="text-ink-3" />
            <input
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={e => {
                const f = e.target.files?.[0];
                if (f) readImport(f);
                e.target.value = '';
              }}
            />
          </label>
          <ActionRow danger onClick={() => setConfirmReset(true)}>
            Reset to transcript data
          </ActionRow>
        </div>
        <p className={`mt-2 px-1 text-[12px] ${notice?.error ? 'text-danger' : 'text-ink-3'}`}>
          {notice?.text ?? 'Everything is stored on this device only.'}
        </p>
      </section>

      <ConfirmSheet
        open={confirmReset}
        title="Reset to transcript?"
        message="Your semesters and profile go back to the original transcript data. Any changes you made will be lost."
        confirmLabel="Reset"
        danger
        onConfirm={() => {
          onReset();
          setNotice({ text: 'Reset to transcript data.' });
        }}
        onClose={() => setConfirmReset(false)}
      />

      <ConfirmSheet
        open={!!pendingImport}
        title="Replace your data?"
        message={`This backup has ${pendingImport?.semesters.length ?? 0} semesters. It will replace everything currently in the app.`}
        confirmLabel="Replace"
        onConfirm={() => {
          if (pendingImport) onReplaceAll(pendingImport);
          setNotice({ text: 'Backup restored.' });
        }}
        onClose={() => setPendingImport(null)}
      />
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-h-[52px] items-center justify-between gap-3 px-4 py-2">
      <span className="min-w-0 text-[15px] leading-snug text-ink">{label}</span>
      {children}
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  ...rest
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
} & Pick<InputHTMLAttributes<HTMLInputElement>, 'inputMode' | 'autoComplete'>) {
  return (
    <label className="flex min-h-[52px] items-center gap-4 px-4">
      <span className="shrink-0 text-[15px] text-ink">{label}</span>
      <input
        className="min-w-0 flex-1 bg-transparent py-3 text-right text-[16px] text-ink-2 outline-none focus:text-ink"
        value={value}
        onChange={e => onChange(e.target.value)}
        {...rest}
      />
    </label>
  );
}

function ActionRow({ children, onClick, danger }: { children: ReactNode; onClick: () => void; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`flex min-h-[52px] w-full items-center justify-between px-4 text-left active:bg-surface-2 ${
        danger ? 'text-danger' : 'text-ink'
      }`}
    >
      {children}
      {!danger && <ChevronRight size={18} className="text-ink-3" />}
    </button>
  );
}
