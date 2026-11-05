/* Shared by Designs 3 and 4, after content.js and motion.js:
   text filled in from content.js, the nav's colour, tinted backgrounds, story bars, the photo viewer,
   the planner section and the order section. */
(function () {
  const { clamp, onFrame, onMeasure, PlannerTour, reduced } = Motion;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
  const nb = s => s.replace(/ /g, " ");
  const listOf = a => a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1];
  const mix = (hex, base, amt) => { const n = parseInt(hex.slice(1), 16); return `rgb(${[(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c, i) => Math.round(base[i] + (c - base[i]) * amt)).join(",")})`; };
  const smooth = () => reduced ? "auto" : "smooth";

  /* ------------------------------------------------------------ text from content.js */
  function fill() {
    $$("[data-fill=price]").forEach(e => { e.textContent = nb(CAL.PRICE); });
    $$("[data-fill=delivery]").forEach(e => { e.textContent = CAL.DELIVERY; });
    $$("[data-fill=deal]").forEach(e => { e.textContent = CAL.DEAL; });
    $$("[data-fill=when]").forEach(e => { e.textContent = CAL.WHEN; });
    $$("[data-fill=prices]").forEach(e => { e.textContent = CAL.OPTIONS.map(o => `${nb(o.price)} ${o.name.toLowerCase()}`).join(" · ") + " · RM\u00a010 off two copies"; });
    $$("[data-fill=options]").forEach(e => {
      e.innerHTML = CAL.OPTIONS.map(o => `<div class="opt"><p class="opt-top"><b>${o.name}</b><span>${nb(o.price)}</span></p><p>${o.text}</p></div>`).join("");
    });
    $$("[data-fill=places]").forEach(e => { e.textContent = `12, all mine, taken in ${listOf(CAL.places())}`; });
    $$("[data-fill=count]").forEach(e => { e.textContent = CAL.places().length; });
  }

  /* ------------------------------------------------------------ nav: pick(y) returns { bg, fg, line } */
  function Nav(el, pick) {
    let last = "";
    const apply = () => {
      const s = pick(scrollY), key = s.bg + s.fg + (s.line ? 1 : 0);
      if (key === last) return;
      last = key;
      el.style.setProperty("--nav-bg", s.bg);
      el.style.setProperty("--nav-fg", s.fg);
      el.classList.toggle("line", !!s.line);
    };
    onFrame(apply);
    return { refresh: apply };
  }

  /* ------------------------------------------------------------ a background that fades from colour to colour */
  function Tint(host) {
    host.classList.add("tinted");
    const box = document.createElement("div");
    box.className = "tint"; box.setAttribute("aria-hidden", "true");
    box.innerHTML = "<i></i><i></i>";
    host.prepend(box);
    const layers = [...box.children];
    let front = 0, cur = "";
    return {
      set(color) {
        if (color === cur) return;
        cur = color;
        // the new colour fades in on top; the old one fades out underneath it, so the section never dips
        const next = 1 - front, a = layers[next], b = layers[front];
        a.style.background = color;
        a.classList.add("top", "on");
        b.classList.remove("top", "on");
        front = next;
      },
      get: () => cur
    };
  }

  /* ------------------------------------------------------------ story bars for a pinned section: ranges of progress, one bar each */
  function Bars(el, ranges) {
    el.setAttribute("aria-hidden", "true");
    el.innerHTML = ranges.map(() => "<i><b></b></i>").join("");
    const bs = $$("b", el);
    return p => {
      bs.forEach((b, k) => {
        const [a, z] = ranges[k], v = clamp((p - a) / (z - a));
        if (b._v !== v) { b._v = v; b.style.transform = `scaleX(${v.toFixed(3)})`; }
      });
      el.style.opacity = (1 - clamp((p - .97) / .03)).toFixed(3);
    };
  }

  /* ------------------------------------------------------------ the photo viewer: tap a photo to see it large */
  let lb = null;
  function viewer() {
    if (lb) return lb;
    const el = document.createElement("div");
    el.className = "lb on-dark";
    el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true"); el.setAttribute("aria-label", "Photo pages"); el.setAttribute("aria-hidden", "true");
    const arrow = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`;
    el.innerHTML =
      `<div class="lb-top"><span class="label" aria-hidden="true"></span><button class="lb-x" aria-label="Close">${arrow("M6 6l12 12M18 6L6 18")}</button></div>` +
      `<div class="lb-stage"><img alt="" decoding="async" draggable="false"></div>` +
      `<div class="lb-foot"><button class="lb-prev" aria-label="Previous month">${arrow("M15 5l-7 7 7 7")}</button>` +
      `<div class="lb-cap" aria-live="polite"><p class="label"></p><p class="title-i"></p></div>` +
      `<button class="lb-next" aria-label="Next month">${arrow("M9 5l7 7-7 7")}</button></div>`;
    document.body.appendChild(el);
    const img = $("img", el), count = $(".lb-top .label", el), capL = $(".lb-cap .label", el), capT = $(".lb-cap .title-i", el);
    const xBtn = $(".lb-x", el), prev = $(".lb-prev", el), next = $(".lb-next", el), stage = $(".lb-stage", el);
    let i = 0, opener = null, done = null;
    function show(k) {
      i = clamp(k, 0, 11);
      const pg = CAL.PAGES[i];
      img.src = pg.file; img.alt = pg.alt || pg.title;
      img.style.background = pg.tone;
      count.textContent = `${String(i + 1).padStart(2, "0")} / 12`;
      capL.textContent = `${ROMAN[i]} · ${CAL.MONTHS[i]} · ${pg.place}`;
      capT.textContent = pg.title;
      prev.disabled = i === 0; next.disabled = i === 11;
      [i - 1, i + 1].forEach(j => { if (CAL.PAGES[j]) { const p = new Image(); p.src = CAL.PAGES[j].file; } });
    }
    function open(k, from, onClose) {
      opener = from || document.activeElement; done = onClose || null;
      show(k);
      el.classList.add("open"); el.setAttribute("aria-hidden", "false");
      document.documentElement.style.overflow = "hidden";
      xBtn.focus({ preventScroll: true });
    }
    function close() {
      if (!el.classList.contains("open")) return;
      el.classList.remove("open"); el.setAttribute("aria-hidden", "true");
      document.documentElement.style.overflow = "";
      if (opener && opener.focus) opener.focus({ preventScroll: true });
      if (done) done(i);
    }
    xBtn.addEventListener("click", close);
    prev.addEventListener("click", () => show(i - 1));
    next.addEventListener("click", () => show(i + 1));
    el.addEventListener("keydown", e => {
      if (e.key === "Escape") { e.preventDefault(); close(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); show(i - 1); }
      else if (e.key === "ArrowRight") { e.preventDefault(); show(i + 1); }
      else if (e.key === "Tab") {
        // keep focus inside the viewer
        const f = [xBtn, prev, next].filter(b => !b.disabled), a = f.indexOf(document.activeElement);
        e.preventDefault(); f[(a + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
      }
    });
    // swipe sideways to change month, down to close
    let d = null;
    stage.addEventListener("pointerdown", e => { if (e.button !== 0 || !e.isPrimary) return; d = { x: e.clientX, y: e.clientY, id: e.pointerId }; try { stage.setPointerCapture(e.pointerId); } catch (_) {} });
    stage.addEventListener("pointermove", e => {
      if (!d || e.pointerId !== d.id) return;
      const dx = e.clientX - d.x, dy = e.clientY - d.y;
      img.style.transform = Math.abs(dx) > Math.abs(dy) ? `translate3d(${dx * .6}px, 0, 0)` : `translate3d(0, ${Math.max(0, dy) * .6}px, 0)`;
    });
    const up = e => {
      if (!d || e.pointerId !== d.id) return;
      const dx = e.clientX - d.x, dy = e.clientY - d.y; d = null;
      img.style.transform = "";
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(i + (dx < 0 ? 1 : -1));
      else if (dy > 90 && dy > Math.abs(dx)) close();
    };
    stage.addEventListener("pointerup", up);
    stage.addEventListener("pointercancel", up);
    lb = { open, close };
    return lb;
  }

  /* ------------------------------------------------------------ planner: the camera follows the cards, the cards follow your finger
     Steps are page areas (700 x 905 units) for the camera; marks are the outlines drawn around each feature. */
  const STEPS = [[0, 0, 700, 905], [40, 172, 430, 300], [420, 176, 250, 150], [322, 26, 356, 132], [18, 176, 170, 240], [40, 716, 320, 150]];
  const MARKS = [null, [315.4, 378.4, 86.1, 83.2], [487.7, 212, 86.1, 83.2], [334, 38, 332, 110], [27, 184, 26, 522], [52, 730, 286, 124]];
  function Planner(root, { onStep } = {}) {
    const view = $(".p-view", root), cards = $(".cards", root), prog = $(".prog", root), count = $(".count", root), tag = $(".p-tag", root);
    const prevB = $(".p-prev", root), nextB = $(".p-next", root);
    const items = [...cards.children], N = items.length;
    const tour = PlannerTour({ view, frame: $(".tour-frame", root), steps: STEPS, marks: MARKS, mark: $(".mark", root), maxScale: 2.4, hold: 0 });
    prog.innerHTML = items.map(c => `<button aria-label="${$("h3", c).textContent}"><b></b></button>`).join("");
    const segs = $$("button", prog), fills = $$("b", prog);
    let cw = 1, at = -1, queued = false, lastScroll = 0, touched = false;
    function render() {
      queued = false;
      const f = clamp(cards.scrollLeft / cw, 0, N - 1);
      tour.update(f / (N - 1));
      fills.forEach((b, k) => { b.style.transform = `scaleX(${clamp(f - k + 1).toFixed(3)})`; });
      const k = Math.round(f);
      if (k !== at) {
        at = k;
        segs.forEach((s, j) => s.toggleAttribute("aria-current", j === k));
        if (count) count.textContent = `${String(k + 1).padStart(2, "0")} / ${String(N).padStart(2, "0")}`;
        prevB.disabled = k === 0; nextB.disabled = k === N - 1;
      }
      if (!touched && f > .3) { touched = true; if (tag) tag.classList.add("done"); }
      if (onStep) onStep(f, k);
    }
    cards.addEventListener("scroll", () => { lastScroll = performance.now(); if (!queued) { queued = true; requestAnimationFrame(render); } }, { passive: true });
    addEventListener("scroll", () => { lastScroll = performance.now(); }, { passive: true });
    const go = k => cards.scrollTo({ left: clamp(k, 0, N - 1) * cw, behavior: smooth() });
    const nextOrStart = () => go(at === N - 1 ? 0 : at + 1);
    segs.forEach((s, j) => s.addEventListener("click", () => go(j)));
    prevB.addEventListener("click", () => go(at - 1));
    nextB.addEventListener("click", () => go(at + 1));
    cards.addEventListener("keydown", e => {
      if (e.key === "ArrowRight") { e.preventDefault(); go(at + 1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); go(at - 1); }
      else if (e.key === "Home") { e.preventDefault(); go(0); }
      else if (e.key === "End") { e.preventDefault(); go(N - 1); }
    });
    // a tap on a card or the page moves on (unless it was only stopping a scroll)
    const settled = () => performance.now() - lastScroll > 160;
    cards.addEventListener("click", () => { if (settled()) nextOrStart(); });
    // dragging the page scrubs through the features under your finger
    let drag = null;
    view.addEventListener("pointerdown", e => {
      if (e.button !== 0 || !e.isPrimary) return;
      drag = { x: e.clientX, y: e.clientY, left: cards.scrollLeft, moved: false, id: e.pointerId };
    });
    view.addEventListener("pointermove", e => {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (!drag.moved && Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(dy)) {
        drag.moved = true; cards.style.scrollSnapType = "none";
        try { view.setPointerCapture(drag.id); } catch (_) {}
      }
      if (drag.moved) cards.scrollLeft = drag.left - dx * (cw / view.clientWidth) * 1.4;
    });
    const end = e => {
      if (!drag || e.pointerId !== drag.id) return;
      const d = drag; drag = null;
      if (d.moved) {
        const f = cards.scrollLeft / cw, dir = Math.sign(cards.scrollLeft - d.left);
        cards.style.scrollSnapType = "";
        go(Math.abs(f - Math.round(f)) < .15 ? Math.round(f) : dir > 0 ? Math.ceil(f) : Math.floor(f));
      } else if (e.type === "pointerup" && settled()) nextOrStart();
    };
    view.addEventListener("pointerup", end);
    view.addEventListener("pointercancel", end);
    // the full-size page is fetched only as the section comes near
    const big = $(".tour-frame > img", root);
    new IntersectionObserver((es, io) => { if (es[0].isIntersecting) { big.loading = "eager"; if (big.decode) big.decode().catch(() => {}); io.disconnect(); } }, { rootMargin: "100% 0px" }).observe(view);
    onMeasure(() => { tour.layout(); cw = cards.clientWidth || 1; at = -1; render(); });
  }

  /* ------------------------------------------------------------ order: the message shows under the button, where your thumb is */
  function Order() {
    const note = $("#orderNote");
    wireOrderLinks(msg => { if (note) note.textContent = msg; });
  }

  window.Site = { $, $$, ROMAN, mix, fill, Nav, Tint, Bars, viewer, Planner, Order, smooth };
})();
