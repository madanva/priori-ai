import React from 'react';

interface ToggleSwitchProps {
  leftOption: string;
  rightOption: string;
  isLeftSelected: boolean;
  onToggle: () => void;
  className?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  leftOption,
  rightOption,
  isLeftSelected,
  onToggle,
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex items-center bg-[#F8F9FA] rounded-full p-1 w-full max-w-[240px]">
        <button
          className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all duration-200 ${
            isLeftSelected
              ? 'bg-[#1EBCBC] text-white shadow-sm'
              : 'text-[#6C757D] hover:text-[#333333]'
          }`}
          onClick={isLeftSelected ? undefined : onToggle}
        >
          {leftOption}
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all duration-200 ${
            !isLeftSelected
              ? 'bg-[#1EBCBC] text-white shadow-sm'
              : 'text-[#6C757D] hover:text-[#333333]'
          }`}
          onClick={!isLeftSelected ? undefined : onToggle}
        >
          {rightOption}
        </button>
      </div>
    </div>
  );
};
