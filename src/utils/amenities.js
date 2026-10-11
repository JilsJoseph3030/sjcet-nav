/**
 * SJCET Amenities & Location Categories Helper
 */

export const CATEGORIES = [
  { id: 'all', label: 'All Places' },
  { id: 'restroom', label: 'Restrooms' },
  { id: 'canteen', label: 'Food & Dining' },
  { id: 'library', label: 'Libraries' },
  { id: 'classroom', label: 'Classrooms & Halls' },
  { id: 'admin', label: 'Offices & Admin' },
  { id: 'lift', label: 'Elevators' }
];

export const FLOOR_LABELS = {
  ground: 'Ground Floor (0F)',
  first: '1st Floor (1F)',
  second: '2nd Floor (2F)',
  third: '3rd Floor (3F)',
  fourth: '4th Floor (4F)'
};

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
    return itemCategory === 'lift';
  }

  return false;
}

/**
 * Resolves an SVG room ID or query ID to the canonical node key in graphData
 */
export function resolveNodeId(rawId, floor, graphData) {
  if (!rawId) return null;
  const floorNodes = graphData?.[floor]?.nodes;
  if (!floorNodes) return rawId;

  // 1. Direct match
  if (floorNodes[rawId]) return rawId;

  // 2. Try prefix match (e.g. rawId is "room-004", node is "room-004-gents")
  const directPrefixMatch = Object.keys(floorNodes).find(k => k === rawId || k.startsWith(`${rawId}-`));
  if (directPrefixMatch) return directPrefixMatch;

  // 3. Match room number (e.g. rawId is "room-001-managers-room" or "room-004-gents")
  const numMatch = rawId.match(/^room-(\d+[a-zA-Z]?)/);
  if (numMatch) {
    const numPrefix = `room-${numMatch[1]}`;
    if (floorNodes[numPrefix]) return numPrefix;
    const keyWithPrefix = Object.keys(floorNodes).find(k => k === numPrefix || k.startsWith(`${numPrefix}-`));
    if (keyWithPrefix) return keyWithPrefix;
  }

  // 4. Match lifts and stairs
  const generalMatch = Object.keys(floorNodes).find(k => rawId.startsWith(k) || k.startsWith(rawId));
  if (generalMatch) return generalMatch;

  return rawId;
}

/**
 * Get human-friendly node name
 */
export function getRoomDisplayName(id, floor, graphData) {
  if (!id || !graphData) return '';
  const resolvedId = resolveNodeId(id, floor, graphData);
  const node = graphData[floor]?.nodes[resolvedId] || graphData[floor]?.nodes[id];
  if (node?.name) return node.name;
  return id.replace('room-', '').replace(/-/g, ' ').toUpperCase();
}

/**
 * Returns filtered amenities grouped by current floor vs other floors
 */
export function getFilteredAmenities(category, graphData, currentFloor) {
  if (!graphData || !category || category === 'all') {
    return { currentFloorItems: [], otherFloorItems: [], totalCount: 0 };
  }

  const currentFloorItems = [];
  const otherFloorItems = [];

  const floors = ['ground', 'first', 'second', 'third', 'fourth'];

  floors.forEach(floor => {
    const floorNodes = graphData[floor]?.nodes || {};
    Object.keys(floorNodes).forEach(nodeId => {
      const node = floorNodes[nodeId];
      if (matchCategory(node.category, category)) {
        const item = {
          id: nodeId,
          floor,
          name: node.name || nodeId,
          category: node.category,
          accessible: node.accessible !== false,
          floorLabel: FLOOR_LABELS[floor] || floor
        };

        if (floor === currentFloor) {
          currentFloorItems.push(item);
        } else {
          otherFloorItems.push(item);
        }
      }
    });
  });

  return {
    currentFloorItems,
    otherFloorItems,
    totalCount: currentFloorItems.length + otherFloorItems.length
  };
}
