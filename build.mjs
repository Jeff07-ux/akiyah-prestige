// Builds the Aliyah Prestige "Riad Grid" site: home, service, gallery, journal, article.
// Shared copy lives in ./collection/content.mjs. Edit this file or site.css, then run: node build.mjs
// Phone, email, WhatsApp link, dates and figures are placeholders until the client confirms them.
import { writeFileSync } from "node:fs";
import { POSTS, ARTICLE } from "./collection/content.mjs";

const WA = "+212 6 00 00 00 00";
const WA_URL = "https://wa.me/212600000000";
const EMAIL = "concierge@aliyahprestige.ma";
const im = (k) => `img/${k}.jpg`;
// Vertical guide rails were removed from the design; kept as an empty slot so sections need no edits.
const rails = "";
const NAV = [["Gallery", "gallery.html", "gallery"], ["Events", "index.html#events", "events"], ["Services", "index.html#services", "service"], ["Journal", "journal.html", "journal"], ["About", "about.html", "about"]];

// Brand key, traced from the company logo (img/IMG_9832.PNG) as line art so it stays crisp and takes the theme colour.
const KEY = `<svg class="logo-key" viewBox="0 0 48 96" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">
<circle pathLength="1" cx="24" cy="8" r="4.5"/><path pathLength="1" d="M24 12.5V16"/>
<path pathLength="1" d="M16.44 26.61A8 8 0 1 1 31.56 26.61A9.5 9.5 0 1 1 24 39.04A9.5 9.5 0 1 1 16.44 26.61Z"/>
<path pathLength="1" d="M24 19Q28.2 24.6 24 30.2Q19.8 24.6 24 19Z"/>
<path pathLength="1" d="M24 34.5C21 31 15.6 31.4 15.2 35.4C14.9 38.6 18.8 39.6 19.7 37C20.3 35.3 18.4 34.3 17.4 35.6"/>
<path pathLength="1" d="M24 34.5C27 31 32.4 31.4 32.8 35.4C33.1 38.6 29.2 39.6 28.3 37C27.7 35.3 29.6 34.3 30.6 35.6"/>
<path pathLength="1" d="M24 30.2V92"/><path pathLength="1" d="M20.5 45H27.5M21.5 48.5H26.5"/>
<path pathLength="1" d="M24 73H16.5V77.5H20V80.5H16.5V85H24"/>
</svg>`;

function header(page) {
  const link = ([t, h, k]) => `<a href="${h}"${k === page ? ' aria-current="page"' : ""}>${t}</a>`;
  // Links split either side of the centred logo: three on the left, the rest plus Enquire on the right.
  const left = NAV.slice(0, 3).map(link).join("");
  const right = NAV.slice(3).map(link).join("") + `<a href="#enquire">Enquire</a>`;
  return `<a class="skip" href="#main">Skip to content</a>
<header class="site"><div class="in"><a class="logo" href="index.html" aria-label="Aliyah Prestige, home"><span class="logo-word">Aliyah</span>${KEY}<span class="logo-word">Prestige</span></a>
  <nav class="nav-l" aria-label="Main">${left}</nav>
  <div class="tools"><nav class="nav-r" aria-label="More">${right}</nav>
  <button class="menu-btn" type="button" data-menu-open aria-controls="drawer" aria-expanded="false">Menu</button></div></div></header>
<div class="drawer" id="drawer" hidden role="dialog" aria-modal="true" aria-label="Menu">
  <div class="top"><span class="logo">Aliyah Prestige</span><button class="chip" type="button" data-menu-close>Close</button></div>
  <nav aria-label="Mobile">${NAV.map(([t, h]) => `<a href="${h}">${t}</a>`).join("")}<a href="#enquire">Enquire</a></nav>
  <a class="btn solid" href="${WA_URL}">WhatsApp the concierge</a></div>`;
}
const footer = `<footer class="site lab"><div class="in"><span>Aliyah Prestige · Marrakech</span><a href="${WA_URL}">WhatsApp ${WA}</a><span>Names stay private</span></div></footer>`;

function cta(img, h, p, label = "WhatsApp the concierge") {
  return `<section class="stage short" id="enquire"><img src="${im(img)}" alt="" data-par>${rails}<div class="in">
  <div class="copy"><p class="lab">24/7 · Within the hour</p><h2 class="H" data-masked-reveal>${h}</h2><p data-reveal>${p}</p><a class="btn solid" href="${WA_URL}" data-reveal style="--d:.1s">${label}</a></div>
  <div class="side" data-reveal style="--d:.2s"><p class="lab">Concierge</p><p style="margin-top:10px;color:var(--bone)">${WA}<br>${EMAIL}</p></div></div></section>`;
}

function page(file, { title, desc, page, solid = false, body }) {
  const html = `<!doctype html>
<html lang="en" data-theme="atelier" data-tone="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&family=Playfair+Display:wght@400;500${page === "about" ? ";700" : ""}&display=swap" rel="stylesheet">
<link rel="stylesheet" href="motion.css">
<link rel="stylesheet" href="site.css">
<script src="vendor/gsap.min.js" defer></script>
<script src="vendor/ScrollTrigger.min.js" defer></script>
<script src="motion.js" defer></script>
<script src="site.js" defer></script>
</head>
<body data-page="${page}"${solid ? ' class="solid-head"' : ""}>
${header(page)}
<main id="main">
${body}
</main>
${footer}
</body>
</html>
`;
  writeFileSync(file, html);
}

// ---------- Home ----------
const SIGNATURE = [
  ["atlas", "Helicopter over the Atlas", "Lift off from Marrakech, land for lunch in a Berber valley, and be back before the evening call to prayer.", "Atlas"],
  ["desertcamp", "Dinner under the stars", "A table for two in the Agafay, lit by lanterns only. Your chef cooks over embers.", "Agafay"],
  ["tajines", "Exclusive souk access", "Workshops opened for you before the medina wakes: a lantern maker, a leather worker, a weaver.", "Medina"],
  ["tagine", "Cooking class", "A family kitchen and recipes kept for generations, then lunch at the table you cooked for.", "Medina"],
  ["riad", "The secret garden", "A private hour in a walled garden, closed to others.", "Medina"],
  ["car", "Private chauffeur", "The same driver for your whole stay, day and night.", "Everywhere"],
];
const SERVICES = [
  ["jet", "Arrivals &amp; Travel", "4 services", "Jets, helicopters, chauffeurs, meet and assist.", "wide", "service.html"],
  ["riad3", "Stays", "3 services", "Riads, palaces and desert camps.", "", "#enquire"],
  ["balloon", "Experiences", "3 services", "Desert, mountains, medina.", "", "#enquire"],
  ["tagine", "Gastronomy", "2 services", "Private chefs and tables.", "", "#enquire"],
  ["hammam", "Wellness", "2 services", "Hammam rituals at home.", "", "#enquire"],
  ["riad2", "Events &amp; Concierge", "2 services", "Weddings and celebrations by Aliyah Events.", "wide", "#events"],
];
// ---------- "Exclusively for you": three promises, five layout variants ----------
// Home uses EX_VARIANT; sections.html shows all five for comparison.
const EX_VARIANT = 5;
const EX_ICONS = {
  person: `<circle cx="24" cy="15" r="7"/><path d="M10 41c0-7.7 6.3-13 14-13s14 5.3 14 13"/><path d="M24 28l-2.5 4 2.5 6 2.5-6z"/>`,
  shield: `<path d="M24 5l15 5v11c0 10-6.5 17.5-15 22C15.5 38.5 9 31 9 21V10z"/><path d="M17 24l5 5 9-10"/>`,
  clock: `<path d="M40 24a16 16 0 1 1-4.7-11.3"/><path d="M40 7v6.5h-6.5"/><text x="23" y="28.5" text-anchor="middle" font-size="12" font-weight="500" font-family="Poppins, system-ui, sans-serif" fill="currentColor" stroke="none">24</text>`,
};
const exIcon = (k) => `<svg class="ex-ic" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${EX_ICONS[k]}</svg>`;
// [icon, title, short line, description, big figure, figure caption]
const EXCLUSIVE = [
  ["person", "Personalised service", "Tailored to you", "Every stay is planned around your wishes, by one concierge who learns your tastes.", "1", "concierge for your whole stay"],
  ["shield", "Discretion &amp; security", "Private at all times", "Your name, plans and guests stay private. Only vetted drivers, guides and venues.", "0", "names ever shared"],
  ["clock", "24/7 assistance", "Any hour, any day", "A real person answers within minutes, day or night, in your language.", "24/7", "a real person answers"],
];
// Copy as on the original site's section
const EX_ORIGINAL = [
  ["person", "Personalised<br>service", "Tailored to your individual needs and desires."],
  ["shield", "Discretion<br>&amp; security", "Ensuring your privacy and safety at all times."],
  ["clock", "24/7<br>assistance", "Available around the clock for your convenience."],
];
const EX_PICS = ["car", "riad", "villa-dusk"];
const exHead = (cls = "") => `<div class="sec-head ${cls}"><div><p class="lab">Exclusively for you</p><h2 class="H md" data-masked-reveal>Three promises, <em>kept</em>.</h2></div>
    <p class="muted">What every guest receives, whatever the size of the stay.</p></div>`;
