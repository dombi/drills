/* ============ 6j3) 🛖 PÁLYA-HELY — a pálya egy hely a liget képében, nem téglalap kártya (Pálya-hely A kör, 2026-10-24) ============
   Terv: terv/palyahely-targykeret-terv.html (✅ jóváhagyva) · rajz: terv/palyahely-rajzterv.html (✅ jóváhagyva, mind a 7 „A” javaslat).
   KÉT RÉSZ:
     palyaJelek(pa) — EGY helyen számolja ki egy pálya jeleit (állapot ⭐🌟🔒💤🌙🔜, 💧 napi, 💖 ajánlott, 🐉 sárkány, 🏦 bank,
                      újonc-fény, ≈ ✨). Ezt használja a régi kártya (ui.js keszitKartya), a pálya-hely és a Piactér (piac.js) is.
     a hely-készlet  — phBurok (cégér + jelek + fény + köd + koppintható keret) körül a hely saját rajza (most: 🛖 bódé).
   EGY LIGET ÁTÁLLÍTÁSA = EGY SOR a LIGET_HELY táblában (+ ha kell, a hely-fajta rajza). Amelyik ligetnek nincs sora, a régi
   kártyát kapja (biztonsági háló). A pályák, a mentés, a csillagok és a pult beállításai nem változnak.
   A cégér a hely tetején áll két lábon (A); a sorszám nincs (a producer: nem kell); a „100-ig · ×, :” felirat nincs a helyen
   (a csengő felolvassa). Egy koppintás: az unikornis odasétál, és indul (közben még egy koppintás = azonnal indul). */

var LIGET_HELY = { vasar: "bode" };   /* hullámok: ① Tündérvásár sátra → ② épülő utca (ház) → ③ erdő (gombaház) → ④ mérés (munkaasztal) → ⑤ Dallam-tér (pavilon) */

/* ── a jelek: egy pálya minden jele, egyszer kiszámolva ── */
function palyaJelek(pa) {
  var pr = P().palyak[pa.id] || {}, zarva = palyaZarva(pa), alszik = zarva && nyitasPalyaAlszik(pa);
  var elfogyott = !zarva && palyaElfogyott(pa), napi = pa.id === napiKiemeltId(), napiKesz = napiKiemeltTeljesitve();
  return {
    all: alszik ? "alszik" : zarva ? "zarva" : elfogyott ? "elfogyott" : pr.arany ? "arany" : pr.kesz ? "kesz" : pa.hamarosan ? "hamarosan" : "",
    kesz: !!pr.kesz, arany: !!pr.arany, zarva: zarva, alszik: alszik, elfogyott: elfogyott,
    napi: napi, napiKesz: napiKesz, napiAktiv: napi && !napiKesz,   /* napiAktiv: ma még jár érte a 💧 */
    ajanlott: !pa.hamarosan && palyaAjanlott(pa),
    sarkany: !pa.hamarosan && kuldKertPalya(pa.id),
    bank: !pa.hamarosan && nyitasEbren("bank") && bankPalyaNyit(pa.id),
    vil: !zarva && nyitasPalyaVilagit(pa),
    ertek: pa.hamarosan ? 0 : palyaBecsultErtek(pa)
  };
}
/* a 💧 napi jel (újoncnál a harmat még rejtett: ⭐) — a kártya, a hely és a Piactér ugyanezt mutatja */
function palyaNapiJel() { return nyitasHarmatRejtett() ? "⭐" : "💧"; }
/* a 🔊 felolvasás mondata (a kártya gombja és a hely csengője ugyanezt mondja) */
function palyaFelolvasMondat(pa, J) {
  var mondat = kiiras(pa.nev) + ". " + (PALYA_MAT[pa.id] || pa.palcim) + ". Az egész pálya körülbelül " + J.ertek + " csillámpor." +
    " Ha egy állomást sem hagysz ki, arany csillagszilánk jár és dupla záró-jutalom.";
  var rejt = nyitasHarmatRejtett();   /* 💧 újonc: a harmatot még nem emlegetjük */
  if (J.ajanlott) mondat += " Ezt most neked ajánlom!" + (rejt ? "" : " Plusz " + AJANLOTT_HARMAT + " tündérharmat jár érte.");
  if (pa.teny) mondat += " Ezt az ösvényt a tündérek mindig a te feladataidból rakják össze, minden alkalommal újat!";
  else if (pa.egyeni) mondat += " Ezt az ösvényt csak neked készítették!";
  if (J.bank) mondat += " Ha végigviszed, a Tündérbankban válthatsz!";
  if (J.napiAktiv) mondat += " Ez a mai kiemelt pálya!" + (rejt ? "" : " Plusz " + NAPI_KIEMELT_HARMAT + " tündérharmat jár érte.");
  if (kuldKertPalya(pa.id)) mondat += " Ezt kéri a kis sárkány!";
  return mondat;
}
/* koppintás egy zárt / alvó / pihenő / épülő pályára: mit mond (null = indulhat) */
function palyaNemIndulMondat(pa, J) {
  if (pa.hamarosan) return "Ez az ösvény hamarosan nyílik meg!";
  if (J.zarva) return J.alszik ? NYITAS_MONDAT.palyaAlszik : pa.konyvtar ? ekLakatMondat(pa) : zarvaMondat();
  if (J.elfogyott) return elfogyottMondat();
  return null;
}

