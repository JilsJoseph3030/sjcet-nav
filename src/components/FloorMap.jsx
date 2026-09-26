import React, { useEffect, useRef } from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import groundFloorUrl from '../assets/ground_floor.svg?raw';
import firstFloorUrl from '../assets/first_floor.svg?raw';

const maps = {
  ground: groundFloorUrl,
  first: firstFloorUrl
};

export default function FloorMap({ floor, onRoomSelect, selectedRoom, isNavigating }) {
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

      // Animate path if navigating
      const edges = svgContainerRef.current.querySelectorAll('.navEdge');
      edges.forEach(edge => {
        if (isNavigating && selectedRoom) {
          edge.classList.add('active-nav-path');
        } else {
          edge.classList.remove('active-nav-path');
        }
      });
    }
  }, [selectedRoom, floor, isNavigating]);

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
