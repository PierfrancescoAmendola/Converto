import React from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, FileText, ArrowRight, Sparkles } from 'lucide-react';

interface ModeSelectorProps {
  onSelectMode: (mode: 'image' | 'file') => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ onSelectMode }) => {
  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[70dvh] px-4 relative z-10">
      
      {/* Dynamic Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-12 select-none"
      >
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-brand-accent/10 text-brand-accent border border-brand-accent/20 mb-4 tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5" /> 100% Client-Side Private Converter
        </span>
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter leading-none mb-4 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
          Converti Tutto.<br />Senza Server.
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-[50ch] mx-auto font-light leading-relaxed">
          I tuoi file non lasciano mai il dispositivo. Elaborazione istantanea nel browser, massima privacy, velocità nativa.
        </p>
      </motion.div>

      {/* Asymmetric Bento Mode Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        
        {/* Card 1: Images */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -6, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectMode('image')}
          className="liquid-glass liquid-glass-hover rounded-[2rem] p-8 md:p-10 cursor-pointer flex flex-col justify-between min-h-[320px] group transition-all duration-300 relative overflow-hidden"
        >
          {/* Subtle Ambient Background Gradient on Hover */}
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-accent-glow to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 text-brand-accent group-hover:scale-110 transition-transform duration-300">
              <ImageIcon className="w-7 h-7" />
            </div>
            <h2 className="text-3xl font-medium tracking-tight text-white mb-3">
              Immagini
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-[32ch]">
              Converti PNG, JPG, WebP, SVG, BMP, ICO in qualsiasi formato. Trasparenza supportata, compressione controllata.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-brand-accent font-medium mt-8 relative z-10">
            <span>Inizia conversione</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </motion.div>

        {/* Card 2: Files/Documents */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -6, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectMode('file')}
          className="liquid-glass liquid-glass-hover rounded-[2rem] p-8 md:p-10 cursor-pointer flex flex-col justify-between min-h-[320px] group transition-all duration-300 relative overflow-hidden"
        >
          {/* Subtle Ambient Background Gradient on Hover */}
          <div className="absolute inset-0 bg-gradient-to-tl from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 text-emerald-400 group-hover:scale-110 transition-transform duration-300">
              <FileText className="w-7 h-7" />
            </div>
            <h2 className="text-3xl font-medium tracking-tight text-white mb-3">
              Documenti & Dati
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-[32ch]">
              Trasforma JSON, CSV, XML, YAML, Markdown, HTML, o testo semplice. Generazione PDF client-side.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-emerald-400 font-medium mt-8 relative z-10">
            <span>Inizia conversione</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </motion.div>

      </div>
    </div>
  );
};
