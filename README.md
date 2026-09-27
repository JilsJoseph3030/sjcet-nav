# SJCET Palai Indoor Navigation System

An advanced, interactive indoor navigation web application designed exclusively for the **St. Francis Block** at **St. Joseph's College of Engineering and Technology, Palai (SJCET)**. This application provides real-time, turn-by-turn routing across multiple floors, utilizing a custom pathfinding engine and interactive SVG maps.

---

## 🌟 Key Features

* **Interactive Multi-Floor Maps**: Scalable Vector Graphics (SVG) layouts for Ground and First floors (scalable to 4th floor) with smooth touch zoom and pan support (`react-zoom-pan-pinch`).
* **Dynamic A* Pathfinding**: Custom graph-based routing algorithm calculating the shortest multi-room and multi-floor paths, handling complex stairwell transitions flawlessly.
* **Google Maps-style Dual Routing UI**: Fully integrated bottom sheet featuring "From" and "To" search bars with real-time autocomplete, destination highlighting, and an instant route swap button.
* **Turn-by-Turn Mobile HUD**: A sticky head-up display providing live directional instructions, enhanced by glowing, animated dashed lines overlaying the exact walkable route on the map.
* **Pedestrian Dead Reckoning (PDR)**: Uses smartphone motion sensors (`DeviceMotionEvent`, `DeviceOrientationEvent`) to provide real-time step counting and compass heading on the UI.
* **Campus Geofencing**: Prevents remote usage by verifying the user's GPS bounds are within the SJCET campus, optionally redirecting them to Google Maps to navigate to the campus first.
* **QR Anchor Injection**: Physical QR codes on campus automatically inject `?floor=` and `?node=` URL query parameters to instantly calibrate the user's starting point without manual entry.

---

## 🏗️ Architecture & Technical Aspects

### 1. Technology Stack
* **Core**: React.js (Vite configuration) built as a Progressive Web App (PWA).
* **Styling**: Tailwind CSS customized with SJCET's institutional branding (Deep Maroon `#800000`, Gold/Amber `#c5a059`).
* **Mapping Engine**: Native DOM element manipulation on SVG vectors to inject interactive `id`s (e.g., `room-101`) for click tracking and style overlays.
* **Hosting/Deployment**: Vercel (CI/CD via GitHub).

### 2. Graph Data Structure (`graph.json`)
The building is modeled as a weighted graph matrix:
* **Nodes**: Represent rooms, intersections, stairwells (`stair-core`, `stair-main-void`), and entrances with precise `(x, y)` coordinates matching the SVG.
* **Intra-Floor Edges**: Walkable corridors connecting adjacent nodes with distance weights.
* **Inter-Floor Edges**: Special bidirectional connections bridging stair/elevator nodes from Floor N to Floor N+1 (e.g., `ground_stair-core` to `first_stair-main-void`).

### 3. Dynamic Route Rendering
Instead of pre-drawing paths, the React application dynamically generates `<polyline>` elements over the map's inner SVG context. 
1. The A* Engine resolves the `(x, y)` path.
2. The UI filters nodes per floor.
3. DOM manipulation creates contiguous polylines with `stroke-dasharray` and CSS keyframe animations for a real-time "marching ants" GPS effect.

---

## ⚙️ How It Works (User Flow)

1. **Initialization**: A student scans a QR code mounted on a stairwell. The app loads bypassing the geofence and sets their origin.
2. **Search**: The user opens the bottom sheet and searches for a destination (e.g., "Canteen 018").
3. **Computation**: The system merges the floor graphs, computes the shortest distance, and outputs instructions (e.g., "Take the Main Staircase to the Ground Floor").
4. **Navigation**: The UI drops the bottom sheet, activates the Top HUD, and animates the golden path on the map. The compass arrow actively rotates as the user physically turns their phone.

---

## 🚀 Setup & Local Development

### Prerequisites
- Node.js (v18+)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/JilsJoseph3030/sjcet-nav.git
   cd sjcet-nav/sjcet-nav-app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server (Network exposed for mobile testing):
   ```bash
   npm run dev -- --host
   ```
4. Navigate to `http://localhost:5173` in your browser.

---
*Built for SJCET Palai.*
