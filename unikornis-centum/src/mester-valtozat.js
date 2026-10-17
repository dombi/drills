/* ============ 3f2) 🏅 MESTERPRÓBA-VÁLTOZATOK — a közös szabály: eredeti vagy számváltozat, visszatérés ============
   Terv: Matekos\mesterproba-valtozatok-terv.html (✅ 2026-10-17). A változatok előre gyártva (versenyfeladatok\polc_mester_valtozatok.py
   → fejtoro-mesterproba-polc-valtozatok.json, a pult 🏔️ Fejtörő fülén): a felhőben versenyFeladatok/{alapId}-vNN → FT.valt[alapId].
   EGY szabály minden Mesterpróbának (most az 📚 olvasó-polc köti be; később a 🧺 szerszám- és a 📌 kötött Mesterpróba is):
     · amíg van még nem látott Mesterpróba a listában → az jön, EREDETIBEN (a lista sorrendjében);
     · ha mindet látta → a legrégebben látott jön, SZÁMVÁLTOZATBAN (a változatok sorban, a végén elölről — ugyanazt csak
       akkor kapja újra, ha már mindet látta); ha nincs (alkalmas) változat → marad az eredeti;
     · VISSZATÉRÉS: minden végigjárt Bagolykönyvtár-pálya (polc + szerszám, a Mesterpróba maga nem) +1; ha eléri a határt
       (8–12, sorsolva; pultról később állítható: FELULIR.mvVissza, alap 10), esedékes lesz a legrégebben látott KIÁLLT
       Mesterpróba. Változatban jön, minden 3. visszatérésnél eredetiben. Csak annak, akinek már van kiállt Mesterpróbája.
     · rossz → semmi büntetés; a kocka megmarad; legközelebb a következő változat jön.
   3. kód-kör (meghívás, fényesedő kocka, pult-kártya): az esedékes visszatérőt a könyvtári pálya végképernyője kínálja fel
   („🏅 Egy régi Mesterpróba visszatért!” a Következő helyén, nem kötelező, megvárja: mvMeghivas), a 🏰 Kockavárban addig a kocka
   pislog (mvVarJel). Jól megoldva a kocka kifényesedik (✦ = hányszor sikerült visszatérőként) + fél jutalom (MV_VISSZA_CSILLA ✨ +
   MV_VISSZA_HARMAT 💧). A gyakoriság a pult 🧱 fülén: szerszam.mv (gyerekenként / csoportra, szerszam.js szerszamBeall().mv).

   Állapot: P().mv = { s: látás-sorszám (minden látás +1), j: végigjárt pályák a legutóbbi visszatérés óta, h: a mostani határ,
     e: esedékes alapId | "", vn: hány visszatérés volt eddig,
     f: { alapId: { l: utolsó látás sorszáma, n: hányszor látta, v: a következő változat indexe, ok: hányszor sikerült önállóan,
                    u: utoljára változat-id | "" (eredeti), fv: hányszor sikerült VISSZATÉRŐKÉNT (a kocka ✦ jele) } },
     vl: [ { d: nap, fid, v: változat-id | "", ok: 1 | 0 | nincs (még nem ért véget) } … ] — a visszatérések naplója a pultnak (utolsó 20) }
   Régi gyerekeknél az első híváskor a P().szerszam…mh-ból töltődik (amit már látott, az látottnak számít; az „o” = kiállt). */

var MV_ALAP = 10;                 /* hány végigjárt pályánként jön vissza egy kiállt Mesterpróba (±2) */
var MV_VISSZA_CSILLA = 5;         /* jól megoldott visszatérő: a Mesterpróba-jutalom fele (EK_MESTER_CSILLA 10, EK_MESTER_HARMAT 2) */
var MV_VISSZA_HARMAT = 1;
/* a bekötött Mesterpróba-listák: lista() → [alapId…] (a visszatérés ezekből választ) · o.palya(fid) → melyik pálya indítja ·
   o.hely(fid) → a kocka helye a Kockavárban (EK_KOCKAK index) — a meghívás és a pislogó / fényes kocka ezekből tudja, hová nyúljon */
