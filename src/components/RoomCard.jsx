import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Compass, 
  Accessibility, 
  Layers, 
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function RoomCard({ roomContext, onFocus, onClose }) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!roomContext) return null;

  const handleShare = () => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('floor', roomContext.floor);
      url.searchParams.set('room', roomContext.id);
      navigator.clipboard.writeText(url.toString()).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      });
    } catch (e) {
      console.warn("Share link copy error:", e);
    }
  };

  return (
    <div className="w-full bg-white/98 backdrop-blur-xl rounded-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)] border border-slate-200/90 p-3.5 sm:p-4 animate-in fade-in slide-in-from-bottom-3 duration-200">
      
      {/* Top Drag / Peek Bar */}
      <div 
        className="flex items-center justify-between mb-2 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-950 border border-amber-300/80">
            <Layers className="w-3 h-3 text-sjcet-gold" />
            <span>{roomContext.floorLabel}</span>
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
            {roomContext.wing}
          </span>
          {roomContext.accessible && (
            <span title="Wheelchair accessible" className="p-0.5 rounded-full bg-emerald-50 text-emerald-700">
              <Accessibility className="w-3.5 h-3.5" />
            </span>
          )}
        </div>

        <div className="flex items-center space-x-1">
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close details"
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Room Name & Primary Details */}
      <div className="mb-2.5">
        <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-tight tracking-tight">
          {roomContext.name}
        </h2>
        {roomContext.nearestAccess && (
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
            Near: <span className="font-bold text-slate-700">{roomContext.nearestAccess}</span>
          </p>
        )}
      </div>

      {/* Expandable Extra Details */}
      {isExpanded && (
        <div className="mb-3 pt-2 border-t border-slate-100 text-xs space-y-1 animate-in fade-in duration-150">
          <div className="flex justify-between text-slate-600">
            <span>Building Block:</span>
            <span className="font-bold text-slate-800">{roomContext.block}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Wing Location:</span>
            <span className="font-bold text-slate-800">{roomContext.wing}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Category:</span>
            <span className="font-bold text-slate-800 capitalize">{roomContext.category}</span>
          </div>
        </div>
      )}

      {/* Primary Thumb Actions */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onFocus}
          className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-sjcet-maroon text-sjcet-gold font-extrabold text-xs shadow-md hover:bg-sjcet-maroon-light active:scale-95 transition-all cursor-pointer"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Focus on Map</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all active:scale-95 cursor-pointer border border-slate-200/80"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700">Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-slate-600" />
              <span>Share Location</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
