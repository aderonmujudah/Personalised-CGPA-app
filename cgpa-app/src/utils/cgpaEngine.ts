import type { Course, Grade, Level, SemesterRecord, SemesterType } from '../types';

export const GRADES: Grade[] = ['A', 'B', 'C', 'D', 'E', 'F'];

export const GRADE_POINTS: Record<Grade, number> = { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 };

export const codeKey = (code: string) => code.replace(/\s+/g, '').toUpperCase();

/** Chronological key: session start year, then first/second semester. */
export const semesterKey = (s: Pick<SemesterRecord, 'session' | 'semester'>) => {
  const year = parseInt(s.session.slice(0, 4), 10) || 0;
  return year * 10 + (s.semester === 'Second Semester' ? 1 : 0);
};

export const sortSemesters = (list: SemesterRecord[]) =>
  [...list].sort((a, b) => semesterKey(a) - semesterKey(b));

export const semesterLabel = (t: SemesterType) => (t === 'First Semester' ? 'First semester' : 'Second semester');
export const semesterShort = (t: SemesterType) => (t === 'First Semester' ? '1st' : '2nd');

export const nextSession = (session: string) => {
  const y = parseInt(session.slice(0, 4), 10);
  if (!y) return session;
  return `${y + 1}/${y + 2}`;
};

export function semesterStats(courses: Course[]) {
  let gradedUnits = 0;
  let points = 0;
  let totalUnits = 0;
  let graded = 0;
  for (const c of courses) {
    totalUnits += c.units;
    if (c.grade) {
      gradedUnits += c.units;
      points += GRADE_POINTS[c.grade] * c.units;
      graded++;
    }
  }
  return {
    gpa: gradedUnits ? points / gradedUnits : 0,
    gradedUnits,
    points,
    totalUnits,
    graded,
    count: courses.length,
  };
}

/** CGPA across a list of semesters (every graded attempt counts, as on the transcript). */
export function cumulative(list: SemesterRecord[]) {
  let units = 0;
  let points = 0;
  for (const s of list) {
    const st = semesterStats(s.courses);
    units += st.gradedUnits;
    points += st.points;
  }
  return { units, points, cgpa: units ? points / units : 0 };
}

export const fmt = (n: number) => (Math.round(n * 100) / 100).toFixed(2);

export const CLASSES = [
  { name: 'First Class', min: 4.5 },
  { name: 'Second Class Upper', min: 3.5 },
  { name: 'Second Class Lower', min: 2.4 },
  { name: 'Third Class', min: 1.5 },
  { name: 'Pass', min: 1.0 },
  { name: 'Below pass', min: 0 },
];

export function classify(cgpa: number) {
  const v = Math.round(cgpa * 100) / 100;
  const idx = CLASSES.findIndex(c => v >= c.min);
  const current = CLASSES[idx === -1 ? CLASSES.length - 1 : idx];
  const next = idx > 0 ? CLASSES[idx - 1] : null;
  return { name: current.name, next: next ? { name: next.name, gap: next.min - v } : null };
}

/** Distinct passed units (a retaken course only counts once). */
export function earnedUnits(list: SemesterRecord[]) {
  const passed = new Map<string, { units: number; status: 'C' | 'E'; level: Level }>();
  for (const s of sortSemesters(list)) {
    for (const c of s.courses) {
      if (c.grade && c.grade !== 'F') {
        passed.set(codeKey(c.code), { units: c.units, status: c.status, level: s.level });
      }
    }
  }
  const byLevel: Record<Level, number> = { '100L': 0, '200L': 0, '300L': 0, '400L': 0, '500L': 0 };
  let total = 0;
  let compulsory = 0;
  let elective = 0;
  passed.forEach(p => {
    total += p.units;
    byLevel[p.level] += p.units;
    if (p.status === 'E') elective += p.units;
    else compulsory += p.units;
  });
  return { total, compulsory, elective, byLevel };
}

/**
 * Carryovers: a course graded F is placed into the next session's semester of
 * the same type (first → first, second → second). If it's failed again there,
 * it moves on to the one after. Once passed, it stops appearing.
 * Auto-added retakes that are still ungraded are removed if the original F is
 * later changed to a pass.
 */
export function normalizeCarryovers(semesters: SemesterRecord[]): SemesterRecord[] {
  const pending = new Map<string, { course: Course; session: string; type: SemesterType }>();

  return sortSemesters(semesters).map(sem => {
    let courses = sem.courses.filter(c => {
      if (!c.carriedFrom || c.grade) return true;
      const p = pending.get(codeKey(c.code));
      return !!p && p.type === sem.semester;
    });

    const present = new Set(courses.map(c => codeKey(c.code)));
    for (const [key, p] of pending) {
      if (p.type !== sem.semester) continue;
      if (!present.has(key)) {
        courses = [
          ...courses,
          {
            id: `carry-${sem.id}-${key}`,
            code: p.course.code,
            title: p.course.title,
            units: p.course.units,
            status: p.course.status,
            carriedFrom: p.session,
          },
        ];
      }
      pending.delete(key);
    }

    for (const c of courses) {
      const key = codeKey(c.code);
      if (c.grade === 'F') pending.set(key, { course: c, session: sem.session, type: sem.semester });
      else if (c.grade) pending.delete(key);
    }

    const changed =
      courses.length !== sem.courses.length || courses.some((c, i) => c !== sem.courses[i]);
    return changed ? { ...sem, courses } : sem;
  });
}

/** Average GP needed across `remaining` units to land on `target`. */
export function requiredAverage(points: number, units: number, target: number, remaining: number) {
  if (remaining <= 0) return null;
  return (target * (units + remaining) - points) / remaining;
}
