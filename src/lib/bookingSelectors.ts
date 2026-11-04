
import { Booking } from '@/data/rooms';

/**
 * Returns bookings for a specific room, sorted by start time.
 * The original bookings array is never modified.
 */
export function getBookingsForRoom(
  bookings: Booking[],
  roomId: string
): Booking[] {
  return bookings
    .filter((booking) => booking.roomId === roomId)
    .sort((a, b) => a.start - b.start);
}
