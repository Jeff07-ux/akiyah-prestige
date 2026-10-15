// Twenty layout proposals for the service pages, clean and dense, rendered from the same copy (collection/services.mjs).
// 1-10 use their own futuristic palettes; 11-20 use the site's colour theme and fonts. build.mjs writes design-01.html ...
// design-20.html (Private Jet Charter, the longest page), design-01-b.html ... (Private Villas, a short page) and
// service-designs.html to compare them. Styles: service-designs.css, inlined into those pages only. Once one is chosen
// it replaces the service page template and the rest of this file goes.

// Extra atmosphere photos per service (img/ap), for designs that need more than the service's two photos.
const EXTRA = {
  "private-jet-charter": ["ap/lounge", "ap/corridor"],
  "luxury-villas-riads-hotels": ["ap/pool-water", "ap/riad-salon"],
  "private-chef-gastronomy": ["ap/candle-dinner", "ap/textiles"],
  "wellness-spa": ["ap/pool-water", "ap/embroidery"],
  "private-cultural-tours": ["ap/koutoubia", "ap/majorelle"],
  "luxury-event-planner": ["ap/candle-dinner", "ap/agafay-dinner"],
  "chauffeur-transportation": ["ap/corridor", "ap/palms"],
  "private-souk-shopping": ["ap/textiles", "ap/embroidery"],
  "desert-atlas-escapes": ["ap/caravan", "ap/desert-sunset"],
  "private-concierge-24-7": ["ap/lounge", "ap/riad-salon"],
};

