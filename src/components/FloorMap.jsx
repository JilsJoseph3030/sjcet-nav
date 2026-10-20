import React, { useEffect, useRef, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { ZoomIn, ZoomOut, Compass, MapPin } from 'lucide-react';
import groundFloorUrl from '../assets/ground_floor.svg?raw';
import firstFloorUrl from '../assets/first_floor.svg?raw';
import secondFloorUrl from '../assets/second_floor.svg?raw';
import thirdFloorUrl from '../assets/third_floor.svg?raw';
import fourthFloorUrl from '../assets/fourth_floor.svg?raw';
import { resolveNodeId, findRoom, matchCategory } from '../utils/amenities';

const maps = {
  ground: groundFloorUrl,
  first: firstFloorUrl,
  second: secondFloorUrl,
  third: thirdFloorUrl,
  fourth: fourthFloorUrl
};

const FloorMap = forwardRef(function FloorMap({ 
  floor, 
  onRoomSelect, 
  selectedRoom, 
  activeCategory = 'all'
}, ref) {
  const svgContainerRef = useRef(null);
  const transformComponentRef = useRef(null);
  const [hoveredRoom, setHoveredRoom] = useState(null);
  const mapContent = maps[floor] || groundFloorUrl;

  // Center and zoom to a specific room element
  const centerOnRoom = useCallback((roomId) => {
    if (!svgContainerRef.current || !transformComponentRef.current) return;
    const svgDoc = svgContainerRef.current.querySelector('svg');
    if (!svgDoc) return;

    const targetId = roomId || selectedRoom;
    if (!targetId) return;

    const rooms = svgDoc.querySelectorAll('[id^="room-"], [id^="lift-"], [id^="stairs-"]');
    let targetEl = null;

    rooms.forEach(el => {
      const resolved = resolveNodeId(el.id, floor);
      if (resolved === targetId || el.id === targetId) {
        targetEl = el;
      }
    });

    if (targetEl && transformComponentRef.current) {
      try {
        if (typeof transformComponentRef.current.zoomToElement === 'function') {
          transformComponentRef.current.zoomToElement(targetEl, 1.6, 400);
        }
      } catch (err) {
        console.warn("Auto-zoom to room failed gracefully:", err);
      }
    }
  }, [floor, selectedRoom]);

  // Expose centerOnRoom to parent component via ref
  useImperativeHandle(ref, () => ({
    centerOnRoom,
    resetView: () => transformComponentRef.current?.resetTransform()
  }), [centerOnRoom]);

  // Handle room clicks and hover tooltips
  useEffect(() => {
    if (!svgContainerRef.current) return;
    const svgDoc = svgContainerRef.current.querySelector('svg');
    if (!svgDoc) return;

    const handleClick = (e) => {
      let target = e.target;
      while (target && target !== svgDoc) {
        if (target.id && (target.id.startsWith('room-') || target.id.startsWith('lift-') || target.id.startsWith('stairs-'))) {
          const resolvedId = resolveNodeId(target.id, floor);
          onRoomSelect(resolvedId, floor);
          break;
        }
        target = target.parentElement;
      }
    };

    const handlePointerOver = (e) => {
      let target = e.target;
      while (target && target !== svgDoc) {
        if (target.id && (target.id.startsWith('room-') || target.id.startsWith('lift-') || target.id.startsWith('stairs-'))) {
          const resolvedId = resolveNodeId(target.id, floor);
          const roomObj = findRoom(resolvedId, floor);
          const roomTitle = target.querySelector('title')?.textContent || roomObj?.name || target.getAttribute('data-name');
          if (roomTitle) {
            setHoveredRoom({ name: roomTitle, id: resolvedId });
          }
          break;
        }
        target = target.parentElement;
      }
    };

    const handlePointerOut = (e) => {
      let target = e.target;
      if (target.id && (target.id.startsWith('room-') || target.id.startsWith('lift-') || target.id.startsWith('stairs-'))) {
        setHoveredRoom(null);
      }
    };

    svgDoc.addEventListener('click', handleClick);
    svgDoc.addEventListener('mouseover', handlePointerOver);
    svgDoc.addEventListener('mouseout', handlePointerOut);

    return () => {
      svgDoc.removeEventListener('click', handleClick);
      svgDoc.removeEventListener('mouseover', handlePointerOver);
      svgDoc.removeEventListener('mouseout', handlePointerOut);
    };
  }, [onRoomSelect, floor]);

  // Highlight rooms matching active amenity category directly on the map
  useEffect(() => {
    if (!svgContainerRef.current) return;
    const svgDoc = svgContainerRef.current.querySelector('svg');
    if (!svgDoc) return;

    const oldMarkers = svgDoc.querySelectorAll('.amenity-marker-pin');
    oldMarkers.forEach(m => m.remove());

    const rooms = svgDoc.querySelectorAll('[id^="room-"], [id^="lift-"], [id^="stairs-"]');
    rooms.forEach(room => {
      const resolvedId = resolveNodeId(room.id, floor);
      const roomObj = findRoom(resolvedId, floor);
      const isSelected = resolvedId === selectedRoom || room.id === selectedRoom;

      if (!isSelected) {
        if (activeCategory && activeCategory !== 'all' && roomObj && matchCategory(roomObj.category, activeCategory)) {
          room.classList.add('amenity-highlight');

          try {
            const bbox = room.getBBox();
            if (bbox && bbox.width > 0 && bbox.height > 0) {
              const centerX = bbox.x + bbox.width / 2;
              const centerY = bbox.y + bbox.height / 2;

              const pin = document.createElementNS("http://www.w3.org/2000/svg", "g");
              pin.setAttribute("class", "amenity-marker-pin");
              pin.setAttribute("transform", `translate(${centerX}, ${centerY})`);
              pin.style.cursor = "pointer";
              pin.onclick = (e) => {
                e.stopPropagation();
                onRoomSelect(resolvedId, floor);
              };

              pin.innerHTML = `
                <circle r="14" fill="#c5a059" fill-opacity="0.35" class="amenity-pulse-badge" />
                <circle r="7" fill="#800000" stroke="#c5a059" stroke-width="2" />
                <circle r="2.5" fill="#ffffff" />
              `;
              svgDoc.appendChild(pin);
            }
          } catch {
            // Geometry calculation fallback
          }
        } else {
          room.classList.remove('amenity-highlight');
        }
      }
    });
  }, [activeCategory, floor, selectedRoom, onRoomSelect]);

  // Style selected rooms and attach animated pulsing target marker
  useEffect(() => {
    if (!svgContainerRef.current) return;
    const svgDoc = svgContainerRef.current.querySelector('svg');
    if (!svgDoc) return;

    // Remove any previous animated destination pin
    const existingPin = svgDoc.querySelector('.destination-pin-overlay');
    if (existingPin) existingPin.remove();

    let targetElement = null;

    const rooms = svgDoc.querySelectorAll('[id^="room-"], [id^="lift-"], [id^="stairs-"]');
    rooms.forEach(room => {
      const resolvedId = resolveNodeId(room.id, floor);
      const isSelected = resolvedId === selectedRoom || room.id === selectedRoom;

      if (isSelected) {
        targetElement = room;
        room.classList.remove('amenity-highlight');
        room.style.fill = '#c5a059'; 
        room.style.stroke = '#800000';
        room.style.strokeWidth = '3.5px';
        room.classList.add('navigating-glow');

        // Attach interactive pulsing pin directly onto the room geometry center
        try {
          const bbox = room.getBBox();
          const centerX = bbox.x + bbox.width / 2;
          const centerY = bbox.y + bbox.height / 2;

          const pinG = document.createElementNS("http://www.w3.org/2000/svg", "g");
          pinG.setAttribute("class", "destination-pin-overlay");
          pinG.setAttribute("transform", `translate(${centerX}, ${centerY})`);
          pinG.style.pointerEvents = 'none';

          pinG.innerHTML = `
            <circle r="26" fill="#800000" fill-opacity="0.35" class="user-pulse-marker" />
            <circle r="14" fill="#800000" stroke="#FFFFFF" stroke-width="2.5" />
            <circle r="5" fill="#c5a059" />
          `;
          svgDoc.appendChild(pinG);
        } catch {
          // BBox calculation fallback
        }

      } else {
        room.style.fill = ''; 
        room.style.stroke = '';
        room.style.strokeWidth = '';
        room.classList.remove('navigating-glow');
      }
    });

    // Auto-focus on selected room with a subtle delay to ensure rendering
    if (targetElement && transformComponentRef.current) {
      const timer = setTimeout(() => {
        try {
          if (typeof transformComponentRef.current?.zoomToElement === 'function') {
            transformComponentRef.current.zoomToElement(targetElement, 1.5, 350);
          }
        } catch {
          // Fallback if zoomToElement encounters bounds issues
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [selectedRoom, floor]);

  return (
    <div className="w-full h-full map-canvas-grid flex items-center justify-center overflow-hidden touch-none relative select-none">
      <TransformWrapper
        ref={transformComponentRef}
        initialScale={1}
        minScale={0.4}
        maxScale={4}
        centerOnInit={true}
        wheel={{ step: 0.1 }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            {/* Live Hover Room Badge / Tooltip */}
            {hoveredRoom && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 bg-white/95 dark:bg-dark-card/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 flex items-center space-x-2 animate-in fade-in slide-in-from-top-1">
                <MapPin className="w-3.5 h-3.5 text-sjcet-maroon dark:text-sjcet-cyan animate-bounce" />
                <span className="text-xs font-bold text-slate-800 dark:text-gray-100">{hoveredRoom.name}</span>
                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold px-2 py-0.5 rounded-full">Tap to View</span>
              </div>
            )}

            {/* Floating Zoom & Reset Map Controls (Positioned cleanly on top-left under the floor badge) */}
            <div className="absolute left-3.5 top-12 z-20 flex flex-col bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200/90 p-1 space-y-1">
              <button
                onClick={() => zoomIn(0.3)}
                aria-label="Zoom in"
                className="w-8 h-8 flex items-center justify-center text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all active:scale-95 cursor-pointer"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <div className="h-[1px] bg-slate-200 mx-1"></div>
              <button
                onClick={() => zoomOut(0.3)}
                aria-label="Zoom out"
                className="w-8 h-8 flex items-center justify-center text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all active:scale-95 cursor-pointer"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <div className="h-[1px] bg-slate-200 mx-1"></div>
              <button
                onClick={() => resetTransform()}
                aria-label="Reset Map View"
                title="Reset Map View"
                className="w-8 h-8 flex items-center justify-center text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all active:scale-95 cursor-pointer"
              >
                <Compass className="w-4 h-4 text-sjcet-maroon" />
              </button>
            </div>

            {/* Interactive Transform Viewport */}
            <TransformComponent
              wrapperStyle={{ width: "100%", height: "100%", overflow: "hidden" }}
              contentStyle={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <div 
                ref={svgContainerRef} 
                dangerouslySetInnerHTML={{ __html: mapContent }} 
                className="w-full h-full flex items-center justify-center p-2 sm:p-6 modern-map-svg [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-4xl [&>svg]:max-h-[85vh] [&>svg]:transition-transform"
              />
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
});

export default FloorMap;