function exclusive(v, id = "exclusive") {
  const at = id ? ` id="${id}"` : "";
  if (v === 1) return `<section class="sec ex ex-1"${at}>${rails}<div class="inner">
  ${exHead()}
  <div class="row3">${EXCLUSIVE.map(([ic, t, , d], i) => `<div class="step" data-reveal style="--d:${i * 0.08}s"><div class="ex-top"><span class="n">0${i + 1}</span>${exIcon(ic)}</div><h3>${t}</h3><p>${d}</p></div>`).join("")}</div>
</div></section>`;
  if (v === 2) return `<section class="stage ex ex-2"${at}><img src="${im("lanterns")}" alt="" loading="lazy" data-par>${rails}<div class="in">
  <div class="copy wide"><p class="lab">Exclusively for you</p><h2 class="H md" data-masked-reveal>Three promises, <em>kept</em>.</h2></div>
  <div class="ex-cards">${EXCLUSIVE.map(([ic, t, s2, d], i) => `<div class="ex-card" data-reveal style="--d:${i * 0.08}s">${exIcon(ic)}<p class="lab">0${i + 1} · ${s2}</p><h3>${t}</h3><p>${d}</p></div>`).join("")}</div>
</div></section>`;
  if (v === 3) return `<section class="sec ex ex-3"${at}>${rails}<div class="inner incl">
  <div><p class="lab">Exclusively for you</p><h2 class="H md" data-masked-reveal>Three promises, <em>kept</em>.</h2>
    <p class="muted" style="max-width:38ch;margin:20px 0 0">What every guest receives, whatever the size of the stay.</p>
    <ul class="ex-list">${EXCLUSIVE.map(([ic, t, , d], i) => `<li data-reveal style="--d:${i * 0.08}s">${exIcon(ic)}<div><h3>${t}</h3><p>${d}</p></div></li>`).join("")}</ul></div>
  <div class="pic" data-reveal><img src="${im("riad3")}" alt="Quiet riad courtyard with a fountain" loading="lazy"></div>
</div></section>`;
  if (v === 4) return `<section class="sec ex ex-4"${at}>${rails}<div class="inner">
  ${exHead()}
  <div class="ex-stats">${EXCLUSIVE.map(([ic, t, , d, fig, cap], i) => `<div data-reveal style="--d:${i * 0.08}s"><p class="lab">0${i + 1} · ${t}</p><p class="ex-v">${fig}</p><p class="ex-cap">${cap}</p><p class="muted">${d}</p></div>`).join("")}</div>
</div></section>`;
  if (v === 6) return `<section class="sec ex ex-6"${at}>${rails}<div class="inner">
  ${exHead()}
  <div class="grid ex-tiles">${EXCLUSIVE.map(([ic, t, s2, d], i) => `<div class="tile" data-reveal style="--d:${i * 0.08}s"><img src="${im(EX_PICS[i])}" alt="" loading="lazy"><span class="lab n">0${i + 1}</span><div class="t ex-glass">${exIcon(ic)}<p class="lab">${s2}</p><h3>${t}</h3><p>${d}</p></div></div>`).join("")}</div>
</div></section>`;
  if (v === 7) return `<section class="sec ex ex-7"${at}>${rails}<div class="inner">
  <p class="lab">Exclusively for you</p>
  <ol class="ex-rows">${EXCLUSIVE.map(([ic, t, , d], i) => `<li data-reveal style="--d:${i * 0.08}s"><span class="ex-no">0${i + 1}</span><h3 class="H md">${t}</h3><div>${exIcon(ic)}<p class="muted">${d}</p></div></li>`).join("")}</ol>
</div></section>`;
  if (v === 8) return `<section class="sec ex ex-8"${at}>${rails}<div class="inner">
  <p class="lab">Exclusively for you</p>
  <blockquote class="ex-quote" data-reveal>“We never say no, and we never say <em>who</em>.”</blockquote>
  <ul class="ex-inline">${EXCLUSIVE.map(([ic, t, s2], i) => `<li data-reveal style="--d:${0.1 + i * 0.08}s">${exIcon(ic)}<span><b>${t}</b>${s2}</span></li>`).join("")}</ul>
</div></section>`;
  if (v === 9) return `<section class="sec ex ex-9"${at}>${rails}<div class="inner">
  ${exHead()}
  <div class="pn ex-pn" data-panels>${EXCLUSIVE.map(([ic, t, s2, d], i) => `
    <article class="pnl${i === 0 ? " on" : ""}">
      <img src="${im(EX_PICS[i])}" alt="" loading="lazy">
      <button class="pnl-tab" type="button" aria-expanded="${i === 0}" aria-controls="exp-${v}-${i}"><i>0${i + 1}</i>${t}</button>
      <div class="pnl-d ex-glass" id="exp-${v}-${i}">${exIcon(ic)}<p class="lab">0${i + 1} · ${s2}</p><h3>${t}</h3><p>${d}</p></div>
    </article>`).join("")}
  </div>
</div></section>`;
  if (v === 10) return `<section class="sec ex ex-10"${at}>${rails}<div class="inner">
  <div class="ex-card-big" data-reveal>
    <p class="lab">Exclusively for you</p><h2 class="H md" data-masked-reveal>Three promises, <em>kept</em>.</h2>
    <div class="ex-cols">${EXCLUSIVE.map(([ic, t, , d]) => `<div>${exIcon(ic)}<h3>${t}</h3><p>${d}</p></div>`).join("")}</div>
    <p class="ex-sign"><span>Signed,</span> <em>Aliyah</em>, your concierge</p>
  </div>
</div></section>`;
  // 11-15: one promise in focus at a time, kept simple
  if (v === 11) return `<section class="sec ex ex-11"${at}>${rails}<div class="inner">
  ${exHead()}
  <div class="ex-tabs" data-ex-tabs>
    <div class="chips" role="tablist" aria-label="Promises">${EXCLUSIVE.map(([, t], i) => `<button class="chip" type="button" role="tab" id="ext-${v}-${i}" aria-controls="exq-${v}-${i}" aria-selected="${i === 0}" aria-pressed="${i === 0}">0${i + 1} ${t}</button>`).join("")}</div>
    ${EXCLUSIVE.map(([ic, t, s2, d], i) => `<div class="ex-pane" role="tabpanel" id="exq-${v}-${i}" aria-labelledby="ext-${v}-${i}"${i ? " hidden" : ""}>${exIcon(ic)}<p class="lab">${s2}</p><h3 class="H md">${t}</h3><p class="muted">${d}</p></div>`).join("")}
  </div>
</div></section>`;
  if (v === 12) return `<section class="sec ex ex-12"${at}>${rails}<div class="inner">
  <p class="lab ex-c">Exclusively for you</p>
  ${EXCLUSIVE.map(([ic, t, , d], i) => `<div class="ex-one" data-reveal>${exIcon(ic)}<p class="lab">0${i + 1} / 03</p><h3 class="H md">${t}</h3><p class="muted">${d}</p></div>`).join("")}
</div></section>`;
  if (v === 13) return `<section class="sec ex ex-13"${at}>${rails}<div class="inner">
  ${exHead()}
  ${EXCLUSIVE.map(([ic, t, s2, d], i) => `<div class="ex-zig${i % 2 ? " flip" : ""}" data-reveal><div class="pic"><img src="${im(EX_PICS[i])}" alt="" loading="lazy"></div><div>${exIcon(ic)}<p class="lab">0${i + 1} · ${s2}</p><h3 class="H md">${t}</h3><p class="muted">${d}</p></div></div>`).join("")}
</div></section>`;
  if (v === 14) return `<section class="sec ex ex-14"${at}>${rails}<div class="inner ex-sticky">
  <div class="ex-aside"><p class="lab">Exclusively for you</p><h2 class="H md" data-masked-reveal>Three promises, <em>kept</em>.</h2></div>
  <div>${EXCLUSIVE.map(([ic, t, s2, d], i) => `<div class="ex-block" data-reveal><span class="ex-no">0${i + 1}</span>${exIcon(ic)}<h3 class="H md">${t}</h3><p class="lab">${s2}</p><p class="muted">${d}</p></div>`).join("")}</div>
</div></section>`;
  if (v === 15) return `<section class="sec ex ex-15"${at}>${rails}<div class="inner">
  ${exHead()}
  <div class="ex-snap" tabindex="0" aria-label="Promises, scroll sideways">${EXCLUSIVE.map(([ic, t, s2, d], i) => `<div class="ex-slide">${exIcon(ic)}<p class="lab">0${i + 1} / 03 · ${s2}</p><h3 class="H md">${t}</h3><p class="muted">${d}</p></div>`).join("")}</div>
</div></section>`;
  // 16-20: close to the original section: centred title, three adjacent columns, original copy
  if (v >= 16 && v <= 20) {
    const cols = EX_ORIGINAL.map(([ic, t, d], i) => `<div data-reveal style="--d:${i * 0.08}s">${v === 20 ? `<span class="ex-dia">${exIcon(ic)}</span>` : exIcon(ic)}<h3>${t}</h3><p>${d}</p>${v === 20 ? `<p class="lab">0${i + 1}</p>` : ""}</div>`).join("");
    const bg = v === 18 ? `<img class="ex-bg" src="${im("riad2")}" alt="" loading="lazy">` : "";
    return `<section class="ex ex-orig ex-${v}${v === 18 ? "" : " sec"}"${at}>${bg}${rails}<div class="inner">
  <p class="lab">Aliyah Prestige</p><h2 class="ex-otitle">Exclusively for you</h2>
  <div class="ex-three">${cols}</div>
</div></section>`;
  }
  if (v === 5) return `<section class="ex ex-5"${at}>${rails}<div class="ex-5-in">
  <p class="lab">Exclusively for you</p><h2 class="H md" data-masked-reveal>Three promises, <em>kept</em>.</h2>
  <div class="ex-cols">${EXCLUSIVE.map(([ic, t, s2, d], i) => `<div data-reveal style="--d:${i * 0.08}s"><span class="ex-ring">${exIcon(ic)}</span><h3>${t}</h3><p>${d}</p></div>`).join("")}</div>
</div></section>`;
}

