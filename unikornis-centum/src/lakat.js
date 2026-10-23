/* ============ 12d3) 🔒 TITKOS KÓD — a lakat a legelő tábláján (Belépő legelő 3. kör, 2026-10-23) ============
   Terv: terv/belepo-legelo-rendszerterv.html 4.C–D, 6., 7. (✅). Nem kötelező: csak akinek a gyerek maga kér.
   A belépőnév marad a mai kód; a lakat a JÁTÉKBAN van (nem Firebase-jelszó): 3 kép 9-ből, sorban koppintva.
     • A tábla oszlopán belépve kis lakat lóg: nyitott = nincs titkos kód (koppintásra beállítható: 3 kép, aztán még
       egyszer ugyanaz); zárt = van (koppintásra előbb kinyitja a mostanival, utána cserélheti vagy leveheti).
     • Belépéskor (a belépő mezőbe beírt kód után, nettel vagy 📴 net nélkül) a nagy lakat jön a 9 képpel; jó sorrendre
       kattan, és jön a csillámfelhő. Rosszra megrázkódik; 5 rossz után egy percig pihen (újratöltés után is).
       „Elfelejtetted?” → „Ha elfelejtetted, szólj annak, akitől a belépődet kaptad.” A „Mégse” kilép (üres tábla).
     • BELÉPVE, DE ZÁRVA: amíg a lakat kérdez, a gép megjegyzi (uc_lakat_zarva) — ha a gyerek bezárja a böngészőt, és a
       belépése megmaradt (saját gép), legközelebb is a lakat jön, nem a választó. Aki belépve maradt, annak nem kell.
       A jel csak a sikeres nyitáskor törlődik (a Mégse kilép; ha a jel ott marad, másik gyereknél nem számít).
   ADAT: users/{uid}.lakat = { h: lenyomat (nem maguk a képek), ido } — a gyerek írja; levétel: h = null.
     A gép is őrzi gyerekenként (uc_lakat_<uid>, a kilépés után is — ez a „hátizsák” része): így net nélkül is kér.
     Net nélkül beállítva / levéve: k = 1 (még nem ment fel) → a következő felhő-állapotnál felmegy, ha újabb.
   PULT: producerConfig/{uid}.lakatLe = { ido } — „ezt a lakatot (és a korábbiakat) vedd le”. A gyerek órájának
     idejét hasonlítjuk a gyerek órájának idejéhez (a pult a users/{uid}.lakat.ido-t írja vissza) → az órák eltérése nem
     zavar. A levett lakat a gépen akkor tűnik el, amikor a játék legközelebb netet kap.
   ESEMÉNYEK (a pult figyelmeztetéséhez — „nem tudott belépni, elfelejtette?”):
     lakat_nyit { proba } · lakat_nemnyilt { proba, ok: "pihen" | "elfelejt" | "megse" | "bezart" } — egy lakat-próbánként
     okonként legfeljebb egyszer. A pult akkor figyelmeztet, ha a gyerek utolsó belépési próbája lakat_nemnyilt volt. */
