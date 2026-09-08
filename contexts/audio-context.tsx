"use client";

import { createContext, useContext, useRef, useState, useCallback } from "react";

interface AudioContextType {
  isPlaying: boolean;
  toggle: () => void;
}

const AudioCtx = createContext<AudioContextType>({
  isPlaying: false,
  toggle: () => {},
});

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [isPlaying]);

  return (
    <AudioCtx.Provider value={{ isPlaying, toggle }}>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio
        ref={audioRef}
        src="/audio/riz-intro.mp3"
        preload="none"
        onEnded={() => setIsPlaying(false)}
      />
      {children}
    </AudioCtx.Provider>
  );
}

export function useAudio() {
  return useContext(AudioCtx);
}