// ---------- Mini gallery (home): a 3-row mosaic that leads to gallery.html ----------
const MINI_GAL = [["riad", "Medina riad", "t"], ["desertcamp", "Agafay camp", "w"], ["atlas", "High Atlas", ""], ["tajines", "The souk", ""], ["rooftop", "Rooftop, medina", "w"], ["lanterns", "Lantern workshop", ""], ["hammam", "Private hammam", ""], ["bahia", "Bahia palace", ""]];
function miniGallery(total) {
  return `<section class="sec mg" id="gallery-preview"><div class="inner">
  <div class="sec-head"><div><p class="lab">Gallery</p><h2 class="H md" data-masked-reveal>Seen by our <em>guests</em>.</h2></div><a class="chip" href="gallery.html">Full gallery</a></div>
  <div class="gal mg-grid">${MINI_GAL.map(([k, t, sz], i) => `<a class="g ${sz}" href="gallery.html" data-reveal style="--d:${(i % 4) * 0.06}s"><img src="${im(k)}" alt="${t}" loading="lazy"><span class="cap">${t}</span></a>`).join("")}<a class="g mg-more" href="gallery.html" data-reveal style="--d:.18s"><span class="lab">${total} photos</span><span class="mg-go">View the full gallery <i aria-hidden="true">→</i></span></a></div>
</div></section>`;
}

const HOME = { title: "Aliyah Prestige | Private concierge in Marrakech", page: "home",
  desc: "Bespoke stays, journeys and evenings in Marrakech and across Morocco, arranged with absolute discretion.",
  body: `<section class="stage" id="stays"><img src="img/hero-jemaa.jpg" alt="Jemaa el-Fna square at dusk with market stalls lit below the Koutoubia minaret, Marrakech" style="object-position:40% 50%" data-par>${rails}<div class="in">
  <div class="copy"><p class="lab">Private concierge · Marrakech</p><h1 class="H" data-masked-reveal>A whole riad, opened for <em>you</em>.</h1>
    <p data-reveal>Bespoke stays, journeys and evenings in Marrakech and across Morocco, arranged with absolute discretion.</p>
    <a class="btn" href="#enquire" data-reveal style="--d:.1s">Plan a stay</a></div>
  <div class="side" data-reveal style="--d:.2s"><p class="lab">Since 1989</p><p class="v">Two generations</p><p>One family, welcoming guests at home in the medina.</p></div></div></section>

<section class="events" id="events" aria-labelledby="events-h">
  <!-- Photo: Unsplash (free licence), photo-1766393524464. Replace with the client's own event photography. -->
  <img src="${im("wedding-reception")}" alt="Wedding reception tables under palm trees at night" data-par>
  ${rails}
  <div class="ev-c">
    <span class="pill" data-reveal><b></b>New · Weddings &amp; celebrations</span>
    <h2 class="ev-name" id="events-h" data-masked-reveal>Aliyah <em>Events</em></h2>
    <p class="ev-lead" data-reveal>Weddings and private celebrations in Marrakech, planned from the first idea to the last guest home.</p>
    <ul class="ev-types" data-reveal style="--d:.1s"><li>Weddings</li><li>Henna nights</li><li>Anniversaries</li><li>Corporate events</li></ul>
    <a class="btn ev-btn" href="${WA_URL}?text=${encodeURIComponent("Hello, I would like to plan an event with Aliyah Events.")}" data-reveal style="--d:.2s">Plan your event</a>
  </div>
</section>

<section class="sec" id="signature">${rails}<div class="inner">
  <div class="sec-head"><div><p class="lab">Signature experiences</p><h2 class="H md" data-masked-reveal>Only with <em>Aliyah</em>.</h2></div>
    <p class="muted">Six moments we arrange for our guests, and nowhere else in quite the same way.</p></div>
  <div class="pn" data-panels>${SIGNATURE.map(([img, t, d, where], i) => `
    <article class="pnl${i === 0 ? " on" : ""}">
      <img src="${im(img)}" alt="" loading="lazy">
      <button class="pnl-tab" type="button" aria-expanded="${i === 0}" aria-controls="sig-${i}"><i>0${i + 1}</i>${t}</button>
      <div class="pnl-d" id="sig-${i}"><p class="lab">0${i + 1} · ${where}</p><h3>${t}</h3><p>${d}</p>
        <a class="btn" href="${WA_URL}?text=${encodeURIComponent("Hello, I would like to ask about: " + t)}">Ask about this</a></div>
    </article>`).join("")}
  </div>
</div></section>

<section class="sec" id="services">${rails}<div class="inner">
  <div class="sec-head"><div><p class="lab">Services</p><h2 class="H md" data-masked-reveal>Everything, <em>arranged</em>.</h2></div>
    <p class="muted">One concierge for the whole stay. A real person answers at any hour, in your language.</p></div>
  <div class="grid">${SERVICES.map(([img, h, n, p, cls, href], i) => `<a class="tile ${cls}" href="${href}" data-reveal style="--d:${(i % 3) * 0.06}s"><img src="${im(img)}" alt="" loading="lazy"><span class="lab n">0${i + 1}</span><div class="t"><p class="lab">${n}</p><h3>${h}</h3><p>${p}</p></div></a>`).join("")}</div>
</div></section>

${miniGallery(18)}

<section class="sec flush" id="journal-preview">${rails}<div class="inner">
  <div class="sec-head"><div><p class="lab">The journal</p><h2 class="H md" data-masked-reveal>Notes from <em>Morocco</em>.</h2></div><a class="chip" href="journal.html">All articles</a></div>
  <div class="posts">${POSTS.slice(0, 3).map(postCard).join("")}</div>
</div></section>
${exclusive(EX_VARIANT)}
${cta("riad3", "Tell us the <em>date</em>.", "A message on WhatsApp is enough: where from, when, how many. Two or three options follow within the hour.")}` };
page("index.html", HOME);



