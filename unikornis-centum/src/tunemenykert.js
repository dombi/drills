/* ============ 12g) ÉGI TÜNEMÉNYKERT (5. fázis: 5a jelenlét + 5b közös tér, mozgás + 5c gesztusok + 5d díszek) ============
   Terv: Matekos/tunemenykert-terv.html. Minden kert-adat a Realtime Database-ben él:
     kertBeall               — a producer (pult): nyitva, orak/napok/tol/ig, napiPalya, idokorlat (perc/nap)
     kertJog/{uid}           — a producer (pult): { szoba, becenev } — aki nincs itt, annak nincs felhőlépcső
     jelenlet/{szoba}/{uid}  — a játék: { nev, leny, kin, olt, x, y, t } — onDisconnect → törlődik
     gesztus/{szoba}/{uid}   — a játék: { g, cel, t } — az utolsó gesztus (5c); a többiek lejátsszák
     diszek/{szoba}/{uid}/{hely} — a játék: { tip, x, y, nev, t } — a kint lévő díszek (5d); hely = "0".."limit-1"
     kertVissza/{uid}/{id}   — a pult: { tip, ar } — a producer törölt egy díszt → a játék visszaadja a 💧-t
   Csak felhő-módban látszik (utca-hub felhőlépcső). A kapukat (nyitvatartás, napi N pálya, időkorlát)
   a játék ellenőrzi; a szoba-elkülönítést a database.rules.json. */
var TK = {
  db: null, kesz: false, indul: false,
  beall: null, jog: null,
  bent: false, szoba: null, ref: null, szobaRef: null, connRef: null,
  masok: {},          /* uid → { a: utolsó adat, d: DOM } */
  x: 50, y: 80, betoltve: false, oraTimer: null, hazaTimer: null, belepMp: 0,
  gRef: null, gSzobaRef: null, gBetoltve: false, gFut: false,
  dRef: null, diszek: {}, dBetoltve: false, dMod: null, talca: false   /* 5d: diszek = "uid/hely" → { a, d } */
};
var TK_FELOLDAS_AR = 10;   /* 💧 tündérharmat, egyszeri feloldás (P().tkNyitva) */
var TK_Y_MIN = 60, TK_Y_MAX = 93;   /* a felhőmező sétálható sávja (a színtér magasságának %-a) */

function tkEsc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
function tkMa() { var d = new Date(); return d.getFullYear() + "-" + (d.getMonth() < 9 ? "0" : "") + (d.getMonth() + 1) + "-" + (d.getDate() < 10 ? "0" : "") + d.getDate(); }
/* napi számláló profilonként (helyi dátum): hány ösvényt járt végig ma + hány mp-et volt a felhőkertben */
function tkNap() {
  var p = P(), ma = tkMa();
  if (!p.kertNap || p.kertNap.datum !== ma) p.kertNap = { datum: ma, db: 0, mp: 0 };
  return p.kertNap;
}
function tkNapPalya() { tkNap().db++; }   /* a palyaVege() hívja, a mentés előtt */

/* ── betöltés: az RTDB SDK + a producer két ága (csak felhő-módban, első utca-látogatáskor) ── */
function tkElokeszit() {
  if (TK.indul || !FELHO.aktiv || !FELHO.uid || !window.firebase) return;
  TK.indul = true;
  sdkBetolt(firebase.database ? [] : ["firebase-database-compat.js"], function (ok) {
    if (!ok || !firebase.database) { console.warn("[kert] az RTDB SDK nem töltődött be"); TK.indul = false; return; }
    try { TK.db = firebase.database(); } catch (e) { console.warn("[kert] RTDB hiba:", e); TK.indul = false; return; }
    TK.kesz = true;
    TK.db.ref("kertBeall").on("value", function (s) { TK.beall = s.val() || {}; tkValtozott(); },
      function (e) { console.warn("[kert] kertBeall:", e && e.code); });
    TK.db.ref("kertJog/" + FELHO.uid).on("value", function (s) { TK.jog = s.val(); tkValtozott(); },
      function (e) { console.warn("[kert] kertJog:", e && e.code); });
    TK.db.ref("kertVissza/" + FELHO.uid).on("child_added", tkVisszaJott,
      function (e) { console.warn("[kert] kertVissza:", e && e.code); });
  });
}
function tkValtozott() {
  var akt = document.querySelector(".kepernyo.aktiv");
  if (akt && akt.id === "kepernyo-utca") renderUtca();
  if (!TK.bent) return;
  tkGesztussor();
  tkTalcaRajzol();
  if (!TK.jog || TK.jog.szoba !== TK.szoba) { tkHazakuld("A felhőkert most bezár. Szia!"); return; }
  var nev = tkNev(), sajat = $("tk-uni-sajat");
  if (sajat) { var t = sajat.querySelector(".tk-nev"); if (t && t.textContent !== nev) { t.textContent = nev; if (TK.ref) TK.ref.update({ nev: nev }).catch(tkHiba); } }
}

/* ── kapuk: null = nincs lépcső · { nyitva } · { nyitva:false, szoveg, rovid } ── */
function tkPerc(hhmm) { var m = /^(\d{1,2}):(\d{2})$/.exec(String(hhmm || "")); return m ? (+m[1]) * 60 + (+m[2]) : 0; }
function tkOraSzo(hhmm) { var m = /^(\d{1,2}):(\d{2})$/.exec(String(hhmm || "")); return !m ? hhmm : (m[2] === "00" ? (+m[1]) + " órakor" : (+m[1]) + ":" + m[2] + "-kor"); }
function tkNyitvatartas(b) {
  if (!b.orak) return { nyitva: true };
  var d = new Date(), nap = String(d.getDay() || 7), perc = d.getHours() * 60 + d.getMinutes();
  var maNap = String(b.napok == null ? "1234567" : b.napok).indexOf(nap) >= 0;
  var tol = tkPerc(b.tol || "00:00"), ig = b.ig ? tkPerc(b.ig) : 24 * 60;
  if (maNap && perc >= tol && perc < ig) return { nyitva: true };
  if (maNap && perc < tol) return { nyitva: false, szoveg: "A felhőkert ma " + tkOraSzo(b.tol) + " nyit.", rovid: b.tol + "-kor nyit" };
  return { nyitva: false, szoveg: "A felhőkert most zárva. Egy másik napon újra jöhetsz!", rovid: "zárva" };
}
function tkKapu() {
  if (!FELHO.aktiv || !TK.kesz || !TK.jog || !TK.jog.szoba) return null;
  if (!P().tkNyitva) return { nyitva: false, zar: true, szoveg: "A felhőkert " + TK_FELOLDAS_AR + " tündérharmatért nyílik meg.", rovid: TK_FELOLDAS_AR + " 💧" };
  var b = TK.beall || {};
  if (!b.nyitva) return { nyitva: false, szoveg: "A felhőkert most pihen.", rovid: "pihen" };
  var ny = tkNyitvatartas(b); if (!ny.nyitva) return ny;
  var n = +b.napiPalya || 0, kesz = tkNap().db;
  if (kesz < n) {
    var h = n - kesz;
    return { nyitva: false, szoveg: "Még " + h + " ösvény, és felmehetsz a felhőkertbe!", rovid: "még " + h + " ösvény" };
  }
  var lim = +b.idokorlat || 0;
  if (lim && tkNap().mp >= lim * 60) return { nyitva: false, szoveg: "Mára elfogyott a felhőidő. Holnap újra jöhetsz!", rovid: "holnap újra" };
  return { nyitva: true };
}

