import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, X, AlertCircle, RefreshCw } from 'lucide-react';

export default function QRScannerModal({ isOpen, onClose, onScanSuccess }) {
  const [errorMsg, setErrorMsg] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      stopScanner();
      return;
    }

    let isMounted = true;

    const startScanner = async () => {
      try {
        setErrorMsg(null);
        setIsScanning(true);

        const html5QrCode = new Html5Qrcode("qr-reader-container");
        html5QrCodeRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 }
          },
          (decodedText) => {
            if (isMounted) {
              handleDecodedUrl(decodedText);
            }
          },
          () => {
            // Frame scan without code - ignore
          }
        );
      } catch (err) {
        if (isMounted) {
          console.warn("Camera start failed:", err);
          setErrorMsg(err.message || "Camera access denied or unavailable.");
          setIsScanning(false);
        }
      }
    };

    const timer = setTimeout(startScanner, 200);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      stopScanner();
    };
  }, [isOpen]);

  const stopScanner = () => {
    if (html5QrCodeRef.current) {
      if (html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.stop().catch(console.warn);
      }
      html5QrCodeRef.current.clear();
      html5QrCodeRef.current = null;
    }
    setIsScanning(false);
  };

  const handleDecodedUrl = (text) => {
    stopScanner();
    try {
      // Check if it's a full URL or query string with floor and node
      let floor = null;
      let node = null;

      if (text.includes('?')) {
        const queryPart = text.split('?')[1];
        const params = new URLSearchParams(queryPart);
        floor = params.get('floor');
        node = params.get('node');
      } else {
        // Simple JSON or comma-separated: floor,node
        const parts = text.split(',');
        if (parts.length === 2) {
          floor = parts[0].trim();
          node = parts[1].trim();
        }
      }

      if (node && floor) {
        onScanSuccess({ floor, node });
      } else {
        setErrorMsg("Valid SJCET Navigation QR Code not recognized.");
      }
    } catch {
      setErrorMsg("Error parsing QR Code.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl flex flex-col relative">
        
        {/* Header */}
        <div className="bg-sjcet-maroon text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Camera className="w-5 h-5 text-sjcet-gold" />
            <h3 className="font-bold text-base">Scan Location Checkpoint</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Canvas Container */}
        <div className="p-4 flex flex-col items-center">
          <div 
            id="qr-reader-container" 
            className="w-full h-64 bg-slate-950 rounded-2xl overflow-hidden relative shadow-inner"
          >
            {/* Visual target reticle */}
            <div className="absolute inset-0 pointer-events-none border-2 border-sjcet-gold/60 rounded-2xl m-4 flex items-center justify-center">
              <div className="w-16 h-16 border-t-4 border-l-4 border-sjcet-gold absolute top-0 left-0"></div>
              <div className="w-16 h-16 border-t-4 border-r-4 border-sjcet-gold absolute top-0 right-0"></div>
              <div className="w-16 h-16 border-b-4 border-l-4 border-sjcet-gold absolute bottom-0 left-0"></div>
              <div className="w-16 h-16 border-b-4 border-r-4 border-sjcet-gold absolute bottom-0 right-0"></div>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-3 text-center px-2">
            Align the camera with any pillar QR code or door plaque in St. Francis Block to calibrate your exact location.
          </p>

          {errorMsg && (
            <div className="mt-3 p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center space-x-2 w-full border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Quick Demo Pre-set Buttons for testing */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col space-y-2">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">Quick Calibrate Simulator</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => onScanSuccess({ floor: 'ground', node: 'entrance' })}
              className="py-2 px-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 font-medium text-slate-700 active:scale-95 transition-all text-center"
            >
              Main Entrance (0F)
            </button>
            <button
              onClick={() => onScanSuccess({ floor: 'ground', node: 'room-018' })}
              className="py-2 px-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 font-medium text-slate-700 active:scale-95 transition-all text-center"
            >
              Canteen (0F)
            </button>
            <button
              onClick={() => onScanSuccess({ floor: 'first', node: 'room-103' })}
              className="py-2 px-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 font-medium text-slate-700 active:scale-95 transition-all text-center"
            >
              Library (1F)
            </button>
            <button
              onClick={() => onScanSuccess({ floor: 'second', node: 'lift-west' })}
              className="py-2 px-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 font-medium text-slate-700 active:scale-95 transition-all text-center"
            >
              West Lift (2F)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