/* ═════════ a rajz-készlet (a rajzterv prototípusából, a térkép rajzkészletével: hullámos szél, pasztell) ═════════ */
var PH_FR = 'font-family="Fredoka,sans-serif" font-weight="600"';
/* kézzel hullámosított, lekerekített lap: x0..x1, y0..y1 (a keret.js is ezt használja majd: tábla, fok, cetli) */
function phLap(x0, y0, x1, y1, r) {
  var F = pcF; r = r || 6; var mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
  return 'M' + F(x0 + r) + ' ' + F(y0) + 'Q' + F(mx) + ' ' + F(y0 - 1.6) + ' ' + F(x1 - r) + ' ' + F(y0 + .4) + 'Q' + F(x1) + ' ' + F(y0) + ' ' + F(x1 + .3) + ' ' + F(y0 + r) +
    'Q' + F(x1 + 1.2) + ' ' + F(my) + ' ' + F(x1) + ' ' + F(y1 - r) + 'Q' + F(x1) + ' ' + F(y1) + ' ' + F(x1 - r) + ' ' + F(y1 + .3) + 'Q' + F(mx) + ' ' + F(y1 + 1.4) + ' ' + F(x0 + r) + ' ' + F(y1) +
    'Q' + F(x0) + ' ' + F(y1) + ' ' + F(x0 - .3) + ' ' + F(y1 - r) + 'Q' + F(x0 - 1) + ' ' + F(my) + ' ' + F(x0) + ' ' + F(y0 + r) + 'Q' + F(x0) + ' ' + F(y0) + ' ' + F(x0 + r) + ' ' + F(y0) + 'Z';
}
function phSorok(nev) {   /* hosszú név két sorban (a középhez legközelebbi szóköznél) */
  if (nev.length <= 15) return [nev];
  var k = Math.floor(nev.length / 2), best = -1;
  for (var i = 0; i < nev.length; i++) if (nev[i] === " " && (best < 0 || Math.abs(i - k) < Math.abs(best - k))) best = i;
  return best < 0 ? [nev] : [nev.slice(0, best), nev.slice(best + 1)];
}
function phCegerMeret(nev) { var s = phSorok(nev), hossz = Math.max.apply(null, s.map(function (x) { return x.length; })); return { s: s, W: Math.max(92, hossz * 9.2 + 30), H: s.length > 1 ? 44 : 27 }; }

/* ── a cégér és ami rajta ül: zászló (⭐/🌟) · jel-táblák (💧 💖 🐉, legfeljebb 2) · ≈ ✨ cetli · 🔑 bank · 🔔 csengő ──
   (cx, cy) = a cégér középpontja; J = palyaJelek(pa); id = a pálya id-je (a csengő erről tudja, kit olvasson fel) */
