import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck, EyeOff, Key } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-3xl mx-auto px-6 py-8 relative z-10 text-left"
    >
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-8 group cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Indietro</span>
      </button>

      <div className="space-y-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-4">
            Politica sulla Privacy
          </h1>
          <p className="text-gray-400 text-sm font-light">Ultimo aggiornamento: 16 Giugno 2026</p>
        </div>

        {/* Highlight Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="liquid-glass rounded-2xl p-6">
            <EyeOff className="w-8 h-8 text-brand-accent mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Zero Upload</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              I file rimangono sul tuo computer. Nessun server riceve o elabora i tuoi dati.
            </p>
          </div>
          <div className="liquid-glass rounded-2xl p-6">
            <ShieldCheck className="w-8 h-8 text-brand-accent mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Sicurezza Totale</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              La conversione avviene nella memoria temporanea del browser (RAM) e viene rimossa all'istante.
            </p>
          </div>
          <div className="liquid-glass rounded-2xl p-6">
            <Key className="w-8 h-8 text-brand-accent mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Nessun Tracciamento</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Non usiamo cookie di terze parti o analytics invasivi. La tua privacy è garantita.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-6 text-gray-300 text-sm leading-relaxed font-light">
          <section className="space-y-3">
            <h2 className="text-xl font-medium text-white">1. Raccolta delle Informazioni</h2>
            <p>
              Converto è progettato come un'applicazione statica che viene eseguita interamente all'interno del browser dell'utente (client-side). Non raccogliamo, memorizziamo o trasmettiamo alcun file, immagine, documento o dato inserito nell'applicazione.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium text-white">2. Elaborazione dei File</h2>
            <p>
              Tutte le operazioni di conversione delle immagini (tramite le API Canvas dell'HTML5) e di parsing/strutturazione dei documenti (tramite librerie JavaScript eseguite in locale) avvengono esclusivamente nella memoria locale del tuo dispositivo. Non ci sono server backend delegati all'elaborazione dei file.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium text-white">3. Collegamenti Esterni</h2>
            <p>
              Il nostro sito può contenere collegamenti a siti esterni (es. Vercel). Non abbiamo alcun controllo sul contenuto o sulle pratiche di privacy di questi siti di terze parti e non possiamo assumerci la responsabilità delle loro politiche.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium text-white">4. Modifiche alla Privacy</h2>
            <p>
              Ci riserviamo il diritto di modificare questa Informativa sulla Privacy in qualsiasi momento. Qualsiasi modifica sarà efficace immediatamente dopo la pubblicazione della politica aggiornata sul sito.
            </p>
          </section>
        </div>
      </div>
    </motion.div>
  );
};
