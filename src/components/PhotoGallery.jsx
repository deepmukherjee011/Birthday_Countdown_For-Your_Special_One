const PhotoGallery = ({ photos }) => {
  if (!photos || photos.length === 0) return null;

  return (
    <div className="photo-gallery">
      {photos.map((photo, index) => (
        <div
          key={photo.src}
          className="polaroid"
          style={{ transform: `rotate(${photo.rotate ?? 0}deg)` }}
        >
          <img src={photo.src} alt={photo.caption || `Memory ${index + 1}`} />
          {photo.caption && (
            <p className="polaroid-caption font-handwritten">{photo.caption}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default PhotoGallery;
