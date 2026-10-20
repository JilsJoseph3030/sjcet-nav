import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, MapPin, Accessibility } from 'lucide-react';
import { allRooms, matchCategory } from '../utils/amenities';

export default function SearchBar({ 
  placeholder, 
  initialValue, 
  onSelect, 
  onClear, 
  icon: Icon = Search, 
  categoryFilter = 'all',
  currentFloor
}) {
  const [query, setQuery] = useState(initialValue || '');
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef(null);

  // Synchronize internal query state if initialValue changes externally
  const prevInitialValueRef = useRef(initialValue);
  useEffect(() => {
    if (initialValue !== prevInitialValueRef.current) {
      setQuery(initialValue || '');
      prevInitialValueRef.current = initialValue;
    }
  }, [initialValue]);

  // Derive filtered search results from modular room data
  const results = useMemo(() => {
    let filtered = allRooms;

    if (categoryFilter && categoryFilter !== 'all') {
      filtered = filtered.filter(item => matchCategory(item.category, categoryFilter));
    }

    if (currentFloor) {
      filtered = [...filtered].sort((a, b) => {
        if (a.floor === currentFloor && b.floor !== currentFloor) return -1;
        if (a.floor !== currentFloor && b.floor === currentFloor) return 1;
        return 0;
      });
    }

    if (query.trim() === '' || query === initialValue) {
      if (categoryFilter && categoryFilter !== 'all' && isFocused) {
        return filtered.slice(0, 10);
      }
      return [];
    }

    const lowerQuery = query.toLowerCase();
    return filtered.filter(item => 
      (item.name || '').toLowerCase().includes(lowerQuery) || 
      (item.id || '').toLowerCase().includes(lowerQuery)
    ).slice(0, 10);
  }, [categoryFilter, currentFloor, query, initialValue, isFocused]);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item) => {
    setQuery(item.name);
    setIsFocused(false);
    onSelect(item.id, item.floor, item.name);
  };

  const handleClear = () => {
    setQuery('');
    if (onClear) onClear();
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className={`relative flex items-center bg-white rounded-2xl border transition-all duration-200 shadow-sm ${
        isFocused 
          ? 'border-sjcet-maroon ring-2 ring-sjcet-maroon/15 shadow-md' 
          : 'border-slate-200 hover:border-slate-300'
      }`}>
        <div className="pl-3.5 text-slate-400 flex items-center justify-center">
          <Icon className="w-4 h-4 text-sjcet-maroon" />
        </div>
        
        <input 
          type="text"
          className="w-full py-2.5 pl-2.5 pr-9 text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 bg-transparent rounded-2xl focus:outline-none"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
        />

        {query && (
          <button 
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute right-2.5 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isFocused && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white/98 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 max-h-60 overflow-y-auto z-50 py-1.5 divide-y divide-slate-50 animate-in fade-in slide-in-from-top-1 duration-150">
          {results.map((item) => (
            <div 
              key={`${item.floor}-${item.id}`}
              onClick={() => handleSelect(item)}
              className="px-3.5 py-2.5 hover:bg-slate-50/90 cursor-pointer flex items-center justify-between transition-colors group"
            >
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-sjcet-maroon group-hover:bg-sjcet-maroon group-hover:text-white transition-colors shrink-0">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-sjcet-maroon transition-colors truncate">
                    {item.name}
                  </p>
                  <p className="text-[10px] text-slate-400 font-semibold truncate">
                    {item.floorLabel} • {item.wing}
                  </p>
                </div>
              </div>

              {item.accessible && (
                <span title="Wheelchair accessible" className="text-emerald-600 bg-emerald-50 p-1 rounded-full shrink-0 ml-2">
                  <Accessibility className="w-3 h-3" />
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
