const ShayariCard = ({ title, lines }) => {
  if (!lines || lines.length === 0) return null;

  return (
    <div className="shayari-card animate-float">
      {title && (
        <p className="shayari-title font-display text-glow">{title}</p>
      )}
      <div className="shayari-lines">
        {lines.map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
    </div>
  );
};

export default ShayariCard;
