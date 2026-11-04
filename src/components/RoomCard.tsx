import { MapPin, Users, Ban } from 'lucide-react';
import type { Room } from '@/data/rooms';

interface RoomCardProps {
  room: Room;
  selected: boolean;
  onSelect: () => void;
}

export function RoomCard({ room, selected, onSelect }: RoomCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      disabled={room.blocked}
      className={`group flex w-full flex-col gap-2 rounded-2xl border p-4 text-left transition-all duration-200 ${
        room.blocked
          ? 'cursor-not-allowed border-slate-200 bg-slate-50 opacity-70'
          : selected
            ? 'border-sky-400 bg-sky-50 shadow-sm ring-1 ring-sky-200'
            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col">
          <span
            className={`text-sm font-semibold tracking-tight ${
              room.blocked ? 'text-slate-400' : 'text-slate-800'
            }`}
          >
            {room.name}
          </span>
          <span className="mt-0.5 inline-flex items-center gap-1 text-xs text-slate-500">
            <MapPin size={12} /> {room.building}
          </span>
        </div>
        {room.blocked ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-semibold text-rose-700">
            <Ban size={11} /> Blocked
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
            <Users size={11} /> {room.capacity}
          </span>
        )}
      </div>
      {room.blocked && room.blockedReason && (
        <p className="text-xs leading-relaxed text-slate-400">
          {room.blockedReason}
        </p>
      )}
    </button>
  );
}
