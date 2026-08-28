import React from 'react';
import { Sparkles } from 'lucide-react';

export const HELPFUL_ACTIONS = [
  'Good sleep',
  'Talking to someone',
  'Completing a task',
  'Taking a break',
  'Exercise',
  'Walking',
  'Music',
  'Journaling',
  'Spending time with friends',
  'Other',
];

interface WhatHelpedMePickerProps {
  selectedActions: string[];
  onChange: (actions: string[]) => void;
}

export const WhatHelpedMePicker: React.FC<WhatHelpedMePickerProps> = ({ selectedActions, onChange }) => {
  const toggleAction = (action: string) => {
    if (selectedActions.includes(action)) {
      onChange(selectedActions.filter((a) => a !== action));
    } else {
      onChange([...selectedActions, action]);
    }
  };

  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-emerald-500" />
        What Helped Me Today? (Optional)
      </label>
      <div className="flex flex-wrap gap-2">
        {HELPFUL_ACTIONS.map((action) => {
          const isSelected = selectedActions.includes(action);
          return (
            <button
              key={action}
              type="button"
              onClick={() => toggleAction(action)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              {action}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default WhatHelpedMePicker;
