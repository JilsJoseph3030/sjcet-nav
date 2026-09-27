-- Enable PostGIS extension for spatial data
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Floors Table (Metadata for floors)
CREATE TABLE floors (
  id text PRIMARY KEY,
  name text NOT NULL,
  level_index integer NOT NULL
);

-- 2. Nodes Table (Rooms, stairs, utility locations mapped to SVG coordinates)
CREATE TABLE nodes (
  id text NOT NULL,
  floor_id text REFERENCES floors(id),
  name text NOT NULL,
  type text DEFAULT 'room', -- e.g., 'room', 'stair-core', 'entrance'
  -- We store our local SVG (x, y) coordinates as a 2D PostGIS Point geometry.
  -- We use SRID 0 for an arbitrary Cartesian plane (our SVG grid).
  geom geometry(Point, 0), 
  PRIMARY KEY (id, floor_id)
);

-- 3. Edges Table (Graph connections for pathfinding)
CREATE TABLE edges (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  from_node_id text NOT NULL,
  from_floor_id text NOT NULL,
  to_node_id text NOT NULL,
  to_floor_id text NOT NULL,
  weight float NOT NULL,
  FOREIGN KEY (from_node_id, from_floor_id) REFERENCES nodes(id, floor_id),
  FOREIGN KEY (to_node_id, to_floor_id) REFERENCES nodes(id, floor_id)
);

-- Create Spatial Index for fast bounding box / nearest neighbor queries
CREATE INDEX nodes_geom_idx ON nodes USING GIST (geom);

-- Setup Row Level Security (RLS) for public read access (Anonymous Navigation)
ALTER TABLE floors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read floors" ON floors FOR SELECT USING (true);

ALTER TABLE nodes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read nodes" ON nodes FOR SELECT USING (true);

ALTER TABLE edges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read edges" ON edges FOR SELECT USING (true);

-- =====================================================================
-- Spatial Views
-- =====================================================================
CREATE OR REPLACE VIEW vw_nodes_xy AS
SELECT 
  id, 
  floor_id, 
  name, 
  type, 
  ST_X(geom::geometry) as x, 
  ST_Y(geom::geometry) as y
FROM nodes;

-- =====================================================================
-- Spatial RPC Function for Tap-to-Room Coordinate Matching
-- =====================================================================
CREATE OR REPLACE FUNCTION get_nearest_node(px float, py float, search_floor text, max_distance float DEFAULT 50.0)
RETURNS TABLE (
  id text,
  name text,
  type text,
  distance float
) LANGUAGE plpgsql STABLE AS $$
BEGIN
  RETURN QUERY
  SELECT 
    n.id, 
    n.name, 
    n.type,
    ST_Distance(n.geom, ST_MakePoint(px, py)) as distance
  FROM nodes n
  WHERE n.floor_id = search_floor
    AND ST_Distance(n.geom, ST_MakePoint(px, py)) < max_distance
  ORDER BY n.geom <-> ST_MakePoint(px, py)
  LIMIT 1;
END;
$$;

