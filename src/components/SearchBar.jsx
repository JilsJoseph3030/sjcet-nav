import React, { useState, useEffect, useRef } from 'react';
import { Search, X, MapPin, Accessibility } from 'lucide-react';

export default function SearchBar({ 
  placeholder, 
  initialValue, 
  onSelect, 
  onClear, 
  icon: Icon = Search, 
  graphData,
  categoryFilter = 'all'
}) {
  const [query, setQuery] = useState(initialValue || '');
  const [results, setResults] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setQuery(initialValue || '');
  }, [initialValue]);

  // Extract searchable locations safely
  const searchItems = React.useMemo(() => {
    const items = [];
    if (graphData) {
      Object.keys(graphData).forEach(floor => {
        Object.keys(graphData[floor].nodes).forEach(nodeId => {
          const node = graphData[floor].nodes[nodeId];
          const nodeName = node.name;
          items.push({
            id: nodeId,
            name: nodeName || nodeId.replace('room-', '').replace(/-/g, ' ').toUpperCase(),
            floor: floor,
            category: node.category || 'classroom',
            accessible: node.accessible !== false,
            floorLabel: floor === 'ground' ? 'Ground Floor' : floor.charAt(0).toUpperCase() + floor.slice(1) + ' Floor'
          });
        });
      });
    }
    return items;
  }, [graphData]);

  useEffect(() => {
    let filtered = searchItems;

    // Apply category filter if active
    if (categoryFilter && categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    if (query.trim() === '' || query === initialValue) {
      // When category filter is active, show matching category items even with empty query!
      if (categoryFilter && categoryFilter !== 'all' && isFocused) {
        setResults(filtered.slice(0, 8));
      } else {
        setResults([]);
      }
      return;
    }

    const lowerQuery = query.toLowerCase();
    const searched = filtered.filter(item => 
      (item.name || '').toLowerCase().includes(lowerQuery) || 
      (item.id || '').toLowerCase().includes(lowerQuery)
    );
    setResults(searched.slice(0, 10));
  }, [query, initialValue, searchItems, categoryFilter, isFocused]);

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
    setResults([]);
    setIsFocused(false);
    onSelect(item.id, item.floor, item.name);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    if (onClear) onClear();
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className={`relative flex items-center bg-white rounded-2xl border transition-all duration-200 shadow-sm ${
        isFocused ? 'border-sjcet-maroon ring-2 ring-sjcet-maroon/15 shadow-md' : 'border-slate-200 hover:border-slate-300'
      }`}>
        <div className="pl-4 text-slate-400 flex items-center justify-center">
          <Icon className="w-5 h-5 text-sjcet-maroon" />
        </div>
        
        <input 
          type="text"
          className="w-full py-3.5 pl-3 pr-10 text-sm font-semibold text-slate-800 placeholder-slate-400 bg-transparent rounded-2xl focus:outline-none"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
        />

        {query && (
          <button 
            type="button"
            onClick={handleClear}
            className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isFocused && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 max-h-60 overflow-y-auto z-50 py-1.5 divide-y divide-slate-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {results.map((item) => (
            <div 
              key={`${item.floor}-${item.id}`}
              onClick={() => handleSelect(item)}
              className="px-4 py-3 hover:bg-slate-50/80 cursor-pointer flex items-center justify-between transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sjcet-maroon group-hover:bg-sjcet-maroon group-hover:text-white transition-colors">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 group-hover:text-sjcet-maroon transition-colors">
                    {item.name}
                  </p>
                  <p className="text-xs text-slate-400 font-medium">
                    {item.floorLabel}
                  </p>
                </div>
              </div>

              {item.accessible && (
                <span title="Wheelchair accessible" className="text-emerald-600 bg-emerald-50 p-1 rounded-full">
                  <Accessibility className="w-3.5 h-3.5" />
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
