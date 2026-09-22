/* ============ 10c) JELVÉNYEK · GYŰJTEMÉNY-KÖNYV · TALÁLT TÁRGY ============ */
/* Additív: saját mentés-ág (P().jelvenyek / streakRekord / dropUres), saját DOM
   (#odu-lap + .jelveny-* / .gyujt-* / #talalt-buborek). A pálya-motorba csak
   hívások kerültek (ertekel / felmondSiker / keruloUt / palyaVege). */

/* — sorozat (elsőre jó válaszok egymás után) — a legjobbat a profil őrzi — */
function streakLep(elsore) {
  if (elsore) {
    J.streak = (J.streak || 0) + 1;
    if (J.streak > (P().streakRekord || 0)) P().streakRekord = J.streak;
  } else J.streak = 0;
}

/* — jelvények (nem vásárolható, feloldás) — 4 család (spec-jelvenyek-es-kristaly.html) — */
function palyakKeszek(p, idk) { return idk.every(function (id) { return p.palyak[id] && p.palyak[id].kesz; }); }
function jsz(p, k) { return (p.jelvSzam && p.jelvSzam[k]) || 0; }
var JELV_CSALAD = { A: "🌲 Ösvény (haladás)", B: "✨ Mesteri tudás", C: "💪 Kitartás", D: "🏡 Gyűjtő / berendező" };
var JELVENYEK = [
  /* A · Ösvény (haladás) */
  { id: "elso-bontas", csalad: "A", nev: "Első bontás mestere", felt: "Az 1. pálya kész", szin: "#f6a5c0",
    teljesul: function (p) { return palyakKeszek(p, ["bontas-felmondas"]); } },
  { id: "tizes-barat", csalad: "A", nev: "Tízes barát", felt: "A 2. és 3. pálya kész", szin: "#a7d99a",
    teljesul: function (p) { return palyakKeszek(p, ["oszkiv-10", "oszkiv-20"]); } },
  { id: "szazas-felfedezo", csalad: "A", nev: "Százas felfedező", felt: "A 4–6. pálya kész", szin: "#9ec9f0",
    teljesul: function (p) { return palyakKeszek(p, ["tizesek", "aprok", "lepegeto"]); } },
  { id: "atlepo-bajnok", csalad: "A", nev: "Átlépő bajnok", felt: "A 7. és 9. pálya kész", szin: "#c9a8e6",
    teljesul: function (p) { return palyakKeszek(p, ["atlepo", "erdo-szive"]); } },
  { id: "szorzo-vandor", csalad: "A", nev: "Szorzó-vándor", felt: "A Szorzós liget összes pályája kész", szin: "#7fd0c4",
    teljesul: function (p) { var l = PALYAK.filter(function (x) { return x.regio === "szorzo"; }); return l.length > 0 && l.every(function (x) { return p.palyak[x.id] && p.palyak[x.id].kesz; }); } },
  { id: "erdo-ura", csalad: "A", nev: "Az erdő ura", felt: "Az Összeadó liget mind a 9 pályája kész", szin: "#ffd24d",
    teljesul: function (p) { return PALYAK.every(function (x) { return (x.regio || "osszeado") !== "osszeado" || (p.palyak[x.id] && p.palyak[x.id].kesz); }); } },
  { id: "ejfeli-kapu", csalad: "A", titkos: true, nev: "Éjféli kapu", felt: "Fedezd fel a rejtett kaput", szin: "#b39ddb",
    teljesul: function (p) { return !!(p.kapu && p.kapu.nyitvaEddig > 0); } },
  /* B · Mesteri tudás */
  { id: "hibatlan-allomas", csalad: "B", nev: "Hibátlan állomás", felt: "Egy állomás minden feladata elsőre jó", szin: "#ffe08a",
    teljesul: function (p) { return jsz(p, "hibatlanAllomas") >= 1; } },
  { id: "bontas-mester", csalad: "B", nev: "Bontás-mester", felt: "10 hibátlan felmondás", szin: "#f4a6c8",
    teljesul: function (p) { return jsz(p, "felmondasOk") >= 10; } },
  { id: "fejszamolo", csalad: "B", nev: "Fejszámoló", felt: "20 feladat csak beszéddel megoldva", szin: "#9ec9f0",
    teljesul: function (p) { return jsz(p, "beszedFeladat") >= 20; } },
  { id: "kitarto", csalad: "B", nev: "Kitartó", felt: "5 elsőre jó válasz egymás után", szin: "#f7c59f",
    teljesul: function (p) { return (p.streakRekord || 0) >= 5; } },
  /* C · Kitartás */
  { id: "nem-adom-fel", csalad: "C", nev: "Nem adom fel", felt: "Oldj meg egy feladatot 3+ próbálkozás után", szin: "#ffb3a7",
    teljesul: function (p) { return jsz(p, "kuzdottGyozelem") >= 1; } },
  { id: "visszatero", csalad: "C", nev: "Visszatérő", felt: "Játssz 3 különböző napon", szin: "#c3b0e0",
    teljesul: function (p) { return Object.keys(p.napok || {}).length >= 3; } },
  { id: "kerulo-felfedezo", csalad: "C", nev: "Kerülő-felfedező", felt: "5 talált tárgy a kerülőn", szin: "#a7d99a",
    teljesul: function (p) { return jsz(p, "keruloTargy") >= 5; } },
  /* D · Gyűjtő / berendező */
  { id: "elso-vasarlas", csalad: "D", nev: "Első vásárlás", felt: "Vegyél valamit a boltban", szin: "#ffd24d",
    teljesul: function (p) { return jsz(p, "vettMar") >= 1; } },
  { id: "gyujto", csalad: "D", nev: "Gyűjtő", felt: "10 különböző holmi megvan", szin: "#fce49a",
    teljesul: function (p) { return Object.keys(p.oltozet.van || {}).length >= 10; } },
  { id: "otthonteremto", csalad: "D", nev: "Otthonteremtő", felt: "10 dísz az odúban", szin: "#f6a5c0",
    teljesul: function (p) { var d = p.odu.disz || {}, n = 0, k; for (k in d) if (d[k]) n++; n += Object.keys(p.odu.vitrin || {}).length; return n >= 10; } }
];
function jelvenyEllenoriz() {
  var p = P(), ujak = [];
  JELVENYEK.forEach(function (j) {
    if (!p.jelvenyek[j.id] && j.teljesul(p)) { p.jelvenyek[j.id] = 1; ujak.push(j); }
  });
  if (ujak.length) {
    ment();
    ujak.forEach(function (j, i) { setTimeout(function () { jelvenyUnnepel(j); }, 400 + i * 1700); });
  }
  return ujak;
}
function jelvenyUnnepel(j) {
  hangCsilla();
  bagolyMondat("🏅 Új jelvény: " + j.nev + "!");
}
function jelvenyMedalSVG(j, van, rejt) {
  var szin = van ? j.szin : "#c9bfe0";
  var kozep = rejt
    ? '<text x="30" y="33" font-size="21" font-weight="800" fill="#9a86c0" text-anchor="middle">?</text>'
    : csillagSVG(30, 26, 9, van ? "#fff6d8" : "#efeaf6");
  return '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M22 40 L14 58 L24 52 L30 60 L36 52 L46 58 L38 40 Z" fill="' + (van ? "#f6a5c0" : "#d8cfe8") + '"/>' +
    '<circle cx="30" cy="26" r="20" fill="' + (rejt ? "#d8cfe8" : szin) + '" stroke="#6a4a8a" stroke-width="2.5"/>' +
    '<circle cx="30" cy="26" r="14" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.7"/>' +
    kozep +
    '</svg>';
}
function renderJelveny() {
  $("odu-lap-cim").textContent = "🏅 Jelvények";
  var host = $("odu-lap-tartalom"); host.innerHTML = "";
  var p = P();
  var megvan = JELVENYEK.filter(function (j) { return p.jelvenyek[j.id]; }).length;
  host.appendChild(el("div", "jelveny-osszeg", megvan + " / " + JELVENYEK.length + " jelvény megvan"));
  ["A", "B", "C", "D"].forEach(function (cs) {
    var lista = JELVENYEK.filter(function (j) { return j.csalad === cs; });
    if (!lista.length) return;
    host.appendChild(el("div", "jelveny-csalad-fej", JELV_CSALAD[cs] || ""));
    var racs = el("div", "jelveny-racs");
    lista.forEach(function (j) {
      var van = !!p.jelvenyek[j.id];
      var rejt = j.titkos && !van;                 /* titkos jelvény zárva: rejtve marad */
      var k = el("div", "jelveny-kartya" + (van ? " van" : " zar"));
      k.innerHTML = '<div class="med">' + jelvenyMedalSVG(j, van, rejt) + '</div>' +
        '<div class="jnev">' + kiiras(rejt ? "Titkos jelvény" : j.nev) + '</div>' +
        '<div class="jfelt">' + (van ? "✓ megvan" : kiiras(rejt ? "rejtett feltétel" : j.felt)) + '</div>';
      racs.appendChild(k);
    });
    host.appendChild(racs);
  });
}