/* ── felhőlépcső az utca-hubon (jobb fönt, a hold túloldalán) ── */
function tkLepcsoSVG() {
  var k = tkKapu(); if (!k) return "";
  var g = '<g id="utca-felhokert" class="utca-epulet tk-lepcso' + (k.nyitva ? "" : " alszik") + '">';
  g += '<rect x="300" y="36" width="100" height="214" fill="transparent"/>';
  /* lépcsőfokok: kis felhők a földtől a szigetig */
  [[372, 238, 17], [352, 206, 16], [370, 174, 15], [350, 144, 14]].forEach(function (f) {
    g += '<g class="tk-fok"><ellipse cx="' + f[0] + '" cy="' + f[1] + '" rx="' + f[2] + '" ry="' + (f[2] * 0.5) + '" fill="#f3eaff"/>' +
      '<circle cx="' + (f[0] - f[2] * 0.4) + '" cy="' + (f[1] - f[2] * 0.3) + '" r="' + (f[2] * 0.45) + '" fill="#ffffff"/>' +
      '<circle cx="' + (f[0] + f[2] * 0.3) + '" cy="' + (f[1] - f[2] * 0.35) + '" r="' + (f[2] * 0.5) + '" fill="#ffffff"/></g>';
  });
  /* a felhősziget + kis szivárvány */
  var cx = 352, cy = 100;
  ["#ff9ec7", "#ffd27a", "#9be3b0", "#9fd3ff", "#c9a8ff"].forEach(function (c, i) {
    var r = 30 - i * 4;
    g += '<path d="M' + (cx - r) + ' ' + cy + ' A' + r + ' ' + r + ' 0 0 1 ' + (cx + r) + ' ' + cy + '" fill="none" stroke="' + c + '" stroke-width="4" stroke-linecap="round"/>';
  });
  g += '<ellipse cx="' + cx + '" cy="' + (cy + 8) + '" rx="42" ry="14" fill="#e9dcff"/>' +
    '<circle cx="' + (cx - 24) + '" cy="' + (cy + 1) + '" r="13" fill="#ffffff"/><circle cx="' + (cx - 4) + '" cy="' + (cy - 4) + '" r="16" fill="#ffffff"/>' +
    '<circle cx="' + (cx + 20) + '" cy="' + cy + '" r="13" fill="#ffffff"/>';
  g += csillagSVG(cx - 36, cy - 28, 5, "#ffd24d") + csillagSVG(cx + 38, cy - 22, 4, "#ffffff");
  g += '<rect x="' + (cx - 44) + '" y="' + (cy + 20) + '" width="88" height="21" rx="10" fill="#ffffff" opacity="0.95"/>' +
    '<text x="' + cx + '" y="' + (cy + 35) + '" text-anchor="middle" font-size="13" font-weight="700" fill="#8a4fd0">felhőkert</text>';
  if (!k.nyitva) {
    g += '<rect x="' + (cx - 44) + '" y="' + (cy + 44) + '" width="88" height="19" rx="9" fill="#1a1338" opacity="0.9"/>' +
      '<text x="' + cx + '" y="' + (cy + 57) + '" text-anchor="middle" font-size="11" font-weight="700" fill="#ffd24d">' + (k.zar ? "🔒 " : "💤 ") + tkEsc(k.rovid) + '</text>';
  }
  g += '</g>';
  return g;
}
function tkLepcsoKoppint() {
  hangGomb();
  var k = tkKapu(); if (!k) return;
  if (k.zar) {
    if ((P().tunderharmat || 0) < TK_FELOLDAS_AR) { mondd("A felhőkerthez " + TK_FELOLDAS_AR + " tündérharmat kell. Gyűjts még kitartással!"); return; }
    UTCA_MOD = "megerosit-tk"; renderUtca(); return;
  }
  if (!k.nyitva) { mondd(k.szoveg); var s = $("utca-sugo"); if (s) s.textContent = k.szoveg + " ☁️"; return; }
  tkBelep();
}

function tkFeloldasVesz() {
  hangGomb();
  if (P().tkNyitva || (P().tunderharmat || 0) < TK_FELOLDAS_AR) { UTCA_MOD = "nez"; renderUtca(); return; }
  P().tunderharmat -= TK_FELOLDAS_AR; vasarlasNaplo("tk-feloldas", TK_FELOLDAS_AR, "tunderharmat");
  P().tkNyitva = 1;
  UTCA_MOD = "nez";
  hangCsilla(); hangJo(); ment();
  renderUtca();
  var k = tkKapu();
  if (k && k.nyitva) { mondd("Megnyílt a felhőkert!"); tkBelep(); }
  else if (k) mondd("Megnyílt a felhőkert! " + k.szoveg);
}