function phCeger(nev, cx, cy, J, id) {
  var F = pcF, m = phCegerMeret(nev), W = m.W, H = m.H, s = '<g transform="translate(' + F(cx) + ' ' + F(cy) + ')">', cs = lkCsokkent(), hamar = J.all === "hamarosan";
  s += '<g class="ph-leng">';
  if (J.all === "kesz" || J.all === "arany") {   /* zászló a jobb végén; aranyra arany zászló, csillogással */
    var arany = J.all === "arany", zx = W / 2 - 10, zy = -H / 2;
    s += '<path d="M' + F(zx) + ' ' + F(zy) + 'V' + F(zy - 40) + '" stroke="#6e4a36" stroke-width="2.4" stroke-linecap="round"/><circle cx="' + F(zx) + '" cy="' + F(zy - 41) + '" r="2.4" fill="#f5c84a"/>';
    var d1 = 'M' + F(zx) + ' ' + F(zy - 38) + 'Q' + F(zx + 14) + ' ' + F(zy - 42) + ' ' + F(zx + 28) + ' ' + F(zy - 34) + 'Q' + F(zx + 14) + ' ' + F(zy - 26) + ' ' + F(zx) + ' ' + F(zy - 22) + 'Z';
    var d2 = 'M' + F(zx) + ' ' + F(zy - 38) + 'Q' + F(zx + 14) + ' ' + F(zy - 34) + ' ' + F(zx + 28) + ' ' + F(zy - 36) + 'Q' + F(zx + 14) + ' ' + F(zy - 20) + ' ' + F(zx) + ' ' + F(zy - 22) + 'Z';
    s += '<path d="' + d1 + '" fill="' + (arany ? "#ffd24d" : "#f6a5c0") + '" stroke="' + (arany ? "#c9961a" : "#b5607e") + '" stroke-width="1.6" stroke-linejoin="round">' +
      (cs ? '' : '<animate attributeName="d" values="' + d1 + ';' + d2 + ';' + d1 + '" dur="1.5s" repeatCount="indefinite"/>') + '</path>';
    s += '<text x="' + F(zx + 11) + '" y="' + F(zy - 26.5) + '" text-anchor="middle" font-size="10" fill="#fff">★</text>';
    if (arany && !cs) s += ltCsillam(zx + 34, zy - 44, 4, "#e3a92a", "1.4s", 0) + ltCsillam(zx - 8, zy - 50, 3, "#e3a92a", "1.8s", .6);
  }
  var jel = []; if (J.napiAktiv) jel.push(palyaNapiJel()); if (J.ajanlott) jel.push("💖"); if (J.sarkany) jel.push("🐉");
  jel.slice(0, 2).forEach(function (e, i) {   /* a mai fontossági sorrendben, legfeljebb kettő */
    var x = -W / 2 + 15 + i * 25, y = -H / 2 - 11;
    s += '<path d="M' + F(x) + ' ' + F(y + 9) + 'V' + F(-H / 2 + 1) + '" stroke="#8a6a52" stroke-width="1.6"/><circle cx="' + F(x) + '" cy="' + F(y) + '" r="11.5" fill="#fffaf0" stroke="#c9ad85" stroke-width="1.8"/><text x="' + F(x) + '" y="' + F(y + 4.6) + '" text-anchor="middle" font-size="13">' + e + '</text>';
  });
  s += '<g filter="url(#lt-firka)"><path d="' + phLap(-W / 2, -H / 2, W / 2, H / 2, 7) + '" fill="#f6dcb2" stroke="#8a6a52" stroke-width="2.4"/>' +
       '<path d="M' + F(-W / 2 + 6) + ' ' + F(-H / 2 + 5) + 'Q0 ' + F(-H / 2 + 3) + ' ' + F(W / 2 - 6) + ' ' + F(-H / 2 + 5.5) + '" stroke="#fff6e2" stroke-width="2" fill="none" opacity=".8"/></g>';
  m.s.forEach(function (sor, i) { s += '<text y="' + F((m.s.length > 1 ? (i ? 15.5 : -3.5) : 5.4)) + '" text-anchor="middle" font-size="15" ' + PH_FR + ' fill="#6e4a36">' + kiiras(sor) + '</text>'; });
  if (hamar) s += '<g transform="translate(' + F(W / 2 - 16) + ' ' + F(H / 2 + 4) + ') rotate(-6)"><rect x="-22" y="-8" width="44" height="16" rx="3" fill="#fce49a" stroke="#d1a23a" stroke-width="1.4"/><text y="4.2" text-anchor="middle" font-size="10.5" ' + PH_FR + ' fill="#8a5a1a">épül!</text></g>';
  else if (!J.nincsCetli) {   /* nincsCetli: egy még épülő / alvó hely cégérén nincs jutalom-cetli */
    var cetli = J.cetli || "≈" + J.ertek + " ✨", cw = Math.max(46, cetli.length * 6.4 + 12);   /* egy ligetnél (Piactér: Tündérvásár) a cetlin a ⭐ kész/összes */
    s += '<g transform="translate(' + F(W / 2 - 6) + ' ' + F(H / 2 + 5) + ') rotate(6)"><path d="M' + F(-cw / 2) + ' -9L' + F(cw / 2) + ' -9L' + F(cw / 2 - 1) + ' 9L' + F(-cw / 2 + 1) + ' 10Z" fill="#fffdf6" stroke="#c9ad85" stroke-width="1.3"/><circle cx="0" cy="-8" r="2" fill="#e0417a"/>' +
         '<text y="5" text-anchor="middle" font-size="11" ' + PH_FR + ' fill="#8a6a1e">' + kiiras(cetli) + '</text></g>';
  }
  if (!hamar && id) {   /* a csengő a pálya mondatát olvassa fel (egy liget cégérén nincs: id = null) */
    s += '<g class="ph-csengo" data-id="' + kiiras(id) + '" transform="translate(' + F(-W / 2 - 13) + ' -2)"><circle cx="-6" r="30" fill="transparent"/><g class="ph-csengo-test" transform="scale(1.2)">' +
         '<path d="M0 -12V-8" stroke="#8a6a52" stroke-width="1.6"/><path d="M-7 4Q-8 -8 0 -8Q8 -8 7 4L9 6H-9Z" fill="#ffd24d" stroke="#a8741c" stroke-width="1.5" stroke-linejoin="round"/><circle cy="8" r="2.4" fill="#a8741c"/>' +
         '<path d="M-3 -4Q-4 0 -4 3" stroke="#fff6c8" stroke-width="1.4" fill="none" stroke-linecap="round"/></g></g>';
  }
  if (J.bank && !hamar) {   /* 🏦 aranykulcs lóg a bal alsó sarkáról */
    var kx = -W / 2 + 22, ky = H / 2;
    s += '<path d="M' + F(kx) + ' ' + F(ky) + 'V' + F(ky + 9) + '" stroke="#8a6a52" stroke-width="1.2"/><g transform="translate(' + F(kx) + ' ' + F(ky + 14) + ') rotate(80)"><circle r="5" fill="#fff6c8" stroke="#e3a92a" stroke-width="2.6"/><path d="M5 0H17M13 0V5M16 0V4" stroke="#e3a92a" stroke-width="2.6" stroke-linecap="round"/></g>';
  }
  return s + '</g></g>';
}
/* a cégér két lába: a hely rajza MÖGÉ kerül, és a tetőbe fut (felso = a tető legfelső pontja) */
function phCegerLab(nev, felso) {
  var m = phCegerMeret(nev), cy = felso - 20 - m.H / 2;
  return '<path d="M' + pcF(-m.W * .3) + ' ' + pcF(felso + 46) + 'V' + pcF(cy) + 'M' + pcF(m.W * .3) + ' ' + pcF(felso + 46) + 'V' + pcF(cy) + '" stroke="#8a6a52" stroke-width="3" stroke-linecap="round"/>';
}
function phLakat(x, y) {   /* 🔒 zárva */
  return '<g transform="translate(' + pcF(x) + ' ' + pcF(y) + ')"><path d="M-6 -2V-8Q-6 -15 0 -15Q6 -15 6 -8V-2" fill="none" stroke="#8a7a6e" stroke-width="3"/>' +
    '<path d="' + phLap(-10, -3, 10, 13, 3) + '" fill="#f5c84a" stroke="#a8741c" stroke-width="1.8"/><circle cy="3.5" r="2.2" fill="#6e4a36"/><path d="M0 4.5V8.5" stroke="#6e4a36" stroke-width="1.8"/></g>';
}
function phHold(x, y, k) {   /* 🌙 mára elég: nem tilos, csak pihen */
  return '<g transform="translate(' + pcF(x) + ' ' + pcF(y) + ') scale(' + (k || 1) + ')"><circle cx="1" r="17" fill="#8d86c4" stroke="#5f5a96" stroke-width="1.6"/><path d="M4 -11A11 11 0 1 0 4 11A8.5 8.5 0 1 1 4 -11Z" fill="#fce49a" stroke="#d1a23a" stroke-width="1.4"/>' +
    '<text x="12" y="-6" font-size="7" fill="#d1a23a">✦</text><text x="10" y="10" font-size="5" fill="#d1a23a">✦</text></g>';
}
function phKod(m) {   /* 💤 alvó (újonc) hely: köd úszik előtte */
  var cs = lkCsokkent();
  return '<g pointer-events="none">' + [[-20, -m * .25, m * .7, m * .2, 0], [22, -m * .6, m * .6, m * .18, 2]].map(function (k) {
    return '<ellipse cx="' + pcF(k[0]) + '" cy="' + pcF(k[1]) + '" rx="' + pcF(k[2]) + '" ry="' + pcF(k[3]) + '" fill="url(#lt-gNyKod)">' + (cs ? '' : '<animateTransform attributeName="transform" type="translate" values="0 0;' + (8 + k[4] * 2) + ' 0;0 0" dur="' + (9 + k[4] * 3) + 's" repeatCount="indefinite"/>') + '</ellipse>';
  }).join("") + '</g>';
}
function phHalo(m) {   /* ✨ újonc-fény: ide hív az unikornis */
  return '<ellipse cx="0" cy="' + pcF(-m * .55) + '" rx="' + pcF(m * .95) + '" ry="' + pcF(m * .85) + '" fill="url(#lt-gNyHalo)" pointer-events="none">' + (lkCsokkent() ? '' : ltAnim("opacity", ".55;1;.55", "2.4s")) + '</ellipse>';
}
/* a hely közös burka (minden hely-fajta ezt kapja): fény, alvás + köd, koppintható keret, cégér a tetőn
   rajz = { svg, felso, bal, jobb, magas } a hely saját rajza (talppont 0,0); k = { x, y, k } a helye a képen */
