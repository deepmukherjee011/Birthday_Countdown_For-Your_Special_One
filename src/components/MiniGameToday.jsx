import { useEffect, useRef, useState } from 'react';

function Confetti({count=30}){
  const pieces = Array.from({length: count});
  return (
    <div className="confetti-root" aria-hidden>
      {pieces.map((_,i)=> (
        <div key={i} className={`confetti-piece p-${i%6}`} />
      ))}
    </div>
  )
}

export default function MiniGameToday({ shyari, song, onFinish }){
  const audioRef = useRef(null);
  const [balloons, setBalloons] = useState(() => (
    Array.from({length:8}).map((_,i)=>({
      id: i,
      left: 6 + Math.random()*88,
      duration: 6 + Math.random()*6,
      color: ['#FF6B6B','#FFD166','#7EE3C7','#A78BFA','#FF7AB6','#4FA8A0'][i%6],
      popped: false,
    }))
  ));
  const [score, setScore] = useState(0);
  const [won, setWon] = useState(false);

  useEffect(()=>{
    if(audioRef.current){
      const p = audioRef.current.play(); if(p && p.catch) p.catch(()=>{});
    }
  },[]);

  function popBalloon(id){
    setBalloons(prev => prev.map(b=> b.id===id?{...b,popped:true}:b));
    setScore(s=> s+1);
  }

  useEffect(()=>{
    if(score >= balloons.length){
      setWon(true);
      if(audioRef.current) audioRef.current.pause();
      setTimeout(()=>{ if(onFinish) onFinish(); }, 900);
    }
  },[score,balloons.length,onFinish]);

  return (
    <div className="mini-game-overlay" role="dialog" aria-modal>
      <audio ref={audioRef} src={song?.src} loop preload="auto" />
      <div className="mini-game-card">
        <h2 className="mini-title">Balloon Pop — Pop them all! 🎈</h2>
        <div className="shayari-preview">
          <p className="mini-shayari-line small">{shyari?.lines?.[0]}</p>
        </div>

        <div className="balloon-arena" aria-hidden>
          {balloons.map(b => (
            <button
              key={b.id}
              className={`balloon ${b.popped? 'popped':''}`}
              style={{left: `${b.left}%`, animationDuration: `${b.duration}s`, background: b.color}}
              onClick={() => !b.popped && popBalloon(b.id)}
              aria-label={`balloon-${b.id}`}
            >
              {b.popped ? '💥' : '🎈'}
            </button>
          ))}
        </div>

        <div style={{marginTop:12}}>
          <div style={{fontSize: '0.95rem'}}>Popped: <strong>{score}/{balloons.length}</strong></div>
        </div>

        {won && (
          <div className="mini-finish">
            <Confetti count={60} />
            <p className="mini-finish-text">Amazing! Surprise unlocked 🎉</p>
            <button className="mini-finish-btn" onClick={()=>{ if(onFinish) onFinish(); }}>
              See surprise
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
