import { useState, useRef, useEffect, useCallback } from 'react';

const AudioPlayer = ({ song, autoplay = true }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [needsInteraction, setNeedsInteraction] = useState(false);
  const audioRef = useRef(null);

  const playAudio = useCallback(async () => {
    if (!audioRef.current || !song?.src) return false;

    try {
      await audioRef.current.play();
      setIsPlaying(true);
      setNeedsInteraction(false);
      return true;
    } catch (error) {
      console.warn('Autoplay blocked, waiting for interaction:', error);
      setNeedsInteraction(true);
      return false;
    }
  }, [song?.src]);

  useEffect(() => {
    if (!autoplay || !song?.src) return;
    playAudio();
  }, [autoplay, song?.src, playAudio]);

  const togglePlay = () => {
    if (!song?.src) return;

    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }

    playAudio();
  };

  const handleStart = () => {
    playAudio();
  };

  if (!song?.src) return null;

  return (
    <>
      {needsInteraction && (
        <button
          type="button"
          className="music-start-overlay"
          onClick={handleStart}
          aria-label="Start music"
        >
          <span className="music-start-icon">🎵</span>
          <span className="font-display">Tap to begin your surprise</span>
        </button>
      )}

      <div className="audio-player">
        <button
          type="button"
          onClick={togglePlay}
          className="audio-play-btn"
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        <div className="audio-meta">
          <span className="audio-title">{song.title || 'Our Song'}</span>
          <span className="audio-subtitle">
            {isPlaying ? 'Now playing for you' : song.subtitle || 'Tap to play'}
          </span>
        </div>

        <audio
          ref={audioRef}
          src={song.src}
          loop
          preload="auto"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      </div>
    </>
  );
};

export default AudioPlayer;
