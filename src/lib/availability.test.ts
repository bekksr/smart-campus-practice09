import { describe, it, expect } from 'vitest';
import { checkAvailability, CheckRequest } from '@/lib/availability';
import { Room, Booking } from '@/data/rooms';

// ---------------------------------------------------------------------------
// Isolated test fixtures
// ---------------------------------------------------------------------------

const openRoom: Room = {
  id: 'test-101',
  name: 'Test Room 101',
  building: 'Test Building',
  capacity: 10,
  equipment: ['Whiteboard', 'Wi-Fi'],
  blocked: false,
};

const blockedRoom: Room = {
  id: 'test-102',
  name: 'Test Room 102',
  building: 'Test Building',
  capacity: 10,
  equipment: ['Projector', 'Wi-Fi'],
  blocked: true,
  blockedReason: 'Maintenance — plumbing repair.',
};

const baseBooking: Booking = {
  roomId: 'test-101',
  start: 10 * 60,   // 10:00
  end: 11 * 60,     // 11:00
  title: 'Standing Meeting',
  bookedBy: 'T. Tester',
};

/** A valid request that does not overlap baseBooking: 09:00–09:30, currentTime 08:00. */
const validRequest: CheckRequest = {
  start: 9 * 60,
  end: 9 * 60 + 30,
  currentTime: 8 * 60,
  room: openRoom,
  existingBookings: [],
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('checkAvailability', () => {
  // --- AC1: valid interval ---

  it('returns available for a valid, non-overlapping interval', () => {
    const result = checkAvailability(validRequest);
    expect(result.status).toBe('available');
    if (result.status === 'available') {
      expect(result.start).toBe(540);
      expect(result.end).toBe(570);
      expect(result.message).toContain('09:00');
      expect(result.message).toContain('09:30');
    }
  });

  it('rejects a negative start time', () => {
    const result = checkAvailability({
      ...validRequest,
      start: -1,
      end: 600,
    });
    expect(result.status).toBe('unavailable');
    if (result.status === 'unavailable') {
      expect(result.reason).toBe('Times must be between 00:00 and 24:00.');
    }
  });

  it('rejects start at 1440 (boundary)', () => {
    const result = checkAvailability({
      ...validRequest,
      start: 1440,
      end: 1450,
    });
    expect(result.status).toBe('unavailable');
    if (result.status === 'unavailable') {
      expect(result.reason).toBe('Times must be between 00:00 and 24:00.');
    }
  });

  it('rejects end beyond 1440', () => {
    const result = checkAvailability({
      ...validRequest,
      start: 1430,
      end: 1441,
    });
    expect(result.status).toBe('unavailable');
    if (result.status === 'unavailable') {
      expect(result.reason).toBe('Times must be between 00:00 and 24:00.');
    }
  });

  it('rejects start equal to end', () => {
    const result = checkAvailability({
      ...validRequest,
      start: 600,
      end: 600,
    });
    expect(result.status).toBe('unavailable');
    if (result.status === 'unavailable') {
      expect(result.reason).toBe('Start time must be earlier than end time.');
    }
  });

  it('rejects start greater than end', () => {
    const result = checkAvailability({
      ...validRequest,
      start: 660,
      end: 600,
    });
    expect(result.status).toBe('unavailable');
    if (result.status === 'unavailable') {
      expect(result.reason).toBe('Start time must be earlier than end time.');
    }
  });

  it('rejects a start equal to currentTime', () => {
    const result = checkAvailability({
      ...validRequest,
      start: 480,
      end: 540,
      currentTime: 480,
    });
    expect(result.status).toBe('unavailable');
    if (result.status === 'unavailable') {
      expect(result.reason).toBe('Start time must be later than the current time.');
    }
  });

  it('rejects a start before currentTime', () => {
    const result = checkAvailability({
      ...validRequest,
      start: 420,
      end: 540,
      currentTime: 480,
    });
    expect(result.status).toBe('unavailable');
    if (result.status === 'unavailable') {
      expect(result.reason).toBe('Start time must be later than the current time.');
    }
  });

  // --- AC2: duration limits ---

  it('allows exactly 120 minutes', () => {
    const result = checkAvailability({
      ...validRequest,
      start: 9 * 60,
      end: 11 * 60,
      currentTime: 8 * 60,
      existingBookings: [],
    });
    expect(result.status).toBe('available');
  });

  it('rejects more than 120 minutes', () => {
    const result = checkAvailability({
      ...validRequest,
      start: 9 * 60,
      end: 11 * 60 + 1,
      currentTime: 8 * 60,
      existingBookings: [],
    });
    expect(result.status).toBe('unavailable');
    if (result.status === 'unavailable') {
      expect(result.reason).toBe('Requested duration exceeds the 2-hour maximum.');
    }
  });

  // --- AC3: blocked room ---

  it('rejects a blocked room', () => {
    const result = checkAvailability({
      ...validRequest,
      room: blockedRoom,
    });
    expect(result.status).toBe('unavailable');
    if (result.status === 'unavailable') {
      expect(result.reason).toBe('This room is currently blocked.');
      expect(result.detail).toBe('Maintenance — plumbing repair.');
    }
  });

  // --- AC4: overlap detection ---

  it('rejects an exact booking overlap', () => {
    const result = checkAvailability({
      ...validRequest,
      start: 10 * 60,
      end: 11 * 60,
      currentTime: 8 * 60,
      existingBookings: [baseBooking],
    });
    expect(result.status).toBe('unavailable');
    if (result.status === 'unavailable') {
      expect(result.reason).toBe('The requested interval overlaps an existing booking.');
    }
  });

  it('rejects a partial overlap (request starts inside existing booking)', () => {
    const result = checkAvailability({
      ...validRequest,
      start: 10 * 60 + 30,
      end: 11 * 60 + 30,
      currentTime: 8 * 60,
      existingBookings: [baseBooking],
    });
    expect(result.status).toBe('unavailable');
    if (result.status === 'unavailable') {
      expect(result.reason).toBe('The requested interval overlaps an existing booking.');
    }
  });

  it('allows a request starting exactly when an existing booking ends (touching start)', () => {
    const result = checkAvailability({
      ...validRequest,
      start: 11 * 60,
      end: 12 * 60,
      currentTime: 8 * 60,
      existingBookings: [baseBooking],
    });
    expect(result.status).toBe('available');
  });

  it('allows a request ending exactly when an existing booking starts (touching end)', () => {
    const result = checkAvailability({
      ...validRequest,
      start: 9 * 60,
      end: 10 * 60,
      currentTime: 8 * 60,
      existingBookings: [baseBooking],
    });
    expect(result.status).toBe('available');
  });

  // --- AC5: no mutation ---

  it('does not mutate existing booking data after a check', () => {
    const bookingsCopy: Booking[] = [
      { ...baseBooking },
    ];
    const snapshot = JSON.parse(JSON.stringify(bookingsCopy));

    checkAvailability({
      start: 11 * 60,
      end: 12 * 60,
      currentTime: 8 * 60,
      room: openRoom,
      existingBookings: bookingsCopy,
    });

    expect(bookingsCopy).toEqual(snapshot);
    expect(bookingsCopy.length).toBe(1);
    expect(bookingsCopy[0].start).toBe(baseBooking.start);
    expect(bookingsCopy[0].end).toBe(baseBooking.end);
    expect(bookingsCopy[0].title).toBe(baseBooking.title);
  });

  // --- Additional v2 tests from the quality review ---

  it('rejects an end time below zero', () => {
    const result = checkAvailability({
      ...validRequest,
      start: 60,
      end: -1,
      currentTime: 0,
    });
    expect(result.status).toBe('unavailable');
    if (result.status === 'unavailable') {
      expect(result.reason).toBe('Times must be between 00:00 and 24:00.');
    }
  });

  it('allows an interval ending exactly at 24:00', () => {
    const result = checkAvailability({
      ...validRequest,
      start: 1439,
      end: 1440,
      currentTime: 1380,
      existingBookings: [],
    });
    expect(result.status).toBe('available');
    if (result.status === 'available') {
      expect(result.start).toBe(1439);
      expect(result.end).toBe(1440);
    }
  });

  it('rejects a request that fully contains an existing booking', () => {
    const result = checkAvailability({
      ...validRequest,
      start: 9 * 60 + 30,
      end: 11 * 60 + 30,
      currentTime: 8 * 60,
      existingBookings: [baseBooking],
    });
    expect(result.status).toBe('unavailable');
    if (result.status === 'unavailable') {
      expect(result.reason).toBe('The requested interval overlaps an existing booking.');
    }
  });

  it('rejects a request fully contained within an existing booking', () => {
    const result = checkAvailability({
      ...validRequest,
      start: 10 * 60 + 15,
      end: 10 * 60 + 45,
      currentTime: 8 * 60,
      existingBookings: [baseBooking],
    });
    expect(result.status).toBe('unavailable');
    if (result.status === 'unavailable') {
      expect(result.reason).toBe('The requested interval overlaps an existing booking.');
    }
  });

});
