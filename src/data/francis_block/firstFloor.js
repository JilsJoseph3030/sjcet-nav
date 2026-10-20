/**
 * St. Francis Block — First Floor (1F)
 * 
 * Edit room names, categories, or wings easily here.
 * Any updates will automatically reflect across the map, search, and room details.
 */
export const firstFloor = {
  id: 'first',
  label: '1st Floor (1F)',
  block: 'St. Francis Block',
  rooms: [
    {
      id: 'room-101',
      name: 'Tutorial Room 101',
      category: 'classroom',
      wing: 'West Wing',
      nearestAccess: 'South-West Corridor',
      accessible: true
    },
    {
      id: 'room-102',
      name: 'Tutorial Room 102',
      category: 'classroom',
      wing: 'West Wing',
      nearestAccess: 'West Corridor',
      accessible: true
    },
    {
      id: 'room-103',
      name: 'Central Library 103',
      category: 'library',
      wing: 'West Wing',
      nearestAccess: 'West Stairs & Lift',
      accessible: true
    },
    {
      id: 'room-104-gents',
      name: 'Gents Restroom 104',
      category: 'restroom',
      wing: 'West Wing',
      nearestAccess: 'West Stairs & Lift',
      accessible: true
    },
    {
      id: 'room-105-gents-hc',
      name: 'Accessible Restroom (Gents 105)',
      category: 'restroom',
      wing: 'West Wing',
      nearestAccess: 'West Elevator (Accessible)',
      accessible: true
    },
    {
      id: 'room-106',
      name: "Gents' Waiting Room 106",
      category: 'amenity',
      wing: 'West Wing',
      nearestAccess: 'West Stairs',
      accessible: true
    },
    {
      id: 'room-107',
      name: 'Lecture Hall I 107',
      category: 'classroom',
      wing: 'West Wing',
      nearestAccess: 'West Corridor',
      accessible: true
    },
    {
      id: 'room-108',
      name: 'Lecture Hall II 108',
      category: 'classroom',
      wing: 'West Wing',
      nearestAccess: 'North-West Corridor',
      accessible: true
    },
    {
      id: 'room-109',
      name: 'Lecture Hall III 109',
      category: 'classroom',
      wing: 'East Wing',
      nearestAccess: 'North-East Corridor',
      accessible: true
    },
    {
      id: 'room-110',
      name: 'Lecture Hall IV 110',
      category: 'classroom',
      wing: 'East Wing',
      nearestAccess: 'East Corridor',
      accessible: true
    },
    {
      id: 'room-111',
      name: 'Ladies Waiting Room 111',
      category: 'amenity',
      wing: 'East Wing',
      nearestAccess: 'East Stairs & Lift',
      accessible: true
    },
    {
      id: 'room-112-ladies-hc',
      name: 'Accessible Restroom (Ladies 112)',
      category: 'restroom',
      wing: 'East Wing',
      nearestAccess: 'East Elevator (Accessible)',
      accessible: true
    },
    {
      id: 'room-113-ladies',
      name: 'Ladies Restroom 113',
      category: 'restroom',
      wing: 'East Wing',
      nearestAccess: 'East Stairs',
      accessible: true
    },
    {
      id: 'room-114',
      name: 'Faculty Room 114',
      category: 'admin',
      wing: 'East Wing',
      nearestAccess: 'East Corridor',
      accessible: true
    },
    {
      id: 'room-115',
      name: 'HOD Room 115',
      category: 'admin',
      wing: 'East Wing',
      nearestAccess: 'South-East Corridor',
      accessible: true
    },
    {
      id: 'room-117',
      name: 'MCA Computer Lab 117',
      category: 'lab',
      wing: 'East Wing',
      nearestAccess: 'East Corridor & Central Junction',
      accessible: true
    },
    {
      id: 'lift-west',
      name: 'West Elevator (1st Fl)',
      category: 'lift',
      wing: 'West Wing',
      nearestAccess: 'West Stairs',
      accessible: true
    },
    {
      id: 'lift-east',
      name: 'East Elevator (1st Fl)',
      category: 'lift',
      wing: 'East Wing',
      nearestAccess: 'East Stairs',
      accessible: true
    },
    {
      id: 'stairs-west',
      name: 'West Stairs (1st Fl)',
      category: 'stairs',
      wing: 'West Wing',
      nearestAccess: 'West Elevator',
      accessible: false
    },
    {
      id: 'stairs-east',
      name: 'East Stairs (1st Fl)',
      category: 'stairs',
      wing: 'East Wing',
      nearestAccess: 'East Elevator',
      accessible: false
    },
    {
      id: 'stairs-south',
      name: 'South Stairs (1st Fl)',
      category: 'stairs',
      wing: 'Central Block',
      nearestAccess: 'South Hallway',
      accessible: false
    }
  ]
};
