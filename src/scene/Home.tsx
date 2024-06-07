import React, { useEffect, useState } from "react";
import HomeMap from "../map/Home-map";

const Home: React.FC = () => {
  // Function to handle player movement
  const [playerPosition, setPlayerPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 4, y: 4 });
  const GRID_SIZE = 10;

  const handlePlayerMove = (direction: string) => {
    const { x, y } = playerPosition;
    switch (direction) {
      case "w":
        if (y > 0) setPlayerPosition({ x, y: y - 1 });
        break;
      case "s":
        if (y < GRID_SIZE - 1) setPlayerPosition({ x, y: y + 1 });
        break;
      case "a":
        if (x > 0) setPlayerPosition({ x: x - 1, y });
        break;
      case "d":
        if (x < GRID_SIZE - 1) setPlayerPosition({ x: x + 1, y });
        break;
      default:
        break;
    }
  };

  // Event listener for keyboard input
  const handleKeyDown = (event: KeyboardEvent) => {
    const { key } = event;
    if (["w", "a", "s", "d"].includes(key)) {
      handlePlayerMove(key);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [playerPosition]);

  return (
    <div>
      <HomeMap gridSize={GRID_SIZE} playerPosition={playerPosition} />
    </div>
  );
};
export default Home;
