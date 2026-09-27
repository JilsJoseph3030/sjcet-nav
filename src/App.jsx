import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Info, X, ArrowUpCircle, Map, Search, ArrowDownUp } from 'lucide-react';
import FloorMap from './components/FloorMap';
import SearchBar from './components/SearchBar';
import { computeShortestPath } from './utils/pathfinding';
import { usePDR } from './utils/usePDR';
import { useGeolocation } from './utils/useGeolocation';
import { fetchRoutingGraph } from './utils/supabaseClient';

function App() {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [activeFloor, setActiveFloor] = useState('ground');
  const [isNavigating, setIsNavigating] = useState(false);
  const [sheetExpanded, setSheetExpanded] = useState(true);
  const [currentRoute, setCurrentRoute] = useState(null);
  
  // Phase 4: QR Code & URL State Handling (Anchor injection)
  const [startNode, setStartNode] = useState('entrance');
  const [startFloorAnchor, setStartFloorAnchor] = useState('ground');
  const [navInstructions, setNavInstructions] = useState([]);
  const [graphData, setGraphData] = useState(null);
  
  // Phase 4: Pedestrian Dead Reckoning Sensors
  const { heading, steps, isSupported } = usePDR();

  // Phase 5: Campus Geofencing
  const { isOutside, setIsOutside, openGoogleMaps } = useGeolocation();

  useEffect(() => {
    fetchRoutingGraph().then(data => {
      if (data) {
        setGraphData(data);
      } else {
        console.error("Failed to fetch graph data from Supabase");
      }
    });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paramFloor = params.get('floor');
    const paramNode = params.get('node');
    
    // If they scanned a QR code, they are inside, bypass geofence
    if (paramNode) {
      setStartNode(paramNode);
      setIsOutside(false);
    }

    if (paramFloor && (paramFloor === 'ground' || paramFloor === 'first')) {
      setStartFloorAnchor(paramFloor);
      setActiveFloor(paramFloor);
    }
  }, [setIsOutside]);

  const handleRoomSelect = (roomId) => {
    if (isNavigating) return;
    setSelectedRoom(roomId);
    setSheetExpanded(true);
  };

  const startNavigation = (fromId = startNode, fromFloor = startFloorAnchor, toId = selectedRoom, toFloor = activeFloor) => {
    if (!fromId || !toId || !graphData) return;

    setIsNavigating(true);
    setSheetExpanded(false);
    
    // Phase 2: Compute route utilizing A* Engine + Supabase Data
    const route = computeShortestPath(fromId, fromFloor, toId, toFloor, graphData);
    if (route && route.instructions.length > 0) {
      setNavInstructions(route.instructions);
      setCurrentRoute(route);
    } else {
      setNavInstructions(['Head towards your destination.']);
      setCurrentRoute(null);
    }
  };

  const handleSwap = () => {
    if (!selectedRoom) return; 
    const tempNode = startNode;
    const tempFloor = startFloorAnchor;
    
    setStartNode(selectedRoom);
    setStartFloorAnchor(activeFloor);
    
    setSelectedRoom(tempNode);
    setActiveFloor(tempFloor);

    if (isNavigating) {
      startNavigation(selectedRoom, activeFloor, tempNode, tempFloor);
    }
  };

  const endNavigation = () => {
    setIsNavigating(false);
    setSelectedRoom(null);
    setSheetExpanded(true);
    setNavInstructions([]);
    setCurrentRoute(null);
  };

  const getRoomName = (id, floor) => {
    if (!id || !graphData) return '';
    const node = graphData[floor]?.nodes[id];
    return node ? node.name : id.replace('room-', '').toUpperCase().replace(/-/g, ' ');
  };

  if (!graphData) {
    return (
      <div className="min-h-screen bg-sjcet-bg flex items-center justify-center flex-col p-4 text-center">
        <div className="w-12 h-12 border-4 border-sjcet-gold border-t-sjcet-maroon rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-bold text-gray-800">Loading Building Data...</h2>
        <p className="text-gray-500 mt-2">Connecting to SJCET Spatial Database</p>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] w-full bg-sjcet-bg text-gray-900 flex flex-col font-sans relative overflow-hidden">
      
      {/* Geofence Overlay for outside campus */}
      {isOutside && !isNavigating && (
        <div className="absolute inset-0 z-50 bg-sjcet-bg/95 flex flex-col items-center justify-center p-6 text-center backdrop-blur-sm animate-in fade-in duration-300">
          <MapPin className="w-20 h-20 text-sjcet-maroon mb-6 drop-shadow-md" />
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Outside Building</h2>
          <p className="text-gray-600 mb-10 max-w-sm text-lg leading-relaxed">
            Indoor navigation is unavailable because your GPS shows you are not currently at the St. Francis Block.
          </p>
          <button 
            onClick={openGoogleMaps}
            className="flex items-center justify-center w-full max-w-sm py-4 bg-sjcet-maroon text-sjcet-gold font-bold text-lg rounded-2xl shadow-xl hover:bg-sjcet-maroon-light active:scale-95 transition-all mb-6"
          >
            Navigate to Entrance via Maps
          </button>
          <button 
            onClick={() => setIsOutside(false)}
            className="text-gray-400 hover:text-gray-600 font-bold underline underline-offset-4 active:scale-95 transition-all"
          >
            I'm already here, skip this
          </button>
        </div>
      )}

      {/* Navigation HUD overlay (Sticky Top) */}
      {isNavigating && (
        <div className="absolute top-0 left-0 w-full z-40 bg-sjcet-maroon text-white p-4 pt-6 shadow-xl flex items-center justify-between rounded-b-3xl animate-in slide-in-from-top-4">
          <div className="flex items-center space-x-4">
            <div className="bg-sjcet-gold p-2.5 rounded-full shadow-lg relative flex items-center justify-center">
              <ArrowUpCircle 
                className="w-8 h-8 text-sjcet-maroon transition-transform duration-300" 
                style={{ transform: `rotate(${heading}deg)` }}
              />
            </div>
            <div>
              <p className="text-xl font-bold leading-tight">Head to {getRoomName(selectedRoom, activeFloor)}</p>
              <p className="text-sm text-sjcet-gold font-medium mt-0.5 flex items-center">
                {navInstructions[0] || 'Follow the highlighted path'}
                <span className="ml-2 px-2 py-0.5 bg-black/20 rounded-full text-[10px]">{steps} steps</span>
              </p>
            </div>
          </div>
          <button onClick={endNavigation} className="bg-white/20 p-2.5 rounded-full hover:bg-white/30 active:bg-white/40 transition-colors shadow-sm">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
      )}

      {/* Standard Header (Hidden during navigation) */}
      <div className={`transition-all duration-300 z-20 shrink-0 ${isNavigating ? '-translate-y-full absolute opacity-0' : 'translate-y-0 opacity-100 relative'}`}>
        <header className="bg-sjcet-maroon text-white p-4 shadow-md flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Navigation className="w-5 h-5 text-sjcet-gold" />
            <h1 className="text-lg font-bold tracking-tight">SJCET Indoor Nav</h1>
          </div>
          {/* Mobile Floor Switcher */}
          <div className="flex bg-white/10 rounded-lg overflow-x-auto border border-white/20 text-xs hide-scrollbar max-w-[50%]">
            {['ground', 'first', 'second', 'third', 'fourth'].map((f) => (
              <button 
                key={f}
                onClick={() => setActiveFloor(f)}
                className={`px-3 py-1.5 font-bold transition-colors whitespace-nowrap ${activeFloor === f ? 'bg-sjcet-gold text-sjcet-maroon' : 'text-white hover:bg-white/10'}`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </header>
      </div>

      {/* Map Container */}
      <div className="flex-1 w-full bg-gray-100 overflow-hidden relative">
        <FloorMap 
          floor={activeFloor} 
          onRoomSelect={handleRoomSelect} 
          selectedRoom={selectedRoom}
          isNavigating={isNavigating}
          currentRoute={currentRoute}
        />
        
        {/* QR Anchor Debug Badge */}
        {!isNavigating && startNode !== 'entrance' && (
          <div className="absolute top-4 left-4 z-20 bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-xs font-bold flex items-center border border-green-300 shadow-md">
            <Map className="w-3.5 h-3.5 mr-1" />
            Start: {startNode.replace('stair-', 'Stair ').toUpperCase()}
          </div>
        )}
      </div>

      {/* Bottom Sheet UI */}
      <div className={`absolute bottom-0 left-0 w-full bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.15)] rounded-t-3xl z-30 transition-transform duration-500 ease-out flex flex-col ${isNavigating ? 'translate-y-[82%]' : (sheetExpanded ? 'translate-y-0' : 'translate-y-[70%]')}`}>
        
        {/* Drag Handle */}
        <div className="w-full pt-4 pb-2 flex justify-center cursor-pointer active:bg-gray-50 rounded-t-3xl transition-colors" onClick={() => !isNavigating && setSheetExpanded(!sheetExpanded)}>
          <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
        </div>

        <div className="px-6 pb-8 pt-2 flex flex-col max-h-[55vh] overflow-y-visible">
          {!isNavigating && (
            <div className="relative flex flex-col mb-4">
              <SearchBar 
                placeholder="Choose starting point..."
                initialValue={startNode ? getRoomName(startNode, startFloorAnchor) : ''}
                icon={MapPin}
                graphData={graphData}
                onSelect={(id, floor) => {
                  setStartNode(id);
                  setStartFloorAnchor(floor);
                }}
              />
              
              <div className="absolute left-[26px] top-[50%] -translate-y-[50%] h-6 w-0.5 bg-gray-300 z-0"></div>
              
              <button 
                onClick={handleSwap}
                className="absolute right-4 top-[50%] -translate-y-[50%] z-10 p-2 bg-white rounded-full shadow border border-gray-100 hover:bg-gray-50 active:scale-95 transition-all text-sjcet-maroon"
              >
                <ArrowDownUp className="w-4 h-4" />
              </button>
              
              <SearchBar 
                placeholder="Choose destination..."
                initialValue={selectedRoom ? getRoomName(selectedRoom, activeFloor) : ''}
                icon={Search}
                graphData={graphData}
                onSelect={(id, floor) => {
                  setActiveFloor(floor);
                  setSelectedRoom(id);
                }}
                onClear={() => setSelectedRoom(null)}
              />
            </div>
          )}

          {selectedRoom ? (
            <div className="animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Route Summary</p>
                {isNavigating && (
                   <span className="text-xs bg-green-100 text-green-700 font-bold px-2.5 py-1 rounded-full animate-pulse border border-green-200">Navigating</span>
                )}
              </div>
              <p className="text-2xl font-extrabold text-gray-800 drop-shadow-sm mb-4">{getRoomName(selectedRoom, activeFloor)}</p>
              
              {!isNavigating && (
                <div className="mb-6 bg-yellow-50 border-l-4 border-sjcet-gold text-yellow-900 p-4 rounded-r-xl text-sm flex items-start shadow-sm">
                  <Info className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-sjcet-gold" />
                  <div className="leading-relaxed flex flex-col">
                    <p>Route will be mapped from <strong>{getRoomName(startNode, startFloorAnchor)}</strong> to <strong>{getRoomName(selectedRoom, activeFloor)}</strong>.</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">
              <MapPin className="w-12 h-12 mx-auto text-gray-200 mb-3" />
              <p className="font-medium text-sm text-gray-500">Tap any room on the map above to select your destination</p>
            </div>
          )}

          {!isNavigating && (
             <button 
               onClick={() => startNavigation()}
               disabled={!selectedRoom || !startNode}
               className={`w-full py-4 rounded-2xl font-bold text-lg shadow-xl transition-all duration-300 transform ${
                 (selectedRoom && startNode) 
                   ? 'bg-sjcet-maroon text-sjcet-gold hover:bg-sjcet-maroon-light active:scale-95 shadow-sjcet-maroon/30' 
                   : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
               }`}
             >
               {(selectedRoom && startNode) ? 'Start Navigation' : 'Select Locations'}
             </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