var LAKAT_ELOTAG = "uc_lakat_", LAKAT_ZARVA = "uc_lakat_zarva", LAKAT_PIHEN = "uc_lakat_pihen";
var LAKAT_PIHEN_MS = 60000, LAKAT_HIBA_MAX = 5, LAKAT_VAR_MS = 6000;
var LAKAT = { friss: false, nyitva: null, tudjuk: null, pultLe: null, S: null, varT: null };
var LAKAT_KEP_SOR = ["csillag", "alma", "hold", "gomba", "virag", "sziv", "felho", "csepp", "level"];
var LAKAT_KEP_NEV = { csillag: "csillag", alma: "alma", hold: "hold", gomba: "gomba", virag: "virág", sziv: "szív", felho: "felhő", csepp: "csepp", level: "levél" };
var LAKAT_KEPEK = {
  csillag: function () { return csillagSVG(30, 32, 25, "#ffd24d").replace("<path", '<path stroke="#d9a93a" stroke-width="2" stroke-linejoin="round"'); },
  alma: function () { return '<path d="M30 19c-6-5-19-3-19 11 0 11 9 20 13 20 2 0 4-1 6-1s4 1 6 1c4 0 13-9 13-20 0-14-13-16-19-11z" fill="#ef6b6b" stroke="#b84a4a" stroke-width="2"/><path d="M30 19q0-6 4-10" stroke="#7a4a2a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M33 13q8-6 13 0q-7 5-13 0z" fill="#8fcf86" stroke="#5e9e5a" stroke-width="1.4"/><ellipse cx="21" cy="28" rx="3" ry="5" fill="#fff" opacity=".55"/>'; },
  hold: function () { return '<path d="M36 8a22 22 0 1 0 16 34a18 18 0 1 1-16-34z" fill="#fce49a" stroke="#d9a93a" stroke-width="2"/>'; },
  gomba: function () { return '<path d="M7 33q0-24 23-24t23 24z" fill="#ef6b6b" stroke="#b84a4a" stroke-width="2"/><circle cx="19" cy="25" r="3.6" fill="#fff"/><circle cx="32" cy="17" r="3.2" fill="#fff"/><circle cx="42" cy="27" r="3.6" fill="#fff"/><path d="M22 33h16v13q0 5-8 5t-8-5z" fill="#fff3e0" stroke="#c9a57a" stroke-width="2"/>'; },
  virag: function () { var s = '<g fill="#f6a5c0" stroke="#d0708f" stroke-width="1.6">'; for (var i = 0; i < 5; i++) { var a = i * 2 * Math.PI / 5 - Math.PI / 2; s += '<circle cx="' + (30 + 13 * Math.cos(a)).toFixed(1) + '" cy="' + (30 + 13 * Math.sin(a)).toFixed(1) + '" r="10"/>'; } return s + '</g><circle cx="30" cy="30" r="8" fill="#ffd24d" stroke="#d9a93a" stroke-width="1.6"/>'; },
  sziv: function () { return '<path d="M30 51C9 37 7 24 13 17c5-6 14-5 17 3c3-8 12-9 17-3c6 7 4 20-17 34z" fill="#f08bb0" stroke="#c0567f" stroke-width="2"/>'; },
  felho: function () { return '<path d="M15 44a10 10 0 0 1 1-20a13 13 0 0 1 25-4a11 11 0 0 1 4 24z" fill="#fff" stroke="#9e8cc8" stroke-width="2.6"/>'; },
  csepp: function () { return '<path d="M30 7q16 21 16 30a16 16 0 0 1-32 0q0-9 16-30z" fill="#9ec9f0" stroke="#4f8fc0" stroke-width="2"/><ellipse cx="23" cy="36" rx="3.2" ry="6" fill="#fff" opacity=".7"/>'; },
  level: function () { return '<path d="M9 50Q7 13 50 9Q53 48 9 50z" fill="#a7d99a" stroke="#5e9e5a" stroke-width="2"/><path d="M11 48Q28 31 46 13" stroke="#5e9e5a" stroke-width="2" fill="none"/>'; }
};
var LAKAT_MONDAT = {
  kerdes: "Szeretnél titkos kódot? Akkor csak te tudsz belépni!", valaszt: "Válassz 3 képet!", ujra: "Még egyszer ugyanazt!",
  nyit: "Nyisd ki a lakatodat!", nyitCsere: "Nyisd ki a mostani képeiddel!", menu: "Mit szeretnél?",
  nemUgyanaz: "Nem ugyanaz volt. Kezdjük újra!", kinyilt: "Kinyílt!", kesz: "Kész a titkos kódod!", jegyezd: "Jegyezd meg jól a képeidet!",
  levettuk: "Levettük a lakatot.", pihen: "Pihenjünk egy kicsit, aztán próbáld újra!", elfelejt: "Ha elfelejtetted, szólj annak, akitől a belépődet kaptad."
};

