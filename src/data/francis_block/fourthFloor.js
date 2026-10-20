/**
 * St. Francis Block — Fourth Floor (4F)
 * 
 * Edit room names, categories, or wings easily here.
 * Any updates will automatically reflect across the map, search, and room details.
 */
export const fourthFloor = {
  id: 'fourth',
  label: '4th Floor (4F)',
  block: 'St. Francis Block',
  rooms: [
    {
      id: 'room-401',
      name: 'Tutorial Room 401',
      category: 'classroom',
      wing: 'West Wing',
      nearestAccess: 'South-West Corridor',
      accessible: true
    },
    {
      id: 'room-402',
      name: 'Tutorial Room 402',
      category: 'classroom',
      wing: 'West Wing',
      nearestAccess: 'West Corridor',
      accessible: true
    },
    {
      id: 'room-403',
      name: 'Tutorial Room 403',
      category: 'classroom',
      wing: 'West Wing',
      nearestAccess: 'West Stairs & Lift',
      accessible: true
    },
    {
      id: 'room-404-gents',
      name: 'Gents Restroom 404',
      category: 'restroom',
      wing: 'West Wing',
      nearestAccess: 'West Stairs & Lift',
      accessible: true
    },
    {
      id: 'room-405-gents-hc',
      name: 'Accessible Restroom (Gents 405)',
      category: 'restroom',
      wing: 'West Wing',
      nearestAccess: 'West Elevator (Accessible)',
      accessible: true
    },
    {
      id: 'room-406',
      name: "Gents' Waiting Room 406",
      category: 'amenity',
      wing: 'West Wing',
      nearestAccess: 'West Stairs',
      accessible: true
    },
    {
      id: 'room-407',
      name: 'Lecture Hall I 407',
      category: 'classroom',
      wing: 'West Wing',
      nearestAccess: 'West Corridor',
      accessible: true
    },
    {
      id: 'room-408',
      name: 'Lecture Hall II 408',
      category: 'classroom',
      wing: 'West Wing',
      nearestAccess: 'North-West Corridor',
      accessible: true
    },
    {
      id: 'room-409',
      name: 'Seminar Hall 409',
      category: 'hall',
      wing: 'Central Block',
      nearestAccess: 'North Central Corridor',
      accessible: true
    },
    {
      id: 'room-410',
      name: 'Lecture Hall III 410',
      category: 'classroom',
      wing: 'East Wing',
      nearestAccess: 'North-East Corridor',
      accessible: true
    },
    {
      id: 'room-411',
      name: 'Lecture Hall IV 411',
      category: 'classroom',
      wing: 'East Wing',
      nearestAccess: 'East Corridor',
      accessible: true
    },
    {
      id: 'room-412',
      name: 'Ladies Waiting Room 412',
      category: 'amenity',
      wing: 'East Wing',
      nearestAccess: 'East Stairs & Lift',
      accessible: true
    },
    {
      id: 'room-413-ladies-hc',
      name: 'Accessible Restroom (Ladies 413)',
      category: 'restroom',
      wing: 'East Wing',
      nearestAccess: 'East Elevator (Accessible)',
      accessible: true
    },
    {
      id: 'room-414-ladies',
      name: 'Ladies Restroom 414',
      category: 'restroom',
      wing: 'East Wing',
      nearestAccess: 'East Stairs',
      accessible: true
    },
    {
      id: 'room-415',
      name: 'Faculty Room 415',
      category: 'admin',
      wing: 'East Wing',
      nearestAccess: 'East Corridor',
      accessible: true
    },
    {
      id: 'room-416',
      name: 'HOD Room 416',
      category: 'admin',
      wing: 'East Wing',
      nearestAccess: 'South-East Corridor',
      accessible: true
    },
    {
      id: 'room-417',
      name: 'Project Computer Lab 417',
      category: 'lab',
      wing: 'East Wing',
      nearestAccess: 'South-East Corridor',
      accessible: true
    },
    {
      id: 'room-418',
      name: 'Department Library 418',
      category: 'library',
      wing: 'East Wing',
      nearestAccess: 'East Corridor',
      accessible: true
    },
    {
      id: 'lift-west',
      name: 'West Elevator (4th Fl)',
      category: 'lift',
      wing: 'West Wing',
      nearestAccess: 'West Stairs',
      accessible: true
    },
    {
      id: 'lift-east',
      name: 'East Elevator (4th Fl)',
      category: 'lift',
      wing: 'East Wing',
      nearestAccess: 'East Stairs',
      accessible: true
    },
    {
      id: 'stairs-west',
      name: 'West Stairs (4th Fl)',
      category: 'stairs',
      wing: 'West Wing',
      nearestAccess: 'West Elevator',
      accessible: false
    },
    {
      id: 'stairs-east',
      name: 'East Stairs (4th Fl)',
      category: 'stairs',
      wing: 'East Wing',
      nearestAccess: 'East Elevator',
      accessible: false
    },
    {
      id: 'stairs-south',
      name: 'South Stairs (4th Fl)',
      category: 'stairs',
      wing: 'Central Block',
      nearestAccess: 'South Hallway',
      accessible: false
    }
  ]
};