// ---------- Service: Private Jet Charter (simple version) ----------
page("service.html", { title: "Private Jet Charter | Aliyah Prestige", page: "service",
  desc: "Private jet charter to Marrakech: the right aircraft within the hour, fast arrival and a chauffeur at the door.",
  body: `<section class="stage short"><img src="${im("jet")}" alt="Private jet cabin" data-par>${rails}<div class="in"><div class="copy">
  <p class="crumb"><a href="index.html#services">Services</a> / <b>Private Jet Charter</b></p>
  <h1 class="H" data-masked-reveal>Private jet <em>charter</em>.</h1>
  <p data-reveal>Tell us where and when. We find the aircraft, handle every detail, and meet you at the door in Marrakech.</p>
  <a class="btn solid" href="${WA_URL}" data-reveal style="--d:.1s">Request a flight</a></div></div></section>

<section class="sec">${rails}<div class="inner incl">
  <div class="pic" data-reveal><img src="${im("jetseat")}" alt="Seat in a private jet cabin" loading="lazy"></div>
  <div><p class="lab">What's included</p><h2 class="H md" data-masked-reveal>Everything, from take-off to <em>riad</em>.</h2>
  <ul class="ticks">
    <li data-reveal><div>The right aircraft<span>Two or three options within the hour, with clear prices.</span></div></li>
    <li data-reveal style="--d:.06s"><div>Fast arrival<span>Private terminal. Formalities in minutes.</span></div></li>
    <li data-reveal style="--d:.12s"><div>A chauffeur at the door<span>Straight from the aircraft to your riad.</span></div></li>
    <li data-reveal style="--d:.18s"><div>The return flight too<span>Or we keep the aircraft in Marrakech for you.</span></div></li>
  </ul></div>
</div></section>

<section class="sec flush">${rails}<div class="inner">
  <div class="sec-head"><div><p class="lab">How it works</p><h2 class="H md" data-masked-reveal>Three <em>steps</em>.</h2></div><p class="muted">Paris 3 h 05 · London 3 h 35 · Geneva 2 h 55</p></div>
  <div class="row3">
    <div class="step" data-reveal><span class="n">01</span><h3>Send your dates</h3><p>Where from, when, how many. WhatsApp is enough.</p></div>
    <div class="step" data-reveal style="--d:.06s"><span class="n">02</span><h3>Choose the aircraft</h3><p>Clear options and prices, within the hour.</p></div>
    <div class="step" data-reveal style="--d:.12s"><span class="n">03</span><h3>Fly</h3><p>We handle the rest, until you land and after.</p></div>
  </div>
</div></section>
${cta("riad3", "Where are you flying <em>from</em>?", "Send one message. Options and prices follow within the hour.")}` });

// ---------- Gallery ----------
const GAL = [
  ["riad", "Medina riad", "stays", "t", "A private riad in the medina, staffed and opened for one family."],
  ["desertcamp", "Agafay camp", "desert", "w", "Tented suites in the stone desert, forty minutes from the medina."],
  ["atlas", "High Atlas", "atlas", "", "The Atlas from the air, on the way to lunch in a Berber valley."],
  ["tajines", "The souk", "medina", "", "Workshops opened early for our guests, before the medina wakes."],
  ["rooftop", "Rooftop, medina", "medina", "w", "A private terrace for mint tea at the end of the day."],
  ["balloon", "Palm grove at sunrise", "desert", "t", "Hot-air balloon over the palm grove, breakfast where you land."],
  ["hammam", "Private hammam", "stays", "", "Traditional hammam ritual, made entirely private."],
  ["jet", "The cabin", "arrivals", "", "Private jet charter from any airport, met at the aircraft door."],
  ["benhaddou", "Aït Benhaddou", "atlas", "w", "The ksar on the road south, visited privately with a guide."],
  ["lanterns", "Lantern workshop", "medina", "", "A lantern maker's workshop, behind the stall."],
  ["riad3", "Pool, riad", "stays", "", "Whole houses with staff, chosen for you."],
  ["camels", "Agafay", "desert", "t", "Camel ride across the Agafay at golden hour."],
  ["essaouira", "Essaouira", "atlas", "w", "The Atlantic coast, by road or by air."],
  ["tagine", "Private chef", "table", "", "A chef at your riad, from breakfast to dinner."],
  ["bahia", "Bahia palace", "medina", "", "The palace after hours, with a historian."],
  ["imlil", "Imlil valley", "atlas", "w", "A Berber village at the foot of Toubkal."],
  ["car", "Your chauffeur", "arrivals", "", "One driver for your whole stay, day and night."],
  ["ouzoud", "Ouzoud falls", "atlas", "w", "A day trip to the falls, privately guided."],
];
const CATS = [["all", "All"], ["stays", "Stays"], ["desert", "Desert"], ["atlas", "Atlas"], ["medina", "Medina"], ["table", "At the table"], ["arrivals", "Arrivals"]];
page("gallery.html", { title: "Gallery | Aliyah Prestige", page: "gallery", solid: true,
  desc: "Riads, desert camps, valleys and tables we arrange for our guests in Marrakech and across Morocco.",
  body: `<section class="sec" style="padding-top:clamp(20px,2.4vw,32px)">${rails}<div class="inner">
  <div class="sec-head"><div><p class="lab">Gallery</p><h1 class="H md" data-masked-reveal>Places we <em>open</em> for you.</h1></div>
    <p class="muted">Riads, desert camps, valleys and tables from recent stays. Every photo is a place we can arrange.</p></div>
  <div class="chips" data-filters=".g" role="group" aria-label="Filter photos" style="margin-bottom:12px">${CATS.map(([k, t], i) => `<button class="chip" type="button" data-filter="${k}" aria-pressed="${i === 0}">${t}</button>`).join("")}</div>
  <p class="lab" data-filter-count aria-live="polite" style="margin:0 0 20px">${GAL.length} items</p>
  <div class="gal">${GAL.map(([k, t, c, s, d], i) => `<figure class="g ${s}" data-cat="${c}" data-title="${t}" data-text="${d}" style="margin:0"><img src="${im(k)}" alt="${t}" loading="lazy"><button type="button" aria-label="Open photo: ${t}"></button><span class="n">${String(i + 1).padStart(2, "0")}</span><figcaption class="cap">${t}</figcaption></figure>`).join("")}</div>
</div></section>
<dialog class="lb" id="lightbox" aria-label="Photo viewer">
  <div class="bar"><span class="lab" data-lb-pos></span><button type="button" class="lab" data-lb-close>Close ✕</button></div>
  <div class="view"><button type="button" class="chip nav-btn" data-lb-prev aria-label="Previous photo">←</button><img alt=""><button type="button" class="chip nav-btn" data-lb-next aria-label="Next photo">→</button></div>
  <div class="foot"><p class="muted" data-lb-text></p><a class="btn solid flat" href="${WA_URL}" data-lb-cta>Arrange this</a></div>
</dialog>
${cta("riad3", "Want to be <em>here</em>?", "Send us a photo from the gallery. We will build a stay around it.")}` });

