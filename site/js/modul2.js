// Zakładki, wczytanie kodu zespołu i podświetlanie składni
const tabs = document.querySelectorAll('.tabs button');
tabs.forEach((btn) => btn.addEventListener('click', () => {
  tabs.forEach((b) => b.setAttribute('aria-selected', b === btn));
  document.querySelectorAll('[data-panel]').forEach((p) => { p.hidden = p.dataset.panel !== btn.dataset.lang; });
}));

// Brakujący zrzut ekranu zastępujemy informacją
const pending = (text) => Object.assign(document.createElement('p'), { className: 'pending', textContent: text });
document.querySelectorAll('img.shot').forEach((img) => {
  const swap = () => img.replaceWith(pending('Zrzut ekranu w przygotowaniu.'));
  if (img.complete && img.naturalWidth === 0) swap();
  else img.addEventListener('error', swap);
});

// Motyw podświetlania zgodny z przełącznikiem motywu
function syncHighlightTheme() {
  const t = document.documentElement.dataset.theme;
  const dark = t ? t === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  document.getElementById('hl-light').media = dark ? 'not all' : 'all';
  document.getElementById('hl-dark').media = dark ? 'all' : 'not all';
}
syncHighlightTheme();
new MutationObserver(syncHighlightTheme).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', syncHighlightTheme);

// Kod wczytujemy z plików zespołu; brak pliku = informacja
window.addEventListener('load', async () => {
  for (const code of document.querySelectorAll('code[data-src]')) {
    const res = await fetch(code.dataset.src).catch(() => null);
    if (!res?.ok) {
      code.closest('pre').nextElementSibling?.remove();
      code.closest('pre').replaceWith(pending('Kod w przygotowaniu.'));
      continue;
    }
    code.textContent = await res.text();
    window.hljs.highlightElement(code);
  }
});
