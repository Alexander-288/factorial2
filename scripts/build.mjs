// Składa stronę do dist/: site/ (bez BluntCMS) + pliki zespołu + build animacji.
// Wzory $...$ i $$...$$ w plikach HTML są zamieniane na gotowy HTML KaTeX.
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, sep } from 'node:path';
import katex from 'katex';

const out = 'dist';
rmSync(out, { recursive: true, force: true });
cpSync('site', out, { recursive: true, filter: (src) => !src.split(sep).includes('blunt') });

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

// Renderuje wzory tylko w tekście: pomija tagi, <script>, <style>, <pre>, <code>
export function renderMath(html, file = '') {
  const parts = html.split(/(<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<pre[\s\S]*?<\/pre>|<code[\s\S]*?<\/code>|<[^>]+>)/i);
  // CMS zapisuje tekst z encjami HTML; KaTeX potrzebuje surowego LaTeX-a
  const decode = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&amp;/g, '&');
  const tex = (raw, displayMode) => {
    const src = decode(raw);
    try {
      return katex.renderToString(src, { displayMode, throwOnError: true, strict: 'ignore' });
    } catch (e) {
      throw new Error(`${file}: błąd we wzorze "${src.trim().slice(0, 60)}": ${e.message}`);
    }
  };
  return parts.map((part, i) => {
    if (i % 2 === 1) return part;
    return part
      .replace(/\$\$([\s\S]+?)\$\$/g, (_, s) => tex(s, true))
      .replace(/\$([^$\n]+?)\$/g, (_, s) => tex(s, false));
  }).join('');
}

let count = 0;
for (const name of readdirSync(out)) {
  if (!name.endsWith('.html')) continue;
  const path = join(out, name);
  writeFileSync(path, renderMath(readFileSync(path, 'utf8'), name));
  count++;
}
console.log(`wzory wyrenderowane w ${count} plikach HTML`);
