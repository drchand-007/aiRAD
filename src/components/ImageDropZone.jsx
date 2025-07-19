import React, { useRef, useState } from "react";
import { Upload, XCircle } from "lucide-react";
import Button from "./Button.jsx";

/** Utility → File → base64 + ObjectURL */
const fileToImageObject = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result.split(",")[1];
      const src = URL.createObjectURL(file);
      resolve({ src, base64, name: file.name, type: file.type });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

/**
 * ImageDropZone – handles drag‑drop, paste and file‑picker.
 * Props:
 *   images   Array<{src,base64,name,type}> – already selected images.
 *   onAdd    (files) => void  – called with **added** images.
 *   onRemove (index) => void  – remove by index.
 */
export default function ImageDropZone({
  images = [],
  onAdd = () => {},
  onRemove = () => {},
}) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  // Helpers
  const handleFiles = async (fileList) => {
    if (!fileList.length) return;
    const imgs = await Promise.all(
      [...fileList].filter((f) => f.type.startsWith("image/")).map(fileToImageObject)
    );
    if (imgs.length) onAdd(imgs);
  };

  /* ---------- Drag & drop ---------- */
  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  /* ---------- Paste ---------- */
  const onPaste = (e) => {
    const imgItems = [...e.clipboardData.items].filter((i) =>
      i.type.startsWith("image/")
    );
    if (imgItems.length) handleFiles(imgItems.map((i) => i.getAsFile()));
  };

  /* ---------- File picker ---------- */
  const openPicker = () => inputRef.current?.click();
  const onChangeInput = (e) => handleFiles(e.target.files);

  /* ---------- Render ---------- */
  return (
    <section
      className={`p-4 border-2 border-dashed rounded-lg text-center transition-colors cursor-pointer select-none ${
        isDragging ? "border-brandTeal bg-brandTeal/10" : "border-gray-300"
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onPaste={onPaste}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" ? openPicker() : null)}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        multiple
        onChange={onChangeInput}
      />

      <Upload className="mx-auto mb-2" />
      <p className="text-sm">
        {isDragging
          ? "Drop images here …"
          : images.length
          ? "Add more images"
          : "Click or drag images here"}
      </p>

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-4">
          {images.map((img, idx) => (
            <div key={idx} className="relative group">
              <img
                src={img.src}
                alt={img.name}
                className="w-full h-24 object-cover rounded-md shadow"
              />
              <button
                type="button"
                aria-label="Remove image"
                onClick={() => onRemove(idx)}
                className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus:outline-none"
              >
                <XCircle size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