// ---------- Journal ----------
const ALL_POSTS = [...POSTS, { title: "A day in Essaouira, by road or by air", cat: "Places", date: "30 May 2026", read: "6 min", img: "essaouira", excerpt: "The Atlantic in two hours by car, or forty minutes by helicopter." }];
function postCard(p) {
  return `<a class="post" href="post.html" data-cat="${p.cat.toLowerCase()}" data-reveal><div class="img"><img src="${im(p.img)}" alt="" loading="lazy"></div><div class="meta"><b>${p.cat}</b><span>${p.read}</span><span>${p.date}</span></div><h3>${p.title}</h3><p>${p.excerpt}</p></a>`;
}
const [feat, ...rest] = ALL_POSTS;
const JCATS = ["All", ...new Set(rest.map((p) => p.cat))];
page("journal.html", { title: "Journal | Aliyah Prestige", page: "journal",
  desc: "Guides, places and tables in Marrakech and Morocco, from the Aliyah Prestige concierge.",
  body: `<section class="stage feat"><img src="${im(feat.img)}" alt="Riad courtyard at dusk" data-par>${rails}
  <div class="in">
  <div class="copy"><p class="lab">The journal · Latest</p><h1 class="H" style="font-size:clamp(40px,5.4vw,88px)" data-masked-reveal>A first evening in the <em>medina</em>.</h1><p>${feat.excerpt}</p><a class="btn" href="post.html">Read the article</a></div>
  <div class="side"><div class="meta"><b>${feat.cat}</b><span>${feat.read}</span></div><p style="margin-top:12px">${feat.date}</p></div></div></section>
<section class="sec">${rails}<div class="inner">
  <div class="sec-head"><div><p class="lab">All articles</p><h2 class="H md" data-masked-reveal>Notes from <em>Morocco</em>.</h2></div>
    <div class="chips" data-filters=".post" role="group" aria-label="Filter articles">${JCATS.map((c, i) => `<button class="chip" type="button" data-filter="${i === 0 ? "all" : c.toLowerCase()}" aria-pressed="${i === 0}">${c}</button>`).join("")}</div></div>
  <div class="posts">${rest.map(postCard).join("")}</div>
</div></section>
<section class="sec flush">${rails}<div class="inner"><div class="news">
  <div><p class="lab">The letter</p><h2 class="H plain" style="font-size:clamp(32px,3.6vw,52px)">One letter a <em>season</em>.</h2><p class="muted" style="margin:14px 0 0">New places, quiet dates and openings, four times a year. Nothing else.</p></div>
  <div><form data-newsletter><label class="lab" for="nl" style="position:absolute;left:-9999px">Email</label><input id="nl" type="email" required placeholder="Your email" autocomplete="email"><button type="submit">Subscribe</button></form><p class="ok" hidden aria-live="polite"></p></div>
</div></div></section>
${cta("riad3", "Read it, then <em>live</em> it.", "Every article is a stay we can arrange. Tell us which one.")}` });

// ---------- Article ----------
const slug = (s) => s.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "");
const h2s = ARTICLE.filter(([t]) => t === "h2").map(([, v]) => v);
const body = ARTICLE.map(([t, v], i) => t === "p" ? `<p class="${i === 0 ? "lead" : ""}">${v}</p>`
  : t === "h2" ? `<h2 id="${slug(v)}">${v}</h2>`
  : t === "quote" ? `<blockquote>${v}</blockquote>`
  : `<figure><img src="${im(v)}" alt="Pottery in the souk" loading="lazy"><figcaption>Workshops in the souk open early for our guests.</figcaption></figure>`).join("\n");
page("post.html", { title: "A first evening in the medina | Aliyah Prestige", page: "journal",
  desc: POSTS[0].excerpt,
  body: `<section class="stage short"><img src="${im("riad2")}" alt="Riad courtyard" data-par>${rails}<div class="in"><div class="copy wide">
  <p class="crumb"><a href="journal.html">Journal</a> / <b>Guides</b></p>
  <h1 class="H" style="font-size:clamp(40px,5.6vw,92px)" data-masked-reveal>A first evening in the <em>medina</em>.</h1>
  <div class="meta" style="margin-top:24px"><b>Guides</b><span>6 min read</span><span>12 Sep 2026</span></div></div></div></section>
<section class="sec"><div class="inner art">
  <aside><div class="box"><p class="lab">In this article</p><nav class="toc" style="margin-top:10px">${h2s.map((h) => `<a href="#${slug(h)}">${h}</a>`).join("")}</nav></div></aside>
  <article class="body">${body}</article>
  <aside><div class="box"><p class="lab">Arrange this evening</p><p class="muted" style="margin:10px 0 16px;font-size:15px">Rooftop tea, a historian guide, dinner in a courtyard.</p><a class="btn solid flat" style="width:100%;justify-content:center" href="${WA_URL}">Ask the concierge</a></div></aside>
</div></section>
<section class="sec flush">${rails}<div class="inner"><div class="sec-head"><h2 class="H md">Keep <em>reading</em>.</h2><a class="chip" href="journal.html">All articles</a></div>
  <div class="posts">${POSTS.slice(1, 4).map(postCard).join("")}</div></div></section>
${cta("riad3", "An evening like <em>this</em>?", "Tell us the date. We arrange the guide, the rooftop and the table.")}` });

// ---------- Social proof: three templates (preview only, not on the home page yet) ----------
// PLACEHOLDER copy: replace with real guest reviews, used with the guests' permission, before publishing.
const REVIEWS = [
  ["The concierge thought of things we had not. Every day felt arranged around us, and no one else.", "Guest from London", "Family stay, 7 nights"],
  ["Our wedding weekend ran without a single question from us. Discreet, warm, and always one step ahead.", "Guest from Paris", "Wedding, 120 guests"],
  ["We messaged at two in the morning about a flight change. Ten minutes later it was solved.", "Guest from Dubai", "Private jet and riad"],
];
const STATS = [["Since 1989", "one family, two generations"], ["24/7", "a real person answers"], ["5/5", "placeholder rating"]];
const stars = `<span class="sp-stars" role="img" aria-label="5 out of 5">★★★★★</span>`;
function socialProof(v) {
  if (v === 1) return `<section class="sec sp sp-1"><div class="inner">
  <p class="lab">What guests say</p>
  ${stars}
  <blockquote class="sp-quote" data-reveal>“${REVIEWS[0][0]}”</blockquote>
  <p class="sp-who">${REVIEWS[0][1]} <span>· ${REVIEWS[0][2]}</span></p>
  <ul class="sp-stats">${STATS.map(([fig, cap]) => `<li><b>${fig}</b><span>${cap}</span></li>`).join("")}</ul>
</div></section>`;
  if (v === 2) return `<section class="sec sp sp-2"><div class="inner">
  <div class="sec-head"><div><p class="lab">What guests say</p><h2 class="H md" data-masked-reveal>In their <em>words</em>.</h2></div>
    <p class="muted">Every review comes from a guest we hosted. Names stay private.</p></div>
  <div class="sp-cards">${REVIEWS.map(([q, who, trip], i) => `<figure data-reveal style="--d:${i * 0.08}s">${stars}<blockquote>“${q}”</blockquote><figcaption><b>${who}</b>${trip}</figcaption></figure>`).join("")}</div>
</div></section>`;
  const line = REVIEWS.map(([q, who]) => `<span>“${q}” <b>${who}</b></span>`).join("");
  return `<section class="sec sp sp-3"><div class="inner">
  <p class="lab sp-c">Trusted by guests from many countries</p>
  <ul class="sp-press">${Array(5).fill("Press logo").map((t) => `<li>${t}</li>`).join("")}</ul>
</div>
<div class="sp-marquee" aria-label="Guest reviews"><div class="sp-track">${line}${line.replace(/<span>/g, '<span aria-hidden="true">')}</div></div>
</section>`;
}

// Five-star mark for testimonials, drawn in SVG.
const STARS = `<span class="stars" role="img" aria-label="Rated 5 out of 5">${'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5l2.6 5.5 6 .8-4.4 4.1 1.1 5.9L10 15l-5.3 2.8 1.1-5.9L1.4 7.8l6-.8z"/></svg>'.repeat(5)}</span>`;

