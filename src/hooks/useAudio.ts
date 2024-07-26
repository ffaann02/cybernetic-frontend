import { useEffect, useRef } from "react";

const useAudio = (sound, volume = 1.0, duration_percent = 100, onEnd) => {
  const audioRef = useRef(new Audio(sound));

  useEffect(() => {
    if (sound) {
      audioRef.current.src = sound;
      audioRef.current.volume = volume;

      const handleLoadedMetadata = () => {
        const durationInMilliseconds = (audioRef.current.duration * duration_percent) / 100 * 1000;
        audioRef.current.addEventListener('play', () => {
          setTimeout(() => {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }, durationInMilliseconds);
        });
      };

      const handleEnded = () => {
        if (onEnd) onEnd();
      };

      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      audioRef.current.addEventListener('ended', handleEnded);

      return () => {
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioRef.current.removeEventListener('ended', handleEnded);
      };
    }
  }, [sound, volume, duration_percent, onEnd]);

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  const playAudio = () => {
    audioRef.current.play();
  };

  return playAudio;
};

export default useAudio;
