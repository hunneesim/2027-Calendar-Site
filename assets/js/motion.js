/* Shared by all the designs.
   Motion: a scroll engine. Each scene maps the page's scroll position to a progress value from 0 to 1,
   and its update function writes only transforms and opacity, once per frame, from cached positions.
   Calendar3D: a CSS 3D model of the desk calendar whose sheets flip over the wire-o binding.
   PlannerTour: a camera that moves across the January planner page. */
(function () {
  const clamp = (v, a = 0, b = 1) => v < a ? a : v > b ? b : v;
  const lerp = (a, b, t) => a + (b - a) * t;
  const seg = (p, a, b) => clamp((p - a) / (b - a));
  const ease = {
    inOut: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    out: t => 1 - Math.pow(1 - t, 3),
    in: t => t * t * t,
    smooth: t => t * t * (3 - 2 * t)
  };
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------ viewport height
     Pinned stages are 100svh tall, so scenes are measured against a 100svh probe rather than innerHeight.
     On iPhones innerHeight changes whenever Safari's toolbar shows or hides, and measuring against it
     would make every scroll scene jump mid-animation. */
  const probe = document.createElement("div");
  probe.setAttribute("aria-hidden", "true");
  probe.style.cssText = "position:fixed;left:0;top:0;width:1px;height:100vh;height:100svh;visibility:hidden;pointer-events:none";
  (document.body || document.documentElement).appendChild(probe);
  const readVh = () => probe.offsetHeight || innerHeight;

  /* ------------------------------------------------------------ scenes */
  const scenes = [], frameFns = [], measureFns = [];
  let vh = readVh(), queued = false, lastT = performance.now();

  // mode "pin": the element is tall and holds a sticky child; progress runs while the child is pinned.
  // mode "view": progress runs from the element's top entering the bottom of the screen to its bottom leaving the top.
  // smooth (ms): the shown progress eases towards the scroll position, which absorbs flicks and dropped frames.
  function scene(el, fn, mode = "pin", { smooth = 0 } = {}) {
    const s = { el, fn, mode, top: 0, len: 1, p: -1, cur: null, smooth: reduced ? 0 : smooth };
    scenes.push(s);
    measureOne(s);
    s.cur = s.p = progress(s, scrollY); fn(s.p);
    return s;
  }
  function measureOne(s) {
    const r = s.el.getBoundingClientRect(), h = s.el.offsetHeight;
    s.top = r.top + scrollY;
    s.len = s.mode === "pin" ? Math.max(1, h - vh) : h + vh;
    s.start = s.mode === "pin" ? s.top : s.top - vh;
  }
  const progress = (s, y) => clamp((y - s.start) / s.len);
  function measure() {
    vh = readVh();
    measureFns.forEach(f => f(vh));
    scenes.forEach(measureOne);
    update(true);
  }
  function update(force) {
    queued = false;
    const now = performance.now(), dt = Math.min(64, now - lastT);
    lastT = now;
    const y = scrollY;
    let again = false;
    for (const s of scenes) {
      const target = progress(s, y);
      let p = target;
      if (s.smooth && force !== true && s.cur !== null) {
        p = s.cur + (target - s.cur) * (1 - Math.exp(-dt / s.smooth));
        if (Math.abs(target - p) < .0004) p = target; else again = true;
      }
      s.cur = p;
      if (force === true || p !== s.p) { s.p = p; s.fn(p); }
    }
    for (const f of frameFns) f(y, vh);
    if (again) queue();
  }
  // raw hooks for effects that need the scroll position itself: onFrame runs every frame, onMeasure after layout changes
  const onFrame = f => { frameFns.push(f); f(scrollY, vh); };
  const onMeasure = f => { measureFns.push(f); f(vh); };
  function queue() { if (!queued) { queued = true; requestAnimationFrame(update); } }
  addEventListener("scroll", queue, { passive: true });
  let rz = 0, lastW = innerWidth;
  const remeasure = () => { cancelAnimationFrame(rz); rz = requestAnimationFrame(measure); };
  // a resize that only changes the height is Safari's toolbar: nothing that is measured has changed
  addEventListener("resize", () => { if (innerWidth !== lastW) { lastW = innerWidth; remeasure(); } });
  addEventListener("orientationchange", remeasure);
  addEventListener("load", measure);
  if (document.fonts) document.fonts.ready.then(measure);
  if ("ResizeObserver" in window) {
    let first = true, lastH = 0;
    new ResizeObserver(([e]) => {
      const h = Math.round(e.contentRect.height);
      if (first) { first = false; lastH = h; return; }
      if (h !== lastH) { lastH = h; remeasure(); }
    }).observe(document.body);
  }
  // iOS only shows :active styles when the page listens for touches
  addEventListener("touchstart", () => {}, { passive: true });

  /* reveal on scroll for plain content: adds .in once, then stops watching */
  function reveals(selector = "[data-reveal]") {
    const els = document.querySelectorAll(selector);
    if (reduced || !("IntersectionObserver" in window)) { els.forEach(e => e.classList.add("in")); return; }
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -10% 0px" });
    els.forEach(e => io.observe(e));
  }

  /* make sure images are decoded before a scene needs them, so nothing pops in mid-scroll */
  function ready(imgs) {
    return Promise.all([...imgs].map(i => (i.decode ? i.decode() : Promise.resolve()).catch(() => {})));
  }

  /* ------------------------------------------------------------ 3D calendar */
  function Calendar3D(root, { sheets, stand = "light", rings = 17, blanks = 3 }) {
    root.classList.add("c3", "c3--" + stand);
    root.style.setProperty("--rings", rings);
    // a sheet can be printed on both sides: { src, bg, back: { src, bg } }
    const art = p => p && p.src ? `<img src="${p.src}" alt="${p.alt || ""}" decoding="async" draggable="false">` : "";
    const sheetHTML = (s, i) =>
      `<div class="c3-sheet${s ? "" : " c3-blank"}" data-i="${i}">` +
        `<div class="c3-face"${s && s.bg ? ` style="background:${s.bg}"` : ""}>${art(s)}<b class="c3-holes"></b><span class="c3-shade"></span></div>` +
        `<div class="c3-face c3-rear"${s && s.back && s.back.bg ? ` style="background:${s.back.bg}"` : ""}>${art(s && s.back)}<b class="c3-holes"></b></div>` +
      `</div>`;
    const all = [...sheets, ...Array(blanks).fill(null)];
    root.innerHTML =
      `<div class="c3-ground"></div>` +
      `<div class="c3-rig">` +
        `<div class="c3-back"><div class="c3-plane"></div></div>` +
        `<div class="c3-front"><div class="c3-plane"></div>${all.map(sheetHTML).join("")}<div class="c3-rings">${"<i></i>".repeat(rings)}</div></div>` +
      `</div>`;
    const rig = root.querySelector(".c3-rig"), ground = root.querySelector(".c3-ground");
    const els = [...root.querySelectorAll(".c3-sheet")];
    const shades = els.map(e => e.querySelector(".c3-shade"));
    const n = els.length;
    const state = els.map(() => ({ a: 0, z: 0, y: 0 }));
    const zOf = i => (n - i) * 0.9;

    // The stacking offset is applied along the sheet's own face, after the turn: in front of the stack while the
    // sheet lies on the front, and behind it (so outside the back board) once it has gone over the top.
    // Sheets turned earlier lie closer to the board.
    const FLIP = 360 - 13 - 21;
    function write(i) {
      const s = state[i], t = s.a / FLIP;
      const local = lerp(zOf(i), -(2 + i * 0.9), ease.smooth(clamp((t - .35) / .3)));
      els[i].style.transform = `translate3d(0, ${s.y.toFixed(2)}px, ${s.z.toFixed(2)}px) rotateX(${s.a.toFixed(2)}deg) translateZ(${local.toFixed(2)}px)`;
    }
    els.forEach((_, i) => write(i));

    return {
      root, rig, sheets: els, count: sheets.length,
      images: root.querySelectorAll("img"),
      // camera: rotate and move the whole calendar; z moves it towards the viewer, so perspective does the zooming
      view({ rx = 0, ry = 0, rz = 0, s = 1, x = 0, y = 0, z = 0 } = {}) {
        rig.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, ${z.toFixed(2)}px) rotateX(${rx.toFixed(3)}deg) rotateY(${ry.toFixed(3)}deg) rotateZ(${rz}deg)` + (s !== 1 ? ` scale(${s.toFixed(4)})` : "");
      },
      ground(opacity = 1, sx = 1) {
        ground.style.opacity = opacity;
        ground.style.transform = `scale(${sx}, 1)`;
      },
      // t: 0 = lying on the front, 1 = flipped over the top onto the back
      flip(i, t) {
        if (!els[i]) return;
        const a = t * FLIP;
        if (a === state[i].a) return;
        state[i].a = a; write(i);
        // the sheet darkens as it turns away from the light; the one underneath is shaded only while the sheet is lifting off it
        shades[i].style.opacity = a < 180 ? (Math.sin(a * Math.PI / 180) * 0.45).toFixed(3) : "0";
        if (shades[i + 1]) shades[i + 1].style.opacity = (0.4 * Math.sin(Math.PI * clamp(t * 2))).toFixed(3);
      },
      // pull the sheets apart along their own depth, for an exploded view
      // the printed sheets fan out towards the viewer, each lifted a little; the blank pages stay with the stand
      explode(t, gap = 60, lift = 0) {
        const c = sheets.length;
        for (let i = 0; i < n; i++) {
          const k = i < c ? c - i : 0;
          const z = t * gap * k, y = -t * lift * k;
          if (z === state[i].z && y === state[i].y) continue;
          state[i].z = z; state[i].y = y; write(i);
        }
      },
      // hide sheets that cannot be seen, so the browser has fewer layers to keep
      show(i, on) { if (els[i]) els[i].style.visibility = on ? "" : "hidden"; }
    };
  }

  /* ------------------------------------------------------------ planner tour
     Moves a camera across the January planner page (700 x 905 units) from one feature to the next.
     Each step holds still for part of its share of the progress, then eases to the next.
     mark: an optional outline that sits on the feature being shown. */
  function PlannerTour({ view, frame, steps, maxScale = 3.2, fit = .9, hold = .38, mark = null }) {
    let vw = 1, vh2 = 1, pw = 1;
    function layout() {
      vw = view.clientWidth; vh2 = view.clientHeight;
      pw = Math.min(vw, vh2 * 700 / 905) * .94;
      frame.style.width = pw + "px";
    }
    function camera([x, y, w, h], wide) {
      const k = pw / 700;
      const s = Math.min(maxScale, Math.min(vw / (w * k), vh2 / (h * k)) * (wide ? .94 : fit));
      const W = pw * s, H = pw * 905 / 700 * s;
      const cx = (v, size, box) => size <= box ? (box - size) / 2 : clamp(v, box - size, 0);
      return [cx(vw / 2 - (x + w / 2) * k * s, W, vw), cx(vh2 / 2 - (y + h / 2) * k * s, H, vh2), s];
    }
    const N = steps.length;
    let last = 0, markOn = -1;
    function update(p) {
      const raw = p * (N - 1), i = Math.min(N - 2, Math.floor(raw)), local = raw - i;
      const t = hold ? ease.inOut(seg(local, hold, 1 - hold * .35)) : ease.inOut(local);
      const a = steps[i], b = steps[i + 1];
      const r = a.map((v, j) => lerp(v, b[j], t));
      const [tx, ty, s] = camera(r, (i === 0 && t < .5) || (i === N - 2 && t > .5));
      frame.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) scale(${s.toFixed(4)})`;
      last = i + t;
      if (mark) {
        const k = Math.round(last), near = clamp(1 - Math.abs(last - k) * 5);
        if (k !== markOn) {
          markOn = k;
          const [x, y, w, h] = steps[k], u = pw / 700, pad = 6;
          mark.style.left = (x - pad) * u + "px"; mark.style.top = (y - pad) * u + "px";
          mark.style.width = (w + pad * 2) * u + "px"; mark.style.height = (h + pad * 2) * u + "px";
          mark.style.borderWidth = (1.4 / camera(steps[k], k === 0 || k === N - 1)[2]).toFixed(3) + "px";
        }
        mark.style.opacity = (k === 0 ? 0 : near).toFixed(3);
      }
      return last;   // position along the steps, e.g. 2.4 = between steps 2 and 3
    }
    layout();
    return { update, layout: () => { layout(); markOn = -1; }, at: () => last };
  }

  window.Motion = { scene, onFrame, onMeasure, measure, reveals, ready, clamp, lerp, seg, ease, reduced, Calendar3D, PlannerTour, vh: () => vh };
})();
