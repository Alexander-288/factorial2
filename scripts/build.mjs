// Składa stronę do dist/: site/ + pliki zespołu + build animacji
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';

const out = 'dist';
rmSync(out, { recursive: true, force: true });
cpSync('site', out, { recursive: true });

// [źródło, cel w dist]; brakujące pliki są pomijane
const extra = [
  ['python/calka.py', 'kod/calka.py'],
  ['python/zrzut.png', 'img/python.png'],
  ['cpp/calka.cpp', 'kod/calka.cpp'],
  ['cpp/zrzut.png', 'img/cpp.png'],
  ['arkusz/obszar.xlsx', 'pliki/obszar.xlsx'],
  ['arkusz/zrzut.png', 'img/arkusz.png'],
  ['animacja/dist/project.js', 'animacja/project.js'],
  ['animacja/node_modules/@motion-canvas/player/dist/main.js', 'animacja/player.js'],
];
for (const [from, to] of extra) {
  if (!existsSync(from)) {
    console.log(`pominięto (brak): ${from}`);
    continue;
  }
  const dest = join(out, to);
  mkdirSync(dirname(dest), { recursive: true });
  cpSync(from, dest);
  console.log(`skopiowano: ${from} -> ${dest}`);
}
