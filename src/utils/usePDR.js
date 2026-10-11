import { useEffect, useState } from 'react';

export function usePDR() {
  const [heading, setHeading] = useState(0);
  const [steps, setSteps] = useState(0);
  const [isSupported, setIsSupported] = useState(true);
  const [sensorError, setSensorError] = useState(null);

  useEffect(() => {
    let lastAccelY = 0;
    
    // Step counting via Accelerometer
    const handleMotion = (event) => {
      try {
        if (event && event.accelerationIncludingGravity) {
          const accelY = event.accelerationIncludingGravity.y;
          if (typeof accelY === 'number' && !isNaN(accelY)) {
            if (lastAccelY < 10 && accelY >= 10) {
              setSteps(s => s + 1);
            }
            lastAccelY = accelY;
          }
        }
      } catch (err) {
        console.warn("Motion sensor read error:", err);
      }
    };

    // Heading via Magnetometer/Compass
    const handleOrientation = (event) => {
      try {
        if (!event) return;
        let compassHeading = 0;
        if (typeof event.webkitCompassHeading === 'number') {
          compassHeading = event.webkitCompassHeading;
        } else if (typeof event.alpha === 'number') {
          compassHeading = Math.abs(event.alpha - 360);
        }
        if (!isNaN(compassHeading)) {
          setHeading(Math.round(compassHeading));
        }
      } catch (err) {
        console.warn("Orientation sensor read error:", err);
      }
    };

    try {
      if (typeof window === 'undefined') return;

      if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        // iOS 13+ permission handling
        setIsSupported(false);
      } else if (window.DeviceMotionEvent || window.DeviceOrientationEvent) {
        window.addEventListener('devicemotion', handleMotion, true);
        window.addEventListener('deviceorientation', handleOrientation, true);
      } else {
        setIsSupported(false);
        setSensorError("Device motion sensors not available on this device.");
      }
    } catch (err) {
      console.warn("Sensor listener registration failed:", err);
      setIsSupported(false);
      setSensorError(err.message);
    }

    return () => {
      try {
        window.removeEventListener('devicemotion', handleMotion, true);
        window.removeEventListener('deviceorientation', handleOrientation, true);
      } catch {
        // Clean cleanup
      }
    };
  }, []);

  return { heading, steps, isSupported, sensorError };
}
