
(function () {
  function ready(fn) { if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  function normalize(s) { return (s || '').toString().toLowerCase(); }
  function setupSearch(scope) {
    var input = scope.querySelector('[data-search]');
    var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));
    if (!input || !cards.length) return;
    function apply() {
      var q = normalize(input.value).trim();
      cards.forEach(function (card) { var text = normalize(card.getAttribute('data-searchable') || card.textContent); card.classList.toggle('hide', !!q && text.indexOf(q) === -1); });
      var counter = scope.querySelector('[data-result-count]');
      if (counter) counter.textContent = cards.filter(function (c) { return !c.classList.contains('hide'); }).length;
    }
    input.addEventListener('input', apply);
    apply();
  }
  function setupSort(scope) {
    var buttons = Array.prototype.slice.call(scope.querySelectorAll('[data-sort]'));
    var cardsWrap = scope.querySelector('[data-sort-target]');
    if (!buttons.length || !cardsWrap) return;
    var cards = Array.prototype.slice.call(cardsWrap.querySelectorAll('[data-card]'));
    if (!cards.length) return;
    function sortBy(mode) {
      var frag = document.createDocumentFragment();
      var items = cards.slice();
      items.sort(function (a, b) { var ay = parseInt(a.getAttribute('data-year') || '0', 10); var by = parseInt(b.getAttribute('data-year') || '0', 10); var at = normalize(a.getAttribute('data-title')); var bt = normalize(b.getAttribute('data-title')); if (mode === 'year-asc') return ay - by || at.localeCompare(bt); if (mode === 'title') return at.localeCompare(bt, 'zh-Hans-CN'); return by - ay || bt.localeCompare(at); });
      items.forEach(function (item) { frag.appendChild(item); });
      cardsWrap.appendChild(frag);
    }
    buttons.forEach(function (btn) { btn.addEventListener('click', function () { buttons.forEach(function (b) { b.classList.remove('primary'); }); btn.classList.add('primary'); sortBy(btn.getAttribute('data-sort')); }); });
  }
  ready(function () { Array.prototype.slice.call(document.querySelectorAll('[data-search-scope]')).forEach(setupSearch); Array.prototype.slice.call(document.querySelectorAll('[data-sort-scope]')).forEach(setupSort); });
})();
