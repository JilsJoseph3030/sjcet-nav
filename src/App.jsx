import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Navigation, 
  Info, 
  Search, 
  ArrowDownUp, 
  QrCode, 
  Accessibility, 
  Footprints, 
  Sparkles,
  Layers,
  Volume2
} from 'lucide-react';
import FloorMap from './components/FloorMap';
import SearchBar from './components/SearchBar';
import NavigationHUD from './components/NavigationHUD';
import AmenityFilterChips from './components/AmenityFilterChips';
import QRScannerModal from './components/QRScannerModal';
import { computeShortestPath } from './utils/pathfinding';
import { usePDR } from './utils/usePDR';
import { useGeolocation } from './utils/useGeolocation';
import graphData from './utils/graph.json';

function App() {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [activeFloor, setActiveFloor] = useState('ground');
  const [isNavigating, setIsNavigating] = useState(false);
  const [sheetExpanded, setSheetExpanded] = useState(true);
  const [currentRoute, setCurrentRoute] = useState(null);
  
  // Accessible Mode (Step-Free / Elevator-Only)
  const [isAccessible, setIsAccessible] = useState(false);

  // Points of Interest / Amenity Filter
  const [activeCategory, setActiveCategory] = useState('all');

  // Voice & Turn-by-Turn Guidance
  const [isMuted, setIsMuted] = useState(false);

  // QR Code Real-Time Calibration Modal
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);

  // Navigation Anchors
  const [startNode, setStartNode] = useState('entrance');
  const [startFloorAnchor, setStartFloorAnchor] = useState('ground');
  
  // Pedestrian Dead Reckoning Sensors
  const { heading, steps } = usePDR();

  // Campus Geofencing
  const { isOutside, setIsOutside, openGoogleMaps } = useGeolocation();

  // Speech Synthesis ref to avoid overlapping speech
  const synthRef = useRef(window.speechSynthesis);

  const speakInstruction = (text) => {
    if (isMuted || !synthRef.current) return;
    try {
      synthRef.current.cancel(); // Cancel any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      synthRef.current.speak(utterance);
    } catch (err) {
      console.warn("Speech synthesis error:", err);
    }
  };

  // Parse QR codes or deep links from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paramFloor = params.get('floor');
    const paramNode = params.get('node');
    
    if (paramNode) {
      setStartNode(paramNode);
      setIsOutside(false);
    }

    if (paramFloor && ['ground', 'first', 'second', 'third', 'fourth'].includes(paramFloor)) {
      setStartFloorAnchor(paramFloor);
      setActiveFloor(paramFloor);
    }
  }, [setIsOutside]);

  // Recalculate route whenever isAccessible changes during navigation
  useEffect(() => {
    if (isNavigating && selectedRoom && startNode && graphData) {
      const route = computeShortestPath(startNode, startFloorAnchor, selectedRoom, activeFloor, graphData, {
        isAccessible
      });
      setCurrentRoute(route);
      if (route?.detailedSteps?.[0]?.text) {
        speakInstruction(route.detailedSteps[0].text);
      }
    }
  }, [isAccessible]);

  const handleRoomSelect = (roomId) => {
    if (isNavigating) return;
    setSelectedRoom(roomId);
    setSheetExpanded(true);
  };

  const [routeError, setRouteError] = useState(null);

  const startNavigation = (fromId = startNode, fromFloor = startFloorAnchor, toId = selectedRoom, toFloor = activeFloor) => {
    if (!fromId || !toId || !graphData) {
      setRouteError("Please choose both a start and destination location.");
      return;
    }

    setRouteError(null);
    
    // SJCET A* Engine with Accessibility options
    const route = computeShortestPath(fromId, fromFloor, toId, toFloor, graphData, {
      isAccessible
    });

    if (route && route.pathNodes && route.pathNodes.length > 0) {
      setIsNavigating(true);
      setSheetExpanded(false);
      setCurrentRoute(route);
      if (route.detailedSteps?.[0]?.text) {
        speakInstruction(`Starting route to ${getRoomName(toId, toFloor)}. ${route.detailedSteps[0].text}`);
      }
    } else {
      setIsNavigating(false);
      const errMsg = route?.instructions?.[0] || (isAccessible 
        ? "No step-free / elevator route available to this location." 
        : "No walkable path found between these two locations.");
      setRouteError(errMsg);
      speakInstruction(errMsg);
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
    setCurrentRoute(null);
    if (synthRef.current) synthRef.current.cancel();
  };

  const getRoomName = (id, floor) => {
    if (!id || !graphData) return '';
    const node = graphData[floor]?.nodes[id];
    return node ? node.name : id.replace('room-', '').toUpperCase().replace(/-/g, ' ');
  };

  const handleQRCalibrate = ({ floor, node }) => {
    setStartFloorAnchor(floor);
    setActiveFloor(floor);
    setStartNode(node);
    setIsQRScannerOpen(false);
    setIsOutside(false);
    speakInstruction(`Calibrated location to ${getRoomName(node, floor)} on ${floor} floor.`);
  };

  return (
    <div className="h-[100dvh] w-full bg-sjcet-bg text-gray-900 flex flex-col font-sans relative overflow-hidden select-none">
      
      {/* Geofence Overlay for outside campus */}
      {isOutside && !isNavigating && (
        <div className="absolute inset-0 z-50 bg-sjcet-bg/95 flex flex-col items-center justify-center p-6 text-center backdrop-blur-sm animate-in fade-in duration-300">
          <MapPin className="w-20 h-20 text-sjcet-maroon mb-6 drop-shadow-md" />
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Outside St. Francis Block</h2>
          <p className="text-gray-600 mb-8 max-w-sm text-base leading-relaxed">
            Indoor navigation is active inside St. Francis Block. You can calibrate inside or view directions to the entrance.
          </p>
          <button 
            onClick={openGoogleMaps}
            className="flex items-center justify-center w-full max-w-sm py-4 bg-sjcet-maroon text-sjcet-gold font-bold text-lg rounded-2xl shadow-xl hover:bg-sjcet-maroon-light active:scale-95 transition-all mb-4"
          >
            Navigate to Entrance via Maps
          </button>
          <button 
            onClick={() => setIsOutside(false)}
            className="text-gray-500 hover:text-gray-700 font-bold underline underline-offset-4 active:scale-95 transition-all text-sm"
          >
            I'm already inside, calibrate now
          </button>
        </div>
      )}

      {/* SJCET Indoor Navigation HUD (Active Navigation) */}
      {isNavigating && (
        <NavigationHUD 
          route={currentRoute}
          destinationName={getRoomName(selectedRoom, activeFloor)}
          onClose={endNavigation}
          isAccessible={isAccessible}
          heading={heading}
          steps={steps}
          isMuted={isMuted}
          onSpeechToggle={() => {
            setIsMuted(!isMuted);
            if (!isMuted && synthRef.current) synthRef.current.cancel();
          }}
        />
      )}

      {/* Standard Header (Hidden during navigation) */}
      <div className={`transition-all duration-300 z-20 shrink-0 ${isNavigating ? '-translate-y-full absolute opacity-0' : 'translate-y-0 opacity-100 relative'}`}>
        <header className="bg-sjcet-maroon text-white p-3.5 px-4 shadow-md flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Navigation className="w-5 h-5 text-sjcet-gold" />
            <div>
              <h1 className="text-base font-extrabold tracking-tight leading-none">SJCET Indoor Nav</h1>
              <span className="text-[10px] text-white/70 font-medium">St. Francis Block</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Quick QR Calibration Scanner Button */}
            <button
              onClick={() => setIsQRScannerOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-bold transition-all active:scale-95 border border-white/20"
              title="Scan QR Code Checkpoint"
            >
              <QrCode className="w-3.5 h-3.5 text-sjcet-gold" />
              <span>Scan QR</span>
            </button>

            {/* Mobile Floor Switcher */}
            <div className="flex bg-white/10 rounded-xl p-0.5 border border-white/20 text-xs">
              {['ground', 'first', 'second', 'third', 'fourth'].map((f) => (
                <button 
                  key={f}
                  onClick={() => setActiveFloor(f)}
                  className={`px-2.5 py-1 font-bold rounded-lg transition-colors whitespace-nowrap text-xs ${
                    activeFloor === f ? 'bg-sjcet-gold text-sjcet-maroon shadow-sm' : 'text-white hover:bg-white/10'
                  }`}
                >
                  {f === 'ground' ? '0F' : `${f.charAt(0).toUpperCase()}F`}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Amenity Category Filter Bar (Phase 3) */}
        <div className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-3 shadow-xs">
          <AmenityFilterChips 
            activeCategory={activeCategory} 
            onSelectCategory={(cat) => setActiveCategory(cat)} 
          />
        </div>
      </div>

      {/* Map Viewport Container */}
      <div className="flex-1 w-full bg-gray-100 overflow-hidden relative">
        <FloorMap 
          floor={activeFloor} 
          onRoomSelect={handleRoomSelect} 
          selectedRoom={selectedRoom}
          isNavigating={isNavigating}
          currentRoute={currentRoute}
          graphData={graphData}
        />
        
        {/* Active Start Point Badge */}
        {!isNavigating && (
          <div className="absolute top-4 left-4 z-20 flex items-center space-x-2">
            <div className="bg-white/95 backdrop-blur-md text-slate-800 px-3 py-1.5 rounded-full text-xs font-bold flex items-center border border-slate-200 shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
              <span>Start: <strong>{getRoomName(startNode, startFloorAnchor)}</strong></span>
            </div>
          </div>
        )}
      </div>

      {/* SJCET Navigation Bottom Sheet Drawer */}
      <div className={`absolute bottom-0 left-0 w-full bg-white shadow-[0_-12px_45px_rgba(0,0,0,0.18)] rounded-t-3xl z-30 transition-transform duration-500 ease-out flex flex-col ${
        isNavigating ? 'translate-y-[82%]' : (sheetExpanded ? 'translate-y-0' : 'translate-y-[70%]')
      }`}>
        
        {/* Drag Handle */}
        <div 
          className="w-full pt-3 pb-1 flex justify-center cursor-pointer active:bg-slate-50 rounded-t-3xl transition-colors" 
          onClick={() => !isNavigating && setSheetExpanded(!sheetExpanded)}
        >
          <div className="w-12 h-1 bg-slate-300 rounded-full"></div>
        </div>

        <div className="px-5 pb-7 pt-1 flex flex-col max-h-[58vh] overflow-y-visible">
          
          {!isNavigating && (
            <>
              {/* Route Accessibility Toggle (Phase 1) */}
              <div className="flex items-center justify-between mb-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80">
                <div className="flex items-center space-x-2">
                  <div className={`p-1.5 rounded-xl ${isAccessible ? 'bg-sjcet-maroon text-sjcet-gold' : 'bg-slate-200 text-slate-600'}`}>
                    <Accessibility className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Accessible / Step-Free</p>
                    <p className="text-[10px] text-slate-500">Route via elevators only, avoid stairs</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAccessible(!isAccessible)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    isAccessible ? 'bg-sjcet-maroon' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      isAccessible ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Start & Destination Selectors */}
              <div className="relative flex flex-col mb-3 space-y-2">
                <SearchBar 
                  placeholder="Starting point..."
                  initialValue={startNode ? getRoomName(startNode, startFloorAnchor) : ''}
                  icon={MapPin}
                  graphData={graphData}
                  onSelect={(id, floor) => {
                    setStartNode(id);
                    setStartFloorAnchor(floor);
                  }}
                />
                
                <div className="absolute left-[24px] top-[48%] -translate-y-[50%] h-5 w-0.5 bg-slate-300 z-0"></div>
                
                <button 
                  onClick={handleSwap}
                  className="absolute right-3.5 top-[48%] -translate-y-[50%] z-10 p-2 bg-white rounded-full shadow-md border border-slate-200 hover:bg-slate-50 active:scale-95 transition-all text-sjcet-maroon"
                  title="Swap Starting point and Destination"
                >
                  <ArrowDownUp className="w-4 h-4" />
                </button>
                
                <SearchBar 
                  placeholder="Where to? (e.g. Prayer Hall, Canteen, 108)"
                  initialValue={selectedRoom ? getRoomName(selectedRoom, activeFloor) : ''}
                  icon={Search}
                  graphData={graphData}
                  categoryFilter={activeCategory}
                  onSelect={(id, floor) => {
                    setActiveFloor(floor);
                    setSelectedRoom(id);
                  }}
                  onClear={() => setSelectedRoom(null)}
                />
              </div>
            </>
          )}

          {/* Selected Destination Summary Card */}
          {selectedRoom ? (
            <div className="animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Destination</span>
                <span className="text-xs font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                  {activeFloor === 'ground' ? 'Ground Floor' : `${activeFloor.charAt(0).toUpperCase() + activeFloor.slice(1)} Floor`}
                </span>
              </div>
              
              <h2 className="text-2xl font-black text-slate-900 mb-3">{getRoomName(selectedRoom, activeFloor)}</h2>
              
              {!isNavigating && (
                <div className="mb-4 bg-slate-50 border border-slate-200 text-slate-700 p-3.5 rounded-2xl text-xs flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Footprints className="w-4 h-4 text-sjcet-gold" />
                    <span>Route calculated from <strong>{getRoomName(startNode, startFloorAnchor)}</strong></span>
                  </div>
                  {isAccessible && (
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[10px]">
                      Elevator Route
                    </span>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-slate-400 py-4">
              <p className="font-semibold text-xs text-slate-500">
                Tap any room on the vector map or choose an amenity filter above
              </p>
            </div>
          )}

          {/* Route Calculation Error Notification */}
          {routeError && (
            <div className="mb-3 p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center justify-between border border-red-200 animate-in fade-in duration-200">
              <div className="flex items-center space-x-2">
                <Info className="w-4 h-4 shrink-0 text-red-500" />
                <span className="font-semibold">{routeError}</span>
              </div>
              <button 
                onClick={() => setRouteError(null)}
                className="text-red-400 hover:text-red-600 font-bold ml-2 text-sm"
              >
                ×
              </button>
            </div>
          )}

          {/* Start Navigation Action Button */}
          {!isNavigating && (
            <button 
              onClick={() => startNavigation()}
              disabled={!selectedRoom || !startNode}
              className={`w-full py-4 rounded-2xl font-extrabold text-base shadow-xl transition-all duration-300 transform flex items-center justify-center space-x-2 ${
                (selectedRoom && startNode) 
                  ? 'bg-sjcet-maroon text-sjcet-gold hover:bg-sjcet-maroon-light active:scale-95 shadow-sjcet-maroon/25 cursor-pointer' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              <Navigation className="w-5 h-5" />
              <span>{(selectedRoom && startNode) ? 'Start Navigation' : 'Select Destination'}</span>
            </button>
          )}

        </div>
      </div>

      {/* QR Scanner Modal (Phase 5) */}
      <QRScannerModal 
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        onScanSuccess={handleQRCalibrate}
      />

    </div>
  );
}

export default App;
