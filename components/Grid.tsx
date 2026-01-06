import React, { useMemo } from 'react';
import { WordPosition } from '../types';

interface GridProps {
  words: WordPosition[];
  gridSize?: number;
}

const Grid: React.FC<GridProps> = ({ words, gridSize = 8 }) => {
  
  // Calculate grid bounds dynamically
  const { minX, maxX, minY, maxY } = useMemo(() => {
    let minX = 0, maxX = 0, minY = 0, maxY = 0;
    words.forEach(w => {
        // Just ensure the grid covers these coords.
        // For simplicity, we stick to a fixed size grid usually, but dynamic centering is nicer.
    });
    return { minX, maxX, minY, maxY };
  }, [words]);

  // Create a map of cells
  const cells = useMemo(() => {
    const grid: Record<string, string> = {}; // "x,y" -> char
    const foundStatus: Record<string, boolean> = {}; // "x,y" -> isFound

    words.forEach(wordObj => {
      const chars = wordObj.word.split('');
      chars.forEach((char, index) => {
        const x = wordObj.direction === 'horizontal' ? wordObj.startX + index : wordObj.startX;
        const y = wordObj.direction === 'vertical' ? wordObj.startY + index : wordObj.startY;
        const key = `${x},${y}`;
        grid[key] = char;
        if (wordObj.found) {
             foundStatus[key] = true;
        } else {
             // If a cell is part of multiple words, it's found only if ONE of them is found? 
             // Typically in these games, a letter is revealed if ANY word containing it is found.
             // But usually visual state tracks words.
             // We will handle "cell revealed" logic: A cell is revealed if ANY word crossing it is found.
             if (foundStatus[key] === undefined) foundStatus[key] = false;
        }
      });
      
      // Update found status again to ensure shared cells are revealed
      if(wordObj.found) {
          chars.forEach((_, index) => {
            const x = wordObj.direction === 'horizontal' ? wordObj.startX + index : wordObj.startX;
            const y = wordObj.direction === 'vertical' ? wordObj.startY + index : wordObj.startY;
            foundStatus[`${x},${y}`] = true;
          });
      }
    });
    return { grid, foundStatus };
  }, [words]);

  // Determine bounds for rendering
  const allKeys = Object.keys(cells.grid);
  if (allKeys.length === 0) return <div></div>;

  const xs = allKeys.map(k => parseInt(k.split(',')[0]));
  const ys = allKeys.map(k => parseInt(k.split(',')[1]));
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const yMin = Math.min(...ys);
  const yMax = Math.max(...ys);

  const width = xMax - xMin + 1;
  const height = yMax - yMin + 1;

  return (
    <div 
      className="relative mx-auto transition-all duration-500"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${width}, minmax(30px, 1fr))`,
        gridTemplateRows: `repeat(${height}, minmax(30px, 1fr))`,
        gap: '4px',
        maxWidth: '90vw',
        maxHeight: '40vh',
        aspectRatio: `${width}/${height}`
      }}
    >
      {Array.from({ length: height * width }).map((_, i) => {
        const x = (i % width) + xMin;
        const y = Math.floor(i / width) + yMin;
        const key = `${x},${y}`;
        const char = cells.grid[key];
        const isFound = cells.foundStatus[key];

        if (!char) {
          return <div key={i} className="bg-transparent" />;
        }

        return (
          <div 
            key={i}
            className={`
              relative flex items-center justify-center rounded-md font-bold text-lg sm:text-xl shadow-sm
              transition-all duration-500 transform
              ${isFound 
                ? 'bg-orange-500 text-white scale-100' 
                : 'bg-white/30 text-transparent scale-95'
              }
            `}
          >
             {/* Always render text but hide it if not found for accessibility/layout */}
            <span className={isFound ? 'animate-bounce' : 'opacity-0'}>{char}</span>
          </div>
        );
      })}
    </div>
  );
};

export default Grid;
