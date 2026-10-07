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
   Visszahívás 3. kör (2026-10-06): a gyakPalyaVege a varázstojást is lépteti (leny.js lenyPalyaVege), a hír-sornak
   új forrása van („leny”). A lelet MINDEN pályavégén megtörténhet (ha még nincs tojás), a lépcsők csak új gyakorlós napon.
   Visszahívás 2. kör (2026-10-06, terv/visszahivas-rendszerterv.html): LÁTHATATLANUL bővül, a gyerek semmit nem lát:
     • visszaHir(opc): KÖZÖS hír-sor az ösvény végére (palyaVege, ftVege). A források egy adat-táblában (VISSZA_HIR),
       sorrendben; most a Tény-kert hírei, később a tojás, a felhő, a levél, a pecsét. Legfeljebb egy „holnapra” mondat.
     • napiHatar(tar, n) / napiMarad(tar, n): „naponta legfeljebb n” (pl. 3 felhő a kalandtérképen).
     • visszaTar(p): a mentés-ágak (P().posta, .uni, .leny2, .het) — a mentes.js profilNormal-ja hívja.
     • hetPecset(): gyakorlós naponként egy pecsét a hét kártyáján (P().het[hétAzon]); sosem nullázódik.
     • visszaAllapot(p): egy helyen, mi vár a gyerekre (gyakorlás, hét, levél, igény, lény, kert) — a pultnak, a hír-sornak.
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
  var uj = gyakLep();
  lenyPalyaVege(uj);      /* 🥚 a varázstojás: az első pályavégén lelet, aztán gyakorlós naponként egy lépcső (leny.js) */
  if (!uj) return false;
  tenyKertNyit();
  tenyKertRitkaErik();    /* 🌰 a ritka mag egy lépcsővel tovább érik a dombon (teny-kert.js, 6. kör) */
  tenyKertMeglepetes();   /* „amíg nem voltál itt”: a kertben vár valami új (teny-kert.js, 5. kör) */
  hetPecset();            /* 📅 a hét kártyáján egy pecsét (az ösvény végén és az odú falán látszik, het.js) */
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

/* ── naponta legfeljebb n (pl. felhőfújás) ─────────────────────────────────────
   tar.napi = { nap, db }: ma hányat használt el. Másnap magától újra n jár; a fel nem használt nem gyűlik. */
function napiMarad(tar, n, ma) {
  ma = ma == null ? tenyNap() : ma;
  var d = tar && tar.napi;
  return Math.max(0, n - (d && d.nap === ma ? d.db || 0 : 0));
}
/* igaz, ha még belefért (és el is számolta); hamis, ha mára elfogyott */
function napiHatar(tar, n) {
  var ma = tenyNap();
  if (!napiMarad(tar, n, ma)) return false;
  if (!tar.napi || tar.napi.nap !== ma) tar.napi = { nap: ma, db: 0 };
  tar.napi.db++;
  return true;
}

/* ── a visszahívás mentés-ágai (terv/visszahivas-rendszerterv.html, „Mentés és adat”) ──────────────
   Gyerekenként és unikornisonként (P()), mint minden gondozás. A mentes.js profilNormal-ja hívja.
     posta: { meg, megSz } a napi levél (meglepetesSor), pult: [{ id, szoveg, kitol, olvasva }], vendeg, album: []
     uni:   { etel, jatek, apol } = a legutóbbi gondozás napja (tenyNap; null = még soha) → igeny();
            sziv = barátság (csak nő), szivNap = melyik napon kapott utoljára gondozásért, kedvenc = megtalálta-e, kosar = { id: db }
     leny2: a kis lény; fazis "" = még nincs tojás, aztán "tojas" | "fioka" | "kaland" | "kolyok" | "nagy";
            t = a fázis kezdő gyakorlós napja (erik), terkep: { tiszta: [táj-id], jog, napi: { nap, db }, hol, bagoly },
            kepeslap: [táj-id], pikkely: [táj-id] (kaland.js, 4. kör)
     het:   { [hetAzon]: [tenyNap, …] } — a hét pecsétjei (melyik napon); minden hét megmarad. (A 2. kör még számot
            írt: azt itt alakítjuk át, a régi pecsétek napja null = a nevük nélkül látszanak.) */
