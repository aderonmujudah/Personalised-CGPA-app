import { House, Settings, Target } from 'lucide-react';

export type Tab = 'home' | 'plan' | 'settings';

const ITEMS = [
  { id: 'home' as Tab, label: 'Home', Icon: House },
  { id: 'plan' as Tab, label: 'Plan', Icon: Target },
  { id: 'settings' as Tab, label: 'Settings', Icon: Settings },
];

export function TabBar({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  return (
    <nav className="pb-safe px-safe shrink-0 border-t border-line bg-surface">
      <div className="mx-auto grid max-w-md grid-cols-3">
        {ITEMS.map(({ id, label, Icon }) => {
          const on = tab === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              aria-current={on ? 'page' : undefined}
              className={`flex flex-col items-center gap-1 pt-2 pb-1 text-[11px] font-medium transition-colors ${
                on ? 'text-accent' : 'text-ink-3'
              }`}
            >
              <span className={`grid h-7 w-14 place-items-center rounded-full transition-colors ${on ? 'bg-accent-soft' : ''}`}>
                <Icon size={20} strokeWidth={on ? 2.2 : 1.8} />
              </span>
              {label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
