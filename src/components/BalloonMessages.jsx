import { useEffect, useMemo, useRef, useState } from 'react';
import confetti from 'canvas-confetti';

const TARGET_WORDS = ['I', 'am', 'sorry'];

function shuffle(array) {
  let a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function BalloonMessages({ shyari, song, photos, onFinish }) {
  const arenaRef = useRef(null);
  const [balloons, setBalloons] = useState([]);
  const [collected, setCollected] = useState([]);
  const popSoundRef = useRef(null);

  const decoys = useMemo(() => ['please', 'forgive', 'miss', 'hug', 'love', 'hey'], []);

  useEffect(() => {
    const pool = shuffle([...TARGET_WORDS, ...decoys]).slice(0, 7);
    const items = pool.map((w, i) => ({ id: `b-${i}`, word: w, popped: false, left: 8 + i * 12 + Math.random() * 8 }));
    setBalloons(items);
  }, []);

  useEffect(() => {
    popSoundRef.current = new Audio('/music/pop.mp3');
    popSoundRef.current.volume = 0.6;
  }, []);

  const handlePop = (id) => {
    setBalloons((prev) => prev.map((b) => (b.id === id ? { ...b, popped: true } : b)));
    const popped = balloons.find((b) => b.id === id);
    if (popSoundRef.current) {
      try { popSoundRef.current.currentTime = 0; popSoundRef.current.play(); } catch (e) {}
    }
    if (popped && TARGET_WORDS.includes(popped.word)) {
      setCollected((c) => {
        const next = [...c, popped.word];
        const unique = Array.from(new Set(next));
        if (unique.length === TARGET_WORDS.length) {
          // celebration
          confetti({ particleCount: 120, spread: 70, origin: { y: 0.2 } });
          setTimeout(() => onFinish && onFinish(), 1400);
        }
        return next;
      });
    }
  };

  const renderBalloon = (b, idx) => (
    <button
      key={b.id}
      className={`balloon ${b.popped ? 'popped' : ''}`}
      style={{ left: `${b.left}%`, animationDelay: `${idx * 0.18}s` }}
      onClick={() => !b.popped && handlePop(b.id)}
      aria-label={b.popped ? `${b.word} revealed` : 'Pop balloon'}
    >
      {!b.popped ? '🎈' : <span className="balloon-word">{b.word}</span>}
    </button>
  );

  return (
    <div className="mini-game-overlay">
      <div className="mini-game-card">
        <h3 className="mini-title">Balloon Messages</h3>
        <p className="mini-instruction">Pop the balloons to reveal words — collect them to form "I am sorry".</p>

        <div className="balloon-arena" ref={arenaRef}>
          {balloons.map((b, i) => renderBalloon(b, i))}
        </div>

        <div className="bouquet-list">
          <div className="bouquet-line">Collected:</div>
          <div className="balloon-sentence">
            {TARGET_WORDS.map((w, i) => (
              <span key={w} className={`sentence-word ${collected.includes(w) ? 'revealed' : ''}`}>{collected.includes(w) ? w : '____'}</span>
            ))}
          </div>
        </div>

        <div className="mini-finish">
          {Array.from(new Set(collected)).length === TARGET_WORDS.length && (
            <div className="mini-finish-text">All set — {TARGET_WORDS.join(' ')} 🎉</div>
          )}
        </div>
      </div>
    </div>
  );
}
