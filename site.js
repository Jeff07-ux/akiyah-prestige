// Aliyah Prestige, Riad Grid site: mobile menu, filters (gallery + journal), gallery lightbox, newsletter form.
(function () {
  // Mobile menu
  const drawer = document.getElementById("drawer");
  const openBtn = document.querySelector("[data-menu-open]");
  if (drawer && openBtn) {
    const close = () => { drawer.hidden = true; document.body.style.overflow = ""; openBtn.setAttribute("aria-expanded", "false"); openBtn.focus(); };
    openBtn.addEventListener("click", () => {
      drawer.hidden = false; document.body.style.overflow = "hidden"; openBtn.setAttribute("aria-expanded", "true");
      drawer.querySelector("[data-menu-close]").focus();
    });
    drawer.querySelector("[data-menu-close]").addEventListener("click", close);
    drawer.querySelectorAll("nav a").forEach((a) => a.addEventListener("click", close));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !drawer.hidden) close(); });
  }

  // Signature panels: open on click/focus, and on hover for mouse users
  document.querySelectorAll("[data-panels]").forEach((wrap) => {
    const panels = [...wrap.querySelectorAll(".pnl")];
    const open = (p) => panels.forEach((x) => {
      const on = x === p;
      x.classList.toggle("on", on);
      x.querySelector(".pnl-tab").setAttribute("aria-expanded", String(on));
    });
    panels.forEach((p) => {
      p.querySelector(".pnl-tab").addEventListener("click", () => open(p));
      p.addEventListener("mouseenter", () => { if (matchMedia("(hover: hover) and (min-width: 901px)").matches) open(p); });
    });
  });

  // Filters: chips with data-filter, items with data-cat
  document.querySelectorAll("[data-filters]").forEach((bar) => {
    const items = document.querySelectorAll(bar.dataset.filters);
    const count = document.querySelector("[data-filter-count]");
    bar.addEventListener("click", (e) => {
      const chip = e.target.closest("[data-filter]");
      if (!chip) return;
      bar.querySelectorAll("[data-filter]").forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
      const f = chip.dataset.filter;
      let n = 0;
      items.forEach((it) => { const show = f === "all" || it.dataset.cat === f; it.hidden = !show; if (show) n++; });
      if (count) count.textContent = n + (n === 1 ? " item" : " items");
    });
  });

  // Gallery lightbox
  const lb = document.getElementById("lightbox");
  if (lb && typeof lb.showModal === "function") {
    const figs = [...document.querySelectorAll(".g")];
    const img = lb.querySelector("img"), pos = lb.querySelector("[data-lb-pos]"), txt = lb.querySelector("[data-lb-text]"), cta = lb.querySelector("[data-lb-cta]");
    let i = 0;
    const visible = () => figs.filter((f) => !f.hidden);
    function show(fig) {
      const list = visible(); i = list.indexOf(fig);
      img.src = fig.querySelector("img").src; img.alt = fig.querySelector("img").alt;
      pos.textContent = `${String(i + 1).padStart(2, "0")} / ${String(list.length).padStart(2, "0")} · ${fig.dataset.title}`;
      txt.textContent = fig.dataset.text;
      cta.textContent = "Arrange this";
    }
    const step = (d) => { const list = visible(); show(list[(i + d + list.length) % list.length]); };
    figs.forEach((f) => f.querySelector("button").addEventListener("click", () => { show(f); lb.showModal(); }));
    lb.querySelector("[data-lb-close]").addEventListener("click", () => lb.close());
    lb.querySelector("[data-lb-prev]").addEventListener("click", () => step(-1));
    lb.querySelector("[data-lb-next]").addEventListener("click", () => step(1));
    lb.addEventListener("keydown", (e) => { if (e.key === "ArrowLeft") step(-1); if (e.key === "ArrowRight") step(1); });
    let x0 = null;
    lb.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", (e) => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1); x0 = null; });
  }

  // Newsletter: no provider connected yet. TODO: post to the chosen mailing service.
  document.querySelectorAll("[data-newsletter]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const ok = form.parentElement.querySelector(".ok");
      if (ok) { ok.hidden = false; ok.textContent = "Thank you. The next letter will reach you."; }
      form.reset();
    });
  });
})();
