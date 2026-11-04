
import { describe, it, expect } from 'vitest';
import { getBookingsForRoom } from './bookingSelectors';
import { bookings } from '@/data/rooms';

describe('getBookingsForRoom', () => {
  it('returns only bookings for the selected room', () => {
    const result = getBookingsForRoom(bookings, 'lib-201');
    expect(result.length).toBeGreaterThan(0);

    expect(result.every((booking) => booking.roomId === 'lib-201')).toBe(true);
    expect(result.length).toBe(
      bookings.filter((booking) => booking.roomId === 'lib-201').length
    );
  });

  it('sorts bookings by start time', () => {
    const result = getBookingsForRoom(bookings, 'lib-201');


    expect(result).toEqual(
      [...result].sort((a, b) => a.start - b.start)
    );
  });

  it('returns an empty array for an unknown room', () => {
    expect(getBookingsForRoom(bookings, 'UNKNOWN')).toEqual([]);
  });

  it('does not mutate the original bookings array', () => {
    const originalBookings = structuredClone(bookings);

    getBookingsForRoom(bookings, 'lib-201');

    expect(bookings).toEqual(originalBookings);
  });
});