// ---------- About: copy from aliyahprestige.com/about-us, laid out in the Riad Grid style ----------
const TESTIMONIALS = [
  ["Thank you for this wonderful discovery of Morocco. We have gained a new respect for the country and its people. You have always been generous and professional.", "Rosa Luisa DeLauro", "Member of Congress, United States House of Representatives"],
  ["Morocco remains an unforgettable memory. It was a wonderful trip, largely thanks to the generosity with which you helped us discover your country. Your wit and erudition made this trip unforgettable for all of us.", "Michael Whiteman", "Chairman, Baum and Whiteman"],
  ["Our cup is overflowing with joy. Our hearts and souls have allowed us to enjoy the richest and most memorable vacation of our lives. We can't wait to return to Morocco one day.", "Rozanne Gold", "Chef and journalist, four-time James Beard Award winner"],
];
// Moments listed under "Photos" on the current site. Archive photos can be added later.
const ARCHIVE = [
  ["1986", "Founded", "A private concierge service, born from a family tradition."],
  ["1989", "Koutoubia Gardens tour", "Marrakech"],
  ["1998", "Menara Gardens tour", "Marrakech"],
  ["2002", "Bahia Palace private tour", "Marrakech"],
  ["2023", "US First Lady Jill Biden visits Madrasa Ben Youssef", "Marrakech"],
];
// Archive photos and guest portraits, taken from the About page of aliyahprestige.com.
const AB_ARCH_PICS = { 1989: "arch-koutoubia", 1998: "arch-menara", 2002: "arch-bahia", 2023: "arch-biden" };
const AB_ARCH_ALT = {
  1989: "Guests walking through the Koutoubia Gardens, 1989",
  1998: "Guests at the Menara Gardens, 1998",
  2002: "A private tour in a courtyard of the Bahia Palace, 2002",
  2023: "US First Lady Jill Biden with her hosts at Madrasa Ben Youssef, 2023",
};
const AB_T_PICS = ["t-delauro", "t-whiteman", "t-gold"];
const AB_STORY = [
  "Founded in 1986, our exclusive private concierge service is born from a family tradition of excellence.",
  "For generations, we have opened the doors to Marrakech's hidden treasures, offering unparalleled expertise and personalisation.",
  "Today, we continue to honour our heritage, crafting extraordinary experiences marked by sophistication and elegance.",
];
const AB_VALUES = ["Authenticity", "Exclusivity", "Expertise", "Personalisation"];
const AB_ART = "Guided by excellence, we work hand in hand with Marrakech's most esteemed artisans to unveil the city's rarest and most refined treasures.";
// Hero hang: archive year and its slot on the wall.
const AW_HANG = [["1989", "a"], ["1998", "b"], ["2002", "c"], ["2023", "d"]];
// Archive Wall layout, kept as an alternate; about.html now uses layout 2 (Chapters).
page("about-wall.html", { title: "About us | Aliyah Prestige", page: "about", solid: true,
  desc: "Founded in 1986, a private concierge service in Marrakech born from a family tradition of excellence.",
  body: `<section class="aw-hero"><div class="aw-in">
  <div class="aw-copy">
    <div><h1 class="aw-h">A bespoke experience in <em>Marrakech</em>.</h1>
      <p class="aw-lede">A refined concierge service, opening the doors to Marrakech's hidden treasures since 1986.</p>
      <a class="btn solid" href="${WA_URL}">WhatsApp the concierge</a></div>
    <p class="aw-since"><span>1986</span>A private concierge service, born from a family tradition.</p>
  </div>
  <div class="aw-wall">${AW_HANG.map(([y, cls], i) => `<figure class="aw-ph ${cls}" style="--i:${i}"><div class="aw-f"><img src="${im(AB_ARCH_PICS[y])}" alt="${AB_ARCH_ALT[y]}"></div><figcaption><em>${y}</em>${ARCHIVE.find((a) => a[0] === y)[1]}</figcaption></figure>`).join("")}
    <figure class="aw-note" style="--i:4"><blockquote>“${TESTIMONIALS[0][0].split(". ").pop()}”</blockquote><figcaption>${TESTIMONIALS[0][1]}</figcaption></figure>
  </div>
</div></section>

<section class="aw-sec aw-story"><div class="aw-in">
  <h2 class="aw-h2">Born from a family <em>tradition</em>.</h2>
  <div class="aw-prose">${AB_STORY.map((p) => `<p>${p}</p>`).join("")}</div>
</div>
<figure class="aw-wide"><img src="${im("riad")}" alt="Garden inside a medina riad, seen from the gallery above" loading="lazy"></figure></section>

<section class="aw-sec aw-philo"><div class="aw-in">
  <blockquote class="aw-quote">True luxury is found in <em>authenticity</em> and <em>exclusivity</em>, crafting unforgettable moments for the most discerning travellers.</blockquote>
  <p class="aw-values">${AB_VALUES.map((v) => `<span>${v}</span>`).join("")}</p>
</div></section>

<section class="aw-art"><figure class="aw-art-ph"><img src="${im("lanterns")}" alt="Lanterns in a metalworker's workshop in the medina" loading="lazy"></figure>
  <div class="aw-art-copy"><h2 class="aw-h2">Hand in hand with <em>artisans</em>.</h2>
    <p>${AB_ART}</p>
    <a class="btn" href="index.html#services">Our services</a></div></section>

<section class="aw-sec aw-words"><div class="aw-in">
  <h2 class="aw-h2">In their <em>words</em>.</h2>
  <div class="aw-tl">${TESTIMONIALS.map(([q, who, role], i) => `<figure><figcaption><img src="${im(AB_T_PICS[i])}" alt="" width="72" height="72" loading="lazy"><span><b>${who}</b>${role}</span></figcaption><blockquote>“${q}”</blockquote></figure>`).join("")}</div>
</div></section>
<section class="aw-close" id="enquire"><div class="aw-close-copy">
  <h2 class="aw-h2">Begin your <em>story</em>.</h2>
  <p>Tell us where you are coming from and when. A concierge replies within the hour, day or night.</p>
  <a class="btn solid" href="${WA_URL}">WhatsApp the concierge</a>
  <p class="aw-contact"><span>Concierge</span>${WA}<br>${EMAIL}</p></div>
  <figure class="aw-close-ph"><img src="${im("villa-dusk")}" alt="A private villa in Marrakech at dusk" loading="lazy"></figure></section>` });

// ---------- About: five layout proposals (about-1.html ... about-5.html) ----------
// Same copy as about.html, five compositions. Only the two site fonts are used. A fixed bar switches between them.
const AB_PHILO = `True luxury is found in <em>authenticity</em> and <em>exclusivity</em>, crafting unforgettable moments for the most discerning travellers.`;
const abBody = (list = AB_STORY) => `<div class="av-body">${list.map((p) => `<p>${p}</p>`).join("")}</div>`;
const abImg = (k, alt = "", par = false) => `<img src="${im(k)}" alt="${alt}" loading="lazy"${par ? " data-par" : ""}>`;
const abSwitch = (n) => `<nav class="av-switch" aria-label="About page layouts"><span>About layout</span>${[1, 2, 3, 4, 5].map((i) => `<a href="about-${i}.html"${i === n ? ' aria-current="page"' : ""}>${i}</a>`).join("")}<a href="about.html">Current</a></nav><div class="av-space" aria-hidden="true"></div>`;
// Testimonials as tabs: one quote at a time, guest names as the tab labels.
function abTabs(id, cls = "") {
  return `<div class="av-tabs ${cls}" data-qtabs>
    <div class="av-tabs-panels">${TESTIMONIALS.map(([q, who, role], i) => `<figure role="tabpanel" id="${id}-q${i}" aria-labelledby="${id}-t${i}"${i ? " hidden" : ""}><blockquote>“${q}”</blockquote><figcaption><b>${who}</b><span>${role}</span></figcaption></figure>`).join("")}</div>
    <div class="av-tabs-list" role="tablist" aria-label="Testimonials">${TESTIMONIALS.map(([, who], i) => `<button type="button" role="tab" id="${id}-t${i}" aria-controls="${id}-q${i}" aria-selected="${i === 0}" tabindex="${i ? -1 : 0}">${who}</button>`).join("")}</div>
  </div>`;
}
function abCta(cls) {
  return `<section class="sec ${cls}" id="enquire"><div class="inner">
  <h2 class="H md" data-masked-reveal>Begin your <em>story</em>.</h2>
  <div class="av-cta-r" data-reveal><p class="muted">Tell us where you are coming from and when. A concierge replies within the hour.</p>
    <a class="btn solid" href="${WA_URL}">Enquire now</a><p class="av-contact">${WA}<br>${EMAIL}</p></div>
</div></section>`;
}
const AB_PAGE = { title: "About us | Aliyah Prestige", page: "about",
  desc: "Founded in 1986, a private concierge service in Marrakech born from a family tradition of excellence." };

