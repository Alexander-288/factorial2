import {defineConfig} from 'vite';
import motionCanvas from '@motion-canvas/vite-plugin';
import ffmpeg from '@motion-canvas/ffmpeg';

export default defineConfig({
  plugins: [motionCanvas(), ffmpeg()],
  server: {fs: {allow: ['..']}},
  // Stała nazwa pliku, żeby strona mogła go osadzić
  build: {rollupOptions: {output: {entryFileNames: 'project.js'}}},
});
