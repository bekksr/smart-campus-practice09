import { getBookingsForRoom } from './lib/bookingSelectors';
import { filterRooms } from './lib/roomFilters';
import { useEffect, useMemo, useState } from 'react';
import {
  CalendarSearch,
  Clock4,
  DoorClosed,
  Info,
  RotateCcw,
} from 'lucide-react';
import { rooms, bookings, Room } from '@/data/rooms';
import { checkAvailability, CheckOutcome } from '@/lib/availability';
import {
  defaultRequestInterval,
  formatDuration,
  formatRange,
  minutesToTime,
  nowAsTimeString,
  timeToMinutes,
} from '@/lib/time';
import { RoomCard } from '@/components/RoomCard';
import { ScheduleList } from '@/components/ScheduleList';
import { ResultBanner } from '@/components/ResultBanner';

function App() {
  const [selectedRoomId, setSelectedRoomId] = useState<string>(rooms[0].id);
  const [currentTimeStr, setCurrentTimeStr] = useState<string>(nowAsTimeString());
  const initialInterval = defaultRequestInterval(
    timeToMinutes(nowAsTimeString()) ?? 0
  );
  const [startTimeStr, setStartTimeStr] = useState<string>(
    minutesToTime(initialInterval.start)
  );
  const [endTimeStr, setEndTimeStr] = useState<string>(
    minutesToTime(initialInterval.end)
  );
  const [outcome, setOutcome] = useState<CheckOutcome | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [minCapacity, setMinCapacity] = useState<number>(0);

  const [requiredEquipment, setRequiredEquipment] = useState<string[]>([]);

  const selectedRoom: Room = useMemo(
    () => rooms.find((r) => r.id === selectedRoomId) ?? rooms[0],
    [selectedRoomId]
  );

  const roomBookings = useMemo(
    () => getBookingsForRoom(bookings, selectedRoomId),
    [selectedRoomId]
  );
const filteredRooms = useMemo(
  () =>
    filterRooms(rooms, {
      minCapacity,
      requiredEquipment,
    }),
  [minCapacity, requiredEquipment]
);
useEffect(() => {
  if (filteredRooms.length === 0) return;

  const selectedRoomExists = filteredRooms.some(
    (room) => room.id === selectedRoomId
  );

  if (!selectedRoomExists) {
    setSelectedRoomId(filteredRooms[0].id);
    setOutcome(null);
    setSubmitted(false);
  }
}, [filteredRooms, selectedRoomId]);

  const candidateDuration = useMemo(() => {
    const s = timeToMinutes(startTimeStr);
    const e = timeToMinutes(endTimeStr);
    if (s === null || e === null || e <= s) return 0;
    return e - s;
  }, [startTimeStr, endTimeStr]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const start = timeToMinutes(startTimeStr);
    const end = timeToMinutes(endTimeStr);
    const currentTime = timeToMinutes(currentTimeStr);

    if (start === null || end === null || currentTime === null) {
      setOutcome({
        status: 'unavailable',
        reason: 'Please enter valid times in 24-hour HH:MM format.',
      });
      setSubmitted(true);
      return;
    }

    const result = checkAvailability({
      start,
      end,
      currentTime,
      room: selectedRoom,
      existingBookings: roomBookings,
    });
    setOutcome(result);
    setSubmitted(true);
  };

  const handleReset = () => {
    const ct = timeToMinutes(currentTimeStr) ?? 0;
    const interval = defaultRequestInterval(ct);
    setStartTimeStr(minutesToTime(interval.start));
    setEndTimeStr(minutesToTime(interval.end));
    setOutcome(null);
    setSubmitted(false);
  };

  const durationOverLimit = candidateDuration > 120;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-col gap-1 px-4 py-5 sm:px-6 sm:py-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-600 text-white">
              <CalendarSearch size={20} />
            </span>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
              Smart Campus Room Availability
            </h1>
          </div>
          <p className="text-sm text-slate-500">
            Check whether a campus room is free for your requested time. No
            booking is saved — this tool only checks availability.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left: Room picker + schedule */}
          <section className="lg:col-span-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="mb-3 flex items-center gap-2">
                <DoorClosed size={18} className="text-slate-400" />
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Select a room
                </h2>
              </div>
              <div className="mb-4 space-y-3">
  <label className="block">
    <span className="mb-1 block text-sm font-medium text-slate-700">
      Minimum capacity
    </span>

    <input
      type="number"
      min="0"
      value={minCapacity}
      onChange={(e) => setMinCapacity(Number(e.target.value))}
      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
    />
  </label>

  <div>
    <p className="mb-2 text-sm font-medium text-slate-700">
      Required equipment
    </p>

    {['Projector', 'Wi-Fi', 'Computers', 'Whiteboard', 'TV', 'Microscope'].map(
      (item) => (
        <label key={item} className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={requiredEquipment.includes(item)}
            onChange={(e) => {
              setRequiredEquipment((current) =>
                e.target.checked
                  ? [...current, item]
                  : current.filter((equipment) => equipment !== item)
              );
            }}
          />
          {item}
        </label>
      )
    )}
  </div>

  <p className="text-xs text-slate-500">
    Showing {filteredRooms.length} of {rooms.length} rooms
  </p>
