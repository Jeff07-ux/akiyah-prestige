// Behaviour of the navigation mocks (nav-designs.html): scroll state per frame, the design 4 menu, no real navigation.
(function () {
  document.querySelectorAll("[data-nd-win]").forEach(function (win) {
    var sc = win.querySelector("[data-nd-scroll]");
    var last = 0;
    function update() {
      var y = sc.scrollTop;
      win.dataset.state = y > 40 ? "scrolled" : "top";
      if (Math.abs(y - last) > 6) { win.dataset.dir = y > last && y > 80 ? "down" : "up"; last = y; }
      // Tone of the section under the top edge (design 10).
      var tone = "photo", probe = y + 30;
      sc.querySelectorAll("section").forEach(function (s) {
        if (s.offsetTop <= probe && s.offsetTop + s.offsetHeight > probe) tone = s.dataset.tone || "photo";
      });
      win.dataset.tone = tone;
    }
    sc.addEventListener("scroll", update, { passive: true });
    update();
    var ov = win.querySelector("[data-nd-overlay]");
    if (ov) {
      win.querySelector("[data-nd-open]").addEventListener("click", function () { ov.classList.add("on"); });
      win.querySelector("[data-nd-close]").addEventListener("click", function () { ov.classList.remove("on"); });
    }
  });
  document.addEventListener("click", function (e) { if (e.target.closest("[data-nd-link]")) e.preventDefault(); });
})();
