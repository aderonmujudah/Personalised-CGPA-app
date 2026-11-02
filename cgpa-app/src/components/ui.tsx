import type { ReactNode } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import type { Grade } from '../types';
import { GRADES } from '../utils/cgpaEngine';
import { useBackHandler } from '../hooks/useBackHandler';

/** Shared card look: white panel with a hairline border. */
export const card = 'rounded-2xl border border-line bg-surface';

/** Bottom sheet on phones, centred dialog on wider screens. Back/Escape closes it. */
export function Sheet({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  useBackHandler(open, onClose);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:items-center sm:justify-center sm:p-6">
      <div className="anim-fade absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="anim-sheet px-safe relative flex max-h-[92dvh] w-full flex-col rounded-t-[20px] bg-surface sm:max-h-[85dvh] sm:max-w-[520px] sm:rounded-[20px]"
      >
        <div className="flex justify-center pt-2 sm:hidden">
          <span className="h-1 w-9 rounded-full bg-line" />
        </div>
        {title && (
          <div className="flex items-center justify-between gap-3 py-2 pr-2 pl-5 sm:pt-4">
            <h3 className="text-[17px] font-semibold text-ink">{title}</h3>
            <button
              onClick={onClose}
              aria-label="Close"
              className="grid h-10 w-10 place-items-center rounded-full text-ink-3 active:bg-surface-2"
            >
              <X size={20} strokeWidth={2} />
            </button>
          </div>
        )}
        <div className="scroller px-5 pb-5">{children}</div>
        {footer && <div className="border-t border-line px-5 pt-3 pb-[max(var(--sab),14px)]">{footer}</div>}
      </div>
    </div>
  );
}

/** In-app replacement for window.confirm (which shows "localhost says" inside the APK). */
export function ConfirmSheet({
  open,
  title,
  message,
  confirmLabel,
  danger,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  danger?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <Sheet open={open} onClose={onClose}>
      <div className="pt-3">
        <h3 className="text-[18px] font-semibold text-ink">{title}</h3>
        <p className="mt-1.5 text-[15px] leading-relaxed text-ink-2">{message}</p>
        <div className="mt-5 grid grid-cols-2 gap-2 pb-[max(var(--sab),0px)]">
          <button onClick={onClose} className="h-12 rounded-xl bg-surface-2 text-[15px] font-medium text-ink active:opacity-80">
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`h-12 rounded-xl text-[15px] font-semibold active:opacity-85 ${
              danger ? 'bg-danger text-white' : 'bg-accent text-on-accent'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Sheet>
  );
}

export function Segmented<T extends string | boolean>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div
      role="radiogroup"
      className="grid rounded-[10px] bg-track p-[3px]"
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map(o => {
        const on = o.value === value;
        return (
          <button
            key={String(o.value)}
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.value)}
            className={`h-9 rounded-[8px] text-[14px] font-medium transition-colors ${
              on ? 'bg-seg text-ink shadow-[0_1px_2px_rgba(0,0,0,0.12)]' : 'text-ink-2'
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function GradePicker({ value, onChange }: { value?: Grade; onChange: (g: Grade) => void }) {
  return (
    <div className="grid grid-cols-6 gap-1.5">
      {GRADES.map(g => {
        const on = value === g;
        return (
          <button
            key={g}
            onClick={() => onChange(g)}
            aria-pressed={on}
            aria-label={`Grade ${g}`}
            className={`h-10 rounded-lg text-[14px] font-semibold transition-colors ${
              on
                ? g === 'F'
                  ? 'bg-danger text-white'
                  : 'bg-accent text-on-accent'
                : 'border border-line text-ink-2 active:bg-surface-2'
            }`}
          >
            {g}
          </button>
        );
      })}
    </div>
  );
}

export function Stepper({
  value,
  onChange,
  min,
  max,
  step = 1,
  format = (n: number) => String(n),
}: {
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
  step?: number;
  format?: (n: number) => string;
}) {
  const clamp = (n: number) => Math.min(max, Math.max(min, Math.round(n * 100) / 100));
  const btn =
    'grid h-10 w-10 place-items-center rounded-full border border-line text-ink-2 active:bg-surface-2 disabled:opacity-35';
  return (
    <div className="flex shrink-0 items-center gap-2">
      <button className={btn} onClick={() => onChange(clamp(value - step))} disabled={value <= min} aria-label="Decrease">
        <Minus size={16} strokeWidth={2} />
      </button>
      <span className="min-w-[3.2ch] text-center text-[17px] font-semibold text-ink tabular-nums">{format(value)}</span>
      <button className={btn} onClick={() => onChange(clamp(value + step))} disabled={value >= max} aria-label="Increase">
        <Plus size={16} strokeWidth={2} />
      </button>
    </div>
  );
}

export function GroupLabel({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 px-1 pb-2">
      <p className="text-[13px] font-medium text-ink-3">{children}</p>
      {right}
    </div>
  );
}

export function Bar({ value, className = '' }: { value: number; className?: string }) {
  return (
    <div className={`h-1.5 overflow-hidden rounded-full bg-track ${className}`}>
      <div
        className="h-full rounded-full bg-accent transition-[width] duration-500"
        style={{ width: `${Math.max(0, Math.min(100, value * 100))}%` }}
      />
    </div>
  );
}

/** Large page title used at the top of each tab. */
export function PageHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: ReactNode }) {
  return (
    <header className="pt-safe flex items-end justify-between gap-3 px-5 pb-4">
      <div className="min-w-0">
        {subtitle && <p className="truncate text-[13px] text-ink-3">{subtitle}</p>}
        <h1 className="truncate text-[26px] leading-tight font-semibold tracking-[-0.02em] text-ink">{title}</h1>
      </div>
      {right}
    </header>
  );
}
