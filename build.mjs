// Builds the Aliyah Prestige "Riad Grid" site: home, service, gallery, journal, article.
// Shared copy lives in ./collection/content.mjs. Edit this file or site.css, then run: node build.mjs
// Phone, email, WhatsApp link, dates and figures are placeholders until the client confirms them.
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { POSTS, ARTICLE } from "./collection/content.mjs";
import { SERVICES } from "./collection/services.mjs";

const WA = "+212 6 00 00 00 00";
const WA_URL = "https://wa.me/212600000000";
const EMAIL = "concierge@aliyahprestige.ma";
const im = (k) => `img/${k}.jpg`;

// ---------- SEO ----------
// Production origin, no trailing slash. Build for deployment with: SITE_URL=https://your-domain node build.mjs
// Until the domain is confirmed this placeholder is used, and the build prints a warning: canonical URLs,
// og:url/og:image, the sitemap and robots.txt all depend on it, so never deploy a placeholder build.
const SITE_URL_PLACEHOLDER = "https://YOUR-DOMAIN.com";
const SITE_URL = (process.env.SITE_URL || SITE_URL_PLACEHOLDER).replace(/\/+$/, "");
// A placeholder build must never be indexed: its canonicals and sitemap point at a domain that does not exist.
// So without SITE_URL every page is noindex (the Vercel preview stays out of search); with it, INDEXABLE applies.
const PREVIEW = SITE_URL === SITE_URL_PLACEHOLDER;
const SITE_NAME = "Aliyah Prestige";
// Pages meant for search. Everything else (About layout variants, the section comparison page, 404) is noindex
// and stays out of the sitemap.
const INDEXABLE = ["index.html", ...SERVICES.map((sv) => `${sv.slug}.html`), "gallery.html", "journal.html", "post.html", "about.html"];
const urlFor = (file) => `${SITE_URL}/${file === "index.html" ? "" : file}`;
const attr = (s) => String(s).replace(/<[^>]+>/g, "").replace(/&(?!amp;|lt;|gt;|quot;|#)/g, "&amp;").replace(/"/g, "&quot;");
const isoDate = (d) => { const t = new Date(d + " UTC"); return isNaN(t) ? undefined : t.toISOString().slice(0, 10); };
const sha = (s) => createHash("sha256").update(s).digest();
// Cache-busting: local assets are linked as file?v=<content hash>, so vercel.json can cache them for a year
// and a changed file still reaches visitors at once.
const VER = {};
const asset = (p) => (VER[p] ??= `${p}?v=${existsSync(p) ? sha(readFileSync(p)).toString("hex").slice(0, 8) : "0"}`);
// Logo for structured data: the brand key from the header, rasterised to a square PNG by tools/optimize-images.mjs.
const LOGO = "img/logo-512.png";
const ORG = { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: `${SITE_URL}/`,
  description: "Private concierge in Marrakech: bespoke stays, journeys and evenings across Morocco.", areaServed: "Marrakech, Morocco",
  ...(existsSync(LOGO) && { logo: { "@type": "ImageObject", "@id": `${SITE_URL}/#logo`, url: `${SITE_URL}/${LOGO}`, width: 512, height: 512, caption: SITE_NAME } }) };
const WEBSITE = { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: `${SITE_URL}/`, publisher: { "@id": ORG["@id"] }, inLanguage: "en" };
// Every indexable page describes itself as a WebPage (or a subtype) inside the site, with a breadcrumb trail
// below the home page. `crumbs` lists the trail after Home, ending with the page itself: [[name, file], ...].
function pageSchema(file, { title, desc, pageType = "WebPage", crumbs, schema = [] }) {
  const id = `${urlFor(file)}#webpage`;
  const trail = crumbs && { "@type": "BreadcrumbList", "@id": `${urlFor(file)}#breadcrumb`,
    itemListElement: [["Home", "index.html"], ...crumbs].map(([name, f], i) => ({ "@type": "ListItem", position: i + 1, name, item: urlFor(f) })) };
  const webPage = { "@type": pageType, "@id": id, url: urlFor(file), name: attr(title), description: attr(desc), inLanguage: "en",
    isPartOf: { "@id": WEBSITE["@id"] }, ...((file === "index.html" || pageType === "AboutPage") && { about: { "@id": ORG["@id"] } }),
    ...(trail && { breadcrumb: { "@id": trail["@id"] } }) };
  return [ORG, WEBSITE, webPage, ...(trail ? [trail] : []), ...schema];
}
// Sitemap <lastmod>: a page's date moves only when its title, description or body actually change,
// tracked by content hash in collection/lastmod.json (commit it with the pages).
const LASTMOD_FILE = "collection/lastmod.json";
const LASTMOD = existsSync(LASTMOD_FILE) ? JSON.parse(readFileSync(LASTMOD_FILE, "utf8")) : {};
const TODAY = new Date().toISOString().slice(0, 10);
function touch(file, content) {
  const hash = sha(content).toString("hex").slice(0, 16);
  if (LASTMOD[file]?.hash !== hash) LASTMOD[file] = { hash, date: TODAY };
}
function seoHead(file, { title, desc, body, type = "website", schema }) {
  const index = INDEXABLE.includes(file) && !PREVIEW;
  const hero = (body.match(/<img [^>]*src="([^"]+)"/) || [])[1];
  const tags = [
    index ? `<link rel="canonical" href="${urlFor(file)}">` : `<meta name="robots" content="noindex, follow">`,
    `<meta property="og:type" content="${type}">`, `<meta property="og:site_name" content="${SITE_NAME}">`,
    `<meta property="og:title" content="${attr(title)}">`, `<meta property="og:description" content="${attr(desc)}">`,
    `<meta property="og:url" content="${urlFor(file)}">`, `<meta property="og:locale" content="en_GB">`,
    hero && `<meta property="og:image" content="${SITE_URL}/${hero}">`,
    `<meta name="twitter:card" content="${hero ? "summary_large_image" : "summary"}">`,
    `<link rel="icon" href="favicon.svg" type="image/svg+xml">`, `<meta name="theme-color" content="#FFFFFF">`,
    INDEXABLE.includes(file) && schema && `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": schema }).replace(/</g, "\\u003c")}</script>`,
  ];
  return tags.filter(Boolean).join("\n");
}
// The first image on a page is its hero, above the fold: load it eagerly and early for LCP.
const heroFirst = (body) => body.replace(/<img ([^>]*)>/, (m, a) => `<img ${a.replace(/\s*loading="lazy"/, "")} fetchpriority="high">`);
// The page's main heading and the paragraph right after it are its largest text and often its LCP element:
// they paint at once instead of waiting for motion.js to reveal them. Entrances further down are unchanged.
const heroVisible = (body) => body.replace(/<h1([^>]*?) data-masked-reveal/, "<h1$1").replace(/(<\/h1>\s*<p[^>]*?) data-reveal/, "$1");

// Responsive images. tools/optimize-images.mjs writes WebP variants and img/opt/manifest.json; each <img> whose src is
// listed gets the variants as srcset, a sizes hint, and its intrinsic width/height so the browser reserves the space.
// Images other than the hero load lazily. Lazy images use sizes="auto" (the browser measures the slot),
// with a fallback for browsers that do not support it yet; full-bleed photos get FULL_BLEED. An explicit sizes="" in the markup wins.
const IMGS = existsSync("img/opt/manifest.json") ? JSON.parse(readFileSync("img/opt/manifest.json", "utf8")) : {};
// Full-bleed photos (first child of a .stage or .events section) are cropped with object-fit: cover, so on a portrait
// screen they are drawn far wider than the viewport: ask for about twice the viewport width there.
const FULL_BLEED = "(max-aspect-ratio: 3/4) 200vw, 100vw";
const isFullBleed = (before) => /<section class="(?:stage|events)\b[^"]*"[^>]*>\s*(?:<!--(?:(?!-->)[\s\S])*-->\s*)?$/.test(before);
function responsive(body) {
  return body.replace(/<img ([^>]*)>/g, (m, a, at) => {
    const src = (a.match(/\bsrc="([^"]+)"/) || [])[1];
    if (!src) return m;
    if (!/\b(loading|fetchpriority)=/.test(a)) a += ` loading="lazy"`;
    const lazy = /\bloading="lazy"/.test(a);
    if (lazy) a += ` decoding="async"`;
    const v = IMGS[src];
    if (!v) return `<img ${a}>`;
    const file = (w) => asset(`${v.base}-${w}.webp`);
    const fallback = v.widths.filter((w) => w <= 1600).pop() || v.widths[0];
    a = a.replace(/\bsrc="[^"]+"/, `src="${file(fallback)}"`);
    const given = (a.match(/\bsizes="([^"]+)"/) || [])[1];
    a = a.replace(/\s*\bsizes="[^"]*"/, "");
    if (v.widths.length > 1) {
      const sizes = given || (isFullBleed(body.slice(Math.max(0, at - 300), at)) ? FULL_BLEED
        : lazy ? "auto, (max-width: 900px) 100vw, 50vw" : "100vw");
      a += ` srcset="${v.widths.map((w) => `${file(w)} ${w}w`).join(", ")}" sizes="${sizes}"`;
    }
    if (!/\bwidth=/.test(a)) a += ` width="${v.w}" height="${v.h}"`;
    return `<img ${a}>`;
  });
}
// Head script, also hashed into the Content-Security-Policy in vercel.json. Before first paint: hide entrance targets
// only when motion will run, and show everything if motion.js fails.
const HEAD_SCRIPT = `(function(d){var still=location.hash==="#static"||matchMedia("(prefers-reduced-motion: reduce)").matches;d.classList.add(still?"still":"js");
try{if(sessionStorage.getItem("keyDrawn"))d.classList.add("key-drawn");sessionStorage.setItem("keyDrawn","1")}catch(e){}
addEventListener("load",function(){if(!d.classList.contains("motion-ready"))d.classList.remove("js")})})(document.documentElement)`;
const FONT_PRELOAD = ["fonts/playfair-latin.woff2", "fonts/poppins-400-latin.woff2", "fonts/poppins-500-latin.woff2"]
  .map((f) => `<link rel="preload" href="${f}" as="font" type="font/woff2" crossorigin>`).join("");
const BUILT = [];
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
<header class="site"><div class="in"><span class="nav-shape" aria-hidden="true"></span><a class="logo" href="index.html" aria-label="Aliyah Prestige, home"><span class="logo-word">Aliyah</span>${KEY}<span class="logo-word">Prestige</span></a>
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

function page(file, { title, desc, page, solid = false, body, type, schema, pageType, crumbs }) {
  body = heroVisible(heroFirst(body));
  BUILT.push(file);
  if (INDEXABLE.includes(file)) schema = pageSchema(file, { title, desc, pageType, crumbs, schema });
  // og:image keeps the original JPEG (widest support among link-preview scrapers); the page itself gets WebP.
  const head = seoHead(file, { title, desc, body, type, schema });
  body = responsive(body);
  if (INDEXABLE.includes(file)) touch(file, title + desc + body);
  let html = `<!doctype html>
<html lang="en" data-theme="atelier" data-tone="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="${attr(desc)}">
${head}
${FONT_PRELOAD}
<script>${HEAD_SCRIPT}</script>
<link rel="stylesheet" href="${asset("motion.css")}">
<link rel="stylesheet" href="${asset("site.css")}">
<script src="${asset("vendor/gsap.min.js")}" defer></script>
<script src="${asset("vendor/ScrollTrigger.min.js")}" defer></script>
<script src="${asset("motion.js")}" defer></script>
<script src="${asset("site.js")}" defer></script>
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
  // The host serves 404.html at whatever path was missing (/a/b/c), so its links and assets must be root-absolute.
  if (file === "404.html") html = html.replace(/(\s(?:href|src)=")\.\//g, "$1/").replace(/(\s(?:href|src)=")(?![a-z]+:|#|\/)/g, "$1/");
  writeFileSync(file, html);
}

// ---------- Service pages: one per service, copy in ./collection/services.mjs ----------
// Long-form layout shared with the article: chapter index on the left, copy in the middle, an enquiry box on the right.
const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const svcFile = (sv) => `${sv.slug}.html`;
const svcAsk = (sv) => `${WA_URL}?text=${encodeURIComponent("Hello, I would like to ask about: " + sv.name)}`;
// "Label: detail" list items show the label in bold with the detail beneath; plain items stay one line.
function svcItem(t) {
  const m = t.match(/^([^:]{2,70}):\s+(.+)$/);
  return m ? `<li><div>${esc(m[1])}<span>${esc(m[2])}</span></div></li>` : `<li><div>${esc(t)}</div></li>`;
}
// Home tiles, one per service: the first and last span two columns so ten tiles close a four-column grid.
// Tiles crop their photo with object-fit: cover into a tall box, so they ask for about twice the tile width.
const svcTile = (sv, i, all) => `<a class="tile${i === 0 || i === all.length - 1 ? " wide" : ""}" href="${svcFile(sv)}" data-reveal style="--d:${(i % 4) * 0.06}s"><img src="${im(sv.img)}" alt="" loading="lazy" sizes="(max-width: 900px) 100vw, 50vw"><span class="lab n">${String(i + 1).padStart(2, "0")}</span><div class="t"><p class="lab">${esc(sv.kicker)}</p><h3>${esc(sv.card)}</h3><p>${esc(sv.line)}</p></div></a>`;

// ---------- Home ----------
const SIGNATURE = [
  ["atlas", "Helicopter over the Atlas", "Lift off from Marrakech, land for lunch in a Berber valley, and be back before the evening call to prayer.", "Atlas"],
  ["desertcamp", "Dinner under the stars", "A table for two in the Agafay, lit by lanterns only. Your chef cooks over embers.", "Agafay"],
  ["tajines", "Exclusive souk access", "Workshops opened for you before the medina wakes: a lantern maker, a leather worker, a weaver.", "Medina"],
  ["tagine", "Cooking class", "A family kitchen and recipes kept for generations, then lunch at the table you cooked for.", "Medina"],
  ["riad", "The secret garden", "A private hour in a walled garden, closed to others.", "Medina"],
  ["car", "Private chauffeur", "The same driver for your whole stay, day and night.", "Everywhere"],
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

// Photos cut from the gallery collages on aliyahprestige.com (guests' faces left out for discretion).
const AP = {
  "agafay-dinner": "A long dinner table laid in the Agafay desert at dusk", "riad-salon": "A riad salon framed by white drapes and blue columns",
  "candle-dinner": "A candlelit table with crystal glasses", "corridor": "A lantern-lit corridor in a palace riad", "majorelle": "A cobalt fountain in the Majorelle garden",
};
const apFig = (k, i) => `<figure class="isc-ph isc-${i + 1}" data-reveal style="--d:${(i * 0.09).toFixed(2)}s"><img src="img/ap/${k}.jpg" alt="${AP[k]}" loading="lazy"></figure>`;

const HOME = { title: "Aliyah Prestige | Private concierge in Marrakech", page: "home",
  desc: "Bespoke stays, journeys and evenings in Marrakech and across Morocco, arranged with absolute discretion.",
  body: `<section class="stage" id="stays"><img src="img/hero-jemaa.jpg" alt="Jemaa el-Fna square at dusk with market stalls lit below the Koutoubia minaret, Marrakech" style="object-position:40% 50%" data-par>${rails}<div class="in">
  <div class="copy"><p class="lab">Private concierge · Marrakech</p><h1 class="H" data-masked-reveal>A whole riad, opened for <em>you</em>.</h1>
    <p data-reveal>Bespoke stays, journeys and evenings in Marrakech and across Morocco, arranged with absolute discretion.</p>
    <a class="btn" href="#enquire" data-reveal style="--d:.1s">Plan a stay</a></div>
  <div class="side" data-reveal style="--d:.2s"><p class="lab">Since 1989</p><p class="v">Two generations</p><p>One family, welcoming guests at home in the medina.</p></div></div></section>


<div class="sec intro" id="welcome" role="region" aria-labelledby="intro-h"><div class="inner intro-split">
  <div class="intro-copy">
    <span class="intro-mark" data-reveal>${KEY.replace('class="logo-key"', 'class="intro-key"')}</span>
    <h2 class="intro-h" id="intro-h" data-reveal style="--d:.15s">A world of privilege, rooted in excellence</h2>
    <p class="intro-p" data-word-reveal>At Aliyah Prestige, we craft bespoke experiences of rare elegance in Marrakech and beyond. Since 1986, discerning visionaries, global tastemakers, and loyal connoisseurs have entrusted us with their most exclusive moments, delivered with absolute discretion and timeless sophistication.</p>
    <p class="intro-sig" data-reveal style="--d:.3s">Marrakech <i aria-hidden="true"></i> Since 1986</p>
  </div>
  <div class="intro-scatter">${Object.keys(AP).map(apFig).join("")}
    <a class="isc-go" href="gallery.html" data-reveal style="--d:.5s"><img src="img/ap/caravan.jpg" alt="" loading="lazy"><span class="isc-k">The gallery</span><b>See every place we open</b><i aria-hidden="true"></i></a>
  </div>
</div></div>
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
  <div class="grid">${SERVICES.map(svcTile).join("")}</div>
</div></section>


<section class="sec flush" id="journal-preview">${rails}<div class="inner">
  <div class="sec-head"><div><p class="lab">The journal</p><h2 class="H md" data-masked-reveal>Notes from <em>Morocco</em>.</h2></div><a class="chip" href="journal.html">All articles</a></div>
  <div class="posts">${POSTS.slice(0, 3).map(postCard).join("")}</div>
</div></section>
${exclusive(EX_VARIANT)}
${cta("riad3", "Tell us the <em>date</em>.", "A message on WhatsApp is enough: where from, when, how many. Two or three options follow within the hour.")}` };
page("index.html", HOME);



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
page("gallery.html", { title: "Gallery | Aliyah Prestige", page: "gallery", solid: true, pageType: "CollectionPage", crumbs: [["Gallery", "gallery.html"]],
  desc: "Riads, desert camps, valleys and tables we arrange for our guests in Marrakech and across Morocco.",
  body: `<section class="sec" style="padding-top:clamp(20px,2.4vw,32px)">${rails}<div class="inner">
  <div class="sec-head"><div><p class="lab">Gallery</p><h1 class="H md" data-masked-reveal>Places we <em>open</em> for you.</h1></div>
    <p class="muted">Riads, desert camps, valleys and tables from recent stays. Every photo is a place we can arrange.</p></div>
  <div class="chips" data-filters=".g" role="group" aria-label="Filter photos" style="margin-bottom:12px">${CATS.map(([k, t], i) => `<button class="chip" type="button" data-filter="${k}" aria-pressed="${i === 0}">${t}</button>`).join("")}</div>
  <p class="lab" data-filter-count aria-live="polite" style="margin:0 0 20px">${GAL.length} items</p>
  <div class="gal">${GAL.map(([k, t, c, s, d], i) => `<figure class="g ${s}" data-cat="${c}" data-title="${t}" data-text="${d}" style="margin:0"><img src="${im(k)}" alt="${t}" loading="lazy" sizes="${s ? "(max-width: 900px) 100vw, 50vw" : "(max-width: 900px) 50vw, 25vw"}"><button type="button" aria-label="Open photo: ${t}"></button><span class="n">${String(i + 1).padStart(2, "0")}</span><figcaption class="cap">${t}</figcaption></figure>`).join("")}</div>
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
page("journal.html", { title: "Journal | Aliyah Prestige", page: "journal", pageType: "CollectionPage", crumbs: [["Journal", "journal.html"]],
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
// dateModified equals datePublished until the copy is revised: then add modified: "<date>" to the post in collection/content.mjs.
page("post.html", { title: "A first evening in the medina | Aliyah Prestige", page: "journal", type: "article",
  crumbs: [["Journal", "journal.html"], [POSTS[0].title, "post.html"]],
  schema: [{ "@type": "Article", "@id": `${urlFor("post.html")}#article`, headline: POSTS[0].title, description: POSTS[0].excerpt,
    datePublished: isoDate(POSTS[0].date), dateModified: isoDate(POSTS[0].modified || POSTS[0].date),
    image: `${SITE_URL}/${im(POSTS[0].img)}`, mainEntityOfPage: { "@id": `${urlFor("post.html")}#webpage` },
    isPartOf: { "@id": `${urlFor("post.html")}#webpage` }, articleSection: POSTS[0].cat, inLanguage: "en",
    author: { "@id": ORG["@id"] }, publisher: { "@id": ORG["@id"] } }],
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

// ---------- Service pages (generated) ----------
function svcBody(sv) {
  let first = true, paras = 0;
  return sv.blocks.map(([t, v]) => {
    if (t === "h2") return `<h2 id="${slug(v)}">${esc(v)}</h2>`;
    if (t === "ul") return `<ul class="ticks">${v.map(svcItem).join("")}</ul>`;
    if (t === "quote") return `<blockquote>${esc(v)}</blockquote>`;
    const p = `<p class="${first ? "lead" : ""}">${esc(v)}</p>`;
    first = false;
    // The second photo sits after the opening two paragraphs.
    return ++paras === 2 ? p + `\n<figure><img src="${im(sv.pic)}" alt="${attr(sv.name)}, Aliyah Prestige, Marrakech" loading="lazy" sizes="(max-width: 900px) 100vw, 680px"></figure>` : p;
  }).join("\n");
}
SERVICES.forEach((sv, i) => {
  const file = svcFile(sv);
  const h2s = sv.blocks.filter(([t]) => t === "h2").map(([, v]) => v);
  const others = [1, 2, 3, 4].map((k) => SERVICES[(i + k) % SERVICES.length]);
  page(file, { title: `${sv.name} in Marrakech | Aliyah Prestige`, page: "service", desc: sv.desc, crumbs: [[sv.name, file]],
    schema: [{ "@type": "Service", "@id": `${urlFor(file)}#service`, name: sv.name, serviceType: sv.serviceType, description: sv.desc,
      url: urlFor(file), provider: { "@id": ORG["@id"] }, areaServed: "Marrakech, Morocco", mainEntityOfPage: { "@id": `${urlFor(file)}#webpage` } }],
    body: `<section class="stage short"><img src="${im(sv.img)}" alt="${attr(sv.name)} in Marrakech" data-par>${rails}<div class="in"><div class="copy wide">
  <p class="crumb"><a href="index.html#services">Services</a> / <b>${esc(sv.name)}</b></p>
  <h1 class="H" style="font-size:clamp(40px,5.2vw,84px)" data-masked-reveal>${sv.title}</h1>
  <p data-reveal>${esc(sv.lead)}</p>
  <a class="btn solid" href="${svcAsk(sv)}" data-reveal style="--d:.1s">Ask the concierge</a></div></div></section>
<section class="sec"><div class="inner art">
  <aside><div class="box"><p class="lab">On this page</p><nav class="toc" style="margin-top:10px">${h2s.map((h) => `<a href="#${slug(h)}">${esc(h)}</a>`).join("")}</nav></div></aside>
  <article class="body svc">${svcBody(sv)}</article>
  <aside><div class="box"><p class="lab">Arrange this</p><p class="muted" style="margin:10px 0 16px;font-size:15px">One message is enough. A concierge replies within the hour, day or night.</p><a class="btn solid flat" style="width:100%;justify-content:center" href="${svcAsk(sv)}">WhatsApp the concierge</a></div></aside>
</div></section>
<section class="sec flush">${rails}<div class="inner"><div class="sec-head"><div><p class="lab">More services</p><h2 class="H md">Also <em>arranged</em>.</h2></div><a class="chip" href="index.html#services">All services</a></div>
  <div class="grid svc-more">${others.map((o, k) => `<a class="tile" href="${svcFile(o)}" data-reveal style="--d:${k * 0.06}s"><img src="${im(o.img)}" alt="" loading="lazy" sizes="(max-width: 900px) 100vw, 50vw"><div class="t"><p class="lab">${esc(o.kicker)}</p><h3>${esc(o.card)}</h3></div></a>`).join("")}</div></div></section>
${cta("riad3", "Tell us the <em>date</em>.", "A message on WhatsApp is enough: where from, when, how many. Two or three options follow within the hour.")}` });
});

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
const AB_PAGE = { title: "About us | Aliyah Prestige", page: "about", pageType: "AboutPage", crumbs: [["About us", "about.html"]],
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
    <ol>${["The family", "The philosophy", "The partnerships", "The archive"].map((t, i) => `<li><a href="#ch${i + 1}">${t}</a></li>`).join("")}</ol></nav>
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

// ---------- 404 ----------
page("404.html", { title: "Page not found | Aliyah Prestige", page: "", solid: true,
  desc: "This page could not be found. Return to Aliyah Prestige, private concierge in Marrakech.",
  body: `<section class="sec"><div class="inner"><p class="lab">404</p><h1 class="H">This door is <em>closed</em>.</h1>
  <p class="muted">The page you asked for has moved or never existed. Everything else is still open.</p>
  <a class="btn solid" href="index.html">Return home</a></div></section>` });

// ---------- Crawl files and icon ----------
writeFileSync("robots.txt", `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`);
writeFileSync("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
` +
  INDEXABLE.filter((f) => BUILT.includes(f)).map((f) => `  <url><loc>${urlFor(f)}</loc><lastmod>${LASTMOD[f].date}</lastmod></url>`).join("\n") + "\n</urlset>\n");
writeFileSync(LASTMOD_FILE, JSON.stringify(LASTMOD, null, 1) + "\n");

// ---------- Hosting: Vercel (static files from the repository root, no build step on Vercel) ----------
// Home links use index.html so the site also works opened from disk; the canonical tag makes / the one indexed URL. Assets linked with ?v=<hash> (see asset()) and the fonts are
// cached for a year; photos for a week; HTML is always revalidated. The CSP allows only same-origin files, the hashed
// head script and inline style attributes (used for animation delays). Vercel adds HSTS itself.
const CSP = ["default-src 'self'", `script-src 'self' 'sha256-${sha(HEAD_SCRIPT).toString("base64")}'`, "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:", "font-src 'self'", "connect-src 'self'", "object-src 'none'", "base-uri 'self'", "form-action 'self'",
  "frame-ancestors 'self'", "upgrade-insecure-requests"].join("; ");
const cache = (source, value) => ({ source, headers: [{ key: "Cache-Control", value }] });
const YEAR = "public, max-age=31536000, immutable";
writeFileSync("vercel.json", JSON.stringify({
  redirects: [
    // The single sample service page became one page per service.
    { source: "/service.html", destination: "/private-jet-charter.html", permanent: true }],
  headers: [
    { source: "/(.*)", headers: [
      { key: "Content-Security-Policy", value: CSP },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
    ] },
    ...["/site.css", "/motion.css", "/site.js", "/motion.js", "/vendor/(.*)", "/fonts/(.*)", "/img/opt/(.*)"].map((s) => cache(s, YEAR)),
    cache("/img/:file", "public, max-age=604800, stale-while-revalidate=86400"), cache("/img/ap/:file", "public, max-age=604800, stale-while-revalidate=86400"),
  ],
}, null, 2) + "\n");
// Favicon: the brand key from the header, brown on white, square.
writeFileSync("favicon.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-24 0 96 96"><rect x="-24" width="96" height="96" rx="20" fill="#fff"/>${KEY.replace(/^<svg[^>]*>/, `<g fill="none" stroke="#6B4226" stroke-width="4.5" stroke-linejoin="round" stroke-linecap="round">`).replace("</svg>", "</g>").replace(/ pathLength="1"/g, "")}</svg>
`);

console.log(`built: index, ${SERVICES.length} service pages, gallery, journal, post, about (layout 2), about-wall, about-1..5, sections, 404, robots.txt, sitemap.xml, favicon.svg, vercel.json`);
if (!Object.keys(IMGS).length) console.warn("WARNING: img/opt/manifest.json is missing, so pages use the full-size JPEGs. Run: node tools/optimize-images.mjs");
if (PREVIEW) console.warn(`
WARNING: SITE_URL is not set, so this is a preview build: every page is noindex, and og:url, og:image, robots.txt and
sitemap.xml use the placeholder ${SITE_URL_PLACEHOLDER}. For the production build run: SITE_URL=https://your-domain node build.mjs
`);
