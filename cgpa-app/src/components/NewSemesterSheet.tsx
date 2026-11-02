import { useEffect, useState } from 'react';
import type { Level, SemesterRecord, SemesterType } from '../types';
import { getCompulsoryCoursesForSemester } from '../data/curriculumData';
import { nextSession, semesterLabel, sortSemesters } from '../utils/cgpaEngine';
import { Segmented, Sheet } from './ui';

const LEVELS: Level[] = ['100L', '200L', '300L', '400L', '500L'];

export function NewSemesterSheet({
  open,
  onClose,
  semesters,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  semesters: SemesterRecord[];
  onCreate: (s: SemesterRecord) => void;
}) {
  const [level, setLevel] = useState<Level>('100L');
  const [type, setType] = useState<SemesterType>('First Semester');
  const [session, setSession] = useState('');
  const [planned, setPlanned] = useState(true);

  // Suggest whatever comes after the latest semester
  useEffect(() => {
    if (!open) return;
    const last = sortSemesters(semesters).at(-1);
    if (!last) {
      setLevel('100L');
      setType('First Semester');
      setSession(`${new Date().getFullYear()}/${new Date().getFullYear() + 1}`);
    } else if (last.semester === 'First Semester') {
      setLevel(last.level);
      setType('Second Semester');
      setSession(last.session);
    } else {
      const i = LEVELS.indexOf(last.level);
      setLevel(LEVELS[Math.min(i + 1, LEVELS.length - 1)]);
      setType('First Semester');
      setSession(nextSession(last.session));
    }
    setPlanned(true);
  }, [open, semesters]);

  const trimmed = session.trim();
  const validSession = /^\d{4}\/\d{4}$/.test(trimmed) && +trimmed.slice(5) === +trimmed.slice(0, 4) + 1;
  const duplicate = semesters.some(s => s.session === trimmed && s.semester === type);
  const compulsory = getCompulsoryCoursesForSemester(level, type);
  const units = compulsory.reduce((a, c) => a + c.units, 0);

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="New semester"
      footer={
        <button
          disabled={!validSession || duplicate}
          onClick={() =>
            onCreate({
              id: `s-${Date.now().toString(36)}`,
              level,
              semester: type,
              session: trimmed,
              isPlanned: planned,
              courses: compulsory.map((c, i) => ({
                id: `c-${Date.now().toString(36)}-${i}`,
                code: c.code,
                title: c.title,
                units: c.units,
                status: c.status,
              })),
            })
          }
          className="h-12 w-full rounded-xl bg-accent text-[16px] font-semibold text-on-accent active:opacity-85 disabled:opacity-40"
        >
          Create semester
        </button>
      }
    >
      <div className="space-y-4 pt-1">
        <div>
          <p className="mb-1.5 text-[13px] text-ink-3">Level</p>
          <Segmented options={LEVELS.map(l => ({ value: l, label: l.replace('L', '') }))} value={level} onChange={setLevel} />
        </div>
        <div>
          <p className="mb-1.5 text-[13px] text-ink-3">Semester</p>
          <Segmented
            options={[
              { value: 'First Semester' as SemesterType, label: 'First' },
              { value: 'Second Semester' as SemesterType, label: 'Second' },
            ]}
            value={type}
            onChange={setType}
          />
        </div>
        <label className="block">
          <span className="text-[13px] text-ink-3">Session</span>
          <input
            className="field mt-1"
            value={session}
            onChange={e => setSession(e.target.value)}
            placeholder="2026/2027"
            inputMode="numeric"
            autoComplete="off"
          />
        </label>
        <div>
          <p className="mb-1.5 text-[13px] text-ink-3">Status</p>
          <Segmented
            options={[
              { value: true, label: 'Planned' },
              { value: false, label: 'Completed' },
            ]}
            value={planned}
            onChange={setPlanned}
          />
        </div>
        <p className={`text-[13px] leading-relaxed ${duplicate || (trimmed && !validSession) ? 'text-danger' : 'text-ink-3'}`}>
          {trimmed && !validSession
            ? 'Use the session format 2026/2027.'
            : duplicate
            ? `You already have a ${semesterLabel(type).toLowerCase()} for ${session}.`
            : compulsory.length
              ? `${compulsory.length} compulsory courses (${units} units) will be added for you. Any course you failed in the last ${semesterLabel(type).toLowerCase()} is added too. You can pick electives after.`
              : 'No courses in the curriculum for this semester — add them yourself after.'}
        </p>
      </div>
    </Sheet>
  );
}

