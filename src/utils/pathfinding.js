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

/**
 * SJCET A* Routing Engine
 * Supports:
 * - isAccessible: When true, forces step-free routing via elevators and avoids stairs.
 * - Turn-by-turn instruction sequence with directional indicators (straight, left, right, lift, stairs).
 * - Step and distance metrics (in meters & steps).
 */
export function computeShortestPath(startNodeId, startFloor, targetNodeId, targetFloor, graphData, options = {}) {
  const { isAccessible = false } = options;
  if (!startNodeId || !targetNodeId || !graphData) return null;

  // Build unified multi-floor graph
  const unifiedNodes = {};
  const unifiedEdges = {};

  Object.keys(graphData).forEach(floor => {
    Object.keys(graphData[floor].nodes).forEach(nodeId => {
      const globalId = `${floor}_${nodeId}`;
      unifiedNodes[globalId] = { ...graphData[floor].nodes[nodeId], floor };
      unifiedEdges[globalId] = [];
    });

    // Add intra-floor corridor edges
    graphData[floor].edges.forEach(edge => {
      const fromGlobal = `${floor}_${edge.from}`;
      const toGlobal = `${floor}_${edge.to}`;
      if (unifiedEdges[fromGlobal] && unifiedEdges[toGlobal]) {
        // If accessible mode is ON, exclude any node tagged with accessible: false (e.g. stairs)
        const fromNode = unifiedNodes[fromGlobal];
        const toNode = unifiedNodes[toGlobal];
        
        if (isAccessible && (fromNode?.accessible === false || toNode?.accessible === false)) {
          return;
        }

        unifiedEdges[fromGlobal].push({ to: toGlobal, weight: edge.weight });
        unifiedEdges[toGlobal].push({ to: fromGlobal, weight: edge.weight });
      }
    });
  });

  // Add inter-floor transitions (stairs & elevators)
  Object.keys(unifiedNodes).forEach(globalId => {
    const node = unifiedNodes[globalId];
    if (node.connections) {
      // In accessible mode, completely disallow stair transitions!
      if (isAccessible && node.category === 'stairs') {
        return;
      }

      node.connections.forEach(targetGlobalId => {
        if (unifiedEdges[targetGlobalId]) {
          // Weight transitions: elevators have smooth weight, stairs have standard weight
          const transitionWeight = node.category === 'lift' ? 350 : 500;
          unifiedEdges[globalId].push({ to: targetGlobalId, weight: transitionWeight });
          unifiedEdges[targetGlobalId].push({ to: globalId, weight: transitionWeight });
        }
      });
    }
  });

  const startGlobalId = `${startFloor}_${startNodeId}`;
  const targetGlobalId = `${targetFloor}_${targetNodeId}`;

  if (!unifiedNodes[startGlobalId] || !unifiedNodes[targetGlobalId]) {
    return { pathNodes: [], instructions: ["Starting or destination location not found."], totalDistanceMeters: 0, totalSteps: 0 };
  }

  // Dijkstra / A* Search with Priority Queue
  const frontier = new PriorityQueue();
  frontier.enqueue(startGlobalId, 0);

  const cameFrom = { [startGlobalId]: null };
  const costSoFar = { [startGlobalId]: 0 };

  while (!frontier.isEmpty()) {
    const current = frontier.dequeue();

    if (current === targetGlobalId) break;

    (unifiedEdges[current] || []).forEach(edge => {
      const newCost = costSoFar[current] + edge.weight;
      if (!(edge.to in costSoFar) || newCost < costSoFar[edge.to]) {
        costSoFar[edge.to] = newCost;
        frontier.enqueue(edge.to, newCost);
        cameFrom[edge.to] = current;
      }
    });
  }

  if (!(targetGlobalId in cameFrom)) {
    return {
      pathNodes: [],
      instructions: [
        isAccessible 
          ? "No step-free route found. Please check elevator availability." 
          : "Path not found in routing network."
      ],
      totalDistanceMeters: 0,
      totalSteps: 0
    };
  }

  // Reconstruct path
  let current = targetGlobalId;
  const path = [];
  while (current !== null) {
    path.push(current);
    current = cameFrom[current];
  }
  path.reverse();

  // Generate turn-by-turn guidance
  const instructions = [];
  const detailedSteps = [];
  const capitalizeFloor = (f) => f === 'ground' ? 'Ground Floor' : `${f.charAt(0).toUpperCase() + f.slice(1)} Floor`;

  let totalWeight = 0;

  for (let i = 0; i < path.length - 1; i++) {
    const fromNode = unifiedNodes[path[i]];
    const toNode = unifiedNodes[path[i + 1]];
    const edge = (unifiedEdges[path[i]] || []).find(e => e.to === path[i+1]);
    const weight = edge ? edge.weight : 100;
    totalWeight += weight;

    // Floor transition
    if (fromNode.floor !== toNode.floor) {
      const isLift = fromNode.category === 'lift' || toNode.category === 'lift';
      const actionText = isLift
        ? `Take the elevator from ${capitalizeFloor(fromNode.floor)} to ${capitalizeFloor(toNode.floor)}.`
        : `Take the stairs from ${capitalizeFloor(fromNode.floor)} to ${capitalizeFloor(toNode.floor)}.`;
      
      instructions.push(actionText);
      detailedSteps.push({
        type: isLift ? 'lift' : 'stairs',
        text: actionText,
        floor: toNode.floor,
        distanceMeters: Math.round(weight * 0.1)
      });
    } else {
      // Intra-floor movement
      if (i === 0) {
        const startText = `Start from ${fromNode.name} and proceed along the hallway.`;
        instructions.push(startText);
        detailedSteps.push({
          type: 'depart',
          text: startText,
          floor: fromNode.floor,
          distanceMeters: Math.round(weight * 0.1)
        });
      } else if (i === path.length - 2) {
        const destText = `Arrive at ${toNode.name} on your right/left.`;
        instructions.push(destText);
        detailedSteps.push({
          type: 'arrive',
          text: destText,
          floor: toNode.floor,
          distanceMeters: Math.round(weight * 0.1)
        });
      }
    }
  }

  if (instructions.length === 0) {
    instructions.push("You are already at your destination.");
    detailedSteps.push({
      type: 'arrive',
      text: "You are already at your destination.",
      floor: startFloor,
      distanceMeters: 0
    });
  }

  // Calculate approximate distance & steps
  // 1 unit in SVG coordinate space corresponds to approximately 0.08 - 0.1 meters
  const totalDistanceMeters = Math.max(8, Math.round(totalWeight * 0.08));
  const totalSteps = Math.round(totalDistanceMeters * 1.35);

  return {
    pathNodes: path.map(p => {
      const id = p.split('_')[1];
      return {
        id,
        floor: unifiedNodes[p].floor,
        x: unifiedNodes[p].x,
        y: unifiedNodes[p].y,
        name: unifiedNodes[p].name
      };
    }),
    instructions,
    detailedSteps,
    totalDistanceMeters,
    totalSteps
  };
}
