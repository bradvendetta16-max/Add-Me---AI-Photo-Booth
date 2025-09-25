
import React, { useRef } from 'react';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  id: string;
  title: string;
  description: string;
  onImageUpload: (file: File) => void;
  imagePreview: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ id, title, description, onImageUpload, imagePreview }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="bg-gray-800/50 border-2 border-dashed border-gray-600 rounded-2xl p-6 text-center flex flex-col items-center justify-center aspect-video transition-all duration-300 hover:border-indigo-500 hover:bg-gray-800/70 cursor-pointer" onClick={handleClick}>
      <input
        type="file"
        id={id}
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
      {imagePreview ? (
        <img src={imagePreview} alt="Preview" className="max-h-full max-w-full object-contain rounded-lg shadow-lg"/>
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-400">
          <UploadIcon className="w-12 h-12 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
          <p className="text-sm">{description}</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