function lakatKep(id) { return '<svg viewBox="0 0 60 60">' + LAKAT_KEPEK[id]() + '</svg>'; }
/* a lakat (a tábla oszlopán kicsiben, a panelen nagyban); viewBox 0 -16 80 104 */
function lakatSVG(zart) {
  return '<g class="lg-keng' + (zart ? "" : " nyitva") + '"><path d="M24 40V27a16 16 0 0 1 32 0v13" fill="none" stroke="#a8a1b8" stroke-width="8" stroke-linecap="round"/><path d="M24 40V27a16 16 0 0 1 32 0v13" fill="none" stroke="#d6d0e2" stroke-width="3" stroke-linecap="round"/></g>' +
    '<rect x="12" y="38" width="56" height="44" rx="11" fill="#f0b93a" stroke="#a87a1c" stroke-width="3"/>' +
    '<path d="M18 46h44" stroke="#f8d77a" stroke-width="3" stroke-linecap="round"/>' +
    '<path d="M40 70C30 63 29 57 32 54c2-3 6-2 8 1c2-3 6-4 8-1c3 3 2 9-8 16z" fill="#e0417a" opacity=".85"/>';
}

/* ── adat ── */
function lakatUid() { return FELHO.aktiv ? FELHO.uid : FELHO.offline ? FELHO.offline.uid : null; }
function lakatOlvas(uid) { try { var r = JSON.parse(localStorage.getItem(LAKAT_ELOTAG + uid) || "null"); return r && typeof r.ido === "number" ? r : null; } catch (e) { return null; } }
function lakatIr(uid, r) { try { if (r) localStorage.setItem(LAKAT_ELOTAG + uid, JSON.stringify(r)); else localStorage.removeItem(LAKAT_ELOTAG + uid); } catch (e) {} }
function lakatVan(uid) { var r = uid && lakatOlvas(uid); return !!(r && r.h); }
/* a lenyomat: a gyerek azonosítója + a 3 kép sorrendje → rövid szám (a képek maguk sehol nincsenek eltéve) */
function lakatLenyomat(uid, sor) {
  var s = "uc-lakat|" + uid + "|" + sor.join(","), h = 2166136261;
  for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  return h.toString(36);
}
/* új állapot (h = lenyomat vagy null = levéve): a gépre, és ha van net, a felhőbe */
function lakatBeallit(uid, h) {
  var r = { h: h, ido: Date.now() };
  if (FELHO.aktiv && FELHO.uid === uid && FELHO.db) felhoUserRef().set({ lakat: r }, { merge: true }).catch(function (e) { console.warn("[lakat] mentés hiba:", e.code || e); });
  else r.k = 1;   /* 📴 net nélkül: a következő felhő-állapotnál felmegy */
  lakatIr(uid, r);
}
/* a felhőből jött users/{uid}.lakat (db.js): a gépen őrzött, még fel nem ment újabb állapot nyer, különben a felhőé */
function lakatFelhobol(uid, c) {
  var l = lakatOlvas(uid);
  if (l && l.k && (!c || !(c.ido > l.ido))) {
    var r = { h: l.h || null, ido: l.ido };
    felhoUserRef().set({ lakat: r }, { merge: true }).catch(function () {});
    lakatIr(uid, r);
  } else if (c && typeof c.ido === "number") lakatIr(uid, { h: c.h || null, ido: c.ido });
  else if (!c) lakatIr(uid, null);
  LAKAT.tudjuk = uid;
  lakatPultEllenoriz();
  lakatValtozott();
}
/* producerConfig/{uid}.lakatLe (config.js) */
function lakatPultLe(le) { LAKAT.pultLe = le && typeof le.ido === "number" ? le : null; lakatPultEllenoriz(); lakatValtozott(); }
function lakatPultEllenoriz() {
  var uid = FELHO.aktiv && FELHO.uid, r = uid && lakatOlvas(uid);
  if (!r || !r.h || !LAKAT.pultLe || LAKAT.pultLe.ido < r.ido || LAKAT.tudjuk !== uid) return;
  lakatBeallit(uid, null);   /* a pult levette */
}
/* belépve, de zárva */
function lakatZarvaUid() { try { return localStorage.getItem(LAKAT_ZARVA); } catch (e) { return null; } }
function lakatZarvaJegyez(uid) { try { if (uid) localStorage.setItem(LAKAT_ZARVA, uid); else localStorage.removeItem(LAKAT_ZARVA); } catch (e) {} }
function lakatPihenIg(uid) { try { var p = JSON.parse(localStorage.getItem(LAKAT_PIHEN) || "null"); return p && p.uid === uid && p.ig > Date.now() ? p.ig : 0; } catch (e) { return 0; } }
function lakatPihenJegyez(uid, ig) { try { if (ig) localStorage.setItem(LAKAT_PIHEN, JSON.stringify({ uid: uid, ig: ig })); else localStorage.removeItem(LAKAT_PIHEN); } catch (e) {} }