/* — talált tárgy: helyes válaszért / felmondásért / kerülőn eshet egy holmi is — */
function dropProbal(esely) {
  var p = P();
  var kell = (p.dropUres >= 12);                        /* pity: 12 „csak ✨" után garantált tárgy */
  if (!kell && Math.random() >= esely) { p.dropUres++; ment(); return null; }
  var lehet = [];
  RUHA_HELY.forEach(function (h) {
    (RUHAK[h.kulcs] || []).forEach(function (t, rang) {
      if (!p.oltozet.van[t.id]) { var suly = [3, 2, 1][rang] || 1; for (var s = 0; s < suly; s++) lehet.push({ t: t, rang: rang, kulcs: h.kulcs }); }
    });
  });
  if (!lehet.length) { p.csillampor += 5; p.dropUres = 0; ment(); return { vigasz: true }; }
  var vald = lehet[veletlen(0, lehet.length - 1)];
  p.oltozet.van[vald.t.id] = 1;
  p.dropUres = 0; ment();
  return { talalt: vald.t, rang: vald.rang, kulcs: vald.kulcs };   /* rang: 0 alap · 1 különleges · 2 ritka */
}

/* ══════════════════════════════════════════════════════════════════════════
   TALÁLT-TÁRGY ÜNNEPI PILLANAT  (rajz-spec: Matekos/spec-targy-talalas-atadas.html)
   Producer-döntés (2026-09-13): gyakori (alap/különleges) → halk, nem modális
   toast + felszikrázó tárgy; RITKA (rang 2) → nagy, elugorható kártya arany
   kerettel + „RITKA" szalaggal + erősebb hanggal. Torlódás-védelem: sor (queue),
   egyszerre csak EGY pillanat. Additív: saját DOM (#talalat-defs, #talalat-reteg)
   + saját CSS (.talalat-* / .tk-* / .tp-*), a meglévő #talalt-buborek a toast.
   ══════════════════════════════════════════════════════════════════════════ */
