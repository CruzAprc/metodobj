
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
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">{label}</span>
          <span className="text-sm font-bold text-pink-600">{current}/{total}</span>
        </div>
      )}
      <div className="juju-progress">
        <div 
          className="juju-progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
