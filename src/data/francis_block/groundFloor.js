/**
 * St. Francis Block — Ground Floor (0F)
 * 
 * Edit room names, categories, or wings easily here.
 * Any updates will automatically reflect across the map, search, and room details.
 */
export const groundFloor = {
  id: 'ground',
  label: 'Ground Floor (0F)',
  block: 'St. Francis Block',
  rooms: [
    {
      id: 'room-001',
      name: "Manager's Room 001",
      category: 'admin',
      wing: 'West Wing',
      nearestAccess: 'South Lobby & West Stairs',
      accessible: true
    },
    {
      id: 'room-002',
      name: 'Medicare Health Center 002',
      category: 'amenity',
      wing: 'West Wing',
      nearestAccess: 'South Lobby & West Stairs',
      accessible: true
    },
    {
      id: 'room-003',
      name: 'Placement Cell 003',
      category: 'admin',
      wing: 'West Wing',
      nearestAccess: 'West Stairs & Lift',
      accessible: true
    },
    {
      id: 'room-004-gents',
      name: 'Gents Restroom 004',
      category: 'restroom',
      wing: 'West Wing',
      nearestAccess: 'West Stairs & Lift',
      accessible: true
    },
    {
      id: 'room-005-gents-hc',
      name: 'Accessible Restroom (Gents HC 005)',
      category: 'restroom',
      wing: 'West Wing',
      nearestAccess: 'West Elevator (Accessible)',
      accessible: true
    },
    {
      id: 'room-006',
      name: 'Electrical Circuit Room 006',
      category: 'facility',
      wing: 'West Wing',
      nearestAccess: 'West Stairs',
      accessible: true
    },
    {
      id: 'room-007',
      name: 'Placement Control Room 007',
      category: 'admin',
      wing: 'West Wing',
      nearestAccess: 'West Corridor',
      accessible: true
    },
    {
      id: 'room-008',
      name: 'GD & PI Room 008',
      category: 'classroom',
      wing: 'West Wing',
      nearestAccess: 'North-West Corridor',
      accessible: true
    },
    {
      id: 'room-009',
      name: 'St. Francis Auditorium 009',
      category: 'hall',
      wing: 'Central Block',
      nearestAccess: 'Central Corridor & Atrium',
      accessible: true
    },
    {
      id: 'room-011',
      name: 'Prayer Hall 011',
      category: 'amenity',
      wing: 'Central Block',
      nearestAccess: 'Central Corridor Junction',
      accessible: true
    },
    {
      id: 'room-012',
      name: 'Civil Seminar Hall 012',
      category: 'hall',
      wing: 'East Wing',
      nearestAccess: 'North-East Corridor',
      accessible: true
    },
    {
      id: 'room-013',
      name: 'Valuation Camp KTU 013',
      category: 'admin',
      wing: 'East Wing',
      nearestAccess: 'East Corridor',
      accessible: true
    },
    {
      id: 'room-014',
      name: 'Ladies Waiting Room 014',
      category: 'amenity',
      wing: 'East Wing',
      nearestAccess: 'East Stairs & Lift',
      accessible: true
    },
    {
      id: 'room-015-ladies-hc',
      name: 'Accessible Restroom (Ladies HC 015)',
      category: 'restroom',
      wing: 'East Wing',
      nearestAccess: 'East Elevator (Accessible)',
      accessible: true
    },
    {
      id: 'room-016-ladies',
      name: 'Ladies Restroom 016',
      category: 'restroom',
      wing: 'East Wing',
      nearestAccess: 'East Stairs',
      accessible: true
    },
    {
      id: 'room-017',
      name: "Visitors' Dining Room 017",
      category: 'canteen',
      wing: 'East Wing',
      nearestAccess: 'East Corridor & Canteen',
      accessible: true
    },
    {
      id: 'room-018',
      name: 'Campus Canteen 018',
      category: 'canteen',
      wing: 'East Wing',
      nearestAccess: 'South-East Entrance',
      accessible: true
    },
    {
      id: 'lift-west',
      name: 'West Elevator (Accessible)',
      category: 'lift',
      wing: 'West Wing',
      nearestAccess: 'West Staircase',
      accessible: true
    },
    {
      id: 'lift-east',
      name: 'East Elevator (Accessible)',
      category: 'lift',
      wing: 'East Wing',
      nearestAccess: 'East Staircase',
      accessible: true
    },
    {
      id: 'stairs-west',
      name: 'West Stairs',
      category: 'stairs',
      wing: 'West Wing',
      nearestAccess: 'West Elevator',
      accessible: false
    },
    {
      id: 'stairs-east',
      name: 'East Stairs',
      category: 'stairs',
      wing: 'East Wing',
      nearestAccess: 'East Elevator',
      accessible: false
    },
    {
      id: 'stairs-south',
      name: 'South Grand Staircase',
      category: 'stairs',
      wing: 'Central Block',
      nearestAccess: 'Main Entrance Lobby',
      accessible: false
    }
  ]
};
