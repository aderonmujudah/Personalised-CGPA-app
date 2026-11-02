import { useMemo } from 'react';
import { ChevronRight } from 'lucide-react';
import type { Level, SemesterRecord, UserProfile } from '../types';
import { classify, cumulative, earnedUnits, fmt, requiredAverage, semesterLabel, semesterStats, sortSemesters } from '../utils/cgpaEngine';
import { REQUIRED_BY_LEVEL, TOTAL_COMPULSORY, TOTAL_ELECTIVE, TOTAL_REQUIRED } from '../data/curriculumData';
import { Bar, GroupLabel, PageHeader, Stepper, card } from './ui';

export function PlanView({
  profile,
  semesters,
  onTarget,
  onOpen,
}: {
  profile: UserProfile;
  semesters: SemesterRecord[];
  onTarget: (t: number) => void;
  onOpen: (id: string) => void;
}) {
  const { sorted, plannedSems, cur, all, earned } = useMemo(() => {
    const sorted = sortSemesters(semesters);
    const done = sorted.filter(s => !s.isPlanned);
    return {
      sorted,
      plannedSems: sorted.filter(s => s.isPlanned),
      cur: cumulative(done),
      all: cumulative(sorted),
      earned: earnedUnits(done),
    };
  }, [semesters]);

  const remaining = Math.max(0, TOTAL_REQUIRED - earned.total);
  const target = profile.targetCGPA;
  const need = requiredAverage(cur.points, cur.units, target, remaining);
  const best = remaining ? (cur.points + 5 * remaining) / (cur.units + remaining) : cur.cgpa;
  const hasPlannedGrades = all.units > cur.units;

  let verdict: string;
  let tone: 'ok' | 'warn' | 'bad' = 'ok';
  if (need === null) verdict = 'You have all the units you need to graduate.';
  else if (need <= 0) verdict = `You're already above ${fmt(target)}. Just keep passing.`;
  else if (need > 5) {
    tone = 'bad';
    verdict = `${fmt(target)} isn't reachable any more. Straight A's in your remaining ${remaining} units would finish you on ${fmt(best)}.`;
  } else {
    tone = need > 4.5 ? 'warn' : 'ok';
    verdict = `You need an average of ${fmt(need)} across your remaining ${remaining} units.`;
  }

  return (
    <div className="pb-8">
      <PageHeader title="Plan" subtitle="Based on your completed semesters" />

      <section className={`${card} mx-4 p-4`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[15px] font-semibold text-ink">Target CGPA</p>
            <p className="text-[13px] text-ink-3">{classify(target).name}</p>
          </div>
          <Stepper value={target} onChange={onTarget} min={1} max={5} step={0.05} format={fmt} />
        </div>
        <p
          className={`mt-4 rounded-xl px-3.5 py-3 text-[15px] leading-relaxed ${
            tone === 'bad' ? 'bg-danger-soft text-ink' : 'bg-surface-2 text-ink'
          }`}
        >
          {verdict}
          {tone === 'warn' && <span className="text-ink-2"> That's mostly A's.</span>}
        </p>
        <div className="mt-3 grid grid-cols-3 divide-x divide-line text-center">
          <Mini label="Now" value={fmt(cur.cgpa)} />
          <Mini label="Best possible" value={fmt(best)} />
          <Mini label="Units left" value={String(remaining)} />
        </div>
      </section>

      <div className="mt-7 grid gap-x-3 px-4 md:grid-cols-2">
        <section>
          <GroupLabel>With your planned grades</GroupLabel>
          <div className={`${card} overflow-hidden`}>
            <div className="flex items-center justify-between gap-3 px-4 py-3.5">
              <div className="min-w-0">
                <p className="text-[15px] font-medium text-ink">Projected CGPA</p>
                <p className="text-[13px] text-ink-3">
                  {hasPlannedGrades ? classify(all.cgpa).name : 'Set expected grades in a planned semester'}
                </p>
              </div>
              <span className="text-[22px] font-semibold text-ink tabular-nums">{hasPlannedGrades ? fmt(all.cgpa) : '–'}</span>
            </div>
            {plannedSems.length > 0 && (
              <div className="divide-y divide-line border-t border-line">
                {plannedSems.map(s => {
                  const st = semesterStats(s.courses);
                  return (
                    <button
                      key={s.id}
                      onClick={() => onOpen(s.id)}
                      className="flex min-h-[56px] w-full items-center gap-3 px-4 py-2.5 text-left active:bg-surface-2"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14px] text-ink">
                          {s.level} · {semesterLabel(s.semester)}
                        </p>
                        <p className="text-[12px] text-ink-3">
                          {st.graded} of {st.count} graded · {st.totalUnits} units
                        </p>
                      </div>
                      <span className="text-[15px] font-medium text-ink-2 tabular-nums">{st.graded ? fmt(st.gpa) : '–'}</span>
                      <ChevronRight size={16} className="shrink-0 text-ink-3" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className="mt-7 md:mt-0">
          <GroupLabel right={<span className="text-[13px] text-ink-3 tabular-nums">{earned.total} / {TOTAL_REQUIRED}</span>}>
            Units by level
          </GroupLabel>
          <div className={`${card} space-y-3.5 px-4 py-4`}>
            {(Object.keys(REQUIRED_BY_LEVEL) as Level[]).map(l => {
              const req = REQUIRED_BY_LEVEL[l].compulsory + REQUIRED_BY_LEVEL[l].elective;
              const got = earned.byLevel[l];
              return (
                <div key={l}>
                  <div className="flex justify-between gap-2 text-[13px]">
                    <span className="text-ink">{l}</span>
                    <span className="text-right text-ink-3 tabular-nums">
                      {got} / {req}
                      {REQUIRED_BY_LEVEL[l].elective > 0 && ` · ${REQUIRED_BY_LEVEL[l].elective} elective`}
                    </span>
                  </div>
                  <Bar value={got / req} className="mt-1.5" />
                </div>
              );
            })}
            <p className="pt-1 text-[12px] leading-relaxed text-ink-3">
              Section 8a of the curriculum: {TOTAL_COMPULSORY} compulsory + {TOTAL_ELECTIVE} elective units. Transcript course
              numbers sometimes differ from the handbook, so a level can read slightly over or under.
            </p>
          </div>
        </section>
      </div>

      {sorted.length === 0 && <p className="mx-5 mt-4 text-[14px] text-ink-3">Add a semester on the Home tab to start planning.</p>}
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-1">
      <p className="text-[18px] font-semibold text-ink tabular-nums">{value}</p>
      <p className="text-[11px] text-ink-3">{label}</p>
    </div>
  );
}
