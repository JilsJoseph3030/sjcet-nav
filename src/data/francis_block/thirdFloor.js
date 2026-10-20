/**
 * St. Francis Block — Third Floor (3F)
 * 
 * Edit room names, categories, or wings easily here.
 * Any updates will automatically reflect across the map, search, and room details.
 */
export const thirdFloor = {
  id: 'third',
  label: '3rd Floor (3F)',
  block: 'St. Francis Block',
  rooms: [
    {
      id: 'room-301',
      name: 'Tutorial Room 301',
      category: 'classroom',
      wing: 'West Wing',
      nearestAccess: 'South-West Corridor',
      accessible: true
    },
    {
      id: 'room-302',
      name: 'Tutorial Room 302',
      category: 'classroom',
      wing: 'West Wing',
      nearestAccess: 'West Corridor',
      accessible: true
    },
    {
      id: 'room-303',
      name: 'Research Room 303',
      category: 'lab',
      wing: 'West Wing',
      nearestAccess: 'West Stairs & Lift',
      accessible: true
    },
    {
      id: 'room-304-gents',
      name: 'Gents Restroom 304',
      category: 'restroom',
      wing: 'West Wing',
      nearestAccess: 'West Stairs & Lift',
      accessible: true
    },
    {
      id: 'room-305-gents-hc',
      name: 'Accessible Restroom (Gents 305)',
      category: 'restroom',
      wing: 'West Wing',
      nearestAccess: 'West Elevator (Accessible)',
      accessible: true
    },
    {
      id: 'room-306',
      name: "Gents' Waiting Room 306",
      category: 'amenity',
      wing: 'West Wing',
      nearestAccess: 'West Stairs',
      accessible: true
    },
    {
      id: 'room-307',
      name: 'Lecture Hall III 307',
      category: 'classroom',
      wing: 'West Wing',
      nearestAccess: 'West Corridor',
      accessible: true
    },
    {
      id: 'room-308',
      name: 'Lecture Hall IV 308',
      category: 'classroom',
      wing: 'West Wing',
      nearestAccess: 'North-West Corridor',
      accessible: true
    },
    {
      id: 'room-309',
      name: 'Seminar Hall 309',
      category: 'hall',
      wing: 'Central Block',
      nearestAccess: 'North Corridor',
      accessible: true
    },
    {
      id: 'room-310',
      name: 'Lecture Hall I 310',
      category: 'classroom',
      wing: 'East Wing',
      nearestAccess: 'North-East Corridor',
      accessible: true
    },
    {
      id: 'room-311',
      name: 'Lecture Hall II 311',
      category: 'classroom',
      wing: 'East Wing',
      nearestAccess: 'East Corridor',
      accessible: true
    },
    {
      id: 'room-312',
      name: 'Ladies Waiting Room 312',
      category: 'amenity',
      wing: 'East Wing',
      nearestAccess: 'East Stairs & Lift',
      accessible: true
    },
    {
      id: 'room-313-ladies-hc',
      name: 'Accessible Restroom (Ladies 313)',
      category: 'restroom',
      wing: 'East Wing',
      nearestAccess: 'East Elevator (Accessible)',
      accessible: true
    },
    {
      id: 'room-314-ladies',
      name: 'Ladies Restroom 314',
      category: 'restroom',
      wing: 'East Wing',
      nearestAccess: 'East Stairs',
      accessible: true
    },
    {
      id: 'room-315',
      name: 'Faculty Room 315',
      category: 'admin',
      wing: 'East Wing',
      nearestAccess: 'East Corridor',
      accessible: true
    },
    {
      id: 'room-316',
      name: 'HOD Room 316',
      category: 'admin',
      wing: 'East Wing',
      nearestAccess: 'South-East Corridor',
      accessible: true
    },
    {
      id: 'room-317',
      name: 'Conference Room 317',
      category: 'hall',
      wing: 'East Wing',
      nearestAccess: 'South-East Corridor',
      accessible: true
    },
    {
      id: 'room-318',
      name: 'Department Library 318',
      category: 'library',
      wing: 'East Wing',
      nearestAccess: 'East Corridor',
      accessible: true
    },
    {
      id: 'room-318a',
      name: 'Print Spot 318/A',
      category: 'amenity',
      wing: 'East Wing',
      nearestAccess: 'East Corridor & Central Junction',
      accessible: true
    },
    {
      id: 'lift-west',
      name: 'West Elevator (3rd Fl)',
      category: 'lift',
      wing: 'West Wing',
      nearestAccess: 'West Stairs',
      accessible: true
    },
    {
      id: 'lift-east',
      name: 'East Elevator (3rd Fl)',
      category: 'lift',
      wing: 'East Wing',
      nearestAccess: 'East Stairs',
      accessible: true
    },
    {
      id: 'stairs-west',
      name: 'West Stairs (3rd Fl)',
      category: 'stairs',
      wing: 'West Wing',
      nearestAccess: 'West Elevator',
      accessible: false
    },
    {
      id: 'stairs-east',
      name: 'East Stairs (3rd Fl)',
      category: 'stairs',
      wing: 'East Wing',
      nearestAccess: 'East Elevator',
      accessible: false
    },
    {
      id: 'stairs-south',
      name: 'South Stairs (3rd Fl)',
      category: 'stairs',
      wing: 'Central Block',
      nearestAccess: 'South Hallway',
      accessible: false
    }
  ]
};
