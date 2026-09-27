import React, { useEffect, useRef } from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import groundFloorUrl from '../assets/ground_floor.svg?raw';
import firstFloorUrl from '../assets/first_floor.svg?raw';

const maps = {
  ground: groundFloorUrl,
  first: firstFloorUrl
};

export default function FloorMap({ floor, onRoomSelect, selectedRoom, isNavigating, currentRoute }) {
  const svgContainerRef = useRef(null);
  const mapContent = maps[floor] || groundFloorUrl;

  useEffect(() => {
    if (svgContainerRef.current) {
      const svgDoc = svgContainerRef.current.querySelector('svg');
      if (!svgDoc) return;

      const handleClick = (e) => {
        let target = e.target;
        while (target && target !== svgDoc) {
          if (target.id && target.id.startsWith('room-')) {
            onRoomSelect(target.id);
            break;
          }
          target = target.parentElement;
        }
      };
      svgDoc.addEventListener('click', handleClick);
      return () => svgDoc.removeEventListener('click', handleClick);
    }
  }, [onRoomSelect, floor]);

  useEffect(() => {
    if (svgContainerRef.current) {
      const rooms = svgContainerRef.current.querySelectorAll('[id^="room-"]');
      rooms.forEach(room => {
        if (room.id === selectedRoom) {
          if (isNavigating) {
            room.style.fill = '#c5a059'; 
            room.classList.add('navigating-glow');
          } else {
            room.style.fill = '#c5a059';
            room.classList.remove('navigating-glow');
          }
        } else {
          room.style.fill = ''; 
          room.classList.remove('navigating-glow');
        }
      });
    }
  }, [selectedRoom, floor, isNavigating]);

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

      segments.forEach((segment, idx) => {
        if (segment.length > 1) {
           const points = segment.map(n => `${n.x},${n.y}`).join(' ');
           const polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
           polyline.setAttribute("points", points);
           polyline.setAttribute("fill", "none");
           polyline.setAttribute("stroke", "#c5a059");
           polyline.setAttribute("stroke-width", "6");
           polyline.setAttribute("stroke-linecap", "round");
           polyline.setAttribute("stroke-linejoin", "round");
           // active-nav-path provides the animation from index.css
           polyline.setAttribute("class", "active-nav-path dynamic-route-path");
           
           svgDoc.appendChild(polyline);
        }
      });
    }
  }, [currentRoute, floor, isNavigating]);

  return (
    <div className="w-full h-full bg-[#e8e9eb] flex items-center justify-center overflow-hidden touch-none relative">
      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={4}
        centerOnInit={true}
        wheel={{ step: 0.1 }}
      >
        <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
          <div 
            ref={svgContainerRef} 
            dangerouslySetInnerHTML={{ __html: mapContent }} 
            className="w-full h-full flex items-center justify-center p-4 md:p-8 [&>svg]:w-full [&>svg]:max-w-2xl [&>svg]:h-auto"
          />
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}
