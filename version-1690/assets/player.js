(function () {
  window.initVideoPlayer = function (streamUrl) {
    var video = document.querySelector('[data-player-video]');
    var cover = document.querySelector('[data-player-cover]');
    if (!video || !streamUrl) return;
    var loaded = false;
    var hls = null;
    function load() {
      if (loaded) return;
      loaded = true;
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
      }
    }
    function start() {
      load();
      if (cover) cover.classList.add('is-hidden');
      var result = video.play();
      if (result && typeof result.catch === 'function') result.catch(function () {});
    }
    if (cover) cover.addEventListener('click', start);
    video.addEventListener('play', function () {
      if (cover) cover.classList.add('is-hidden');
    });
    video.addEventListener('click', function () {
      if (video.paused) {
        start();
      }
    });
    window.addEventListener('pagehide', function () {
      if (hls && typeof hls.destroy === 'function') hls.destroy();
    });
  };
})();
