import { useEffect, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';

/**
 * A single stack of "things back should close": open sheets, the semester
 * screen, a non-home tab. Android's hardware back, the browser back button and
 * Escape all pop the top entry. When the stack is empty, back exits the app.
 */
type Entry = { id: number; run: () => void };

const stack: Entry[] = [];
let nextId = 1;
const native = Capacitor.isNativePlatform();

// On the web we keep exactly one extra history entry while anything is open,
// so the browser back button lands on us instead of leaving the page.
let trapped = false;
const syncTrap = () => {
  if (native) return;
  if (stack.length && !trapped) {
    history.pushState({ cgpaTrap: true }, '');
    trapped = true;
  }
};

const popTop = () => {
  const top = stack[stack.length - 1];
  if (!top) return false;
  top.run();
  return true;
};

if (native) {
  App.addListener('backButton', () => {
    if (!popTop()) App.exitApp();
  });
} else {
  window.addEventListener('popstate', () => {
    trapped = false;
    popTop();
    // Handlers update React state; re-arm after they've had a chance to unregister.
    setTimeout(syncTrap, 0);
  });
}

window.addEventListener('keydown', e => {
  if (e.key === 'Escape' && stack.length) {
    e.preventDefault();
    popTop();
  }
});

/** While `active`, pressing back calls `onBack` (typically: close this layer). */
export function useBackHandler(active: boolean, onBack: () => void) {
  const ref = useRef(onBack);
  ref.current = onBack;

  useEffect(() => {
    if (!active) return;
    const entry: Entry = { id: nextId++, run: () => ref.current() };
    stack.push(entry);
    syncTrap();
    return () => {
      const i = stack.findIndex(e => e.id === entry.id);
      if (i !== -1) stack.splice(i, 1);
    };
  }, [active]);
}
