// The hero of the service pages, chosen from the proposals in service-designs.mjs (design 9): an inset photograph
// with a frosted title card, in the site's own palette and fonts. The body below it is the journal-style long-form layout
// written in build.mjs. Styles: the "Service page hero" section of site.css.

export function serviceHeroTemplate(h) {
  const { esc: e, attr, im, ask, WA_URL, PROMISE } = h;
  const acts = (sv) => `<div class="cta-acts"><a class="btn solid" href="${ask(sv)}">WhatsApp the concierge</a><a class="btn" href="${WA_URL}" data-planner data-interest-pre="${attr(sv.plan || "")}">Plan your stay</a></div>`;
  return (sv) => `<div class="fx-theme"><div class="fx fx-brand sv">
<section class="sv-hero"><img src="${im(sv.img)}" alt="${attr(`${sv.name} in Marrakech`)}" sizes="100vw"><div class="sv-title">
  <p class="crumb"><a href="index.html#services">Services</a> / <b>${e(sv.name)}</b></p><h1 class="H">${sv.title}</h1><p class="lead">${e(sv.lead)}</p>${acts(sv)}${PROMISE}</div></section>
</div></div>`;
}
