(function () {
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }
  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }
  function normalize(value) {
    return (value || '').toString().toLowerCase().trim();
  }
  function initMenu() {
    var button = qs('[data-menu-button]');
    var panel = qs('[data-mobile-panel]');
    if (!button || !panel) return;
    button.addEventListener('click', function () {
      panel.classList.toggle('open');
    });
  }
  function initHero() {
    var slides = qsa('[data-hero-slide]');
    var dots = qsa('[data-hero-dot]');
    if (!slides.length) return;
    var current = 0;
    function show(index) {
      current = index;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
      });
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
      });
    });
    window.setInterval(function () {
      show((current + 1) % slides.length);
    }, 5200);
  }
  function initFilters() {
    var filterRoot = qs('[data-filter-root]');
    if (!filterRoot) return;
    var input = qs('[data-filter-input]', filterRoot);
    var year = qs('[data-filter-year]', filterRoot);
    var type = qs('[data-filter-type]', filterRoot);
    var cards = qsa('[data-movie-card]', filterRoot);
    var empty = qs('[data-empty-state]', filterRoot);
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || params.get('search') || '';
    if (input && query) input.value = query;
    function apply() {
      var keyword = normalize(input && input.value);
      var yearValue = year ? year.value : '';
      var typeValue = type ? type.value : '';
      var visible = 0;
      cards.forEach(function (card) {
        var text = normalize(card.getAttribute('data-text'));
        var cardYear = card.getAttribute('data-year') || '';
        var cardType = card.getAttribute('data-type') || '';
        var matched = (!keyword || text.indexOf(keyword) !== -1) && (!yearValue || cardYear === yearValue) && (!typeValue || cardType === typeValue);
        card.style.display = matched ? '' : 'none';
        if (matched) visible += 1;
      });
      if (empty) empty.classList.toggle('show', visible === 0);
    }
    [input, year, type].forEach(function (el) {
      if (el) el.addEventListener('input', apply);
      if (el) el.addEventListener('change', apply);
    });
    apply();
  }
  function initHeaderSearch() {
    qsa('[data-site-search]').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        var input = qs('input', form);
        if (!input || !input.value.trim()) {
          event.preventDefault();
        }
      });
    });
  }
  document.addEventListener('DOMContentLoaded', function () {
    initMenu();
    initHero();
    initFilters();
    initHeaderSearch();
  });
})();
