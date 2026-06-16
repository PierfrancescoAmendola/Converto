# CONVERTO — 100% Client-Side Private Converter

Un'applicazione web premium, veloce e totalmente sicura per la conversione di immagini e documenti. Tutto l'hardware di elaborazione risiede localmente sul dispositivo dell'utente. Nessun dato lascia mai la macchina, offrendo la massima privacy possibile.

## Caratteristiche principali

- **100% Client-Side**: Sfrutta le API HTML5 (come `HTMLCanvasElement`) e librerie locali in memoria per elaborare le conversioni direttamente sul client.
- **Privacy Assoluta**: Nessun upload su server esterni o tracciamento dei dati sensibili.
- **Design Moderno & Movimento**: Sviluppato seguendo principi di visual design contemporanei, con transizioni fluide guidate da Framer Motion, layout in vetro temperato (glassmorphism) e caricatori shimmer attivi.
- **Batch Processing & ZIP**: Caricamento multiplo e download collettivo in formato archivio compresso `.zip`.
- **Feedback di Successo**: Celebrazione dinamica con coriandoli (`canvas-confetti`) a download completato.

## Formati Supportati

### 📸 Immagini
Converti file tra i formati web standard mantenendo trasparenza e qualità:
- **Sorgenti**: `.png`, `.jpg`, `.jpeg`, `.webp`, `.bmp`, `.ico`, `.svg`
- **Destinazioni**: `.png`, `.jpg`, `.jpeg`, `.webp`, `.bmp`, `.ico`, `.pdf`

### 📄 Documenti e Dati
Analisi sintattica e trasformazione di dati strutturati e formati testuali:
- **Sorgenti**: `.json`, `.csv`, `.xml`, `.yaml`, `.yml`, `.txt`, `.md`, `.html`
- **Destinazioni**: `.json`, `.csv`, `.xml`, `.yaml`, `.txt`, `.md`, `.html`, `.pdf`

## Tecnologie Utilizzate

- **Framework**: Vite + React + TypeScript
- **Stile**: Tailwind CSS v4 + Custom Properties (RGB-translucenza)
- **Animazioni**: Framer Motion (Spring Physics & AnimatePresence)
- **Librerie di Conversione**:
  - `jspdf` per la generazione di file PDF client-side
  - `jszip` per l'aggregazione di file in archivi `.zip`
  - `yaml` per il parser e la serializzazione YAML
  - `canvas-confetti` per feedback grafici

## Sviluppo Locale

Per eseguire il progetto sul tuo computer:

1. Installa le dipendenze:
   ```bash
   npm install
   ```

2. Avvia il server di sviluppo locale:
   ```bash
   npm run dev
   ```

3. Crea la build ottimizzata per la produzione:
   ```bash
   npm run build
   ```

## Deploy su Vercel

Puoi pubblicare questa applicazione su Vercel in pochi secondi senza configurazioni server complesse:

```bash
npx vercel
```
