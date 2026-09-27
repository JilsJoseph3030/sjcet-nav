import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Requires service role to bypass RLS writes

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDatabase() {
  const graphData = JSON.parse(fs.readFileSync('../src/utils/graph.json', 'utf8'));

  // 1. Insert Floors
  const floors = [
    { id: 'ground', name: 'Ground Floor', level_index: 0 },
    { id: 'first', name: 'First Floor', level_index: 1 },
    { id: 'second', name: 'Second Floor', level_index: 2 },
    { id: 'third', name: 'Third Floor', level_index: 3 },
    { id: 'fourth', name: 'Fourth Floor', level_index: 4 }
  ];
  
  await supabase.from('floors').upsert(floors);
  console.log('Floors seeded.');

  // 2. Insert Nodes
  for (const [floorId, floorData] of Object.entries(graphData)) {
    for (const [nodeId, nodeObj] of Object.entries(floorData.nodes)) {
      
      const type = nodeId.includes('stair') ? 'stair-core' 
                 : nodeId.includes('entrance') ? 'entrance' 
                 : 'room';

      const { error } = await supabase.from('nodes').upsert({
        id: nodeId,
        floor_id: floorId,
        name: nodeObj.name,
        type: type,
        geom: `POINT(${nodeObj.x} ${nodeObj.y})`
      });

      if (error) console.error(`Error inserting node ${nodeId}:`, error);
    }
  }
  console.log('Nodes seeded.');

  // 3. Insert Edges (Intra-floor & Inter-floor)
  for (const [floorId, floorData] of Object.entries(graphData)) {
    // Intra-floor edges
    if (floorData.edges) {
      for (const edge of floorData.edges) {
        await supabase.from('edges').insert({
          from_node_id: edge.from,
          from_floor_id: floorId,
          to_node_id: edge.to,
          to_floor_id: floorId,
          weight: edge.weight
        });
      }
    }
    
    // Inter-floor connections
    for (const [nodeId, nodeObj] of Object.entries(floorData.nodes)) {
      if (nodeObj.connections) {
        for (const conn of nodeObj.connections) {
          const [targetFloor, targetNodeId] = conn.split('_');
          await supabase.from('edges').insert({
            from_node_id: nodeId,
            from_floor_id: floorId,
            to_node_id: targetNodeId,
            to_floor_id: targetFloor,
            weight: 1000
          });
        }
      }
    }
  }
  console.log('Edges seeded.');
}

seedDatabase();