</div>
              <div className="grid grid-cols-1 gap-2.5">
                {filteredRooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    selected={room.id === selectedRoomId}
                    onSelect={() => {
                      setSelectedRoomId(room.id);
                      setOutcome(null);
                      setSubmitted(false);
                    }}
                  />
                ))}
              </div>

              <div className="mt-6">
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Today&apos;s bookings
                </h3>
                <ScheduleList
                  bookings={roomBookings}
                  emptyLabel="No existing bookings — the room is fully open."
                />
              </div>
            </div>
          </section>

          {/* Right: Availability form */}
          <section className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
            >
              <div className="mb-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Clock4 size={18} className="text-slate-400" />
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Check a time interval
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                >
                  <RotateCcw size={13} /> Reset
                </button>
              </div>

              {/* Current time */}
              <label className="mb-4 block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">
                  Current time
                </span>
                <input
                  type="time"
                  value={currentTimeStr}
                  onChange={(e) => {
                    setCurrentTimeStr(e.target.value);
                    setOutcome(null);
                    setSubmitted(false);
                  }}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                />
                <span className="mt-1 block text-xs text-slate-400">
                  The start of your request must be after this time.
                </span>
              </label>

              {/* Start + End */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">
                    Requested start
                  </span>
                  <input
                    type="time"
                    value={startTimeStr}
                    onChange={(e) => {
                      setStartTimeStr(e.target.value);
                      setOutcome(null);
                      setSubmitted(false);
                    }}
                    placeholder="HH:MM"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">
                    Requested end
                  </span>
                  <input
                    type="time"
                    value={endTimeStr}
                    onChange={(e) => {
                      setEndTimeStr(e.target.value);
                      setOutcome(null);
                      setSubmitted(false);
                    }}
                    placeholder="HH:MM"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                  />
                </label>
              </div>

              {/* Duration hint */}
              {candidateDuration > 0 && (
                <div
                  className={`mt-3 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${
                    durationOverLimit
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-sky-50 text-sky-700'
                  }`}
                >
                  <Info size={13} />
                  Requested duration: {formatDuration(candidateDuration)}
                  {durationOverLimit && ' — exceeds the 2-hour maximum.'}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-sky-700 active:scale-[0.99] sm:w-auto sm:px-6"
              >
                <CalendarSearch size={17} /> Check availability
              </button>

              {/* Result */}
              {submitted && <ResultBanner outcome={outcome} />}

              {/* Decision summary for available */}
              {submitted && outcome?.status === 'available' && (
                <p className="mt-3 text-xs text-slate-400">
                  No booking data was modified — this is a read-only
                  availability check for {selectedRoom.name} (
                  {formatRange(outcome.start, outcome.end)}).
                </p>
              )}
            </form>

            {/* Rules card */}
            <div className="mt-5 rounded-2xl border border-slate-200 bg-white/60 p-5">
              <h3 className="mb-2 text-sm font-semibold text-slate-600">
                How availability is decided
              </h3>
              <ul className="grid grid-cols-1 gap-1.5 text-xs leading-relaxed text-slate-500 sm:grid-cols-2">
                <li>Start must be later than the current time.</li>
                <li>Interval must fit within 00:00–24:00.</li>
                <li>Bookings cannot exceed 120 minutes.</li>
                <li>Blocked rooms are always unavailable.</li>
                <li>
                  Overlapping requests are rejected — touching times are fine
                  (e.g. 11:00 after a 10:00–11:00 booking).
                </li>
                <li>Existing bookings are never changed by a check.</li>
              </ul>
            </div>
          </section>
        </div>
      </main>

      <footer className="mx-auto max-w-5xl px-4 pb-8 sm:px-6">
        <p className="text-center text-xs text-slate-400">
          Prototype — uses fictional sample data. Current time defaults to{' '}
          {minutesToTime(timeToMinutes(currentTimeStr) ?? 0)} (
          {nowAsTimeString()} on load).
        </p>
      </footer>
    </div>
  );
}

export default App;
