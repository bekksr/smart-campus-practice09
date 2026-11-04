import { MINUTES_PER_DAY, minutesToTime } from './time';
import { Booking, Room } from '@/data/rooms';

export type CheckOutcome =
  | { status: 'available'; start: number; end: number; message: string }
  | { status: 'unavailable'; reason: string; detail?: string };

export interface CheckRequest {
  start: number;
  end: number;
  currentTime: number;
  room: Room;
  existingBookings: Booking[];
}

export function checkAvailability(req: CheckRequest): CheckOutcome {
  const { start, end, currentTime, room, existingBookings } = req;

  // AC1: valid interval — 0 ≤ start < end ≤ 1440 and start after current time
  if (start < 0 || start >= MINUTES_PER_DAY || end < 0 || end > MINUTES_PER_DAY) {
    return unavailable('Times must be between 00:00 and 24:00.');
  }
  if (start >= end) {
    return unavailable('Start time must be earlier than end time.');
  }
  if (start <= currentTime) {
    return unavailable(
      'Start time must be later than the current time.',
      `Current time is ${minutesToTime(currentTime)}; your start is ${minutesToTime(
        start
      )}.`
    );
  }

  // AC2: reject bookings longer than 120 minutes
  const duration = end - start;
  if (duration > 120) {
    return unavailable(
      'Requested duration exceeds the 2-hour maximum.',
      `Your request is ${duration} minutes long.`
    );
  }

  // AC3: reject when the room is blocked
  if (room.blocked) {
    return unavailable(
      'This room is currently blocked.',
      room.blockedReason
    );
  }

  // AC4: reject overlapping intervals (touching endpoints allowed)
  const conflict = existingBookings.find(
    (b) => start < b.end && b.start < end
  );
  if (conflict) {
    return unavailable(
      'The requested interval overlaps an existing booking.',
      `${conflict.title} (${minutesToTime(conflict.start)}–${minutesToTime(
        conflict.end
      )}) conflicts with your request.`
    );
  }

  // AC5: available — no data is mutated
  return {
    status: 'available',
    start,
    end,
    message: `Room is available from ${minutesToTime(start)} to ${minutesToTime(
      end
    )} (${duration} min).`,
  };
}

function unavailable(reason: string, detail?: string): CheckOutcome {
  return { status: 'unavailable', reason, detail };
}
