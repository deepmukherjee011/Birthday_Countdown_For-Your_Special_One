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

function shuffle(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}

export default function MiniGame({ shyari, song, photos = [], onFinish }) {
  const audioRef = useRef(null);
  const [deck, setDeck] = useState([]);
  const [flipped, setFlipped] = useState([]); // ids
  const [matched, setMatched] = useState(new Set());
  const [busy, setBusy] = useState(false);
  const [won, setWon] = useState(false);

  useEffect(()=>{
    // prepare a simple 3-pair memory deck using the first 3 photos
    const base = (photos && photos.length >= 3) ? photos.slice(0,3) : [
      {src: '/photos/pihu-1.jpeg'},
      {src: '/photos/pihu-2.jpeg'},
      {src: '/photos/pihu-3.jpeg'},
    ];
    const items = base.flatMap((p,i)=> ([
      {uid: `a-${i}`, pair: i, src: p.src},
      {uid: `b-${i}`, pair: i, src: p.src},
    ]));
    setDeck(shuffle(items));
  },[photos]);

  useEffect(()=>{
    if(audioRef.current){
      const p = audioRef.current.play(); if(p && p.catch) p.catch(()=>{});
    }
  },[]);

  useEffect(()=>{
    if(matched.size > 0 && matched.size === deck.length){
      setWon(true);
      if(audioRef.current) audioRef.current.pause();
    }
  },[matched,deck]);

  function handleFlip(uid){
    if(busy) return;
    if(flipped.includes(uid) || matched.has(uid)) return;
    const next = [...flipped, uid];
    setFlipped(next);
    if(next.length === 2){
      const [u1,u2] = next;
      const c1 = deck.find(d=>d.uid===u1);
      const c2 = deck.find(d=>d.uid===u2);
      if(c1 && c2){
        if(c1.pair === c2.pair){
          // mark matched (store both uids in the set)
          setMatched(prev => new Set([...Array.from(prev), u1, u2]));
          setFlipped([]);
        } else {
          setBusy(true);
          setTimeout(()=>{
            setFlipped([]);
            setBusy(false);
          },700);
        }
      }
    }
  }

  return (
    <div className="mini-game-overlay" role="dialog" aria-modal>
      <audio ref={audioRef} src={song?.src} loop preload="auto" />
      <div className="mini-game-card">
        <h2 className="mini-title">Memory Match — Find the Pairs 💞</h2>
        <div className="shayari-preview">
          <p className="mini-shayari-line small">{shyari?.lines?.[0]}</p>
        </div>

        <div className="memory-board" aria-hidden>
          {deck.map(card => {
            const isFlipped = flipped.includes(card.uid) || matched.has(card.uid) || won;
            return (
              <button
                key={card.uid}
                className={`card ${isFlipped? 'flipped':''}`}
                onClick={() => handleFlip(card.uid)}
                disabled={matched.has(card.uid) || busy}
                aria-label={`card-${card.uid}`}
              >
                <div className="card-inner">
                  <div className="card-front" />
                  <div className="card-back">
                    <img src={card.src} alt="memory" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {won ? (
          <div className="mini-finish">
            <Confetti count={40} />
            <p className="mini-finish-text">You matched all pairs — Surprise unlocked 🎉</p>
            <button className="mini-finish-btn" onClick={()=>{ if(onFinish) onFinish(); }}>
              See surprise
            </button>
          </div>
        ) : (
          <div className="mini-instruction">Flip two cards to find matching photos. Good luck!</div>
        )}

      </div>
    </div>
  );
}
