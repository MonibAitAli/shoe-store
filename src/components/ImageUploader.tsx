'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  label: string;
  description?: string;
  value: string;
  onChange: (base64: string) => void;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export default function ImageUploader({
  label,
  description,
  value,
  onChange,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.8,
}: ImageUploaderProps) {
  const [dragging, setDragging] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const compressImage = useCallback((file: File) => {
    setCompressing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        // Scale down while preserving aspect ratio
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to base64 JPEG
        const base64 = canvas.toDataURL('image/jpeg', quality);
        onChange(base64);
        setCompressing(false);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, [maxWidth, maxHeight, quality, onChange]);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    if (file.size > 15 * 1024 * 1024) {
      alert('Image must be under 15MB');
      return;
    }
    compressImage(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    onChange('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div>
      <label className="block text-sm font-medium text-on-surface mb-1">{label}</label>
      {description && <p className="text-xs text-muted mb-2">{description}</p>}

      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-border-subtle">
          <img src={value} alt={label} className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="bg-white text-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
            >
              <Upload size={14} className="inline mr-1" /> Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition"
            >
              <X size={14} className="inline mr-1" /> Remove
            </button>
          </div>
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <ImageIcon size={10} /> Uploaded
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            dragging ? 'border-secondary bg-secondary/5' : 'border-border-subtle hover:border-secondary/50'
          }`}
        >
          {compressing ? (
            <div className="text-muted text-sm">Processing image...</div>
          ) : (
            <>
              <Upload size={24} className="mx-auto mb-2 text-muted" />
              <p className="text-sm font-medium text-on-surface">Click to upload or drag & drop</p>
              <p className="text-xs text-muted mt-1">JPG, PNG, WebP — max 15MB</p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
}
