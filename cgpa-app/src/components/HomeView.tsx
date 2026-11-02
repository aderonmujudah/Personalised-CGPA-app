import { useMemo } from 'react';
import { ChevronRight, Moon, Plus, Sun } from 'lucide-react';
import type { SemesterRecord, UserProfile } from '../types';
import {
  classify,
  cumulative,
  earnedUnits,
  fmt,
  semesterLabel,
  semesterShort,
  semesterStats,
  sortSemesters,
} from '../utils/cgpaEngine';
import { TOTAL_COMPULSORY, TOTAL_ELECTIVE, TOTAL_REQUIRED } from '../data/curriculumData';
import { Bar, GroupLabel, PageHeader, card } from './ui';

interface Props {
  profile: UserProfile;
  semesters: SemesterRecord[];
  asOfId: string | null;
  onAsOf: (id: string | null) => void;
  onOpen: (id: string) => void;
  onAddSemester: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

const firstName = (name: string) => {
  const n = name.includes(',') ? name.split(',')[1] : name;
  return n.trim().split(/\s+/)[0] || 'there';
};

export function HomeView({ profile, semesters, asOfId, onAsOf, onOpen, onAddSemester, isDark, onToggleTheme }: Props) {
  const sorted = useMemo(() => sortSemesters(semesters), [semesters]);
  const lastDoneIdx = useMemo(() => sorted.map(s => !s.isPlanned).lastIndexOf(true), [sorted]);
  const chosenIdx = asOfId ? sorted.findIndex(s => s.id === asOfId) : -1;
  const cutIdx = chosenIdx !== -1 ? chosenIdx : lastDoneIdx;

  const { cgpa, units, earned } = useMemo(() => {
    const included = cutIdx >= 0 ? sorted.slice(0, cutIdx + 1) : [];
    return { ...cumulative(included), earned: earnedUnits(included) };
  }, [sorted, cutIdx]);

  const cls = classify(cgpa);
  const isProjected = cutIdx > lastDoneIdx;
  const isPast = cutIdx < lastDoneIdx;

  // Newest session first, semesters inside a session in order.
  const groups = useMemo(() => {
    const out: { session: string; items: { s: SemesterRecord; idx: number }[] }[] = [];
    sorted.forEach((s, idx) => {
      const g = out.find(x => x.session === s.session);
      if (g) g.items.push({ s, idx });
      else out.push({ session: s.session, items: [{ s, idx }] });
    });
    return out.reverse();
  }, [sorted]);

  return (
    <div className="pb-8">
      <PageHeader
        subtitle={profile.department}
        title={`Hi, ${firstName(profile.name)}`}
        right={
          <button
            onClick={onToggleTheme}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line bg-surface text-ink-2 active:bg-surface-2"
          >
            {isDark ? <Sun size={18} strokeWidth={1.8} /> : <Moon size={18} strokeWidth={1.8} />}
          </button>
        }
      />

      <div className="grid gap-3 px-4 md:grid-cols-[1.25fr_1fr]">
        {/* CGPA */}
        <section className={`${card} px-5 pt-4 pb-3`}>
          <div className="flex items-center justify-between gap-2">
            <p className="text-[14px] text-ink-2">
              {isProjected ? 'Projected CGPA' : isPast ? 'CGPA back then' : 'Current CGPA'}
            </p>
            {units > 0 && (
              <span className="truncate rounded-full bg-accent-soft px-2.5 py-1 text-[12px] font-medium text-accent">
                {cls.name}
              </span>
            )}
          </div>
          <p className="mt-1 text-[clamp(48px,15vw,64px)] leading-none font-semibold tracking-[-0.04em] text-ink tabular-nums">
            {fmt(cgpa)}
          </p>
          <p className="mt-2 text-[13px] text-ink-3">
            {units ? `${units} units graded` : 'No grades yet'}
            {units > 0 && cls.next && ` · ${fmt(cls.next.gap)} to ${cls.next.name}`}
          </p>

          {sorted.length > 0 && (
            <Timeline
              semesters={sorted}
              cutIdx={cutIdx}
              lastDoneIdx={lastDoneIdx}
              onSelect={idx => onAsOf(idx === lastDoneIdx ? null : sorted[idx].id)}
            />
          )}
        </section>

        {/* Degree progress */}
        <section className={`${card} flex flex-col p-4`}>
          <h2 className="text-[14px] text-ink-2">Towards graduation</h2>
          <p className="mt-1 text-[28px] leading-tight font-semibold tracking-[-0.02em] text-ink tabular-nums">
            {earned.total}
            <span className="text-[15px] font-normal tracking-normal text-ink-3"> / {TOTAL_REQUIRED} units</span>
          </p>
          <Bar value={earned.total / TOTAL_REQUIRED} className="mt-3" />
          <dl className="mt-auto grid grid-cols-3 gap-2 pt-4 text-[13px]">
            <Figure label="Compulsory" value={`${earned.compulsory}/${TOTAL_COMPULSORY}`} />
            <Figure label="Electives" value={`${earned.elective}/${TOTAL_ELECTIVE}`} />
            <Figure label="Units left" value={String(Math.max(0, TOTAL_REQUIRED - earned.total))} />
          </dl>
        </section>
      </div>

      {/* Semesters */}
      <div className="mx-5 mt-8 mb-1 flex items-center justify-between">
        <h2 className="text-[19px] font-semibold tracking-[-0.01em] text-ink">Semesters</h2>
        <button
          onClick={onAddSemester}
          className="-mr-2 flex h-10 items-center gap-1 rounded-full px-3 text-[15px] font-medium text-accent active:bg-accent-soft"
        >
          <Plus size={18} strokeWidth={2} /> Add
        </button>
      </div>

      {groups.length === 0 && (
        <p className="mx-5 mt-2 text-[14px] text-ink-3">No semesters yet. Add your first one to get started.</p>
      )}

      {groups.map(g => (
        <div key={g.session} className="mx-4 mt-4">
          <GroupLabel>{g.session}</GroupLabel>
          <div className={`${card} divide-y divide-line overflow-hidden`}>
            {g.items.map(({ s, idx }) => {
              const st = semesterStats(s.courses);
              const outside = idx > cutIdx;
              return (
                <button
                  key={s.id}
                  onClick={() => onOpen(s.id)}
                  className={`flex min-h-[60px] w-full items-center gap-3 px-4 py-3 text-left transition-opacity active:bg-surface-2 ${
                    outside ? 'opacity-50' : ''
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 text-[15px] font-medium text-ink">
                      <span className="truncate">
                        {s.level} · {semesterLabel(s.semester)}
                      </span>
                      {s.isPlanned && (
                        <span className="shrink-0 rounded border border-line px-1.5 py-px text-[11px] font-medium text-ink-3">
                          Planned
                        </span>
                      )}
                    </p>
                    <p className="text-[13px] text-ink-3">
                      {st.count} courses · {st.totalUnits} units
                    </p>
                  </div>
                  <span className={`text-[17px] font-semibold tabular-nums ${s.isPlanned ? 'text-ink-3' : 'text-ink'}`}>
                    {st.graded ? fmt(st.gpa) : '–'}
                  </span>
                  <ChevronRight size={18} className="shrink-0 text-ink-3" />
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function Figure({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-ink-3">{label}</dt>
      <dd className="font-medium text-ink tabular-nums">{value}</dd>
    </div>
  );
}

function Timeline({
  semesters,
  cutIdx,
  lastDoneIdx,
  onSelect,
}: {
  semesters: SemesterRecord[];
  cutIdx: number;
  lastDoneIdx: number;
  onSelect: (idx: number) => void;
}) {
  const n = semesters.length;
  const sel = semesters[cutIdx];
  const pct = n > 1 ? Math.max(0, cutIdx) / (n - 1) : 0;

  const pick = (el: HTMLDivElement, clientX: number) => {
    const r = el.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (clientX - r.left - 8) / (r.width - 16)));
    const idx = Math.round(x * (n - 1));
    if (idx !== cutIdx) onSelect(idx);
  };

  return (
    <div className="mt-4 border-t border-line pt-3">
      <div className="flex min-h-8 items-center justify-between gap-2 text-[13px]">
        <span className="text-ink-3">
          As of{' '}
          <span className="font-medium text-ink">{sel ? `${sel.level} ${semesterShort(sel.semester)} semester` : '—'}</span>
        </span>
        {cutIdx !== lastDoneIdx && lastDoneIdx >= 0 && (
          <button
            onClick={() => onSelect(lastDoneIdx)}
            className="-mr-2 h-8 rounded-full px-2 font-medium text-accent active:bg-accent-soft"
          >
            Back to now
          </button>
        )}
      </div>
      <div
        role="slider"
        tabIndex={0}
        aria-label="Show CGPA as of semester"
        aria-valuemin={0}
        aria-valuemax={n - 1}
        aria-valuenow={Math.max(0, cutIdx)}
        aria-valuetext={sel ? `${sel.level} ${semesterLabel(sel.semester)}` : undefined}
        className="relative h-10 cursor-pointer touch-none select-none"
        onPointerDown={e => {
          e.currentTarget.setPointerCapture(e.pointerId);
          pick(e.currentTarget, e.clientX);
        }}
        onPointerMove={e => {
          if (e.buttons) pick(e.currentTarget, e.clientX);
        }}
        onKeyDown={e => {
          if (e.key === 'ArrowLeft' && cutIdx > 0) onSelect(cutIdx - 1);
          if (e.key === 'ArrowRight' && cutIdx < n - 1) onSelect(cutIdx + 1);
        }}
      >
        <div className="absolute top-1/2 right-2 left-2 h-[2px] -translate-y-1/2 rounded bg-track" />
        <div
          className="absolute top-1/2 left-2 h-[2px] -translate-y-1/2 rounded bg-accent transition-[width] duration-200"
          style={{ width: `calc((100% - 16px) * ${pct})` }}
        />
        <div className="relative flex h-full items-center justify-between">
          {semesters.map((s, i) => (
            <span key={s.id} className="grid w-4 place-items-center">
              <span
                className={`block rounded-full transition-all duration-200 ${
                  i === cutIdx
                    ? 'h-4 w-4 bg-accent ring-4 ring-accent-soft'
                    : s.isPlanned
                      ? 'h-2 w-2 border-[1.5px] border-ink-3 bg-surface'
                      : i < cutIdx
                        ? 'h-2 w-2 bg-accent'
                        : 'h-2 w-2 bg-ink-3'
                }`}
              />
            </span>
          ))}
        </div>
      </div>
      <div className="flex justify-between text-[11px] text-ink-3">
        {semesters.map((s, i) => (
          <span key={s.id} className="flex w-4 justify-center whitespace-nowrap">
            {i === 0 || semesters[i - 1].level !== s.level ? s.level.replace('L', '') : ''}
          </span>
        ))}
      </div>
    </div>
  );
}
