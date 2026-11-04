import { CalendarClock, User, Clock } from 'lucide-react';
import type { Booking } from '@/data/rooms';
import { formatRange, formatDuration } from '@/lib/time';

interface ScheduleListProps {
  bookings: Booking[];
  emptyLabel?: string;
}

export function ScheduleList({ bookings, emptyLabel }: ScheduleListProps) {
  if (bookings.length === 0) {
    return (
      <p className="px-1 py-2 text-sm text-slate-500">
        {emptyLabel ?? 'No existing bookings for this room.'}
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {bookings.map((b, i) => (
        <li
          key={`${b.roomId}-${b.start}-${i}`}
          className="flex flex-col gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-800">
              {b.title}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-slate-500">
              <User size={12} /> {b.bookedBy}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <CalendarClock size={13} /> {formatRange(b.start, b.end)}
            </span>
            <span className="inline-flex items-center gap-1 text-slate-400">
              <Clock size={12} /> {formatDuration(b.end - b.start)}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
