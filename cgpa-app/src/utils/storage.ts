import type { Course, CourseStatus, Grade, Level, SemesterRecord, SemesterType, UserProfile } from '../types';
import { getCompulsoryCoursesForSemester } from '../data/curriculumData';

const KEY_SEMESTERS = 'cgpa.semesters.v3';
const KEY_PROFILE = 'cgpa.profile.v3';

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Judah Aderonmu',
  matricNo: '210407089',
  department: 'Systems Engineering',
  targetCGPA: 4.5,
  maxUnitsPerSemester: 24,
};

type Row = [code: string, title: string, units: number, grade?: Grade, status?: CourseStatus];

const sem = (
  id: string,
  level: Level,
  semester: SemesterType,
  session: string,
  isPlanned: boolean,
  rows: Row[],
  extra: Partial<Record<string, Partial<Course>>> = {}
): SemesterRecord => ({
  id,
  level,
  semester,
  session,
  isPlanned,
  courses: rows.map(([code, title, units, grade, status], i) => ({
    id: `${id}-${i}`,
    code,
    title,
    units,
    status: status ?? 'C',
    grade,
    ...(extra[code] ?? {}),
  })),
});

const planned = (id: string, level: Level, semester: SemesterType, session: string): SemesterRecord =>
  sem(
    id,
    level,
    semester,
    session,
    true,
    getCompulsoryCoursesForSemester(level, semester).map(c => [c.code, c.title, c.units] as Row)
  );