function phBurok(id, nev, J, rajz, k) {
  var alszik = J.all === "alszik", m = rajz.magas, cm = phCegerMeret(nev);
  var felsoKeret = rajz.felso - 20 - cm.H - (J.all === "kesz" || J.all === "arany" ? 48 : 30);
  var balKeret = Math.min(rajz.bal, -cm.W / 2 - 30), jobbKeret = Math.max(rajz.jobb, cm.W / 2 + 14);
  var s = '<g class="ph-hely' + (J.all === "hamarosan" ? ' ph-hamar' : '') + '" data-id="' + kiiras(id) + '" transform="translate(' + pcF(k.x) + ' ' + pcF(k.y) + ') scale(' + (k.k || 1) + ')"><g class="pc-rezeg">';
  s += '<rect class="ph-kopp" x="' + pcF(balKeret) + '" y="' + pcF(felsoKeret) + '" width="' + pcF(jobbKeret - balKeret) + '" height="' + pcF(14 - felsoKeret) + '" rx="10" fill="transparent"/>';
  if (J.vil && !alszik && J.all !== "hamarosan") s += phHalo(m);
  s += '<g' + (alszik ? ' filter="url(#pc-alszik)" opacity=".72"' : '') + '>' + phCegerLab(nev, rajz.felso) + rajz.svg + phCeger(nev, 0, rajz.felso - 20 - cm.H / 2, J, id) + '</g>';
  if (alszik) s += phKod(m);
  return s + '</g></g>';
}