/* ── kapu a belépés után (nyitokep.js nyitoFrissit, legelo.js legeloNyit): true = a lakat kérdez (vagy még várjuk, van-e) ── */
function lakatKapu() {
  var uid = lakatUid() || felhoGazda();
  if (!uid || LAKAT.nyitva === uid) return false;
  var zarva = lakatZarvaUid() === uid;
  if (!LAKAT.friss && !zarva) return false;          /* belépve maradt: nem kell kinyitnia */
  if (FELHO.aktiv && LAKAT.tudjuk !== uid && !zarva) {   /* nettel: megvárjuk a felhőt, van-e lakatja (legfeljebb pár másodpercig) */
    if (!LAKAT.varT) LAKAT.varT = setTimeout(function () { LAKAT.tudjuk = uid; LAKAT.varT = null; lakatValtozott(); }, LAKAT_VAR_MS);
    return true;
  }
  if (!lakatVan(uid)) { LAKAT.nyitva = uid; LAKAT.friss = false; if (zarva) lakatZarvaJegyez(null); return false; }
  lakatZarvaJegyez(uid);
  if (!LAKAT.S || LAKAT.S.mod !== "belep") {
    if (NYITO.mod !== "belepo" || LEGELO.mod !== "belepo") legeloBelepo();
    lakatPanel("belep");
  }
  return true;
}
/* a lakat állapota változott (felhő, pult, idő) */
function lakatValtozott() {
  var S = LAKAT.S, uid = lakatUid();
  if (S && S.mod === "belep" && uid && !lakatVan(uid) && (LAKAT.tudjuk === uid || !FELHO.aktiv)) { S.kinyit(true); return; }   /* a pult közben levette */
  lakatKisFrissit();
  if (!S && $("kepernyo-nyito").classList.contains("aktiv") && NYITO.mod === "belepo") nyitoFrissit();
}
/* a nyitás sikerült (vagy a pult levette): tovább a csillámfelhőre */
function lakatBelepKesz(uid) {
  LAKAT.nyitva = lakatUid() || uid; LAKAT.friss = false;
  lakatZarvaJegyez(null); lakatPihenJegyez(uid, 0);
  nyitoFrissit();
}

/* ── a kis lakat a tábla oszlopán (legelo.js legeloTablaBelso; csak belépve, felhős gyereknél) ── */
function lakatKisG() {
  var uid = lakatUid();
  if (!uid) return "";
  return '<g transform="translate(0 -46)"><g class="lg-kislakat"><g transform="scale(.42) translate(-40 -14)">' + lakatSVG(lakatVan(uid)) + '</g></g></g>' +
    '<rect class="lg-kislakat-fog" x="-22" y="-52" width="44" height="44" fill="transparent"/>';
}
function lakatKisFrissit() {
  var k = LEGELO.svg && LEGELO.svg.querySelector(".lg-kislakat > g"), uid = lakatUid();
  if (k && uid) k.innerHTML = lakatSVG(lakatVan(uid));
}
function lakatKisKopp() {
  var uid = lakatUid();
  if (!uid || LEGELO.valaszt || LEGELO.felho || LAKAT.S) return;
  hangGomb();
  lakatPanel(lakatVan(uid) ? "csere" : "beallit");
}