/** Seeded from the official transcript (course codes and units as they appear there). */
export const createDefaultSemesters = (): SemesterRecord[] => [
  sem('s1', '100L', 'First Semester', '2021/2022', false, [
    ['FSC 112', 'Introductory Chemistry I', 3, 'B'],
    ['FSC 115', 'Introductory Physics I', 3, 'B'],
    ['GEG 113', 'Engineering Applied Mathematics I', 3, 'B'],
    ['GEG 115', 'Engineering Algebra I', 2, 'B'],
    ['GEG 117', 'Engineering Calculus I', 2, 'C'],
    ['GST 102', 'Philosophy & Logic of Science', 2, 'B'],
    ['GST 105', 'Use of English', 2, 'B'],
    ['MEG 111', 'Workshop Practice I', 1, 'C'],
  ]),
  sem('s2', '100L', 'Second Semester', '2021/2022', false, [
    ['GEG 124', 'Engineering Applied Mathematics II', 3, 'B'],
    ['GEG 126', 'Engineering Algebra II', 2, 'C'],
    ['GEG 128', 'Engineering Calculus II', 2, 'A'],
    ['GST 103', 'Nigerian Peoples and Culture', 2, 'B'],
    ['MEG 121', 'Workshop Practice II', 1, 'B'],
    ['PHS 121', 'Introductory Physics II', 3, 'C'],
    ['PHS 122', 'Introductory Physics III', 3, 'B'],
    ['PHS 123', 'Introductory Practical Physics', 2, 'A'],
  ]),
  sem('s3', '200L', 'First Semester', '2023/2024', false, [
    ['CEG 211', 'Mechanics of Materials I', 3, 'F'],
    ['EEG 211', 'Fundamentals of Electrical Engineering I', 2, 'A'],
    ['EEG 213', 'Signals & Systems Theory', 2, 'C'],
    ['EEG 231', 'Fundamentals of Electrical Engineering I Lab', 1, 'B'],
    ['GEG 217', 'Engineering Calculus III', 2, 'C'],
    ['GEG 219', 'Ordinary Differential Equations', 2, 'C'],
    ['GST 201', 'General African Studies I', 2, 'B'],
    ['MEG 211', 'Engineering Drawing', 2, 'C'],
    ['MEG 212', 'Fundamentals of Thermodynamics', 2, 'C'],
    ['SSG 215', 'Introduction to Engineering Computing', 2, 'A'],
  ]),
  sem('s4', '200L', 'Second Semester', '2023/2024', false, [
    ['CEG 221', 'Mechanics of Materials II', 2, 'C'],
    ['EEG 220', 'Fundamentals of Electrical Engineering II Lab', 1, 'C'],
    ['EEG 222', 'Fundamentals of Electrical Engineering II', 2, 'A'],
    ['EEG 224', 'Intro. to Switching & Logic Systems', 2, 'C'],
    ['GEG 222', 'Introduction to Engineering Statistics', 3, 'A'],
    ['GEG 228', 'Engineers in the Society', 1, 'A'],
    ['MEG 222', 'Fundamentals of Fluid Mechanics', 2, 'B'],
    ['SSG 222', 'Introduction to Systems Methodology', 1, 'A'],
    ['SSG 226', 'Introduction to Numerical Methods', 2, 'C'],
    ['SSG 227', 'Engineering Computer Graphics', 2, 'A'],
  ]),
  sem(
    's5',
    '300L',
    'First Semester',
    '2024/2025',
    false,
    [
      ['EEG 317', 'Instrumentation & Measurement I', 2, 'D'],
      ['EEG 331', 'Electronic Circuits I', 2, 'D'],
      ['EEG 335', 'Electronic Circuits Lab I', 1, 'A'],
      ['GEG 311', 'Calculus of Several Variables', 3, 'C'],
      ['GST 307', 'Entrepreneurship & Corporate Governance', 2, 'B'],
      ['MEG 319', 'Mechanical Engineering Technology (Non-Majors)', 3, 'B'],
      ['SSG 311', 'Mathematical Modelling for AI Systems', 3, 'C'],
      ['SSG 317', 'Operations Research I', 2, 'C'],
      ['SSG 335', 'Introductory Robotic Systems', 2, 'A'],
      ['SSG 336', 'Robotics Laboratory I', 1, 'A'],
      ['CEG 211', 'Mechanics of Materials I', 3, 'E'],
    ],
    { 'CEG 211': { carriedFrom: '2023/2024' } }
  ),
  sem('s6', '300L', 'Second Semester', '2024/2025', false, [
    ['GEG 322', 'Operational Methods I', 3, 'D'],
    ['SSG 320', 'Rigid Body Dynamics', 2, 'B'],
    ['SSG 321', 'Introduction to Continuum Mechanics', 2, 'A'],
    ['SSG 322', 'Control Theory I', 2, 'A'],
    ['SSG 324', 'Algorithms and Data Structures', 2, 'C'],
    ['SSG 326', 'Engineering Materials & the Environment', 2, 'A'],
    ['SSG 328', 'Operations Research II', 2, 'C'],
    ['SSG 340', 'Technical Computing Laboratory', 1, 'A'],
    ['SSG 342', 'Control Laboratory I', 1, 'A'],
    ['SSG 348', 'Industrial Engineering', 2, 'C'],
  ]),
  sem('s7', '400L', 'First Semester', '2025/2026', false, [
    ['GEG 411', 'Technical Communications', 1, 'A'],
    ['GEG 412', 'Numerical Methods in Engineering', 2, 'A'],
    ['GEG 413', 'Advanced Engineering Statistics', 3, 'A'],
    ['SSG 418', 'Systems Simulation I', 2, 'A'],
    ['SSG 434', 'Embedded Systems Programming', 2, 'C'],
    ['SSG 437', 'Emerging Concepts and Technologies', 1, 'C'],
    ['SSG 451', 'Stochastic Models', 2, 'A'],
    ['SSG 415', 'Mechatronics and Robotic Systems', 2, 'A', 'E'],
    ['SSG 432', 'Statistical Quality Control', 2, 'B', 'E'],
    ['SSG 435', 'Control Systems Analysis', 2, 'A', 'E'],
    ['SSG 438', 'Bio-Inspired Computing', 2, 'A', 'E'],
  ]),
  // Future semesters come from the curriculum PDF (compulsory courses only; pick electives in the app)
  planned('s8', '400L', 'Second Semester', '2025/2026'),
  planned('s9', '500L', 'First Semester', '2026/2027'),
  planned('s10', '500L', 'Second Semester', '2026/2027'),
];

export const loadSemesters = (): SemesterRecord[] => {
  try {
    const raw = localStorage.getItem(KEY_SEMESTERS);
    if (raw) return JSON.parse(raw);
  } catch {
    /* fall through to defaults */
  }
  return createDefaultSemesters();
};

export const saveSemesters = (semesters: SemesterRecord[]) => {
  try {
    localStorage.setItem(KEY_SEMESTERS, JSON.stringify(semesters));
  } catch {
    /* storage full or unavailable */
  }
};

export const loadProfile = (): UserProfile => {
  try {
    const raw = localStorage.getItem(KEY_PROFILE);
    if (raw) return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    /* fall through */
  }
  return DEFAULT_PROFILE;
};

export const saveProfile = (profile: UserProfile) => {
  try {
    localStorage.setItem(KEY_PROFILE, JSON.stringify(profile));
  } catch {
    /* ignore */
  }
};
