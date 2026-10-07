/* ============ 6m) 📅 HETI KÁRTYA — 4 pecsét = teljes hét (visszahívás 5. kör, 2026-10-07) ============
   Terv: terv/visszahivas-rendszerterv.html (4. elem) + terv/visszahivas-rajzterv.html (B rész, „Heti kártya”, jóváhagyva).
     • Gyakorlós naponként egy pecsét (gondozas.js: hetPecset, a gyakPalyaVege hívja): az unikornis patkója az unikornis
       színében, alatta a nap neve. 4 pecsét = teljes hét (szivárvány-szalag + HET_TELJES_HARMAT 💧); az 5–7. szivárványos
       ráadás, semmit nem vár el.
     • Az ösvény végén (hetVegeMutat) a kártya felúszik, és a mai pecsét ráüt; a hír-sor első sora is ez (hetHirek).
     • Az odú falán kis fakeretben lóg (hetOduKartya); koppintásra nagyban nyílik, onnan a füzet (a régi hetek).
     • Sosem nullázódik: hétfőn új kártya, a régi a füzetbe kerül, akárhány pecsét volt rajta. Az üres hely halvány pötty,
       nem hiány; nincs „siess”, nincs áthúzott nap.
   Mentés: P().het = { [hetAzon]: [tenyNap | null, …] } (gondozas.js visszaTar). */

var HET_NAPNEV = ["hétfő", "kedd", "szerda", "csütörtök", "péntek", "szombat", "vasárnap"];
var HET_PECSET_SZIN = { rozsa: ["#e0699b", "#b0417a"], korall: ["#f08a6a", "#b5543a"], kek: ["#7fb6e6", "#3f78b0"] };
var HET_ODU = { x: 292, y: 262, s: 0.19 };   /* az odú falán: a jelvénytábla alatt, az ablak és a csillaglámpa között */
var HET_DEFS = '<defs><linearGradient id="het-szivarvany" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6a5c0"/><stop offset=".35" stop-color="#fce49a"/><stop offset=".65" stop-color="#a7d99a"/><stop offset="1" stop-color="#9ec9f0"/></linearGradient></defs>';

function hetNapIndex(nap) { return nap == null ? -1 : (((nap + 3) % 7) + 7) % 7; }   /* 0 = hétfő */
function hetSzin(leny) { return HET_PECSET_SZIN[LENYEK[leny || mentes.leny].rajz] || HET_PECSET_SZIN.rozsa; }
/* egy patkó-pecsét: közép (x, y), sugár r; szivarvany = ráadás-pecsét */
function hetPatko(x, y, r, sz, szivarvany) {
  var f = szivarvany ? "url(#het-szivarvany)" : sz[0];
  return '<g transform="translate(' + x + " " + y + ") scale(" + (r / 30) + ')"><circle r="30" fill="' + f + '" opacity=".18"/>' +
    '<circle r="30" fill="none" stroke="' + f + '" stroke-width="3" stroke-dasharray="4 3" opacity=".7"/>' +
    '<path d="M-14 16V-2A14 14 0 0 1 14 -2V16H7V-2A7 7 0 0 0 -7 -2V16Z" fill="' + f + '" stroke="' + sz[1] + '" stroke-width="1.6" stroke-linejoin="round"/>' +
    [[-10.5, -1], [10.5, -1], [-10.5, 9], [10.5, 9]].map(function (c) { return '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="1.6" fill="#fff"/>'; }).join("") + "</g>";
}
/* a kártya (420×270 egység): napok = a pecsétek napjai; o.uj = az utolsó most üt rá; o.cim = felirat helyett */
function hetKartyaSVG(napok, o) {
  o = o || {};
  var W = 420, H = 270, sz = hetSzin(), teljes = napok.length >= HET_TELJES, t = "";
  t += '<rect x="6" y="10" width="' + W + '" height="' + H + '" rx="18" fill="#3c2a50" opacity=".12"/>';
  t += '<rect width="' + W + '" height="' + H + '" rx="18" fill="#a4734a"/><rect x="10" y="10" width="' + (W - 20) + '" height="' + (H - 20) + '" rx="12" fill="#fffaf0"/>';
  if (teljes) t += '<rect x="10" y="10" width="' + (W - 20) + '" height="' + (H - 20) + '" rx="12" fill="none" stroke="url(#het-szivarvany)" stroke-width="7"/>';
  t += '<text x="' + W / 2 + '" y="48" text-anchor="middle" font-family="Fredoka,sans-serif" font-weight="700" font-size="24" fill="#5a3f8a">' + (o.cim || (teljes ? "🌟 Teljes hét! 🌟" : "A heti kártyám")) + "</text>";
  for (var i = 0; i < HET_TELJES; i++) {
    var cx = 72 + i * 92, cy = 118;
    if (i >= napok.length) { t += '<circle cx="' + cx + '" cy="' + cy + '" r="34" fill="#f3ecf8"/><circle cx="' + cx + '" cy="' + cy + '" r="4" fill="#d9cbe8"/>'; continue; }
    var most = o.uj && i === napok.length - 1;
    t += '<g class="' + (most ? "het-ut" : "") + '">' + hetPatko(cx, cy, 34, sz, false) + "</g>";
    var ni = hetNapIndex(napok[i]);
    if (ni >= 0) t += '<text x="' + cx + '" y="' + (cy + 56) + '" text-anchor="middle" font-family="Fredoka,sans-serif" font-weight="600" font-size="15" fill="#6b6280">' + HET_NAPNEV[ni] + "</text>";
  }
  t += '<text x="40" y="236" font-family="Fredoka,sans-serif" font-weight="600" font-size="14" fill="#9a8fb0">ráadás:</text>';
  for (var j = 0; j < 3; j++) {
    var rx = 130 + j * 48, ry = 231, k = HET_TELJES + j;
    if (k < napok.length) t += '<g class="' + (o.uj && k === napok.length - 1 ? "het-ut" : "") + '">' + hetPatko(rx, ry, 17, ["#fce49a", sz[1]], true) + "</g>";
    else t += '<circle cx="' + rx + '" cy="' + ry + '" r="3" fill="#e6dcef"/>';
  }
  if (teljes) t += [[30, 20, "#f6a5c0"], [392, 26, "#9ec9f0"], [396, 240, "#fce49a"], [24, 246, "#a7d99a"], [210, 14, "#c9a8e6"]].map(function (c) {
    return '<path d="M' + c[0] + " " + (c[1] - 7) + 'l2 5l5 2l-5 2l-2 5l-2 -5l-5 -2l5 -2Z" fill="' + c[2] + '"/>'; }).join("");
  return t;
}
function hetMost() { return (visszaTar().het[hetAzon()] || []).slice(); }