/* ── 🛖 bódé ── sz = VS_SZIN-sor (teto, csik, sotet); aru = 'kosar' | 'doboz' | PALYA_IKON-id | emoji */
function phAru(aru) {
  if (aru === "kosar") return '<g filter="url(#lt-firka)"><path d="M-30 -2Q-31 -20 -28 -22H28Q31 -20 30 -2Q0 3 -30 -2Z" fill="#d9a066" stroke="#8a5a3a" stroke-width="1.8"/>' +
    '<path d="M-26 -14Q0 -11 26 -14M-27 -7Q0 -4 27 -7M-14 -21V0M0 -21V1M14 -21V0" stroke="#b5804a" stroke-width="1.2" fill="none"/>' +
    '<path d="M-24 -22Q0 -48 24 -22" fill="none" stroke="#8a5a3a" stroke-width="2.6"/></g>' +
    '<ellipse cx="-12" cy="-26" rx="6" ry="7.5" fill="#fffaf0" stroke="#c9ad85" stroke-width="1.2"/><ellipse cx="0" cy="-28" rx="6" ry="7.5" fill="#fdf0d0" stroke="#c9ad85" stroke-width="1.2"/>' +
    '<circle cx="12" cy="-26" r="6.5" fill="#e8505b" stroke="#a83a44" stroke-width="1.2"/><path d="M12 -32Q14 -36 17 -36" stroke="#5f8e6a" stroke-width="1.4" fill="none"/>' +
    '<g transform="translate(44 -6)" filter="url(#lt-firka)"><circle r="7" fill="#a7d99a" stroke="#5f8e6a" stroke-width="1.2"/><circle cx="11" cy="1" r="6" fill="#fce49a" stroke="#d1a23a" stroke-width="1.2"/></g>';
  if (aru === "doboz") return '<g filter="url(#lt-firka)">' +
    '<path d="' + phLap(-34, -24, -6, 0, 2) + '" fill="#f7c59f" stroke="#a5623a" stroke-width="1.6"/><path d="' + phLap(-2, -24, 26, 0, 2) + '" fill="#f7c59f" stroke="#a5623a" stroke-width="1.6"/>' +
    '<path d="' + phLap(-18, -46, 10, -24, 2) + '" fill="#f9d6b6" stroke="#a5623a" stroke-width="1.6"/></g>' +
    '<path d="M-20 -24V0M12 -24V0M-4 -46V-24M-34 -12H-6M-2 -12H26M-18 -35H10" stroke="#e0417a" stroke-width="2" opacity=".75"/>' +
    '<path d="M-4 -46q-7 -7 -1 -9q3 2 1 9q3 -7 8 -6q1 4 -8 6" fill="#f6a5c0" stroke="#b5607e" stroke-width="1.2"/>' +
    '<g transform="translate(42 0)"><circle cx="-2" cy="-5" r="4.5" fill="#c9a8e6" stroke="#7a5ea8" stroke-width="1.1"/><circle cx="6" cy="-4" r="4.5" fill="#9ec9f0" stroke="#4f86b8" stroke-width="1.1"/><circle cx="2" cy="-11" r="4.5" fill="#fce49a" stroke="#d1a23a" stroke-width="1.1"/></g>';
  if (PALYA_IKON[aru]) return '<g transform="translate(-27 -54) scale(.9)">' + PALYA_IKON[aru] + '</g>';
  return '<text y="-6" text-anchor="middle" font-size="38">' + aru + '</text>';
}
function phPonyva(sz, x0, x1, y0, y1, mely) {   /* leeresztett, csíkos ponyva (zárva / mára elég) */
  var F = pcF, n = 8, w = (x1 - x0) / n, d = 'M' + F(x0) + ' ' + F(y0) + 'H' + F(x1) + 'V' + F(y1), s = '', i;
  for (i = n; i > 0; i--) d += 'Q' + F(x0 + (i - .5) * w) + ' ' + F(y1 + mely) + ' ' + F(x0 + (i - 1) * w) + ' ' + F(y1);
  s += '<path d="' + d + 'Z" fill="' + sz.teto + '" stroke="' + sz.sotet + '" stroke-width="1.6" stroke-linejoin="round"/>';
  for (i = 0; i < n; i += 2) s += '<path d="M' + F(x0 + i * w + 1) + ' ' + F(y0 + 1) + 'H' + F(x0 + (i + 1) * w - 1) + 'V' + F(y1 + mely * .5) + 'H' + F(x0 + i * w + 1) + 'Z" fill="' + sz.csik + '" opacity=".7"/>';
  return s;
}
function phBode(sz, aru, J) {
  var F = pcF, all = J.all, s = '', i, lehuzva = all === "zarva" || all === "elfogyott";
  s += '<ellipse cx="0" cy="3" rx="88" ry="10" fill="#3c2a50" opacity=".14"/>';
  if (all === "hamarosan") {   /* csak a váz: oszlopok, tetőgerendák, deszkák a földön */
    s += '<g filter="url(#lt-firka)"><path d="M-62 2V-96M60 2V-96" stroke="#b08a5a" stroke-width="6" stroke-linecap="round"/>' +
         '<path d="M-78 -96L0 -138L78 -96M-70 -96H70" fill="none" stroke="#b08a68" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>' +
         '<path d="M-30 -2H40M-24 -9H44" stroke="#e3c29a" stroke-width="6" stroke-linecap="round"/></g>' +
         '<g transform="translate(-40 -2)"><rect x="-10" y="-8" width="9" height="6" rx="1" fill="#e8a77a" stroke="#a5623a" stroke-width="1"/><rect x="0" y="-8" width="9" height="6" rx="1" fill="#e8a77a" stroke="#a5623a" stroke-width="1"/></g>';
    return { svg: s, felso: -138, bal: -80, jobb: 80, magas: 140 };
  }
  s += '<g filter="url(#lt-firka)">';
  s += '<path d="' + phLap(-60, -94, 58, -40, 3) + '" fill="#fff4e6" stroke="' + sz.sotet + '" stroke-width="1" stroke-opacity=".3"/>';   /* a bódé belseje */
  s += '<path d="M-64 2Q-63 -48 -63 -98M60 2Q61 -48 60 -98" stroke="#b08a5a" stroke-width="6" stroke-linecap="round"/>';
  var db = 8, cw = 160 / db;   /* csíkos, csúcsos tető, csipkés fodorral */
  s += '<path d="M-80 -96Q-40 -114 0 -138Q40 -114 80 -96Z" fill="' + sz.teto + '" stroke="' + sz.sotet + '" stroke-width="2" stroke-linejoin="round"/>';
  for (i = 1; i < db; i += 2) s += '<path d="M0 -136L' + F(-80 + i * cw) + ' -96L' + F(-80 + (i + 1) * cw) + ' -96Z" fill="' + sz.csik + '" opacity=".72"/>';
  for (i = 0; i < db; i++) s += '<path d="M' + F(-80 + i * cw) + ' -96q' + F(cw / 2) + ' 15 ' + F(cw) + ' 0Z" fill="' + (i % 2 ? sz.csik : sz.teto) + '" stroke="' + sz.sotet + '" stroke-width="1.3" stroke-opacity=".45"/>';
  s += '<path d="M-26 -124Q-10 -132 4 -133" stroke="#fff" stroke-width="3" opacity=".45" fill="none" stroke-linecap="round"/>';
  s += '<path d="' + phLap(-70, -44, 70, 1, 4) + '" fill="#e9c99a" stroke="#b08a5a" stroke-width="2"/><path d="' + phLap(-74, -50, 74, -42, 3) + '" fill="#d9b07a" stroke="#8a6a52" stroke-width="1.8"/>';   /* pult */
  s += '<path d="M-36 -40V-2M0 -40V-2M36 -40V-2" stroke="#c9a77a" stroke-width="1.4"/>';
  s += '</g>';
  if (lehuzva) {
    s += '<g filter="url(#lt-firka)">' + phPonyva(sz, -60, 58, -86, -50, 8) + '</g>';
    s += all === "zarva" ? phLakat(0, -66) : phHold(0, -68, 1);
  } else {
    s += '<path d="M-60 -86Q0 -82 58 -86" stroke="' + sz.sotet + '" stroke-width="5" stroke-linecap="round" opacity=".45"/>';   /* felcsavart ponyva */
    s += '<g class="ph-aru"><g transform="translate(0 -50)">' + phAru(aru) + '</g></g>';
  }
  return { svg: s, felso: -138, bal: -80, jobb: 80, magas: 140 };
}