function visszaTar(p) {
  p = p || P();
  if (!p.posta || typeof p.posta !== "object") p.posta = {};
  var po = p.posta;
  if (!Array.isArray(po.pult)) po.pult = [];
  if (!Array.isArray(po.album)) po.album = [];
  if (po.vendeg === undefined) po.vendeg = null;
  if (!p.uni || typeof p.uni !== "object") p.uni = {};
  var u = p.uni;
  ["etel", "jatek", "apol"].forEach(function (k) { if (typeof u[k] !== "number") u[k] = null; });
  if (typeof u.sziv !== "number") u.sziv = 0;
  if (typeof u.szivNap !== "number") u.szivNap = 0;
  if (typeof u.kedvenc !== "number") u.kedvenc = 0;
  if (!u.kosar || typeof u.kosar !== "object") u.kosar = {};
  if (!p.leny2 || typeof p.leny2 !== "object") p.leny2 = {};
  var l = p.leny2;
  if (typeof l.fazis !== "string") l.fazis = "";
  if (typeof l.faj !== "string") l.faj = "";
  if (typeof l.nev !== "string") l.nev = "";
  if (typeof l.t !== "number") l.t = 0;
  if (!l.terkep || typeof l.terkep !== "object") l.terkep = {};
  if (!Array.isArray(l.terkep.tiszta)) l.terkep.tiszta = [];
  if (!Array.isArray(l.kepeslap)) l.kepeslap = [];
  if (!Array.isArray(l.pikkely)) l.pikkely = [];
  if (typeof l.terkep.jog !== "number") l.terkep.jog = 0;
  if (typeof l.terkep.hol !== "string") l.terkep.hol = "k";
  if (typeof l.terkep.bagoly !== "number") l.terkep.bagoly = 0;
  if (!p.het || typeof p.het !== "object") p.het = {};
  Object.keys(p.het).forEach(function (k) {
    var v = p.het[k];
    if (typeof v === "number") { var a = []; for (var i = 0; i < v; i++) a.push(null); p.het[k] = a; }
    else if (!Array.isArray(v)) p.het[k] = [];
  });
  return p;
}

/* ── a heti kártya pecsétje ────────────────────────────────────────────────────
   hetAzon(nap) = annak a hétfőnek a tenyNap-ja, amelyik hetébe a nap esik (a 0. nap, 1970. jan. 1. csütörtök).
   A gyakPalyaVege hívja (naponta egyszer), így egy gyakorlós nap = egy pecsét. 4 = teljes hét; 5–7 is pecsét.
   Visszahívás 5. kör (2026-10-07): a teljes hét (a 4. pecsét) HET_TELJES_HARMAT 💧-t ad; a pecsét az ösvény végén és
   az odú falán látszik (het.js). HET_UJ = a ma ütött pecsét (az ösvény vége ebből rajzolja a pecsételést). */
var HET_TELJES = 4, HET_TELJES_HARMAT = 3;
var HET_UJ = null;   /* { k: hetAzon, n: hányadik pecsét, teljes, nap, mondva } — a hír-sor és az ösvény vége olvassa */
function hetAzon(nap) { nap = nap == null ? tenyNap() : nap; return nap - (((nap + 3) % 7) + 7) % 7; }
function hetPecset(p) {
  p = visszaTar(p);
  var h = p.het, k = hetAzon(), ma = tenyNap();
  if (!h[k]) h[k] = [];
  if (h[k].indexOf(ma) >= 0) return h[k].length;   /* egy napra egy pecsét */
  h[k].push(ma);
  var n = h[k].length, teljes = n === HET_TELJES;
  if (teljes) p.tunderharmat = (p.tunderharmat || 0) + HET_TELJES_HARMAT;   /* 🌟 teljes hét (rajzterv B, 3. döntés: most 💧, később csemege) */
  HET_UJ = { k: k, n: n, teljes: teljes, nap: ma, mondva: 0 };
  return n;
}
function hetDb(p, k) { var v = visszaTar(p).het[k == null ? hetAzon() : k]; return v ? v.length : 0; }
/* a hír-sor forrása: a ma ütött pecsét egyszer szól */
function hetHirek() {
  var u = HET_UJ;
  if (!u || u.mondva || u.nap !== tenyNap()) return [];
  u.mondva = 1;
  if (u.teljes) return [{ t: "🌟 Teljes hét a heti kártyán! +" + HET_TELJES_HARMAT + " 💧", szin: "#b0417a" }];
  return [{ t: u.n > HET_TELJES ? "🌈 Ráadás-pecsét a heti kártyán!" : "🐾 Új pecsét a heti kártyán!", szin: "#b0417a" }];
}

