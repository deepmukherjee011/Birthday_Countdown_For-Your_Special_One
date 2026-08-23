import { useState, useRef, useEffect, useCallback } from 'react';

const AudioPlayer = ({ song, autoplay = true }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [needsInteraction, setNeedsInteraction] = useState(false);
  const [audioError, setAudioError] = useState('');
  const audioRef = useRef(null);

  useEffect(() => {
    setAudioError('');
    setNeedsInteraction(false);
    setIsPlaying(false);
  }, [song?.src]);

  const playAudio = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !song?.src) return false;

    try {
      audio.load();
      await audio.play();
      setIsPlaying(true);
      setNeedsInteraction(false);
      setAudioError('');
      return true;
    } catch (error) {
      if (error?.name === 'NotAllowedError') {
        setNeedsInteraction(true);
        setAudioError('');
      } else {
        setNeedsInteraction(false);
        setAudioError('Song could not load. Add public/music/our-song.mp3 or upload via the admin panel.');
      }
      return false;
    }
  }, [song?.src]);

  useEffect(() => {
    if (!autoplay || !song?.src) return;

    const tryAutoplay = async () => {
      const audio = audioRef.current;
      if (!audio) return;

      try {
        await audio.play();
        setIsPlaying(true);
        setNeedsInteraction(false);
      } catch (error) {
        if (error?.name === 'NotAllowedError') {
          setNeedsInteraction(true);
        }
      }
    };

    tryAutoplay();
  }, [autoplay, song?.src]);

  const handleAudioError = () => {
    setIsPlaying(false);
    setNeedsInteraction(false);
    setAudioError('Song file not found. Add public/music/our-song.mp3 or upload via the admin panel.');
  };

  const togglePlay = async () => {
    if (!song?.src || audioError) return;

    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }

    await playAudio();
  };

  const handleStart = async () => {
    await playAudio();
  };

  if (!song?.src) return null;

  return (
    <>
      {needsInteraction && !audioError && (
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
          disabled={Boolean(audioError)}
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        <div className="audio-meta">
          <span className="audio-title">{song.title || 'Our Song'}</span>
          <span className="audio-subtitle">
            {audioError
              ? audioError
              : isPlaying
                ? 'Now playing for you'
                : song.subtitle || 'Tap to play'}
          </span>
        </div>

        <audio
          ref={audioRef}
          src={song.src}
          loop
          preload="auto"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onError={handleAudioError}
        />
      </div>
    </>
  );
};

export default AudioPlayer;
