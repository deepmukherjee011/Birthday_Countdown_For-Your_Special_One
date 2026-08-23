const MemoryPolaroid = ({ memory }) => {
  if (!memory) return null;

  return (
    <div style={{
      background: 'white',
      padding: '10px 10px 30px 10px',
      borderRadius: '4px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
      transform: 'rotate(-3deg)',
      maxWidth: '300px',
      margin: '2rem auto',
      transition: 'transform 0.3s ease',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(0deg) scale(1.05)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(-3deg) scale(1)'}
    >
      {memory.type === 'video' ? (
        <video 
          src={memory.url} 
          autoPlay 
          loop 
          muted 
          playsInline
          style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '2px' }}
        />
      ) : (
        <img 
          src={memory.url} 
          alt="Memory" 
          style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '2px' }}
        />
      )}
      
      {memory.caption && (
        <div 
          className="font-handwritten" 
          style={{ 
            color: '#333', 
            fontSize: '1.5rem', 
            textAlign: 'center',
            marginTop: '15px',
            lineHeight: 1.2
          }}
        >
          {memory.caption}
        </div>
      )}
    </div>
  );
};

export default MemoryPolaroid;