var MV_FORRAS = [];
function mvForras(fn, o) { MV_FORRAS.push({ lista: fn, palya: (o && o.palya) || null, hely: (o && o.hely) || null }); }
function mvForrasBol(fid, mit) {
  for (var i = 0; i < MV_FORRAS.length; i++) { var F = MV_FORRAS[i]; if (F[mit] && (F.lista() || []).indexOf(fid) >= 0) return F[mit](fid); }
  return null;
}

function mvAll() {
  var p = P();
  if (!p.mv || typeof p.mv !== "object") { p.mv = { s: 0, j: 0, h: 0, e: "", vn: 0, f: {} }; mvRegiBe(p.mv); }
  if (!p.mv.f || typeof p.mv.f !== "object") p.mv.f = {};
  return p.mv;
}
/* a mai napig elhasznált Mesterpróbák (szerszam.js mh: { fid: { d, e } }) → látottnak, a nap sorrendjében */
function mvRegiBe(m) {
  var t = (typeof szerszamTar === "function" && szerszamTar().t) || {}, L = [];
  for (var sz in t) { var mh = t[sz] && t[sz].mh; for (var fid in mh || {}) L.push({ fid: fid, d: mh[fid].d || "", e: mh[fid].e }); }
  L.sort(function (a, b) { return a.d < b.d ? -1 : a.d > b.d ? 1 : 0; });
  L.forEach(function (x) { var r = m.f[x.fid] || (m.f[x.fid] = { l: 0, n: 0, v: 0, ok: 0, u: "" }); r.l = ++m.s; r.n++; if (x.e === "o") r.ok++; });
}
function mvRek(fid) { var f = mvAll().f; return f[fid] || (f[fid] = { l: 0, n: 0, v: 0, ok: 0, u: "" }); }
function mvHatarAlap() { var n = typeof szerszamBeall === "function" ? +szerszamBeall().mv : 0; return n >= 3 ? Math.round(n) : MV_ALAP; }
function mvUjHatar() { var n = mvHatarAlap(); return veletlen(Math.max(2, n - 2), n + 2); }

/* alkalmas változatok: van felhőben, és (ha a hívó kéri) megfelel a jo(v) feltételnek — pl. a polcon csak „polc” mezős */
function mvValtozatok(fid, jo) { return ((typeof FT !== "undefined" && FT.valt && FT.valt[fid]) || []).filter(function (v) { return !jo || jo(v); }); }

/* ── melyik jöjjön, és milyen formában ──
   lista: [alapId…] (csak a betöltöttek számítanak) · o.jo: változat-szűrő · o.vissza: a visszatérő is ebből a listából jöhet (alap: igen)
   → { fid, F: a feladat (eredeti vagy változat), valt: a változat | null, vissza: visszatérő-e } | null */
function mvValaszt(lista, o) {
  o = o || {};
  var L = (lista || []).filter(function (id) { return !!(FT.feladatok && FT.feladatok[id]); });
  if (!L.length) return null;
  var m = mvAll(), fid = null, vissza = false;
  if (o.vissza !== false && m.e && L.indexOf(m.e) >= 0) { fid = m.e; vissza = true; }
  if (!fid) for (var i = 0; i < L.length; i++) if (!(m.f[L[i]] && m.f[L[i]].n)) { fid = L[i]; break; }
  if (!fid) fid = L.slice().sort(function (a, b) { return m.f[a].l - m.f[b].l; })[0];
  var r = m.f[fid], valt = null;
  var eredeti = !r || !r.n || (vissza && (m.vn + 1) % 3 === 0);
  if (!eredeti) {
    var V = mvValtozatok(fid, o.jo);
    if (V.length) valt = V[(r.v || 0) % V.length];
  }
  return { fid: fid, F: valt || FT.feladatok[fid], valt: valt, vissza: vissza };
}
/* a Mesterpróba elindult (a választás után azonnal): látottnak jegyzi, lépteti a változatot, a visszatérést lezárja */
function mvLatta(v) {
  if (!v || !v.fid) return;
  var m = mvAll(), r = mvRek(v.fid);
  r.l = ++m.s; r.n++; r.u = v.valt ? v.valt.id : "";
  if (v.valt) r.v = (r.v || 0) + 1;
  if (v.vissza) {
    m.vn++; m.e = ""; m.j = 0; m.h = mvUjHatar();
    m.vl = (m.vl || []).concat([{ d: typeof helyiNap === "function" ? helyiNap() : "", fid: v.fid, v: v.valt ? v.valt.id : "" }]).slice(-20);
  }
  if (typeof esemeny === "function") esemeny("mester_valtozat", { fid: v.fid, valtozat: v.valt ? v.valt.id : "", vissza: v.vissza ? 1 : 0 });
  if (typeof ment === "function") ment();
}
/* a Mesterpróba eredménye: jo = önállóan sikerült (a jelzés utáni javítás is; lift / végigvezetés nem) ·
   vissza: visszatérőként jött → a naplóba, és jó esetben a kocka fényesedik (fv). Visszaad: hányszor sikerült visszatérőként. */
