import React, { useEffect, useRef, useState } from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { ZoomIn, ZoomOut, Compass, MapPin } from 'lucide-react';
import groundFloorUrl from '../assets/ground_floor.svg?raw';
import firstFloorUrl from '../assets/first_floor.svg?raw';
import secondFloorUrl from '../assets/second_floor.svg?raw';
import thirdFloorUrl from '../assets/third_floor.svg?raw';
import fourthFloorUrl from '../assets/fourth_floor.svg?raw';
import { resolveNodeId, matchCategory } from '../utils/amenities';

const maps = {
  ground: groundFloorUrl,
  first: firstFloorUrl,
  second: secondFloorUrl,
  third: thirdFloorUrl,
  fourth: fourthFloorUrl
};

export default function FloorMap({ 
  floor, 
  onRoomSelect, 
  selectedRoom, 
  isNavigating, 
  currentRoute, 
  graphData,
  activeCategory = 'all'
}) {
  const svgContainerRef = useRef(null);
  const transformComponentRef = useRef(null);
  const [hoveredRoom, setHoveredRoom] = useState(null);
  const mapContent = maps[floor] || groundFloorUrl;

  // Handle room clicks and hover tooltips
  useEffect(() => {
    if (!svgContainerRef.current) return;
    const svgDoc = svgContainerRef.current.querySelector('svg');
    if (!svgDoc) return;

    const handleClick = (e) => {
      let target = e.target;
      while (target && target !== svgDoc) {
        if (target.id && (target.id.startsWith('room-') || target.id.startsWith('lift-') || target.id.startsWith('stairs-'))) {
          const resolvedId = resolveNodeId(target.id, floor, graphData);
          onRoomSelect(resolvedId);
          break;
        }
        target = target.parentElement;
      }
    };

    const handlePointerOver = (e) => {
      let target = e.target;
      while (target && target !== svgDoc) {
        if (target.id && (target.id.startsWith('room-') || target.id.startsWith('lift-') || target.id.startsWith('stairs-'))) {
          const resolvedId = resolveNodeId(target.id, floor, graphData);
          const node = graphData?.[floor]?.nodes?.[resolvedId];
          const roomTitle = target.querySelector('title')?.textContent || node?.name || target.getAttribute('data-name');
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
  }, [onRoomSelect, floor, graphData]);

  // Highlight rooms matching active amenity category directly on the map
  useEffect(() => {
    if (!svgContainerRef.current) return;
    const svgDoc = svgContainerRef.current.querySelector('svg');
    if (!svgDoc) return;

    // Remove any previous amenity markers
    const oldMarkers = svgDoc.querySelectorAll('.amenity-marker-pin');
    oldMarkers.forEach(m => m.remove());

    const rooms = svgDoc.querySelectorAll('[id^="room-"], [id^="lift-"]');
    rooms.forEach(room => {
      const resolvedId = resolveNodeId(room.id, floor, graphData);
      const node = graphData?.[floor]?.nodes?.[resolvedId];
      const isSelected = resolvedId === selectedRoom || room.id === selectedRoom;

      if (!isSelected) {
        if (activeCategory && activeCategory !== 'all' && node && matchCategory(node.category, activeCategory)) {
          room.classList.add('amenity-highlight');

          // Attach subtle pulsing visual indicator over highlighted amenity
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
                onRoomSelect(resolvedId);
              };

              pin.innerHTML = `
                <circle r="16" fill="#c5a059" fill-opacity="0.3" class="amenity-pulse-badge" />
                <circle r="8" fill="#800000" stroke="#c5a059" stroke-width="2" />
                <circle r="3" fill="#ffffff" />
              `;
              svgDoc.appendChild(pin);
            }
          } catch {
            // Fallback if SVG geometry calculation is unavailable
          }
        } else {
          room.classList.remove('amenity-highlight');
        }
      }
    });
  }, [activeCategory, floor, graphData, selectedRoom, onRoomSelect]);

  // Style selected rooms and attach animated destination pin
  useEffect(() => {
    if (!svgContainerRef.current) return;
    const svgDoc = svgContainerRef.current.querySelector('svg');
    if (!svgDoc) return;

    // Remove any previous animated destination pin
    const existingPin = svgDoc.querySelector('.destination-pin-overlay');
    if (existingPin) existingPin.remove();

    const rooms = svgDoc.querySelectorAll('[id^="room-"], [id^="lift-"]');
    rooms.forEach(room => {
      const resolvedId = resolveNodeId(room.id, floor, graphData);
      const isSelected = resolvedId === selectedRoom || room.id === selectedRoom;

      if (isSelected) {
        room.classList.remove('amenity-highlight');
        room.style.fill = '#c5a059'; 
        room.style.stroke = '#800000';
        room.style.strokeWidth = '3px';
        if (isNavigating) {
          room.classList.add('navigating-glow');
        } else {
          room.classList.remove('navigating-glow');
        }

        // Attach interactive pulsing pin directly onto the room geometry center
        try {
          const bbox = room.getBBox();
          const centerX = bbox.x + bbox.width / 2;
          const centerY = bbox.y + bbox.height / 2;

          const pinG = document.createElementNS("http://www.w3.org/2000/svg", "g");
          pinG.setAttribute("class", "destination-pin-overlay");
          pinG.setAttribute("transform", `translate(${centerX}, ${centerY})`);
          
          pinG.innerHTML = `
            <circle r="22" fill="#800000" fill-opacity="0.25" class="user-pulse-marker" />
            <circle r="12" fill="#800000" stroke="#FFFFFF" stroke-width="2.5" />
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
  }, [selectedRoom, floor, isNavigating, activeCategory]);

  // Draw animated navigation path polylines
  useEffect(() => {
    if (!svgContainerRef.current) return;
    const svgDoc = svgContainerRef.current.querySelector('svg');
    if (!svgDoc) return;

    // Clean up any existing dynamic paths
    const existingPaths = svgDoc.querySelectorAll('.dynamic-route-path');
    existingPaths.forEach(path => path.remove());

    if (isNavigating && currentRoute && currentRoute.pathNodes) {
      let segments = [];
      let currentSegment = [];
      
      currentRoute.pathNodes.forEach(node => {
        if (node.floor === floor) {
          currentSegment.push(node);
        } else {
          if (currentSegment.length > 0) {
            segments.push(currentSegment);
            currentSegment = [];
          }
        }
      });
      if (currentSegment.length > 0) {
        segments.push(currentSegment);
      }

      segments.forEach((segment) => {
        if (segment.length > 1) {
           const points = segment.map(n => `${n.x},${n.y}`).join(' ');
           const polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
           polyline.setAttribute("points", points);
           polyline.setAttribute("fill", "none");
           polyline.setAttribute("stroke", "#c5a059");
           polyline.setAttribute("stroke-width", "6.5");
           polyline.setAttribute("stroke-linecap", "round");
           polyline.setAttribute("stroke-linejoin", "round");
           polyline.setAttribute("class", "active-nav-path dynamic-route-path");
           
           svgDoc.appendChild(polyline);
        }
      });
    }
  }, [currentRoute, floor, isNavigating]);

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
            {hoveredRoom && !isNavigating && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-slate-200/90 flex items-center space-x-2 animate-in fade-in slide-in-from-top-2">
                <MapPin className="w-4 h-4 text-sjcet-maroon animate-bounce" />
                <span className="text-xs font-extrabold text-slate-800">{hoveredRoom.name}</span>
                <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-full">Tap to Select</span>
              </div>
            )}

            {/* Floating Zoom & Reset Map Controls */}
            <div className="absolute right-4 top-20 z-20 flex flex-col space-y-2">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200/80 p-1 flex flex-col space-y-1">
                <button
                  onClick={() => zoomIn(0.3)}
                  aria-label="Zoom in"
                  className="p-2.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all active:scale-95"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
                <div className="h-[1px] bg-slate-200 mx-1"></div>
                <button
                  onClick={() => zoomOut(0.3)}
                  aria-label="Zoom out"
                  className="p-2.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all active:scale-95"
                >
                  <ZoomOut className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={() => resetTransform()}
                aria-label="Reset Map View"
                title="Reset Map View"
                className="bg-white/95 backdrop-blur-md p-2.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-2xl shadow-lg border border-slate-200/80 transition-all active:scale-95 flex items-center justify-center"
              >
                <Compass className="w-5 h-5 text-sjcet-maroon" />
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
}