/* ── 🏠 ház (Pálya-hely B kör, 2026-10-25): a Piactér mai házrajza (piac.js piacHaz, az építési fokokkal), rajta a közös jelek ──
   tipus: bolt | letra | csalad · lepes 0–6 (piacHazLepes) · zárva: lakat az ajtón · mára elég: hold · épül: csak a váz (2. fok) */
var PH_HAZ = { letra: { felso: -142, szel: 52, ajto: [0, -12] }, csalad: { felso: -102, szel: 70, ajto: [34, -18] }, bolt: { felso: -102, szel: 70, ajto: [22, -20] } };
function phHaz(tipus, lepes, J) {
  var g = PH_HAZ[tipus], hamar = J.all === "hamarosan";
  var s = piacHaz(tipus, hamar ? 2 : lepes, false);
  if (J.all === "zarva") s += phLakat(g.ajto[0], g.ajto[1]);
  if (J.all === "elfogyott") s += phHold(g.ajto[0], g.ajto[1] - 4, .9);
  return { svg: s, felso: hamar ? g.felso + 6 : g.felso, bal: -g.szel - 14, jobb: g.szel + (tipus === "letra" ? 20 : 14), magas: -g.felso };
}
/* cégér a lábaival egy olyan helyre, amelyik nem pálya-hely (a Piactéren a Dallam-tér és a Tündérvásár sátra): felso = a teteje */
function phCegerAllo(nev, felso, J, id) { return phCegerLab(nev, felso) + phCeger(nev, 0, felso - 20 - phCegerMeret(nev).H / 2, J, id); }