export function serviceDesigns(h) {
  const { esc: e, attr, im, slug, WA, WA_URL, EMAIL, PROMISE, ask, groups, kind, label, others, href } = h;
  const ps = (items) => items.filter(([t]) => t === "p").map(([, v]) => v);
  const P = (arr, cls = "") => arr.map((t) => `<p${cls ? ` class="${cls}"` : ""}>${e(t)}</p>`).join("");
  const two = (n) => String(n).padStart(2, "0");

  // The service as data: opening paragraphs, one entry per h2 section, and the closing quote ("band").
  function model(sv) {
    const [intro, ...rest] = groups(sv.blocks);
    let band = null;
    const secs = [];
    for (const g of rest) {
      let items = g.items;
      const q = items.find(([t]) => t === "quote");
      if (q) {
        items = items.filter((b) => b !== q);
        if (!items.some(([t]) => t === "ul")) { band = { h: g.h, q: q[1], paras: ps(items) }; continue; }
        band = { q: q[1], paras: [] };
      }
      const at = items.findIndex(([t]) => t === "ul");
      const k = kind(items);
      const ul = at < 0 ? [] : items[at][1];
      secs.push({ h: g.h, id: slug(g.h), kind: k,
        before: ps(at < 0 ? items : items.slice(0, at)), after: ps(at < 0 ? [] : items.slice(at + 1)),
        items: ul.map((t) => { const s = k === "steps" ? t.replace(/^\d+\.\s+/, "") : t; const m = label(s); return { l: m ? m[1] : s, d: m ? m[2] : "" }; }) });
    }
    const iq = intro.items.find(([t]) => t === "quote");
    if (iq && !band) band = { q: iq[1], paras: [] };
    return { intro: ps(intro.items), secs, band, x: EXTRA[sv.slug] || ["ap/lounge", "ap/textiles"] };
  }

  // ---------- Shared pieces ----------
  const crumb = (sv) => `<p class="crumb"><a href="index.html#services">Services</a> / <b>${e(sv.name)}</b></p>`;
  const acts = (sv) => `<div class="cta-acts"><a class="btn solid" href="${ask(sv)}">WhatsApp the concierge</a><a class="btn" href="${WA_URL}" data-planner data-interest-pre="${attr(sv.plan || "")}">Plan your stay</a></div>`;
  const alt = (sv, extra = "") => attr(`${sv.name}${extra}, Aliyah Prestige, Marrakech`);
  const img = (src, a, sizes, eager = false) => `<img src="${im(src)}" alt="${a}"${eager ? "" : ' loading="lazy"'} sizes="${sizes}">`;
  const jump = (m) => m.secs.map((s) => `<a class="chip-x" href="#${s.id}">${e(s.h)}</a>`).join("");
  // One list item. Steps carry their number; other items a small accent mark drawn in CSS.
  const li = (it, k, s, cls = "") => `<li${cls ? ` class="${cls}"` : ""}>${s.kind === "steps" ? `<span class="num">${two(k + 1)}</span>` : ""}<h3>${e(it.l)}</h3>${it.d ? `<p>${e(it.d)}</p>` : ""}</li>`;
  const list = (s, cls, liCls = "") => (s.items.length ? `<ul class="${cls}">${s.items.map((it, k) => li(it, k, s, liCls)).join("")}</ul>` : "");
  const copy = (s) => (s.before.length || s.after.length ? `<div class="copy-t">${P(s.before)}${P(s.after)}</div>` : "");
  const bandHtml = (sv, m, cls = "") => (m.band ? `<section class="${cls}"${m.band.h ? ` aria-labelledby="${slug(m.band.h)}"` : ""}>${m.band.h ? `<h2 class="k" id="${slug(m.band.h)}">${e(m.band.h)}</h2>` : ""}<blockquote>${e(m.band.q)}</blockquote>${P(m.band.paras, "mute")}${acts(sv)}</section>` : "");
  // Shared end: the example day, other services, the enquiry panel. Each design styles it through its tokens.
  const tail = (sv) => `<section class="fx-tail">
${sv.day ? `<div class="fx-block"><div class="fx-row-h"><h2>How a day can unfold</h2><p class="mute">One illustration, not a fixed programme. Every day is planned around you.</p></div>
  <ol class="fx-day">${sv.day.map(([t, hh, p]) => `<li><span class="k">${e(t)}</span><h3>${e(hh)}</h3><p>${e(p)}</p></li>`).join("")}</ol></div>` : ""}
<div class="fx-block"><div class="fx-row-h"><h2>Also arranged</h2><a class="btn" href="index.html#services">All services</a></div>
  <ul class="fx-more">${others(sv).map((o) => `<li><a href="${href(o)}">${img(o.img, "", "(max-width: 900px) 50vw, 25vw")}<span class="k">${e(o.kicker)}</span><h3>${e(o.card)}</h3></a></li>`).join("")}</ul></div>
<div class="fx-block fx-cta" id="enquire"><div><h2>Tell us the date.</h2><p class="mute">A message on WhatsApp is enough: where from, when, how many. Two or three options follow within the hour.</p></div>
  <div>${acts(sv)}${PROMISE}<p class="k fx-contact">${e(WA)} &nbsp;/&nbsp; ${e(EMAIL)}</p></div></div>
</section>`;
  // A pinned enquiry bar along the bottom of the screen.
  const bar = (sv) => `<div class="fx-bar"><span>${e(sv.name)}</span><a class="btn solid" href="${ask(sv)}">WhatsApp the concierge</a></div>`;

  const D = [];

  // 1. Glass noir: dark, a full-bleed photograph behind frosted panels; the page is a stack of rounded panels.
  D.push({ name: "Glass noir", note: "Dark. Photo hero under frosted-glass panels, the page as a tight stack of rounded panels.", cls: "fx-dark f1", solid: false,
    render(sv, m) {
      const secs = m.secs.map((s) => `<section class="pnl f1-sec"><h2 id="${s.id}">${e(s.h)}</h2>${copy(s)}${list(s, "f1-cards")}</section>`).join("\n");
      return `<section class="f1-hero">${img(sv.img, alt(sv), "100vw", true)}<div class="f1-hero-in">
  <div class="glass f1-main">${crumb(sv)}<h1 class="H">${sv.title}</h1><p class="lead">${e(sv.lead)}</p>${acts(sv)}${PROMISE}</div>
  <nav class="glass f1-jump" aria-label="On this page"><span class="k">On this page</span>${jump(m)}</nav></div></section>
<div class="f1-stack">
<section class="pnl f1-intro"><p class="big">${e(m.intro[0])}</p><div class="copy-t cols">${P(m.intro.slice(1))}</div></section>
${secs}
${bandHtml(sv, m, "pnl f1-band")}
</div>`;
    } });

  // 2. Instrument: dark, hairline frames with corner ticks, mono labels; every topic a numbered module.
  D.push({ name: "Instrument", note: "Dark. Hairline frames with corner ticks, mono labels, numbered modules, cells on a 1px grid.", cls: "fx-dark f2", solid: false,
    render(sv, m) {
      const secs = m.secs.map((s, i) => `<section class="f2-frame f2-sec"><header><span class="k">${two(i + 1)} / ${two(m.secs.length)}</span><h2 id="${s.id}">${e(s.h)}</h2></header>
  <div class="f2-body">${copy(s) || "<div></div>"}${list(s, "f2-cells")}</div></section>`).join("\n");
      return `<section class="f2-frame f2-hero"><div class="f2-hero-c">${crumb(sv)}<h1 class="H">${sv.title}</h1><p class="lead">${e(sv.lead)}</p>${acts(sv)}${PROMISE}</div>
  <figure class="f2-fig tick">${img(sv.img, alt(sv), "(max-width: 900px) 100vw, 50vw", true)}</figure></section>
<section class="f2-frame f2-intro"><p class="big">${e(m.intro[0])}</p><div class="copy-t cols">${P(m.intro.slice(1))}</div><figure class="f2-mini tick">${img(sv.pic, alt(sv, ", detail"), "25vw")}</figure></section>
${secs}
${bandHtml(sv, m, "f2-frame f2-band")}`;
    } });

  // 3. Light bento: white rounded cards on a cool grey ground, photo tiles and a dark enquiry tile.
  D.push({ name: "Light bento", note: "Light. White rounded cards on soft grey, photo tiles, a dark enquiry tile. Product-launch feel.", cls: "fx-light f3", solid: true,
    render(sv, m) {
      const secs = m.secs.map((s, i) => `<section class="f3-sec"><div class="b f3-head${i % 3 === 1 ? " f3-dark" : ""}"><h2 id="${s.id}">${e(s.h)}</h2>${copy(s)}</div>${list(s, "f3-items", "b")}</section>`).join("\n");
      return `<section class="f3-hero">
  <div class="b f3-title">${crumb(sv)}<h1 class="H">${sv.title}</h1><p class="lead">${e(sv.lead)}</p></div>
  <div class="b ph f3-p1">${img(sv.img, alt(sv), "(max-width: 900px) 100vw, 50vw", true)}</div>
  <div class="b f3-cta"><p class="big">One message is enough.</p>${acts(sv)}${PROMISE}</div>
  <div class="b ph f3-p2">${img(sv.pic, alt(sv, ", detail"), "(max-width: 900px) 100vw, 25vw")}</div>
</section>
<section class="b f3-intro"><p class="big">${e(m.intro[0])}</p><div class="copy-t cols">${P(m.intro.slice(1))}</div></section>
${secs}
${bandHtml(sv, m, "b f3-band")}`;
    } });

  // 4. Console: a dark control column pinned on the left (title, enquiry, quick links), light content cards on the right.
  D.push({ name: "Console", note: "App layout. Dark pinned control column with the enquiry and quick links, light content cards beside it.", cls: "fx-light f4", solid: true,
    render(sv, m) {
      const secs = m.secs.map((s) => `<section class="card f4-sec"><h2 id="${s.id}">${e(s.h)}</h2>${copy(s)}${list(s, "f4-rows")}</section>`).join("\n");
      return `<div class="f4-grid"><aside class="f4-side"><div class="f4-side-in">${crumb(sv)}<h1 class="H">${sv.title}</h1><p class="lead">${e(sv.lead)}</p>${acts(sv)}${PROMISE}
  <nav class="f4-jump" aria-label="On this page"><span class="k">On this page</span>${jump(m)}</nav></div></aside>
<div class="f4-main">
  <figure class="f4-img">${img(sv.img, alt(sv), "(max-width: 900px) 100vw, 66vw", true)}</figure>
  <section class="card f4-intro"><p class="big">${e(m.intro[0])}</p><div class="copy-t cols">${P(m.intro.slice(1))}</div></section>
  ${secs}
  ${bandHtml(sv, m, "card f4-band")}
</div></div>`;
    } });

  // 5. Monolith: black, full-screen photographs, centred title, buttons at the foot of the screen, a pinned enquiry bar.
  D.push({ name: "Monolith", note: "Black. Full-screen photos, centred title with buttons at the foot, tight two-column topics, pinned enquiry bar.", cls: "fx-dark f5", solid: false,
    render(sv, m) {
      const secs = m.secs.map((s, i) => `<section class="f5-sec"><div class="f5-l"><h2 id="${s.id}">${e(s.h)}</h2>${copy(s)}</div>${list(s, "f5-rows") || "<div></div>"}</section>
${i === 0 ? `<section class="f5-photo">${img(sv.pic, alt(sv, ", detail"), "100vw")}<p class="big">${e(m.intro[0])}</p></section>` : ""}`).join("\n");
      return `<section class="f5-hero">${img(sv.img, alt(sv), "100vw", true)}<div class="f5-top">${crumb(sv)}<h1 class="H">${sv.title}</h1><p class="lead">${e(sv.lead)}</p></div><div class="f5-foot">${acts(sv)}${PROMISE}</div></section>
<section class="f5-intro"><div class="copy-t cols">${P(m.intro.slice(1).length ? m.intro.slice(1) : m.intro)}</div></section>
${secs}
${bandHtml(sv, m, "f5-band")}
${bar(sv)}`;
    } });

  // 6. Aurora: dark with soft glows in the theme accent, glass cards on horizontal rails.
  D.push({ name: "Aurora rails", note: "Dark with soft accent glows. Glowing photo frame, every topic a swipeable rail of glass cards.", cls: "fx-dark f6", solid: false,
    render(sv, m) {
      const secs = m.secs.map((s) => `<section class="f6-sec"><div class="f6-h"><h2 id="${s.id}">${e(s.h)}</h2>${copy(s)}</div>${list(s, "f6-rail", "glass")}</section>`).join("\n");
      return `<section class="f6-hero"><div class="f6-hero-c">${crumb(sv)}<h1 class="H">${sv.title}</h1><p class="lead">${e(sv.lead)}</p>${acts(sv)}${PROMISE}</div>
  <figure class="f6-fig">${img(sv.img, alt(sv), "(max-width: 900px) 100vw, 50vw", true)}</figure></section>
<section class="glass f6-intro"><p class="big">${e(m.intro[0])}</p><div class="copy-t cols">${P(m.intro.slice(1))}</div></section>
${secs}
${bandHtml(sv, m, "glass f6-band")}`;
    } });

  // 7. Blueprint: light, the whole page inside one ruled frame; rows and cells divided by 1px lines with + marks.
  D.push({ name: "Blueprint grid", note: "Light. The page inside one ruled frame, rows and cells on 1px lines with + marks at the joins.", cls: "fx-light f7", solid: true, ownTail: true,
    render(sv, m) {
      const secs = m.secs.map((s) => `<section class="f7-row f7-sec"><div class="f7-cell f7-h"><h2 id="${s.id}">${e(s.h)}</h2>${copy(s)}</div>${s.items.length ? list(s, "f7-cells") : ""}</section>`).join("\n");
      return `<div class="f7-box">
<section class="f7-row f7-hero"><div class="f7-cell">${crumb(sv)}<h1 class="H">${sv.title}</h1><p class="lead">${e(sv.lead)}</p>${acts(sv)}${PROMISE}</div><figure class="f7-cell f7-fig">${img(sv.img, alt(sv), "(max-width: 900px) 100vw, 50vw", true)}</figure></section>
<section class="f7-row f7-intro"><div class="f7-cell"><p class="big">${e(m.intro[0])}</p></div><div class="f7-cell copy-t">${P(m.intro.slice(1))}</div><figure class="f7-cell f7-fig">${img(sv.pic, alt(sv, ", detail"), "25vw")}</figure></section>
${secs}
${m.band ? `<div class="f7-row">${bandHtml(sv, m, "f7-cell f7-band")}</div>` : ""}
${tail(sv)}
</div>`;
    } });

  // 8. Tabs: compact hero in a rounded frame, then one panel with a segmented control switching between topics.
  D.push({ name: "Tabbed console", note: "Dark grey. Compact framed hero, then one panel with a segmented control that switches topics.", cls: "fx-dark f8", solid: false,
    render(sv, m) {
      const tabs = m.secs.map((s, i) => `<input class="vh f8-r" type="radio" name="f8" id="f8-${i}"${i ? "" : " checked"}>`).join("");
      const seg = m.secs.map((s, i) => `<label for="f8-${i}">${e(s.h)}</label>`).join("");
      const panels = m.secs.map((s) => `<div class="f8-p"><div class="f8-pc"><h2 id="${s.id}">${e(s.h)}</h2>${copy(s)}</div>${list(s, "f8-items")}</div>`).join("");
      return `<section class="pnl f8-hero"><div class="f8-hero-c">${crumb(sv)}<h1 class="H">${sv.title}</h1><p class="lead">${e(sv.lead)}</p>${acts(sv)}${PROMISE}</div>
  <figure class="f8-fig">${img(sv.img, alt(sv), "(max-width: 900px) 100vw, 50vw", true)}</figure></section>
<section class="pnl f8-intro"><p class="big">${e(m.intro[0])}</p><div class="copy-t cols">${P(m.intro.slice(1))}</div></section>
<section class="pnl f8-tabs">${tabs}<div class="f8-seg">${seg}</div><div class="f8-panels">${panels}</div></section>
${bandHtml(sv, m, "pnl f8-band")}`;
    } });

  // 9. Grouped: light, a rounded inset photograph with a glass title card, topics as grouped lists like a settings app.
  D.push({ name: "Grouped lists", note: "Light. Rounded inset photo with a glass title card, topics as grouped list cards, phone-app clean.", cls: "fx-light f9", solid: true,
    render(sv, m) {
      const secs = m.secs.map((s) => `<section class="f9-sec"><h2 id="${s.id}">${e(s.h)}</h2>${copy(s) ? `<div class="f9-card f9-copy">${copy(s)}</div>` : ""}${list(s, "f9-card f9-group")}</section>`).join("\n");
      return `<section class="f9-hero">${img(sv.img, alt(sv), "100vw", true)}<div class="glass f9-title">${crumb(sv)}<h1 class="H">${sv.title}</h1><p class="lead">${e(sv.lead)}</p>${acts(sv)}${PROMISE}</div></section>
<div class="f9-col">
<section class="f9-card f9-intro"><p class="big">${e(m.intro[0])}</p><div class="copy-t">${P(m.intro.slice(1))}</div></section>
${secs}
${bandHtml(sv, m, "f9-card f9-band")}
</div>`;
    } });

  // 10. Capsule: light, centred title with quick-link capsules, a wide rounded photo, topics in large rounded cards,
  // and a pinned enquiry bar.
  D.push({ name: "Capsule", note: "Light. Centred title with quick-link capsules, wide rounded photo, big rounded topic cards, pinned enquiry bar.", cls: "fx-light f10", solid: true,
    render(sv, m) {
      const secs = m.secs.map((s, i) => `<section class="card f10-sec${i % 2 ? " flip" : ""}"><div class="f10-h"><h2 id="${s.id}">${e(s.h)}</h2>${copy(s)}</div>${list(s, "f10-tiles") || `<figure class="f10-fig">${img(m.x[1], "", "(max-width: 900px) 100vw, 50vw")}</figure>`}</section>`).join("\n");
      return `<section class="f10-hero">${crumb(sv)}<h1 class="H">${sv.title}</h1><p class="lead">${e(sv.lead)}</p>${acts(sv)}${PROMISE}<nav class="f10-jump" aria-label="On this page">${jump(m)}</nav></section>
<section class="f10-media"><figure class="f10-a">${img(sv.img, alt(sv), "(max-width: 900px) 100vw, 66vw", true)}</figure><figure class="f10-b">${img(sv.pic, alt(sv, ", detail"), "(max-width: 900px) 100vw, 33vw")}</figure></section>
<section class="card f10-intro"><p class="big">${e(m.intro[0])}</p><div class="copy-t cols">${P(m.intro.slice(1))}</div></section>
${secs}
${bandHtml(sv, m, "card f10-band")}
${bar(sv)}`;
    } });

  // ---------- 11-20: the site's own palette (colour theme tokens) and fonts (Playfair headings, Poppins text) ----------
  const pics = (sv, m) => [sv.img, sv.pic, m.x[0], m.x[1]];
  // The three promises from the home page, as written there.
  const PROMISES = [["1", "concierge for your whole stay"], ["0", "names ever shared"], ["24/7", "a real person answers"]];

  // 11. Courtyard: a framed photograph with the title panel set into its corner; topics as dense three-column cards.
  D.push({ name: "Courtyard frame", note: "Framed full-width photo with the title panel cut into its corner, dense three-column topic cards.", cls: "fx-brand b11", solid: true, brand: true,
    render(sv, m) {
      const secs = m.secs.map((s) => `<section class="b11-sec"><div class="b11-h"><h2 id="${s.id}">${e(s.h)}</h2>${copy(s)}</div>${list(s, "b11-grid")}</section>`).join("\n");
      return `<section class="b11-hero">${img(sv.img, alt(sv), "100vw", true)}<div class="b11-panel">${crumb(sv)}<h1 class="H">${sv.title}</h1><p class="lead">${e(sv.lead)}</p>${acts(sv)}${PROMISE}</div></section>
<section class="b11-intro"><p class="big">${e(m.intro[0])}</p><div class="copy-t cols">${P(m.intro.slice(1))}</div></section>
${secs}
${bandHtml(sv, m, "b11-band")}`;
    } });

  // 12. Ledger: a catalogue page. Strong rules, topic name in the margin, items set as a ruled three-column table.
  D.push({ name: "Ledger", note: "Catalogue style: three-photo strip, strong rules, topic in the margin, items as a ruled table.", cls: "fx-brand b12", solid: true, brand: true,
    render(sv, m) {
      const [a, b, c] = pics(sv, m);
      const secs = m.secs.map((s) => `<section class="b12-row"><div class="b12-l"><h2 id="${s.id}">${e(s.h)}</h2>${copy(s)}</div>${list(s, "b12-table") || "<div></div>"}</section>`).join("\n");
      return `<section class="b12-hero"><div class="b12-t">${crumb(sv)}<h1 class="H">${sv.title}</h1><p class="lead">${e(sv.lead)}</p>${acts(sv)}${PROMISE}</div>
  <div class="b12-strip">${img(a, alt(sv), "(max-width: 900px) 100vw, 30vw", true)}${img(b, alt(sv, ", detail"), "20vw")}${img(c, "", "20vw")}</div></section>
<section class="b12-row b12-intro"><div class="b12-l"><p class="k">${e(sv.kicker)}</p></div><div><p class="big">${e(m.intro[0])}</p><div class="copy-t cols">${P(m.intro.slice(1))}</div></div></section>
${secs}
${bandHtml(sv, m, "b12-band")}`;
    } });

  // 13. Zellige: a square-tiled mosaic, tight 6px joints, photo tiles and one tile in the button colour.
  D.push({ name: "Zellige mosaic", note: "Square tiles with tight joints like zellige: photo tiles, an accent enquiry tile, every topic a tile group.", cls: "fx-brand b13", solid: true, brand: true,
    render(sv, m) {
      const secs = m.secs.map((s, i) => `<section class="b13-sec"><div class="b13-t b13-head${i % 2 ? " alt" : ""}"><h2 id="${s.id}">${e(s.h)}</h2>${copy(s)}</div>${list(s, "b13-items", "b13-t")}</section>`).join("\n");
      return `<section class="b13-hero">
  <div class="b13-t b13-title">${crumb(sv)}<h1 class="H">${sv.title}</h1><p class="lead">${e(sv.lead)}</p></div>
  <div class="b13-t b13-ph b13-p1">${img(sv.img, alt(sv), "(max-width: 900px) 100vw, 50vw", true)}</div>
  <div class="b13-t b13-cta"><p class="big">One message is enough.</p>${acts(sv)}${PROMISE}</div>
  <div class="b13-t b13-ph b13-p2">${img(sv.pic, alt(sv, ", detail"), "(max-width: 900px) 100vw, 25vw")}</div>
  <div class="b13-t b13-ph b13-p3">${img(m.x[0], "", "(max-width: 900px) 100vw, 25vw")}</div>
</section>
<section class="b13-t b13-intro"><p class="big">${e(m.intro[0])}</p><div class="copy-t cols">${P(m.intro.slice(1))}</div></section>
${secs}
${bandHtml(sv, m, "b13-t b13-band")}`;
    } });

  // 14. Desk: a pinned bar of topic links, content on the left, an enquiry card pinned on the right.
  D.push({ name: "Concierge desk", note: "Pinned bar of topic links under the menu, content left, an enquiry card that stays in view on the right.", cls: "fx-brand b14", solid: true, brand: true,
    render(sv, m) {
      const secs = m.secs.map((s) => `<section class="b14-sec"><h2 id="${s.id}">${e(s.h)}</h2>${copy(s)}${list(s, "b14-items")}</section>`).join("\n");
      return `<section class="b14-hero"><div>${crumb(sv)}<h1 class="H">${sv.title}</h1><p class="lead">${e(sv.lead)}</p>${acts(sv)}${PROMISE}</div><figure>${img(sv.img, alt(sv), "(max-width: 900px) 100vw, 50vw", true)}</figure></section>
<nav class="b14-bar" aria-label="On this page"><b>${e(sv.name)}</b><div class="b14-links">${jump(m)}</div><a class="btn solid" href="${ask(sv)}">WhatsApp</a></nav>
<div class="b14-grid"><div class="b14-main">
  <section class="b14-sec b14-intro"><p class="big">${e(m.intro[0])}</p><div class="copy-t cols">${P(m.intro.slice(1))}</div></section>
  ${secs}
  ${bandHtml(sv, m, "b14-sec b14-band")}
</div><aside class="b14-side"><div class="b14-card">${img(sv.pic, "", "320px")}<p class="k">Arrange this</p><p class="b14-q">One message is enough. Ask about ${e(sv.name.toLowerCase())}, or plan the whole stay.</p>${acts(sv)}${PROMISE}<p class="k fx-contact">${e(WA)}<br>${e(EMAIL)}</p></div></aside></div>`;
    } });

  // 15. Overlap: photo bands with content panels lifted over their lower edge.
  D.push({ name: "Overlap panels", note: "Photo bands between topics, each content panel lifted over the photo's lower edge.", cls: "fx-brand b15", solid: true, brand: true,
    render(sv, m) {
      const ph = pics(sv, m);
      let k = 1;
      const secs = m.secs.map((s, i) => {
        const band = i % 2 === 0 && k < ph.length ? `<div class="b15-photo">${img(ph[k++], "", "100vw")}</div>` : "";
        return `<section class="b15-sec${band ? " lifted" : ""}">${band}<div class="b15-panel"><div class="b15-h"><h2 id="${s.id}">${e(s.h)}</h2>${copy(s)}</div>${list(s, "b15-items")}</div></section>`;
      }).join("\n");
      return `<section class="b15-sec lifted b15-hero"><div class="b15-photo">${img(sv.img, alt(sv), "100vw", true)}</div><div class="b15-panel">${crumb(sv)}<h1 class="H">${sv.title}</h1><div class="b15-hrow"><p class="lead">${e(sv.lead)}</p><div>${acts(sv)}${PROMISE}</div></div></div></section>
<section class="b15-sec"><div class="b15-panel b15-intro"><p class="big">${e(m.intro[0])}</p><div class="copy-t cols">${P(m.intro.slice(1))}</div></div></section>
${secs}
${m.band ? `<section class="b15-sec">${bandHtml(sv, m, "b15-panel b15-band")}</section>` : ""}`;
    } });

  // 16. Spreads: every topic a two-page spread, photograph on one page and dense copy on the other, sides alternating.
  D.push({ name: "Brochure spreads", note: "Each topic a two-page spread: photo on one half, dense content on the other, sides alternating.", cls: "fx-brand b16", solid: true, brand: true,
    render(sv, m) {
      const ph = pics(sv, m);
      const secs = m.secs.map((s, i) => `<section class="b16-spread${i % 2 ? "" : " flip"}"><figure>${img(ph[(i + 1) % ph.length], "", "(max-width: 900px) 100vw, 50vw")}</figure><div class="b16-c"><h2 id="${s.id}">${e(s.h)}</h2>${copy(s)}${list(s, "b16-items")}</div></section>`).join("\n");
      return `<section class="b16-spread b16-hero"><figure>${img(sv.img, alt(sv), "(max-width: 900px) 100vw, 50vw", true)}</figure><div class="b16-c">${crumb(sv)}<h1 class="H">${sv.title}</h1><p class="lead">${e(sv.lead)}</p>${acts(sv)}${PROMISE}<p class="big b16-intro">${e(m.intro[0])}</p><div class="copy-t">${P(m.intro.slice(1))}</div></div></section>
${secs}
${bandHtml(sv, m, "b16-band")}`;
    } });

  // 17. Index tabs: topic names listed down the left like a ledger index; the chosen topic opens on the right.
  D.push({ name: "Index tabs", note: "Topic names listed down the left like an index; the chosen topic opens beside it. Very short page.", cls: "fx-brand b17", solid: true, brand: true,
    render(sv, m) {
      const tabs = m.secs.map((s, i) => `<input class="vh b17-r" type="radio" name="b17" id="b17-${i}"${i ? "" : " checked"}>`).join("");
      const labels = m.secs.map((s, i) => `<label for="b17-${i}"><span class="k">${two(i + 1)}</span>${e(s.h)}</label>`).join("");
      const panels = m.secs.map((s) => `<div class="b17-p"><h2 id="${s.id}">${e(s.h)}</h2>${copy(s)}${list(s, "b17-items")}</div>`).join("");
      return `<section class="b17-hero"><div>${crumb(sv)}<h1 class="H">${sv.title}</h1><p class="lead">${e(sv.lead)}</p>${acts(sv)}${PROMISE}</div><figure>${img(sv.img, alt(sv), "(max-width: 900px) 100vw, 45vw", true)}</figure></section>
<section class="b17-intro"><p class="big">${e(m.intro[0])}</p><div class="copy-t cols">${P(m.intro.slice(1))}</div></section>
<section class="b17-tabs">${tabs}<div class="b17-list">${labels}</div><div class="b17-panels">${panels}</div></section>
${bandHtml(sv, m, "b17-band")}`;
    } });

  // 18. Section cards: the home page's three promises as a figure strip, then every topic a card with its own photograph.
  D.push({ name: "Photo cards", note: "The three promises as a figure strip, then each topic as a card with its own photo, two columns.", cls: "fx-brand b18", solid: true, brand: true,
    render(sv, m) {
      const ph = pics(sv, m);
      const cards = m.secs.map((s, i) => `<section class="b18-card">${img(ph[(i + 1) % ph.length], "", "(max-width: 900px) 100vw, 50vw")}<div class="b18-b"><h2 id="${s.id}">${e(s.h)}</h2>${copy(s)}${list(s, "b18-items")}</div></section>`).join("\n");
      return `<section class="b18-hero"><div class="b18-t">${crumb(sv)}<h1 class="H">${sv.title}</h1><p class="lead">${e(sv.lead)}</p>${acts(sv)}${PROMISE}</div><figure>${img(sv.img, alt(sv), "(max-width: 900px) 100vw, 55vw", true)}</figure></section>
<ul class="b18-stats">${PROMISES.map(([f, t]) => `<li><b>${f}</b><span>${t}</span></li>`).join("")}</ul>
<section class="b18-intro"><p class="big">${e(m.intro[0])}</p><div class="copy-t cols">${P(m.intro.slice(1))}</div></section>
<div class="b18-grid">${cards}</div>
${bandHtml(sv, m, "b18-band")}`;
    } });

  // 19. Backdrop: the photograph stays fixed behind the page; translucent panels in the theme colour scroll over it.
  D.push({ name: "Photo backdrop", note: "The photo stays fixed behind the page; frosted panels in the theme colour scroll over it, alternating sides.", cls: "fx-brand b19", solid: true, brand: true,
    render(sv, m) {
      const secs = m.secs.map((s, i) => `<section class="b19-p${i % 2 ? " r" : ""}"><h2 id="${s.id}">${e(s.h)}</h2>${copy(s)}${list(s, "b19-items")}</section>`).join("\n");
      return `<div class="b19-wrap"><div class="b19-bg" aria-hidden="true">${img(sv.img, "", "100vw", true)}</div>
<section class="b19-p b19-hero">${crumb(sv)}<h1 class="H">${sv.title}</h1><p class="lead">${e(sv.lead)}</p>${acts(sv)}${PROMISE}</section>
<section class="b19-p r"><p class="big">${e(m.intro[0])}</p><div class="copy-t">${P(m.intro.slice(1))}</div></section>
${secs}
${bandHtml(sv, m, "b19-p b19-band")}
</div>`;
    } });

  // 20. Wall: dense mosaics of tiles, one per topic. Topic headings span two columns, items fill single tiles, photos run two rows.
  D.push({ name: "Mosaic wall", note: "One dense wall of tiles: topic headings span two columns, items fill tiles, photos interleaved.", cls: "fx-brand b20", solid: true, brand: true,
    render(sv, m) {
      const ph = pics(sv, m);
      // One wall per topic, so tiles never drift into another topic's group.
      const walls = m.secs.map((s, i) => `<ul class="b20-wall"><li class="b20-head${i % 2 ? " alt" : ""}"><h2 id="${s.id}">${e(s.h)}</h2>${copy(s)}</li>${s.items.map((it, k) => li(it, k, s, "b20-item")).join("")}${i < 3 ? `<li class="b20-ph" aria-hidden="true">${img(ph[i + 1], "", "(max-width: 900px) 50vw, 25vw")}</li>` : ""}</ul>`).join("\n");
      return `<section class="b20-hero"><div>${crumb(sv)}<h1 class="H">${sv.title}</h1></div><div><p class="lead">${e(sv.lead)}</p>${acts(sv)}${PROMISE}</div></section>
<figure class="b20-wide">${img(sv.img, alt(sv), "100vw", true)}</figure>
<section class="b20-intro"><p class="big">${e(m.intro[0])}</p><div class="copy-t">${P(m.intro.slice(1))}</div></section>
${walls}
${bandHtml(sv, m, "b20-band")}`;
    } });

  return { model, designs: D, tail };
}