/* ── közös hír-sor az ösvény végére („mi lett ma jobb”) ───────────────────────────
   VISSZA_HIR: a források sorrendben (adat-tábla). Mindegyik fn(opc) → tömb: szöveg, vagy
   { t: szöveg, szin?: "#…", holnap?: 1 }. A „holnapra” kedvcsinálóból legfeljebb egy szól, a sor végén
   (csúcs–vég szabály). A forrás maga jegyzi meg, hogy már elmondta (egyszer szól).
   Új forrás (tojás, felhő, levél, pecsét) = egy új sor ebben a táblában. opc.hajt = új hajtások ezen az ösvényen. */
var VISSZA_HIR = [
  { id: "het", fn: function () { return hetHirek(); } },                     /* 🐾 heti kártya (5. kör) */
  { id: "kert", fn: function (o) { return tenyKertHirek(o.hajt || 0); } },   /* 🌸 Tény-kert (teny-kert.js) */
  { id: "leny", fn: function () { return lenyHirek(); } }                     /* 🥚 tojás, 🐣 fióka, 🦋 elröppenés, ☁️ felhő (leny.js, 3–4. kör) */
];
var VISSZA_HIR_SZIN = "#3f9e6a";
/* Visszaad: { sor, html, mondat } vagy null (nincs hír) */
function visszaHir(opc) {
  opc = opc || {};
  var sor = [], holnap = null;
  VISSZA_HIR.forEach(function (f) {
    var l = [];
    try { l = f.fn(opc) || []; } catch (e) { l = []; }   /* egy forrás hibája ne vigye el az ösvény végét */
    l.forEach(function (h) {
      if (typeof h === "string") h = { t: h };
      if (!h || !h.t) return;
      if (h.holnap) { if (!holnap) holnap = h; } else sor.push(h);
    });
  });
  if (holnap) sor.push(holnap);
  if (!sor.length) return null;
  var t = sor.map(function (h) { return h.t; });
  return {
    sor: t,
    html: sor.map(function (h) { return '<br><span style="color:' + (h.szin || VISSZA_HIR_SZIN) + ';font-weight:800">' + h.t + '</span>'; }).join(""),
    mondat: " " + t.join(" ").replace(/[\u{1F300}-\u{1FAFF}☀-➿️]/gu, "")   /* az emojik (és a ☁️-féle változat-jel) ne hangozzanak el */.replace(/\s+/g, " ").trim()
  };
}

/* ── mi vár a gyerekre? (a pultnak és a hír-sornak; a tenyKertAllapot mintájára) ─────────────
   p = profil (alap: P(); a pult a saját tárát adja). A hiányzó ágakat pótolja, mást nem állít át. */
function visszaAllapot(p) {
  p = visszaTar(p);
  var ma = tenyNap(), g = gyakTar(p), u = p.uni, l = p.leny2, K = p.tenyKert || {};
  return {
    gyak: { db: g.db || 0, ma: g.nap === ma, utolso: g.nap || null },
    het: { ez: (p.het[hetAzon(ma)] || []).length, hetek: Object.keys(p.het).length },
    posta: { var: meglepetesVar(p.posta), pult: p.posta.pult.filter(function (x) { return !x.olvasva; }).length },
    uni: { etel: igeny(u.etel), jatek: igeny(u.jatek), apol: igeny(u.apol), sziv: u.sziv, kedvenc: !!u.kedvenc },
    leny: { fazis: l.fazis, nev: l.nev, tiszta: l.terkep.tiszta.length, felho: l.terkep.jog, kepeslap: l.kepeslap.length, pikkely: l.pikkely.length },
    kert: { szomj: igeny(K.loc), meglepetes: meglepetesVar(K) }
  };
}
