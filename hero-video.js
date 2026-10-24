// Homepage hero video. The <video> ships without a src, and the picture under it is the frame the
// video starts on (its second frame), so the swap from picture to playing video cannot be seen. The file loads once, whole, as
// a blob (local dev servers often lack Range support), while the opening animation covers the page; it starts
// from its start frame the moment the doors begin to open (the "aliyah:intro-open" event of intro-site.js).
// Without the animation it starts as soon as it can play. Visitors who turn off motion keep the picture
// and download nothing.
(function () {
  var video = document.querySelector("[data-hero-video]");
  if (!video) return;
  var src = video.getAttribute("data-src");
  if (!src || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var root = document.documentElement;
  var waiting = root.hasAttribute("data-intro-playing");
  var ready = false;

  // Start time: the second frame (data-start), skipping the first. It is also where each loop restarts,
  // so the native loop (which would go back to 0) is replaced.
  var from = parseFloat(video.getAttribute("data-start")) || 0;
  if (from) {
    video.loop = false;
    video.addEventListener("ended", function () {
      video.currentTime = from;
      var p = video.play();
      if (p && p.catch) p.catch(function () {});
    });
  }

  // Runs once. It is reached twice when the video becomes ready after the 3.7 s mark: release() opens the
  // doors at once (whose "intro-open" calls start), then the "canplaythrough" handler calls it again.
  var started = false;
  function start() {
    if (!ready || waiting || started) return;
    started = true;
    video.currentTime = from;
    var p = video.play();
    if (p && p.catch) p.catch(function () {});
  }

  // Holds the doors closed until the video can play, so it is already running as they open.
  function release() {
    if (!root.hasAttribute("data-intro-hold")) return;
    root.removeAttribute("data-intro-hold");
    document.dispatchEvent(new CustomEvent("aliyah:intro-ready"));
  }
  if (waiting) {
    root.setAttribute("data-intro-hold", "");
    document.addEventListener("aliyah:intro-open", function () { waiting = false; start(); }, { once: true });
    video.addEventListener("error", release, { once: true });
  }
  // Shown only once a frame is actually playing; until then the identical picture underneath shows.
  video.addEventListener("playing", function () { video.classList.add("is-playing"); }, { once: true });
  video.addEventListener("canplaythrough", function () { ready = true; release(); start(); }, { once: true });

  function load(url) {
    video.preload = "auto";
    video.src = url;
    video.load();
  }

  var sameOrigin = false;
  try { sameOrigin = new URL(src, location.href).origin === location.origin; } catch (e) {}
  if (!sameOrigin || !window.fetch || !URL.createObjectURL) return load(src);
  fetch(src, { credentials: "same-origin" })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.blob(); })
    .then(function (blob) { load(URL.createObjectURL(blob)); })
    .catch(function () { load(src); });
})();
