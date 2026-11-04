import { CheckCircle2, XCircle, Clock4 } from 'lucide-react';
import type { CheckOutcome } from '@/lib/availability';
import { formatRange, formatDuration } from '@/lib/time';

interface ResultBannerProps {
  outcome: CheckOutcome | null;
}

export function ResultBanner({ outcome }: ResultBannerProps) {
  if (!outcome) return null;

  const available = outcome.status === 'available';

  return (
    <div
      role="status"
      aria-live="polite"
      className={`mt-6 flex flex-col gap-3 rounded-2xl border p-5 transition-all duration-300 sm:flex-row sm:items-start ${
        available
          ? 'border-emerald-200 bg-emerald-50/80'
          : 'border-rose-200 bg-rose-50/80'
      }`}
    >
      <div
        className={`flex h-11 w-11 flex-none items-center justify-center rounded-full ${
          available ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
        }`}
      >
        {available ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
      </div>
      <div className="flex-1">
        <p
          className={`text-lg font-semibold tracking-tight ${
            available ? 'text-emerald-900' : 'text-rose-900'
          }`}
        >
          {available ? 'Available' : 'Unavailable'}
        </p>
        <p
          className={`mt-1 text-sm leading-relaxed ${
            available ? 'text-emerald-800' : 'text-rose-800'
          }`}
        >
          {available
            ? (outcome as Extract<CheckOutcome, { status: 'available' }>).message
            : outcome.reason}
        </p>
        {outcome.status === 'unavailable' && outcome.detail && (
          <p className="mt-1 text-sm leading-relaxed text-rose-700/90">
            {outcome.detail}
          </p>
        )}
        {available && (
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-emerald-800">
            <span className="inline-flex items-center gap-1.5">
              <Clock4 size={15} />
              {formatRange(outcome.start, outcome.end)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              {formatDuration(outcome.end - outcome.start)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
