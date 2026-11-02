import { useEffect, useState } from 'react';
import { Capacitor, SystemBars, SystemBarsStyle } from '@capacitor/core';

export type ThemePref = 'system' | 'light' | 'dark';

const KEY = 'cgpa.theme';
const BG = { light: '#f3f3f1', dark: '#0f1012' };

const readPref = (): ThemePref => {
  const v = localStorage.getItem(KEY);
  return v === 'light' || v === 'dark' ? v : 'system';
};

export function useTheme() {
  const [pref, setPref] = useState<ThemePref>(readPref);
  const [systemDark, setSystemDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const isDark = pref === 'dark' || (pref === 'system' && systemDark);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', isDark ? BG.dark : BG.light);
    if (Capacitor.isNativePlatform()) {
      // Status bar icons: light icons on the dark theme, dark icons on the light one.
      SystemBars.setStyle({ style: isDark ? SystemBarsStyle.Dark : SystemBarsStyle.Light }).catch(() => {});
    }
  }, [isDark]);

  useEffect(() => localStorage.setItem(KEY, pref), [pref]);

  return { pref, setPref, isDark };
}
