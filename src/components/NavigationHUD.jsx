import React from 'react';
import { 
  Footprints, 
  ArrowUp, 
  ArrowRight, 
  ArrowLeft, 
  ChevronsUp, 
  Volume2, 
  VolumeX, 
  X, 
  CheckCircle2,
  Accessibility
} from 'lucide-react';

export default function NavigationHUD({ 
  route, 
  destinationName, 
  onClose, 
  isAccessible, 
  heading = 0,
  steps = 0,
  onSpeechToggle,
  isMuted = false
}) {
  if (!route) return null;

  const currentStep = route.detailedSteps?.[0] || { text: route.instructions?.[0] || 'Proceed along path', type: 'depart' };

  const getStepIcon = (type) => {
    switch (type) {
      case 'lift':
        return <ChevronsUp className="w-6 h-6 text-sjcet-maroon" />;
      case 'stairs':
        return <ArrowUp className="w-6 h-6 text-sjcet-maroon" />;
      case 'arrive':
        return <CheckCircle2 className="w-6 h-6 text-green-600" />;
      default:
        return <ArrowUp className="w-6 h-6 text-sjcet-maroon" />;
    }
  };

  return (
    <div className="absolute top-0 left-0 w-full z-40 bg-sjcet-maroon text-white shadow-2xl rounded-b-3xl transition-all duration-300 animate-in slide-in-from-top-4">
      {/* Top Bar with Destination, Step count, and controls */}
      <div className="px-5 pt-4 pb-2 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center space-x-2">
          {isAccessible && (
            <span className="bg-sjcet-gold/20 text-sjcet-gold text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 border border-sjcet-gold/40">
              <Accessibility className="w-3 h-3 mr-0.5" />
              Step-Free
            </span>
          )}
          <span className="text-xs text-white/80 font-medium">Navigating to</span>
          <span className="text-xs font-bold text-sjcet-gold truncate max-w-[150px]">{destinationName}</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onSpeechToggle}
            className={`p-2 rounded-full transition-colors ${isMuted ? 'bg-white/10 text-white/50' : 'bg-sjcet-gold text-sjcet-maroon'}`}
            title={isMuted ? "Unmute Voice Guidance" : "Mute Voice Guidance"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          
          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 transition-all text-white"
            title="End Navigation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Guidance Card */}
      <div className="p-4 flex items-center space-x-4">
        {/* Direction Turn Indicator Icon */}
        <div className="w-14 h-14 bg-sjcet-gold rounded-2xl flex items-center justify-center shadow-lg relative shrink-0">
          <div 
            className="transition-transform duration-300"
            style={{ transform: `rotate(${heading}deg)` }}
          >
            {getStepIcon(currentStep.type)}
          </div>
        </div>

        {/* Turn description */}
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-extrabold leading-tight tracking-tight text-white line-clamp-2">
            {currentStep.text}
          </h2>
          <div className="flex items-center space-x-3 mt-1.5 text-xs text-white/80">
            <span className="flex items-center font-bold text-sjcet-gold">
              <Footprints className="w-3.5 h-3.5 mr-1 inline" />
              ~{route.totalSteps} steps ({route.totalDistanceMeters}m)
            </span>
            <span className="text-white/40">•</span>
            <span>Est. ~{Math.ceil(route.totalDistanceMeters / 1.2 / 60)} min</span>
          </div>
        </div>
      </div>

      {/* Next Step Preview Bar */}
      {route.detailedSteps?.length > 1 && (
        <div className="bg-black/25 px-5 py-2.5 rounded-b-3xl flex items-center justify-between text-xs text-white/90">
          <span className="text-white/60 font-semibold uppercase tracking-wider text-[10px]">Next:</span>
          <span className="truncate flex-1 mx-2 text-right font-medium text-white/90">
            {route.detailedSteps[1].text}
          </span>
        </div>
      )}
    </div>
  );
}
