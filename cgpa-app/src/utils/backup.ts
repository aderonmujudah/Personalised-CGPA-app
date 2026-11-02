import { Capacitor } from '@capacitor/core';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import type { Course, SemesterRecord, UserProfile } from '../types';
import { DEFAULT_PROFILE } from './storage';

const BACKUP_VERSION = 3;

/**
 * Save a JSON backup. Android's WebView ignores <a download>, so in the APK we
 * write the file to the cache and open the share sheet (Drive, WhatsApp, Files…).
 */
export async function exportBackup(profile: UserProfile, semesters: SemesterRecord[]) {
  const json = JSON.stringify({ version: BACKUP_VERSION, profile, semesters }, null, 2);
  const name = `cgpa-backup-${new Date().toISOString().slice(0, 10)}.json`;

  if (Capacitor.isNativePlatform()) {
    const { uri } = await Filesystem.writeFile({
      path: name,
      data: json,
      directory: Directory.Cache,
      encoding: Encoding.UTF8,
    });
    await Share.share({ title: 'CGPA backup', files: [uri] });
    return;
  }

  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

const isCourse = (c: unknown): c is Course =>
  !!c && typeof c === 'object' && typeof (c as Course).code === 'string' && typeof (c as Course).units === 'number';

const isSemester = (s: unknown): s is SemesterRecord =>
  !!s &&
  typeof s === 'object' &&
  typeof (s as SemesterRecord).id === 'string' &&
  typeof (s as SemesterRecord).session === 'string' &&
  Array.isArray((s as SemesterRecord).courses) &&
  (s as SemesterRecord).courses.every(isCourse);

/** Parse and sanity-check a backup file. Throws if it isn't one. */
export function parseBackup(text: string): { profile: UserProfile; semesters: SemesterRecord[] } {
  const data = JSON.parse(text);
  if (!data || !Array.isArray(data.semesters) || !data.semesters.every(isSemester) || typeof data.profile !== 'object') {
    throw new Error('Not a CGPA backup');
  }
  return { profile: { ...DEFAULT_PROFILE, ...data.profile }, semesters: data.semesters };
}
