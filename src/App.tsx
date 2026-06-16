import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ModeSelector } from './components/ModeSelector';
import { ConverterWorkbench } from './components/ConverterWorkbench';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsOfService } from './components/TermsOfService';
import { AdminPanel } from './components/AdminPanel';
import { Layers, HelpCircle, Shield, Cpu } from 'lucide-react';

type AppView = 'selector' | 'image' | 'file' | 'privacy' | 'terms' | 'admin';

function App() {
  const [view, setView] = useState<AppView>('selector');
  const logoClicksRef = useRef(0);

  // Increment visit counter once per session
  useEffect(() => {
    const hasVisited = sessionStorage.getItem('converto_visited');
    if (!hasVisited) {
      fetch('https://api.counterapi.dev/v1/converto-amendola/visits/up')
        .then(() => {
          sessionStorage.setItem('converto_visited', 'true');
        })
        .catch(() => {}); // silently fail if blocked or offline
    }
  }, []);

  const handleLogoClick = () => {
    logoClicksRef.current += 1;
    if (logoClicksRef.current >= 5) {
      setView('admin');
      logoClicksRef.current = 0;
    }
  };

  return (
    <div className="relative min-h-[100dvh] flex flex-col justify-between overflow-hidden bg-brand-bg text-gray-100">
      
      {/* Background Ornaments (Performance Safe SVG/CSS) */}
      <div className="bg-dot-grid" />
      <div className="bg-grain-overlay" />
      
      {/* Cinematic Ambient Glow Blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-brand-accent/5 blur-[120px] pointer-events-none select-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-500/3 blur-[100px] pointer-events-none select-none" />

      {/* Navigation */}
      <header className="relative z-10 w-full border-b border-white/5 bg-brand-bg/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer select-none active:scale-95 transition-transform" 
            onClick={handleLogoClick}
          >
            <div className="w-8 h-8 rounded-lg bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center">
              <Layers className="w-4 h-4 text-brand-accent" />
            </div>
            <span className="font-semibold text-sm tracking-wider uppercase">CONVERTO</span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-gray-400">
            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> 100% Privato</span>
            <span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5" /> WebAssembly & Canvas</span>
            <span className="flex items-center gap-1.5"><HelpCircle className="w-3.5 h-3.5" /> Client-Side Only</span>
          </nav>
        </div>
      </header>

      {/* Main Body with Transition Engine */}
      <main className="flex-1 flex items-center justify-center relative py-12">
        <AnimatePresence mode="wait">
          {view === 'selector' && (
            <motion.div
              key="selector"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <ModeSelector onSelectMode={(mode) => setView(mode)} />
            </motion.div>
          )}

          {(view === 'image' || view === 'file') && (
            <motion.div
              key="workbench"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <ConverterWorkbench mode={view} onBack={() => setView('selector')} />
            </motion.div>
          )}

          {view === 'privacy' && (
            <motion.div
              key="privacy"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <PrivacyPolicy onBack={() => setView('selector')} />
            </motion.div>
          )}

          {view === 'terms' && (
            <motion.div
              key="terms"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <TermsOfService onBack={() => setView('selector')} />
            </motion.div>
          )}

          {view === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <AdminPanel onBack={() => setView('selector')} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-white/5 bg-brand-bg/50 backdrop-blur-md py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>
            &copy; {new Date().getFullYear()} Pierfrancesco Amendola - Converto. Tutti i diritti riservati.
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setView('privacy')} 
              className="hover:text-white transition-colors cursor-pointer focus:outline-none"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => setView('terms')} 
              className="hover:text-white transition-colors cursor-pointer focus:outline-none"
            >
              Termini di Servizio
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
