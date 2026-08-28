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

export default function ApologyBouquet({ shyari, song, onFinish }){
  const audioRef = useRef(null);
  const [flowers, setFlowers] = useState(() => (
    Array.from({length:7}).map((_,i)=>({
      id: i,
      left: 6 + Math.random()*88,
      delay: Math.random()*3,
      duration: 6 + Math.random()*6,
      color: ['#FF6B6B','#FFD166','#7EE3C7','#A78BFA','#FF7AB6','#4FA8A0','#E8836B'][i%7],
      collected: false,
    }))
  ));
  const [collectedLines, setCollectedLines] = useState([]);
  const [done, setDone] = useState(false);

  useEffect(()=>{
    if(audioRef.current){
      const p = audioRef.current.play(); if(p && p.catch) p.catch(()=>{});
    }
  },[]);

  const lines = shyari?.lines || [];

  function collectFlower(id){
    setFlowers(prev => prev.map(f => f.id===id ? {...f, collected: true} : f));
    // reveal next line or a short phrase
    setCollectedLines(prev => {
      const next = lines[prev.length] || `I'm sorry ${prev.length+1}`;
      return [...prev, next];
    });
  }

  useEffect(()=>{
    if(collectedLines.length >= flowers.length){
      setDone(true);
      if(audioRef.current) audioRef.current.pause();
      setTimeout(()=>{ if(onFinish) onFinish(); }, 1200);
    }
  },[collectedLines, flowers.length, onFinish]);

  return (
    <div className="mini-game-overlay" role="dialog" aria-modal>
      <audio ref={audioRef} src={song?.src} loop preload="auto" />
      <div className="mini-game-card">
        <h2 className="mini-title">Apology Bouquet — collect flowers 🌸</h2>
        <div className="shayari-preview">
          <p className="mini-shayari-line small">{shyari?.lines?.[0]}</p>
        </div>

        <div className="flower-arena" aria-hidden>
          {flowers.map(f => (
            <button
              key={f.id}
              className={`flower ${f.collected? 'collected':''}`}
              style={{left: `${f.left}%`, animationDelay: `${f.delay}s`, animationDuration: `${f.duration}s`, background: f.color}}
              onClick={() => !f.collected && collectFlower(f.id)}
              aria-label={`flower-${f.id}`}
            >
              {f.collected ? '💐' : '🌺'}
            </button>
          ))}
        </div>

        <div className="bouquet-list">
          {collectedLines.map((l,idx)=> (
            <div key={idx} className="bouquet-line">{l}</div>
          ))}
        </div>

        {done && (
          <div className="mini-finish">
            <Confetti count={50} />
            <p className="mini-finish-text">Bouquet complete — Forgive me? 💖</p>
            <button className="mini-finish-btn" onClick={()=>{ if(onFinish) onFinish(); }}>
              See surprise
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
