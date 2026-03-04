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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-0 md:p-4">
      <div className="bg-background backdrop-blur-xl border border-border rounded-none md:rounded-2xl w-full h-full md:h-auto md:max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200 overflow-y-auto">
        <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <ImageIcon className="text-primary" /> Branding Settings
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <XCircle size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Letterhead Input */}
          <div>
            <label className="block text-sm font-bold text-foreground mb-2">Letterhead / Header Image</label>
            <p className="text-xs text-muted-foreground mb-2">Appears at the top of every report.</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, setLetterheadFile)}
              className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
            />
            {currentLetterhead && !letterheadFile && (
              <p className="text-xs text-emerald-500 mt-2">✓ Current image active</p>
            )}
          </div>

          {/* Watermark Input */}
          <div>
            <label className="block text-sm font-bold text-foreground mb-2">Watermark Image</label>
            <p className="text-xs text-muted-foreground mb-2">Appears in the center/background.</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, setWatermarkFile)}
              className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
            />
            {currentWatermark && !watermarkFile && (
              <p className="text-xs text-emerald-500 mt-2">✓ Current image active</p>
            )}
          </div>

          <button
            onClick={handleSave}
            disabled={isUploading}
            className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg"
          >
            {isUploading ? <span className="animate-pulse">Uploading...</span> : <><Save size={18} /> Save Branding</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrandingModal;