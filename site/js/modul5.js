// Moduł 5: jeśli nagrania MP4 jeszcze nie ma, pokaż informację
const box = document.getElementById('video-box');
fetch('media/animacja.mp4', { method: 'HEAD' }).then((res) => {
  if (!res.ok) box.innerHTML = '<p class="pending">Nagranie MP4 w przygotowaniu.</p>';
}).catch(() => {});
