import { useState, useRef, useEffect } from 'react';

const AudioPlayer = ({ songs }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const audioRef = useRef(null);

  const currentSong = songs && songs.length > 0 ? songs[currentSongIndex] : null;

  useEffect(() => {
    // If the song changes while playing, try to autoplay the next one
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }
  }, [currentSongIndex]);

  const togglePlay = () => {
    if (!currentSong) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }
    setIsPlaying(!isPlaying);
  };

  const handleNextSong = () => {
    if (!songs || songs.length <= 1) return;
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
  };

  if (!currentSong) return null;

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      padding: '0.75rem 1.5rem',
      borderRadius: '50px',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      margin: '2rem auto 0',
      width: 'fit-content',
      border: '1px solid rgba(255,255,255,0.2)'
    }}>
      <button 
        onClick={togglePlay}
        style={{
          background: 'var(--glow-color)',
          color: 'var(--bg-color)',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 0,
          border: 'none',
          cursor: 'pointer'
        }}
      >
        {isPlaying ? '⏸' : '▶'}
      </button>
      
      {songs.length > 1 && (
        <button 
          onClick={handleNextSong}
          style={{
            background: 'transparent',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            padding: '0 5px',
            fontSize: '1.2rem',
            opacity: 0.8
          }}
        >
          ⏭
        </button>
      )}

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{currentSong.caption || 'Our Song'}</span>
        <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>
          {songs.length > 1 ? `Track ${currentSongIndex + 1} of ${songs.length}` : 'Tap to play'}
        </span>
      </div>

      <audio 
        ref={audioRef} 
        src={currentSong.url} 
        onEnded={handleNextSong}
        style={{ display: 'none' }} 
      />
    </div>
  );
};

export default AudioPlayer;
