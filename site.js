// Aliyah Prestige, Riad Grid site: mobile menu, filters (gallery + journal), gallery lightbox, newsletter form, theme picker, sticky header.
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

  // Testimonial tabs (about layouts): click or arrow keys switch the quote
  document.querySelectorAll("[data-qtabs]").forEach((wrap) => {
    const tabs = [...wrap.querySelectorAll('[role="tab"]')];
    const show = (t) => tabs.forEach((x) => {
      const on = x === t;
      x.setAttribute("aria-selected", String(on));
      x.tabIndex = on ? 0 : -1;
      document.getElementById(x.getAttribute("aria-controls")).hidden = !on;
    });
    tabs.forEach((t, i) => {
      t.addEventListener("click", () => show(t));
      t.addEventListener("keydown", (e) => {
        const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (!step) return;
        e.preventDefault();
        const next = tabs[(i + step + tabs.length) % tabs.length];
        next.focus();
        show(next);
      });
    });
  });

  // Chapter index (about layout 2): mark the chapter in the middle of the screen
  document.querySelectorAll("[data-chapters]").forEach((nav) => {
    const links = [...nav.querySelectorAll('a[href^="#"]')];
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((a) => a.setAttribute("aria-current", String(a.getAttribute("href") === "#" + e.target.id)));
    }), { rootMargin: "-45% 0px -50% 0px" });
    links.forEach((a) => { const t = document.querySelector(a.getAttribute("href")); if (t) io.observe(t); });
  });

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

  // Tabs ("Exclusively for you" variant 11): one promise visible at a time
  document.querySelectorAll("[data-ex-tabs]").forEach((wrap) => {
    const tabs = [...wrap.querySelectorAll("[role=tab]")];
    tabs.forEach((tab) => tab.addEventListener("click", () => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.setAttribute("aria-pressed", String(on));
        document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
      });
    }));
  });

  // Sticky header: solid background once the page leaves the top
  const head = document.querySelector("header.site");
  if (head) {
    const onScroll = () => head.classList.toggle("scrolled", window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Theme picker: 3 dark and 26 light palettes, remembered per browser.
  // Keys must match site.css and the head script in build.mjs. [key, label, group, background, accent]; every group except "dark" is a light tone
  const root = document.documentElement;
  const themeBtn = document.querySelector("[data-theme-toggle]");
  const THEMES = [
    ["grey", "Warm grey", "dark", "#4A4842", "#DCD3B6"], ["forest", "Forest", "dark", "#183D32", "#A9B58A"], ["navy", "Navy", "dark", "#0B1426", "#B9A77E"],
    ["gallery", "Gallery Oxblood", "clean", "#FAF9F6", "#7B2232"], ["porcelain", "Porcelain Cobalt", "clean", "#FBFBF9", "#2442B8"],
    ["aubergine", "Pearl Aubergine", "clean", "#FAF8F7", "#5B2148"], ["champagne", "Champagne Ink", "clean", "#FBF8F1", "#86651C"],
    ["harbour", "Harbour Navy", "clean", "#F8F9FA", "#1B365D"], ["atelier", "Atelier Vermilion", "clean", "#FFFFFF", "#C2410C"],
    ["tadelakt", "Tadelakt", "light", "#F0E2CF", "#8A5A35"], ["rose", "Rose City", "light", "#F7DCD0", "#A0533F"],
    ["majorelle", "Majorelle", "light", "#2D4BA0", "#F2C230"], ["mint", "Mint Tea", "light", "#E3EEDD", "#3F6B4F"],
    ["saffron", "Saffron Souk", "light", "#FAE8C2", "#E3A21A"], ["atlas", "Atlas Snow", "light", "#E6EEF2", "#4E6470"],
    ["dune", "Agafay Dune", "light", "#F2DCC0", "#8F4F24"], ["zellige", "Zellige", "light", "#DCEFEA", "#1F6E6B"],
    ["blossom", "Orange Blossom", "light", "#FDE8D6", "#B0532A"], ["cedar", "Cedar & Brass", "light", "#EDE4D0", "#B08D3A"],
    ["linen", "Nordic Linen", "modern", "#EEF0EC", "#3E5C55"], ["lavender", "Lavender Haze", "modern", "#EEEAF6", "#5B4A9A"],
    ["riviera", "Riviera", "modern", "#E4F1F7", "#FF7A59"], ["peach", "Peach Fuzz", "modern", "#FCE9DE", "#B44A2E"],
    ["matcha", "Matcha Studio", "modern", "#EDF0DF", "#5A6B1E"], ["blush", "Blush Gallery", "modern", "#F8E9EC", "#A23B5C"],
    ["butter", "Butter & Ink", "modern", "#FBF3D5", "#2F2E8C"], ["clay", "Sage & Clay", "modern", "#ECEDE6", "#A0522D"],
    ["glacier", "Glacier Mono", "modern", "#F2F4F7", "#111827"], ["apricot", "Apricot & Teal", "modern", "#FFF1E3", "#0E7470"],
  ];
  const swatch = (bg, accent) => `background:linear-gradient(135deg, ${bg} 50%, ${accent} 50%)`;
  if (themeBtn) {
    const menu = document.createElement("div");
    menu.className = "theme-menu";
    menu.id = "theme-menu";
    menu.hidden = true;
    menu.setAttribute("role", "group");
    menu.setAttribute("aria-label", "Colour theme");
    menu.innerHTML = [["dark", "Dark"], ["clean", "Light · Clean"], ["light", "Light · Marrakech"], ["modern", "Light · Modern"]].map(([group, title]) => `<p class="lab">${title}</p><div class="opts">` +
      THEMES.filter((t) => t[2] === group).map(([k, label, , bg, ac]) =>
        `<button type="button" data-theme-key="${k}" aria-pressed="false"><i aria-hidden="true" style="${swatch(bg, ac)}"></i>${label}</button>`).join("") + "</div>").join("");
    themeBtn.after(menu);
    themeBtn.setAttribute("aria-controls", "theme-menu");
    themeBtn.setAttribute("aria-expanded", "false");

    const current = () => THEMES.find(([k]) => k === root.dataset.theme) || THEMES[0];
    const sync = () => {
      const [key, label, , bg, ac] = current();
      themeBtn.querySelector("span").textContent = label;
      themeBtn.querySelector("i").setAttribute("style", swatch(bg, ac));
      themeBtn.setAttribute("aria-label", `Colour theme: ${label}. Change theme`);
      menu.querySelectorAll("[data-theme-key]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.themeKey === key)));
    };
    const setOpen = (open) => { menu.hidden = !open; themeBtn.setAttribute("aria-expanded", String(open)); };
    sync();
    themeBtn.addEventListener("click", () => setOpen(menu.hidden));
    menu.addEventListener("click", (e) => {
      const b = e.target.closest("[data-theme-key]");
      if (!b) return;
      const [key, , group] = THEMES.find(([k]) => k === b.dataset.themeKey);
      if (key === "grey") delete root.dataset.theme; else root.dataset.theme = key;
      if (group !== "dark") root.dataset.tone = "light"; else delete root.dataset.tone;
      try { localStorage.setItem("theme", key); } catch (e) {}
      sync();
    });
    document.addEventListener("click", (e) => { if (!menu.hidden && !e.target.closest(".tools")) setOpen(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !menu.hidden) { setOpen(false); themeBtn.focus(); } });
  }
})();
