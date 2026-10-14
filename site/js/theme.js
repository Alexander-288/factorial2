// Przełącznik motywu (Jasny / Ciemny); wybór zapamiętany, jeśli localStorage działa
const root = document.documentElement;
try {
  const saved = localStorage.getItem('theme');
  if (saved) root.dataset.theme = saved;
} catch {}

const buttons = document.querySelectorAll('.theme-switch button');
const isDark = () => (root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches);
const sync = () => buttons.forEach((b) => b.setAttribute('aria-pressed', String((b.dataset.theme === 'dark') === isDark())));

buttons.forEach((b) => b.addEventListener('click', () => {
  root.dataset.theme = b.dataset.theme;
  try { localStorage.setItem('theme', b.dataset.theme); } catch {}
  sync();
}));
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', sync);
sync();
