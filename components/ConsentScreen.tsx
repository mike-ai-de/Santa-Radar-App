import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

interface ConsentScreenProps {
  onGrant: () => void;
  onDeny: () => void;
}

export const ConsentScreen: React.FC<ConsentScreenProps> = ({ onGrant, onDeny }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col items-center justify-center p-6 text-center text-green-400">
      <div className="bg-gray-800 p-8 rounded-2xl border border-green-500/30 shadow-2xl max-w-md w-full relative overflow-hidden">
        {/* Radar Decoration */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50"></div>
        
        <div className="w-20 h-20 bg-green-900/50 rounded-full mx-auto mb-6 flex items-center justify-center border border-green-500/50 relative">
          <div className="absolute inset-0 rounded-full border border-green-400/30 animate-ping"></div>
          <Navigation className="w-10 h-10 text-green-400" />
        </div>

        <h1 className="text-3xl font-bold mb-4 font-mono tracking-tighter">SANTA RADAR</h1>
        <p className="text-green-300/80 mb-8 leading-relaxed">
          To calculate the distance between your chimney and Santa's sleigh, we need to calibrate the radar with your location.
          <br/><br/>
          <span className="text-xs text-green-500/50 block mt-2">
            Data stays on your device. We do not track you. This is for the magic simulation only.
          </span>
        </p>

        <div className="space-y-4">
          <button 
            onClick={onGrant}
            className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105 shadow-[0_0_15px_rgba(34,197,94,0.5)] flex items-center justify-center gap-2"
          >
            <MapPin size={20} />
            Activate Radar
          </button>
          
          <button 
            onClick={onDeny}
            className="w-full bg-transparent border border-green-700 text-green-600 hover:text-green-400 hover:border-green-500 py-3 px-6 rounded-lg transition-colors text-sm"
          >
            Use Manual Mode (Default Location)
          </button>
        </div>
      </div>
    </div>
  );
};