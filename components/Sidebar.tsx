import React, { useState, useRef, useEffect } from 'react';
import { FlightStatus } from '../types';
import { Plane, Activity, Map as MapIcon, Send, Sparkles, MessageCircle } from 'lucide-react';
import { generateElfResponse } from '../services/gemini';
import { ChatMessage } from '../types';

interface SidebarProps {
  status: FlightStatus | null;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ status, isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: "Hej! Ich bin Olaf, ich bin der persönliche Fluglotse von SANTA1, der Weihnachtsmann. Frag mich alles was du willst!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Add temporary thinking message
    const thinkingId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: thinkingId, role: 'model', text: 'Übertrage Daten...', isThinking: true }]);

    const responseText = await generateElfResponse(userMsg.text);

    setMessages(prev => prev.filter(m => m.id !== thinkingId).concat({
      id: (Date.now() + 2).toString(),
      role: 'model',
      text: responseText
    }));
    setIsLoading(false);
  };

  return (
    // FIX 1: h-[100dvh] sorgt dafür, dass die Leiste sich der tatsächlichen Bildschirmhöhe anpasst (auch mit Tastatur)
    <div className={`fixed top-0 right-0 h-[100dvh] w-full sm:w-80 bg-gray-900/95 border-l border-green-800/50 backdrop-blur-md z-40 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      
      {/* Header (Fest) */}
      <div className="flex-none p-4 border-b border-green-800/50 flex justify-between items-center bg-gray-900">
        <h2 className="text-xl font-bold text-green-400 font-mono flex items-center gap-2">
          <Plane className="transform -rotate-45" /> FLIGHT DATA
        </h2>
        <button onClick={onClose} className="text-green-600 hover:text-green-300 sm:hidden">Close</button>
      </div>

      {/* Main Content Area (Scrollbar hier für Telemetry, falls nötig) */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        
        {/* Telemetry Panel (Scrollt weg, wenn Platz knapp wird? Oder bleibt fest? Hier: Scrollt mit) */}
        <div className="flex-none p-4 space-y-4 border-b border-green-800/30 overflow-y-auto max-h-[40vh]">
          <div className="bg-black/40 p-3 rounded border border-green-900/50">
             <div className="text-xs text-green-600 uppercase mb-1">Callsign</div>
             <div className="text-2xl font-mono text-green-400 tracking-widest">SANTA1</div>
          </div>

          <div className="grid grid-cols-2 gap-3">
             <div className="bg-black/40 p-2 rounded border border-green-900/50">
               <div className="text-xs text-green-600 uppercase flex items-center gap-1"><Activity size={10}/> Speed</div>
               <div className="text-lg font-mono text-green-300">{status?.speedKmh || 0} <span className="text-xs">km/h</span></div>
             </div>
             <div className="bg-black/40 p-2 rounded border border-green-900/50">
               <div className="text-xs text-green-600 uppercase flex items-center gap-1"><Activity size={10}/> Altitude</div>
               <div className="text-lg font-mono text-green-300">{status?.altitudeFt || 0} <span className="text-xs">ft</span></div>
             </div>
          </div>

          <div className="bg-black/40 p-3 rounded border border-green-900/50">
             <div className="text-xs text-green-600 uppercase flex items-center gap-1"><MapIcon size={12}/> Next Stop</div>
             <div className="text-md font-mono text-green-300 truncate">{status?.nextStop || 'SCANNING...'}</div>
             <div className="text-xs text-green-500 mt-1">
               Range: {Math.round(status?.distanceToUser || 0)} km
             </div>
          </div>
        </div>

        {/* Chat Interface (Füllt den Rest) */}
        <div className="flex-1 flex flex-col min-h-0 bg-gray-900/50">
           <div className="flex-none p-3 bg-green-900/20 border-b border-green-800/30 flex items-center gap-2">
              <MessageCircle size={16} className="text-green-400"/>
              <span className="text-sm font-bold text-green-400">ELF COMMS LINK</span>
           </div>

           {/* Nachrichten Liste (Das einzige Element, das hier scrollen soll) */}
           <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-lg p-3 text-sm ${
                    msg.role === 'user' 
                      ? 'bg-green-700 text-white rounded-br-none' 
                      : 'bg-gray-800 text-green-300 border border-green-700/50 rounded-bl-none'
                  }`}>
                    {msg.isThinking ? (
                       <span className="flex items-center gap-2 animate-pulse text-green-500">
                         {/* FIX: Text auf Deutsch angepasst */}
                         <Sparkles size={14} /> Übertrage...
                       </span>
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              ))}
           </div>

           {/* Input Area (Bleibt immer unten sichtbar) */}
           <div className="flex-none p-3 border-t border-green-800/30 bg-gray-900 pb-safe">
             <div className="flex gap-2">
               <input
                 type="text"
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                 placeholder="Frag den Elf . . ."
                 className="flex-1 bg-black/50 border border-green-800 text-green-400 text-sm rounded px-3 py-2 focus:outline-none focus:border-green-500 placeholder-green-800"
               />
               <button 
                 onClick={handleSend}
                 disabled={isLoading}
                 className="bg-green-700 hover:bg-green-600 text-white p-2 rounded disabled:opacity-50"
               >
                 <Send size={18} />
               </button>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