/* ── belépés / kilépés ── */
function tkNev() { var b = TK.jog && TK.jog.becenev; return String(b || (LENYEK[mentes.leny] || {}).nev || "Unikornis").slice(0, 30); }
function tkKinezet(k) {
  k = k || {};
  var r = { sorenySzin: k.sorenySzin || 0, szemSzin: k.szemSzin || null, frizura: k.frizura || "egyenes" };
  /* FODRÁSZAT 2.: festés — csak ismert festék-id megy át (a hiányzó rész = festetlen) */
  if (k.festek) { var f = {}, van = false; ["soreny", "farok", "tincs"].forEach(function (x) { if (FESTEK_BY[k.festek[x]]) { f[x] = k.festek[x]; van = true; } }); if (van) r.festek = f; }
  return r;
}
function tkOltozet(o) { var r = {}; ["hat", "farok", "oldal", "lab", "nyak", "fej"].forEach(function (h) { if (o && typeof o[h] === "string") r[h] = o[h]; }); return r; }
function tkSajatAdat() {
  var p = P(), kin = tkKinezet(p.kinezet);
  if (!kin.szemSzin) delete kin.szemSzin;
  return { nev: tkNev(), leny: mentes.leny, kin: kin, olt: tkOltozet(p.oltozet),
           x: Math.round(TK.x * 10) / 10, y: Math.round(TK.y * 10) / 10, t: firebase.database.ServerValue.TIMESTAMP };
}
function tkHiba(e) { console.warn("[kert]", (e && e.code) || e); }
function tkBelep() {
  if (TK.bent || !TK.db) return;
  try { speechSynthesis.cancel(); } catch (e) {}
  figyelStop();
  TK.bent = true; TK.szoba = TK.jog.szoba; TK.masok = {}; TK.betoltve = false; TK.belepMp = 0;
  TK.diszek = {}; TK.dBetoltve = false; TK.dMod = null; TK.talca = false;
  TK.x = 25 + Math.random() * 50; TK.y = 76 + Math.random() * 12;
  renderTk();
  mutat("kepernyo-tunemenykert");
  mondd("Felértünk a felhőkertbe! Koppints a felhőre, és sétálj!");
  TK.szobaRef = TK.db.ref("jelenlet/" + TK.szoba);
  TK.ref = TK.szobaRef.child(FELHO.uid);
  TK.connRef = TK.db.ref(".info/connected");
  TK.connRef.on("value", function (s) {   /* újracsatlakozáskor újra beírjuk magunkat */
    if (s.val() !== true || !TK.bent) return;
    TK.ref.onDisconnect().remove().then(function () { if (TK.bent) return TK.ref.set(tkSajatAdat()); }).catch(tkHiba);
  });
  TK.szobaRef.on("child_added", tkMasikJott, tkHiba);
  TK.szobaRef.on("child_changed", tkMasikValt, tkHiba);
  TK.szobaRef.on("child_removed", tkMasikMent, tkHiba);
  TK.szobaRef.once("value", function () { TK.betoltve = true; tkSugo(); }, tkHiba);
  TK.gBetoltve = false; TK.gFut = false;
  TK.gSzobaRef = TK.db.ref("gesztus/" + TK.szoba);
  TK.gRef = TK.gSzobaRef.child(FELHO.uid);
  TK.gRef.onDisconnect().remove().catch(tkHiba);
  TK.gSzobaRef.on("child_added", tkGesztusJott, tkHiba);   /* a régi (belépés előtti) gesztusokat nem játsszuk le */
  TK.gSzobaRef.on("child_changed", tkGesztusJott, tkHiba);
  TK.gSzobaRef.once("value", function () { TK.gBetoltve = true; }, tkHiba);
  TK.dRef = TK.db.ref("diszek/" + TK.szoba);
  TK.dRef.on("value", tkDiszekJott, tkHiba);
  TK.oraTimer = setInterval(tkOra, 5000);
  esemeny("kert_belep", { szoba: TK.szoba });
}
function tkKilep(gombbal) {
  clearTimeout(TK.hazaTimer); TK.hazaTimer = null;
  if (TK.bent) {
    TK.bent = false;
    clearInterval(TK.oraTimer);
    if (TK.szobaRef) TK.szobaRef.off();
    if (TK.connRef) TK.connRef.off();
    if (TK.gSzobaRef) TK.gSzobaRef.off();
    if (TK.dRef) TK.dRef.off();
    TK.dMod = null; TK.talca = false; tkTalcaRajzol();
    if (TK.gRef) { TK.gRef.onDisconnect().cancel().catch(function () {}); TK.gRef.remove().catch(tkHiba); }
    if (TK.ref) { TK.ref.onDisconnect().cancel().catch(function () {}); TK.ref.remove().catch(tkHiba); }
    esemeny("kert_kilep", { szoba: TK.szoba, mp: TK.belepMp });
    ment();
  }
  utcaNyit();
  if (gombbal) mondd("Visszaértünk az utcára!");
}
function tkHazakuld(szoveg) {
  if (!TK.bent || TK.hazaTimer) return;
  mondd(szoveg);
  var s = $("tk-sugo"); if (s) s.textContent = szoveg + " 👋";
  var d = $("tk-uni-sajat"); if (d) d.classList.add("elmegy");
  TK.hazaTimer = setTimeout(function () { TK.hazaTimer = null; tkKilep(false); }, 3200);
}
/* 5 mp-es óra: felhőidő gyűjtése + a kapuk újraellenőrzése (zárás, időkeret) */
function tkOra() {
  if (!TK.bent) return;
  var n = tkNap(); n.mp += 5; TK.belepMp += 5;
  if (TK.belepMp % 60 === 0) ment();
  var k = tkKapu();
  if (!k) tkHazakuld("A felhőkert most bezár. Szia!");
  else if (!k.nyitva) tkHazakuld(k.rovid === "holnap újra" ? "Ideje hazarepülni! Holnap újra jöhetsz." : "A felhőkert most bezár. Szia!");
}

