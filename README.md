# SJCET Palai — Campus Room Locator & Interactive Floor Directory

A fast, lightweight, and intuitive campus floor directory and room locator designed for the **St. Francis Block** at **St. Joseph's College of Engineering and Technology, Palai (SJCET)**.

---

## 🎯 Design Philosophy & Practical Approach

In a structured college campus, students, faculty, and visitors do not walk around following complex turn-by-turn GPS instructions or step counters. What users actually need is simple, instant, and frictionless:

> **"Where is this room?"**
> 
> Select or search for a destination (e.g., *Civil Seminar Hall 012*, *Placement Cell*, *HOD Office*), and the app immediately switches to the correct floor layout, centers the view, and visually highlights the exact room location.

---

## 🌟 Key Features

* **Instant Room & Facility Search**: Quick autocomplete search for lecture halls, laboratories, faculty cabins, seminar halls, restrooms, and administrative offices.
* **Automatic Floor Navigation**: Selecting any destination automatically switches the view to the corresponding floor (Ground, 1st, 2nd, 3rd, or 4th Floor).
* **Target Room Highlighting**: Selected rooms are visually highlighted with distinctive colors and focal framing, making them immediately recognizable on the floor plan.
* **Interactive SVG Vector Maps**: Crisp, scalable vector layouts for all floors of the St. Francis Block with smooth touch-based pinch-to-zoom and pan controls (`react-zoom-pan-pinch`).
* **Category & Amenity Quick-Filters**: One-tap filter chips to quickly discover key campus facilities:
  * Restrooms & Accessible washrooms
  * Seminar Halls & Auditoriums
  * Department Labs & Lecture Rooms
  * Canteen, Medicare, and Student Amenities
  * Administrative & Placement Offices
* **Direct Deep Linking & QR Room Lookup**: Direct URLs (e.g., `?floor=ground&room=room-009`) open directly to the target room and floor, ideal for physical door signs or event invites.
* **SJCET Institutional Identity**: Designed with college brand aesthetics — Deep Maroon (`#800000`), Amber Gold accents (`#c5a059`), and clean modern typography.

---

## 🏗️ System Architecture

### Technology Stack
* **Frontend Framework**: React.js (Vite) configured as a zero-install Progressive Web App (PWA).
* **Styling**: Tailwind CSS tailored to SJCET official colors.
* **Data Layer**: Modular, human-readable JavaScript room files organized under `src/data/francis_block/` (`groundFloor.js`, `firstFloor.js`, etc.) making it effortless to rename rooms, reassign categories, or add facilities.
* **Hosting**: Static PWA deployment on Vercel / GitHub Pages.

### Floor Coverage (St. Francis Block)
* **Ground Floor (`0xx`)**: Manager's Room, Placement Cell, Medicare Health Center, Canteen, St. Francis Auditorium, Prayer Hall, Seminar Halls.
* **First Floor (`1xx`)**: Department offices, classrooms, tutorial rooms, computer labs.
* **Second Floor (`2xx`)**: Faculty rooms, lecture halls, departmental labs.
* **Third Floor (`3xx`)**: Advanced laboratories, department libraries, project labs.
* **Fourth Floor (`4xx`)**: Higher semester classrooms, seminar spaces, specialized facilities.

---

## 📱 User Workflow

1. **Search or Browse**: Type the room name/number into the search bar, or tap an amenity filter (e.g., "Seminar Halls").
2. **Auto-Switch Floor**: The app transitions directly to the relevant floor plan (e.g., Ground Floor).
3. **Pinpoint Location**: The target room is highlighted, giving the user immediate spatial awareness of where it is situated relative to stairs, lifts, and entrances.

---

## 🚀 Setup & Local Development

### Prerequisites
* Node.js (v18+)
* npm

### Installation
1. Navigate to the project directory:
   ```bash
   cd sjcet-nav-app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start local development server:
   ```bash
   npm run dev -- --host
   ```
4. Open the displayed local or network URL (e.g., `http://localhost:5173`) in your browser or mobile phone.

---

## 🧪 Testing Policy
* **Manual Testing Only**: AI agents must **NOT** run automated browser subagents, headless tests, or URL-reading tools. All testing and verification is performed manually by the user.

---

*St. Joseph's College of Engineering and Technology, Palai (SJCET)*
