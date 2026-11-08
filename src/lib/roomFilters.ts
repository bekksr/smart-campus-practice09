import type { Room } from '@/data/rooms';

export interface RoomFilterOptions {
  minCapacity: number;
  requiredEquipment: string[];
}

export function filterRooms(
  rooms: Room[],
  filters: RoomFilterOptions
): Room[] {
  return rooms.filter((room) => {
    const hasCapacity = room.capacity >= filters.minCapacity;

    const hasAllEquipment = filters.requiredEquipment.every(
      (item) => room.equipment.includes(item)
    );
   const isAvailable = !room.blocked;

   return hasCapacity && hasAllEquipment && isAvailable;

  });
}