/* ═════════ a hely-fajták: egy liget képe (háttér) + egy hely rajza ═════════
   rajz(pa, J, i) → a hely saját rajza (phBode…) · hatter(W, H) → a kép háttere · y, k, koz: a sor talpvonala, mérete, lépésköze */
var BODE_ARU = { "vasar-3": ["kosar", "kosar"], "vasar-3d": ["doboz", "doboz"] };   /* pálya → [áru, VS_SZIN-sor]; a többi a mai ikonját kapja */
var PH_FAJTA = {
  bode: {
    y: 330, k: .95, koz: 220, H: 400,
    rajz: function (pa, J, i) {
      var a = BODE_ARU[pa.id] || [PALYA_IKON[pa.id] ? pa.id : pa.ikon, ["arcedula", "hasonlito", "nagy"][i % 3]];
      return phBode(VS_SZIN[a[1]], a[0], J);
    },
    hatter: function (W, H) {   /* a sátor belseje: alkonyi fény, zászlófüzér, lampionok, halványan a szomszéd sátrak */
      return '<rect width="' + W + '" height="' + H + '" fill="#f6ead8"/><circle cx="' + (W - 90) + '" cy="60" r="80" fill="#ffdf9e" opacity=".35"/>' +
        '<path d="M0 190 Q' + (W / 4) + ' 166 ' + (W / 2) + ' 186 Q' + (W * .75) + ' 206 ' + W + ' 180 L' + W + ' ' + H + ' L0 ' + H + ' Z" fill="#dcc8e2" opacity=".55"/>' +
        '<path d="M0 300 Q' + (W / 2) + ' 280 ' + W + ' 300 L' + W + ' ' + H + ' L0 ' + H + ' Z" fill="#e7d3b4"/>' + vsFuzer(16, W, Math.round(W / 43)) + vsLampion(90, 56, .8, 0) + vsLampion(W - 90, 52, .8, 1) +
        '<g opacity=".4">' + vsSator(14, 330, VS_SZIN.arcedula, .7) + vsSator(W - 10, 330, VS_SZIN.hasonlito, .7) + '</g>';
    }
  }
};

