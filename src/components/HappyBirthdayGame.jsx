import { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';

export default function HappyBirthdayGame({ shyari, song, photos, onFinish }) {
  const audioRef = useRef(null);
  const [opened, setOpened] = useState([false, false, false]);

  useEffect(() => {
    audioRef.current = new Audio(song?.src || '/music/Happy Birthday pihu.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.6;
    const play = async () => {
      try { await audioRef.current.play(); } catch (e) { /* autoplay blocked */ }
    };
    play();

    return () => {
      try { audioRef.current.pause(); audioRef.current = null; } catch (e) {}
    };
  }, [song]);

  const handleOpen = (i) => {
    setOpened((s) => {
      const next = s.slice();
      next[i] = true;
      return next;
    });
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.35 } });
  };

  useEffect(() => {
    if (opened.every(Boolean)) {
      setTimeout(() => onFinish && onFinish(), 1400);
    }
  }, [opened, onFinish]);

  return (
    <div className="mini-game-overlay">
      <div className="mini-game-card">
        <h3 className="mini-title">Surprise Presents</h3>
        <p className="mini-instruction">Open all presents to reveal birthday messages for Pihu.</p>

        <div className="present-arena" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
          {[0,1,2].map((i) => (
            <button
              key={i}
              className={`present ${opened[i] ? 'opened' : ''}`}
              onClick={() => !opened[i] && handleOpen(i)}
              aria-label={`Open present ${i+1}`}
            >
              {!opened[i] ? '🎁' : <div className="present-content">{shyari.lines[i % shyari.lines.length]}</div>}
            </button>
          ))}
        </div>

        <div style={{ marginTop: '1rem' }}>
          {opened.every(Boolean) ? (
            <div className="mini-finish-text font-display text-glow">Happy Birthday Pihu! 🎉</div>
          ) : (
            <div className="mini-instruction">Open all presents to celebrate.</div>
          )}
        </div>
      </div>
    </div>
  );
}
