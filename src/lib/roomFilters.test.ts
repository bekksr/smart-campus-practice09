import { describe, it, expect } from 'vitest';
import { filterRooms } from './roomFilters';
import { rooms } from '@/data/rooms';

describe('filterRooms', () => {
  it('includes rooms with capacity equal to the requested capacity', () => {
    const result = filterRooms(rooms, {
      minCapacity: 8,
      requiredEquipment: [],
    });

    expect(result.some((room) => room.id === 'lib-201')).toBe(true);
  });

  it('excludes rooms with insufficient capacity', () => {
    const result = filterRooms(rooms, {
      minCapacity: 9,
      requiredEquipment: [],
    });

    expect(result.some((room) => room.id === 'lib-201')).toBe(false);
  });

  it('includes a room that has all required equipment', () => {
    const result = filterRooms(rooms, {
      minCapacity: 8,
      requiredEquipment: ['Projector', 'Wi-Fi'],
    });

    expect(result.some((room) => room.id === 'lib-201')).toBe(true);
  });

  it('excludes a room if one required equipment item is missing', () => {
    const result = filterRooms(rooms, {
      minCapacity: 8,
      requiredEquipment: ['Projector', 'Microscope'],
    });

    expect(result.some((room) => room.id === 'lib-201')).toBe(false);
  });

  it('returns an empty array when no room matches', () => {
    const result = filterRooms(rooms, {
      minCapacity: 100,
      requiredEquipment: ['Microscope', 'TV'],
    });

    expect(result).toEqual([]);
  });
it('excludes blocked rooms', () => {
  const result = filterRooms(rooms, {
    minCapacity: 1,
    requiredEquipment: [],
  });

  expect(result.some((room) => room.id === 'sci-310')).toBe(false);
});

  it('does not mutate the original rooms array', () => {
    const originalRooms = structuredClone(rooms);

    filterRooms(rooms, {
      minCapacity: 10,
      requiredEquipment: ['Wi-Fi'],
    });

    expect(rooms).toEqual(originalRooms);
  });
});
