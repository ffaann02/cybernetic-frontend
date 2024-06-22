import { useEffect, useState } from "react";

const useAudio = (sound: string, volume: number = 1.0, duration_percent: number = 100) => {
  const [audio] = useState(new Audio(`/soundfx/character/${sound}.mp3`));

  useEffect(() => {
    audio.volume = volume;

    const handleLoadedMetadata = () => {
      const durationInMilliseconds = (audio.duration * duration_percent) / 100 * 1000;
      audio.addEventListener('play', () => {
        setTimeout(() => {
          audio.pause();
          audio.currentTime = 0;
        }, durationInMilliseconds);
      });
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [audio, volume, duration_percent]);

  const playAudio = () => {
    audio.play();
  };

  return playAudio;
};

export default useAudio;