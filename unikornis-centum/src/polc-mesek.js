/* ============ 6r) 📚 OLVASÓ-POLC MESÉI — a 🔎 „Mire felelsz?” és a ✋ „Ez már a válasz?” polc mese-keretei ============
   Tartalom: Matekos\regi-kockak-konyvtar-tartalom.html 4. és 5. pont (✅ döntések, 2026-10-10). A motor: olvaso-polc.js.
   Minden keret egy generátor: PM_KERET[id](o) → egy „mese” (vagy null → új számok), o = { tek, kis, egy, lanc, nyomoz }:
     tek    📜 Varázstekercs (hosszabb mese, számok ≤ 100) · különben 📖 Mesekönyv (számok ≤ 30)
     kis    a ✋ lift kicsije: ugyanaz a mese kisebb számokkal · egy: a 🔢 „Hány lépés?” pár 1 lépéses tagja
     lanc   🔗 két kérdés egy mesében (🔎 Tekercs) · nyomoz: 🕵️ elbújt kérdés / ál-kérdés (🔎 Tekercs)
   A mese mezői:
     mondatok [html] · kerdes · helyes · szo (a kérdezett szó) · rajz (jobb lap) · kulcs
     oe = { szo, koztes: {n: jelentés | {m}}, masik: {n: {m}}, csap: {n: {m, jelol:[mondat, "rész"]}} }  ← olvaso-ellenor.js étlapja
     lep [{ k: kérdés, v: érték, m: művelet, nev: a köztes szám jelentése }] — a 🪜 lépcsőfok, a végigvezetés és a ✋ lift ebből épül
     mit [jó, …] — a végigvezetés „Mit kérdeznek?” kártyái · kirol / mitK [{h, jo}] — a 👀 / 🧮 forma kártyái
     kicsi { mondatok, kerdes, helyes, oe, vissza } — a 🔎 lift: a nagy feladat első lépése, más kérdéssel
     lanc { kerdes, helyes, oe, lep } — a 🔗 második kérdése · al { mondat: mondat } — az ál-kérdés saját mondata
   Tiszta csapdák: ha egy csapda-szám egyezik a jó válasszal vagy egy másik, más jelentésű csapdával → null (a motor új számokat húz).
   Mondat-szabály (tartalom-lap 2. pont): egyik mondat sem végződik számmal és ponttal; tegezés; pénz: tallér. */

var PM_TARGY = [
  { n: "dió", t: "diót", e: "🌰", ige: "gyűjtött", tobb: "gyűjtöttek", i: "dióit" },
  { n: "gomba", t: "gombát", e: "🍄", ige: "talált", tobb: "találtak", i: "gombáit" },
  { n: "alma", t: "almát", e: "🍎", ige: "szedett", tobb: "szedtek", i: "almáit" },
  { n: "virág", t: "virágot", e: "🌼", ige: "szedett", tobb: "szedtek", i: "virágait" },
  { n: "tojás", t: "tojást", e: "🥚", ige: "talált", tobb: "találtak", i: "tojásait" }
];
function pmR(o, m, t) { var a = o.tek ? t : m; return ekR(a[0], o.kis ? Math.max(a[0], Math.floor((a[0] + a[1]) / 2)) : a[1]); }
function pmAz(sz) { return (/^[aáeéiíoóöőuúüű]/i.test(sz) ? "az " : "a ") + sz; }
function pmRajz(L) { return '<div class="pm-rajz">' + L.map(function (x) { return ekErem(x[0], x[1], x[2]); }).join("") + '</div>'; }
function pmSzam(t) { return (ekSima(t).match(/\d+/g) || []).map(Number); }
/* felszólítás a kérdésből: „Hány lába van…?” → „Számold ki, hány lába van…!” */
function pmFelszolit(k) { return "Számold ki, " + k.charAt(0).toLowerCase() + k.slice(1).replace(/\?$/, "!"); }
/* az étlap egy listából: [szám, "k" | "m" | "c", jelentés | {m, jelol}] — ütközésnél null */
function pmEtlap(helyes, szo, L) {
  var o = { szo: szo, koztes: {}, masik: {}, csap: {} }, volt = {};
  for (var i = 0; i < L.length; i++) {
    var n = L[i][0], f = L[i][1];
    if (n == null || n <= 0 || n % 1) continue;
    if (n === helyes || volt[n]) return null;
    volt[n] = 1;
    o[{ k: "koztes", m: "masik", c: "csap" }[f]][n] = L[i][2];
  }
  return o;
}
/* a kész mese ellenőrzése: számkör, mondatvég, étlap */
function pmKesz(o, M) {
  if (!M || !M.oe || !(M.helyes > 0) || M.helyes % 1) return null;
  var max = o.tek ? 100 : 30, rossz = false;
  M.mondatok.concat([M.kerdes]).forEach(function (s) {
    pmSzam(s).forEach(function (n) { if (n > max) rossz = true; });
    if (/\d\.\s*$/.test(ekSima(s))) rossz = true;
  });
  if (M.helyes > max) rossz = true;
  (M.lep || []).forEach(function (l) { if (!(l.v > 0) || l.v % 1 || l.v > max) rossz = true; });
  if (M.lanc && (!M.lanc.oe || M.lanc.helyes > max)) rossz = true;
  if (M.kicsi && !M.kicsi.oe) rossz = true;
  return rossz ? null : M;
}