var TALALAT_DEFS =
  '<svg id="talalat-defs" width="0" height="0" aria-hidden="true" style="position:absolute">' +
  '<defs>' +
    '<filter id="tk-ragyog" x="-120%" y="-120%" width="340%" height="340%"><feGaussianBlur stdDeviation="2.3"/></filter>' +
  '</defs></svg>';

function talalatDefsBiztos() {
  if (!$("talalat-defs")) document.body.insertAdjacentHTML("beforeend", TALALAT_DEFS);
  if (!$("talalat-reteg")) {
    var jt = document.querySelector(".jatekter"); if (!jt) return;
    var r = el("div", "talalat-reteg"); r.id = "talalat-reteg"; r.hidden = true;
    r.addEventListener("pointerdown", function () { if (talalatKartya._zar) talalatKartya._zar(); });
    jt.appendChild(r);
  }
}

/* egy szikra SVG-je 0,0 körül (a csillagszilánk-nyelvből) */
function talalatSzikra(arany) {
  if (arany) return '<circle r="9" fill="#ffd24d" opacity="0.55" filter="url(#tk-ragyog)"/>' +
    '<path d="M0 -8 L2.2 -2.2 L8 0 L2.2 2.2 L0 8 L-2.2 2.2 L-8 0 L-2.2 -2.2 Z" fill="#ffe07a" stroke="#f2b026" stroke-width="0.7" stroke-linejoin="round"/>' +
    '<path d="M0 -4 L1 -1 L4 0 L1 1 L0 4 L-1 1 L-4 0 L-1 -1 Z" fill="#fff6d8"/><circle r="1.4" fill="#fff"/>';
  return '<circle r="6" fill="#cfe0f2" opacity="0.28" filter="url(#tk-ragyog)"/>' +
    '<path d="M0 -6.5 L1.7 -1.7 L6.5 0 L1.7 1.7 L0 6.5 L-1.7 1.7 L-6.5 0 L-1.7 -1.7 Z" fill="#d9e6f4" stroke="#a9bdd6" stroke-width="0.6" stroke-linejoin="round"/><circle r="1.1" fill="#fff"/>';
}

