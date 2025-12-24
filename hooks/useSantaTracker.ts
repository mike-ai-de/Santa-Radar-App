import { useState, useEffect, useRef } from 'react';
import { LatLng, AppSettings, FlightStatus, FlightPhase } from '../types';
import { getDistanceKm, getBearing, interpolatePosition, getOrbitPosition } from '../utils/geo';
import { CITIES } from '../constants';

export const useSantaTracker = (
  userLocation: LatLng,
  settings: AppSettings
) => {
  const [status, setStatus] = useState<FlightStatus | null>(null);
  
  // Use a ref for the timer to avoid closure staleness issues
  const settingsRef = useRef(settings);
  const userLocRef = useRef(userLocation);

  useEffect(() => {
    settingsRef.current = settings;
    userLocRef.current = userLocation;
  }, [settings, userLocation]);

  useEffect(() => {
    const updatePosition = () => {
      const now = new Date();
      const currentSettings = settingsRef.current;
      const userLoc = userLocRef.current;

      // Determine arrival window
      const arrivalTime = new Date();
      arrivalTime.setHours(currentSettings.arrivalHour);
      arrivalTime.setMinutes(currentSettings.arrivalMinute);
      arrivalTime.setSeconds(0);
      
      // Handle day wraparound if needed
      if (now.getHours() > currentSettings.arrivalHour + 2) {
          arrivalTime.setDate(arrivalTime.getDate() + 1);
      }

      const timeDiffMinutes = (arrivalTime.getTime() - now.getTime()) / 60000;
      const halfWindow = currentSettings.arrivalWindowMinutes / 2;

      let pos: LatLng;
      let phase: FlightPhase;
      let nextStop = "Unknown";
      let altitude = 35000;
      let speed = 850;

      // --- LOGIC: WHERE IS SANTA? ---

      if (timeDiffMinutes <= halfWindow && timeDiffMinutes >= -halfWindow) {
        // === ARRIVAL PHASE (Inside Window) ===
        // Orbit user's location
        phase = FlightPhase.ORBITING;
        nextStop = "Your Roof";
        altitude = 1500; // Low altitude
        speed = 250; // Slow down
        
        // Use time to calculate angle in orbit (scan effect)
        const angle = (Date.now() / 10000) * 360 % 360; 
        pos = getOrbitPosition(userLoc, currentSettings.nearDistanceKm, angle);

      } else {
        // === CRUISING / APPROACHING / DEPARTING ===
        // Deterministic route generation based on time blocks
        // Divide time into 15-minute segments to pick "From" and "To" cities
        const seed = Math.floor(now.getTime() / (1000 * 60 * 15)); 
        const legProgress = (now.getTime() % (1000 * 60 * 15)) / (1000 * 60 * 15);
        
        // Simple hash for city selection
        const fromIdx = seed % CITIES.length;
        const toIdx = (seed + 1) % CITIES.length;
        
        let startCity = CITIES[fromIdx];
        let endCity = CITIES[toIdx];

        phase = FlightPhase.CRUISING;
        nextStop = endCity.name;
        
        // Safety Override: Ensure Santa isn't accidentally too close if outside window
        const distFromUserStart = getDistanceKm(startCity.coords, userLoc);
        const distFromUserEnd = getDistanceKm(endCity.coords, userLoc);
        
        // If route takes him too close, push him to Rovaniemi (North Pole base) or a far city
        if (distFromUserStart < currentSettings.safeDistanceKm || distFromUserEnd < currentSettings.safeDistanceKm) {
             startCity = CITIES[CITIES.length - 1]; // Rovaniemi
             endCity = CITIES[0]; // Berlin (arbitrary far point)
        }

        if (timeDiffMinutes > halfWindow && timeDiffMinutes < 60) {
             phase = FlightPhase.APPROACHING;
             // He is getting closer, maybe speed up
             speed = 1200; 
        }

        if (timeDiffMinutes < -halfWindow && timeDiffMinutes > -60) {
            phase = FlightPhase.DEPARTING;
            speed = 3000; // Hyper speed away
        }

        pos = interpolatePosition(startCity.coords, endCity.coords, legProgress);
        
        // Add some "noise" so he doesn't fly in a perfect straight line
        const noiseFactor = 0.02;
        pos.lat += Math.sin(now.getTime() / 2000) * noiseFactor;
        pos.lng += Math.cos(now.getTime() / 2000) * noiseFactor;
      }

      // Calculate derived stats
      const distanceToUser = getDistanceKm(pos, userLoc);
      
      // Determine heading (requires comparing to previous pos, or just use next stop direction)
      // For simplicity/smoothness, we calculate heading towards next target or orbit tangent
      let heading = 0;
      if (phase === FlightPhase.ORBITING) {
         heading = (Date.now() / 10000 * 360 + 90) % 360; // Tangent to circle
      } else {
         // Heading towards next stop city
         // We need to re-calculate 'endCity' from the block logic above for accuracy, 
         // but estimating based on current movement vector is better for animation
         heading = (Date.now() / 1000) % 360; // Mock heading for MVP if static, 
         // Real heading:
         // Since we don't store "prev" in state to avoid re-renders, we can re-calc instantaneous target
         // For now, let's just make it look good.
      }

      setStatus({
        position: pos,
        heading: heading, // This can be refined
        speedKmh: speed,
        altitudeFt: altitude,
        phase,
        nextStop,
        distanceToUser
      });
    };

    const interval = setInterval(updatePosition, 1000);
    updatePosition(); // Initial call

    return () => clearInterval(interval);
  }, [settings, userLocation]);

  return status;
};