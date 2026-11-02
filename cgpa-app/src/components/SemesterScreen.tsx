import { useEffect, useMemo, useState } from 'react';
import { Check, ChevronLeft, Plus, Search } from 'lucide-react';
import type { Course, CourseCatalogItem, CourseStatus, Level, SemesterRecord, UserProfile } from '../types';
import {
  CURRICULUM_DATA,
  ELECTIVE_UNITS_REQUIRED,
  getCurriculumCoursesForSemester,
} from '../data/curriculumData';
import { codeKey, fmt, semesterLabel, semesterStats } from '../utils/cgpaEngine';
import { useBackHandler } from '../hooks/useBackHandler';
import { ConfirmSheet, GradePicker, GroupLabel, Segmented, Sheet, Stepper, card } from './ui';

interface Props {
  semester: SemesterRecord;
  allSemesters: SemesterRecord[];
  profile: UserProfile;
  backLabel: string;
  onBack: () => void;
  onChange: (s: SemesterRecord) => void;
  onDelete: () => void;
}

const uid = () => `c-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

const LEVEL_RANK: Record<Level, number> = {
  '100L': 1,
  '200L': 2,
  '300L': 3,
  '400L': 4,
  '500L': 5,
};

const primaryBtn =
  'h-12 w-full rounded-xl bg-accent text-[16px] font-semibold text-on-accent active:opacity-85 disabled:opacity-40';

export function SemesterScreen({ semester, allSemesters, profile, backLabel, onBack, onChange, onDelete }: Props) {
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  useBackHandler(true, onBack);

  const st = semesterStats(semester.courses);
  const limit = profile.maxUnitsPerSemester || 24;
  const over = st.totalUnits - limit;
  const electiveReq = ELECTIVE_UNITS_REQUIRED[`${semester.level}|${semester.semester}`];
  const electiveUnits = semester.courses.filter(c => c.status === 'E').reduce((a, c) => a + c.units, 0);

  const setCourses = (courses: Course[]) => onChange({ ...semester, courses });
  const setGrade = (id: string, g: Course['grade']) =>
    setCourses(semester.courses.map(c => (c.id === id ? { ...c, grade: c.grade === g ? undefined : g } : c)));

  // Compulsory first, then electives, then carryovers
  const courses = [...semester.courses].sort((a, b) => {
    const rank = (c: Course) => (c.carriedFrom ? 2 : c.status === 'E' ? 1 : 0);
    return rank(a) - rank(b);
  });

  return (
    <div className="anim-push px-safe fixed inset-0 z-40 flex flex-col bg-bg">
      <header className="shrink-0 pt-[max(var(--sat),8px)]">
        <div className="mx-auto w-full max-w-2xl px-1.5">
          <button
            onClick={onBack}
            className="flex h-11 items-center rounded-full pr-3 text-[16px] text-accent active:bg-accent-soft"
          >
            <ChevronLeft size={26} strokeWidth={1.8} />
            {backLabel}
          </button>
        </div>
      </header>

      <div className="scroller flex-1 pb-[max(var(--sab),24px)]">
        <div className="mx-auto w-full max-w-2xl">
          <div className="px-5">
            <p className="text-[13px] text-ink-3">
              {semester.level} · {semester.session}
            </p>
            <h1 className="text-[28px] leading-tight font-semibold tracking-[-0.02em] text-ink">
              {semesterLabel(semester.semester)}
            </h1>
          </div>

          <div className="mx-4 mt-4">
            <Segmented
              options={[
                { value: false, label: 'Completed' },
                { value: true, label: 'Planned' },
              ]}
              value={semester.isPlanned}
              onChange={v => onChange({ ...semester, isPlanned: v })}
            />
          </div>

          <div className={`${card} mx-4 mt-3 grid grid-cols-3 divide-x divide-line py-3 text-center`}>
            <Stat label={semester.isPlanned ? 'Expected GP' : 'GP'} value={st.graded ? fmt(st.gpa) : '–'} />
            <Stat label="Units" value={`${st.totalUnits}/${limit}`} danger={over > 0} />
            <Stat label="Courses" value={String(st.count)} />
          </div>

          {(over > 0 || electiveReq) && (
            <div className="mx-5 mt-2 space-y-0.5 text-[13px]">
              {over > 0 && (
                <p className="font-medium text-danger">
                  {over} {over === 1 ? 'unit' : 'units'} over your {limit}-unit limit.
                </p>
              )}
              {electiveReq && (
                <p className={electiveUnits >= electiveReq ? 'text-ink-3' : 'text-ink-2'}>
                  Electives: {electiveUnits} of {electiveReq} units
                  {electiveUnits < electiveReq && ' · pick them from Add courses'}
                </p>
              )}
            </div>
          )}

          <div className="mx-4 mt-6">
            <GroupLabel right={st.count > 0 && <span className="text-[12px] text-ink-3">Tap a course to edit</span>}>
              Courses
            </GroupLabel>
            <div className={`${card} divide-y divide-line overflow-hidden`}>
              {courses.map(c => (
                <div key={c.id} className="px-4 pt-3 pb-3.5">
                  <button
                    onClick={() => setEditing(c)}
                    className="-mx-1 block w-[calc(100%+0.5rem)] rounded-lg px-1 text-left active:bg-surface-2"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-[15px] font-semibold text-ink">{c.code}</span>
                      <span className="shrink-0 text-[12px] text-ink-3">
                        {c.units} {c.units === 1 ? 'unit' : 'units'}
                        {c.status === 'E' && ' · Elective'}
                      </span>
                    </div>
                    <p className="truncate text-[13px] text-ink-2">{c.title}</p>
                    {c.carriedFrom && (
                      <span className="mt-1 inline-block rounded border border-line px-1.5 py-px text-[11px] font-medium text-ink-3">
                        Carryover · {c.carriedFrom}
                      </span>
                    )}
                  </button>
                  <div className="mt-2.5">
                    <GradePicker value={c.grade} onChange={g => setGrade(c.id, g)} />
                  </div>
                </div>
              ))}
              <button
                onClick={() => setAdding(true)}
                className="flex min-h-[52px] w-full items-center gap-2 px-4 text-[15px] font-medium text-accent active:bg-surface-2"
              >
                <Plus size={18} strokeWidth={2} /> Add courses
              </button>
            </div>
          </div>

          <button
            onClick={() => setConfirmDelete(true)}
            className={`${card} mx-4 mt-6 block min-h-[52px] w-[calc(100%-2rem)] text-[15px] font-medium text-danger active:bg-surface-2`}
          >
            Delete semester
          </button>
        </div>
      </div>

      <ConfirmSheet
        open={confirmDelete}
        title="Delete this semester?"
        message={`${semester.level} ${semesterLabel(semester.semester).toLowerCase()} (${semester.session}) and its ${st.count} courses will be removed.`}
        confirmLabel="Delete"
        danger
        onConfirm={onDelete}
        onClose={() => setConfirmDelete(false)}
      />

      <AddCoursesSheet
        open={adding}
        onClose={() => setAdding(false)}
        semester={semester}
        allSemesters={allSemesters}
        limit={limit}
        onAdd={added => {
          setCourses([...semester.courses, ...added]);
          setAdding(false);
        }}
      />

      <CourseSheet
        course={editing}
        onClose={() => setEditing(null)}
        onSave={c => {
          setCourses(semester.courses.map(x => (x.id === c.id ? c : x)));
          setEditing(null);
        }}
        onRemove={id => {
          setCourses(semester.courses.filter(x => x.id !== id));
          setEditing(null);
        }}
      />
    </div>
  );
}

function Stat({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  return (
    <div>
      <p className={`text-[19px] font-semibold tabular-nums ${danger ? 'text-danger' : 'text-ink'}`}>{value}</p>
      <p className="text-[12px] text-ink-3">{label}</p>
    </div>
  );
}

function AddCoursesSheet({
  open,
  onClose,
  semester,
  allSemesters,
  limit,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  semester: SemesterRecord;
  allSemesters: SemesterRecord[];
  limit: number;
  onAdd: (c: Course[]) => void;
}) {
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState('');
  const [custom, setCustom] = useState(false);
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [units, setUnits] = useState(2);
  const [status, setStatus] = useState<CourseStatus>('E');

  useEffect(() => {
    if (open) {
      setPicked(new Set());
      setQuery('');
      setCustom(false);
      setCode('');
      setTitle('');
      setUnits(2);
      setStatus('E');
    }
  }, [open]);

  const existingInThisSemester = useMemo(
    () => new Set(semester.courses.map(c => codeKey(c.code))),
    [semester.courses]
  );

  const alreadyPassedCodes = useMemo(() => {
    const passed = new Set<string>();
    for (const s of allSemesters) {
      for (const c of s.courses) {
        if (c.grade && c.grade !== 'F') passed.add(codeKey(c.code));
      }
    }
    return passed;
  }, [allSemesters]);

  // Not already in this semester and never passed
  const isOpen = useMemo(() => {
    return (c: CourseCatalogItem) => !existingInThisSemester.has(codeKey(c.code)) && !alreadyPassedCodes.has(codeKey(c.code));
  }, [existingInThisSemester, alreadyPassedCodes]);

  // Electives for this level and semester, from every specialisation
  const currentLevelElectives = useMemo(
    () =>
      CURRICULUM_DATA.filter(
        c => c.level === semester.level && c.semester === semester.semester && c.status === 'E' && isOpen(c)
      ),
    [semester.level, semester.semester, isOpen]
  );

  // Electives from earlier levels of the same semester type that were never taken
  const previousUnpickedElectives = useMemo(() => {
    const curRank = LEVEL_RANK[semester.level] || 5;
    return CURRICULUM_DATA.filter(
      c => c.semester === semester.semester && c.status === 'E' && LEVEL_RANK[c.level] < curRank && isOpen(c)
    );
  }, [semester.level, semester.semester, isOpen]);

  const currentCompulsory = useMemo(
    () =>
      getCurriculumCoursesForSemester(semester.level, semester.semester).filter(
        c => c.status === 'C' && !existingInThisSemester.has(codeKey(c.code))
      ),
    [semester.level, semester.semester, existingInThisSemester]
  );

  const q = query.trim().toLowerCase();
  const qKey = codeKey(q);
  const results = q
    ? CURRICULUM_DATA.filter(
        c =>
          !existingInThisSemester.has(codeKey(c.code)) &&
          (codeKey(c.code).includes(qKey) ||
            c.title.toLowerCase().includes(q) ||
            c.specialization?.toLowerCase().includes(q))
      ).slice(0, 30)
    : null;

  const currentUnits = semesterStats(semester.courses).totalUnits;
  // Map by code so a course listed under two levels is only counted once
  const pickedItems = [
    ...new Map(CURRICULUM_DATA.filter(c => picked.has(codeKey(c.code))).map(c => [codeKey(c.code), c])).values(),
  ];
  const pickedUnits = pickedItems.reduce((a, c) => a + c.units, 0);
  const totalAfterAdd = currentUnits + pickedUnits;
  const over = totalAfterAdd > limit;

  const toggle = (c: CourseCatalogItem) => {
    const k = codeKey(c.code);
    const next = new Set(picked);
    if (next.has(k)) next.delete(k);
    else if (totalAfterAdd + c.units <= limit) next.add(k);
    else return;
    setPicked(next);
  };

  const row = (c: CourseCatalogItem, showLevel = false) => {
    const on = picked.has(codeKey(c.code));
    const wontFit = !on && totalAfterAdd + c.units > limit;
    return (
      <button
        key={`${c.code}-${c.level}`}
        onClick={() => toggle(c)}
        disabled={wontFit}
        aria-pressed={on}
        className="flex w-full items-center gap-3 px-4 py-3 text-left active:bg-surface-2 disabled:opacity-45"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <p className="text-[15px] font-semibold text-ink">{c.code}</p>
            <span className="text-[12px] text-ink-3">
              {c.units} {c.units === 1 ? 'unit' : 'units'}
              {showLevel && ` · ${c.level}`}
              {c.status === 'E' && ' · Elective'}
              {wontFit && ' · over limit'}
            </span>
          </div>
          <p className="truncate text-[13px] text-ink-2">{c.title}</p>
          {c.specialization && c.specialization !== 'General' && (
            <p className="mt-0.5 truncate text-[12px] text-ink-3">{c.specialization}</p>
          )}
        </div>
        <span
          className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border transition-colors ${
            on ? 'border-accent bg-accent text-on-accent' : 'border-line'
          }`}
        >
          {on && <Check size={14} strokeWidth={3} />}
        </span>
      </button>
    );
  };

  const section = (label: string, items: CourseCatalogItem[], showLevel = false) =>
    items.length > 0 && (
      <div className="mt-5">
        <GroupLabel>{label}</GroupLabel>
        <div className={`${card} divide-y divide-line overflow-hidden`}>{items.map(c => row(c, showLevel))}</div>
      </div>
    );

  const customOver = currentUnits + units > limit;
  const customDuplicate = existingInThisSemester.has(codeKey(code));

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={custom ? 'Add your own course' : 'Add courses'}
      footer={
        !custom && (
          <>
            <button
              disabled={!picked.size || over}
              onClick={() =>
                onAdd(
                  pickedItems.map(c => ({
                    id: uid(),
                    code: c.code,
                    title: c.title,
                    units: c.units,
                    status: c.status,
                  }))
                )
              }
              className={primaryBtn}
            >
              {picked.size
                ? `Add ${picked.size} ${picked.size === 1 ? 'course' : 'courses'} · ${pickedUnits} units`
                : 'Select courses'}
            </button>
            <p className={`mt-2 text-center text-[12px] tabular-nums ${over ? 'font-medium text-danger' : 'text-ink-3'}`}>
              {totalAfterAdd} of {limit} units{over && ' · over your limit'}
            </p>
          </>
        )
      }
    >
      {custom ? (
        <div className="space-y-3 pt-1">
          <label className="block">
            <span className="text-[13px] text-ink-3">Course code</span>
            <input
              className="field mt-1 uppercase"
              placeholder="e.g. SSG 499"
              value={code}
              autoCapitalize="characters"
              autoComplete="off"
              onChange={e => setCode(e.target.value.toUpperCase())}
            />
          </label>
          <label className="block">
            <span className="text-[13px] text-ink-3">Title</span>
            <input className="field mt-1" placeholder="Course title" value={title} onChange={e => setTitle(e.target.value)} />
          </label>
          <div className="flex items-center justify-between pt-1">
            <span className="text-[15px] font-medium text-ink">Units</span>
            <Stepper value={units} onChange={setUnits} min={1} max={6} />
          </div>
          <Segmented
            options={[
              { value: 'E' as CourseStatus, label: 'Elective' },
              { value: 'C' as CourseStatus, label: 'Compulsory' },
            ]}
            value={status}
            onChange={setStatus}
          />
          {(customOver || customDuplicate) && (
            <p className="text-[13px] text-danger">
              {customDuplicate
                ? `${code.trim()} is already in this semester.`
                : `That would take you over your ${limit}-unit limit (${currentUnits} units so far).`}
            </p>
          )}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button onClick={() => setCustom(false)} className="h-12 rounded-xl bg-surface-2 text-[15px] font-medium text-ink active:opacity-80">
              Back
            </button>
            <button
              disabled={!code.trim() || customOver || customDuplicate}
              onClick={() => onAdd([{ id: uid(), code: code.trim(), title: title.trim() || code.trim(), units, status }])}
              className={primaryBtn}
            >
              Add course
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="relative">
            <Search size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink-3" />
            <input
              className="field pl-9"
              type="search"
              enterKeyHint="search"
              placeholder="Search by code or title"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>

          {results ? (
            results.length ? (
              section('Results', results, true)
            ) : (
              <p className="mt-6 text-center text-[14px] text-ink-3">No matching courses.</p>
            )
          ) : (
            <>
              {section(`${semester.level} electives · any track`, currentLevelElectives)}
              {section('Electives you skipped earlier', previousUnpickedElectives, true)}
              {section(`${semester.level} compulsory, not yet added`, currentCompulsory)}

              {currentLevelElectives.length === 0 &&
                previousUnpickedElectives.length === 0 &&
                currentCompulsory.length === 0 && (
                  <p className="mt-5 text-center text-[14px] leading-relaxed text-ink-3">
                    Every curriculum course for this semester is already in. Search above, or add your own below.
                  </p>
                )}
            </>
          )}

          <button
            onClick={() => setCustom(true)}
            className="mt-4 -ml-2 flex h-11 items-center gap-1.5 rounded-full px-2 text-[15px] font-medium text-accent active:bg-accent-soft"
          >
            <Plus size={17} strokeWidth={2} /> Add a course that isn't listed
          </button>
        </>
      )}
    </Sheet>
  );
}