/* ── a színtér ── */
function tkHatterSVG() {
  var s = '<svg class="kert-hatter" viewBox="0 0 1000 620" preserveAspectRatio="xMidYMid slice" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">';
  s += '<defs>' +
    '<linearGradient id="tk-eg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a9d8ff"/><stop offset="0.45" stop-color="#e6d6ff"/><stop offset="1" stop-color="#ffe4f1"/></linearGradient>' +
    '<radialGradient id="tk-nap" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#fffbe6"/><stop offset="0.5" stop-color="#fff3c4" stop-opacity="0.7"/><stop offset="1" stop-color="#fff3c4" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="tk-mezo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#f1e6ff"/></linearGradient>' +
    '<linearGradient id="tk-sziget" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#dccbff"/></linearGradient>' +
    '</defs>';
  s += '<rect width="1000" height="620" fill="url(#tk-eg)"/>';
  s += '<circle cx="800" cy="110" r="120" fill="url(#tk-nap)"/><circle cx="800" cy="110" r="38" fill="#fff8d8"/>';
  /* nagy, halvány szivárvány a háttérben */
  ["#ff9ec7", "#ffcf8a", "#fff09a", "#a8ecb9", "#a6d8ff", "#cdb2ff"].forEach(function (c, i) {
    var r = 330 - i * 18;
    s += '<path d="M' + (500 - r) + ' 380 A' + r + ' ' + r + ' 0 0 1 ' + (500 + r) + ' 380" fill="none" stroke="' + c + '" stroke-width="18" opacity="0.55"/>';
  });
  /* csillogó pöttyök */
  [[120, 70], [250, 140], [420, 60], [610, 120], [930, 60], [880, 230], [70, 210], [560, 40]].forEach(function (p, i) {
    s += '<g class="tk-csillog" style="animation-delay:' + (i * 0.45).toFixed(2) + 's">' + csillagSVG(p[0], p[1], 7, i % 2 ? "#ffffff" : "#ffe27a") + '</g>';
  });
  /* lebegő szigetek a távolban */
  function sziget(x, y, m, extra) {
    return '<g class="tk-lebeg" style="animation-delay:' + (x % 5) + 's"><g transform="translate(' + x + ',' + y + ') scale(' + m + ')">' +
      '<path d="M-70 0 Q-40 50 0 58 Q40 50 70 0 Z" fill="#cdb8f5"/>' +
      '<ellipse cx="0" cy="0" rx="74" ry="18" fill="url(#tk-sziget)"/>' +
      '<circle cx="-40" cy="-8" r="18" fill="#ffffff"/><circle cx="-12" cy="-16" r="24" fill="#ffffff"/><circle cx="22" cy="-10" r="20" fill="#ffffff"/><circle cx="46" cy="-4" r="14" fill="#ffffff"/>' +
      extra + '</g></g>';
  }
  s += sziget(150, 270, 0.9, '<path d="M-8 -22 L0 -62 L8 -22 Z" fill="#b89cff"/><path d="M0 -62 L8 -22 L0 -26 Z" fill="#e4d8ff"/>');   /* kristály */
  s += sziget(870, 300, 0.75, '<rect x="-3" y="-50" width="6" height="30" fill="#b98a4e"/><circle cx="0" cy="-58" r="20" fill="#ffb3d6"/><circle cx="-12" cy="-50" r="12" fill="#ffc9e3"/><circle cx="12" cy="-52" r="13" fill="#ffc9e3"/>');   /* rózsaszín fa */
  s += sziget(560, 215, 0.5, '');
  /* úszó felhőbárányok */
  function barany(y, m, ido, kesleltet) {
    return '<g class="tk-barany" style="animation-duration:' + ido + 's;animation-delay:-' + kesleltet + 's"><g transform="translate(0,' + y + ') scale(' + m + ')">' +
      '<circle cx="0" cy="0" r="16" fill="#ffffff"/><circle cx="16" cy="-6" r="18" fill="#ffffff"/><circle cx="34" cy="0" r="15" fill="#ffffff"/><circle cx="18" cy="8" r="16" fill="#ffffff"/>' +
      '<ellipse cx="48" cy="-2" rx="10" ry="9" fill="#e8dcff"/><circle cx="51" cy="-4" r="1.8" fill="#4a3a70"/>' +
      '<rect x="6" y="18" width="4" height="10" rx="2" fill="#bba6e6"/><rect x="26" y="18" width="4" height="10" rx="2" fill="#bba6e6"/></g></g>';
  }
  s += barany(170, 0.9, 60, 10) + barany(95, 0.6, 85, 50) + barany(235, 0.7, 70, 35);
  /* a sétálható felhőmező: rétegzett, gömbölyű felhőpaplan */
  s += '<path d="M0 360 Q60 320 130 345 Q200 300 290 338 Q360 305 450 336 Q540 298 630 334 Q720 300 800 338 Q880 308 1000 340 L1000 620 L0 620 Z" fill="#efe4ff"/>';
  s += '<path d="M0 392 Q80 356 170 384 Q250 350 340 382 Q430 352 520 380 Q610 350 700 382 Q800 352 880 380 Q950 360 1000 372 L1000 620 L0 620 Z" fill="url(#tk-mezo)"/>';
  for (var i = 0; i < 12; i++) {
    var x = 40 + i * 85, y = 470 + (i % 3) * 38;
    s += '<ellipse cx="' + x + '" cy="' + y + '" rx="54" ry="16" fill="#e9dcff" opacity="0.55"/>';
  }
  s += '<path d="M0 575 Q100 548 200 570 Q300 545 400 568 Q500 546 600 570 Q700 548 800 568 Q900 548 1000 566 L1000 620 L0 620 Z" fill="#e6d8ff" opacity="0.8"/>';
  s += '</svg>';
  return s;
}
function renderTk() {
  var h = $("tk-harmat"); if (h) h.textContent = P().tunderharmat || 0;
  var c = $("tk-csillampor"); if (c) c.textContent = P().csillampor;
  var host = $("tk-szinter"); if (!host) return;
  host.innerHTML = tkHatterSVG() + '<div id="tk-unik" class="tk-unik"></div>';
  var d = tkUniEl("sajat", tkSajatAdat(), true);
  $("tk-unik").appendChild(d);
  tkPoz(d, TK.x, TK.y);
  host.onclick = tkSzinterKlikk;
  tkGesztussor();
  tkSugo();
}
function tkMeret(y) { return 0.62 + 0.38 * (y - TK_Y_MIN) / (TK_Y_MAX - TK_Y_MIN); }   /* hátrébb kisebb */
function tkUniEl(kulcs, a, sajat) {
  var d = el("div", "tk-uni" + (sajat ? " sajat" : ""));
  d.id = "tk-uni-" + kulcs;
  d.innerHTML = '<div class="tk-nev">' + tkEsc(a.nev) + '</div>' + tkUniSVG(kulcs, a) + (sajat ? '<div class="tk-te">✦ te ✦</div>' : '');
  return d;
}
function tkUniSVG(kulcs, a) {
  var c = LENYEK[a.leny] || LENYEK[mentes.leny];
  var idk = "tk-" + String(kulcs).replace(/[^A-Za-z0-9_-]/g, "");
  return '<div class="tk-bob"><div class="kert-uni-flip"><svg class="kert-uni-svg" viewBox="-100 -150 200 176" xmlns="http://www.w3.org/2000/svg">' +
    unikornisSVG(idk, c, 1, a.olt || {}, tkKinezet(a.kin)) + '</svg></div></div>';
}
function tkPoz(d, x, y) {
  d.style.left = x + "%";
  d.style.bottom = (100 - y) + "%";
  d.style.setProperty("--s", tkMeret(y).toFixed(3));
  d.style.zIndex = Math.round(y * 10);
}
/* séta egyik pontból a másikba (a saját és a többiek unikornisa is ezzel megy) */
function tkSetal(d, x0, y0, x1, y1) {
  var dx = x1 - x0, dy = (y1 - y0) * 1.6, tav = Math.sqrt(dx * dx + dy * dy);
  if (tav < 1) return;
  var mp = Math.max(0.5, Math.min(3.4, tav * 0.05));
  if (Math.abs(dx) > 0.5) d.style.setProperty("--dir", dx < 0 ? -1 : 1);
  d.style.setProperty("--t", mp.toFixed(2) + "s");
  d.classList.add("jar");
  tkPoz(d, x1, y1);
  clearTimeout(d._jarTimer);
  d._jarTimer = setTimeout(function () { d.classList.remove("jar"); }, mp * 1000 + 80);
}
function tkSzinterKlikk(e) {
  if (!TK.bent || TK.hazaTimer || TK.gFut) return;
  var host = $("tk-szinter"), d = $("tk-uni-sajat"); if (!host || !d) return;
  var dx = e.target.closest && e.target.closest(".tk-disz-x");
  if (dx) { tkDiszElpakol(dx.parentNode.getAttribute("data-k")); return; }
  var dsz = e.target.closest && e.target.closest(".tk-disz");
  if (dsz && !TK.dMod) { tkDiszKoppint(dsz.getAttribute("data-k")); return; }
  if (e.target.closest && e.target.closest("#tk-uni-sajat")) { kertNyihog(); return; }
  var masik = e.target.closest && e.target.closest(".tk-uni:not(.sajat)");
  if (masik && tkGesztusSzabad("pacsi")) { tkPacsiIndit(masik.id.replace(/^tk-uni-/, "")); return; }
  var r = host.getBoundingClientRect();
  var x = Math.max(8, Math.min(92, ((e.clientX - r.left) / r.width) * 100));
  var y = Math.max(TK_Y_MIN, Math.min(TK_Y_MAX, ((e.clientY - r.top) / r.height) * 100));
  if (TK.dMod) { tkDiszLerak(TK.dMod, x, y); return; }   /* díszítés-mód: séta helyett lerakás */
  tkSetal(d, TK.x, TK.y, x, y);
  TK.x = x; TK.y = y;
  if (TK.ref) TK.ref.update({ x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10, t: firebase.database.ServerValue.TIMESTAMP }).catch(tkHiba);
}