// 1. Monograph: editorial book layout, drop cap, full-bleed band, overlapping artisan card.
page("about-1.html", { ...AB_PAGE, solid: true, body: `<section class="sec v1-hero"><div class="inner">
  <div class="v1-hero-t"><p class="lab">About us</p><h1 class="H" data-masked-reveal>A bespoke experience in <em>Marrakech</em>.</h1>
    <p class="av-lead" data-reveal>A refined concierge service, opening the doors to Marrakech's hidden treasures since 1986.</p></div>
  <figure class="v1-hero-pic" data-reveal style="--d:.15s"><div class="pic">${abImg("riad2", "Riad courtyard in Marrakech", true)}</div><figcaption>A family tradition since 1986</figcaption></figure>
</div></section>

<section class="sec"><div class="inner v1-story">
  <h2 class="H md" data-masked-reveal>Born from a family <em>tradition</em>.</h2>
  <div data-reveal>${abBody()}</div>
</div></section>

<div class="v1-band">${abImg("rooftop", "Marrakech rooftops at dusk", true)}</div>

<section class="sec"><div class="inner">
  <blockquote class="av-quote v1-quote" data-reveal>${AB_PHILO}</blockquote>
  <ul class="v1-values">${AB_VALUES.map((v, i) => `<li data-reveal style="--d:${i * 0.08}s">${v}</li>`).join("")}</ul>
</div></section>

<section class="sec"><div class="inner v1-art">
  <div class="pic" data-reveal>${abImg("lanterns", "A lantern maker's workshop in the medina", true)}</div>
  <div class="v1-card" data-reveal style="--d:.15s"><h2 class="H md">Hand in hand with <em>artisans</em>.</h2>${abBody([AB_ART])}<a class="btn" href="index.html#services">Our services</a></div>
</div></section>

<section class="sec v1-voices"><div class="inner">${abTabs("v1")}</div></section>

<section class="sec flush"><div class="inner">
  <h2 class="H md" data-masked-reveal>Four decades in <em>Marrakech</em>.</h2>
  <ol class="v1-time">${ARCHIVE.map(([y, t, d], i) => `<li data-reveal style="--d:${i * 0.05}s"><span class="av-y">${y}</span><h3>${t}</h3><p>${d}</p></li>`).join("")}</ol>
</div></section>
${abCta("av-cta")}
${abSwitch(1)}` });

// 2. Chapters: full-bleed photo hero, sticky chapter index beside scrolling chapters, quotes over a photo.
const ABOUT_2 = `<section class="stage v2-hero">${abImg("riad2", "Riad courtyard in Marrakech", true)}<div class="in">
  <div class="copy wide"><h1 class="H" data-masked-reveal>A bespoke experience in <em>Marrakech</em>.</h1>
    <p data-reveal>A refined concierge service, opening the doors to Marrakech's hidden treasures.</p></div>
  <p class="v2-meta" data-reveal style="--d:.2s">Since <em>1986</em></p></div></section>

<section class="sec"><div class="inner v2-chap">
  <nav class="v2-nav" aria-label="Chapters" data-chapters><h2 class="H md" data-masked-reveal>Our <em>story</em>.</h2>
    <ol>${["The family", "The philosophy", "The artisans", "The archive"].map((t, i) => `<li><a href="#ch${i + 1}">${t}</a></li>`).join("")}</ol></nav>
  <div>
    <article class="v2-ch" id="ch1"><h2>Born from a family tradition.</h2>${abBody()}<div class="pic" data-reveal>${abImg("riad", "Garden inside a medina riad", true)}</div></article>
    <article class="v2-ch" id="ch2"><blockquote class="av-quote" data-reveal>${AB_PHILO}</blockquote><ul class="v2-values">${AB_VALUES.map((v) => `<li>${v}</li>`).join("")}</ul></article>
    <article class="v2-ch" id="ch3"><h2>Hand in hand with artisans.</h2>${abBody([AB_ART])}<div class="pic" data-reveal>${abImg("lanterns", "A lantern maker's workshop in the medina", true)}</div><a class="btn" href="index.html#services">Our services</a></article>
    <article class="v2-ch" id="ch4"><h2>Four decades in Marrakech.</h2>
      <p class="v2-founded" data-reveal><span>1986</span>${ARCHIVE[0][2]}</p>
      <div class="v2-arch">${ARCHIVE.slice(1).map(([y, t, d], i) => `<figure data-reveal style="--d:${(i % 2) * 0.1}s"><div class="pic">${abImg(AB_ARCH_PICS[y], `${t}, ${d}, ${y}`)}</div><figcaption><span class="av-y">${y}</span><b>${t}</b>${d}</figcaption></figure>`).join("")}</div></article>
  </div>
</div></section>

<section class="sec v2-voices av-dark"><div class="inner">
  <h2 class="H md" data-masked-reveal>In their <em>words</em>.</h2>
  <div class="v2-quotes">${TESTIMONIALS.map(([q, who, role], i) => `<figure data-reveal><div class="who"><img src="${im(AB_T_PICS[i])}" alt="${who}" loading="lazy"><figcaption><b>${who}</b>${role}</figcaption></div><div class="q">${STARS}<blockquote>“${q}”</blockquote></div></figure>`).join("")}</div>
</div></section>
${cta("riad3", "Begin your <em>story</em>.", "Tell us where you are coming from and when. A concierge replies within the hour.", "Enquire now")}
`;
page("about-2.html", { ...AB_PAGE, body: ABOUT_2 + abSwitch(2) });
// The default About page uses layout 2.
page("about.html", { ...AB_PAGE, body: ABOUT_2 });

// 3. Exhibition: museum-style matted frames, a hung picture wall, values as a 2 x 2 plaque.
page("about-3.html", { ...AB_PAGE, solid: true, body: `<section class="sec v3-hero"><div class="inner">
  <h1 class="H" data-masked-reveal>A bespoke experience in <em>Marrakech</em>.</h1>
  <p class="av-lead" data-reveal>A refined concierge service, opening the doors to Marrakech's hidden treasures since 1986.</p>
  <div class="v3-mat v3-hero-pic" data-reveal style="--d:.15s"><div class="pic">${abImg("villa-dusk", "A private villa in Marrakech at dusk", true)}</div></div>
</div></section>

<section class="sec"><div class="inner v3-story">
  <h2 class="H md" data-masked-reveal>Born from a family <em>tradition</em>.</h2>
  <div class="v3-cols" data-reveal>${abBody()}</div>
</div></section>

<section class="sec flush"><div class="inner v3-wall">
  ${[["riad", "Garden inside a medina riad"], ["tajines", "Tagines in a medina workshop"], ["medina-arch", "An arch in the old medina"]].map(([k, a], i) => `<figure data-reveal style="--d:${i * 0.1}s"><div class="v3-mat"><div class="pic">${abImg(k, a)}</div></div><figcaption>${a}</figcaption></figure>`).join("")}
</div></section>

<section class="sec v3-philo"><div class="inner">
  <blockquote class="av-quote" data-reveal>${AB_PHILO}</blockquote>
  <ul class="v3-vals">${AB_VALUES.map((v, i) => `<li data-reveal style="--d:${i * 0.08}s">${v}</li>`).join("")}</ul>
</div></section>

<section class="sec"><div class="inner incl">
  <div><h2 class="H md" data-masked-reveal>Hand in hand with <em>artisans</em>.</h2><div data-reveal>${abBody([AB_ART])}</div><a class="btn" href="index.html#services">Our services</a></div>
  <div class="v3-mat" data-reveal><div class="pic">${abImg("lanterns", "A lantern maker's workshop in the medina")}</div></div>
</div></section>

<section class="sec"><div class="inner v3-voices">${TESTIMONIALS.map(([q, who, role], i) => `<figure data-reveal style="--d:${i * 0.08}s"><blockquote>“${q}”</blockquote><figcaption><b>${who}</b><span>${role}</span></figcaption></figure>`).join("")}</div></section>

<section class="sec flush"><div class="inner">
  <h2 class="H md" data-masked-reveal>Four decades in <em>Marrakech</em>.</h2>
  <ol class="v3-time">${ARCHIVE.map(([y, t, d]) => `<li><span class="av-y">${y}</span><h3>${t}</h3><p>${d}</p></li>`).join("")}</ol>
</div></section>

<section class="sec" id="enquire"><div class="inner"><div class="v3-cta" data-reveal>
  <h2 class="H md">Begin your <em>story</em>.</h2><p class="muted">Tell us where you are coming from and when. A concierge replies within the hour.</p>
  <a class="btn solid" href="${WA_URL}">Enquire now</a><p class="av-contact">${WA}<br>${EMAIL}</p></div></div></section>
${abSwitch(3)}` });