/* ── a lakat-panel: mod "beallit" (nincs még) | "csere" (van: előbb kinyitja) | "belep" (belépéskor) ── */
function lakatPanel(mod) {
  var host = $("nyito-szin"), uid = lakatUid() || felhoGazda();
  var p = host.querySelector(".lg-panel");
  if (!p) {
    p = el("div", "lg-panel");
    p.innerHTML = '<div class="lg-lap" role="dialog" aria-label="Titkos kód"><button class="lg-x" aria-label="Bezár">✖</button><svg class="lg-nagylakat" viewBox="0 -16 80 104"></svg>' +
      '<div class="lg-szov"></div><div class="lg-helyek"><span></span><span></span><span></span></div><div class="lg-racs"></div><div class="lg-gombok"></div></div>';
    host.appendChild(p);
  }
  var nagy = p.querySelector(".lg-nagylakat"), szov = p.querySelector(".lg-szov"), helyek = p.querySelector(".lg-helyek"), racs = p.querySelector(".lg-racs"), gombok = p.querySelector(".lg-gombok");
  var S = { mod: mod, lep: mod === "beallit" ? "kerdes" : "nyit", sor: [], elso: null, hiba: 0, pihenT: null, jelzett: {}, vege: false };
  LAKAT.S = S;
  belepoRejt(); nyBubEl(host);
  racs.innerHTML = LAKAT_KEP_SOR.map(function (id) { return '<button data-k="' + id + '" aria-label="' + LAKAT_KEP_NEV[id] + '">' + lakatKep(id) + '</button>'; }).join("");
  racs.querySelectorAll("button").forEach(function (b) { b.addEventListener("click", function () { valaszt(b); }); });
  p.querySelector(".lg-x").onclick = function () { hangGomb(); megse(); };
  function anim(c) { nagy.classList.remove("razkod", "kattan"); void nagy.getBoundingClientRect(); nagy.classList.add(c); }
  function lakat(zart) { nagy.innerHTML = lakatSVG(zart); }
  function mond(t) { szov.textContent = t; mondd(t); }
  function rajzol() {
    var l = S.lep, kell = l === "nyit" || l === "valaszt" || l === "ujra";
    mond({ kerdes: LAKAT_MONDAT.kerdes, nyit: S.mod === "csere" ? LAKAT_MONDAT.nyitCsere : LAKAT_MONDAT.nyit, valaszt: LAKAT_MONDAT.valaszt, ujra: LAKAT_MONDAT.ujra, menu: LAKAT_MONDAT.menu }[l]);
    racs.hidden = helyek.hidden = !kell;
    helyekRajz();
    gombok.innerHTML = "";
    if (l === "kerdes") { gomb("🔒 Igen, kérek", function () { S.lep = "valaszt"; rajzol(); }); gomb("Most nem", megse, true); }
    if (l === "nyit" && S.mod === "belep") {
      var e = el("button", "lg-elfelejt"); e.textContent = "Elfelejtetted?";
      e.onclick = function () { hangGomb(); mond(LAKAT_MONDAT.elfelejt); jelez("elfelejt"); };
      gombok.appendChild(e);
      gomb("Mégse", megse, true);
    }
    if (l === "menu") {
      gomb("🔄 Új képeket választok", function () { S.lep = "valaszt"; S.mod = "beallit"; rajzol(); });
      gomb("🔓 Leveszem a lakatot", function () { lakatBeallit(uid, null); bezar(); lakatKisFrissit(); legeloSzolEgy(LAKAT_MONDAT.levettuk, 4); }, true);
      gomb("Mégse", megse, true);
    }
    var ig = lakatPihenIg(uid);
    if (kell && S.lep === "nyit" && ig) pihen(ig);
  }
  function gomb(t, fn, masod) { var b = el("button", masod ? "masod" : ""); b.textContent = t; b.onclick = function () { hangGomb(); fn(); }; gombok.appendChild(b); }
  function helyekRajz() { helyek.querySelectorAll("span").forEach(function (sp, i) { sp.innerHTML = S.sor[i] ? lakatKep(S.sor[i]) : ""; }); }
  function valaszt(b) {
    if (S.vege || S.pihenT || S.sor.length >= 3) return;
    hangGomb();
    b.classList.add("nyomva"); setTimeout(function () { b.classList.remove("nyomva"); }, 160);
    S.sor.push(b.dataset.k); helyekRajz();
    if (S.sor.length === 3) setTimeout(ellenoriz, window.__UC_GYORS ? 0 : 380);
  }
  function pihen(ig) {
    racs.classList.add("pihen"); mond(LAKAT_MONDAT.pihen);
    clearTimeout(S.pihenT);
    S.pihenT = setTimeout(function () { S.pihenT = null; S.hiba = 0; racs.classList.remove("pihen"); if (LAKAT.S === S) rajzol(); }, Math.max(0, ig - Date.now()));
  }
  /* a pult figyelmeztetéséhez: okonként egyszer egy próbán belül */
  function jelez(ok) { if (S.mod !== "belep" || S.jelzett[ok]) return; S.jelzett[ok] = 1; esemeny("lakat_nemnyilt", { proba: S.hiba, ok: ok }); }
  S.kinyit = function (pult) {
    if (S.vege) return;
    S.vege = true; clearTimeout(S.pihenT); racs.classList.remove("pihen");
    lakat(false); anim("kattan"); hangJo(); mond(LAKAT_MONDAT.kinyilt); racs.hidden = helyek.hidden = true; gombok.innerHTML = "";
    if (S.mod === "belep") esemeny("lakat_nyit", { proba: S.hiba, pult: pult ? 1 : 0 });
    setTimeout(function () {
      if (LAKAT.S !== S) return;
      if (S.mod === "belep") { bezar(); lakatBelepKesz(uid); }
      else { S.vege = false; S.lep = "menu"; S.sor = []; rajzol(); }
    }, window.__UC_GYORS ? 0 : 900);
  };
  function ellenoriz() {
    if (LAKAT.S !== S) return;
    if (S.lep === "nyit") {
      var r = lakatOlvas(uid);
      if (r && r.h === lakatLenyomat(uid, S.sor)) { S.kinyit(false); return; }
      anim("razkod"); hangHiba(); S.hiba++; S.sor = []; helyekRajz();
      if (S.hiba >= LAKAT_HIBA_MAX) { var ig = Date.now() + LAKAT_PIHEN_MS; lakatPihenJegyez(uid, ig); pihen(ig); jelez("pihen"); }
      return;
    }
    if (S.lep === "valaszt") { S.elso = S.sor; S.sor = []; S.lep = "ujra"; rajzol(); return; }
    if (S.lep === "ujra") {
      if (S.elso && S.sor.join() === S.elso.join()) {
        lakatBeallit(uid, lakatLenyomat(uid, S.sor));
        S.vege = true; lakat(true); anim("kattan"); hangJo(); mond(LAKAT_MONDAT.kesz); racs.hidden = helyek.hidden = true; gombok.innerHTML = "";
        setTimeout(function () { if (LAKAT.S !== S) return; bezar(); lakatKisFrissit(); legeloSzolEgy(LAKAT_MONDAT.jegyezd, 4); }, window.__UC_GYORS ? 0 : 1100);
      } else {
        mond(LAKAT_MONDAT.nemUgyanaz); S.sor = []; S.elso = null; S.lep = "valaszt"; helyekRajz();
        setTimeout(function () { if (LAKAT.S === S) rajzol(); }, window.__UC_GYORS ? 0 : 1300);
      }
    }
  }
  /* belépéskor a Mégse kilép (üres tábla: talán nem is ő akart belépni); máskor csak bezárja a panelt */
  function megse() {
    if (S.vege) return;
    if (S.mod !== "belep") { bezar(); return; }
    if (FELHO.be && !FELHO.auth && !FELHO.offline) return;   /* a felhő még tölt: a kilépés csak utána lehet biztos (különben a megmaradt belépés zár nélkül engedne be) */
    jelez("megse");
    bezar();
    LAKAT.friss = false;   /* (a „belépve, de zárva” jel marad: ha a kilépés nem sikerülne, a lakat jön vissza) */
    felhoKilep();
  }
  function bezar() { clearTimeout(S.pihenT); p.hidden = true; if (LAKAT.S === S) LAKAT.S = null; }
  lakat(S.lep === "nyit");
  p.hidden = false;
  rajzol();
}
/* ha a gyerek a nyitott lakat mellett bezárja a lapot: ez is „nem nyílt ki” (a pult jele) */
window.addEventListener("pagehide", function () {
  var S = LAKAT.S;
  if (S && S.mod === "belep" && !S.vege && !S.jelzett.megse && !S.jelzett.pihen && !S.jelzett.elfelejt) { S.jelzett.bezart = 1; esemeny("lakat_nemnyilt", { proba: S.hiba, ok: "bezart" }); }
});