/* ═════════════════ 🔎 MIRE FELELSZ? — hat keret ═════════════════ */
var PM_KERES = {
  /* 🧺 gyűjtés: két szereplő, „-val több / kevesebb” */
  gyujt: function (o) {
    var S = ekSzereplok(3), A = S[0], B = S[1], C = S[2], t = ekE(PM_TARGY), a = pmR(o, [6, 13], [15, 40]), k = pmR(o, [2, 6], [3, 15]), tobb = ekR(0, 2) > 0;
    var b = tobb ? a + k : a - k, TK = tobb ? "többet" : "kevesebbet", NT = tobb ? "kevesebbet" : "többet", rossz = tobb ? a - k : a + k;
    if (b < 2) return null;
    var q = o.lanc ? "B" : ekE(["B", "egyutt"]);
    var M = { keret: "gyujt", mondatok: [A.n + " " + a + " " + t.t + " " + t.ige + ".", B.n + " " + ekRag(k, "val") + " " + TK + " " + t.ige + ", mint " + A.n + "."],
      rajz: pmRajz([[A.e, a, A.n], [B.e, "?", B.n]]), kulcs: "gy" + a + k + tobb };
    var kB = "Hány " + t.t + " " + t.ige + " " + B.n + "?", csapK = [k, "c", { m: ekA(k, true) + " nem " + t.n + "-darab: ennyivel " + t.ige + " " + TK + " " + B.n + ".", jelol: [1, ekRag(k, "val") + " " + TK] }],
        csapI = [rossz, "c", { m: B.n + " " + TK + " " + t.ige + ", nem " + NT + ".", jelol: [1, TK] }];
    var specB = { kerdes: kB, helyes: b, oe: pmEtlap(b, B.n, [[a, "m", { m: ekA(a, true) + " " + A.n + " " + t.i.replace(/t$/, "") + ". De kiről kérdeztünk?" }], csapK, csapI,
        [a + b, "m", { m: ekA(a + b, true) + " kettejük együtt. De csak " + B.n + " " + t.i + " kérdeztük." }]]),
      lep: [{ k: kB, v: b, m: a + (tobb ? " + " : " − ") + k + " = " + b, nev: "ennyi " + t.t + " " + t.ige + " " + B.n }] };
    var kE = "Hány " + t.t + " " + t.tobb + " ketten együtt?";
    var specE = { kerdes: kE, helyes: a + b, oe: pmEtlap(a + b, "ketten együtt", [[b, "k", "ennyi " + t.t + " " + t.ige + " " + B.n], [a, "m", { m: ekA(a, true) + " " + A.n + " " + t.i.replace(/t$/, "") + ". Kettejüket kérdeztük!" }],
        csapK, [a + rossz, "c", csapI[2]]]),
      lep: [specB.lep[0], { k: "És ketten együtt?", v: a + b, m: a + " + " + b + " = " + (a + b) }] };
    if (q === "B") {
      M.kerdes = specB.kerdes; M.helyes = b; M.oe = specB.oe; M.lep = specB.lep; M.szo = B.n;
      M.mit = [B.n + " " + t.i, A.n + " " + t.i, "kettejük " + t.i + " együtt"];
      M.kirol = [{ h: ekTk(A.e, A.n) }, { h: ekTk(B.e, B.n), jo: 1 }, { h: ekTk("👫", "ketten együtt") }];
      M.kicsi = { mondatok: M.mondatok, kerdes: "Hány " + t.t + " " + t.ige + " " + A.n + "?", helyes: a, oe: pmEtlap(a, A.n, [[b, "m", { m: ekA(b, true) + " lenne " + B.n + " része. Most " + A.t + " kérdeztük!" }]]),
        vissza: "Ügyes! Most " + B.t + " kérdezzük." };
      if (o.lanc && specE.oe) { M.lanc = specE; delete specE.oe.koztes[b]; specE.oe.masik[b] = { m: "Ez az előző kérdés válasza volt. Most mit kérdeztünk?" }; specE.kerdes = "És hány " + t.t + " " + t.tobb + " ketten együtt?"; specE.lep = [specE.lep[1]]; specE.mit = ["kettejük " + t.i + " együtt", B.n + " " + t.i, A.n + " " + t.i]; }
    } else {
      M.kerdes = specE.kerdes; M.helyes = a + b; M.oe = specE.oe; M.lep = specE.lep; M.szo = "ketten együtt";
      M.mit = ["kettejük " + t.i + " együtt", B.n + " " + t.i, A.n + " " + t.i];
      M.kirol = [{ h: ekTk(A.e, A.n) }, { h: ekTk(B.e, B.n) }, { h: ekTk("👫", "ketten együtt"), jo: 1 }];
      M.kicsi = { mondatok: M.mondatok, kerdes: kB, helyes: b, oe: specB.oe, vissza: "Ügyes! És most mindkettőjüket kérdezzük." };
    }
    if (o.nyomoz) { M.mondatok[0] = C.n + " megszámolta, hány " + t.t + " " + t.ige + " " + A.n + ": " + a + " lett a vége."; M.al = { 0: "Ebben is van „hány”, de ez csak elmeséli, mit csinált " + C.n + ". Nekünk melyikre kell felelni?" }; }
    return M;
  },
  /* 🐾 udvar: kétlábú és négylábú állatok */
  udvar: function (o) {
    var K2 = ekE(EK_KET_LAB), K4 = ekE(EK_NEGY_LAB), t = pmR(o, [2, 6], [4, 15]), k = pmR(o, [2, 5], [3, 12]), C = ekE(EK_SZ);
    if (t === k) return null;
    var negy = o.lanc ? false : ekR(0, 1) === 1, Q = negy ? K4 : K2, Mx = negy ? K2 : K4, qn = negy ? k : t, ql = negy ? 4 : 2, mn = negy ? t : k, ml = negy ? 2 : 4;
    var M = { keret: "udvar", mondatok: ["Az udvaron " + t + " " + K2.n + " sétál.", "Mellettük " + k + " " + K4.n + " áll."], rajz: pmRajz([[K2.e, t, K2.n], [K4.e, k, K4.n]]), kulcs: "ud" + t + k + negy };
    var qi = negy ? 1 : 0;
    function spec(Q, qn, ql, M2, mn, ml, qi) {
      var kk = "Hány lába van a " + Q.nak + "?";
      return { kerdes: kk, helyes: qn * ql, szo: "a " + Q.nak,
        oe: pmEtlap(qn * ql, "a " + Q.nak, [[mn * ml, "m", { m: ekA(mn * ml, true) + " a " + M2.k + " lába. De kiről kérdeztünk?" }], [2 * t + 4 * k, "m", { m: ekA(2 * t + 4 * k, true) + " mindenki lába együtt. Mi csak a " + Q.k + " lábát kérdeztük." }],
          [qn, "c", { m: ekA(qn, true) + " a " + Q.k + " száma. De a lábukról kérdeztünk!", jelol: [qi, qn + " " + Q.n] }], [t + k, "c", { m: ekA(t + k, true) + " az összes állat. A " + Q.k + " lábát kérdeztük." }]]),
        lep: [{ k: "Hány lábon áll egy " + Q.n + "?", v: ql, nev: "ennyi lába van egyetlen állatnak" }, { k: "És a " + qn + " " + Q.n + "?", v: qn * ql, m: qn + " · " + ql + " = " + qn * ql }] };
    }
    var s = spec(Q, qn, ql, Mx, mn, ml, qi);
    M.kerdes = s.kerdes; M.helyes = s.helyes; M.szo = s.szo; M.oe = s.oe; M.lep = s.lep;
    M.mit = ["a " + Q.k + " lábát", "a " + Mx.k + " lábát", "mindenki lábát"];
    M.mitK = [{ h: ekTk(Q.e, Q.k) }, { h: ekTk("🦶", "lábak"), jo: 1 }, { h: ekTk("🐾", "minden állat") }];
    M.kicsi = { mondatok: M.mondatok, kerdes: "Hány " + Q.n + " van az udvaron?", helyes: qn, oe: pmEtlap(qn, Q.k, [[mn, "m", { m: ekA(mn, true) + " a " + Mx.k + " száma. A " + Q.k + " számát kérdeztük!" }]]), vissza: "Ügyes! Most a lábukat kérdezzük." };
    if (o.lanc) { var s2 = spec(K4, k, 4, K2, t, 2, 1); if (!s2.oe) return null; s2.kerdes = "És hány lába van a " + K4.nak + "?"; s2.oe.masik[2 * t] = { m: "Ez az előző kérdés válasza volt: a " + K2.k + " lába. Most a " + K4.k + " lábát kérdeztük." }; s2.mit = ["a " + K4.k + " lábát", "a " + K2.k + " lábát", "mindenki lábát"]; M.lanc = s2; }
    if (o.nyomoz) { M.mondatok[0] = C.n + " megszámolta, hány " + K2.n + " sétál az udvaron: " + t + " lett a vége."; M.al = { 0: "Ebben is van „hány”, de ez csak elmeséli, mit csinált " + C.n + ". Nekünk melyikre kell felelni?" }; }
    return M;
  },
  /* 📅 hét és nap */
  het: function (o) {
    var S = ekSzereplok(2), A = S[0], B = S[1], ket = o.lanc || o.tek ? true : ekR(0, 1) === 1;
    if (!ket) {
      var h = pmR(o, [2, 4], [2, 4]);
      return { keret: "het", mondatok: [A.n + " " + h + " hétig olvasott egy könyvet.", "Minden nap olvasott belőle egy kicsit."], kerdes: "Hány napig olvasta a könyvet?", helyes: 7 * h, szo: "napig", kulcs: "h1" + h,
        rajz: pmRajz([[A.e, h + " hét", A.n], ["☀️", "?", "nap"]]),
        oe: pmEtlap(7 * h, "napig", [[h, "m", { m: ekA(h, true) + " a hetek száma. De napokat kérdeztünk!" }], [h + 7, "c", { m: "Nem 7-tel több: " + h + " hétben " + ekRag(h, "szor") + " 7 nap van.", jelol: [0, h + " hétig"] }], [7, "c", { m: "A 7 csak EGY hét napjai." }]]),
        lep: [{ k: "Hány nap van egy hétben?", v: 7, nev: "ennyi nap van egy hétben" }, { k: "És " + h + " hétben?", v: 7 * h, m: h + " · 7 = " + 7 * h }],
        mit: ["hány napig olvasott", "hány hétig olvasott", "hány könyvet olvasott"],
        mitK: [{ h: ekTk("🗓️", "hetek") }, { h: ekTk("☀️", "napok"), jo: 1 }, { h: ekTk("📖", "könyvek") }],
        kicsi: { mondatok: [A.n + " " + h + " hétig olvasott egy könyvet.", "Minden nap olvasott belőle egy kicsit."], kerdes: "Hány nap van egy hétben?", helyes: 7, oe: pmEtlap(7, "egy hétben", []), vissza: "Ügyes! És " + h + " hétben hány nap van?" } };
    }
    var w = pmR(o, [1, 3], [2, 8]), d = ekR(3, 7 * w - 2), ny = ekE(["nyaralt", "táborozott"]);
    if (d === w) return null;
    var M = { keret: "het", mondatok: [A.n + " " + w + " hétig " + ny + ".", B.n + " " + d + " napig " + ny + "."], kulcs: "h2" + w + d,
      kerdes: "Hány nappal " + ny + " többet " + A.n + ", mint " + B.n + "?", helyes: 7 * w - d, szo: "hány nappal többet",
      rajz: pmRajz([[A.e, w + " hét", A.n], [B.e, d + " nap", B.n]]),
      oe: pmEtlap(7 * w - d, "hány nappal többet", [[7 * w, "k", "ennyi napig " + ny + " " + A.n], [d, "m", { m: ekA(d, true) + " " + B.n + " napjai. Mennyivel többet kérdeztünk." }], [w, "m", { m: ekA(w, true) + " " + A.n + " heteinek száma." }],
        [Math.abs(d - w), "c", { m: "A " + w + " hét nem " + w + " nap! Előbb váltsd napra.", jelol: [0, w + " hétig"] }], [7 * w + d, "c", { m: "Ez összeadás lett. Mennyivel TÖBB — ahhoz el kell venni." }]]),
      lep: [{ k: "Hány napig " + ny + " " + A.n + "?", v: 7 * w, m: w + " · 7 = " + 7 * w, nev: "ennyi napig " + ny + " " + A.n }, { k: "Mennyivel több ez, mint " + B.n + " napjai?", v: 7 * w - d, m: 7 * w + " − " + d + " = " + (7 * w - d) }],
      mit: ["mennyivel " + ny + " többet " + A.n, "hány napig " + ny + " " + A.n, "hány napig " + ny + " " + B.n],
      kirol: [{ h: ekTk(A.e, A.n) }, { h: ekTk(B.e, B.n) }, { h: ekTk("⚖️", "a kettő különbsége"), jo: 1 }],
      mitK: [{ h: ekTk("🗓️", "hetek") }, { h: ekTk("☀️", "napok"), jo: 1 }, { h: ekTk("👫", "gyerekek") }] };
    M.kicsi = { mondatok: M.mondatok, kerdes: "Hány napig " + ny + " " + A.n + "?", helyes: 7 * w, oe: pmEtlap(7 * w, "napig", [[w, "m", { m: ekA(w, true) + " a hetek száma. De napokat kérdeztünk!" }]]), vissza: "Ügyes! Most már napban tudod. Mennyivel több ez, mint " + B.n + " napjai?" };
    if (o.lanc) {
      if (!M.oe || !M.kicsi.oe) return null;
      M.kerdes = M.kicsi.kerdes; M.helyes = 7 * w; M.szo = "napig"; var regi = M.oe; M.oe = M.kicsi.oe; M.lep = [M.lep[0]];
      M.lanc = { kerdes: "És hány nappal " + ny + " többet " + A.n + ", mint " + B.n + "?", helyes: 7 * w - d, oe: regi, lep: [{ k: "Mennyivel több ez, mint " + B.n + " napjai?", v: 7 * w - d, m: 7 * w + " − " + d + " = " + (7 * w - d) }], mit: M.mit };
      M.lanc.oe.masik[7 * w] = { m: "Ez az előző kérdés válasza volt. Most azt kérdeztük, mennyivel több." }; delete M.lanc.oe.koztes[7 * w];
    }
    return M;
  },
  /* 🛒 bolt: egyforma tárgyak ára, „drágább / olcsóbb” */
  bolt: function (o) {
    var P = ekE([["ceruza", "ceruzák", "radír", "radírt"], ["kifli", "kiflik", "pogácsa", "pogácsát"], ["füzet", "füzetek", "matrica", "matricát"]]), X = P[0], Y = P[2];
    var n = pmR(o, [2, 4], [3, 5]), p = pmR(o, [2, 6], [4, 12]), d = pmR(o, [1, 4], [2, 6]), drag = ekR(0, 2) > 0, v = drag ? p + d : p - d, A = ekE(EK_SZ), DO = drag ? "drágább" : "olcsóbb";
    if (v < 1 || d === p) return null;
    var M = { keret: "bolt", mondatok: [n + " egyforma " + X + " " + n * p + " tallérba kerül.", "Egy " + Y + " " + d + " tallérral " + DO + ", mint egy " + X + "."], kulcs: "bo" + n + p + d + drag,
      kerdes: "Mennyibe kerül egy " + Y + "?", helyes: v, szo: "egy " + Y, rajz: pmRajz([["🛒", n * p, n + " " + X], ["🏷️", "?", "1 " + Y]]),
      oe: pmEtlap(v, "egy " + Y, [[p, "k", "ennyibe kerül egy " + X], [n * p + (drag ? d : -d), "c", { m: "A " + n + " " + X + " árával számoltál. A " + Y + " csak egyetlen " + X + " áránál " + DO + ".", jelol: [1, "mint egy " + X] }],
        [n * p, "m", { m: ekA(n * p, true) + " a " + n + " " + X + " együtt." }], [drag ? p - d : p + d, "c", { m: "A " + Y + " " + DO + ", nem " + (drag ? "olcsóbb" : "drágább") + ".", jelol: [1, DO] }]]),
      lep: [{ k: "Mennyibe kerül egy " + X + "?", v: p, m: n * p + " : " + n + " = " + p, nev: "ennyibe kerül egy " + X }, { k: "És egy " + Y + "?", v: v, m: p + (drag ? " + " : " − ") + d + " = " + v }],
      mit: ["egy " + Y + " árát", "egy " + X + " árát", "a " + n + " " + X + " árát"],
      kirol: [{ h: ekTk("✏️", "egy " + X) }, { h: ekTk("🏷️", "egy " + Y), jo: 1 }, { h: ekTk("🛒", "a " + n + " " + X) }] };
    M.kicsi = { mondatok: M.mondatok, kerdes: "Mennyibe kerül egy " + X + "?", helyes: p, oe: pmEtlap(p, "egy " + X, [[n * p, "m", { m: ekA(n * p, true) + " a " + n + " " + X + " együtt. De EGY " + X + " árát kérdeztük." }]]), vissza: "Ügyes! Most a " + Y + " árát kérdezzük." };
    if (o.lanc) {
      var m = ekR(2, 4);
      if (!M.oe || !M.kicsi.oe) return null;
      M.kerdes = M.kicsi.kerdes; M.helyes = p; M.szo = "egy " + X; var nagyOe = M.oe; M.oe = M.kicsi.oe; M.lep = [M.lep[0]];
      M.lanc = { kerdes: "És mennyibe kerül " + m + " " + Y + "?", helyes: m * v, oe: pmEtlap(m * v, m + " " + Y, [[v, "k", { m: "Ez egy lépcsőfok volt: EGY " + Y + " ára. De hány darabról kérdeztünk?" }], [p, "m", { m: "Ez az előző kérdés válasza volt. Most mit kérdeztünk?" }],
          [n * p, "m", { m: ekA(n * p, true) + " a " + n + " " + X + " ára. " + ekNagy(Y) + " árát kérdeztük!" }], [n * p + (drag ? d : -d), "c", nagyOe.csap[n * p + (drag ? d : -d)] || { m: "Egy " + X + " árából indulj!" }]]),
        lep: [{ k: "Mennyibe kerül egy " + Y + "?", v: v, m: p + (drag ? " + " : " − ") + d + " = " + v, nev: "ennyibe kerül EGY " + Y }, { k: "És " + m + " " + Y + "?", v: m * v, m: v + " · " + m + " = " + m * v }], mit: [m + " " + Y + " árát", "egy " + Y + " árát", "egy " + X + " árát"] };
    }
    if (o.nyomoz && M.oe) { M.mondatok.unshift(A.n + " megkérdezte az árust, mennyibe kerül a sok " + X + "."); M.al = { 0: "Ebben is van kérdés, de ez csak elmeséli, mit csinált " + A.n + ". Nekünk melyikre kell felelni?" };
      for (var cn in M.oe.csap) if (M.oe.csap[cn].jelol) M.oe.csap[cn].jelol[0]++; }
    return M;
  },
  /* 🏡 házsor: egymás után épít, az egyik idő hétben (🏅 Röfi házai kicsiben) */
  haz: function (o) {
    var A = ekE(EK_SZ);
    if (o.tek) {               /* három kunyhó (T2): a második fele / harmada az elsőnek */
      var r = ekE([2, 2, 3]), w = r === 2 ? ekE([2, 4]) : 3, e1 = 7 * w, e2 = e1 / r, y = ekR(3, 15), ossz = e1 + e2 + y, H = ["fakunyhót", "kőkunyhót", "nádkunyhót"], HN = ["fakunyhó", "kőkunyhó", "nádkunyhó"];
      if (ossz > 100) return null;
      var resz = r === 2 ? "feleannyi" : "harmad annyi";
      var M = { keret: "haz", mondatok: [A.n + " egymás után három kunyhót épített: egy fakunyhót, egy kőkunyhót és egy nádkunyhót.", "A fakunyhót " + w + " hét alatt építette fel.", "A kőkunyhóhoz " + resz + " idő kellett, mint a fakunyhóhoz.", "A három kunyhóhoz összesen " + ossz + " nap kellett."],
        kerdes: "Hány napig épült a nádkunyhó?", helyes: y, szo: "a nádkunyhó", kulcs: "ht" + w + r + y, rajz: pmRajz([["🪵", w + " hét", "fa"], ["🪨", "?", "kő"], ["🌾", "?", "nád"]]),
        oe: pmEtlap(y, "a nádkunyhó", [[e2, "m", { m: "A " + e2 + " a kőkunyhó ideje. A nádkunyhót kérdeztük!" }], [e1, "m", { m: "A " + e1 + " a fakunyhó ideje. A nádkunyhót kérdeztük!" }], [ossz - e2, "k", { m: "Ez egy lépcsőfok volt: csak a kőkunyhót vetted el. A fakunyhót is!" }],
          [e1 + e2, "k", { m: "Ez egy lépcsőfok volt: a fa- és a kőkunyhó együtt. Mennyi maradt a nádra?" }], [ossz - e1, "k", { m: "Ez egy lépcsőfok volt: ennyi nap maradt a kő- és a nádkunyhóra együtt." }],
          [ossz - w - e2, "c", { m: "A " + w + " hét nem " + w + " nap! " + w + " hét = " + e1 + " nap.", jelol: [1, w + " hét"] }]]),
        lep: [{ k: "Hány nap a " + w + " hét?", v: e1, m: w + " · 7 = " + e1, nev: "ennyi napig épült a fakunyhó" }, { k: "Hány napig épült a kőkunyhó?", v: e2, m: e1 + " : " + r + " = " + e2, nev: "ennyi napig épült a kőkunyhó" },
          { k: "Mennyi maradt a nádkunyhóra?", v: y, m: ossz + " − " + e1 + " − " + e2 + " = " + y }],
        mit: ["hány napig épült a nádkunyhó", "hány napig épült a kőkunyhó", "hány nap kellett összesen"] };
      M.kicsi = { mondatok: M.mondatok.slice(0, 3), kerdes: "Hány napig épült a kőkunyhó?", helyes: e2, oe: pmEtlap(e2, "a kőkunyhó", [[e1, "m", { m: "A " + e1 + " a fakunyhó ideje." }], [w, "c", { m: "A " + w + " hét nem " + w + " nap!" }]]), vissza: "Ügyes! Most a nádkunyhó jön: mennyi maradt rá?" };
      if (o.lanc) { if (!M.oe || !M.kicsi.oe) return null; var nagy = { kerdes: "És hány napig épült a nádkunyhó?", helyes: y, oe: M.oe, lep: [M.lep[2]], mit: M.mit }; nagy.oe.masik[e2] = { m: "Ez az előző kérdés válasza volt: a kőkunyhó. Most a nádkunyhót kérdeztük." };
        M.kerdes = M.kicsi.kerdes; M.helyes = e2; M.szo = "a kőkunyhó"; M.oe = M.kicsi.oe; M.lep = M.lep.slice(0, 2); M.lanc = nagy; }
      return M;
    }
    var T = ekE([["odút", "kamrát", "odú", "kamra"], ["hidat", "kaput", "híd", "kapu"], ["tutajt", "csónakot", "tutaj", "csónak"]]), h = pmR(o, [1, 2], [1, 2]), x = pmR(o, [2, 9], [2, 9]), ossz2 = 7 * h + x;
    var az1 = pmAz(T[2]), az2 = pmAz(T[3]);
    var M2 = { keret: "haz", mondatok: [A.n + " előbb egy " + T[0] + ", aztán egy " + T[1] + " épített.", ekNagy(pmAz(T[0])) + " " + h + " hét alatt építette fel.", "A két építéshez összesen " + ossz2 + " nap kellett."],
      kerdes: "Hány nap alatt építette fel " + pmAz(T[1]) + "?", helyes: x, szo: az2, kulcs: "hz" + h + x + T[2], rajz: pmRajz([[A.e, h + " hét", T[2]], ["🔨", "?", T[3]]]),
      oe: pmEtlap(x, az2, [[7 * h, "k", "ennyi napig épült " + az1], [ossz2 - h, "c", { m: "A " + h + " hét nem " + h + " nap! Előbb váltsd napra: hány nap a " + h + " hét?", jelol: [1, h + " hét"] }],
        [h, "m", { m: "A " + h + " " + az1 + " ideje, hétben. Mi " + pmAz(T[1]) + " kérdeztük, napban." }], [ossz2, "m", { m: ekA(ossz2, true) + " a két építés együtt." }], [ossz2 + 7 * h, "c", { m: ekNagy(az1) + " napjai benne vannak az összesben: elvenni kell, nem hozzáadni." }]]),
      lep: [{ k: "Hány nap a " + h + " hét?", v: 7 * h, m: h + " · 7 = " + 7 * h, nev: "ennyi napig épült " + az1 }, { k: "Mennyi nap maradt a másik építésre?", v: x, m: ossz2 + " − " + 7 * h + " = " + x }],
      mit: ["hány napig épült " + az2, "hány napig épült " + az1, "hány nap kellett összesen"],
      kirol: [{ h: ekTk("🔨", az1) }, { h: ekTk("🔨", az2), jo: 1 }, { h: ekTk("➕", "a kettő együtt") }] };
    M2.kicsi = { mondatok: [A.n + " " + h + " hét alatt építette fel " + pmAz(T[0]) + "."], kerdes: "Hány nap ez?", helyes: 7 * h, oe: pmEtlap(7 * h, "hány nap", [[h, "m", { m: ekA(h, true) + " a hetek száma. Napokat kérdeztünk!" }]]),
      vissza: "Ügyes! Most már napban tudod " + pmAz(T[0]) + ". Mennyi maradt a másik építésre?" };
    return M2;
  },
  /* ⚖️ csere: „… ára ugyanannyi, mint … ára” (🏅 csokigolyó és perec kicsiben) */
  csere: function (o) {
    var P = ekE([{ x: "körte", xt: "körtét", xk: "körték", y: "szilva", yk: "szilvák", yrol: "a szilváról" }, { x: "mézeskalács", xt: "mézeskalácsot", xk: "mézeskalácsok", y: "cukorka", yk: "cukorkák", yrol: "a cukorkáról" }, { x: "kifli", xt: "kiflit", xk: "kiflik", y: "keksz", yk: "kekszek", yrol: "a kekszről" }]);
    var A = ekE(EK_SZ);
    if (o.tek) {               /* elbújt adat (T4): az egyik fajta árát egy vásárlásból kell kiszámolni */
      var c = ekR(2, 6), b = ekR(3, 6), a = ekR(2, b - 1), xp = b * c / a, m = ekR(3, 6);
      if (xp % 1 || m === a || m * xp > 100 || xp === c) return null;
      var T2 = m * xp;
      var M = { keret: "csere", mondatok: ["A vásáron " + a + " " + P.x + " ára ugyanannyi, mint " + b + " " + P.y + " ára.", A.n + " " + m + " " + P.xt + " vett " + T2 + " tallérért."],
        kerdes: "Hány tallérba kerül egy " + P.y + "?", helyes: c, szo: "egy " + P.y, kulcs: "ct" + a + b + c + m, rajz: pmRajz([["⚖️", a + " = " + b, P.x + " / " + P.y], ["🏷️", "?", "1 " + P.y]]),
        oe: pmEtlap(c, "egy " + P.y, [[xp, "m", { m: ekA(xp, true) + " egy " + P.x.toUpperCase() + " ára. De " + P.yrol + " kérdeztünk!" }], [b * c, "k", "ennyibe kerül a " + b + " " + P.y + " együtt"], [T2, "m", { m: ekA(T2, true) + " a " + m + " " + P.x + " ára." }],
          [T2 / b % 1 ? null : T2 / b, "c", { m: "A " + T2 + " tallér " + m + " " + P.x + " ára, nem " + b + " " + P.y + "é. Előbb egy " + P.x + " ára kell." }]]),
        lep: [{ k: "Mennyibe kerül egy " + P.x + "?", v: xp, m: T2 + " : " + m + " = " + xp, nev: "ennyibe kerül egy " + P.x }, { k: "Mennyibe kerül " + a + " " + P.x + "?", v: a * xp, m: xp + " · " + a + " = " + a * xp, nev: "ennyibe kerül a " + b + " " + P.y + " együtt" },
          { k: "És egy " + P.y + "?", v: c, m: b * c + " : " + b + " = " + c }],
        mit: ["egy " + P.y + " árát", "egy " + P.x + " árát", "a " + m + " " + P.x + " árát"] };
      M.kicsi = { mondatok: [M.mondatok[1]], kerdes: "Mennyibe kerül egy " + P.x + "?", helyes: xp, oe: pmEtlap(xp, "egy " + P.x, [[T2, "m", { m: ekA(T2, true) + " a " + m + " " + P.x + " együtt." }]]), vissza: "Ügyes! Most a " + P.y + " jön: hány tallér egy?" };
      return M;
    }
    var s = pmR(o, [2, 4], [2, 4]), bb = pmR(o, [3, 8], [3, 8]), T = bb * s, aa = null;
    for (var i = 0; i < 6 && aa == null; i++) { var j = ekR(2, bb - 1); if (T % j === 0 && T / j !== s) aa = j; }
    if (aa == null || T > 30) return null;
    var M3 = { keret: "csere", mondatok: [aa + " " + P.x + " ára ugyanannyi, mint " + bb + " " + P.y + " ára.", "A " + aa + " " + P.x + " " + T + " tallérba kerül."], kerdes: "Hány tallérba kerül egy " + P.y + "?", helyes: s, szo: "egy " + P.y, kulcs: "cs" + aa + bb + s,
      rajz: pmRajz([["⚖️", aa + " = " + bb, P.x + " / " + P.y], ["🏷️", "?", "1 " + P.y]]),
      oe: pmEtlap(s, "egy " + P.y, [[T / aa, "m", { m: ekA(T / aa, true) + " egy " + P.x.toUpperCase() + " ára. De " + P.yrol + " kérdeztünk!" }], [T, "k", "ennyibe kerül a " + bb + " " + P.y + " együtt"],
        [bb, "c", { m: ekA(bb, true) + " a " + P.yk + " SZÁMA, nem az áruk.", jelol: [0, bb + " " + P.y] }], [aa, "c", { m: ekA(aa, true) + " a " + P.xk + " száma." }]]),
      lep: [{ k: "Mennyibe kerül a " + bb + " " + P.y + " együtt?", v: T, nev: "ennyibe kerül a " + bb + " " + P.y + " együtt" }, { k: "Mennyibe kerül egy " + P.y + "?", v: s, m: T + " : " + bb + " = " + s }],
      mit: ["egy " + P.y + " árát", "egy " + P.x + " árát", "a " + bb + " " + P.y + " árát együtt"],
      kirol: [{ h: ekTk("🏷️", "egy " + P.x) }, { h: ekTk("🏷️", "egy " + P.y), jo: 1 }, { h: ekTk("🛒", "a " + bb + " " + P.y) }] };
    M3.kicsi = { mondatok: [bb + " " + P.y + " " + T + " tallérba kerül."], kerdes: "Hány tallérba kerül egy " + P.y + "?", helyes: s, oe: pmEtlap(s, "egy " + P.y, [[T, "m", { m: ekA(T, true) + " a " + bb + " " + P.y + " együtt." }]]),
      vissza: "Ügyes! Nézd meg újra a nagyot: mennyibe kerül a " + bb + " " + P.y + "?" };
    return M3;
  }
};

