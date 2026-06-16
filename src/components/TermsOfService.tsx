import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

interface TermsOfServiceProps {
  onBack: () => void;
}

export const TermsOfService: React.FC<TermsOfServiceProps> = ({ onBack }) => {
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
            Termini di Servizio
          </h1>
          <p className="text-gray-400 text-sm font-light">Ultimo aggiornamento: 16 Giugno 2026</p>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-6 text-gray-300 text-sm leading-relaxed font-light">
          <section className="space-y-3">
            <h2 className="text-xl font-medium text-white">1. Accettazione dei Termini</h2>
            <p>
              Accedendo ed utilizzando il sito Converto, l'utente accetta di essere vincolato dai presenti Termini di Servizio e da tutte le leggi e regolamenti applicabili. Se non si accettano questi termini, è vietato l'uso del servizio.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium text-white">2. Licenza d'Uso</h2>
            <p>
              Il software e il design di Converto sono resi disponibili per uso personale o commerciale gratuito. Poiché l'elaborazione avviene interamente sul browser dell'utente, non vi è alcun limite di utilizzo basato su crediti server o abbonamenti.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium text-white">3. Responsabilità e Garanzie</h2>
            <p>
              Il servizio è fornito "così com'è" (as is), senza garanzie di alcun tipo, esplicite o implicite. Sebbene facciamo il massimo per garantire la stabilità e la correttezza degli algoritmi di conversione, Converto non garantisce che il servizio sarà privo di errori o interruzioni, né si assume responsabilità per perdite di dati o malfunzionamenti derivanti dal browser dell'utente.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium text-white">4. Limitazione del Servizio</h2>
            <p>
              Trattandosi di un'applicazione client-side, le prestazioni di conversione dipendono esclusivamente dalla potenza hardware del dispositivo dell'utente e dalle risorse allocate dal browser. File estremamente pesanti potrebbero subire rallentamenti o causare il crash della scheda del browser a causa dei limiti fisici di memoria del client.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium text-white">5. Contatti</h2>
            <p>
              Per domande relative ai presenti Termini, si prega di fare riferimento alla repository ufficiale o alle pagine di supporto del servizio.
            </p>
          </section>
        </div>
      </div>
    </motion.div>
  );
};
