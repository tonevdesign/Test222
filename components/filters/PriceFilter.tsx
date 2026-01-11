'use client';

import { useState, useEffect, useRef } from 'react';

interface PriceFilterProps {
  min: number;
  max: number;
  selectedMin: number;
  selectedMax: number;
  onChange: (min: number, max: number) => void;
}

export default function PriceFilter({
  selectedMin,
  selectedMax,
  onChange,
}: PriceFilterProps) {
  // Fixed range: always 1 to 10000
  const FIXED_MIN = 1;
  const FIXED_MAX = 10000;
  
  // Local state for the handles
  const [minValue, setMinValue] = useState(selectedMin || FIXED_MIN);
  const [maxValue, setMaxValue] = useState(selectedMax || FIXED_MAX);
  
  // Temporary state for input fields while typing
  const [minInput, setMinInput] = useState(String(selectedMin || FIXED_MIN));
  const [maxInput, setMaxInput] = useState(String(selectedMax || FIXED_MAX));
  
  const range = useRef<HTMLDivElement>(null);

  // Sync with URL params when they change
  useEffect(() => {
    const newMin = selectedMin || FIXED_MIN;
    const newMax = selectedMax || FIXED_MAX;
    setMinValue(newMin);
    setMaxValue(newMax);
    setMinInput(String(newMin));
    setMaxInput(String(newMax));
  }, [selectedMin, selectedMax]);

  // Calculate the percentage position for the range highlight
  const getPercent = (value: number) => {
    return ((value - FIXED_MIN) / (FIXED_MAX - FIXED_MIN)) * 100;
  };

  // Update range highlight when values change
  useEffect(() => {
    if (range.current) {
      const minPercent = getPercent(minValue);
      const maxPercent = getPercent(maxValue);
      
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minValue, maxValue]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), maxValue - 1);
    setMinValue(value);
    setMinInput(String(value));
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), minValue + 1);
    setMaxValue(value);
    setMaxInput(String(value));
  };

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    setMinInput(value);
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    setMaxInput(value);
  };

  const handleMinInputBlur = () => {
    let value = parseInt(minInput) || FIXED_MIN;
    value = Math.max(FIXED_MIN, Math.min(value, maxValue - 1));
    setMinValue(value);
    setMinInput(String(value));
  };

  const handleMaxInputBlur = () => {
    let value = parseInt(maxInput) || FIXED_MAX;
    value = Math.min(FIXED_MAX, Math.max(value, minValue + 1));
    setMaxValue(value);
    setMaxInput(String(value));
  };

  const handleApply = () => {
    // Only send values if they're different from the fixed range
    const finalMin = minValue === FIXED_MIN ? 0 : minValue;
    const finalMax = maxValue === FIXED_MAX ? 10000 : maxValue;
    onChange(finalMin, finalMax);
  };

  const handleReset = () => {
    setMinValue(FIXED_MIN);
    setMaxValue(FIXED_MAX);
    setMinInput(String(FIXED_MIN));
    setMaxInput(String(FIXED_MAX));
    onChange(0, 10000);
  };

  const hasChanges = minValue !== (selectedMin || FIXED_MIN) || maxValue !== (selectedMax || FIXED_MAX);
  const isFiltered = selectedMin > 0 || selectedMax < 10000;

  return (
    <div className="space-y-6">
      {/* Dual Range Slider */}
      <div className="relative h-5">
        {/* Track Background */}
        <div className="absolute w-full h-1 top-2 bg-[#E0E0E0] rounded-full" />
        
        {/* Active Range Highlight */}
        <div
          ref={range}
          className="absolute h-1 top-2 bg-[#00BFA6] rounded-full"
        />
        
        {/* Min Range Input */}
        <input
          type="range"
          min={FIXED_MIN}
          max={FIXED_MAX}
          step="1"
          value={minValue}
          onChange={handleMinChange}
          className="absolute w-full h-1 top-2 pointer-events-none appearance-none bg-transparent z-10 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#00BFA6] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#00BFA6] [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md"
        />
        
        {/* Max Range Input */}
        <input
          type="range"
          min={FIXED_MIN}
          max={FIXED_MAX}
          step="1"
          value={maxValue}
          onChange={handleMaxChange}
          className="absolute w-full h-1 top-2 pointer-events-none appearance-none bg-transparent z-20 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#00BFA6] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#00BFA6] [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md"
        />
      </div>

      {/* Price Input Fields */}
      <div className="flex items-center justify-between gap-3 text-sm">
        <input
          type="text"
          value={minInput}
          onChange={handleMinInputChange}
          onBlur={handleMinInputBlur}
          className="flex-1 px-3 py-2 bg-[#F5F5F5] rounded-lg text-[#1F1F1F] font-medium text-center focus:outline-none focus:ring-2 focus:ring-[#00BFA6] focus:bg-white transition-all"
          placeholder={String(FIXED_MIN)}
        />
        <span className="text-[#777777]">—</span>
        <input
          type="text"
          value={maxInput}
          onChange={handleMaxInputChange}
          onBlur={handleMaxInputBlur}
          className="flex-1 px-3 py-2 bg-[#F5F5F5] rounded-lg text-[#1F1F1F] font-medium text-center focus:outline-none focus:ring-2 focus:ring-[#00BFA6] focus:bg-white transition-all"
          placeholder={String(FIXED_MAX)}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        {isFiltered && (
          <button
            onClick={handleReset}
            className="px-4 py-2 border border-[#E0E0E0] text-[#777777] rounded-lg text-sm font-medium hover:bg-[#F5F5F5] transition-colors"
          >
            Изчисти
          </button>
        )}
        {hasChanges && (
          <button
            onClick={handleApply}
            className="flex-1 px-4 py-2 bg-[#00BFA6] text-white rounded-lg text-sm font-semibold hover:bg-[#00a08c] transition-colors"
          >
            Приложи
          </button>
        )}
      </div>
    </div>
  );
}