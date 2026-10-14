// Renderuje wzory $...$ i $$...$$ w podanym elemencie (domyślnie cała strona)
export function renderMath(el = document.body) {
  window.renderMathInElement(el, {
    delimiters: [
      { left: '$$', right: '$$', display: true },
      { left: '$', right: '$', display: false },
    ],
    throwOnError: false,
  });
}
