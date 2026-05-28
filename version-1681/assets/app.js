(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function initMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var nav = document.querySelector("[data-mobile-nav]");
    if (!toggle || !nav) {
      return;
    }

    toggle.addEventListener("click", function () {
      nav.classList.toggle("is-open");
      document.body.classList.toggle("menu-open", nav.classList.contains("is-open"));
      toggle.textContent = nav.classList.contains("is-open") ? "×" : "☰";
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        document.body.classList.remove("menu-open");
        toggle.textContent = "☰";
      });
    });
  }

  function initHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    if (slides.length < 2) {
      return;
    }

    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5600);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-hero-dot")) || 0);
        start();
      });
    });

    var hero = document.querySelector("[data-hero]");
    if (hero) {
      hero.addEventListener("mouseenter", stop);
      hero.addEventListener("mouseleave", start);
    }

    start();
  }

  function initSearch() {
    var input = document.querySelector("[data-search-input]");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-movie-card]"));
    var empty = document.querySelector("[data-empty-state]");
    var buttons = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));
    if (!input || !cards.length) {
      return;
    }

    var activeFilter = "all";

    function normalize(value) {
      return String(value || "").toLowerCase().trim();
    }

    function matchesFilter(card) {
      if (activeFilter === "all") {
        return true;
      }
      var fields = [
        card.getAttribute("data-genre"),
        card.getAttribute("data-type"),
        card.getAttribute("data-region"),
        card.getAttribute("data-year")
      ].join(" ");
      return fields.indexOf(activeFilter) !== -1;
    }

    function apply() {
      var term = normalize(input.value);
      var visible = 0;

      cards.forEach(function (card) {
        var text = normalize(card.getAttribute("data-search"));
        var ok = (!term || text.indexOf(term) !== -1) && matchesFilter(card);
        card.hidden = !ok;
        if (ok) {
          visible += 1;
        }
      });

      if (empty) {
        empty.hidden = visible !== 0;
      }
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        activeFilter = button.getAttribute("data-filter") || "all";
        buttons.forEach(function (item) {
          item.classList.toggle("is-active", item === button);
        });
        apply();
      });
    });

    input.addEventListener("input", apply);
    apply();
  }

  window.initPlayer = function (source) {
    ready(function () {
      var video = document.getElementById("videoPlayer");
      var overlay = document.getElementById("playOverlay");
      var status = document.getElementById("playerStatus");
      var prepared = false;
      var hls = null;

      if (!video || !overlay || !source) {
        return;
      }

      function showError() {
        if (status) {
          status.textContent = "视频暂时无法播放";
          status.classList.add("is-visible");
        }
      }

      function prepare() {
        if (prepared) {
          return;
        }
        prepared = true;

        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(source);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.ERROR, function (event, data) {
            if (data && data.fatal) {
              showError();
            }
          });
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = source;
          video.load();
        } else {
          showError();
        }
      }

      function start() {
        prepare();
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(function () {});
        }
      }

      overlay.addEventListener("click", start);

      video.addEventListener("click", function () {
        if (video.paused) {
          start();
        } else {
          video.pause();
        }
      });

      video.addEventListener("play", function () {
        overlay.classList.add("is-hidden");
      });

      video.addEventListener("pause", function () {
        if (!video.ended) {
          overlay.classList.remove("is-hidden");
        }
      });

      video.addEventListener("ended", function () {
        overlay.classList.remove("is-hidden");
      });

      window.addEventListener("pagehide", function () {
        if (hls) {
          hls.destroy();
        }
      });
    });
  };

  ready(function () {
    initMenu();
    initHero();
    initSearch();
  });
})();
