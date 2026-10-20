/**
 * St. Francis Block — Second Floor (2F)
 * 
 * Edit room names, categories, or wings easily here.
 * Any updates will automatically reflect across the map, search, and room details.
 */
export const secondFloor = {
  id: 'second',
  label: '2nd Floor (2F)',
  block: 'St. Francis Block',
  rooms: [
    {
      id: 'room-201',
      name: 'Tutorial Room 201',
      category: 'classroom',
      wing: 'West Wing',
      nearestAccess: 'South-West Corridor',
      accessible: true
    },
    {
      id: 'room-202',
      name: 'Tutorial Room 202',
      category: 'classroom',
      wing: 'West Wing',
      nearestAccess: 'West Corridor',
      accessible: true
    },
    {
      id: 'room-203',
      name: 'Tutorial Room 203',
      category: 'classroom',
      wing: 'West Wing',
      nearestAccess: 'West Stairs & Lift',
      accessible: true
    },
    {
      id: 'room-204-gents',
      name: 'Gents Restroom 204',
      category: 'restroom',
      wing: 'West Wing',
      nearestAccess: 'West Stairs & Lift',
      accessible: true
    },
    {
      id: 'room-205-gents-hc',
      name: 'Accessible Restroom (Gents 205)',
      category: 'restroom',
      wing: 'West Wing',
      nearestAccess: 'West Elevator (Accessible)',
      accessible: true
    },
    {
      id: 'room-206',
      name: "Gents' Waiting Room 206",
      category: 'amenity',
      wing: 'West Wing',
      nearestAccess: 'West Stairs',
      accessible: true
    },
    {
      id: 'room-207',
      name: 'Lecture Hall I 207',
      category: 'classroom',
      wing: 'West Wing',
      nearestAccess: 'West Corridor',
      accessible: true
    },
    {
      id: 'room-208',
      name: 'Lecture Hall II 208',
      category: 'classroom',
      wing: 'West Wing',
      nearestAccess: 'North-West Corridor',
      accessible: true
    },
    {
      id: 'room-209',
      name: 'Seminar Hall 209',
      category: 'hall',
      wing: 'Central Block',
      nearestAccess: 'North Corridor',
      accessible: true
    },
    {
      id: 'room-210',
      name: 'Lecture Hall III 210',
      category: 'classroom',
      wing: 'East Wing',
      nearestAccess: 'North-East Corridor',
      accessible: true
    },
    {
      id: 'room-211',
      name: 'Lecture Hall IV 211',
      category: 'classroom',
      wing: 'East Wing',
      nearestAccess: 'East Corridor',
      accessible: true
    },
    {
      id: 'room-212',
      name: 'Ladies Waiting Room 212',
      category: 'amenity',
      wing: 'East Wing',
      nearestAccess: 'East Stairs & Lift',
      accessible: true
    },
    {
      id: 'room-213-ladies-hc',
      name: 'Accessible Restroom (Ladies 213)',
      category: 'restroom',
      wing: 'East Wing',
      nearestAccess: 'East Elevator (Accessible)',
      accessible: true
    },
    {
      id: 'room-214-ladies',
      name: 'Ladies Restroom 214',
      category: 'restroom',
      wing: 'East Wing',
      nearestAccess: 'East Stairs',
      accessible: true
    },
    {
      id: 'room-215',
      name: 'Faculty Room 215',
      category: 'admin',
      wing: 'East Wing',
      nearestAccess: 'East Corridor',
      accessible: true
    },
    {
      id: 'room-216',
      name: 'Executive Room 216',
      category: 'admin',
      wing: 'East Wing',
      nearestAccess: 'East Corridor',
      accessible: true
    },
    {
      id: 'room-217',
      name: 'HOD Room 217',
      category: 'admin',
      wing: 'East Wing',
      nearestAccess: 'South-East Corridor',
      accessible: true
    },
    {
      id: 'room-218',
      name: 'Department Reference Room 218',
      category: 'library',
      wing: 'East Wing',
      nearestAccess: 'South-East Corridor',
      accessible: true
    },
    {
      id: 'lift-west',
      name: 'West Elevator (2nd Fl)',
      category: 'lift',
      wing: 'West Wing',
      nearestAccess: 'West Stairs',
      accessible: true
    },
    {
      id: 'lift-east',
      name: 'East Elevator (2nd Fl)',
      category: 'lift',
      wing: 'East Wing',
      nearestAccess: 'East Stairs',
      accessible: true
    },
    {
      id: 'stairs-west',
      name: 'West Stairs (2nd Fl)',
      category: 'stairs',
      wing: 'West Wing',
      nearestAccess: 'West Elevator',
      accessible: false
    },
    {
      id: 'stairs-east',
      name: 'East Stairs (2nd Fl)',
      category: 'stairs',
      wing: 'East Wing',
      nearestAccess: 'East Elevator',
      accessible: false
    },
    {
      id: 'stairs-south',
      name: 'South Stairs (2nd Fl)',
      category: 'stairs',
      wing: 'Central Block',
      nearestAccess: 'South Hallway',
      accessible: false
    }
  ]
};
