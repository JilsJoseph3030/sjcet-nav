import React, { useState, useEffect, useRef } from 'react';
import { Search, X, MapPin } from 'lucide-react';

export default function SearchBar({ placeholder, initialValue, onSelect, onClear, icon: Icon = Search, graphData }) {
  const [query, setQuery] = useState(initialValue || '');
  const [results, setResults] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setQuery(initialValue || '');
  }, [initialValue]);

  // Extract searchable locations
  const searchItems = [];
  if (graphData) {
    Object.keys(graphData).forEach(floor => {
      Object.keys(graphData[floor].nodes).forEach(nodeId => {
        searchItems.push({
          id: nodeId,
          name: graphData[floor].nodes[nodeId].name,
          floor: floor,
          floorLabel: floor === 'ground' ? 'Ground Floor' : floor.charAt(0).toUpperCase() + floor.slice(1) + ' Floor'
        });
      });
    });
  }

  useEffect(() => {
    if (query.trim() === '' || query === initialValue) {
      setResults([]);
      return;
    }
    const lowerQuery = query.toLowerCase();
    const filtered = searchItems.filter(item => 
      item.name.toLowerCase().includes(lowerQuery) || 
      item.id.toLowerCase().includes(lowerQuery)
    );
    setResults(filtered);
  }, [query, initialValue]);

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
    if (onClear) onClear();
  };

  return (
    <div className="relative w-full mb-3" ref={dropdownRef}>
      <div className={`flex items-center bg-gray-100 rounded-2xl px-4 py-3 transition-all duration-300 border-2 ${isFocused ? 'border-sjcet-maroon bg-white shadow-md' : 'border-transparent'}`}>
        <Icon className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
        <input
          type="text"
          className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-500 text-[15px]"
          placeholder={placeholder || "Search..."}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value === '' && onClear) onClear();
          }}
          onFocus={() => setIsFocused(true)}
        />
        {query && (
          <button 
            onClick={handleClear}
            className="ml-2 p-1 bg-gray-200 rounded-full hover:bg-gray-300 active:scale-95 transition-all"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isFocused && results.length > 0 && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 max-h-60 overflow-y-auto z-50 py-2 animate-in fade-in slide-in-from-top-2">
          {results.map((item, idx) => (
            <button
              key={`${item.id}-${idx}`}
              onClick={() => handleSelect(item)}
              className="w-full text-left px-5 py-3 hover:bg-gray-50 flex flex-col transition-colors border-b border-gray-50 last:border-0"
            >
              <span className="font-bold text-gray-800 text-[15px]">{item.name}</span>
              <span className="text-xs text-gray-500 flex items-center mt-1">
                <MapPin className="w-3 h-3 mr-1" />
                {item.floorLabel}
              </span>
            </button>
          ))}
        </div>
      )}
      
      {isFocused && query && query !== initialValue && results.length === 0 && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 text-center z-50">
          <p className="text-sm text-gray-500">No matching locations found.</p>
        </div>
      )}
    </div>
  );
}
