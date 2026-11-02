import type { CourseCatalogItem, Level } from '../types';

// Section 8a of the curriculum: units required per level to graduate
export const REQUIRED_BY_LEVEL: Record<Level, { compulsory: number; elective: number }> = {
  '100L': { compulsory: 35, elective: 0 },
  '200L': { compulsory: 38, elective: 0 },
  '300L': { compulsory: 40, elective: 0 },
  '400L': { compulsory: 20, elective: 6 },
  '500L': { compulsory: 21, elective: 12 },
};
export const TOTAL_COMPULSORY = 154;
export const TOTAL_ELECTIVE = 18;
export const TOTAL_REQUIRED = TOTAL_COMPULSORY + TOTAL_ELECTIVE; // 172

// Elective units you must pick in a given semester
export const ELECTIVE_UNITS_REQUIRED: Record<string, number> = {
  '400L|First Semester': 6,
  '500L|First Semester': 5,
  '500L|Second Semester': 7,
};

export const CURRICULUM_DATA: CourseCatalogItem[] = [
  // ================= 100 LEVEL =================
  // 100L First Semester (From Judah's Transcript)
  { code: 'FSC 112', title: 'Introductory Chemistry I', units: 3, status: 'C', level: '100L', semester: 'First Semester', specialization: 'General' },
  { code: 'FSC 115', title: 'Introductory Physics I', units: 3, status: 'C', level: '100L', semester: 'First Semester', specialization: 'General' },
  { code: 'GEG 113', title: 'Engineering Applied Mathematics I', units: 3, status: 'C', level: '100L', semester: 'First Semester', specialization: 'General' },
  { code: 'GEG 115', title: 'Engineering Algebra I', units: 2, status: 'C', level: '100L', semester: 'First Semester', specialization: 'General' },
  { code: 'GEG 117', title: 'Engineering Calculus I', units: 2, status: 'C', level: '100L', semester: 'First Semester', specialization: 'General' },
  { code: 'GST 102', title: 'Philosophy & Logic Of Science', units: 2, status: 'C', level: '100L', semester: 'First Semester', specialization: 'General' },
  { code: 'GST 105', title: 'Use Of English', units: 2, status: 'C', level: '100L', semester: 'First Semester', specialization: 'General' },
  { code: 'MEG 111', title: 'Workshop Practice I', units: 1, status: 'C', level: '100L', semester: 'First Semester', specialization: 'General' },

  // 100L Second Semester (From Judah's Transcript)
  { code: 'GEG 124', title: 'Engineering Applied Mathematics II', units: 3, status: 'C', level: '100L', semester: 'Second Semester', specialization: 'General' },
  { code: 'GEG 126', title: 'Engineering Algebra II', units: 2, status: 'C', level: '100L', semester: 'Second Semester', specialization: 'General' },
  { code: 'GEG 128', title: 'Engineering Calculus', units: 2, status: 'C', level: '100L', semester: 'Second Semester', specialization: 'General' },
  { code: 'GST 103', title: 'Nigerian Peoples And Culture', units: 2, status: 'C', level: '100L', semester: 'Second Semester', specialization: 'General' },
  { code: 'MEG 121', title: 'Workshop Practice II', units: 1, status: 'C', level: '100L', semester: 'Second Semester', specialization: 'General' },
  { code: 'PHS 121', title: 'Introductory Physics II', units: 3, status: 'C', level: '100L', semester: 'Second Semester', specialization: 'General' },
  { code: 'PHS 122', title: 'Introductory To Physics III', units: 3, status: 'C', level: '100L', semester: 'Second Semester', specialization: 'General' },
  { code: 'PHS 123', title: 'Introductory Practical Physics', units: 2, status: 'C', level: '100L', semester: 'Second Semester', specialization: 'General' },

  // ================= 200 LEVEL =================
  // 200L First Semester (From Judah's Transcript)
  { code: 'CEG 211', title: 'Mechanics Of Materials I', units: 3, status: 'C', level: '200L', semester: 'First Semester', specialization: 'General' },
  { code: 'EEG 211', title: 'Fundamentals Of Electrical Engineering I', units: 2, status: 'C', level: '200L', semester: 'First Semester', specialization: 'General' },
  { code: 'EEG 213', title: 'Signals & Systems Theory', units: 2, status: 'C', level: '200L', semester: 'First Semester', specialization: 'General' },
  { code: 'EEG 231', title: 'Fundamentals Of Electrical Engineering I Lab', units: 1, status: 'C', level: '200L', semester: 'First Semester', specialization: 'General' },
  { code: 'GEG 217', title: 'Engineering Calculus III', units: 2, status: 'C', level: '200L', semester: 'First Semester', specialization: 'General' },
  { code: 'GEG 219', title: 'Ordinary Differential Equations', units: 2, status: 'C', level: '200L', semester: 'First Semester', specialization: 'General' },
  { code: 'GST 201', title: 'General African Studies I', units: 2, status: 'C', level: '200L', semester: 'First Semester', specialization: 'General' },
  { code: 'MEG 211', title: 'Engineering Drawing', units: 2, status: 'C', level: '200L', semester: 'First Semester', specialization: 'General' },
  { code: 'MEG 212', title: 'Fundamentals Of Thermodynamics', units: 2, status: 'C', level: '200L', semester: 'First Semester', specialization: 'General' },
  { code: 'SSG 215', title: 'Introduction To Engineering Computing', units: 2, status: 'C', level: '200L', semester: 'First Semester', specialization: 'General' },

  // 200L Second Semester (From Judah's Transcript)
  { code: 'CEG 221', title: 'Mechanics Of Materials II', units: 2, status: 'C', level: '200L', semester: 'Second Semester', specialization: 'General' },
  { code: 'EEG 220', title: 'Fundamentals Of Electrical Engineering II Lab.', units: 1, status: 'C', level: '200L', semester: 'Second Semester', specialization: 'General' },
  { code: 'EEG 222', title: 'Fundamentals Of Electrical Engineering II', units: 2, status: 'C', level: '200L', semester: 'Second Semester', specialization: 'General' },
  { code: 'EEG 224', title: 'Intro. To Switching & Logic Systems', units: 2, status: 'C', level: '200L', semester: 'Second Semester', specialization: 'General' },
  { code: 'GEG 222', title: 'Introduction To Engineering Statistics', units: 3, status: 'C', level: '200L', semester: 'Second Semester', specialization: 'General' },
  { code: 'GEG 228', title: 'Engineers In The Society', units: 1, status: 'C', level: '200L', semester: 'Second Semester', specialization: 'General' },
  { code: 'MEG 222', title: 'Fundamentals Of Fluids Mechanics', units: 2, status: 'C', level: '200L', semester: 'Second Semester', specialization: 'General' },
  { code: 'SSG 222', title: 'Introduction To Systems Methodology', units: 1, status: 'C', level: '200L', semester: 'Second Semester', specialization: 'General' },
  { code: 'SSG 226', title: 'Introduction To Numerical Methods', units: 2, status: 'C', level: '200L', semester: 'Second Semester', specialization: 'General' },
  { code: 'SSG 227', title: 'Engineering Computer Graphics', units: 2, status: 'C', level: '200L', semester: 'Second Semester', specialization: 'General' },

  // ================= 300 LEVEL =================
  // 300L First Semester (From Judah's Transcript)
  { code: 'EEG 317', title: 'Instrumentation & Measurement I', units: 2, status: 'C', level: '300L', semester: 'First Semester', specialization: 'General' },
  { code: 'EEG 331', title: 'Electronic Circuits I', units: 2, status: 'C', level: '300L', semester: 'First Semester', specialization: 'General' },
  { code: 'EEG 335', title: 'Electronics Circuits Lab I', units: 1, status: 'C', level: '300L', semester: 'First Semester', specialization: 'General' },
  { code: 'GEG 311', title: 'Calculus Of Several Variables', units: 3, status: 'C', level: '300L', semester: 'First Semester', specialization: 'General' },
  { code: 'GST 307', title: 'Entrepreneurship & Corporate Governance', units: 2, status: 'C', level: '300L', semester: 'First Semester', specialization: 'General' },
  { code: 'MEG 319', title: 'Mechanical Engineering Technology (For Non-Majors)', units: 3, status: 'C', level: '300L', semester: 'First Semester', specialization: 'General' },
  { code: 'SSG 311', title: 'Mathematical Modelling For Artificial Intelligent Systems', units: 3, status: 'C', level: '300L', semester: 'First Semester', specialization: 'General' },
  { code: 'SSG 317', title: 'Operations Research I', units: 2, status: 'C', level: '300L', semester: 'First Semester', specialization: 'General' },
  { code: 'SSG 335', title: 'Introductory Robotic Systems', units: 2, status: 'C', level: '300L', semester: 'First Semester', specialization: 'General' },
  { code: 'SSG 336', title: 'Robotics Laboratory I', units: 1, status: 'C', level: '300L', semester: 'First Semester', specialization: 'General' },

  // 300L Second Semester (From Judah's Transcript)
  { code: 'GEG 322', title: 'Operational Methods I', units: 3, status: 'C', level: '300L', semester: 'Second Semester', specialization: 'General' },
  { code: 'SSG 320', title: 'Rigid Body Dynamics', units: 2, status: 'C', level: '300L', semester: 'Second Semester', specialization: 'General' },
  { code: 'SSG 321', title: 'Introduction To Continuum Mechanics', units: 2, status: 'C', level: '300L', semester: 'Second Semester', specialization: 'General' },
  { code: 'SSG 322', title: 'Control Theory I', units: 2, status: 'C', level: '300L', semester: 'Second Semester', specialization: 'General' },
  { code: 'SSG 324', title: 'Algorithms And Data Structures', units: 2, status: 'C', level: '300L', semester: 'Second Semester', specialization: 'General' },
  { code: 'SSG 326', title: 'Engineering Materials& The Environment', units: 2, status: 'C', level: '300L', semester: 'Second Semester', specialization: 'General' },
  { code: 'SSG 328', title: 'Operations Research II', units: 2, status: 'C', level: '300L', semester: 'Second Semester', specialization: 'General' },
  { code: 'SSG 340', title: 'Technical Computing Laboratory', units: 1, status: 'C', level: '300L', semester: 'Second Semester', specialization: 'General' },
  { code: 'SSG 342', title: 'Control Laboratory I', units: 1, status: 'C', level: '300L', semester: 'Second Semester', specialization: 'General' },
  { code: 'SSG 348', title: 'Industrial Engineering', units: 2, status: 'C', level: '300L', semester: 'Second Semester', specialization: 'General' },

  // ================= 400 LEVEL =================
  // 400L First Semester (From Judah's Transcript)
  { code: 'GEG 411', title: 'Technical Communications', units: 1, status: 'C', level: '400L', semester: 'First Semester', specialization: 'General' },
  { code: 'GEG 412', title: 'Numerical Methods In Engineering', units: 2, status: 'C', level: '400L', semester: 'First Semester', specialization: 'General' },
  { code: 'GEG 413', title: 'Advanced Engineering Statistics', units: 3, status: 'C', level: '400L', semester: 'First Semester', specialization: 'General' },
  { code: 'SSG 418', title: 'Systems Simulation I', units: 2, status: 'C', level: '400L', semester: 'First Semester', specialization: 'General' },
  { code: 'SSG 434', title: 'Embedded Systems Programming', units: 2, status: 'C', level: '400L', semester: 'First Semester', specialization: 'General' },
  { code: 'SSG 437', title: 'Emerging Concepts And Technologies', units: 1, status: 'C', level: '400L', semester: 'First Semester', specialization: 'General' },
  { code: 'SSG 451', title: 'Stochastic Models', units: 2, status: 'C', level: '400L', semester: 'First Semester', specialization: 'General' },
  // 400L First Semester electives (status from curriculum PDF, 6 units required)
  { code: 'SSG 415', title: 'Mechatronics And Robotic Systems', units: 2, status: 'E', level: '400L', semester: 'First Semester', specialization: 'Artificial Intelligence and Mechatronics' },
  { code: 'SSG 431', title: 'Continuum Mechanics II', units: 2, status: 'E', level: '400L', semester: 'First Semester', specialization: 'Engineering Analysis, Mechanics and Control' },
  { code: 'SSG 432', title: 'Statistical Quality Control', units: 2, status: 'E', level: '400L', semester: 'First Semester', specialization: 'Industrial and Management Engineering' },
  { code: 'SSG 433', title: 'Operational Methods II', units: 2, status: 'E', level: '400L', semester: 'First Semester', specialization: 'General' },
  { code: 'SSG 435', title: 'Control Systems Analysis', units: 2, status: 'E', level: '400L', semester: 'First Semester', specialization: 'Engineering Analysis, Mechanics and Control' },
  { code: 'SSG 438', title: 'Bio-Inspired Computing', units: 2, status: 'E', level: '400L', semester: 'First Semester', specialization: 'Artificial Intelligence and Mechatronics' },
  { code: 'SSG 439', title: 'Production Planning and Inventory Control', units: 2, status: 'E', level: '400L', semester: 'First Semester', specialization: 'Industrial and Management Engineering' },

  // 400L Second Semester (From First PDF - SIWES)
  { code: 'SIW 400', title: 'Industrial Training (SIWES)', units: 6, status: 'C', level: '400L', semester: 'Second Semester', specialization: 'General' },

  // ================= 500 LEVEL =================
  // 500L First Semester - Compulsory (From First PDF)
  { code: 'ECN 451', title: 'Engineering Economics', units: 2, status: 'C', level: '500L', semester: 'First Semester', specialization: 'General' },
  { code: 'SSG 511', title: 'Computer Graphics', units: 2, status: 'C', level: '500L', semester: 'First Semester', specialization: 'General' },
  { code: 'SSG 517', title: 'Systems Simulation II', units: 3, status: 'C', level: '500L', semester: 'First Semester', specialization: 'General' },
  { code: 'SSG 530', title: 'Final Year Project I', units: 3, status: 'C', level: '500L', semester: 'First Semester', specialization: 'General' },
  { code: 'SSG 532', title: 'Engineering Design and Prototyping', units: 2, status: 'C', level: '500L', semester: 'First Semester', specialization: 'General' },
  // 500L First Semester - Electives (From First PDF)
  { code: 'SSG 513', title: 'Techniques of Planning and Scheduling', units: 2, status: 'E', level: '500L', semester: 'First Semester', specialization: 'Industrial and Management Engineering' },
  { code: 'SSG 515', title: 'Mechatronics and Robotic Systems II', units: 3, status: 'E', level: '500L', semester: 'First Semester', specialization: 'Artificial Intelligence and Mechatronics' },
  { code: 'SSG 518', title: 'Artificial Intelligence', units: 2, status: 'E', level: '500L', semester: 'First Semester', specialization: 'Artificial Intelligence and Mechatronics' },
  { code: 'SSG 531', title: 'Control Theory II', units: 2, status: 'E', level: '500L', semester: 'First Semester', specialization: 'Engineering Analysis, Mechanics and Control' },
  { code: 'SSG 533', title: 'Computational Methods I', units: 3, status: 'E', level: '500L', semester: 'First Semester', specialization: 'Engineering Analysis, Mechanics and Control' },
  { code: 'SSG 535', title: 'Introduction to Machine Learning', units: 2, status: 'E', level: '500L', semester: 'First Semester', specialization: 'Artificial Intelligence and Mechatronics' },
  { code: 'SSG 537', title: 'Human Factors Engineering and Ergonomics', units: 3, status: 'E', level: '500L', semester: 'First Semester', specialization: 'Industrial and Management Engineering' },

  // 500L Second Semester - Compulsory (From First PDF)
  { code: 'CIL 524', title: 'Introduction to Engineering Contract', units: 1, status: 'C', level: '500L', semester: 'Second Semester', specialization: 'General' },
  { code: 'BUS 430', title: 'Management for Engineers', units: 1, status: 'C', level: '500L', semester: 'Second Semester', specialization: 'General' },
  { code: 'SSG 522', title: 'Systems Analysis and Dynamics', units: 2, status: 'C', level: '500L', semester: 'Second Semester', specialization: 'General' },
  { code: 'SSG 549', title: 'Systems Reliability and Maintainability', units: 2, status: 'C', level: '500L', semester: 'Second Semester', specialization: 'General' },
  { code: 'SSG 560', title: 'Final Year Project II', units: 3, status: 'C', level: '500L', semester: 'Second Semester', specialization: 'General' },
  // 500L Second Semester - Electives (From First PDF)
  { code: 'SSG 521', title: 'Engineering Project Handling', units: 1, status: 'E', level: '500L', semester: 'Second Semester', specialization: 'General' },
  { code: 'SSG 523', title: 'Computational Methods II', units: 3, status: 'E', level: '500L', semester: 'Second Semester', specialization: 'Engineering Analysis, Mechanics and Control' },
  { code: 'SSG 524', title: 'Automated Reasoning', units: 2, status: 'E', level: '500L', semester: 'Second Semester', specialization: 'Artificial Intelligence and Mechatronics' },
  { code: 'SSG 525', title: 'Facility Planning', units: 2, status: 'E', level: '500L', semester: 'Second Semester', specialization: 'Industrial and Management Engineering' },
  { code: 'SSG 526', title: 'Mechanics of Continua', units: 2, status: 'E', level: '500L', semester: 'Second Semester', specialization: 'Engineering Analysis, Mechanics and Control' },
  { code: 'SSG 527', title: 'Control of Robots and Human Arms', units: 2, status: 'E', level: '500L', semester: 'Second Semester', specialization: 'Artificial Intelligence and Mechatronics' },
  { code: 'SSG 528', title: 'Manufacturing Systems Automation', units: 2, status: 'E', level: '500L', semester: 'Second Semester', specialization: 'General' },
  { code: 'SSG 529', title: 'Systems Animation', units: 3, status: 'E', level: '500L', semester: 'Second Semester', specialization: 'Industrial and Management Engineering' },
  { code: 'SSG 542', title: 'Image Processing', units: 3, status: 'E', level: '500L', semester: 'Second Semester', specialization: 'Artificial Intelligence and Mechatronics' },
];

export const getCurriculumCoursesForSemester = (level: string, semester: string) => {
  return CURRICULUM_DATA.filter(
    c => c.level === level && c.semester === semester
  );
};

export const getCompulsoryCoursesForSemester = (level: string, semester: string) => {
  return CURRICULUM_DATA.filter(
    c => c.level === level && c.semester === semester && c.status === 'C'
  );
};

export const getElectiveCoursesForSemester = (level: string, semester: string) => {
  return CURRICULUM_DATA.filter(
    c => c.level === level && c.semester === semester && c.status === 'E'
  );
};
