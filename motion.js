// Motion for the Aliyah Prestige Riad Grid site.
//   [data-masked-reveal]  words rise through an overflow mask (GSAP ScrollTrigger)
//   [data-word-reveal]    words fade and rise in turn (IntersectionObserver + CSS)
//   [data-reveal]         simple fade-up, staggered with --d (IntersectionObserver + CSS)
//   [data-par]            image parallax inside an overflow-hidden frame (GSAP ScrollTrigger)
// Timing tokens live in motion.css; MOTION mirrors the ones GSAP needs. Page transitions are pure CSS (motion.css).
// GSAP and ScrollTrigger are not in the critical path: they load after the page has loaded (on idle, or at the first
// scroll or touch), from the versioned URLs build.mjs puts on this script tag. Until then headings simply show and
// photos sit still; headings already on screen when GSAP arrives are left as they are, so nothing flickers.
// The "js"/"still" class is set by the inline head script in build.mjs before first paint; this file confirms it.
// Everything is off under prefers-reduced-motion. Add #static to the URL for screenshots.
(function () {
  const root = document.documentElement;
  const me = document.currentScript;
  const still = location.hash === "#static" || matchMedia("(prefers-reduced-motion: reduce)").matches;
  root.classList.toggle("still", still);
  root.classList.toggle("js", !still);
  // Marks a clean run. The head script shows all content if this flag is missing at load (a failed or blocked script).
  const ready = () => root.classList.add("motion-ready");

  const MOTION = { ease: "power3.out", text: { duration: 0.9, ease: "expo.out", stagger: 0.04 }, parallax: 7 };

  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  function split(el, maskCls, wordCls) {
    const text = el.textContent.trim().replace(/\s+/g, " ");
    const words = text.split(" ");
    // Long passages compress their stagger so the last word lands within ~16 steps, not seconds later.
    const k = Math.min(1, 16 / words.length);
    // The words are hidden from assistive tech and the full text is kept once in a visually hidden span,
    // which works on any element (aria-label is not allowed on paragraphs).
    el.innerHTML = `<span class="vh">${esc(text)}</span>` + words.map((w, i) =>
      `<span class="${maskCls}" aria-hidden="true"><span class="${wordCls}" style="--i:${+(i * k).toFixed(2)}">${esc(w)}</span></span>`).join(" ");
  }

  if (still) return ready();

  // masked-reveal: split now and show; GSAP adds the rise later (see enhance()).
  const masked = [...document.querySelectorAll("[data-masked-reveal]")];
  masked.forEach((el) => { split(el, "wm", "w"); el.classList.add("is-split"); });

  // staggered-word-reveal + fade-up, both on IntersectionObserver; without it, show everything.
  document.querySelectorAll("[data-word-reveal]").forEach((el) => { split(el, "wr-m", "wr-w"); el.classList.add("is-ready"); });
  const targets = document.querySelectorAll("[data-word-reveal], [data-reveal]");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      });
    }, { threshold: 0.18, rootMargin: "0px 0px -6% 0px" });
    targets.forEach((el) => io.observe(el));
  } else targets.forEach((el) => el.classList.add("is-in"));

  ready();

  // GSAP layer: masked-word rise for headings still below the fold, and image parallax.
  const pars = [...document.querySelectorAll("[data-par]")];
  if (!masked.length && !pars.length) return;
  function enhance() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: MOTION.ease, duration: 0.85 });
    masked.forEach((el) => {
      if (el.getBoundingClientRect().top < innerHeight * 0.88) return; // already seen: leave it
      gsap.fromTo(el.querySelectorAll(".w"), { yPercent: 110 }, {
        yPercent: 0, ...MOTION.text, clearProps: "transform",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    });
    pars.forEach((img) => {
      gsap.fromTo(img, { yPercent: -MOTION.parallax }, {
        yPercent: MOTION.parallax, ease: "none",
        scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: 1 },
      });
    });
    if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
  const load = (src) => new Promise((ok, fail) => { const t = document.createElement("script"); t.src = src; t.onload = ok; t.onerror = fail; document.head.append(t); });
  let started = false;
  const start = () => {
    if (started || !me) return;
    started = true;
    ["scroll", "pointerdown", "keydown", "touchstart"].forEach((ev) => removeEventListener(ev, start));
    load(me.dataset.gsap).then(() => load(me.dataset.st)).then(enhance).catch(() => {});
  };
  ["scroll", "pointerdown", "keydown", "touchstart"].forEach((ev) => addEventListener(ev, start, { passive: true, once: true }));
  const idle = () => ("requestIdleCallback" in window ? requestIdleCallback(start, { timeout: 2000 }) : setTimeout(start, 200));
  if (document.readyState === "complete") idle(); else addEventListener("load", idle, { once: true });
})();