/* ── a többiek ── */
function tkMasikJott(snap) {
  var uid = snap.key, a = snap.val();
  if (uid === FELHO.uid || !a || TK.masok[uid]) return;
  var d = tkUniEl(uid, a, false);
  $("tk-unik") && $("tk-unik").appendChild(d);
  tkPoz(d, +a.x || 50, +a.y || 80);
  TK.masok[uid] = { a: a, d: d };
  if (TK.betoltve) {   /* nem az első betöltés: most érkezett → lebeg le + bemondjuk */
    d.classList.add("erkezik");
    setTimeout(function () { d.classList.remove("erkezik"); }, 1300);
    beep(880, 0.08, "sine", 0, 0.05); beep(1320, 0.1, "sine", 0.1, 0.05);
    mondd("Megérkezett " + a.nev + "!");
  }
  tkSugo();
}
function tkMasikValt(snap) {
  var uid = snap.key, a = snap.val(), m = TK.masok[uid];
  if (uid === FELHO.uid || !a) return;
  if (!m) { tkMasikJott(snap); return; }
  var r = m.a; m.a = a;
  if (JSON.stringify([r.leny, r.kin, r.olt]) !== JSON.stringify([a.leny, a.kin, a.olt])) {   /* átöltözött / másik unikornis */
    var bob = m.d.querySelector(".tk-bob"); if (bob) bob.outerHTML = tkUniSVG(uid, a);
  }
  if (r.nev !== a.nev) { var t = m.d.querySelector(".tk-nev"); if (t) t.textContent = a.nev; tkSugo(); }
  if (r.x !== a.x || r.y !== a.y) tkSetal(m.d, +r.x, +r.y, +a.x, +a.y);
}
function tkMasikMent(snap) {
  var uid = snap.key, m = TK.masok[uid];
  if (!m) return;
  delete TK.masok[uid];
  m.d.classList.add("elmegy");
  setTimeout(function () { if (m.d.parentNode) m.d.parentNode.removeChild(m.d); }, 1100);
  tkSugo();
}
function tkSugo() {
  var s = $("tk-sugo"); if (!s || TK.hazaTimer) return;
  var nevek = Object.keys(TK.masok).map(function (u) { return TK.masok[u].a.nev; });
  if (TK.dMod) { s.textContent = "Koppints a felhőre — oda tesszük! 🌸"; return; }
  var nezd = !nevek.length ? tkDiszNezd() : "";
  s.textContent = !nevek.length
    ? "Most csak te vagy itt. " + (nezd ? nezd + " 🌸" : "Koppints a felhőre, és sétálj! ☁️")
    : "Itt van: " + nevek.join(", ") + " 💖 Koppints a felhőre — odasétálsz!";
}
window.addEventListener("pagehide", function () { if (TK.bent && TK.ref) { TK.ref.remove(); if (TK.gRef) TK.gRef.remove(); } });

/* ── 5c) GESZTUSOK ──
   👋 integetés + 🙌 pacsi (patacsapás: koppints egy másik unikornisra) mindenkinek jár;
   🦘 ugrás, 🌀 pörgés, ✨ csillámszórás annak, aki a Kertben megvette 💧-ért.
   A producer a pulton egyenként kikapcsolhatja (kertBeall.gesztusok.{id} === false → tiltva).
   A saját gesztust azonnal lejátsszuk, a többieknél a gesztus/{szoba}/{uid} ágból jön. */
