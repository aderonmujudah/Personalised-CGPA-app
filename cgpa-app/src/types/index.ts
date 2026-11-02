export type Grade = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export type CourseStatus = 'C' | 'E'; // Compulsory or Elective

export type SemesterType = 'First Semester' | 'Second Semester';

export type Level = '100L' | '200L' | '300L' | '400L' | '500L';

export interface CourseCatalogItem {
  code: string;
  title: string;
  units: number;
  status: CourseStatus;
  level: Level;
  semester: SemesterType;
  specialization?: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  units: number;
  status: CourseStatus;
  grade?: Grade; // undefined = not graded yet
  carriedFrom?: string; // session the course was failed in, if it's a retake
}

export interface SemesterRecord {
  id: string;
  level: Level;
  semester: SemesterType;
  session: string; // e.g. "2023/2024"
  isPlanned: boolean; // false = completed, true = planned future
  courses: Course[];
}

export interface UserProfile {
  name: string;
  matricNo: string;
  department: string;
  targetCGPA: number;
  maxUnitsPerSemester: number;
}
