import { useEffect, useState } from 'react';

// Module C: Pedestrian Dead Reckoning (PDR) & Device Orientation
export function usePDR() {
  const [heading, setHeading] = useState(0);
  const [steps, setSteps] = useState(0);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    let lastAccelY = 0;
    
    // Step counting via Accelerometer
    const handleMotion = (event) => {
      if (event.accelerationIncludingGravity) {
        const accelY = event.accelerationIncludingGravity.y;
        // Basic step detection threshold
        if (lastAccelY < 10 && accelY >= 10) {
          setSteps(s => s + 1);
        }
        lastAccelY = accelY;
      }
    };

    // Heading via Magnetometer/Compass
    const handleOrientation = (event) => {
      let compassHeading = event.webkitCompassHeading || Math.abs(event.alpha - 360);
      setHeading(Math.round(compassHeading));
    };

    // Request permissions (iOS 13+ requires user interaction to request DeviceOrientation events)
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      // Permission must be requested by a user button click in production
      setIsSupported(false); // Flagging for UI to show a "Enable Sensors" button if needed
    } else {
      window.addEventListener('devicemotion', handleMotion, true);
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    return () => {
      window.removeEventListener('devicemotion', handleMotion, true);
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, []);

  return { heading, steps, isSupported };
}
