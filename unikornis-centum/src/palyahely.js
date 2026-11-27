/* ============ 6j3) 🛖 PÁLYA-JELEK + CÉGÉR — a pálya jelei EGY helyen, és a cégér, amin ülnek (Pálya-hely A kör, 2026-10-24) ============
   Terv: terv/palyahely-targykeret-terv.html (✅ jóváhagyva) · rajz: terv/palyahely-rajzterv.html (✅ jóváhagyva, mind a 7 „A” javaslat).
     palyaJelek(pa) — EGY helyen számolja ki egy pálya jeleit (állapot ⭐🌟🔒💤🌙🔜, 💧 napi, 💖 ajánlott, 🐉 sárkány, 🏦 bank,
                      újonc-fény, ≈ ✨). Ezt használja minden közelkép háza (hely.js), a tárgy-nézetek (piac.js) és a Fejtörő-hegy.
     a cégér-készlet — phCeger (a cégér a jelekkel), phLakat, phHold, phCsengo (felolvasás), phLengIndit (leng) — a közelképek
                      és a tárgy-nézetek cégérei.
   A régi liget-belső bódé-sora (LIGET_HELY, palyaHelySor, a hely-fajták, a bódé és a ház rajza) a Világkép 8. hullámában
   (2. kódkör, 2026-11-27) kikerült: a Tündérvásár pályái a Domboldal sátrában laknak (piac.js PC_TARGY.vasar). */

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
  else if (!J.nincsCetli && J.cetli) {   /* nincsCetli: alvó hely. A „≈ N ✨” jutalom-cetli 2026-11-14 óta nincs kint: árcédulának nézték („fizetni kell érte?”); csak a liget ⭐ kész/összes cetlije marad */
    var cetli = J.cetli, cw = Math.max(46, cetli.length * 6.4 + 12);   /* egy ligetnél (Piactér: Tündérvásár) a cetlin a ⭐ kész/összes */
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
function phLakat(x, y) {   /* 🔒 zárva */
  return '<g transform="translate(' + pcF(x) + ' ' + pcF(y) + ')"><path d="M-6 -2V-8Q-6 -15 0 -15Q6 -15 6 -8V-2" fill="none" stroke="#8a7a6e" stroke-width="3"/>' +
    '<path d="' + phLap(-10, -3, 10, 13, 3) + '" fill="#f5c84a" stroke="#a8741c" stroke-width="1.8"/><circle cy="3.5" r="2.2" fill="#6e4a36"/><path d="M0 4.5V8.5" stroke="#6e4a36" stroke-width="1.8"/></g>';
}
function phHold(x, y, k) {   /* 🌙 mára elég: nem tilos, csak pihen */
  return '<g transform="translate(' + pcF(x) + ' ' + pcF(y) + ') scale(' + (k || 1) + ')"><circle cx="1" r="17" fill="#8d86c4" stroke="#5f5a96" stroke-width="1.6"/><path d="M4 -11A11 11 0 1 0 4 11A8.5 8.5 0 1 1 4 -11Z" fill="#fce49a" stroke="#d1a23a" stroke-width="1.4"/>' +
    '<text x="12" y="-6" font-size="7" fill="#d1a23a">✦</text><text x="10" y="10" font-size="5" fill="#d1a23a">✦</text></g>';
}
/* a cégér csengője: koppintásra megbillen, és felolvassa a pálya nevét (a közelképek cégérein — hely.js) */
function phCsengo(cs) {
  hangGomb();
  var t = cs.querySelector(".ph-csengo-test");
  if (t && t.animate && !lkCsokkent()) { t.style.transformBox = "fill-box"; t.style.transformOrigin = "50% 0%"; t.animate([{ transform: "rotate(-22deg)" }, { transform: "rotate(22deg)" }, { transform: "rotate(-12deg)" }, { transform: "rotate(0)" }], { duration: 520 }); }
  var pa = palyaKeres(cs.getAttribute("data-id"));   /* a liget helyein és a Piactér házain is (piac.js) */
  if (pa) mondd(palyaFelolvasMondat(pa, palyaJelek(pa)));
}
function phLengIndit(svg) {   /* a cégér finoman leng (a mozdulatlan kép élettelen) */
  if (lkCsokkent()) return;
  svg.querySelectorAll(".ph-leng").forEach(function (g, i) {
    g.style.transformBox = "fill-box"; g.style.transformOrigin = "50% 0%";
    if (g.animate) g.animate([{ transform: "rotate(-1.4deg)" }, { transform: "rotate(1.4deg)" }, { transform: "rotate(-1.4deg)" }], { duration: 3200 + i * 370, iterations: Infinity, easing: "ease-in-out" });
  });
}