/* szikra-kitörés: db szikra a közép körüli ellipszisen, késleltetve pislognak */
function talalatSzikraReteg(w, h, db, arany) {
  var cx = w / 2, cy = h / 2, s = '<svg class="talalat-szikrak" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="xMidYMid meet">';
  for (var i = 0; i < db; i++) {
    var ang = (i / db) * Math.PI * 2 + (i % 2 ? 0.5 : 0);
    var x = cx + Math.cos(ang) * (w * 0.40) * (0.75 + Math.random() * 0.25);
    var y = cy + Math.sin(ang) * (h * 0.40) * (0.75 + Math.random() * 0.25);
    var sk = (0.6 + Math.random() * 0.7).toFixed(2);
    s += '<g class="tk-szikra" style="animation-delay:' + (i * 60) + 'ms" transform="translate(' + x.toFixed(0) + ',' + y.toFixed(0) + ')">' +
      '<g transform="scale(' + sk + ')">' + talalatSzikra(arany) + '</g></g>';
  }
  return s + '</svg>';
}

/* erősebb csengés a ritka találáshoz */
function hangCsillaNagy() {
  beep(1319, 0.10, "triangle", 0, 0.16);
  beep(1760, 0.10, "triangle", 0.09, 0.15);
  beep(2093, 0.12, "triangle", 0.18, 0.14);
  beep(2637, 0.16, "triangle", 0.28, 0.12);
}

/* RITKA: nagy, elugorható kártya (modális fátyollal) */
function talalatKartya(m, kesz) {
  talalatDefsBiztos();
  var reteg = $("talalat-reteg"); if (!reteg) { if (kesz) kesz(); return; }
  var kep = boltThumb({ fajta: "ruha", kulcs: m.kulcs }, m.t);
  reteg.innerHTML =
    '<div class="talalat-fatyol"></div>' +
    talalatSzikraReteg(300, 300, 9, true) +
    '<div class="talalat-kartya ritka">' +
      '<div class="tk-szalag">✦ RITKA</div>' +
      '<div class="tk-fejlec">✨ Találtál egy díszt!</div>' +
      '<div class="tk-kep"><span class="tk-glow"></span>' + kep + '</div>' +
      '<div class="tk-nev">' + kiiras(m.nev) + '</div>' +
      '<div class="tk-sor">Új dísz az odúba! 🔊</div>' +
    '</div>';
  reteg.hidden = false;
  reteg.classList.remove("zaro"); void reteg.offsetWidth; reteg.classList.add("mutat");
  hangCsillaNagy(); mondd(m.nev);
  var zarva = false, t1;
  function zar() {
    if (zarva) return; zarva = true; talalatKartya._zar = null; clearTimeout(t1);
    reteg.classList.remove("mutat"); reteg.classList.add("zaro");
    setTimeout(function () { reteg.hidden = true; reteg.classList.remove("zaro"); reteg.innerHTML = ""; if (kesz) kesz(); }, 260);
  }
  talalatKartya._zar = zar;
  t1 = setTimeout(zar, 1900);
}

/* GYAKORI: halk toast (fenti csík) + felszikrázó, felröppenő tárgy — nem modális */
function talalatToast(m, kesz) {
  talalatDefsBiztos();
  var jt = document.querySelector(".jatekter");
  var kep = boltThumb({ fajta: "ruha", kulcs: m.kulcs }, m.t);
  if (jt) {
    var pukk = el("div", "talalat-pukk");
    pukk.innerHTML = talalatSzikraReteg(160, 160, m.kozepes ? 6 : 4, true) + '<div class="tp-kep">' + kep + '</div>';
    jt.appendChild(pukk);
    requestAnimationFrame(function () { pukk.classList.add("repul"); });
    setTimeout(function () { pukk.remove(); }, 780);
  }
  var e = $("talalt-buborek");
  if (e) {
    e.innerHTML = '<span class="tb-kep">' + kep + '</span><span class="tb-txt">✨ Új holmi: <b>' + kiiras(m.nev) + '</b></span>';
    e.hidden = false;
    clearTimeout(talalatToast._t);
    talalatToast._t = setTimeout(function () { e.hidden = true; e.innerHTML = ""; }, 2400);
  }
  hangCsilla(); mondd(m.nev);
  setTimeout(function () { if (kesz) kesz(); }, 700);
}

