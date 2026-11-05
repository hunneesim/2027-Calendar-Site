/* Content shared by all three designs.
   ORDER_URL: paste the Google Form link here once it exists. Every "Order" button on every design uses it.
   PAGES: the twelve photo pages in month order. To swap one, change its file and its text. */
window.CAL = {
  ORDER_URL: "",
  PRICE: "RM 49",
  PAGES: [
    { file: "assets/pages/p02.jpg", title: "Jade Dragon Snow Mountain", place: "Lijiang" },
    { file: "assets/pages/p03.jpg", title: "Through the arch", place: "Lijiang" },
    { file: "assets/pages/p12.jpg", title: "Five colours from one balcony", place: "Lijiang" },
    { file: "assets/pages/p06.jpg", title: "Seven windows", place: "Kutná Hora" },
    { file: "assets/pages/p01.jpg", title: "Merdeka 118, five times", place: "Kuala Lumpur" },
    { file: "assets/pages/p05.jpg", title: "Hallstatt, dusk to dawn", place: "Hallstatt" },
    { file: "assets/pages/p15.jpg", title: "Křižíkova, 75 seconds", place: "Prague" },
    { file: "assets/pages/p04.jpg", title: "King's Cross", place: "London" },
    { file: "assets/pages/p17.jpg", title: "Český Krumlov, 16:43 | 18:36", place: "Český Krumlov" },
    { file: "assets/pages/p24.jpg", title: "October", place: "Across the trip" },
    { file: "assets/pages/p13.jpg", title: "Dresden in ink", place: "Dresden" },
    { file: "assets/pages/p09.jpg", title: "Clockwork", place: "Prague" }
  ],
  MONTHS: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  // the order the calendar's sheets sit in on the stand: cover, then January's photo, then January's planner
  SHEETS: [
    { src: "assets/cover.jpg", alt: "Cover: the numerals 2027 filled with the steel roof of King's Cross" },
    { src: "assets/pages/p02.jpg", alt: "January photo page: Jade Dragon Snow Mountain at sunrise" },
    { src: "assets/planner-jan-800.webp", alt: "January planner page" }
  ],
  // the same calendar printed on both sides of each sheet (used by Design 3): the planner faces you,
  // and the month's photograph is on the back of the sheet before it, facing the other side of the desk
  DUPLEX: [
    { src: "assets/cover.jpg", bg: "#fff", alt: "Cover: the numerals 2027 filled with the steel roof of King's Cross",
      back: { src: "assets/pages/p02.jpg", bg: "#fff", alt: "January photo page: Jade Dragon Snow Mountain at sunrise" } },
    { src: "assets/planner-jan-800.webp", bg: "#faf8f4", alt: "January planner page",
      back: { src: "assets/pages/p03.jpg", bg: "#fff", alt: "February photo page" } }
  ]
};

/* Wires every [data-order] link to the form, or explains that it isn't live yet. */
window.wireOrderLinks = function (toast) {
  document.querySelectorAll("[data-order]").forEach(a => {
    if (CAL.ORDER_URL) { a.href = CAL.ORDER_URL; a.target = "_blank"; a.rel = "noopener"; return; }
    a.addEventListener("click", e => {
      if (a.getAttribute("href") !== "#order") e.preventDefault();
      if (a.dataset.order === "final") { e.preventDefault(); toast && toast("The order form opens soon."); }
    });
  });
};
