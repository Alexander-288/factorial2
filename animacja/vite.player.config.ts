import {defineConfig} from 'vite';

// Osobny build odtwarzacza: jeden plik ES bez zewnętrznych importów
export default defineConfig({
  build: {
    outDir: 'dist-player',
    lib: {entry: 'src/player.ts', formats: ['es'], fileName: () => 'player.js'},
  },
});
