import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, RefreshCw } from 'lucide-react';

interface AdminPanelProps {
  onBack: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCount = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch the counter value
      const res = await fetch('https://api.counterapi.dev/v1/converto-amendola/visits/');
      if (!res.ok) throw new Error('Impossibile recuperare il conteggio');
      const data = await res.json();
      setCount(data.count || 0);
    } catch (err: any) {
      setError(err.message || 'Errore di rete');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCount();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md mx-auto px-6 py-8 relative z-10 text-center"
    >
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-8 group cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Esci dall'area riservata</span>
      </button>

      <div className="liquid-glass rounded-3xl p-8 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-brand-accent/10 rounded-full blur-2xl" />

        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-brand-accent">
            <Users className="w-6 h-6" />
          </div>

          <h2 className="text-xl font-medium text-white mb-1">
            Statistiche di Utilizzo
          </h2>
          <p className="text-xs text-gray-500 mb-6">
            Progetto: converto-amendola
          </p>

          {loading ? (
            <div className="flex flex-col items-center gap-2 py-4">
              <RefreshCw className="w-8 h-8 text-brand-accent animate-spin" />
              <span className="text-xs text-gray-400">Caricamento dati...</span>
            </div>
          ) : error ? (
            <div className="text-sm text-rose-400 py-4">
              <p>{error}</p>
              <button 
                onClick={fetchCount}
                className="mt-2 text-xs text-white underline cursor-pointer"
              >
                Riprova
              </button>
            </div>
          ) : (
            <div className="py-4">
              <motion.span 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-6xl font-semibold tracking-tighter text-white font-mono"
              >
                {count}
              </motion.span>
              <p className="text-xs text-gray-400 mt-2">
                Visite totali uniche registrate
              </p>
            </div>
          )}

          <div className="w-full border-t border-white/5 pt-4 mt-6 text-[10px] text-gray-500 leading-normal">
            Le statistiche sono anonime e aggregate nel rispetto dei requisiti di privacy GDPR. Nessun dato utente o file viene salvato.
          </div>
        </div>
      </div>
    </motion.div>
  );
};