/* ═════════ egy liget helyei: kép + unikornis + koppintás ═════════ */
var PH = null;          /* a kirakott kép: { svg, regio, lista, xek, U, fut } */
var PH_HONNAN = null;   /* az utoljára indított pálya: visszajövet (és újrarajzoláskor) az unikornis a bódéja előtt áll */
function palyaHelySor(regio, lista) {
  var f = PH_FAJTA[LIGET_HELY[regio]], n = lista.length, W = Math.max(520, 80 + n * f.koz), H = f.H;
  var host = el("div", "ph-ter uni-terep"), xek = lista.map(function (r, i) { return W / 2 + (i - (n - 1) / 2) * f.koz; });
  var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">' + LT_DEFS +
    '<defs><filter id="pc-alszik"><feColorMatrix type="saturate" values=".35"/></filter></defs>' + f.hatter(W, H);
  var jelek = lista.map(function (r) { return palyaJelek(r.pa); });
  lista.forEach(function (r, i) { s += phBurok(r.pa.id, r.pa.nev, jelek[i], f.rajz(r.pa, jelek[i], i), { x: xek[i], y: f.y, k: f.k }); });
  s += '<g class="pc-uni" pointer-events="none"><g class="pc-uni-irany" style="--dir:-1;transform:scale(var(--dir,1),1)">' + unikornisSVG("ph-uni", LENYEK[mentes.leny], .4, P().oltozet) + '</g></g>';
  host.innerHTML = s + '</svg>';
  host.style.maxWidth = "min(760px, calc((100vh - 262px) * " + (W / H).toFixed(3) + "))";   /* alacsony képernyőn se legyen üres sáv a kép két oldalán */
  var svg = host.querySelector("svg");
  PH = { svg: svg, regio: regio, lista: lista, jelek: jelek, xek: xek, f: f, hely: svg.querySelector(".pc-uni"), el: svg.querySelector(".pc-uni-irany"), x: 0, y: 0, fut: null };
  uniNezoAdat(PH.el, { rajz: LENYEK[mentes.leny].rajz, kinezet: P().kinezet || null, oltozet: P().oltozet });
  var vissza = lista.map(function (r) { return r.pa.id; }).indexOf(PH_HONNAN);
  if (vissza >= 0) phUniAllit(phCel(vissza)[0], phCel(vissza)[1]);   /* a pályáról jött vissza: a bódéja előtt áll */
  else phUniAllit(n > 1 ? (xek[0] + xek[1]) / 2 : xek[0] + 110, H - 16);
  phLengIndit(svg);
  svg.addEventListener("click", function (e) {
    var cs = e.target.closest(".ph-csengo");
    if (cs) { e.stopPropagation(); phCsengo(cs); return; }
    var g = e.target.closest(".ph-hely"); if (g) phKoppint(g);
  });
  return host;
}
function phUniAllit(x, y) { PH.x = x; PH.y = y; PH.hely.setAttribute("transform", "translate(" + pcF(x) + " " + pcF(y) + ")"); }
function phCel(i) { return [PH.xek[i] + 92 * PH.f.k, PH.f.y + 24]; }   /* a hely jobb elején, a pult előtt */
function phIndex(g) { return PH.lista.map(function (r) { return r.pa.id; }).indexOf(g.getAttribute("data-id")); }
function phCsengo(cs) {
  hangGomb();
  var t = cs.querySelector(".ph-csengo-test");
  if (t && t.animate && !lkCsokkent()) { t.style.transformBox = "fill-box"; t.style.transformOrigin = "50% 0%"; t.animate([{ transform: "rotate(-22deg)" }, { transform: "rotate(22deg)" }, { transform: "rotate(-12deg)" }, { transform: "rotate(0)" }], { duration: 520 }); }
  var pa = palyaKeres(cs.getAttribute("data-id"));   /* a liget helyein és a Piactér házain is (piac.js) */
  if (pa) mondd(palyaFelolvasMondat(pa, palyaJelek(pa)));
}
function phKoppint(g) {
  if (!PH || !PH.svg.isConnected) return;
  var i = phIndex(g); if (i < 0) return;
  var pa = PH.lista[i].pa, J = PH.jelek[i], regio = PH.regio;
  hangGomb();
  var nem = palyaNemIndulMondat(pa, J);
  if (nem) { pcRezeg(g); mondd(nem); return; }
  function indul() { if ($("kepernyo-fomenu").classList.contains("aktiv") && FOMENU_LIGET === regio) { PH_HONNAN = pa.id; palyaInditas(pa.id); } }
  if (PH.fut) { PH.fut = null; uniUtvonalAll(PH.el); indul(); return; }   /* séta közben még egy koppintás: azonnal indul */
  if (nyugiMod() || window.__UC_GYORS) { indul(); return; }
  var cel = phCel(i), tok = PH.fut = {};
  uniUtvonal({ el: PH.el, allit: phUniAllit, egyseg: function () { var m = PH.svg.getScreenCTM && PH.svg.getScreenCTM(); return m ? Math.sqrt(m.a * m.a + m.b * m.b) : 1; } },
    uniGorbePontok(uniSimaGorbe([[PH.x, PH.y], [(PH.x + cel[0]) / 2, (PH.y + cel[1]) / 2 + 12], cel])), { ido: 1.1 },
    function () {
      if (PH.fut !== tok) return;
      PH.fut = null;
      pcRezeg(g);   /* megérkezett: a bódé megrezzen, az áru felugrik a pulton */
      var a = g.querySelector(".ph-aru");
      if (a && a.animate && !lkCsokkent()) a.animate([{ transform: "translateY(0)" }, { transform: "translateY(-12px)" }, { transform: "translateY(0)" }], { duration: 420 });
      setTimeout(indul, lkCsokkent() ? 0 : 450);
    });
}
function phLengIndit(svg) {   /* a cégér finoman leng (a mozdulatlan kép élettelen) */
  if (lkCsokkent()) return;
  svg.querySelectorAll(".ph-leng").forEach(function (g, i) {
    g.style.transformBox = "fill-box"; g.style.transformOrigin = "50% 0%";
    if (g.animate) g.animate([{ transform: "rotate(-1.4deg)" }, { transform: "rotate(1.4deg)" }, { transform: "rotate(-1.4deg)" }], { duration: 3200 + i * 370, iterations: Infinity, easing: "ease-in-out" });
  });
}