// 4. Heritage: the page told along the years, with a sticky year beside each era.
page("about-4.html", { ...AB_PAGE, solid: true, body: `<section class="v4-hero">
  <div class="v4-hero-t"><p class="v4-year" data-reveal>1986</p><h1 class="H md" data-masked-reveal>A bespoke experience in <em>Marrakech</em>.</h1>
    <p class="av-lead" data-reveal>A refined concierge service, opening the doors to Marrakech's hidden treasures.</p></div>
  <div class="v4-hero-pic">${abImg("riad2", "Riad courtyard in Marrakech", true)}</div>
</section>

<section class="sec v4-eras"><div class="inner">
  <div class="v4-era"><p class="v4-y">1986<span>Founded</span></p>
    <div class="v4-split"><div><h2 class="H md" data-masked-reveal>Born from a family <em>tradition</em>.</h2><div data-reveal>${abBody()}</div></div>
      <div class="pic" data-reveal>${abImg("riad", "Garden inside a medina riad")}</div></div></div>
  <div class="v4-era"><p class="v4-y">1989-2002<span>Private tours</span></p>
    <div class="v4-split"><ul class="v4-tours">${ARCHIVE.slice(1, 4).map(([y, t]) => `<li data-reveal><span>${t}</span><span>${y}</span></li>`).join("")}</ul>
      <figure class="pic" data-reveal>${abImg("bahia", "Bahia Palace, Marrakech")}</figure></div></div>
  <div class="v4-era"><p class="v4-y">2023<span>Madrasa Ben Youssef</span></p>
    <p class="v4-big" data-reveal>US First Lady Jill Biden visits Madrasa Ben Youssef, <em>Marrakech</em>.</p></div>
  <div class="v4-era"><p class="v4-y">Today<span>Our philosophy</span></p>
    <div><blockquote class="av-quote" data-reveal>${AB_PHILO}</blockquote><ul class="v2-values">${AB_VALUES.map((v) => `<li>${v}</li>`).join("")}</ul>
      <div class="v4-split v4-art"><div class="pic" data-reveal>${abImg("lanterns", "A lantern maker's workshop in the medina")}</div>
        <div><h2 class="H md" data-masked-reveal>Hand in hand with <em>artisans</em>.</h2><div data-reveal>${abBody([AB_ART])}</div><a class="btn" href="index.html#services">Our services</a></div></div></div></div>
</div></section>

<section class="sec v4-voices"><div class="inner"><h2 class="H md" data-masked-reveal>In their <em>words</em>.</h2>${abTabs("v4", "v4-tabs")}</div></section>

<section class="v4-cta av-dark" id="enquire">${abImg("rooftop", "", true)}<div class="inner" data-reveal>
  <h2 class="H md">Begin your <em>story</em>.</h2><p>Tell us where you are coming from and when. A concierge replies within the hour.</p>
  <a class="btn solid" href="${WA_URL}">Enquire now</a></div></section>
${abSwitch(4)}` });

// 5. Mosaic: split hero with layered photos, then a seven-cell bento and a side-scrolling archive.
page("about-5.html", { ...AB_PAGE, solid: true, body: `<section class="sec v5-hero"><div class="inner">
  <div><h1 class="H" data-masked-reveal>A bespoke experience in <em>Marrakech</em>.</h1>
    <p class="av-lead" data-reveal>A refined concierge service, opening the doors to Marrakech's hidden treasures since 1986.</p></div>
  <div class="v5-stack" data-reveal style="--d:.15s"><div class="a">${abImg("riad2", "Riad courtyard in Marrakech", true)}</div><div class="b">${abImg("riad3", "Quiet riad courtyard with a fountain")}</div></div>
</div></section>

<section class="sec flush"><div class="inner v5-bento">
  <div class="c story" data-reveal><h2 class="H md">Born from a family <em>tradition</em>.</h2>${abBody()}</div>
  <div class="c pic" data-reveal style="--d:.08s">${abImg("riad", "Garden inside a medina riad")}</div>
  <div class="c quote" data-reveal><blockquote class="av-quote">${AB_PHILO}</blockquote></div>
  <div class="c vals" data-reveal style="--d:.08s"><ul>${AB_VALUES.map((v) => `<li>${v}</li>`).join("")}</ul></div>
  <div class="c art av-dark" data-reveal>${abImg("lanterns", "A lantern maker's workshop in the medina")}<div class="t"><h2>Hand in hand with artisans.</h2><p>${AB_ART}</p><a class="btn" href="index.html#services">Our services</a></div></div>
  <div class="c year" data-reveal style="--d:.08s"><p class="v5-num">1986</p><p>A family tradition of expertise and personalisation, passed down through generations.</p></div>
  <div class="c voice" data-reveal>${abTabs("v5", "v4-tabs")}</div>
</div></section>

<section class="sec"><div class="inner">
  <h2 class="H md" data-masked-reveal>Four decades in <em>Marrakech</em>.</h2>
  <ol class="v5-time">${ARCHIVE.map(([y, t, d]) => `<li><span class="av-y">${y}</span><h3>${t}</h3><p>${d}</p></li>`).join("")}</ol>
</div></section>

<section class="sec flush" id="enquire"><div class="inner v5-cta">
  <div class="t" data-reveal><h2 class="H md">Begin your <em>story</em>.</h2><p class="muted">Tell us where you are coming from and when. A concierge replies within the hour.</p>
    <a class="btn solid" href="${WA_URL}">Enquire now</a><p class="av-contact">${WA}<br>${EMAIL}</p></div>
  <div class="pic" data-reveal style="--d:.1s">${abImg("villa-dusk", "A private villa in Marrakech at dusk", true)}</div>
</div></section>
${abSwitch(5)}` });

// ---------- Section preview: the five "Exclusively for you" variants ----------
const EX_NAMES = ["Framed row", "Photo stage with glass cards", "Split with photo", "Big figures", "Accent band",
  "Photo tiles", "Editorial rows", "Quote with promises", "Expanding photo panels", "Signed promise card",
  "Tabs, one at a time", "One per row, centred", "Zig-zag with photos", "Sticky heading, scrolling promises", "Side-scrolling cards",
  "Original: plain", "Original: framed cells", "Original: photo with glass", "Original: zellige pattern", "Original: diamond icons"];
page("sections.html", { title: "Section variants | Aliyah Prestige", page: "", solid: true,
  desc: "Design variants of the Exclusively for you section.",
  body: EX_NAMES.map((n, i) => `<div class="ex-tag"><span class="lab">Variant ${i + 1}</span><span>${n}</span></div>\n${exclusive(i + 1, "")}`).join("\n") +
    ["Featured quote", "Review cards", "Press row and moving reviews"].map((n, i) => `\n<div class="ex-tag"><span class="lab">Social proof ${i + 1}</span><span>${n}</span></div>\n${socialProof(i + 1)}`).join("") });

console.log("built: index, service, gallery, journal, post, about (layout 2), about-wall, about-1..5, sections");
