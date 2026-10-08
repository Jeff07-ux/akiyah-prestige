// Shared content for every design in the collection. Sample copy: figures, flight times,
// aircraft specs, phone numbers and addresses are placeholders to be confirmed by the client.

export const IMG = {
  riad: "riad", riad2: "riad2", riad3: "riad3", desertcamp: "desertcamp", atlas: "atlas", atlas2: "atlas2",
  jet: "jet", jetseat: "jetseat", agafay: "agafay", camels: "camels", balloon: "balloon", tagine: "tagine",
  tajines: "tajines", hammam: "hammam", car: "car",
};
export const ALT = {
  riad: "palm courtyard", riad2: "riad courtyard", riad3: "riad pool", desertcamp: "desert camp at night",
  atlas: "High Atlas", atlas2: "Atlas village", jet: "private jet cabin", jetseat: "jet seat", agafay: "Agafay desert",
  camels: "Agafay camels", balloon: "balloon flight", tagine: "tagine", tajines: "souk pottery", hammam: "hammam", car: "chauffeur car",
};

export const CATEGORIES = [
  { name: "Arrivals & Travel", img: "jet", line: "Jets, helicopters, chauffeurs, meet and assist.",
    services: [
      ["Private Jet Charter", "Light jets to long-range cabins, from any airport."],
      ["Helicopter Transfers", "Marrakech to the Atlas, Essaouira or the desert."],
      ["Chauffeur & Fleet", "One driver for your stay, day and night."],
      ["VIP Meet & Assist", "Met at the aircraft door, through formalities in minutes."],
    ] },
  { name: "Stays", img: "riad3", line: "Private riads, palaces and desert camps.",
    services: [
      ["Private Villas & Riads", "Whole houses with staff, chosen for you."],
      ["Palace Hotels", "Suites at the city's grand addresses, with our welcome."],
      ["Luxury Desert Camps", "Tented camps in the Agafay and the Sahara."],
    ] },
  { name: "Experiences", img: "balloon", line: "Desert, mountains, medina, after hours.",
    services: [
      ["Desert & Atlas Excursions", "Days and nights beyond the city, privately guided."],
      ["Hot-Air Balloon Flights", "Sunrise over the palm grove, breakfast on landing."],
      ["Private Medina Tours", "The old city with a historian, at your pace."],
    ] },
  { name: "Gastronomy", img: "tagine", line: "Private chefs, tables and tastings.",
    services: [
      ["Private Chefs", "A chef at your riad, from breakfast to dinner."],
      ["Restaurant Reservations", "The right table, even when the city is full."],
    ] },
  { name: "Wellness", img: "hammam", line: "Hammam rituals and therapists at home.",
    services: [
      ["Hammam & Spa Rituals", "Traditional hammam, privately booked or brought to you."],
      ["Yoga & Fitness Coaching", "Sessions at sunrise, on your terrace."],
    ] },
  { name: "Events & Concierge", img: "riad", line: "Celebrations, security, everything else.",
    services: [
      ["Weddings & Celebrations", "From an intimate dinner to a three-day wedding."],
      ["Close Protection", "Discreet security, arranged with your own team."],
    ] },
];

export const SIGNATURE = [
  { name: "Helicopter over the Atlas", img: "atlas", line: "Lift off from Marrakech, land for lunch in a Berber valley." },
  { name: "Dinner under the stars", img: "desertcamp", line: "A table for two in the Agafay, lit by lanterns only." },
  { name: "Exclusive souk access", img: "tajines", line: "Workshops opened for you before the medina wakes." },
  { name: "Cooking class", img: "tagine", line: "A family kitchen and recipes kept for generations." },
  { name: "The secret garden", img: "riad", line: "A private hour in a walled garden, closed to others." },
  { name: "Private chauffeur", img: "car", line: "The same driver for your whole stay, day and night." },
];

export const PILLARS = [
  { name: "Personalized service", icon: "hand-heart", line: "One concierge knows you, your preferences and your people." },
  { name: "Discretion & security", icon: "shield-check", line: "Names stay private. Close protection when it is needed." },
  { name: "24/7 assistance", icon: "phone-call", line: "A real person answers, at any hour, in your language." },
];

export const QUOTES = [
  { text: "They opened Marrakech to us the way a friend would, and never once mentioned who we were.", by: "A film director, Los Angeles", note: "Name withheld at the client's request" },
];

