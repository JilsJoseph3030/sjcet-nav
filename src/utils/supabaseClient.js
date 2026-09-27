import { createClient } from '@supabase/supabase-js';

// Setup environment variables in a .env.local file:
// VITE_SUPABASE_URL=your_supabase_project_url
// VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder_anon_key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Spatial Query: Tap-to-Room matching
 * Queries the PostGIS database to find the closest node within a radius of the tap coordinate.
 */
export async function findNearestNode(x, y, floor, maxDistance = 50.0) {
  const { data, error } = await supabase.rpc('get_nearest_node', {
    px: x,
    py: y,
    search_floor: floor,
    max_distance: maxDistance
  });

  if (error) {
    console.error('Error fetching spatial node:', error);
    return null;
  }
  
  return data && data.length > 0 ? data[0] : null;
}

/**
 * Fetch Graph Matrix: Pulls all nodes and edges from Supabase to dynamically build the A* routing graph.
 */
export async function fetchRoutingGraph() {
  const { data: nodesData, error: nodesError } = await supabase.from('vw_nodes_xy').select('*');
  const { data: edgesData, error: edgesError } = await supabase.from('edges').select('*');
  
  if (nodesError || edgesError) {
    console.error('Graph fetch error:', nodesError || edgesError);
    return null;
  }
  
  const dynamicGraph = {};
  
  nodesData.forEach(node => {
    if (!dynamicGraph[node.floor_id]) {
      dynamicGraph[node.floor_id] = { nodes: {}, edges: [] };
    }
    dynamicGraph[node.floor_id].nodes[node.id] = {
      name: node.name,
      x: node.x,
      y: node.y,
      type: node.type,
      connections: []
    };
  });
  
  edgesData.forEach(edge => {
    if (edge.from_floor_id === edge.to_floor_id) {
      if (dynamicGraph[edge.from_floor_id]) {
        dynamicGraph[edge.from_floor_id].edges.push({
          from: edge.from_node_id,
          to: edge.to_node_id,
          weight: edge.weight
        });
      }
    } else {
      if (dynamicGraph[edge.from_floor_id] && dynamicGraph[edge.from_floor_id].nodes[edge.from_node_id]) {
        // Only add if not already present
        const connStr = `${edge.to_floor_id}_${edge.to_node_id}`;
        if (!dynamicGraph[edge.from_floor_id].nodes[edge.from_node_id].connections.includes(connStr)) {
          dynamicGraph[edge.from_floor_id].nodes[edge.from_node_id].connections.push(connStr);
        }
      }
    }
  });

  return dynamicGraph;
}
