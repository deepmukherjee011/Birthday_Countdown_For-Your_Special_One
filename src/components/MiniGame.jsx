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

export default function MiniGame({ shyari, song, onFinish }) {
  const audioRef = useRef(null);
  const [targets, setTargets] = useState(() => (
    Array.from({length:6}).map((_,i)=>({id:i,x:20+Math.random()*60,y:20+Math.random()*60,hit:false}))
  ));
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(()=>{
    if(audioRef.current){
      const p = audioRef.current.play(); if(p && p.catch) p.catch(()=>{});
    }
  },[]);

  useEffect(()=>{
    if(done && onFinish){
      // brief delay then continue
      setTimeout(()=> onFinish(), 900);
    }
  },[done,onFinish]);

  function handleHit(id){
    setTargets(prev=> prev.map(t=> t.id===id?{...t,hit:true}:t));
    setScore(s=> s+1);
    // move that target after hit
    setTimeout(()=>{
      setTargets(prev=> prev.map(t=> t.id===id?{...t,hit:false,x:10+Math.random()*75,y:10+Math.random()*75}:t));
    },400);
    if(score+1 >= targets.length){
      setDone(true);
    }
  }

  return (
    <div className="mini-game-overlay" role="dialog" aria-modal>
      <audio ref={audioRef} src={song?.src} loop preload="auto" />
      <div className="mini-game-card">
        <h2 className="mini-title">Fun for Today 🎯</h2>
        <div className="shayari-preview">
          <p className="mini-shayari-line">{shyari?.lines?.[0]}</p>
        </div>

        <div className="target-arena" aria-hidden>
          {targets.map(t=> (
            <button
              key={t.id}
              className={`target ${t.hit? 'hit':''}`}
              style={{left: `${t.x}%`, top: `${t.y}%`}}
              onClick={() => handleHit(t.id)}
              aria-label={`target-${t.id}`}
            >
              ❤️
            </button>
          ))}
        </div>

        <div style={{marginTop:12}}>
          <div style={{fontSize: '0.95rem'}}>Score: <strong>{score}</strong></div>
        </div>

        {done && (
          <div className="mini-finish">
            <Confetti count={40} />
            <p className="mini-finish-text">Woo! Surprise unlocked 🎉</p>
            <button className="mini-finish-btn" onClick={()=>{ if(audioRef.current) audioRef.current.pause(); setDone(false); if(onFinish) onFinish(); }}>
              See surprise
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