/* sor: egyszerre csak egy pillanat (torlódás-védelem, ~15% drop miatt fontos) */
var talalatSor = [], talalatFut = false;
function talalatKovetkezo() {
  if (!talalatSor.length) { talalatFut = false; return; }
  talalatFut = true;
  var m = talalatSor.shift();
  (m.ritka ? talalatKartya : talalatToast)(m, function () { setTimeout(talalatKovetkezo, 180); });
}
function dropUnnepel(res) {
  if (!res) return;
  if (res.vigasz) { hangCsilla(); bagolyMondat("Minden holmid megvan! +5 ✨"); return; }
  if (!res.talalt) return;
  var rang = (typeof res.rang === "number") ? res.rang : 0;
  talalatSor.push({
    t: res.talalt, nev: res.talalt.nev,
    kulcs: res.kulcs || (res.talalt.id || "").split("-")[0],
    ritka: rang >= 2, kozepes: rang === 1
  });
  if (!talalatFut) talalatKovetkezo();
}

/* — gyűjtemény-könyv: minden bolti tétel, megvan / hiányzik — */
function gyujtBirt(cs, t) {
  if (cs.fajta === "ruha") return !!P().oltozet.van[t.id];
  return !!(P().odu.van[cs.kulcs] && P().odu.van[cs.kulcs][t.id]);
}
function renderGyujtemeny() {
  $("odu-lap-cim").textContent = "📖 Gyűjtemény";
  var host = $("odu-lap-tartalom"); host.innerHTML = "";
  var szakaszok = [
    { cim: "👗 Holmik", csoportok: RUHA_HELY.map(function (h) {
        return { fajta: "ruha", kulcs: h.kulcs, nev: h.nev, tetelek: RUHAK[h.kulcs] || [] }; }) },
    { cim: "🌦 Időjárás", csoportok: [
        { fajta: "ido", kulcs: "napszak", nev: "Napszak", tetelek: ODU_KAT.napszak },
        { fajta: "ido", kulcs: "ido", nev: "Időjárás", tetelek: ODU_KAT.ido }
      ] }
  ];
  var ossz = 0, van = 0;
  szakaszok.forEach(function (sz) { sz.csoportok.forEach(function (cs) { cs.tetelek.forEach(function (t) { ossz++; if (gyujtBirt(cs, t)) van++; }); }); });
  host.appendChild(el("div", "jelveny-osszeg", van + " / " + ossz + " tétel megvan"));
  szakaszok.forEach(function (sz) {
    var blk = el("div", "gyujt-szakasz");
    blk.appendChild(el("div", "gyujt-szakasz-cim", sz.cim));
    var racs = el("div", "gyujt-racs");
    sz.csoportok.forEach(function (cs) {
      cs.tetelek.forEach(function (t) {
        var aktiv = boltAktiv(cs, t);
        var birt = gyujtBirt(cs, t) || aktiv;        /* az aktív alap-tétel is birtokolt */
        var allap = aktiv ? (cs.fajta === "ruha" ? "✓ rajta" : "✓ kint")
          : birt ? (cs.fajta === "ruha" ? "koppints: felveszed" : "koppints: kirakod")
          : (t.ar ? ("✨" + t.ar) : "alap");
        var k = el("div", "gyujt-kartya " + (birt ? "van" : "nincs") + (aktiv ? " rajta" : "") + (birt ? " kattint" : ""));
        k.innerHTML = '<div class="gkep">' + boltThumb(cs, t) + '</div>' +
          '<div class="gnev">' + kiiras(t.nev) + '</div>' +
          '<div class="gallap">' + allap + '</div>';
        if (birt) k.addEventListener("click", function () {
          if (cs.fajta === "ruha") {
            if (aktiv) { oduRuhaVisel(cs.kulcs, null); mondd("Levéve"); }
            else { oduRuhaVisel(cs.kulcs, t.id); mondd("Felvéve"); }
          } else if (!aktiv) { oduBeallit(cs.kulcs, t.id); mondd("Kirakva"); }
          else { hangGomb(); }
          renderGyujtemeny();
        });
        racs.appendChild(k);
      });
    });
    blk.appendChild(racs);
    host.appendChild(blk);
  });
}

