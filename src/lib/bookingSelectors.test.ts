
import { describe, it, expect } from 'vitest';
import { getBookingsForRoom } from './bookingSelectors';
import { bookings } from '@/data/rooms';

describe('getBookingsForRoom', () => {
  it('returns only bookings for the selected room', () => {
    const result = getBookingsForRoom(bookings, 'A101');

    expect(result.every((booking) => booking.roomId === 'A101')).toBe(true);
    expect(result.length).toBe(
      bookings.filter((booking) => booking.roomId === 'A101').length
    );
  });

  it('sorts bookings by start time', () => {
    const result = getBookingsForRoom(bookings, 'A101');

    expect(result).toEqual(
      [...result].sort((a, b) => a.start - b.start)
    );
  });

  it('returns an empty array for an unknown room', () => {
    expect(getBookingsForRoom(bookings, 'UNKNOWN')).toEqual([]);
  });

  it('does not mutate the original bookings array', () => {
    const originalBookings = structuredClone(bookings);

    getBookingsForRoom(bookings, 'A101');

    expect(bookings).toEqual(originalBookings);
  });
});
