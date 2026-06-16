import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud } from 'lucide-react';

interface DropzoneProps {
  mode: 'image' | 'file';
  onFilesSelected: (files: File[]) => void;
}

export const Dropzone: React.FC<DropzoneProps> = ({ mode, onFilesSelected }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const validateAndProcessFiles = (rawFiles: FileList | null) => {
    if (!rawFiles) return;
    const filesArray = Array.from(rawFiles);
    
    // Filter based on mode
    const imageExtensions = ['png', 'jpg', 'jpeg', 'webp', 'bmp', 'ico', 'svg'];
    const docExtensions = ['json', 'csv', 'xml', 'yaml', 'yml', 'txt', 'md', 'markdown', 'html'];
    
    const filteredFiles = filesArray.filter(file => {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      return mode === 'image' ? imageExtensions.includes(ext) : docExtensions.includes(ext);
    });

    if (filteredFiles.length > 0) {
      onFilesSelected(filteredFiles);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    validateAndProcessFiles(e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    validateAndProcessFiles(e.target.files);
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const accentColor = mode === 'image' ? 'border-brand-accent' : 'border-emerald-500';
  const hoverBg = mode === 'image' ? 'group-hover:bg-brand-accent-glow' : 'group-hover:bg-emerald-500/5';
  const textColor = mode === 'image' ? 'text-brand-accent' : 'text-emerald-400';

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleChange}
        className="hidden"
        accept={
          mode === 'image'
            ? 'image/png, image/jpeg, image/webp, image/bmp, image/x-icon, image/svg+xml'
            : '.json, .csv, .xml, .yaml, .yml, .txt, .md, .markdown, .html'
        }
      />

      <motion.div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.995 }}
        className={`w-full min-h-[220px] rounded-[1.5rem] border-2 border-dashed flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all duration-300 relative group overflow-hidden ${
          isDragActive 
            ? `${accentColor} bg-white/5` 
            : 'border-white/10 bg-brand-card/30 hover:border-white/20'
        }`}
      >
        {/* Hover overlay background */}
        <div className={`absolute inset-0 transition-colors duration-300 pointer-events-none ${hoverBg}`} />

        <div className="relative z-10 flex flex-col items-center">
          <motion.div
            animate={isDragActive ? { y: -10, scale: 1.1 } : { y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-gray-400 group-hover:text-white group-hover:border-white/20 transition-colors duration-300`}
          >
            <UploadCloud className="w-6 h-6" />
          </motion.div>

          <p className="text-white font-medium text-base mb-1 select-none">
            Trascina e rilascia qui i tuoi file, oppure{' '}
            <span className={`underline ${textColor} font-semibold`}>sfoglia</span>
          </p>

          <p className="text-gray-400 text-xs mt-2 select-none">
            {mode === 'image'
              ? 'PNG, JPG, WebP, SVG, BMP, ICO (fino a 20MB l\'uno)'
              : 'JSON, CSV, XML, YAML, TXT, MD, HTML (fino a 10MB l\'uno)'}
          </p>
        </div>
      </motion.div>
    </div>
  );
};
