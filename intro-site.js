// Opening animation of the site: "Gold line" (design 1 of intro-designs.html). Plays once per browser session, over the first
// page opened. The head script adds html.intro-pending (a black cover) so the page never flashes before this runs.
(function () {
  var d = document.documentElement;
  if (!d.classList.contains("intro-pending")) return;
  var key = document.querySelector("header.site .logo-key");
  if (!key) { d.classList.remove("intro-pending"); return; }
  var n = 0, words = ["Aliyah", "Prestige"].map(function (w) {
    return '<span class="w" aria-hidden="true">' + w.split("").map(function (c) { return '<span class="l" style="--n:' + n++ + '">' + c + "</span>"; }).join("") + "</span>";
  }).join("");
  var el = document.createElement("div");
  el.className = "ix ix-1";
  el.setAttribute("role", "presentation");
  el.innerHTML = '<i class="ix-door"></i><i class="ix-door"></i><div class="ix-stage">' + key.outerHTML.replace("logo-key", "ix-key") +
    '<p class="ix-name" aria-label="Aliyah Prestige">' + words + '</p><p class="ix-sub">Marrakech · Private concierge</p></div><button class="ix-skip" type="button">Skip</button>';
  document.body.appendChild(el);
  d.style.overflow = "hidden";
  d.setAttribute("data-intro-playing", "");
  d.classList.remove("intro-pending");
  // After 3.7 s the doors open, unless the page asked to wait (html[data-intro-hold], set by the hero video
  // while it loads): then they open on "aliyah:intro-ready", or at 9 s at the latest.
  var done = false, timer = setTimeout(function () {
    if (!d.hasAttribute("data-intro-hold")) return end();
    document.addEventListener("aliyah:intro-ready", end, { once: true });
    timer = setTimeout(end, 5300);
  }, 3700);
  function end() {
    if (done) return;
    done = true;
    clearTimeout(timer);
    el.classList.add("out");
    // The doors start to open: anything waiting for the page to be revealed (the hero video) starts now.
    d.removeAttribute("data-intro-playing");
    d.removeAttribute("data-intro-hold");
    document.dispatchEvent(new CustomEvent("aliyah:intro-open"));
    setTimeout(function () { el.remove(); d.style.overflow = ""; }, 1100);
  }
  el.querySelector(".ix-skip").addEventListener("click", end);
})();