function mvEredmeny(fid, jo, vissza) {
  if (!fid) return 0;
  var r = mvRek(fid), m = mvAll();
  if (jo) r.ok++;
  if (vissza) {
    if (jo) r.fv = (r.fv || 0) + 1;
    var vl = m.vl || [], x = vl[vl.length - 1];
    if (x && x.fid === fid && x.ok == null) x.ok = jo ? 1 : 0;
  }
  if (typeof ment === "function") ment();
  return r.fv || 0;
}

/* kiállt (legalább egyszer önállóan sikerült) Mesterpróbák a bekötött listákból, a legrégebben látott elöl */
function mvKiallt() {
  var m = mvAll(), L = [];
  MV_FORRAS.forEach(function (F) { (F.lista() || []).forEach(function (id) { if (L.indexOf(id) < 0 && m.f[id] && m.f[id].ok > 0 && FT.feladatok[id]) L.push(id); }); });
  return L.sort(function (a, b) { return m.f[a].l - m.f[b].l; });
}
/* egy végigjárt Bagolykönyvtár-pálya (palyaVege hívja; a Mesterpróbát nem) → számláló; határnál esedékes a legrégebbi kiállt */
function mvJatekVege() {
  var m = mvAll();
  if (m.e) return;                                     /* már vár egy visszatérő: a számláló áll, amíg elő nem jön */
  var K = mvKiallt();
  if (!K.length) return;                               /* még nincs kiállt Mesterpróba: nincs mi visszajöjjön */
  if (!m.h) m.h = mvUjHatar();
  m.j = (m.j || 0) + 1;
  if (m.j >= m.h) m.e = K[0];
}
/* ami most vár (a meghívás és a pislogó kocka ezt olvassa) */
function mvEsedekes() { var m = mvAll(); return m.e && FT.feladatok && FT.feladatok[m.e] ? m.e : ""; }

/* ── 3. kód-kör: a meghívás ── az esedékes visszatérő pályája (ha látszik) — a végképernyő és a Kockavár gombja ezt indítja */
function mvMeghivas() {
  var fid = mvEsedekes(), pid = fid && mvForrasBol(fid, "palya"), pa = pid && typeof palyaKeres === "function" ? palyaKeres(pid) : null;
  return pa && !(typeof palyaRejtve === "function" && palyaRejtve(pa)) ? pa.id : null;
}
var MV_MEGHIV_GOMB = "🏅 Egy régi Mesterpróba visszatért!";
var MV_MEGHIV_MONDAT = "Egy régi Mesterpróba visszatért! Emlékszel még a trükkre?";
/* a meghívás indítása: az arany kapun át (konyvtar-terem.js bktMesterKapu) */
function mvMeghivasIndit(pid) {
  if (!pid) return;
  if (typeof bktMesterKapu === "function") bktMesterKapu(function () { palyaInditas(pid); }); else palyaInditas(pid);
}

/* ── a 🏰 Kockavár jelei ── feny: { hely: hányszor sikerült visszatérőként (✦) } · pislog: a várakozó visszatérő kockája | null */
function mvVarJel() {
  var m = mvAll(), feny = {}, e = mvEsedekes(), pislog = e ? mvForrasBol(e, "hely") : null;
  for (var fid in m.f) {
    var n = m.f[fid].fv || 0, h = n ? mvForrasBol(fid, "hely") : null;
    if (h != null) feny[h] = (feny[h] || 0) + n;
  }
  return { feny: feny, pislog: pislog == null ? null : pislog };
}
