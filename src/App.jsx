import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  GraduationCap
} from 'lucide-react';
import FloorMap from './components/FloorMap';
import SearchBar from './components/SearchBar';
import AmenityFilterChips from './components/AmenityFilterChips';
import RoomCard from './components/RoomCard';
import { 
  getRoomDisplayName, 
  getRoomContext, 
  getFilteredAmenities, 
  FLOOR_LABELS 
} from './utils/amenities';

function App() {
  // Initialize state directly from URL query parameters (or defaults)
  const [selectedRoom, setSelectedRoom] = useState(() => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    return params.get('room') || params.get('node') || null;
  });

  const [activeFloor, setActiveFloor] = useState(() => {
    if (typeof window === 'undefined') return 'ground';
    const params = new URLSearchParams(window.location.search);
    const paramFloor = params.get('floor');
    if (paramFloor && ['ground', 'first', 'second', 'third', 'fourth'].includes(paramFloor)) {
      return paramFloor;
    }
    return 'ground';
  });

  const [activeCategory, setActiveCategory] = useState('all');
  const floorMapRef = useRef(null);

  // Clean up any lingering dark class or theme storage
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    try {
      localStorage.removeItem('sjcet_theme');
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Update browser URL query params dynamically when room/floor changes
  useEffect(() => {
    const url = new URL(window.location.href);
    if (selectedRoom) {
      url.searchParams.set('floor', activeFloor);
      url.searchParams.set('room', selectedRoom);
      url.searchParams.delete('node');
    } else {
      url.searchParams.set('floor', activeFloor);
      url.searchParams.delete('room');
      url.searchParams.delete('node');
    }
    window.history.replaceState({}, '', url.toString());
  }, [selectedRoom, activeFloor]);

  // Handle selecting a room from Search, Map, or Category Filter
  const handleSelectRoom = (roomId, targetFloor) => {
    if (targetFloor && targetFloor !== activeFloor) {
      setActiveFloor(targetFloor);
    }
    setSelectedRoom(roomId);
  };

  // Close / clear selected room
  const handleClearSelection = () => {
    setSelectedRoom(null);
  };

  // Focus map on current selected room
  const handleFocusRoom = () => {
    if (floorMapRef.current && selectedRoom) {
      floorMapRef.current.centerOnRoom(selectedRoom);
    }
  };

  const handleSelectCategory = (cat) => {
    setActiveCategory(cat);
    if (cat !== 'all') {
      const result = getFilteredAmenities(cat, activeFloor);
      // If current floor has none, but other floors do, auto-switch to first available floor
      if (result.currentFloorItems.length === 0 && result.otherFloorItems.length > 0) {
        setActiveFloor(result.otherFloorItems[0].floor);
      }
    }
  };

  // Rich context metadata for the currently selected room
  const currentRoomContext = useMemo(() => {
    if (!selectedRoom) return null;
    return getRoomContext(selectedRoom, activeFloor);
  }, [selectedRoom, activeFloor]);

  return (
    <div className="h-[100dvh] w-full bg-sjcet-bg text-gray-900 flex flex-col font-sans relative overflow-hidden select-none">
      
      {/* Compact Top Header & Search Bar */}
      <header className="bg-sjcet-maroon text-white px-3.5 pt-2.5 pb-2 shadow-md border-b border-black/10 z-30 shrink-0">
        <div className="flex items-center space-x-2 mb-2 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-white/15 flex items-center justify-center border border-white/20 shrink-0">
            <GraduationCap className="w-3.5 h-3.5 text-sjcet-gold" />
          </div>
          <div className="flex items-baseline space-x-1.5 min-w-0">
            <h1 className="text-sm font-extrabold tracking-tight leading-none text-white truncate">
              SJCET Locator
            </h1>
            <span className="text-[10px] text-white/70 font-semibold truncate">
              • St. Francis Block
            </span>
          </div>
        </div>

        {/* Unified Search Bar */}
        <SearchBar 
          placeholder="Search room, lab, office (e.g. 204, Seminar)..."
          initialValue={selectedRoom ? getRoomDisplayName(selectedRoom, activeFloor) : ''}
          icon={Search}
          categoryFilter={activeCategory}
          currentFloor={activeFloor}
          onSelect={(id, floor) => handleSelectRoom(id, floor)}
          onClear={handleClearSelection}
        />
      </header>

      {/* Category Quick-Filter Strip */}
      <div className="bg-white border-b border-slate-200/80 px-2.5 py-1 z-20 shadow-xs shrink-0">
        <AmenityFilterChips 
          activeCategory={activeCategory} 
          onSelectCategory={handleSelectCategory} 
        />
      </div>

      {/* Main Map Viewport */}
      <main className="flex-1 w-full bg-slate-100 overflow-hidden relative">
        <FloorMap 
          ref={floorMapRef}
          floor={activeFloor} 
          onRoomSelect={(id, floor) => handleSelectRoom(id, floor)} 
          selectedRoom={selectedRoom}
          activeCategory={activeCategory}
        />

        {/* Current Floor Indicator Pill */}
        <div className="absolute top-3 left-3 z-20 pointer-events-none">
          <div className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-full shadow-md border border-slate-200/80 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-sjcet-maroon animate-pulse"></span>
            <span className="text-xs font-black text-slate-800">
              {FLOOR_LABELS[activeFloor] || activeFloor}
            </span>
          </div>
        </div>

        {/* Floating Vertical Floor Pillar (Natural Right-Thumb Zone) */}
        <div className="absolute right-3.5 top-4 z-20 flex flex-col bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/90 p-1 space-y-1">
          {[
            { key: 'fourth', label: '4F' },
            { key: 'third', label: '3F' },
            { key: 'second', label: '2F' },
            { key: 'first', label: '1F' },
            { key: 'ground', label: '0F' }
          ].map(({ key, label }) => {
            const isActive = activeFloor === key;
            return (
              <button
                key={key}
                onClick={() => {
                  setActiveFloor(key);
                  if (selectedRoom && currentRoomContext?.floor !== key) {
                    setSelectedRoom(null);
                  }
                }}
                className={`w-9 h-8 sm:w-10 sm:h-9 rounded-xl flex items-center justify-center text-xs font-black transition-all cursor-pointer ${
                  isActive
                    ? 'bg-sjcet-maroon text-sjcet-gold shadow-md scale-105 ring-2 ring-sjcet-gold/40'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title={FLOOR_LABELS[key]}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Floating Selected Room Card */}
        {selectedRoom && currentRoomContext && (
          <div className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-4 sm:w-88 z-30">
            <RoomCard 
              roomContext={currentRoomContext}
              onFocus={handleFocusRoom}
              onClose={handleClearSelection}
            />
          </div>
        )}
      </main>

    </div>
  );
}

export default App;
