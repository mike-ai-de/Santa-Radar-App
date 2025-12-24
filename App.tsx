import React, { useState, useEffect } from 'react';
import { RadarMap } from './components/RadarMap';
import { Sidebar } from './components/Sidebar';
import { SettingsModal } from './components/SettingsModal';
import { ConsentScreen } from './components/ConsentScreen';
import { useSantaTracker } from './hooks/useSantaTracker';
import { AppSettings, LatLng } from './types';
import { DEFAULT_SETTINGS, DEFAULT_USER_LOCATION } from './constants';
import { Settings, Menu, Locate } from 'lucide-react';

// Zoom presets: World, Continent, Local
const ZOOM_LEVELS = [3, 5, 9];

function App() {
  const [hasConsent, setHasConsent] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<LatLng>(DEFAULT_USER_LOCATION.coords);
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('santa_radar_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(0);

  const santaStatus = useSantaTracker(userLocation, settings);

  // Persist settings
  useEffect(() => {
    localStorage.setItem('santa_radar_settings', JSON.stringify(settings));
  }, [settings]);

  const handleGrantConsent = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setHasConsent(true);
        },
        (error) => {
          console.warn("Geolocation denied or failed, using default.", error);
          // Fallback
          setHasConsent(true);
        }
      );
    } else {
      setHasConsent(true);
    }
  };

  const handleDenyConsent = () => {
    setHasConsent(true); // Proceed with default location
  };

  const toggleZoom = () => {
    setZoomIndex((prev) => (prev + 1) % ZOOM_LEVELS.length);
  };

  if (!hasConsent) {
    return <ConsentScreen onGrant={handleGrantConsent} onDeny={handleDenyConsent} />;
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black font-mono">
      
      {/* Main Map Area */}
      <div className="absolute inset-0 z-0">
        <RadarMap 
          userLocation={userLocation} 
          santaStatus={santaStatus} 
          zoomPreset={ZOOM_LEVELS[zoomIndex]} 
        />
      </div>

      {/* Floating HUD Controls */}
      <div className="absolute top-4 right-4 z-[500] flex flex-col gap-2">
         <button 
           onClick={() => setIsSidebarOpen(!isSidebarOpen)}
           className="bg-gray-900/80 text-green-400 p-3 rounded-full border border-green-500/50 hover:bg-green-900/50 backdrop-blur-md shadow-[0_0_10px_rgba(0,255,0,0.3)] transition-all"
         >
           <Menu size={24} />
         </button>
         
         <button 
           onClick={() => setIsSettingsOpen(true)}
           className="bg-gray-900/80 text-green-400 p-3 rounded-full border border-green-500/50 hover:bg-green-900/50 backdrop-blur-md transition-all"
         >
           <Settings size={24} />
         </button>
      </div>

      <div className="absolute bottom-8 right-4 z-[500]">
        <button 
           onClick={toggleZoom}
           className="bg-red-900/80 text-red-200 p-4 rounded-full border border-red-500/50 hover:bg-red-800/50 backdrop-blur-md shadow-[0_0_15px_rgba(255,0,0,0.4)] flex items-center justify-center font-bold animate-pulse"
        >
          <Locate size={28} />
          <span className="sr-only">Locate Santa</span>
        </button>
      </div>

      {/* Status Bar (Mobile Bottom) */}
      <div className="absolute bottom-0 left-0 w-full bg-gray-900/90 backdrop-blur-sm border-t border-green-800/50 p-2 z-[500] sm:hidden flex justify-between items-center text-xs text-green-400 px-4">
         <div>
           <span className="text-gray-500">FLIGHT:</span> SANTA1
         </div>
         <div>
           <span className="text-gray-500">RANGE:</span> {Math.round(santaStatus?.distanceToUser || 0)}km
         </div>
      </div>

      {/* Modals & Overlays */}
      <Sidebar 
        status={santaStatus} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={setSettings}
      />

    </div>
  );
}

export default App;
