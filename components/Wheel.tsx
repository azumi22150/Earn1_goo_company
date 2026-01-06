import React, { useRef, useState, useEffect } from 'react';

interface WheelProps {
  letters: string[];
  onWordSubmit: (word: string) => void;
  onShuffle?: () => void;
}

const Wheel: React.FC<WheelProps> = ({ letters, onWordSubmit, onShuffle }) => {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [currentWord, setCurrentWord] = useState('');
  const [pointerPos, setPointerPos] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Layout calculations
  const radius = 100; // SVG coordinate space radius
  const center = 130; // SVG center (allows padding)
  const letterRadius = 24; // Visual size of letter bubble

  const getLetterPosition = (index: number, total: number) => {
    const angle = (index * (360 / total)) - 90; // Start from top
    const radian = (angle * Math.PI) / 180;
    return {
      x: center + radius * 0.8 * Math.cos(radian), // 0.8 scale to keep inside
      y: center + radius * 0.8 * Math.sin(radian)
    };
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault(); // Prevent scrolling
    updateSelection(e);
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (selectedIndices.length > 0) {
      updateSelection(e);
    }
  };

  const handleEnd = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (currentWord.length > 0) {
      onWordSubmit(currentWord);
    }
    setSelectedIndices([]);
    setCurrentWord('');
    setPointerPos(null);
  };

  const updateSelection = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    // Convert client coords to SVG coords
    const svgX = (clientX - rect.left) * (260 / rect.width);
    const svgY = (clientY - rect.top) * (260 / rect.height);
    
    setPointerPos({ x: svgX, y: svgY });

    // Check collision with letters
    letters.forEach((_, index) => {
      const pos = getLetterPosition(index, letters.length);
      const dist = Math.sqrt(Math.pow(svgX - pos.x, 2) + Math.pow(svgY - pos.y, 2));
      
      if (dist < 35) { // Hit radius
        if (!selectedIndices.includes(index)) {
             // Logic for backtracking: if user moves back to the SECOND to last letter, remove the last one
             if (selectedIndices.length >= 2 && selectedIndices[selectedIndices.length - 2] === index) {
                 const newIndices = selectedIndices.slice(0, -1);
                 setSelectedIndices(newIndices);
                 setCurrentWord(newIndices.map(i => letters[i]).join(''));
             } else {
                 const newIndices = [...selectedIndices, index];
                 setSelectedIndices(newIndices);
                 setCurrentWord(newIndices.map(i => letters[i]).join(''));
             }
        }
      }
    });
  };

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Current Word Display Preview */}
      <div className="h-12 mb-4 flex items-center justify-center">
        <span className="text-3xl font-bold text-white tracking-widest drop-shadow-md bg-black/30 px-6 py-2 rounded-full min-w-[100px] text-center transition-all">
          {currentWord}
        </span>
      </div>

      <div 
        ref={containerRef}
        className="relative w-64 h-64 sm:w-80 sm:h-80 touch-none no-select"
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      >
        <svg viewBox="0 0 260 260" className="w-full h-full drop-shadow-xl">
           {/* Connection Lines */}
           <path 
             d={`M ${selectedIndices.map(i => {
               const pos = getLetterPosition(i, letters.length);
               return `${pos.x},${pos.y}`;
             }).join(' L ')} ${pointerPos && selectedIndices.length > 0 ? `L ${pointerPos.x},${pointerPos.y}` : ''}`}
             stroke="rgba(255, 255, 255, 0.6)"
             strokeWidth="10"
             strokeLinecap="round"
             strokeLinejoin="round"
             fill="none"
           />

           {/* Letters */}
           {letters.map((char, i) => {
             const pos = getLetterPosition(i, letters.length);
             const isSelected = selectedIndices.includes(i);
             return (
               <g key={i} transform={`translate(${pos.x}, ${pos.y})`}>
                 <circle 
                   r={letterRadius} 
                   className={`transition-colors duration-200 ${isSelected ? 'fill-orange-500' : 'fill-white/20 hover:fill-white/30'}`}
                   stroke={isSelected ? '#fff' : 'transparent'}
                   strokeWidth="2"
                 />
                 <text 
                   y="8" 
                   textAnchor="middle" 
                   className={`text-2xl font-bold select-none pointer-events-none ${isSelected ? 'fill-white' : 'fill-white'}`}
                   style={{ fontSize: '28px' }}
                 >
                   {char}
                 </text>
               </g>
             );
           })}
        </svg>
      </div>
      
      <button 
        onClick={onShuffle}
        className="absolute bottom-0 right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all active:scale-95"
      >
        <i className="fa-solid fa-shuffle text-xl"></i>
      </button>
    </div>
  );
};

export default Wheel;
