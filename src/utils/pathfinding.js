import graphData from './graph.json';

class PriorityQueue {
  constructor() {
    this.elements = [];
  }
  enqueue(element, priority) {
    this.elements.push({ element, priority });
    this.elements.sort((a, b) => a.priority - b.priority);
  }
  dequeue() {
    return this.elements.shift().element;
  }
  isEmpty() {
    return this.elements.length === 0;
  }
}

// Full A* Pathfinding Engine (Phase 2 completion)
export function computeShortestPath(startNodeId, startFloor, targetNodeId, targetFloor) {
  if (!startNodeId || !targetNodeId) return null;

  // Combine floors into a single unified graph for pathfinding
  const unifiedNodes = {};
  const unifiedEdges = {};

  Object.keys(graphData).forEach(floor => {
    // Add nodes
    Object.keys(graphData[floor].nodes).forEach(nodeId => {
      const globalId = `${floor}_${nodeId}`;
      unifiedNodes[globalId] = { ...graphData[floor].nodes[nodeId], floor };
      unifiedEdges[globalId] = [];
    });
    
    // Add intra-floor edges (bidirectional)
    graphData[floor].edges.forEach(edge => {
      const fromGlobal = `${floor}_${edge.from}`;
      const toGlobal = `${floor}_${edge.to}`;
      if(unifiedEdges[fromGlobal] && unifiedEdges[toGlobal]) {
        unifiedEdges[fromGlobal].push({ to: toGlobal, weight: edge.weight });
        unifiedEdges[toGlobal].push({ to: fromGlobal, weight: edge.weight });
      }
    });
  });

  // Add inter-floor connections (stairs/lifts)
  Object.keys(unifiedNodes).forEach(globalId => {
    const node = unifiedNodes[globalId];
    if (node.connections) {
      node.connections.forEach(targetGlobalId => {
        if (unifiedEdges[targetGlobalId]) {
          // Assume weight of 1000 for floor transitions
          unifiedEdges[globalId].push({ to: targetGlobalId, weight: 1000 });
          unifiedEdges[targetGlobalId].push({ to: globalId, weight: 1000 });
        }
      });
    }
  });

  const startGlobalId = `${startFloor}_${startNodeId}`;
  const targetGlobalId = `${targetFloor}_${targetNodeId}`;

  // Dijkstra / A* Search
  const frontier = new PriorityQueue();
  frontier.enqueue(startGlobalId, 0);
  
  const cameFrom = { [startGlobalId]: null };
  const costSoFar = { [startGlobalId]: 0 };

  while (!frontier.isEmpty()) {
    const current = frontier.dequeue();

    if (current === targetGlobalId) break;

    unifiedEdges[current].forEach(edge => {
      const newCost = costSoFar[current] + edge.weight;
      if (!(edge.to in costSoFar) || newCost < costSoFar[edge.to]) {
        costSoFar[edge.to] = newCost;
        // Basic heuristic: could use euclidean distance if real (x,y) were aligned across floors
        const priority = newCost; 
        frontier.enqueue(edge.to, priority);
        cameFrom[edge.to] = current;
      }
    });
  }

  // Reconstruct path
  if (!(targetGlobalId in cameFrom)) {
    return { pathNodes: [], instructions: ["Path not found in routing graph."] };
  }

  let current = targetGlobalId;
  const path = [];
  while (current !== null) {
    path.push(current);
    current = cameFrom[current];
  }
  path.reverse();

  // Generate turn-by-turn instructions based on path transitions
  const instructions = [];
  let currentFloor = startFloor;
  
  if (path.length <= 1) {
    instructions.push("You are already at your destination.");
  } else {
    for (let i = 0; i < path.length - 1; i++) {
      const fromNode = unifiedNodes[path[i]];
      const toNode = unifiedNodes[path[i+1]];
      
      if (fromNode.floor !== toNode.floor) {
        instructions.push(`Take the ${fromNode.name} to the ${toNode.floor === 'ground' ? 'Ground' : 'First'} Floor.`);
        currentFloor = toNode.floor;
      }
    }
    instructions.push(`Proceed to ${unifiedNodes[targetGlobalId].name}.`);
  }

  return {
    pathNodes: path.map(p => {
      const id = p.split('_')[1];
      return {
        id,
        floor: unifiedNodes[p].floor,
        x: unifiedNodes[p].x,
        y: unifiedNodes[p].y
      };
    }),
    instructions: instructions
  };
}
