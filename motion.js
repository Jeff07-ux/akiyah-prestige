// Motion for the Aliyah Prestige Riad Grid site (copied from new-directions/motion.js).
// Patterns follow the designskills.dev skills each page names:
//   [data-masked-reveal]  masked-reveal: words rise through an overflow mask (GSAP ScrollTrigger)
//   [data-word-reveal]    staggered-word-reveal: words fade and rise, IntersectionObserver
//   [data-reveal]         simple fade-up, staggered with --d
//   [data-par]            image parallax inside an overflow-hidden frame
//   [data-lenis]          on <html>: smooth scroll (cinematic-gsap-lenis-motion-system)
// Everything is off under prefers-reduced-motion. Add #static to the URL for screenshots.
(function () {
  const root = document.documentElement;
  const still = location.hash === "#static" || matchMedia("(prefers-reduced-motion: reduce)").matches;
  root.classList.add(still ? "still" : "js");

  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  function split(el, maskCls, wordCls) {
    const text = el.textContent.trim().replace(/\s+/g, " ");
    el.setAttribute("aria-label", text);
    el.innerHTML = text.split(" ").map((w, i) =>
      `<span class="${maskCls}" aria-hidden="true"><span class="${wordCls}" style="--i:${i}">${esc(w)}</span></span>`).join(" ");
  }

  if (still) return;

  const hasGsap = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";
  if (hasGsap) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: "power3.out", duration: 0.85 });
  }

  // Smooth scroll, driven by the GSAP ticker so ScrollTrigger stays in sync.
  if (root.hasAttribute("data-lenis") && hasGsap && typeof Lenis !== "undefined") {
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true, wheelMultiplier: 0.9, anchors: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // masked-reveal
  document.querySelectorAll("[data-masked-reveal]").forEach((el) => {
    split(el, "wm", "w");
    el.classList.add("is-split");
    if (!hasGsap) return;
    gsap.fromTo(el.querySelectorAll(".w"), { yPercent: 110 }, {
      yPercent: 0, duration: 0.9, ease: "expo.out", stagger: 0.04,
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    });
  });

  // staggered-word-reveal + fade-up, both on IntersectionObserver
  document.querySelectorAll("[data-word-reveal]").forEach((el) => { split(el, "wr-m", "wr-w"); el.classList.add("is-ready"); });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-in");
      io.unobserve(e.target);
    });
  }, { threshold: 0.18, rootMargin: "0px 0px -6% 0px" });
  document.querySelectorAll("[data-word-reveal], [data-reveal]").forEach((el) => io.observe(el));

  // Parallax
  if (hasGsap) {
    document.querySelectorAll("[data-par]").forEach((img) => {
      gsap.fromTo(img, { yPercent: -7 }, {
        yPercent: 7, ease: "none",
        scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: 1 },
      });
    });
    window.addEventListener("load", () => ScrollTrigger.refresh());
  }
})();
