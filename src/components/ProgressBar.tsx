
import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
}

const ProgressBar = ({ current, total, label }: ProgressBarProps) => {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full mb-6">
      {label && (
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-semibold text-gray-700">{label}</span>
          <span className="text-sm font-bold text-pink-600 bg-pink-50 px-3 py-1 rounded-full">
            {current}/{total}
          </span>
        </div>
      )}
      <div className="w-full bg-pink-100 rounded-full h-3 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-pink-500 to-pink-600 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
