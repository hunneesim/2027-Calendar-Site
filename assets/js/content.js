/* Content shared by all the designs.
   ORDER_URL: paste the Google Form link here once it exists. Every "Order" button on every design uses it.
   PRICE, DELIVERY: shown wherever Designs 3 and 4 state the price and delivery.
   PAGES: the twelve photo pages in month order. To swap one, change its files and its text.
          tone is the photograph's main colour, used to tint the background behind it.
          place is left out of the "places" count when mixed is true. */
window.CAL = {
  ORDER_URL: "",
  PRICE: "RM 49",
  DELIVERY: "Free delivery within Malaysia. Outside Malaysia? Message me about postage.",
  SOON: "Orders open soon. I'll post on Instagram when they do.",
  PAGES: [
    { file: "assets/pages/p02.jpg", webp: "assets/pages/p02.webp", tone: "#479bbf", title: "Jade Dragon Snow Mountain", place: "Lijiang",
      alt: "Five frames of Jade Dragon Snow Mountain at sunrise, stacked so the ridge lines up, the snow turning from grey to gold" },
    { file: "assets/pages/p03.jpg", webp: "assets/pages/p03.webp", tone: "#582125", title: "Through the arch", place: "Lijiang",
      alt: "A lane in Lijiang Old Town hung with red lanterns, seen through a dark wooden arch, the sky lifted to white" },
    { file: "assets/pages/p12.jpg", webp: "assets/pages/p12.webp", tone: "#ba1c22", title: "Five colours from one balcony", place: "Lijiang",
      alt: "A Lijiang balcony full of flowers, beside a key of the five colours sampled from the photograph" },
    { file: "assets/pages/p06.jpg", webp: "assets/pages/p06.webp", tone: "#513c32", title: "Seven windows", place: "Kutná Hora",
      alt: "Seven stained-glass windows from a church in Kutná Hora, cut out and floating on white paper" },
    { file: "assets/pages/p01.jpg", webp: "assets/pages/p01.webp", tone: "#19294a", title: "Merdeka 118, five times", place: "Kuala Lumpur",
      alt: "Merdeka 118 in five strips over 100 minutes, the sky going from grey to indigo as the tower lights up" },
    { file: "assets/pages/p05.jpg", webp: "assets/pages/p05.webp", tone: "#14325f", title: "Dusk to dawn", place: "Hallstatt",
      alt: "Six frames of Hallstatt from the same window, four at blue hour and two the next morning" },
    { file: "assets/pages/p15.jpg", webp: "assets/pages/p15.webp", tone: "#602b19", title: "Křižíkova, 75 seconds", place: "Prague",
      alt: "A Prague metro platform, empty, then 75 seconds later with a train streaking through" },
    { file: "assets/pages/p04.jpg", webp: "assets/pages/p04.webp", tone: "#3b4044", title: "King's Cross", place: "London",
      alt: "The steel lattice roof of King's Cross station, with three inset details" },
    { file: "assets/pages/p17.jpg", webp: "assets/pages/p17.webp", tone: "#083c86", title: "16:43 to 18:36", place: "Český Krumlov",
      alt: "Český Krumlov from the same spot at 16:43 and 18:36, day on the left and night on the right" },
    { file: "assets/pages/p24.jpg", webp: "assets/pages/p24.webp", tone: "#663b24", title: "October", place: "On the road", mixed: true,
      alt: "Nine square crops of autumn trees in a grid" },
    { file: "assets/pages/p13.jpg", webp: "assets/pages/p13.webp", tone: "#0e0e0e", title: "Spires in ink", place: "Dresden",
      alt: "The spires of Dresden in solid black against a white sky, like a woodcut" },
    { file: "assets/pages/p09.jpg", webp: "assets/pages/p09.webp", tone: "#303743", title: "Clockwork", place: "Prague",
      alt: "The two dials of Prague's astronomical clock, cut out on white" }
  ],
  MONTHS: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  // the order the calendar's sheets sit in on the stand (Designs 1 and 2): cover, then January's photo, then January's planner
  SHEETS: [
    { src: "assets/cover.jpg", alt: "Cover: the numerals 2027 filled with the steel roof of King's Cross" },
    { src: "assets/pages/p02.jpg", alt: "January photo page: Jade Dragon Snow Mountain at sunrise" },
    { src: "assets/planner-jan-800.webp", alt: "January planner page" }
  ],
  // the same calendar printed on both sides of each sheet (Designs 3 and 4): the planner faces you,
  // and the month's photograph is on the back of the sheet before it, facing the other side of the desk
  DUPLEX: [
    { src: "assets/cover.jpg", bg: "#fff", alt: "Cover: the numerals 2027 filled with the steel roof of King's Cross",
      back: { src: "assets/pages/p02.webp", bg: "#fff", alt: "January photo page: Jade Dragon Snow Mountain at sunrise" } },
    { src: "assets/planner-jan-800.webp", bg: "#faf8f4", alt: "January planner page" }
  ]
};

/* The distinct places the photographs were taken, in month order. */
CAL.places = () => [...new Set(CAL.PAGES.filter(p => !p.mixed).map(p => p.place))];

/* Wires every [data-order] link to the form. Until the form exists, the final button calls say(message) instead. */
window.wireOrderLinks = function (say) {
  document.querySelectorAll("[data-order]").forEach(a => {
    if (CAL.ORDER_URL) { a.href = CAL.ORDER_URL; a.target = "_blank"; a.rel = "noopener"; return; }
    a.addEventListener("click", e => {
      if (a.getAttribute("href") !== "#order") e.preventDefault();
      if (a.dataset.order === "final") { e.preventDefault(); say && say(CAL.SOON, a); }
    });
  });
};
