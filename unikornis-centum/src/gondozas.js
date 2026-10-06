/* ============ 3c) 🌱 GONDOZÁS — a visszatérés közös alapja (terv/teny-kert-tamagocsi-terv.html) ============
   Nem a kerté, hanem a visszahívásé: MINDEN gondozás és „mikor jött vissza” ezen megy át — most a Tény-kert
   virágai és a ritka mag, később a varázstojás, a kissárkány-térkép, az unikornis éhsége/álmossága és a levelek.
   Így nincs külön kerti, unikornisos és sárkányos visszatérés-logika, csak egy.

   3. kör (2026-10-05): LÁTHATATLANUL fut, a gyerek még semmit nem lát. 5. kör (2026-10-06): a Tény-kert gondozása
   (teny-kert.js) erre épül: szomjúság = igeny(K.loc), napi meglepetés = meglepetesSor (a gyakPalyaVege indítja).
     • gyakorlós nap (P().gyak = { db, nap }): olyan helyi naptári nap (tenyNap), amelyen legalább egy pályát
       végigjátszott. A palyaVege lépteti (gyakLep), naponta egyszer. A P().napok marad a Visszatérő jelvényé.
     • igeny(utolso, fokok): „szomjúság”-féle igény puha felső határral: 0 → 1 → 2, ennél sosem rosszabb.
     • meglepetesSor(tar, tabla): a napi meglepetés — naponta legfeljebb egy, és legfeljebb egy gyűlik össze.
     • erik(obj, lepcsok): gyakorlós napokon érő dolog (mag → csíra → levelek → bimbó → virág); a kimaradt nap
       nem ront rajta, ott vár, ahol volt.
   Tiltólista (visszahivas-tamagocsi): nincs hervadás, büntetés, lenullázódó számláló, „csak ma!”.
   A pult is betölti (admin/index.html) — itt a P()-t használó függvények mind kaphatnak saját tárat. */

/* ── gyakorlós nap ─────────────────────────────────────────────────────────── */
function gyakTar(p) {
  p = p || P();
  if (!p.gyak || typeof p.gyak !== "object") p.gyak = { db: 0, nap: 0 };
  return p.gyak;
}
function gyakNap(p) { return gyakTar(p).db || 0; }            /* hányadik gyakorlós napnál tart (0 = még egy sem volt) */
function gyakMa(p) { return gyakTar(p).nap === tenyNap(); }    /* volt-e ma már végigjátszott pálya */
/* a palyaVege hívja: igaz, ha ez a nap első végigjátszott pályája (új gyakorlós nap kezdődött) */
function gyakLep(p) {
  var g = gyakTar(p), ma = tenyNap();
  if (g.nap === ma) return false;
  g.db = (g.db || 0) + 1;
  g.nap = ma;
  return true;
}

/* egy végigjátszott pálya vége (palyaVege, a Fejtörő-hegy ftVege): ha ez a nap első pályája, itt indul minden,
   ami gyakorlós napra vár — most a bimbók nyílása, később a napi meglepetés és a ritka mag érése. */
function gyakPalyaVege() {
  if (!gyakLep()) return false;
  tenyKertNyit();
  tenyKertRitkaErik();    /* 🌰 a ritka mag egy lépcsővel tovább érik a dombon (teny-kert.js, 6. kör) */
  tenyKertMeglepetes();   /* „amíg nem voltál itt”: a kertben vár valami új (teny-kert.js, 5. kör) */
  return true;
}

/* ── igény (szomjúság, később éhség, álmosság, játékkedv) ──────────────────────
   utolso: a legutóbbi gondozás napja (tenyNap), null = még soha. 0 = jóllakott (aznap), ennél több nap után
   1, 2… de legfeljebb `fokok` (alap 2): aki egy hétig nem jött, annál sem rosszabb, mint két nap után. */
function igeny(utolso, fokok, ma) {
  fokok = fokok == null ? 2 : fokok;
  if (typeof utolso !== "number") return fokok;
  ma = ma == null ? tenyNap() : ma;
  return Math.max(0, Math.min(fokok, ma - utolso));
}

/* ── a napi meglepetés („amíg nem voltál itt”) ──────────────────────────────────
   A nap első végigjátszott pályája után hívd (gyakLep() === true). tar = a meglepetés gazdája (pl. P().tenyKert):
   tar.meg = { nap, tip, id, kesz }, tar.megSz = hányadik volt a sorban. tabla = [{ tip, id, felt?(tar) }, …]
   (adat-tábla, sorban, körbe; a felt-tel egy elem kimaradhat). opc.elore = soron kívüli elem (pl. az új ritka mag).
   Legfeljebb egy gyűlik: amíg a régi nincs kész (felfedezve), nem jön új — aki egy hétig nem jött, egyet talál. */
function meglepetesSor(tar, tabla, opc) {
  opc = opc || {};
  var ma = tenyNap(), m = tar.meg;
  if (m && !m.kesz) return null;                  /* a régi még vár */
  if (m && m.nap === ma) return null;             /* naponta legfeljebb egy */
  var t = opc.elore || null;
  if (!t) {
    var L = (tabla || []).filter(function (x) { return !x.felt || x.felt(tar); });
    if (!L.length) return null;
    t = L[(tar.megSz || 0) % L.length];
    tar.megSz = (tar.megSz || 0) + 1;
  }
  tar.meg = { nap: ma, tip: t.tip, id: t.id, kesz: 0 };
  return tar.meg;
}
function meglepetesVar(tar) { return !!(tar && tar.meg && !tar.meg.kesz); }   /* pl. a 🦋 a térképen, a Kert jelképén */
function meglepetesKesz(tar) { if (tar && tar.meg) tar.meg.kesz = 1; }        /* a gyerek megtalálta */

/* ── érés gyakorlós napokon ───────────────────────────────────────────────────
   obj.t = az ültetés gyakorlós-nap sorszáma (gyakNap() az ültetéskor). Minden további gyakorlós nap egy lépcső.
   lepcsok = pl. ["mag", "csira", "levelek", "bimbo", "virag"]. Visszaad: { i, nev, kesz }, és obj.g-be írja,
   hány gyakorlós napot ért (a pultnak, a visszahívásnak). A sorrend előre adott, semmi nem sorsolódik. */
function erik(obj, lepcsok, gy) {
  gy = gy == null ? gyakNap() : gy;
  var i = Math.max(0, Math.min(lepcsok.length - 1, gy - (obj.t || 0)));
  obj.g = i;
  return { i: i, nev: lepcsok[i], kesz: i === lepcsok.length - 1 };
}
