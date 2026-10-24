// Opening animation. window.playIntro(n, { force, onDone }) lays one of five designs over the page, then removes it.
// Buttons with [data-intro-play="n"] start a design (the proposals page). The markup of the brand key comes from
// <template id="ix-key">, written by build.mjs from the same SVG as the site header.
(function () {
  var NAME = ["Aliyah", "Prestige"];
  var DUR = { 1: 3700, 2: 3800, 3: 3700, 4: 4000, 5: 3900, 6: 3800, 7: 3800, 8: 4600, 9: 4000, 10: 3800,
    11: 3900, 12: 4000, 13: 4000, 14: 4100, 15: 4100, 16: 4100, 17: 3900, 18: 3900, 19: 4100, 20: 4400 }; // time before the exit starts, ms
  var EXIT = { 1: 1100, 2: 1200, 3: 1500, 4: 1200, 5: 1300, 6: 1400, 7: 1200, 8: 1200, 9: 1100, 10: 1100,
    11: 1200, 12: 1200, 13: 1200, 14: 1200, 15: 1200, 16: 1200, 17: 1400, 18: 1200, 19: 1200, 20: 1400 }; // length of the exit, ms
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

  // Parts of designs 11 to 20. Absolute parts inside the stage are placed relative to the key (height --kh).
  var DOORS = '<i class="ix-door l"></i><i class="ix-door r"></i>';
  var SEAM = '<i class="ix-seam"></i>', SHEEN = '<i class="ix-sheen"></i>', GLINT = '<i class="ix-glint"></i>', HALO = '<i class="ix-halo"></i>';
  var RING = '<svg class="ix-ring" viewBox="0 0 100 100" aria-hidden="true"><circle class="a" cx="50" cy="50" r="49" pathLength="1"/><circle class="b" cx="50" cy="50" r="45" pathLength="1"/></svg>';
  var ARCH = '<svg class="ix-arch" viewBox="0 0 100 150" aria-hidden="true"><path pathLength="1" d="M14 150V71.6A42 42 0 0 1 50 8"/><path pathLength="1" d="M86 150V71.6A42 42 0 0 0 50 8"/>' +
    '<path class="in" pathLength="1" d="M20 150V69.9A36 36 0 0 1 50 14"/><path class="in" pathLength="1" d="M80 150V69.9A36 36 0 0 0 50 14"/><path class="gem" d="M50 -4L54 1L50 6L46 1Z"/></svg>';
  var GRAD = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><linearGradient id="ix-g15" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="48" y2="96">' +
    '<stop offset="0" stop-color="#8C7440"/><stop offset=".45" stop-color="#F6EBC8"/><stop offset="1" stop-color="#B89B5E"/></linearGradient></defs></svg>';
  var FRAME = '<div class="ix-fx"><div class="ix-frame"><i></i><i></i><i></i><i></i><b></b><b></b><b></b><b></b></div><div class="ix-frame"><i></i><i></i><i></i><i></i></div></div>';
  var RULE = '<span class="ix-rule" aria-hidden="true"><i></i><b></b><i></i></span>';
  function stage(before, afterName) { return '<div class="ix-stage">' + (before || "") + keySvg() + name() + (afterName || "") + sub + "</div>"; }
  function dust(count) {
    var s = "", r = Math.random;
    for (var i = 0; i < count; i++) {
      s += '<i style="--x:' + (r() * 100).toFixed(1) + "%;--s:" + (1.5 + r() * 3).toFixed(1) + "px;--t:" + (7 + r() * 7).toFixed(1) + "s;--d:-" + (r() * 10).toFixed(1) +
        "s;--dx:" + Math.round(r() * 80 - 40) + "px;--o:" + (.35 + r() * .6).toFixed(2) + '"></i>';
    }
    return '<div class="ix-fx"><div class="ix-dust">' + s + "</div></div>";
  }

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
    10: function () { return '<i class="ix-half"></i><i class="ix-half"></i><i class="ix-hz"></i><div class="ix-stage">' + keySvg() + name() + sub + "</div>"; },
    // 11 to 20: design 1 ("Gold line") with added flourishes; all share .ix-gl (see playIntro).
    11: function () { return DOORS + SEAM + stage(); },
    12: function () { return DOORS + dust(40) + stage(GLINT); },
    13: function () { return DOORS + stage(HALO + RING); },
    14: function () { return DOORS + stage(ARCH); },
    15: function () { return GRAD + DOORS + stage() + SHEEN; },
    16: function () { return DOORS + FRAME + stage("", RULE); },
    17: function () { return DOORS + stage(); },
    18: function () { return DOORS + stage(); },
    19: function () { return DOORS + stage(); },
    20: function () { return GRAD + DOORS + SEAM + dust(28) + stage(HALO + RING + GLINT) + SHEEN; }
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
    el.className = "ix ix-" + n + (n > 10 ? " ix-gl" : "");
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