/* ═════════════════ ✋ EZ MÁR A VÁLASZ? — hat keret ═════════════════ */
function pmLep(k, v, m, nev) { return { k: k, v: v, m: m, nev: nev }; }
var PM_VALASZ = {
  /* 🧺 kosár és evés */
  kosar: function (o) {
    var t = ekE([{ n: "alma", t: "almát", e: "🍎" }, { n: "körte", t: "körtét", e: "🍐" }, { n: "szilva", t: "szilvát", e: "🟣" }]), k = pmR(o, [4, 8], [6, 12]), n = pmR(o, [2, 4], [3, 6]), e = ekR(2, Math.min(9, k * n - 2)), S = ekSzereplok(2);
    if (o.egy) {
      var x = k * n;
      return { keret: "kosar", mondatok: ["Egy kosárban " + x + " " + t.n + " volt.", "Ebből " + e + " " + t.t + " megettünk."], kerdes: "Hány " + t.n + " maradt?", helyes: x - e, szo: "maradt", kulcs: "ke" + x + e,
        rajz: pmRajz([["🧺", x, t.n], [t.e, e, "megettük"]]), oe: pmEtlap(x - e, "maradt", [[x + e, "c", { m: "Megettük — el kell venni, nem hozzáadni!" }]]), lep: [pmLep("Hány " + t.n + " maradt?", x - e, x + " − " + e + " = " + (x - e))] };
    }
    if (o.tek) {
      var e2 = ekR(2, 9), ossz = k * n;
      if (ossz - e - e2 < 2 || e === e2) return null;
      return { keret: "kosar", mondatok: ["Egy kosárba " + k + " " + t.n + " fér.", "A kamrában " + n + " teli kosár áll.", S[0].n + " megevett belőle " + e + " darabot, " + S[1].n + " pedig " + e2 + " darabot."], kerdes: "Hány " + t.n + " maradt a kosarakban?", helyes: ossz - e - e2, szo: "maradt",
        kulcs: "kt" + k + n + e + e2, rajz: pmRajz([["🧺", n, "kosár"], [t.e, k, "egy kosárban"]]),
        oe: pmEtlap(ossz - e - e2, "maradt", [[ossz, "k", "ennyi " + t.n + " volt a kosarakban az evés előtt"], [ossz - e, "k", { m: "Ez egy lépcsőfok volt: ennyi maradt " + S[0].n + " után. De " + S[1].n + " is evett!" }], [ossz - e2, "k", { m: "Ez egy lépcsőfok volt: ennyi maradt " + S[1].n + " után. De " + S[0].n + " is evett!" }],
          [e + e2, "k", "ennyit ettek meg együtt"], [k - e - e2 > 0 ? k - e - e2 : null, "c", { m: "Nem egy kosárból, hanem " + n + " kosárból ettek!", jelol: [1, n + " teli kosár"] }]]),
        lep: [pmLep("Hány " + t.n + " volt a " + n + " kosárban?", ossz, n + " · " + k + " = " + ossz, "ennyi " + t.n + " volt az evés előtt"), pmLep("Hányat ettek meg ketten?", e + e2, e + " + " + e2 + " = " + (e + e2), "ennyit ettek meg együtt"), pmLep("Hány maradt?", ossz - e - e2, ossz + " − " + (e + e2) + " = " + (ossz - e - e2))] };
    }
    var kn = k * n;
    return { keret: "kosar", mondatok: ["Egy kosárba " + k + " " + t.n + " fér.", n + " teli kosárból " + e + " " + t.t + " megettünk."], kerdes: "Hány " + t.n + " maradt?", helyes: kn - e, szo: "maradt", kulcs: "kk" + k + n + e,
      rajz: pmRajz([["🧺", n, "kosár"], [t.e, k, "egy kosárban"]]),
      oe: pmEtlap(kn - e, "maradt", [[kn, "k", "ennyi " + t.n + " volt a kosarakban az evés előtt"], [k - e > 0 ? k - e : null, "c", { m: "Nem egy kosárból, hanem " + n + " kosárból ettünk!", jelol: [1, n + " teli kosárból"] }],
        [kn + e, "c", { m: "Megettük — el kell venni, nem hozzáadni!" }], [k, "c", { m: ekA(k, true) + " csak egy kosár." }]]),
      lep: [pmLep("Hány " + t.n + " volt a " + n + " kosárban?", kn, n + " · " + k + " = " + kn, "ennyi " + t.n + " volt az evés előtt"), pmLep("Megettünk " + ekRag(e, "t") + ". Hány maradt?", kn - e, kn + " − " + e + " = " + (kn - e))] };
  },
  /* 🎀 szalag */
  szalag: function (o) {
    var h = pmR(o, [20, 30], [60, 100]), n = pmR(o, [2, 3], [2, 4]), d = pmR(o, [3, 8], [6, 15]);
    if (o.egy) return h - d < 2 ? null : { keret: "szalag", mondatok: ["Egy szalag " + h + " cm hosszú.", "Levágtak belőle egy " + d + " cm-es darabot."], kerdes: "Hány cm maradt?", helyes: h - d, szo: "maradt", kulcs: "se" + h + d,
      rajz: pmRajz([["🎀", h + " cm", "szalag"], ["✂️", d + " cm", "levágva"]]), oe: pmEtlap(h - d, "maradt", [[h + d, "c", { m: "Levágták — el kell venni, nem hozzáadni!" }]]), lep: [pmLep("Hány cm maradt?", h - d, h + " − " + d + " = " + (h - d))] };
    if (o.tek) {
      var f = ekR(5, 12), mr = h - n * d - f;
      if (mr < 3) return null;
      return { keret: "szalag", mondatok: ["Egy szalag " + h + " cm hosszú.", "Levágtak belőle " + n + " darab " + d + " cm-es darabot.", "Aztán még egy " + f + " cm-es darabot is."], kerdes: "Hány cm maradt a szalagból?", helyes: mr, szo: "maradt", kulcs: "st" + h + n + d + f,
        rajz: pmRajz([["🎀", h + " cm", "szalag"], ["✂️", n + " × " + d + " cm", "levágva"], ["✂️", f + " cm", "még"]]),
        oe: pmEtlap(mr, "maradt", [[n * d, "k", "ennyi a " + n + " egyforma darab együtt"], [n * d + f, "k", "ennyit vágtak le összesen"], [h - n * d, "k", { m: "Ez egy lépcsőfok volt: ennyi maradt az első vágások után. De még egy darabot levágtak!" }],
          [h - d - f, "c", { m: n + " egyforma darabot vágtak le, nem egyet!", jelol: [1, n + " darab"] }]]),
        lep: [pmLep("Hány cm a " + n + " egyforma darab?", n * d, n + " · " + d + " = " + n * d, "ennyi a " + n + " egyforma darab együtt"), pmLep("Hány cm-t vágtak le összesen?", n * d + f, n * d + " + " + f + " = " + (n * d + f), "ennyit vágtak le összesen"), pmLep("Hány cm maradt?", mr, h + " − " + (n * d + f) + " = " + mr)] };
    }
    if (h - n * d < 2) return null;
    return { keret: "szalag", mondatok: ["Egy szalag " + h + " cm hosszú.", "Levágtak belőle " + n + " darab " + d + " cm-es darabot."], kerdes: "Hány cm maradt?", helyes: h - n * d, szo: "maradt", kulcs: "sz" + h + n + d,
      rajz: pmRajz([["🎀", h + " cm", "szalag"], ["✂️", n + " × " + d + " cm", "levágva"]]),
      oe: pmEtlap(h - n * d, "maradt", [[n * d, "k", "ennyi a levágott darabok hossza együtt"], [h - d, "c", { m: n + " darabot vágtak le, nem egyet!", jelol: [1, n + " darab"] }], [h + n * d, "c", { m: "Levágták — el kell venni, nem hozzáadni!" }]]),
      lep: [pmLep("Hány cm-t vágtak le összesen?", n * d, n + " · " + d + " = " + n * d, "ennyi a levágott darabok hossza együtt"), pmLep("Hány cm maradt?", h - n * d, h + " − " + n * d + " = " + (h - n * d))] };
  },
  /* 🎂 életkor */
  eletkor: function (o) {
    var A = ekE(EK_SZ), ev = pmR(o, [5, 9], [6, 9]), k = pmR(o, [2, 6], [2, 6]);
    if (o.egy) return { keret: "eletkor", mondatok: [A.n + " " + ev + " éves.", "A nővére " + k + " évvel idősebb nála."], kerdes: "Hány éves a nővére?", helyes: ev + k, szo: "a nővére", kulcs: "ee" + ev + k,
      rajz: pmRajz([[A.e, ev, A.n], ["🎂", "?", "nővére"]]), oe: pmEtlap(ev + k, "a nővére", [[ev - k, "c", { m: "A nővére idősebb, nem fiatalabb.", jelol: [1, "idősebb"] }]]), lep: [pmLep("Hány éves a nővére?", ev + k, ev + " + " + k + " = " + (ev + k))] };
    if (o.tek) {
      var k2 = ekR(1, ev - 2), nov = ev + k, occ = ev - k2, ossz = ev + nov + occ;
      return { keret: "eletkor", mondatok: [A.n + " " + ev + " éves.", "A nővére " + k + " évvel idősebb nála.", "Az öccse " + k2 + " évvel fiatalabb nála."], kerdes: "Hány évesek hárman együtt?", helyes: ossz, szo: "hárman együtt", kulcs: "et" + ev + k + k2,
        rajz: pmRajz([["🎂", "?", "nővére"], [A.e, ev, A.n], ["🍼", "?", "öccse"]]),
        oe: pmEtlap(ossz, "hárman együtt", [[nov, "k", "ennyi idős a nővére"], [occ, "k", "ennyi idős az öccse"], [ev + nov, "k", { m: "Ez egy lépcsőfok volt: " + A.n + " és a nővére együtt. Az öccse is kell!" }], [ev + occ, "k", { m: "Ez egy lépcsőfok volt: " + A.n + " és az öccse együtt. A nővére is kell!" }],
          [3 * ev + k + k2, "c", { m: "Az öccse fiatalabb, nem idősebb.", jelol: [2, "fiatalabb"] }]]),
        lep: [pmLep("Hány éves a nővére?", nov, ev + " + " + k + " = " + nov, "ennyi idős a nővére"), pmLep("Hány éves az öccse?", occ, ev + " − " + k2 + " = " + occ, "ennyi idős az öccse"), pmLep("Hány évesek hárman együtt?", ossz, ev + " + " + nov + " + " + occ + " = " + ossz)] };
    }
    return { keret: "eletkor", mondatok: [A.n + " " + ev + " éves.", "A nővére " + k + " évvel idősebb nála."], kerdes: "Hány évesek ketten együtt?", helyes: 2 * ev + k, szo: "ketten együtt", kulcs: "ek" + ev + k,
      rajz: pmRajz([[A.e, ev, A.n], ["🎂", "?", "nővére"]]),
      oe: pmEtlap(2 * ev + k, "ketten együtt", [[ev + k, "k", "ennyi idős a nővére"], [2 * ev - k, "c", { m: "A nővére idősebb, nem fiatalabb.", jelol: [1, "idősebb"] }], [ev + 2 * k, "c", { m: A.n + " " + ev + " éves, nem " + k + ". Kettejük éveit add össze!" }]]),
      lep: [pmLep("Hány éves a nővére?", ev + k, ev + " + " + k + " = " + (ev + k), "ennyi idős a nővére"), pmLep("Hány évesek ketten együtt?", 2 * ev + k, ev + " + " + (ev + k) + " = " + (2 * ev + k))] };
  },
  /* 🛒 vásár, maradt pénz */
  vasar: function (o) {
    var A = ekE(EK_SZ), p = pmR(o, [15, 30], [40, 100]), n = pmR(o, [2, 4], [3, 6]), ar = pmR(o, [2, 5], [3, 9]);
    if (o.egy) { var m = ekR(3, 9); return { keret: "vasar", mondatok: [A.n + " " + p + " tallérral ment a vásárba.", "Vett egy " + m + " talléros mézeskalácsot."], kerdes: "Mennyi pénze maradt?", helyes: p - m, szo: "maradt", kulcs: "ve" + p + m,
      rajz: pmRajz([[A.e, p, "tallér"], ["🍪", m, "tallér"]]), oe: pmEtlap(p - m, "maradt", [[p + m, "c", { m: A.n + " költött, nem kapott pénzt: elvenni kell." }]]), lep: [pmLep("Mennyi pénze maradt?", p - m, p + " − " + m + " = " + (p - m))] }; }
    if (o.tek) {       /* gyöngyök (T1): vett – felfűz – marad */
      var cs = ekR(3, 6), gy = ekE([6, 8, 10, 12]), l = ekR(2, 4), mm = ekR(5, 12), ossz = cs * gy, fel = l * mm;
      if (ossz - fel < 3 || ossz > 100) return null;
      return { keret: "vasar", mondatok: [A.n + " " + cs + " csomag gyöngyöt vett, mindegyikben " + gy + " gyöngy van.", l + " karkötőt fűz, mindegyikre " + mm + " gyöngyöt."], kerdes: "Hány gyöngy marad?", helyes: ossz - fel, szo: "marad", kulcs: "vt" + cs + gy + l + mm,
        rajz: pmRajz([["📿", cs, "csomag"], ["💍", l, "karkötő"]]),
        oe: pmEtlap(ossz - fel, "marad", [[ossz, "k", "ennyi gyöngyöt vett"], [fel, "k", { m: "Ez egy lépcsőfok volt: ennyit fűz fel. Mennyi marad?" }], [ossz - mm, "c", { m: "Nem egy karkötőt fűz, hanem " + ekRag(l, "t") + "!", jelol: [1, l + " karkötőt"] }]]),
        lep: [pmLep("Hány gyöngyöt vett?", ossz, cs + " · " + gy + " = " + ossz, "ennyi gyöngyöt vett"), pmLep("Hányat fűz fel?", fel, l + " · " + mm + " = " + fel, "ennyit fűz fel"), pmLep("Hány gyöngy marad?", ossz - fel, ossz + " − " + fel + " = " + (ossz - fel))] };
    }
    if (p - n * ar < 2) return null;
    return { keret: "vasar", mondatok: [A.n + " " + p + " tallérral ment a vásárba.", "Vett " + n + " kiflit, darabját " + ar + " tallérért."], kerdes: "Mennyi pénze maradt?", helyes: p - n * ar, szo: "maradt", kulcs: "vk" + p + n + ar,
      rajz: pmRajz([[A.e, p, "tallér"], ["🥐", n, "kifli"]]),
      oe: pmEtlap(p - n * ar, "maradt", [[n * ar, "k", "ennyibe került a " + n + " kifli"], [p - ar, "c", { m: "Nem egy kiflit vett, hanem " + ekRag(n, "t") + "!", jelol: [1, n + " kiflit"] }], [p + n * ar, "c", { m: A.n + " költött, nem kapott pénzt: elvenni kell." }]]),
      lep: [pmLep("Mennyibe került a " + n + " kifli?", n * ar, n + " · " + ar + " = " + n * ar, "ennyibe került a " + n + " kifli"), pmLep("Mennyi pénze maradt?", p - n * ar, p + " − " + n * ar + " = " + (p - n * ar))] };
  },
  /* 🧱 csempés padló (🏅 Mekk Elek kicsiben) */
  padlo: function (o) {
    var A = ekE(EK_SZ), r = pmR(o, [3, 5], [5, 7]), c = o.tek ? ekR(5, 7) : r, rc = r * c;
    if (o.egy) return { keret: "padlo", mondatok: [A.n + " kamrájának padlóján " + r + " sor csempe van.", "Minden sorban " + c + " csempe van egymás mellett."], kerdes: "Hány csempe van az egész padlón?", helyes: rc, szo: "az egész padlón", kulcs: "pe" + r + c,
      rajz: pmPadlo(r, c, []), oe: pmEtlap(rc, "az egész padlón", [[r + c, "c", { m: "Ezt összeadtad. De " + r + " sor van, és minden sorban " + c + "." }]]), lep: [pmLep("Hány csempe van az egész padlón?", rc, r + " · " + c + " = " + rc)] };
    if (o.tek) {
      var pi = ekR(3, 9), sa = ekR(2, 6), fe = rc - pi - sa;
      if (fe - pi < 2 || pi === sa) return null;
      return { keret: "padlo", mondatok: [A.n + " konyhájában a padlón " + r + " sor csempe van, minden sorban " + c + " darab.", "A csempék közül " + pi + " piros, " + sa + " sárga, a többi fehér."], kerdes: "Hány fehér csempével van több, mint pirossal?", helyes: fe - pi, szo: "mennyivel több",
        kulcs: "pt" + r + c + pi + sa, rajz: pmPadlo(r, c, [[pi, "#f28b8b"], [sa, "#f6d36a"]]),
        oe: pmEtlap(fe - pi, "mennyivel több", [[rc, "k", "ennyi csempe van az egész padlón"], [pi + sa, "k", "ennyi a színes csempe együtt"], [fe, "k", { m: "Ez egy lépcsőfok volt: ennyi a fehér csempe. De mennyivel van több, mint a piros?" }],
          [rc - pi - pi, "c", { m: "A sárgák sem fehérek: őket is el kell venni!", jelol: [1, sa + " sárga"] }], [fe - pi - sa, "c", { m: "A pirosakkal kell összevetni, nem az összes színessel.", jelol: [1, pi + " piros"] }]]),
        lep: [pmLep("Hány csempe van az egész padlón?", rc, r + " · " + c + " = " + rc, "ennyi csempe van az egész padlón"), pmLep("Hány fehér csempe van?", fe, rc + " − " + pi + " − " + sa + " = " + fe, "ennyi a fehér csempe"), pmLep("Mennyivel több a fehér, mint a piros?", fe - pi, fe + " − " + pi + " = " + (fe - pi))] };
    }
    var s = pmR(o, [2, 4], [2, 4]), w = rc - s;
    if (w - s < 2) return null;
    return { keret: "padlo", mondatok: [A.n + " fürdőszobájának padlóján " + r + " sor csempe van, minden sorban " + c + " darab.", "Ebből " + s + " kék, a többi fehér."], kerdes: "Hány fehér csempével van több, mint kékkel?", helyes: w - s, szo: "mennyivel több",
      kulcs: "pk" + r + s, rajz: pmPadlo(r, c, [[s, "#8cc3ee"]]),
      oe: pmEtlap(w - s, "mennyivel több", [[rc, "k", "ennyi csempe van az egész padlón"], [w, "k", { m: "Ez egy lépcsőfok volt: ennyi a fehér csempe. De mennyivel van több, mint a kék?" }], [rc + s, "c", { m: "A kék csempék is benne vannak az összesben: elvenni kell, nem hozzáadni." }], [s, "m", { m: ekA(s, true) + " a kék csempék száma." }]]),
      lep: [pmLep("Hány csempe van az egész padlón?", rc, r + " · " + c + " = " + rc, "ennyi csempe van az egész padlón"), pmLep("Hány fehér?", w, rc + " − " + s + " = " + w, "ennyi a fehér csempe"), pmLep("Mennyivel több, mint a kék?", w - s, w + " − " + s + " = " + (w - s))] };
  },
  /* 🫙 kannák és poharak (🏅 Icike kicsiben) */
  kanna: function (o) {
    var a = ekR(2, o.tek ? 4 : 3), b = ekR(o.tek ? 3 : 2, o.tek ? 6 : 5), n = ekR(2, o.tek ? 4 : 3);
    if (n === a && !o.egy) n = a === 2 ? 3 : 2;
    var M0 = ["1 nagy kannába " + a + " kis kanna víz fér.", "1 kis kannába " + b + " pohár víz fér."];
    if (o.egy) return { keret: "kanna", mondatok: [M0[0]], kerdes: "Hány kis kanna víz fér " + n + " nagy kannába?", helyes: n * a, szo: n + " nagy kannába", kulcs: "ne" + a + n,
      rajz: pmRajz([["🫙", 1, "nagy"], ["🥛", a, "kis kanna"]]), oe: pmEtlap(n * a, n + " nagy kannába", [[n + a, "c", { m: "Ezt összeadtad. De minden nagy kannába " + a + " kicsi fér." }]]), lep: [pmLep("Hány kis kanna víz fér " + n + " nagy kannába?", n * a, n + " · " + a + " = " + n * a)] };
    if (o.tek) {
      var m = ekR(1, 3), kis = n * a + m, ossz = kis * b;
      if (ossz > 100 || m === a) return null;
      return { keret: "kanna", mondatok: M0.concat(["Brumi megtöltött " + n + " nagy és még " + m + " kis kannát."]), kerdes: "Hány pohár víz van összesen a kannákban?", helyes: ossz, szo: "hány pohár", kulcs: "nt" + a + b + n + m,
        rajz: pmRajz([["🫙", n, "nagy kanna"], ["🥛", m, "kis kanna"]]),
        oe: pmEtlap(ossz, "hány pohár", [[n * a, "k", "ennyi kis kanna víz fér a " + n + " nagy kannába"], [kis, "k", { m: "Ez egy lépcsőfok volt: ennyi kis kanna víz van összesen. De poharat kérdeztek!" }], [n * a * b, "k", { m: "Ez egy lépcsőfok volt: ennyi pohár fér a nagy kannákba. A kis kannák is kellenek!" }],
          [(n + m) * b, "c", { m: "A nagy kanna nem egy kis kanna: egy nagyba " + a + " kicsi fér.", jelol: [0, a + " kis kanna"] }]]),
        lep: [pmLep("Hány kis kanna víz fér a " + n + " nagy kannába?", n * a, n + " · " + a + " = " + n * a, "ennyi kis kanna víz fér a nagy kannákba"), pmLep("Hány kis kanna víz van összesen?", kis, n * a + " + " + m + " = " + kis, "ennyi kis kanna víz van összesen"), pmLep("Hány pohár ez?", ossz, kis + " · " + b + " = " + ossz)] };
    }
    var h = n * a * b;
    return { keret: "kanna", mondatok: M0, kerdes: "Hány pohár víz fér " + n + " nagy kannába?", helyes: h, szo: n + " nagy kannába", kulcs: "nk" + a + b + n,
      rajz: pmRajz([["🫙", 1, "nagy"], ["🥛", a, "kis kanna"], ["🥤", b, "pohár"]]),
      oe: pmEtlap(h, n + " nagy kannába", [[a * b, "k", { m: "Ez egy lépcsőfok volt: ennyi pohár fér EGY nagy kannába. De hány nagy kannáról kérdeztek?" }], [n * a, "k", { m: "Ez egy lépcsőfok volt: ennyi kis kanna víz fér a " + n + " nagy kannába. De poharat kérdeztek!" }],
        [n * b, "c", { m: ekA(n * b, true) + " pohár csak " + n + " kis kanna. A nagy kannák kellenek." }], [a + b, "c", { m: "Ezt összeadtad. De minden nagy kannában " + a + " kicsi van, és minden kicsiben " + b + " pohár." }]]),
      lep: [pmLep("Hány pohár fér EGY nagy kannába?", a * b, a + " · " + b + " = " + a * b, "ennyi pohár fér EGY nagy kannába"), pmLep("És " + n + " nagy kannába?", h, a * b + " · " + n + " = " + h)] };
  }
};
/* a csempés padló rajza: r × c lap, a színes lapok elszórva (5-ös sorok helyett a rács mutatja a szorzást) */
function pmPadlo(r, c, szinek) {
  var L = []; for (var i = 0; i < r * c; i++) L.push("#fff");
  var hely = mKever(L.map(function (x, i) { return i; })), k = 0;
  szinek.forEach(function (sz) { for (var j = 0; j < sz[0]; j++) L[hely[k++]] = sz[1]; });
  var s = '<svg class="op-rajz pm-padlo" viewBox="0 0 ' + (c * 24 + 8) + ' ' + (r * 24 + 8) + '">';
  for (var y = 0; y < r; y++) for (var x = 0; x < c; x++) s += '<rect x="' + (4 + x * 24) + '" y="' + (4 + y * 24) + '" width="24" height="24" fill="' + L[y * c + x] + '" stroke="#9a8a7a" stroke-width="1.5"/>';
  return s + '</svg>';
}
var PM_KERET = { KERES: PM_KERES, VALASZ: PM_VALASZ };
