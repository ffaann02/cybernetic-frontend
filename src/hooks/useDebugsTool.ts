import { useEffect, useState } from 'react';

export function useDebugTools() {
  const [showDebugTools, setShowDebugTools] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.key==='/')) {
        setShowDebugTools((prevShowDebugTools) => !prevShowDebugTools);
      } else if (event.key === "Escape") {
        setShowDebugTools(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return showDebugTools;
}