/* ============ 6a4) ✨ SZARVVARÁZS — a gyerek unikornisa cselekszik (Piactér 3. kör, 2026-10-23) ============
   Rajz: terv/piacter-rajzterv.html 4. pont + „Az unikornis mozdulatai” (✅ jóváhagyva 2026-10-23).
   VEZÉRELV (vezerelv-a-kep-a-gondolkodas-helye): a házakban a gyerek UNIKORNISA mozgatja a tárgyakat — az érme, a pecsét,
   később a kavics, a létrafok a szarvától ívben átlebeg, szikra-nyomot húz, közben az unikornis odanéz, és a szarva ragyog.
     szarvVarazs(el, x0, y0, x1, y1, o) — egy SVG-elem átlebegtetése (o.emel: az ív magassága, o.ido ms, o.nyom: szikra-réteg)
     uniPult(g, o) — a gyerek saját, öltöztetett unikornisa oldalnézetben (renderer.js unikornisSVG), a pult mögött:
       U.poz("figyel" | "szarvvar" | "orul" | "tenyer" | "gondol", ms) — a pózok a renderer.js UNI_POZ táblájában vannak,
       ms után vissza az alaphoz (U.alap). A szarv fénye a „szarvvar” pózhoz tartozik (a fej keretében, vele együtt mozdul).
   Mozgáscsökkentésnél a tárgy ív és szikra nélkül kerül a helyére, a póz azonnal vált (renderer.js). */
var SZV_NS = "http://www.w3.org/2000/svg";
var SZV_DEFS = '<radialGradient id="szvHalo" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff4b0" stop-opacity=".9"/><stop offset="1" stop-color="#fff4b0" stop-opacity="0"/></radialGradient>';
function szvF(n) { return (+n).toFixed(1); }
function szvIvPont(x0, y0, cx, cy, x1, y1, t) { var u = 1 - t; return [u * u * x0 + 2 * u * t * cx + t * t * x1, u * u * y0 + 2 * u * t * cy + t * t * y1]; }
function szvCsillag(x, y, s) {
  return "M" + szvF(x) + " " + szvF(y - s) + "L" + szvF(x + s * .3) + " " + szvF(y - s * .3) + "L" + szvF(x + s) + " " + szvF(y) + "L" + szvF(x + s * .3) + " " + szvF(y + s * .3) +
    "L" + szvF(x) + " " + szvF(y + s) + "L" + szvF(x - s * .3) + " " + szvF(y + s * .3) + "L" + szvF(x - s) + " " + szvF(y) + "L" + szvF(x - s * .3) + " " + szvF(y - s * .3) + "Z";
}
/* az elem a (x1, y1) pontra kerül (CSS translate az SVG saját egységében); közben ívben lebeg */
function szarvVarazs(el, x0, y0, x1, y1, o) {
  o = o || {};
  el.style.transform = "translate(" + szvF(x1) + "px," + szvF(y1) + "px)";
  if (lkCsokkent() || !el.animate) return;
  var emel = o.emel || Math.min(80, 16 + Math.hypot(x1 - x0, y1 - y0) * .3), pk = Math.min(y0, y1) - emel;
  var cx = (x0 + x1) / 2, cy = 2 * pk - (y0 + y1) / 2, kf = [], i, dur = o.ido || 750;
  for (i = 0; i <= 10; i++) { var p = szvIvPont(x0, y0, cx, cy, x1, y1, i / 10); kf.push({ transform: "translate(" + szvF(p[0]) + "px," + szvF(p[1]) + "px)" }); }
  el.animate(kf, { duration: dur, easing: "ease-in-out" });
  el.classList.add("lebeg"); setTimeout(function () { el.classList.remove("lebeg"); }, dur);
  if (o.nyom) for (i = 1; i < 8; i++) (function (i) {
    var p = szvIvPont(x0, y0, cx, cy, x1, y1, i / 8), sz = document.createElementNS(SZV_NS, "path");
    sz.setAttribute("d", szvCsillag(p[0], p[1], 3 + (i % 3)));
    sz.setAttribute("fill", i % 2 ? "#fff3a8" : "#ffffff"); sz.setAttribute("opacity", "0"); sz.setAttribute("pointer-events", "none");
    o.nyom.appendChild(sz);
    sz.animate([{ opacity: 0 }, { opacity: 1 }, { opacity: 0 }], { duration: 700, delay: Math.max(0, dur * i / 8 - 120) });
    setTimeout(function () { sz.remove(); }, dur * i / 8 + 700);
  })(i);
}

/* ── az unikornis a pult mögött ── g: egy üres <g>, amit a hívó már a helyére tett (translate); o.meret, o.alap */
function uniPult(g, o) {
  o = o || {};
  var id = "szv-uni-" + (++uniPult.n);
  g.innerHTML = '<g class="szv-uni uni-poz-' + (o.alap || "figyel") + '">' + unikornisSVG(id, LENYEK[mentes.leny], o.meret || 1, P().oltozet) + '</g>';
  var w = g.firstChild;
  /* a szarv fénye a fej keretébe (a fej forgásával együtt mozdul): a fej rajza a renderer.js UNI_TEST_IZ.fej keretében van */
  var fej = w.querySelector(".uni-fej"), belso = fej && fej.firstElementChild;
  if (belso) {
    var s = '<g class="szv-feny" opacity="0" pointer-events="none"><circle cx="294" cy="44" r="54" fill="url(#szvHalo)"/>';
    [[318, 30, 7, "#fff3a8"], [270, 34, 5, "#ffffff"], [300, 4, 6, "#fce49a"], [328, 58, 4, "#ffffff"]].forEach(function (c) { s += '<path d="' + szvCsillag(c[0], c[1], c[2]) + '" fill="' + c[3] + '"/>'; });
    belso.insertAdjacentHTML("afterbegin", s + '</g>');
  }
  var U = { g: g, w: w, alap: o.alap || "figyel", nev: o.alap || "figyel", t: null, feny: w.querySelector(".szv-feny") };
  U.poz = function (nev, ms) {
    clearTimeout(U.t);
    U.w.setAttribute("class", "szv-uni uni-poz-" + nev + (nev === "orul" && !lkCsokkent() ? " uni-mozd-ugras" : ""));
    U.nev = nev;
    if (U.feny) U.feny.setAttribute("class", "szv-feny" + (nev === "szarvvar" ? " ragyog" : ""));
    if (ms) U.t = setTimeout(function () { if (U.w.isConnected) U.poz(U.alap); }, ms);
  };
  return U;
}
uniPult.n = 0;