var TK_GESZTUSOK = [
  { id: "integet", emoji: "👋", nev: "Integetés", ms: 1500 },
  { id: "pacsi",   emoji: "🙌", nev: "Pacsi",     ms: 1300, gomb: false },
  { id: "ugras",   emoji: "🦘", nev: "Ugrás",     ms: 1100, kert: true },
  { id: "porges",  emoji: "🌀", nev: "Pörgés",    ms: 1400, kert: true },
  { id: "csillam", emoji: "✨", nev: "Csillámszórás", ms: 1800, kert: true }
];
var TK_G_SZUNET = 600;   /* két gesztus között ennyi ms szünet (ne lehessen folyamatosan nyomkodni) */
function tkGesztusAdat(id) { for (var i = 0; i < TK_GESZTUSOK.length; i++) if (TK_GESZTUSOK[i].id === id) return TK_GESZTUSOK[i]; return null; }
/* engedélyezte-e a producer (a pulton) — alapból minden engedélyezett */
function tkGesztusPult(id) { var g = TK.beall && TK.beall.gesztusok; return !g || g[id] !== false; }
/* a saját gyerek használhatja-e (pult + ha kerti trükk, megvette-e) */
function tkGesztusSzabad(id) {
  var a = tkGesztusAdat(id); if (!a || !tkGesztusPult(id)) return false;
  return !a.kert || !!(P().kert && P().kert.trukkok && P().kert.trukkok[id]);
}
function tkGesztussor() {
  var sor = $("tk-gesztussor"); if (!sor) return;
  var h = "";
  TK_GESZTUSOK.forEach(function (a) {
    if (a.gomb === false || !tkGesztusSzabad(a.id)) return;
    h += '<button class="kert-trukk-chip tk-g-chip" data-g="' + a.id + '" aria-label="' + a.nev + '" title="' + a.nev + '">' +
      '<span class="ktr-emoji">' + a.emoji + '</span></button>';
  });
  if (window.TK_DISZEK && TK_DISZEK.length) h += '<button class="kert-trukk-chip tk-g-chip tk-d-chip' + (TK.talca ? " aktiv" : "") + '" data-g="disz" aria-label="Díszítés" title="Díszítés">' +
    '<span class="ktr-emoji">🌸</span></button>';
  sor.innerHTML = h;
  sor.hidden = !h;
  sor.onclick = function (e) {
    var b = e.target.closest && e.target.closest(".tk-g-chip"); if (!b) return;
    hangGomb();
    if (b.getAttribute("data-g") === "disz") tkTalcaValt(); else tkGesztusIndit(b.getAttribute("data-g"));
  };
}
/* a saját gesztus beírása az RTDB-be — a többiek ebből játsszák le */
function tkGesztusKuld(id, cel) {
  var adat = { g: id, t: firebase.database.ServerValue.TIMESTAMP };
  if (cel) adat.cel = cel;
  if (TK.gRef) TK.gRef.set(adat).catch(tkHiba);
  esemeny("kert_gesztus", { g: id });
}
function tkGesztusIndit(id) {
  if (!TK.bent || TK.hazaTimer || TK.gFut || !tkGesztusSzabad(id)) return;
  var d = $("tk-uni-sajat"), a = tkGesztusAdat(id); if (!d || !a) return;
  TK.gFut = true;
  tkGesztusJatszik(d, id);
  tkGesztusKuld(id);
  setTimeout(function () { TK.gFut = false; }, a.ms + TK_G_SZUNET);
}
/* 🙌 pacsi: az én unikornisom odasétál a másik mellé, szembefordulnak, összecsapják a patájukat */
function tkPacsiIndit(uid) {
  var m = TK.masok[uid], d = $("tk-uni-sajat"); if (!m || !d) return;
  TK.gFut = true;
  var mx = +m.a.x || 50, my = +m.a.y || 80;
  var x = Math.max(8, Math.min(92, mx + (TK.x <= mx ? -9 : 9)));
  var dx = x - TK.x, dy = (my - TK.y) * 1.6, tav = Math.sqrt(dx * dx + dy * dy);
  var mp = tav < 1 ? 0 : Math.max(0.5, Math.min(3.4, tav * 0.05));   /* ugyanaz a tempó, mint a tkSetal-ban */
  tkSetal(d, TK.x, TK.y, x, my);
  TK.x = x; TK.y = my;
  if (TK.ref) TK.ref.update({ x: Math.round(x * 10) / 10, y: Math.round(my * 10) / 10, t: firebase.database.ServerValue.TIMESTAMP }).catch(tkHiba);
  setTimeout(function () {
    var mm = TK.masok[uid];
    if (!TK.bent || !mm) { TK.gFut = false; return; }   /* közben elment */
    tkPacsiJatszik(d, mm.d, TK.x, TK.y, +mm.a.x, +mm.a.y);
    tkGesztusKuld("pacsi", uid);
    setTimeout(function () { TK.gFut = false; }, tkGesztusAdat("pacsi").ms + TK_G_SZUNET);
  }, mp * 1000 + 120);
}
/* egy másik gyerek gesztusa érkezett */
function tkGesztusJott(snap) {
  var uid = snap.key, a = snap.val();
  if (!TK.gBetoltve || !TK.bent || uid === FELHO.uid || !a || !tkGesztusAdat(a.g) || !tkGesztusPult(a.g)) return;
  var m = TK.masok[uid]; if (!m) return;
  if (a.g !== "pacsi") { tkGesztusJatszik(m.d, a.g); return; }
  var en = a.cel === FELHO.uid, c = en ? null : TK.masok[a.cel];
  if (!en && !c) return;
  tkPacsiJatszik(m.d, en ? $("tk-uni-sajat") : c.d, +m.a.x, +m.a.y, en ? TK.x : +c.a.x, en ? TK.y : +c.a.y);
  if (en) {   /* engem pacsizott meg */
    mondd(m.a.nev + " pacsit adott!");
    var s = $("tk-sugo"); if (s && !TK.hazaTimer) s.textContent = "🙌 " + m.a.nev + " pacsit adott! Koppints rá te is!";
  }
}
/* egy gesztus lejátszása egy unikornis-elemen (a saját és a többieké is ezzel megy) */
function tkGesztusJatszik(d, id) {
  var a = tkGesztusAdat(id); if (!d || !a) return;
  var cls = "g-" + id, extra = [];
  d.classList.remove("jar"); d.classList.remove(cls); void d.offsetWidth;   /* újraindítható animáció */
  d.classList.add(cls);
  if (id === "integet") {
    var b = el("div", "tk-g-buborek"); b.textContent = "👋"; d.appendChild(b); extra.push(b);
    beep(988, 0.08, "sine", 0, 0.05); beep(1319, 0.1, "sine", 0.09, 0.05);
  } else if (id === "csillam") {   /* ugyanazok a szikrák + konfetti, mint a Kertben */
    var szinek = ["#ffd24d", "#ff9ec4", "#b39af0", "#fff", "#ffd24d"], konf = ["#ffd24d", "#ff9ec4", "#b39af0", "#87cc66", "#a7d8f2", "#fff"];
    for (var i = 0; i < 5; i++) { var sz = el("span", "csillam-szikra csillam-sz-" + i); sz.style.color = szinek[i]; d.appendChild(sz); extra.push(sz); }
    for (var k = 0; k < 6; k++) { var ko = el("span", "csillam-konf csillam-ko-" + k); ko.style.background = konf[k]; d.appendChild(ko); extra.push(ko); }
    hangCsilla();
  } else if (id === "porges") {   /* a pörgés itt tükrözéses forgás (a 4 nézetes sprite csak a saját kertben van) */
    for (var j = 0; j < 6; j++) setTimeout(function () {
      var sp = el("span", "forgato-szikra"); sp.textContent = ["✨", "⭐", "💫", "🌟"][Math.floor(Math.random() * 4)];
      sp.style.left = (30 + Math.random() * 40) + "%"; sp.style.top = (20 + Math.random() * 50) + "%";
      d.appendChild(sp); setTimeout(function () { if (sp.parentNode) sp.parentNode.removeChild(sp); }, 650);
    }, j * 220);
    hangCsilla();
  } else hangCsilla();
  clearTimeout(d._gTimer);
  d._gTimer = setTimeout(function () {
    d.classList.remove(cls);
    extra.forEach(function (e) { if (e.parentNode) e.parentNode.removeChild(e); });
  }, a.ms + 80);
}
/* két unikornis szembefordul, egymás felé dől és összecsapja a patáját; köztük csillag-pukkanás */
function tkPacsiJatszik(d1, d2, x1, y1, x2, y2) {
  if (!d1 || !d2) return;
  var ms = tkGesztusAdat("pacsi").ms;
  d1.style.setProperty("--dir", x2 < x1 ? -1 : 1);
  d2.style.setProperty("--dir", x1 < x2 ? -1 : 1);
  [d1, d2].forEach(function (d) {
    d.classList.remove("jar"); d.classList.remove("g-pacsi"); void d.offsetWidth; d.classList.add("g-pacsi");
    clearTimeout(d._gTimer);
    d._gTimer = setTimeout(function () { d.classList.remove("g-pacsi"); }, ms + 80);
  });
  var kont = $("tk-unik");
  if (kont) {
    var p = el("div", "tk-pacsi-pukk"), y = (y1 + y2) / 2;
    p.innerHTML = '<span class="tk-pp-fo">🙌</span><span class="tk-pp tk-pp-0">✨</span><span class="tk-pp tk-pp-1">💖</span><span class="tk-pp tk-pp-2">⭐</span><span class="tk-pp tk-pp-3">✨</span>';
    p.style.left = ((x1 + x2) / 2) + "%";
    p.style.bottom = (100 - y + 26 * tkMeret(y)) + "%";   /* a két összeérő fej fölött */
    kont.appendChild(p);
    setTimeout(function () { if (p.parentNode) p.parentNode.removeChild(p); }, ms + 200);
  }
  setTimeout(function () { beep(1175, 0.06, "square", 0, 0.05); beep(1568, 0.12, "triangle", 0.06, 0.09); beep(2093, 0.12, "triangle", 0.14, 0.06); }, ms * 0.38);
}

