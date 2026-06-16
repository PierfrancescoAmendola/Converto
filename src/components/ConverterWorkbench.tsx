import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Dropzone } from './Dropzone';
import { FileList } from './FileList';
import type { 
  ConversionItem, 
  ImageFormat, 
  DocFormat 
} from '../utils/conversionEngine';
import { convertImage, convertDocument } from '../utils/conversionEngine';
import JSZip from 'jszip';
import confetti from 'canvas-confetti';

interface ConverterWorkbenchProps {
  mode: 'image' | 'file';
  onBack: () => void;
}

export const ConverterWorkbench: React.FC<ConverterWorkbenchProps> = ({ mode, onBack }) => {
  const [items, setItems] = useState<ConversionItem[]>([]);
  const [isConverting, setIsConverting] = useState(false);

  // Helper to generate unique IDs
  const generateId = () => Math.random().toString(36).substring(2, 9);

  // Handle file additions
  const handleFilesSelected = (files: File[]) => {
    const newItems: ConversionItem[] = files.map(file => {
      const sourceFormat = file.name.split('.').pop()?.toLowerCase() || '';
      
      // Select a default target format different from source
      let targetFormat = '';
      if (mode === 'image') {
        targetFormat = sourceFormat === 'png' ? 'webp' : 'png';
      } else {
        targetFormat = sourceFormat === 'json' ? 'yaml' : 'pdf';
      }

      return {
        id: generateId(),
        file,
        sourceFormat,
        targetFormat,
        status: 'idle',
        progress: 0,
      };
    });

    setItems(prev => [...prev, ...newItems]);
  };

  const handleRemoveFile = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdateTargetFormat = (id: string, format: string) => {
    setItems(prev =>
      prev.map(item => (item.id === id ? { ...item, targetFormat: format } : item))
    );
  };

  const handleUpdateAllTargetFormats = (format: string) => {
    setItems(prev => prev.map(item => ({ ...item, targetFormat: format })));
  };

  // Run conversions sequentially
  const handleConvertAll = async () => {
    setIsConverting(true);
    
    // Convert copy of items list
    const updatedItems = [...items];

    for (let i = 0; i < updatedItems.length; i++) {
      const item = updatedItems[i];
      if (item.status === 'success') continue;

      // Set converting status
      setItems(prev =>
        prev.map(p => (p.id === item.id ? { ...p, status: 'converting', progress: 10 } : p))
      );

      try {
        // Step progress simulation for visual feedback
        const progressInterval = setInterval(() => {
          setItems(prev =>
            prev.map(p => {
              if (p.id === item.id && p.progress < 90) {
                return { ...p, progress: p.progress + 15 };
              }
              return p;
            })
          );
        }, 100);

        let result: { blob: Blob; filename: string };

        if (mode === 'image') {
          result = await convertImage(item.file, item.targetFormat as ImageFormat);
        } else {
          result = await convertDocument(item.file, item.targetFormat as DocFormat);
        }

        clearInterval(progressInterval);

        const convertedUrl = URL.createObjectURL(result.blob);

        setItems(prev =>
          prev.map(p =>
            p.id === item.id
              ? {
                  ...p,
                  status: 'success',
                  progress: 100,
                  convertedBlob: result.blob,
                  convertedUrl,
                  convertedFilename: result.filename,
                }
              : p
          )
        );
      } catch (err: any) {
        setItems(prev =>
          prev.map(p =>
            p.id === item.id
              ? {
                  ...p,
                  status: 'error',
                  progress: 0,
                  error: err.message || 'Errore di conversione',
                }
              : p
          )
        );
      }
    }

    setIsConverting(false);
  };

  // Download converted file(s)
  const handleDownloadAll = async () => {
    const successItems = items.filter(item => item.status === 'success' && item.convertedBlob);
    if (successItems.length === 0) return;

    if (successItems.length === 1) {
      // Single file download
      const item = successItems[0];
      const link = document.createElement('a');
      link.href = item.convertedUrl || '';
      link.download = item.convertedFilename || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Multiple files -> Zip
      const zip = new JSZip();
      successItems.forEach(item => {
        if (item.convertedBlob && item.convertedFilename) {
          zip.file(item.convertedFilename, item.convertedBlob);
        }
      });

      const zipContent = await zip.generateAsync({ type: 'blob' });
      const zipUrl = URL.createObjectURL(zipContent);
      
      const link = document.createElement('a');
      link.href = zipUrl;
      link.download = `convertito_archivio_${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(zipUrl);
    }

    // Trigger confetti burst celebration
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.8 },
      colors: mode === 'image' ? ['#f43f5e', '#ec4899', '#ffffff'] : ['#10b981', '#34d399', '#ffffff']
    });
  };

  const handleReset = () => {
    // Revoke any existing object URLs to free memory
    items.forEach(item => {
      if (item.convertedUrl) URL.revokeObjectURL(item.convertedUrl);
    });
    setItems([]);
  };

  const allSuccess = items.length > 0 && items.every(item => item.status === 'success');

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-4xl mx-auto px-4 py-8 relative z-10"
    >
      {/* Workbench Header Controls */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => {
            handleReset();
            onBack();
          }}
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Indietro</span>
        </button>

        {items.length > 0 && (
          <button
            onClick={handleReset}
            disabled={isConverting}
            className="text-xs text-gray-500 hover:text-rose-400 transition-colors disabled:opacity-30 cursor-pointer"
          >
            Svuota lista
          </button>
        )}
      </div>

      {/* Header Info */}
      <div className="mb-8 select-none">
        <h2 className="text-3xl font-semibold tracking-tight text-white flex items-center gap-2">
          {mode === 'image' ? 'Convertitore Immagini' : 'Convertitore Documenti & Dati'}
          {allSuccess && (
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              <CheckCircle className="w-3.5 h-3.5" /> Completato
            </span>
          )}
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          {mode === 'image'
            ? 'Carica foto o illustrazioni da trasformare nei formati raster o vettoriali web standard.'
            : 'Converti file di dati, script testuali o formattazione ricca. Genera PDF all\'istante.'}
        </p>
      </div>

      {/* Upload Zone or File Table */}
      {items.length === 0 ? (
        <Dropzone mode={mode} onFilesSelected={handleFilesSelected} />
      ) : (
        <FileList
          mode={mode}
          items={items}
          onRemove={handleRemoveFile}
          onUpdateTargetFormat={handleUpdateTargetFormat}
          onUpdateAllTargetFormats={handleUpdateAllTargetFormats}
          onConvertAll={handleConvertAll}
          onDownloadAll={handleDownloadAll}
          isConverting={isConverting}
        />
      )}
    </motion.div>
  );
};
