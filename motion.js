// Motion for the Aliyah Prestige Riad Grid site.
//   [data-masked-reveal]  words rise through an overflow mask (GSAP ScrollTrigger)
//   [data-word-reveal]    words fade and rise in turn (IntersectionObserver + CSS)
//   [data-reveal]         simple fade-up, staggered with --d (IntersectionObserver + CSS)
//   [data-par]            image parallax inside an overflow-hidden frame (GSAP ScrollTrigger)
// Timing tokens live in motion.css; MOTION mirrors the ones GSAP needs. Page transitions are pure CSS (motion.css).
// The "js"/"still" class is set by the inline head script in build.mjs before first paint; this file confirms it.
// Everything is off under prefers-reduced-motion. Add #static to the URL for screenshots.
(function () {
  const root = document.documentElement;
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

  const hasGsap = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";
  if (hasGsap) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: MOTION.ease, duration: 0.85 });
  }

  // masked-reveal. Without GSAP the words are split but simply shown.
  document.querySelectorAll("[data-masked-reveal]").forEach((el) => {
    split(el, "wm", "w");
    el.classList.add("is-split");
    if (!hasGsap) return;
    gsap.fromTo(el.querySelectorAll(".w"), { yPercent: 110 }, {
      yPercent: 0, ...MOTION.text, clearProps: "transform",
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    });
  });

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

  // Parallax
  if (hasGsap) {
    document.querySelectorAll("[data-par]").forEach((img) => {
      gsap.fromTo(img, { yPercent: -MOTION.parallax }, {
        yPercent: MOTION.parallax, ease: "none",
        scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: 1 },
      });
    });
    // Trigger positions depend on final layout: re-measure once images and web fonts have settled.
    const refresh = () => ScrollTrigger.refresh();
    if (document.readyState === "complete") refresh(); else addEventListener("load", refresh, { once: true });
    if (document.fonts) document.fonts.ready.then(refresh);
  }
  ready();
})();
