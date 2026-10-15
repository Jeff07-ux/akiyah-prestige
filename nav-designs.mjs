// Ten navigation proposals, each shown on a small scrollable mock page (nav-designs.html). Preview only.
// build.mjs passes in its helpers; styles live in nav-designs.css and behaviour in nav-designs.js.

export function navDesigns({ KEY, im, WA_URL, esc }) {
  const key = KEY.replace('class="logo-key"', 'class="nd-key"');
  const LINKS = [["Gallery", "gallery.html"], ["Events", "index.html#events"], ["Services", "index.html#services"], ["Journal", "journal.html"], ["About", "about.html"]];
  const links = (active = "Services") => LINKS.map(([t, h]) => `<a href="#" data-nd-link${t === active ? ' aria-current="page"' : ""}>${t}</a>`).join("");
  const logo = `<a class="nd-logo" href="#" data-nd-link>${key}<span class="nd-name">Aliyah Prestige</span></a>`;
  const logoStack = `<a class="nd-logo nd-stack" href="#" data-nd-link>${key}<span class="nd-name">Aliyah <i>Prestige</i></span></a>`;
  const enquire = `<a class="nd-btn" href="#" data-nd-link>Enquire</a>`;

  // The mock page every design sits on: a photo hero, then a light, a dark and a light section.
  const page = (inner = "") => `<div class="nd-page">
  <section class="nd-hero"><img src="${im("bahia-court")}" alt="" loading="lazy">${inner}<div class="nd-copy"><p class="nd-k">Marrakech · Private concierge</p><h3>A bespoke experience in <em>Marrakech</em>.</h3><p class="nd-hint">Scroll inside this frame</p></div></section>
  <section class="nd-sec nd-light" data-tone="light"><p class="nd-k">Services</p><h4>One concierge, ten ways to arrive.</h4><div class="nd-tiles"><i></i><i></i><i></i></div></section>
  <section class="nd-sec nd-dark" data-tone="dark"><p class="nd-k">Signature experiences</p><h4>Only with Aliyah.</h4><div class="nd-lines"><i></i><i></i><i></i></div></section>
  <section class="nd-sec nd-light" data-tone="light"><p class="nd-k">Journal</p><h4>Notes from Morocco.</h4><div class="nd-tiles"><i></i><i></i><i></i></div></section>
</div>`;

  const D = [
    ["Transparent, then frosted", "No bar over the photo, just light text. Scroll and a slim frosted strip appears, with no notch.",
      page(), `<header class="nd-nav nd-1">${logo}<nav>${links()}</nav>${enquire}</header>`],
    ["Floating glass pill", "A narrow dark-glass pill, centred, with the page showing around it. Always the same shape.",
      page(), `<header class="nd-nav nd-2">${logo}<nav>${links()}</nav></header>`],
    ["Dark brown bar", "A slim brown bar with cream text and a champagne key. Warm and not white.",
      page(), `<header class="nd-nav nd-3">${logo}<nav>${links()}</nav>${enquire}</header>`],
    ["Logo and menu button", "Only the key, the name and a Menu button. The menu opens a full-screen overlay with large serif links.",
      page(), `<header class="nd-nav nd-4">${logo}<button class="nd-menu" type="button" data-nd-open>Menu</button></header>
<div class="nd-overlay" data-nd-overlay><button class="nd-menu nd-x" type="button" data-nd-close>Close</button><nav>${links()}</nav><a class="nd-btn" href="#" data-nd-link>Enquire on WhatsApp</a></div>`],
    ["Side rail", "A thin vertical bar on the left edge: key at the top, links turned sideways, WhatsApp at the bottom. The top of every photo stays clear.",
      page(), `<header class="nd-nav nd-5">${key}<nav>${links()}</nav><a class="nd-wa" href="#" data-nd-link aria-label="WhatsApp">WA</a></header>`],
    ["Hides on scroll down", "A dark-glass bar that slides away while you read and comes back when you scroll up.",
      page(), `<header class="nd-nav nd-6">${logo}<nav>${links()}</nav>${enquire}</header>`],
    ["Underline-only text", "No background. A centred key and light links on the photo, with a champagne line under the current page. It scrolls away with the hero.",
      page(`<header class="nd-nav nd-7">${logoStack}<nav>${links()}</nav></header>`), ""],
    ["Split floating capsules", "Three small pieces: the logo capsule, the links capsule and a solid brown Enquire capsule.",
      page(), `<header class="nd-nav nd-8"><span class="nd-cap">${logo}</span><span class="nd-cap"><nav>${links()}</nav></span>${enquire}</header>`],
    ["Bottom dock", "A slim dark-glass bar floats at the bottom centre like a dock. The top of the page stays clean.",
      page(), `<header class="nd-nav nd-9">${logo}<nav>${links()}</nav></header>`],
    ["Colour follows the section", "A slim bar that is clear over photos, cream over light sections and brown over dark ones.",
      page(), `<header class="nd-nav nd-10">${logo}<nav>${links()}</nav>${enquire}</header>`],
  ];

  return `<section class="nd-wrap"><h1 class="H">Navigation, ten designs.</h1>
  <p class="nd-lead">Each mock is a small page you can scroll. Hover and click inside it. Design 4 opens its menu, 6 hides on scroll, 10 changes colour by section.</p>
  ${D.map(([name, note, scroll, nav], i) => `<figure class="nd-fig">
    <figcaption><span class="nd-no">${String(i + 1).padStart(2, "0")}</span><div><h2>${esc(name)}</h2><p>${esc(note)}</p></div></figcaption>
    <div class="nd-win nd-w${i + 1}" data-nd-win><div class="nd-scroll" data-nd-scroll>${scroll}</div>${nav}</div>
  </figure>`).join("\n  ")}
</section>`;
}