function CourseSheet({
  course,
  onClose,
  onSave,
  onRemove,
}: {
  course: Course | null;
  onClose: () => void;
  onSave: (c: Course) => void;
  onRemove: (id: string) => void;
}) {
  const [draft, setDraft] = useState<Course | null>(course);
  useEffect(() => setDraft(course), [course]);

  return (
    <Sheet
      open={!!course && !!draft}
      onClose={onClose}
      title="Edit course"
      footer={
        draft && (
          <button
            disabled={!draft.code.trim()}
            onClick={() => onSave({ ...draft, code: draft.code.trim(), title: draft.title.trim() || draft.code.trim() })}
            className={primaryBtn}
          >
            Save
          </button>
        )
      }
    >
      {course && draft && (
        <div className="space-y-3 pt-1">
          <label className="block">
            <span className="text-[13px] text-ink-3">Course code</span>
            <input
              className="field mt-1 uppercase"
              value={draft.code}
              autoCapitalize="characters"
              autoComplete="off"
              onChange={e => setDraft({ ...draft, code: e.target.value.toUpperCase() })}
            />
          </label>
          <label className="block">
            <span className="text-[13px] text-ink-3">Title</span>
            <input className="field mt-1" value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} />
          </label>
          <div className="flex items-center justify-between pt-1">
            <span className="text-[15px] font-medium text-ink">Units</span>
            <Stepper value={draft.units} onChange={u => setDraft({ ...draft, units: u })} min={0} max={6} />
          </div>
          <Segmented
            options={[
              { value: 'C' as CourseStatus, label: 'Compulsory' },
              { value: 'E' as CourseStatus, label: 'Elective' },
            ]}
            value={draft.status}
            onChange={s => setDraft({ ...draft, status: s })}
          />
          <div>
            <p className="mb-1.5 text-[13px] text-ink-3">Grade</p>
            <GradePicker value={draft.grade} onChange={g => setDraft({ ...draft, grade: draft.grade === g ? undefined : g })} />
          </div>
          <button
            onClick={() => onRemove(course.id)}
            className="mt-2 h-12 w-full rounded-xl text-[15px] font-medium text-danger active:bg-danger-soft"
          >
            Remove from this semester
          </button>
        </div>
      )}
    </Sheet>
  );
}