/* ── 5d) KÖZÖS DÍSZÍTÉS ──
   A díszek listája a tk-diszek.js-ben (TK_DISZEK) — a pult is azt használja.
   A gyerek 💧-ért megveszi (P().tkDisz = { tip: darab } — az övé marad), és kiteheti a felhőre, vagy
   elpakolhatja (a zsákjába kerül, a vételár nem jár vissza). Egyszerre legfeljebb „limit” dísze lehet kint:
   a hely-kulcs "0".."limit-1", ezt a database.rules.json is ellenőrzi. Ha a producer töröl egy díszt,
   a pult kertVissza/{uid}-ba írja az árát → itt jóváírjuk (a darab is lekerül a zsákból). */
var TK_DISZ_AR = 12, TK_DISZ_LIMIT = 5, TK_DISZ_MAX = 10;
function tkDiszAdat(id) { var l = window.TK_DISZEK || []; for (var i = 0; i < l.length; i++) if (l[i].id === id) return l[i]; return null; }
function tkDiszAr() { var a = TK.beall && +TK.beall.diszAr; return a > 0 ? a : TK_DISZ_AR; }
function tkDiszLimit() {
  var j = TK.jog && TK.jog.diszLimit, b = TK.beall && TK.beall.diszLimit;
  var l = typeof j === "number" ? j : (typeof b === "number" ? b : TK_DISZ_LIMIT);
  return Math.max(0, Math.min(TK_DISZ_MAX, l));
}
function tkDiszVett() { var p = P(); if (!p.tkDisz || typeof p.tkDisz !== "object") p.tkDisz = {}; return p.tkDisz; }
function tkDiszKintSajat() {   /* a saját, most kint lévő díszek: [{ k, hely, tip }] */
  var r = [], elo = FELHO.uid + "/";
  Object.keys(TK.diszek).forEach(function (k) { if (k.indexOf(elo) === 0) r.push({ k: k, hely: k.slice(elo.length), tip: TK.diszek[k].a.tip }); });
  return r;
}
function tkDiszZsak(tip) {   /* hány ilyen dísze van a zsákjában (megvett, de nincs kint) */
  var kint = tkDiszKintSajat().filter(function (x) { return x.tip === tip; }).length;
  return Math.max(0, (+tkDiszVett()[tip] || 0) - kint);
}

/* ── tálca ── */
function tkTalcaValt() {
  if (!TK.bent || TK.hazaTimer) return;
  TK.talca = !TK.talca;
  if (!TK.talca) TK.dMod = null;
  else if (!TK.dMod) mondd("Válassz egy díszt, aztán koppints a felhőre!");
  tkTalcaRajzol(); tkGesztussor(); tkSugo();
}
function tkTalcaRajzol() {
  var t = $("tk-disz-talca"), sz = $("tk-szinter");
  if (sz) sz.classList.toggle("tk-rak", !!TK.talca);
  if (!t) return;
  if (!TK.talca || !TK.bent) { t.hidden = true; t.innerHTML = ""; return; }
  var ar = tkDiszAr(), lim = tkDiszLimit(), kint = tkDiszKintSajat().length, harmat = P().tunderharmat || 0;
  var h = '<div class="tk-d-kint" title="Ennyi díszed van kint">' + kint + "/" + lim + "</div>";
  (window.TK_DISZEK || []).forEach(function (d) {
    var zs = tkDiszZsak(d.id), cimke = zs ? "×" + zs : ar + " 💧";
    h += '<button class="tk-d-elem' + (TK.dMod === d.id ? " kivalasztva" : "") + (!zs && harmat < ar ? " draga" : "") +
      '" data-d="' + d.id + '" aria-label="' + tkEsc(d.nev) + '" title="' + tkEsc(d.nev) + '">' +
      tkDiszSVG(d.id, "tk-d-kep") + '<span class="tk-d-cimke' + (zs ? " zsak" : "") + '">' + cimke + "</span></button>";
  });
  t.innerHTML = h;
  t.hidden = false;
  t.onclick = function (e) {
    var b = e.target.closest && e.target.closest(".tk-d-elem"); if (!b) return;
    hangGomb();
    var id = b.getAttribute("data-d");
    TK.dMod = TK.dMod === id ? null : id;
    if (TK.dMod) {
      var d = tkDiszAdat(id), zs = tkDiszZsak(id);
      if (!zs && (P().tunderharmat || 0) < tkDiszAr()) mondd("Ehhez még " + (tkDiszAr() - (P().tunderharmat || 0)) + " tündérharmat kell. Gyűjts kitartással!");
      else mondd(d.nev + ". Koppints a felhőre!");
    }
    tkTalcaRajzol(); tkSugo();
  };
}

