import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, CheckCircle2, AlertCircle, RefreshCw, FileText, ImageIcon } from 'lucide-react';
import type { ConversionItem, ImageFormat, DocFormat } from '../utils/conversionEngine';

interface FileListProps {
  mode: 'image' | 'file';
  items: ConversionItem[];
  onRemove: (id: string) => void;
  onUpdateTargetFormat: (id: string, format: string) => void;
  onUpdateAllTargetFormats: (format: string) => void;
  onConvertAll: () => void;
  onDownloadAll: () => void;
  isConverting: boolean;
}

export const FileList: React.FC<FileListProps> = ({
  mode,
  items,
  onRemove,
  onUpdateTargetFormat,
  onUpdateAllTargetFormats,
  onConvertAll,
  onDownloadAll,
  isConverting,
}) => {
  const imageFormats: ImageFormat[] = ['png', 'jpg', 'jpeg', 'webp', 'bmp', 'ico', 'pdf'];
  const docFormats: DocFormat[] = ['json', 'csv', 'xml', 'yaml', 'txt', 'md', 'html', 'pdf'];
  const formats = mode === 'image' ? imageFormats : docFormats;

  const hasSuccessfulConversion = items.some(item => item.status === 'success');

  const getFormatBadge = (ext: string) => {
    return (
      <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-white/5 border border-white/10 uppercase tracking-wider text-gray-300">
        {ext}
      </span>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />;
      case 'converting':
        return <RefreshCw className="w-5 h-5 text-brand-accent animate-spin shrink-0" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full mt-6 space-y-6">
      
      {/* Batch Setup Actions */}
      {items.length > 1 && !isConverting && !hasSuccessfulConversion && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl bg-brand-card/20 border border-white/5 gap-4"
        >
          <div className="text-sm text-gray-400 select-none">
            Configura formato per tutti i <span className="text-white font-medium">{items.length}</span> file
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 uppercase tracking-wider">Converti in</span>
            <select
              onChange={(e) => onUpdateAllTargetFormats(e.target.value)}
              defaultValue=""
              className="px-3 py-1.5 rounded-xl bg-brand-card border border-white/10 text-sm font-medium text-white focus:outline-none focus:border-brand-accent/50 cursor-pointer"
            >
              <option value="" disabled>Seleziona formato</option>
              {formats.map(fmt => (
                <option key={fmt} value={fmt}>{fmt.toUpperCase()}</option>
              ))}
            </select>
          </div>
        </motion.div>
      )}

      {/* File Item Stack */}
      <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {items.map(item => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, height: 0, y: 15 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -15 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="liquid-glass rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 overflow-hidden relative"
            >
              {/* Shimmer gradient overlay during conversion */}
              {item.status === 'converting' && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer pointer-events-none" />
              )}
              {/* File Info */}
              <div className="flex items-center gap-3 w-full md:w-auto min-w-0">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 shrink-0">
                  {mode === 'image' ? <ImageIcon className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                </div>
                <div className="min-w-0 flex-1 md:flex-initial">
                  <p className="text-sm font-medium text-white truncate max-w-[200px] sm:max-w-[320px]">
                    {item.file.name}
                  </p>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">
                    {(item.file.size / 1024).toFixed(1)} KB | {getFormatBadge(item.sourceFormat)}
                  </p>
                </div>
              </div>

              {/* Progress Bar for Conversion */}
              {item.status === 'converting' && (
                <div className="w-full md:flex-1 px-4">
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.progress}%` }}
                      className={`h-full ${mode === 'image' ? 'bg-brand-accent' : 'bg-emerald-400'}`}
                    />
                  </div>
                </div>
              )}

              {/* Format selection / Status display */}
              <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto shrink-0 border-t border-white/5 pt-3 md:pt-0 md:border-0">
                
                {item.status === 'idle' ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">in</span>
                    <select
                      value={item.targetFormat}
                      onChange={(e) => onUpdateTargetFormat(item.id, e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg bg-brand-card/80 border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-brand-accent cursor-pointer"
                    >
                      {formats.map(fmt => (
                        <option key={fmt} value={fmt}>{fmt.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500">Target:</span>
                    <span className="font-semibold text-white uppercase">{item.targetFormat}</span>
                    {getStatusIcon(item.status)}
                  </div>
                )}

                {/* Error message inline */}
                {item.status === 'error' && (
                  <span className="text-xs text-rose-400 max-w-[12ch] truncate" title={item.error}>
                    {item.error || 'Errore'}
                  </span>
                )}

                {/* Remove button */}
                {!isConverting && !hasSuccessfulConversion && (
                  <button
                    onClick={() => onRemove(item.id)}
                    className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Main Action Bar */}
      <div className="w-full pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-end gap-4">
        {!hasSuccessfulConversion ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onConvertAll}
            disabled={isConverting || items.length === 0}
            className={`w-full sm:w-auto px-8 py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              mode === 'image'
                ? 'bg-brand-accent hover:bg-brand-accent-hover text-white shadow-[0_4px_20px_-5px_rgba(244,63,94,0.4)] disabled:bg-brand-accent/40'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_4px_20px_-5px_rgba(16,185,129,0.4)] disabled:bg-emerald-500/40'
            } disabled:cursor-not-allowed`}
          >
            {isConverting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Conversione in corso...</span>
              </>
            ) : (
              <span>Converti {items.length} {items.length === 1 ? 'file' : 'file'}</span>
            )}
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onDownloadAll}
            className={`w-full sm:w-auto px-8 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              mode === 'image'
                ? 'bg-brand-accent hover:bg-brand-accent-hover text-white shadow-[0_4px_20px_-5px_rgba(244,63,94,0.4)]'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_4px_20px_-5px_rgba(16,185,129,0.4)]'
            }`}
          >
            Scarica tutti i file
          </motion.button>
        )}
      </div>
    </div>
  );
};