export const TIMELINE = [
  { year: "1989", img: "riad2", line: "The first riad guests, welcomed at home." },
  { year: "1996", img: "tajines", line: "A network of artisans in the souk." },
  { year: "2004", img: "car", line: "Our own chauffeured fleet." },
  { year: "2011", img: "desertcamp", line: "Desert camps in the Agafay." },
  { year: "2017", img: "jet", line: "Private aviation desk opens." },
  { year: "2023", img: "riad", line: "A second generation joins the house." },
];

export const POSTS = [
  { title: "A first evening in the medina", cat: "Guides", date: "12 Sep 2026", read: "6 min", img: "riad2", excerpt: "Where to begin, when to arrive, and why the best rooftops are not on any map." },
  { title: "Flying privately into Marrakech: what to expect", cat: "Travel", date: "28 Aug 2026", read: "5 min", img: "jet", excerpt: "From the private terminal to your riad door in under forty minutes." },
  { title: "The Agafay after rain", cat: "Places", date: "9 Aug 2026", read: "4 min", img: "agafay", excerpt: "The stone desert turns green for a few days a year. We know when." },
  { title: "Four tables we book again and again", cat: "Gastronomy", date: "21 Jul 2026", read: "7 min", img: "tagine", excerpt: "Not the most famous restaurants in the city. The ones our guests return to." },
  { title: "Hammam etiquette, gently explained", cat: "Wellness", date: "2 Jul 2026", read: "5 min", img: "hammam", excerpt: "What to bring, what to expect, and how to make it entirely private." },
  { title: "Planning a wedding in a riad", cat: "Events", date: "14 Jun 2026", read: "8 min", img: "riad3", excerpt: "Guest lists, permits, music and the right courtyard, a year ahead." },
];

export const ROUTES = [
  ["Paris Le Bourget", "3 h 05"], ["London Farnborough", "3 h 35"], ["Geneva", "2 h 55"],
  ["Milan Linate", "3 h 00"], ["Dubai", "7 h 40"], ["New York Teterboro", "7 h 15"],
];

export const AIRCRAFT = [
  { name: "Light jet", seats: "4 to 7 seats", note: "Europe in one hop. Ideal for couples and small families.", img: "jetseat" },
  { name: "Midsize jet", seats: "8 to 9 seats", note: "Stand-up cabin, longer range, more luggage.", img: "jet" },
  { name: "Long-range jet", seats: "12 to 14 seats", note: "Non-stop from the Gulf and North America.", img: "jet" },
  { name: "Private airliner", seats: "16 seats and more", note: "Bedrooms, dining room, a full crew.", img: "jetseat" },
];

export const STEPS = [
  ["Tell us the date", "A message on WhatsApp is enough: where from, when, how many."],
  ["We propose aircraft", "Two or three options within the hour, with clear prices."],
  ["You confirm", "We handle slots, customs, catering and the car."],
  ["We meet you planeside", "Your concierge and chauffeur wait at the aircraft door."],
];

export const FAQ = [
  ["How far in advance should I book?", "A few days is ideal. Departures within 24 hours are often possible."],
  ["Can you arrange the return flight too?", "Yes, and we can hold the aircraft in Marrakech if you prefer."],
  ["Do you handle customs and immigration?", "Formalities are completed at the private terminal, usually in minutes."],
  ["Can pets travel with us?", "On most aircraft, yes. We arrange the veterinary paperwork."],
];

export const ARTICLE = [
  ["p", "Most visitors meet the medina at its busiest hour, in the heat of the afternoon, with a phone in one hand and a map that no longer makes sense. We suggest the opposite: arrive as the light softens, an hour before the call to prayer, with someone who knows which door to push."],
  ["h2", "Begin above the city"],
  ["p", "The best introduction to the old city is from a rooftop. From above, the maze becomes a pattern: minarets, palm tops, the Atlas on a clear day. Our guests usually start on a private terrace with mint tea, while their guide explains the neighbourhoods they will walk through."],
  ["quote", "The medina rewards patience. Walk slowly, and the city starts to open its doors."],
  ["h2", "Walk with a purpose"],
  ["p", "Rather than covering everything, choose one quarter and one craft. A morning with a leather worker, an evening with a lantern maker. The souk changes completely when an artisan invites you into the workshop behind the stall."],
  ["img", "tajines"],
  ["h2", "End the evening somewhere quiet"],
  ["p", "Dinner is best in a courtyard, away from the square. We reserve tables in a handful of riads where the cooking is careful and the guests are few. Your chauffeur waits at the nearest gate, and the walk back is lit by our team."],
];