/* ── lerakás / elpakolás ── */
function tkDiszLerak(tip, x, y) {
  var d = tkDiszAdat(tip); if (!d || !TK.dRef) return;
  var lim = tkDiszLimit(), kint = tkDiszKintSajat();
  if (kint.length >= lim) {
    mondd(lim ? "Már " + lim + " díszed van kint. Pakolj el egyet, és tehetsz újat!" : "Most nem lehet díszt kitenni.");
    return;
  }
  var ar = tkDiszAr(), vett = false;
  if (!tkDiszZsak(tip)) {
    var h = P().tunderharmat || 0;
    if (h < ar) { mondd("Ehhez még " + (ar - h) + " tündérharmat kell. Gyűjts kitartással!"); return; }
    P().tunderharmat = h - ar;
    tkDiszVett()[tip] = (+tkDiszVett()[tip] || 0) + 1;
    vasarlasNaplo("tkdisz-" + tip, ar, "tunderharmat");
    vett = true;
  }
  var foglalt = {}; kint.forEach(function (k) { foglalt[k.hely] = 1; });
  var hely = 0; while (foglalt[String(hely)]) hely++;
  x = Math.round(Math.max(5, Math.min(95, x)) * 10) / 10; y = Math.round(y * 10) / 10;
  TK.dRef.child(FELHO.uid + "/" + hely).set({ tip: tip, x: x, y: y, nev: tkNev(), t: firebase.database.ServerValue.TIMESTAMP }).catch(function (e) {
    tkHiba(e); mondd("Most nem sikerült kitenni. A díszed a zsákodban vár.");
  });
  hangCsilla();
  if (vett) { ment(); var hm = $("tk-harmat"); if (hm) hm.textContent = P().tunderharmat || 0; }
  esemeny("kert_disz", { tip: tip, vett: vett });
}
function tkDiszElpakol(k) {
  var m = TK.diszek[k]; if (!m || k.indexOf(FELHO.uid + "/") !== 0) return;
  hangGomb();
  TK.dRef.child(k).remove().catch(tkHiba);
  mondd("Elpakoltad. A zsákodban vár!");
}
function tkDiszKoppint(k) {
  var m = TK.diszek[k]; if (!m) return;
  var d = tkDiszAdat(m.a.tip);
  m.d.classList.remove("rezeg"); void m.d.offsetWidth; m.d.classList.add("rezeg");
  hangCsilla();
  if (k.indexOf(FELHO.uid + "/") === 0) mondd("Ez a te díszed!");
  else if (d) mondd(m.a.nev + " " + d.nevRag + ".");
}
function tkDiszNezd() {   /* „Nézd, Lili virága!” — ha egyedül van, de mások díszei kint vannak */
  var dbk = {}, elso = {};
  Object.keys(TK.diszek).forEach(function (k) {
    var uid = k.split("/")[0], a = TK.diszek[k].a; if (uid === FELHO.uid) return;
    dbk[a.nev] = (dbk[a.nev] || 0) + 1; if (!elso[a.nev]) elso[a.nev] = a.tip;
  });
  var nev = Object.keys(dbk)[0]; if (!nev) return "";
  var d = tkDiszAdat(elso[nev]);
  return "Nézd, " + nev + " " + (dbk[nev] > 1 || !d ? "díszei" : d.nevRag) + "!";
}

/* ── a szoba díszei (élő) ── */
function tkDiszekJott(snap) {
  if (!TK.bent) return;
  var v = snap.val() || {}, uj = {}, kont = $("tk-unik");
  Object.keys(v).forEach(function (uid) {
    var sor = v[uid] || {};
    Object.keys(sor).forEach(function (hely) { var a = sor[hely]; if (a && tkDiszAdat(a.tip)) uj[uid + "/" + hely] = a; });
  });
  Object.keys(TK.diszek).forEach(function (k) {   /* eltűnt: elpakolták / a producer törölte */
    if (uj[k] && uj[k].tip === TK.diszek[k].a.tip) return;
    var d = TK.diszek[k].d; delete TK.diszek[k];
    d.classList.add("eltunik");
    setTimeout(function () { if (d.parentNode) d.parentNode.removeChild(d); }, 450);
  });
  Object.keys(uj).forEach(function (k) {
    var a = uj[k], m = TK.diszek[k], sajat = k.indexOf(FELHO.uid + "/") === 0;
    if (m) { if (m.a.x !== a.x || m.a.y !== a.y) tkDiszPoz(m.d, +a.x, +a.y); m.a = a; return; }
    var d = el("div", "tk-disz" + (sajat ? " sajat" : ""));
    d.setAttribute("data-k", k);
    d.innerHTML = tkDiszSVG(a.tip, "tk-disz-kep") + (sajat ? '<button class="tk-disz-x" aria-label="Elpakolás">✕</button>' : "");
    tkDiszPoz(d, +a.x || 50, +a.y || 80);
    if (TK.dBetoltve) d.classList.add("terem");
    if (kont) kont.appendChild(d);
    TK.diszek[k] = { a: a, d: d };
  });
  TK.dBetoltve = true;
  tkTalcaRajzol(); tkSugo();
}
function tkDiszPoz(d, x, y) {
  d.style.left = x + "%";
  d.style.bottom = (100 - y) + "%";
  d.style.setProperty("--s", tkMeret(y).toFixed(3));
  d.style.zIndex = Math.round(y * 10) - 1;   /* ugyanazon a mélységen az unikornis elé kerül */
}

/* ── a producer törölt egy díszt → visszajár a 💧 ── */
function tkVisszaJott(snap) {
  var v = snap.val() || {}, ar = Math.max(0, Math.min(99, +v.ar || 0)), tip = String(v.tip || "");
  snap.ref.remove().then(function () {   /* előbb törlünk, csak utána írunk jóvá — így nem jár kétszer */
    P().tunderharmat = (P().tunderharmat || 0) + ar;
    var vett = tkDiszVett(); if (vett[tip]) vett[tip] = Math.max(0, vett[tip] - 1);
    ment();
    var hm = $("tk-harmat"); if (hm) hm.textContent = P().tunderharmat || 0;
    if (TK.bent && ar) { mondd("Visszakaptál " + ar + " tündérharmatot."); tkTalcaRajzol(); }
  }).catch(tkHiba);
}