/* ── az ösvény végén (palyaVege, ftVege): ha ma új pecsét jött, a kártya felúszik, és a pecsét ráüt ── */
function hetVegeMutat() {
  var regi = document.querySelector("#kepernyo-vege .het-vege"); if (regi) regi.parentNode.removeChild(regi);
  var u = HET_UJ, sz = $("vege-szoveg");
  if (!u || u.nap !== tenyNap() || u.lattaVege || !sz) return;
  u.lattaVege = 1;
  var d = document.createElement("div");
  d.className = "het-vege";
  d.innerHTML = '<svg viewBox="-4 0 430 284" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Heti kártya">' + HET_DEFS + hetKartyaSVG(hetMost(), { uj: true }) + "</svg>";
  sz.parentNode.insertBefore(d, sz);
}

/* ── az odú falán: kis fakeretes kártya szalagon; koppintásra nagyban ── */
function hetOduKartya() {
  var o = HET_ODU, napok = hetMost();
  return '<g id="het-odu" transform="translate(' + o.x + " " + o.y + ')" role="button" aria-label="Heti kártya">' + HET_DEFS +
    '<path d="M0 -26L-30 -4M0 -26L30 -4" stroke="#c9a8e6" stroke-width="1.6"/><circle cy="-26" r="2.6" fill="#e0699b"/>' +
    '<g transform="scale(' + o.s + ') translate(-210 -10)">' + hetKartyaSVG(napok, { cim: "A hetem" }) + "</g>" +
    '<rect x="-56" y="-36" width="112" height="80" fill="transparent"/></g>';   /* telefonon is ujjnyi koppintási hely */
}
function hetOduKot(svg) {
  var g = svg && svg.querySelector("#het-odu");
  if (g) g.addEventListener("click", function () { hangGomb(); hetNagy(); });
}
/* a nagy kártya (fedőlap), onnan a füzet */
function hetNagy() {
  var napok = hetMost(), n = napok.length;
  var d = lenyFedo('<div class="leny-kartya het-nagy"><svg class="het-nagy-svg" viewBox="-4 0 430 284" xmlns="http://www.w3.org/2000/svg">' + HET_DEFS + hetKartyaSVG(napok) + "</svg>" +
    '<div class="het-gombok"><button class="nagy-gomb" id="het-fuzet">📒 A füzetem</button><button class="nagy-gomb kiemelt" id="het-zar">Rendben</button></div></div>');
  mondd(n >= HET_TELJES ? "Teljes hét! Minden pecsét a helyén." : n ? "Ezen a héten " + n + " pecsét van a kártyán." : "Ez az új heti kártyád. Minden gyakorlós napon kap egy pecsétet.");
  d.querySelector("#het-zar").addEventListener("click", function () { hangGomb(); lenyFedoZar(); });
  d.querySelector("#het-fuzet").addEventListener("click", function () { hangGomb(); hetFuzet(); });
}
/* a füzet: minden régi hét egy kis lap (a legújabb elöl). A 2 pecsétes hét is ott van, és szép. */
function hetFuzet() {
  var h = visszaTar().het, most = hetAzon();
  var hetek = Object.keys(h).map(Number).filter(function (k) { return k !== most && h[k].length; }).sort(function (a, b) { return b - a; });
  var lapok = hetek.map(function (k) {
    return '<div class="het-lap"><svg viewBox="-4 0 430 284" xmlns="http://www.w3.org/2000/svg">' + HET_DEFS + hetKartyaSVG(h[k], { cim: hetCim(k) }) + "</svg></div>";
  }).join("");
  var d = lenyFedo('<div class="leny-kartya het-fuzet"><div class="het-fuzet-fej"><b>📒 A heteim</b><button class="kt-gomb" id="het-fz-zar">✕</button></div>' +
    '<div class="het-fuzet-racs">' + (lapok || '<p class="het-ures">Hétfőn ide kerül az első heti kártyád.</p>') + "</div></div>");
  mondd(hetek.length ? "A füzetem. Itt van minden régi heti kártyám." : "Hétfőn ide kerül az első heti kártyád.");
  d.querySelector("#het-fz-zar").addEventListener("click", function () { hangGomb(); lenyFedoZar(); try { speechSynthesis.cancel(); } catch (e) {} });
}
/* „szept. 29. hete” — a hétfő dátuma */
function hetCim(k) {
  var d = new Date(2026, 0, 1), alap = tenyNap(d);   /* a tenyNap naptári nap; ehhez viszonyítunk, így helyi idő szerint pontos */
  d.setDate(d.getDate() + (k - alap));
  var ho = ["jan.", "febr.", "márc.", "ápr.", "máj.", "jún.", "júl.", "aug.", "szept.", "okt.", "nov.", "dec."][d.getMonth()];
  return ho + " " + d.getDate() + ". hete";
}
