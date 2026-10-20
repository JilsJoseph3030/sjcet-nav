import { groundFloor } from './groundFloor';
import { firstFloor } from './firstFloor';
import { secondFloor } from './secondFloor';
import { thirdFloor } from './thirdFloor';
import { fourthFloor } from './fourthFloor';

/**
 * St. Francis Block — Central Registry
 * 
 * Aggregates all floor data into an easy-to-use registry.
 * To edit rooms, simply open the respective floor file (e.g. groundFloor.js).
 */
export const francisBlock = {
  blockId: 'francis',
  blockName: 'St. Francis Block',
  floors: {
    ground: groundFloor,
    first: firstFloor,
    second: secondFloor,
    third: thirdFloor,
    fourth: fourthFloor
  }
};

export const FLOOR_LIST = ['ground', 'first', 'second', 'third', 'fourth'];

export const FLOOR_LABELS = {
  ground: 'Ground Floor (0F)',
  first: '1st Floor (1F)',
  second: '2nd Floor (2F)',
  third: '3rd Floor (3F)',
  fourth: '4th Floor (4F)'
};

/**
 * Returns a flat list of all rooms across all floors
 */
export const allRooms = Object.values(francisBlock.floors).flatMap(floor => 
  floor.rooms.map(room => ({
    ...room,
    floor: floor.id,
    floorLabel: floor.label,
    block: floor.block
  }))
);

/**
 * Get room context by ID and floor
 */
export function findRoom(roomId, floorId) {
  if (!roomId) return null;
  
  // If floor is specified, look directly on that floor
  if (floorId && francisBlock.floors[floorId]) {
    const found = francisBlock.floors[floorId].rooms.find(r => r.id === roomId || roomId.startsWith(r.id) || r.id.startsWith(roomId));
    if (found) {
      return {
        ...found,
        floor: floorId,
        floorLabel: francisBlock.floors[floorId].label,
        block: francisBlock.blockName
      };
    }
  }

  // Otherwise search across all floors
  const match = allRooms.find(r => r.id === roomId || roomId.startsWith(r.id) || r.id.startsWith(roomId));
  return match || null;
}

export { groundFloor, firstFloor, secondFloor, thirdFloor, fourthFloor };
