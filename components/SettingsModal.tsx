import React, { useState } from 'react';
import { X, Save, Clock } from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSave: (s: AppSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState(settings);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-800 border border-green-500/50 rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-green-700/30 bg-gray-900">
          <h3 className="text-lg font-bold text-green-400 flex items-center gap-2">
            <Clock size={18} /> RADAR CONFIGURATION
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20} /></button>
        </div>

        <div className="p-6 space-y-6">
          {/* Time Picker */}
          <div>
            <label className="block text-xs uppercase text-green-600 mb-2 font-bold">Estimated Arrival Time</label>
            <div className="flex gap-2">
               <input 
                 type="number" 
                 min="0" max="23"
                 value={localSettings.arrivalHour}
                 onChange={(e) => setLocalSettings({...localSettings, arrivalHour: parseInt(e.target.value)})}
                 className="bg-black/40 border border-green-800 text-green-400 rounded p-2 w-20 text-center text-xl font-mono focus:border-green-500 outline-none"
               />
               <span className="text-green-600 text-2xl">:</span>
               <input 
                 type="number" 
                 min="0" max="59"
                 value={localSettings.arrivalMinute}
                 onChange={(e) => setLocalSettings({...localSettings, arrivalMinute: parseInt(e.target.value)})}
                 className="bg-black/40 border border-green-800 text-green-400 rounded p-2 w-20 text-center text-xl font-mono focus:border-green-500 outline-none"
               />
            </div>
            <p className="text-xs text-gray-500 mt-2">When Santa should fly over your house.</p>
          </div>

          {/* Sliders */}
          <div>
            <label className="block text-xs uppercase text-green-600 mb-2 font-bold">
              Visibility Window: {localSettings.arrivalWindowMinutes} min
            </label>
            <input 
              type="range" min="5" max="60" step="5"
              value={localSettings.arrivalWindowMinutes}
              onChange={(e) => setLocalSettings({...localSettings, arrivalWindowMinutes: parseInt(e.target.value)})}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
          </div>

          <div>
             <label className="block text-xs uppercase text-green-600 mb-2 font-bold">
              Safe Distance (Stealth): {localSettings.safeDistanceKm} km
            </label>
            <input 
              type="range" min="50" max="500" step="10"
              value={localSettings.safeDistanceKm}
              onChange={(e) => setLocalSettings({...localSettings, safeDistanceKm: parseInt(e.target.value)})}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
            <p className="text-xs text-gray-500 mt-1">Minimum distance Santa keeps when not arriving.</p>
          </div>
        </div>

        <div className="p-4 bg-gray-900 border-t border-green-700/30 flex justify-end">
          <button 
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-6 rounded flex items-center gap-2 transition-colors"
          >
            <Save size={18} /> Apply Settings
          </button>
        </div>
      </div>
    </div>
  );
};