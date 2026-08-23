import { useState } from 'react';
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import imageCompression from 'browser-image-compression';
import { db, storage } from '../config/firebase';

const AdminPanel = ({ onSetupComplete, hasConfig, onClose }) => {
  const [setupData, setSetupData] = useState({ name: '', birthMonth: '', birthDate: '', birthYear: '' });
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaCaption, setMediaCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // 10MB limit
  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  const handleSetupSubmit = async (e) => {
    e.preventDefault();
    if (!db) return setError("Firebase not connected.");
    
    try {
      await setDoc(doc(db, 'config', 'main'), {
        name: setupData.name,
        birthMonth: parseInt(setupData.birthMonth),
        birthDate: parseInt(setupData.birthDate),
        birthYear: parseInt(setupData.birthYear)
      });
      onSetupComplete();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFileChange = (e) => {
    setError('');
    const file = e.target.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setError("File is too large. Maximum size is 10MB.");
        setMediaFile(null);
      } else {
        setMediaFile(file);
      }
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!mediaFile || !db || !storage) return setError("Missing file or Firebase connection");
    
    setUploading(true);
    setError('');
    setSuccess('');

    try {
      let fileToUpload = mediaFile;
      let type = 'image';

      if (mediaFile.type.startsWith('video/')) type = 'video';
      else if (mediaFile.type.startsWith('audio/')) type = 'audio';
      else if (mediaFile.type.startsWith('image/')) {
        // Compress Image
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1000,
          useWebWorker: true,
          initialQuality: 0.8
        };
        fileToUpload = await imageCompression(mediaFile, options);
      } else {
        throw new Error("Unsupported file type");
      }

      // Upload to Storage
      const storageRef = ref(storage, `memories/${Date.now()}_${fileToUpload.name}`);
      await uploadBytes(storageRef, fileToUpload);
      const downloadURL = await getDownloadURL(storageRef);

      // Save metadata to Firestore
      await addDoc(collection(db, 'memories'), {
        url: downloadURL,
        type: type,
        caption: mediaCaption,
        createdAt: new Date().toISOString()
      });

      setSuccess("Uploaded successfully!");
      setMediaFile(null);
      setMediaCaption('');
      e.target.reset();
      
      // Auto-refresh the main UI to show the new upload!
      if (onSetupComplete) {
        onSetupComplete();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'var(--bg-color)',
      padding: '2rem',
      borderRadius: '12px',
      border: '1px solid rgba(255,255,255,0.1)',
      zIndex: 1000,
      width: '90%',
      maxWidth: '400px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.8)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 className="font-display">Admin Panel</h2>
        {hasConfig && (
          <button onClick={onClose} style={{ background: 'transparent', padding: '0', color: 'white', width: 'auto' }}>✕</button>
        )}
      </div>

      {error && <div style={{ color: 'var(--coral-color)', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
      {success && <div style={{ color: 'var(--teal-color)', marginBottom: '1rem', fontSize: '0.9rem' }}>{success}</div>}

      {!hasConfig ? (
        <form onSubmit={handleSetupSubmit}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem', opacity: 0.8 }}>Initial Setup</h3>
          <input required placeholder="Her Name" value={setupData.name} onChange={e => setSetupData({...setupData, name: e.target.value})} />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input required type="number" min="1" max="12" placeholder="Month (1-12)" value={setupData.birthMonth} onChange={e => setSetupData({...setupData, birthMonth: e.target.value})} />
            <input required type="number" min="1" max="31" placeholder="Date (1-31)" value={setupData.birthDate} onChange={e => setSetupData({...setupData, birthDate: e.target.value})} />
          </div>
          <input required type="number" placeholder="Birth Year (e.g. 2000)" value={setupData.birthYear} onChange={e => setSetupData({...setupData, birthYear: e.target.value})} />
          <button type="submit" style={{ width: '100%' }}>Save Config</button>
        </form>
      ) : (
        <form onSubmit={handleUploadSubmit}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem', opacity: 0.8 }}>Add Memory / Song</h3>
          <input required type="file" accept="image/*,video/*,audio/*" onChange={handleFileChange} style={{ padding: '0.5rem 0' }} />
          <textarea 
            placeholder="Optional Caption" 
            value={mediaCaption}
            onChange={e => setMediaCaption(e.target.value)}
            rows={2}
          />
          <button type="submit" disabled={uploading} style={{ width: '100%', opacity: uploading ? 0.7 : 1 }}>
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
      )}
    </div>
  );
};

export default AdminPanel;
