export interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
  blocked: boolean;
  blockedReason?: string;
}

export interface Booking {
  roomId: string;
  start: number;
  end: number;
  title: string;
  bookedBy: string;
}

export const rooms: Room[] = [
  {
    id: 'lib-201',
    name: 'Library Study Room 201',
    building: 'Main Library',
    capacity: 8,
    blocked: false,
  },
  {
    id: 'eng-104',
    name: 'Engineering Lab 104',
    building: 'Block A — Engineering',
    capacity: 30,
    blocked: false,
  },
  {
    id: 'sci-310',
    name: 'Science Seminar Room 310',
    building: 'Block C — Sciences',
    capacity: 20,
    blocked: true,
    blockedReason: 'Maintenance — HVAC repair scheduled all day.',
  },
  {
    id: 'bus-120',
    name: 'Business Hub 120',
    building: 'Block B — Business',
    capacity: 12,
    blocked: false,
  },
];

export const bookings: Booking[] = [
  {
    roomId: 'lib-201',
    start: 9 * 60,
    end: 10 * 60 + 30,
    title: 'Group Project — CS301',
    bookedBy: 'A. Chen',
  },
  {
    roomId: 'lib-201',
    start: 14 * 60,
    end: 15 * 60,
    title: 'Literature Review',
    bookedBy: 'M. Patel',
  },
  {
    roomId: 'lib-201',
    start: 16 * 60 + 30,
    end: 17 * 60 + 30,
    title: 'Thesis Writing',
    bookedBy: 'J. Rivera',
  },
  {
    roomId: 'eng-104',
    start: 10 * 60,
    end: 11 * 60,
    title: 'Robotics Workshop',
    bookedBy: 'Dr. Lee',
  },
  {
    roomId: 'eng-104',
    start: 13 * 60,
    end: 14 * 60 + 30,
    title: 'Circuit Lab Session',
    bookedBy: 'S. Okafor',
  },
  {
    roomId: 'bus-120',
    start: 11 * 60,
    end: 12 * 60,
    title: 'Case Study Discussion',
    bookedBy: 'R. Gomez',
  },
  {
    roomId: 'bus-120',
    start: 15 * 60,
    end: 16 * 60,
    title: 'Networking Mixer Prep',
    bookedBy: 'K. Tanaka',
  },
];
