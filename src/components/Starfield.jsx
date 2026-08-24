import { useEffect, useState } from 'react';

const Starfield = () => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const generateStars = () => {
      const newStars = Array.from({ length: 150 }).map(() => ({
        id: Math.random().toString(36).substring(7),
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        animationDuration: Math.random() * 3 + 2,
        opacity: Math.random()
      }));
      setStars(newStars);
    };

    generateStars();
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 1,
      pointerEvents: 'none',
      overflow: 'hidden'
    }}>
      {stars.map((star) => (
        <div
          key={star.id}
          className="animate-flicker"
          style={{
            position: 'absolute',
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: 'white',
            borderRadius: '50%',
            opacity: star.opacity,
            animationDuration: `${star.animationDuration}s`
          }}
        />
      ))}
    </div>
  );
};

export default Starfield;
