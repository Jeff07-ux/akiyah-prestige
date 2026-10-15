// Opening animation. window.playIntro(n, { force, onDone }) lays one of five designs over the page, then removes it.
// Buttons with [data-intro-play="n"] start a design (the proposals page). The markup of the brand key comes from
// <template id="ix-key">, written by build.mjs from the same SVG as the site header.
(function () {
  var NAME = ["Aliyah", "Prestige"];
  var DUR = { 1: 3700, 2: 3800, 3: 3700, 4: 4000, 5: 3900, 6: 3800, 7: 3800, 8: 4600, 9: 4000, 10: 3800 }; // time before the exit starts, ms
  var EXIT = { 1: 1100, 2: 1200, 3: 1500, 4: 1200, 5: 1300, 6: 1400, 7: 1200, 8: 1200, 9: 1100, 10: 1100 }; // length of the exit, ms
  var SUB = "Marrakech · Private concierge";
  var active = null;

  function keySvg() {
    var t = document.getElementById("ix-key");
    return t ? t.innerHTML.replace('class="logo-key"', 'class="ix-key"') : "";
  }
  function name() {
    var n = 0;
    return '<p class="ix-name" aria-label="Aliyah Prestige">' + NAME.map(function (w) {
      return '<span class="w" aria-hidden="true">' + w.split("").map(function (c) { return '<span class="l" style="--n:' + n++ + '">' + c + "</span>"; }).join("") + "</span>";
    }).join("") + "</p>";
  }
  var sub = '<p class="ix-sub">' + SUB + "</p>";

  var DESIGN = {
    1: function () { return '<i class="ix-door"></i><i class="ix-door"></i><div class="ix-stage">' + keySvg() + name() + sub + "</div>"; },
    2: function () { return '<i class="ring"></i><i class="ring"></i><i class="ring"></i><div class="ix-stage">' + keySvg() + name() + sub + "</div>"; },
    3: function () {
      var strips = "";
      for (var i = 0; i < 6; i++) strips += '<i style="--n:' + i + '"></i>';
      return '<div class="ix-strips" aria-hidden="true">' + strips + '</div><div class="ix-grid" aria-hidden="true"></div><i class="ix-br"></i><i class="ix-br"></i><i class="ix-br"></i><i class="ix-br"></i>' +
        '<div class="ix-stage"><div class="ix-keywrap">' + keySvg() + '<i class="ix-scan"></i></div>' + name() + sub + '</div><span class="ix-count" aria-hidden="true">000</span>';
    },
    4: function () {
      return '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><linearGradient id="ix-g4" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8C7440"/><stop offset=".45" stop-color="#F6EBC8"/><stop offset="1" stop-color="#B89B5E"/></linearGradient></defs></svg>' +
        '<div class="ix-stage">' + keySvg() + '<p class="ix-name">Aliyah Prestige</p>' + sub + '</div><i class="ix-sheen"></i>';
    },
    5: function () {
      var c = function (r, dash) { return '<circle cx="50" cy="50" r="' + r + '" stroke-dasharray="' + dash + '"/>'; };
      return '<svg class="ix-orbit" viewBox="0 0 100 100" aria-hidden="true"><g class="a">' + c(48, "40 6") + '</g><g class="b">' + c(40, "1 3") + '</g><g class="c">' + c(32, "14 9 2 9") + "</g></svg>" +
        '<div class="ix-stage">' + keySvg() + name() + sub + "</div>";
    },
    6: function () { return '<i class="ix-beam"></i><div class="ix-stage">' + keySvg() + name() + sub + '</div><i class="ix-flash"></i>'; },
    7: function () {
      var row = function () { var s = ""; for (var i = 0; i < 12; i++) s += "<span>Aliyah Prestige</span>"; return "<p>" + s + "</p>"; };
      return '<div class="ix-rows" aria-hidden="true">' + row() + row() + row() + row() + row() + '</div><div class="ix-stage">' + keySvg() + name() + sub + "</div>";
    },
    8: function () { return '<i class="ix-bloom"></i><div class="ix-stage">' + keySvg() + name() + sub + "</div>"; },
    9: function () { return '<div class="ix-panel"><div class="ix-stage">' + keySvg() + name() + sub + "</div></div>"; },
    10: function () { return '<i class="ix-half"></i><i class="ix-half"></i><i class="ix-hz"></i><div class="ix-stage">' + keySvg() + name() + sub + "</div>"; }
  };

  function finish(el) {
    if (el.parentNode) el.parentNode.removeChild(el);
    document.documentElement.style.overflow = "";
    if (active === el) active = null;
  }

  window.playIntro = function (n, opts) {
    opts = opts || {};
    n = DESIGN[n] ? n : 1;
    if (!opts.force && window.matchMedia("(prefers-reduced-motion: reduce)").matches) { if (opts.onDone) opts.onDone(); return; }
    if (active) finish(active);
    var el = document.createElement("div");
    el.className = "ix ix-" + n;
    el.setAttribute("role", "presentation");
    el.innerHTML = DESIGN[n]() + '<button class="ix-skip" type="button">Skip</button>';
    document.body.appendChild(el);
    active = el;
    document.documentElement.style.overflow = "hidden";
    var timers = [], done = false;
    function end() {
      if (done) return;
      done = true;
      timers.forEach(clearTimeout);
      el.classList.add("out");
      timers.push(setTimeout(function () { finish(el); if (opts.onDone) opts.onDone(); }, EXIT[n]));
    }
    el.querySelector(".ix-skip").addEventListener("click", end);
    timers.push(setTimeout(end, DUR[n]));
    var count = el.querySelector(".ix-count");
    if (count) {
      var t0 = performance.now(), len = 2300;
      (function tick(t) {
        if (done) return;
        var p = Math.min(1, (t - t0) / len);
        count.textContent = String(Math.round(p * 100)).padStart(3, "0");
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    }
  };

  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-intro-play]");
    if (b) window.playIntro(+b.getAttribute("data-intro-play"), { force: true });
  });
})();
