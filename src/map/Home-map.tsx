import React from 'react';

interface HomeProps {
  gridSize: number;
  playerPosition: { x: number; y: number };
}

const HomeMap: React.FC<HomeProps> = ({ gridSize, playerPosition }) => {
  // Create an array from 0 to gridSize - 1
  const grid = Array.from({ length: gridSize }, (_, i) => i);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      {grid.map((_, j) => (
        <div key={j} className="flex w-full">
          {grid.map((_, i) => (
            <div
              key={i}
              className={`relative border flex-grow aspect-square ${
                playerPosition.x === i && playerPosition.y === j ? 'bg-blue-500' : 'bg-green-200'
              }`}
            >
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default HomeMap;
