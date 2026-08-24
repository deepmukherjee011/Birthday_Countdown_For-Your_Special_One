import { useEffect, useRef, useState } from 'react';

const SurpriseBubble = ({ text, onPop, index }) => (
  <button
    className="mini-bubble"
    onClick={() => onPop(index)}
    aria-label={`surprise-${index}`}
  >
    🎈
    <span className="bubble-label">{text}</span>
  </button>
);

export default function MiniGame({ shyari, song, onFinish }) {
  const audioRef = useRef(null);
  const [popped, setPopped] = useState([]);
  const [finished, setFinished] = useState(false);

  const surprises = [
    'মিষ্টি স্মৃতি',
    'শেয়ার করা মূহুর্ত',
    'চমক আছে!',
  ];

  useEffect(() => {
    if (audioRef.current) {
      const p = audioRef.current.play();
      if (p && p.catch) p.catch(() => {});
    }
  }, []);

  function handlePop(i) {
    if (popped.includes(i)) return;
    setPopped((s) => [...s, i]);
    // small surprise sound or visual could be added
    if (popped.length + 1 >= surprises.length) {
      setTimeout(() => setFinished(true), 600);
    }
  }

  return (
    <div className="mini-game-overlay" role="dialog" aria-modal="true">
      <audio ref={audioRef} src={song?.src} loop preload="auto" />

      <div className="mini-game-card">
        <h2 className="mini-title">A little game for us 🎉</h2>

        <div className="shayari-preview">
          <p className="mini-shayari-line">{shyari?.lines?.[0]}</p>
          <p className="mini-shayari-line small">{shyari?.lines?.[1]}</p>
        </div>

        <div className="bubble-area">
          {surprises.map((s, i) => (
            <SurpriseBubble key={i} text={s} index={i} onPop={handlePop} />
          ))}
        </div>

        {finished ? (
          <div className="mini-finish">
            <p className="mini-finish-text">You found all the surprises! ❤️</p>
            <button
              className="mini-finish-btn"
              onClick={() => {
                if (audioRef.current) audioRef.current.pause();
                if (onFinish) onFinish();
              }}
            >
              Continue to the surprise
            </button>
          </div>
        ) : (
          <p className="mini-instruction">Tap all the balloons for tiny surprises</p>
        )}
      </div>
    </div>
  );
}
