import React, { useState } from 'react';
import { XCircle, Upload, Save, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { storage, db } from '../../firebase'; // Assuming firebase.js is set up
const BrandingModal = ({ isOpen, onClose, user, currentLetterhead, currentWatermark }) => {
  const [letterheadFile, setLetterheadFile] = useState(null);
  const [watermarkFile, setWatermarkFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e, setFile) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const uploadImage = async (file, path) => {
    if (!file) return null;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSave = async () => {
    if (!user) return;
    setIsUploading(true);
    toast.loading("Uploading branding assets...");

    try {
      let letterheadUrl = currentLetterhead;
      let watermarkUrl = currentWatermark;

      // Upload Letterhead
      if (letterheadFile) {
        const path = `branding/${user.uid}/letterhead_${Date.now()}`;
        letterheadUrl = await uploadImage(letterheadFile, path);
      }

      // Upload Watermark
      if (watermarkFile) {
        const path = `branding/${user.uid}/watermark_${Date.now()}`;
        watermarkUrl = await uploadImage(watermarkFile, path);
      }

      // Update Firestore
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        letterheadUrl: letterheadUrl || null,
        watermarkUrl: watermarkUrl || null
      });

      toast.dismiss();
      toast.success("Branding updated successfully!");
      onClose();
    } catch (error) {
      console.error("Branding upload error:", error);
      toast.dismiss();
      toast.error("Failed to save branding.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
          <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <ImageIcon className="text-blue-500" /> Branding Settings
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <XCircle size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Letterhead Input */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Letterhead / Header Image</label>
            <p className="text-xs text-slate-500 mb-2">Appears at the top of every report.</p>
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => handleFileChange(e, setLetterheadFile)}
              className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            />
            {currentLetterhead && !letterheadFile && (
              <p className="text-xs text-green-400 mt-2">✓ Current image active</p>
            )}
          </div>

          {/* Watermark Input */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Watermark Image</label>
            <p className="text-xs text-slate-500 mb-2">Appears in the center/background.</p>
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => handleFileChange(e, setWatermarkFile)}
              className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            />
             {currentWatermark && !watermarkFile && (
              <p className="text-xs text-green-400 mt-2">✓ Current image active</p>
            )}
          </div>

          <button 
            onClick={handleSave}
            disabled={isUploading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isUploading ? <span className="animate-pulse">Uploading...</span> : <><Save size={18} /> Save Branding</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrandingModal;