import React from 'react';
import { 
  Compass, 
  Utensils, 
  BookOpen, 
  GraduationCap, 
  Building2, 
  ChevronsUp, 
  Bath
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Places', icon: Compass },
  { id: 'restroom', label: 'Restrooms', icon: Bath },
  { id: 'canteen', label: 'Food & Dining', icon: Utensils },
  { id: 'library', label: 'Libraries', icon: BookOpen },
  { id: 'classroom', label: 'Classrooms', icon: GraduationCap },
  { id: 'admin', label: 'Offices & Admin', icon: Building2 },
  { id: 'lift', label: 'Elevators & Stairs', icon: ChevronsUp }
];

export default function AmenityFilterChips({ activeCategory, onSelectCategory }) {
  return (
    <div className="w-full overflow-x-auto hide-scrollbar py-2 px-1 flex space-x-2">
      {CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        const isSelected = activeCategory === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(isSelected && cat.id !== 'all' ? 'all' : cat.id)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap shadow-sm active:scale-95 border ${
              isSelected 
                ? 'bg-sjcet-maroon text-white border-sjcet-maroon shadow-md' 
                : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-sjcet-gold' : 'text-slate-500'}`} />
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}
