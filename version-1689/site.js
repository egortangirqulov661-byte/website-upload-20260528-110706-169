
document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-site-nav]');
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => nav.classList.toggle('open'));
  }

  const header = document.querySelector('[data-header]');
  window.addEventListener('scroll', () => {
    if (!header) return;
    header.style.boxShadow = window.scrollY > 8 ? '0 10px 24px rgba(0,0,0,.16)' : 'none';
  }, { passive: true });

  const carousel = document.querySelector('[data-carousel]');
  if (carousel) {
    const slides = Array.from(carousel.querySelectorAll('[data-slide]'));
    const dots = Array.from(carousel.querySelectorAll('[data-dot]'));
    const prev = carousel.querySelector('[data-prev]');
    const next = carousel.querySelector('[data-next]');
    let index = 0;
    const show = (i) => {
      index = (i + slides.length) % slides.length;
      slides.forEach((slide, s) => slide.classList.toggle('active', s === index));
      dots.forEach((dot, d) => dot.classList.toggle('active', d === index));
    };
    dots.forEach(dot => dot.addEventListener('click', () => show(Number(dot.dataset.dot))));
    prev && prev.addEventListener('click', () => show(index - 1));
    next && next.addEventListener('click', () => show(index + 1));
    setInterval(() => show(index + 1), 6000);
  }

  document.querySelectorAll('[data-search-input]').forEach(input => {
    const targetSel = input.dataset.filterTarget || '[data-card]';
    const root = input.closest('section, main, body') || document;
    const cards = Array.from(root.querySelectorAll(targetSel));
    const yearSelect = root.querySelector('[data-year-filter]');

    const filter = () => {
      const q = (input.value || '').trim().toLowerCase();
      const year = yearSelect ? yearSelect.value : '';
      cards.forEach(card => {
        const text = [card.dataset.title, card.dataset.genre, card.dataset.tags, card.dataset.category, card.textContent].join(' ').toLowerCase();
        const okText = !q || text.includes(q);
        const okYear = !year || card.dataset.year === year;
        card.hidden = !(okText && okYear);
      });
    };

    input.addEventListener('input', filter);
    if (yearSelect) yearSelect.addEventListener('change', filter);
  });

  document.querySelectorAll('[data-player]').forEach(video => {
    const src = video.dataset.src;
    const mp4 = video.dataset.mp4;
    const overlay = video.closest('.player-wrap')?.querySelector('[data-play-toggle]');

    const bindSource = () => {
      if (src && window.Hls && window.Hls.isSupported()) {
        const hls = new window.Hls({ enableWorker: true });
        hls.loadSource(src);
        hls.attachMedia(video);
      } else {
        video.src = mp4 || src || '';
      }
    };

    bindSource();

    const toggle = async () => {
      try {
        if (video.paused) {
          await video.play();
          if (overlay) overlay.style.opacity = '0';
          if (overlay) overlay.style.pointerEvents = 'none';
        } else {
          video.pause();
          if (overlay) overlay.style.opacity = '1';
          if (overlay) overlay.style.pointerEvents = 'auto';
        }
      } catch (err) {
        console.warn('play failed', err);
      }
    };

    overlay && overlay.addEventListener('click', toggle);
    video.addEventListener('click', toggle);
    video.addEventListener('play', () => {
      if (overlay) overlay.style.opacity = '0';
      if (overlay) overlay.style.pointerEvents = 'none';
    });
    video.addEventListener('pause', () => {
      if (overlay) overlay.style.opacity = '1';
      if (overlay) overlay.style.pointerEvents = 'auto';
    });
  });
});
