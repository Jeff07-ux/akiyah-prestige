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
const NAV = [["Stays", "index.html#stays", "home"], ["Events", "index.html#events", "events"], ["Services", "index.html#services", "service"], ["Gallery", "gallery.html", "gallery"], ["Journal", "journal.html", "journal"]];

function header(page) {
  const links = NAV.map(([t, h, k]) => `<a href="${h}"${k === page ? ' aria-current="page"' : ""}>${t}</a>`).join("");
  return `<a class="skip" href="#main">Skip to content</a>
<header class="site"><div class="in"><a class="logo" href="index.html">Aliyah Prestige</a>
  <nav aria-label="Main">${links}<a href="#enquire">Enquire</a></nav>
  <div class="tools"><button class="theme-btn" type="button" data-theme-toggle aria-label="Change colour theme"><i aria-hidden="true"></i><span>Theme</span></button>
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
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
<link rel="stylesheet" href="motion.css">
<link rel="stylesheet" href="site.css">
<script>try{var t=localStorage.getItem("theme"),r=document.documentElement,L=["tadelakt","rose","majorelle","mint","saffron","atlas","dune","zellige","blossom","cedar","linen","lavender","riviera","peach","matcha","blush","butter","clay","glacier","apricot"];if(t==="forest"||t==="navy"||L.indexOf(t)>-1)r.dataset.theme=t;if(L.indexOf(t)>-1)r.dataset.tone="light"}catch(e){}</script>
<script src="vendor/gsap.min.js" defer></script>
<script src="vendor/ScrollTrigger.min.js" defer></script>
<script src="motion.js" defer></script>
<script src="site.js" defer></script>
</head>
<body${solid ? ' class="solid-head"' : ""}>
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
  clock: `<path d="M40 24a16 16 0 1 1-4.7-11.3"/><path d="M40 7v6.5h-6.5"/><text x="23" y="28.5" text-anchor="middle" font-size="12" font-weight="500" font-family="Instrument Sans, system-ui, sans-serif" fill="currentColor" stroke="none">24</text>`,
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

page("index.html", { title: "Aliyah Prestige | Private concierge in Marrakech", page: "home",
  desc: "Bespoke stays, journeys and evenings in Marrakech and across Morocco, arranged with absolute discretion.",
  body: `<section class="stage" id="stays"><img src="${im("medina-arch")}" alt="Medina lane in Marrakech leading to an arch and the Koutoubia minaret" style="object-position:66% 50%" data-par>${rails}<div class="in">
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

<section class="sec flush">${rails}<div class="inner">
  <div class="sec-head"><div><p class="lab">The journal</p><h2 class="H md" data-masked-reveal>Notes from <em>Morocco</em>.</h2></div><a class="chip" href="journal.html">All articles</a></div>
  <div class="posts">${POSTS.slice(0, 3).map(postCard).join("")}</div>
</div></section>
${exclusive(EX_VARIANT)}
${cta("rooftop", "Tell us the <em>date</em>.", "A message on WhatsApp is enough: where from, when, how many. Two or three options follow within the hour.")}` });

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
${cta("rooftop", "Where are you flying <em>from</em>?", "Send one message. Options and prices follow within the hour.")}` });

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
  body: `<section class="sec" style="padding-top:clamp(56px,7vw,96px)">${rails}<div class="inner">
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
${cta("desertcamp", "Want to be <em>here</em>?", "Send us a photo from the gallery. We will build a stay around it.")}` });

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
  <div><p class="lab">The letter</p><h2 class="H" style="font-size:clamp(32px,3.6vw,52px)">One letter a <em>season</em>.</h2><p class="muted" style="margin:14px 0 0">New places, quiet dates and openings, four times a year. Nothing else.</p></div>
  <div><form data-newsletter><label class="lab" for="nl" style="position:absolute;left:-9999px">Email</label><input id="nl" type="email" required placeholder="Your email" autocomplete="email"><button type="submit">Subscribe</button></form><p class="ok" hidden aria-live="polite"></p></div>
</div></div></section>
${cta("desertcamp", "Read it, then <em>live</em> it.", "Every article is a stay we can arrange. Tell us which one.")}` });

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
${cta("rooftop", "An evening like <em>this</em>?", "Tell us the date. We arrange the guide, the rooftop and the table.")}` });

// ---------- Section preview: the five "Exclusively for you" variants ----------
const EX_NAMES = ["Framed row", "Photo stage with glass cards", "Split with photo", "Big figures", "Accent band",
  "Photo tiles", "Editorial rows", "Quote with promises", "Expanding photo panels", "Signed promise card",
  "Tabs, one at a time", "One per row, centred", "Zig-zag with photos", "Sticky heading, scrolling promises", "Side-scrolling cards",
  "Original: plain", "Original: framed cells", "Original: photo with glass", "Original: zellige pattern", "Original: diamond icons"];
page("sections.html", { title: "Section variants | Aliyah Prestige", page: "", solid: true,
  desc: "Design variants of the Exclusively for you section.",
  body: EX_NAMES.map((n, i) => `<div class="ex-tag"><span class="lab">Variant ${i + 1}</span><span>${n}</span></div>\n${exclusive(i + 1, "")}`).join("\n") });

console.log("built: index, service, gallery, journal, post, sections");
