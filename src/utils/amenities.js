/**
 * SJCET Amenities & Location Categories Helper
 * Uses the human-readable modular floor files in src/data/francis_block/
 */
import { francisBlock, allRooms, findRoom, FLOOR_LABELS } from '../data/francis_block';

export { francisBlock, allRooms, findRoom, FLOOR_LABELS };

export const CATEGORIES = [
  { id: 'all', label: 'All Places' },
  { id: 'restroom', label: 'Restrooms' },
  { id: 'canteen', label: 'Food & Dining' },
  { id: 'library', label: 'Libraries' },
  { id: 'classroom', label: 'Classrooms & Labs' },
  { id: 'admin', label: 'Offices & Admin' },
  { id: 'lift', label: 'Elevators & Stairs' }
];

/**
 * Checks if a node category matches the user filter
 */
export function matchCategory(itemCategory, filterCategory) {
  if (!filterCategory || filterCategory === 'all') return true;
  if (!itemCategory) return false;
  if (itemCategory === filterCategory) return true;

  if (filterCategory === 'classroom') {
    return ['classroom', 'hall', 'lab'].includes(itemCategory);
  }
  if (filterCategory === 'admin') {
    return ['admin', 'faculty'].includes(itemCategory);
  }
  if (filterCategory === 'canteen') {
    return itemCategory === 'canteen';
  }
  if (filterCategory === 'restroom') {
    return itemCategory === 'restroom';
  }
  if (filterCategory === 'library') {
    return itemCategory === 'library';
  }
  if (filterCategory === 'lift') {
    return ['lift', 'stairs'].includes(itemCategory);
  }

  return false;
}

/**
 * Resolves an SVG room ID or query ID to the canonical room in francisBlock
 */
export function resolveNodeId(rawId, floor) {
  if (!rawId) return null;
  const floorRooms = francisBlock.floors[floor]?.rooms;
  if (!floorRooms) return rawId;

  // 1. Direct match
  const direct = floorRooms.find(r => r.id === rawId);
  if (direct) return direct.id;

  // 2. Prefix match (e.g. rawId is "room-004", room.id is "room-004-gents")
  const prefixMatch = floorRooms.find(r => r.id.startsWith(`${rawId}-`) || rawId.startsWith(`${r.id}-`));
  if (prefixMatch) return prefixMatch.id;

  // 3. Match room number (e.g. rawId is "room-001-managers-room")
  const numMatch = rawId.match(/^room-(\d+[a-zA-Z]?)/);
  if (numMatch) {
    const numPrefix = `room-${numMatch[1]}`;
    const numRoom = floorRooms.find(r => r.id === numPrefix || r.id.startsWith(`${numPrefix}-`));
    if (numRoom) return numRoom.id;
  }

  // 4. Match lifts and stairs
  const generalMatch = floorRooms.find(r => rawId.startsWith(r.id) || r.id.startsWith(rawId));
  if (generalMatch) return generalMatch.id;

  return rawId;
}

/**
 * Get human-friendly room name
 */
export function getRoomDisplayName(id, floor) {
  if (!id) return '';
  const room = findRoom(id, floor);
  if (room?.name) return room.name;
  return id.replace('room-', '').replace(/-/g, ' ').toUpperCase();
}

/**
 * Get rich contextual location information for room inspection card
 */
export function getRoomContext(id, floor) {
  if (!id) return null;
  const room = findRoom(id, floor);
  if (!room) {
    return {
      id,
      floor: floor || 'ground',
      floorLabel: FLOOR_LABELS[floor] || 'Ground Floor (0F)',
      block: 'St. Francis Block',
      name: id.replace('room-', '').replace(/-/g, ' ').toUpperCase(),
      wing: 'Central Block',
      nearestAccess: null,
      category: 'room',
      accessible: true
    };
  }

  return {
    ...room,
    floor: room.floor || floor,
    floorLabel: FLOOR_LABELS[room.floor || floor] || 'Ground Floor',
    block: room.block || 'St. Francis Block'
  };
}

/**
 * Returns filtered amenities grouped by current floor vs other floors
 */
export function getFilteredAmenities(category, currentFloor) {
  if (!category || category === 'all') {
    return { currentFloorItems: [], otherFloorItems: [], totalCount: 0 };
  }

  const currentFloorItems = [];
  const otherFloorItems = [];

  allRooms.forEach(room => {
    if (matchCategory(room.category, category)) {
      if (room.floor === currentFloor) {
        currentFloorItems.push(room);
      } else {
        otherFloorItems.push(room);
      }
    }
  });

  return {
    currentFloorItems,
    otherFloorItems,
    totalCount: currentFloorItems.length + otherFloorItems.length
  };
}
