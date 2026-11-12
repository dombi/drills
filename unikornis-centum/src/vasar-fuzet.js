/* ============ 6j4f) ☀️ DÉLI VÁSÁR A FÜZETEN (2. kör: 2026-11-12) ============
   Terv: terv/deli-vasar-fuzet-tervlap.html (✅ mind a 8 döntés A) · a füzet: fuzet.js · a lapok: irasbeli-gen.js · a feladatok: vasar.js.
   A 4. o. vásár-feladatot (GEN.vasar, g ≥ 4) a végén ide fordítjuk: f.csalad = "jelenet", f.jelenet = "vsfuzet", a vásár adatai f.vsF-ben
   (nem f.vs-ben, hogy a régi „gép ír” füzet ne lépjen közbe). A 🌅 Reggeli vásár és a 📦 Dobozoló-nap marad a régi úton (8. döntés A).
   A gyerek a képen: balra a füzet (a képernyő magasságában), jobbra a pult-sáv az unikornissal, Tüske néni története, a kép és a kérdés.
     ① TERV-SOR: a gyerek írja (számok, jel, =). A lépések a feladat füzet-soraiból jönnek (vsFzLepesek: „840 Ft : 7 = 120 Ft” → 840 : 7).
        Jó terv: + és · sorrendje szabad; − és : sorrendje kötött; más alakú, de jó értékű terv is jó, ha csak a történet számait és a
        már kiszámolt részeredményeket használja (kiskapu: a „2662 + 0” nem megy). Rossz terv: az ÉRTÉKE szerint a régi csapda-mondat
        (Összeadtad… / Elvettél…), részeredmény-mondat, „fordítva írtad”, vagy általános mondat; a 2. rossz tervtől a végigvezetés kérdése.
        Minden rossz terv egy hiba (a feladat nem „elsőre jó”).
     ② FEJBEN vagy ÍRÁSBAN (4. döntés A, vsFzIrasban): + −: van átvitel / pótlás, és egy tag ≥ 100 · ×: a nagyobb tényező legalább kétjegyű,
        nem kerek (és a kisebb sem kerek tízes) · :: az osztandó ≥ 100, vagy van maradék (a maradékot a Dobozoló kérdezheti: azt le kell írni).
        Írásban: a közös lap (+ −: a gyerek írja egymás alá), a végén ellenőriz (Kész / Enter); fejben: az = után írja az eredményt.
     ③ BECSLÉS (5. döntés A): feladatonként egy, az utolsó írásbeli lépés lapján. Ellenőrző sor nincs (azt a toronyban gyakorolja).
     ④ LAPOZÁS: egy lépés = egy lap; az előző lap terv-sora és eredménye a jegyzetbe kerül. Részeredmény után Tüske néni „jó lépés” mondata.
     ⑤ VÁLASZ-SOR: ha az utolsó lépés maradékos osztás (Dobozoló: TELI? MARAD?), a végén „Válasz:” sor — a gyerek dönti el, melyik szám felel
        a kérdésre (a „mit kérdeznek?” tudás megmarad); rossz számra a régi csapda-mondat.
     ⑥ A VÉGÉN a kép mozdul (a „? Ft” / „= ?” helyére az eredmény), a válasz-mondat a felirat, és a „Tovább ▶” gombig (Enter) marad. */

var VS_FZ_SOR = 7;   /* a terv-lap (és a válasz-lap) sorai: üres füzetlap, nem egy csík */

/* ── a füzet-sorokból a lépések: { tagok, jel, h, mar } ── */
function vsFzLepesek(V) {
  var ki = [];
  for (var i = 0; i < V.sorok.length; i++) {
    var t = ekSima(V.sorok[i].h), m = t.match(/((?:\d+(?: [a-zA-Z]+)? [·:+−] )+\d+)(?: [a-zA-Z]+)? = (\d+)(?:, maradék (\d+))?/);
    if (!m) return null;
    var tok = m[1].replace(/ [a-zA-Z]+(?= [·:+−])/g, "").split(" "), tagok = [], jel = tok[1];
    for (var k = 0; k < tok.length; k++) { if (k % 2 === 0) tagok.push(Number(tok[k])); else if (tok[k] !== jel) return null; }
    ki.push({ tagok: tagok, jel: jel, h: Number(m[2]), mar: m[3] != null ? Number(m[3]) : null });
  }
  return ki;
}
function vsFzJegy(n, p) { return Math.floor(n / Math.pow(10, p)) % 10; }
function vsFzIrasban(L) {
  var t = L.tagok, a = t[0], b = t[1], p, max = Math.max.apply(null, t), min = Math.min.apply(null, t);
  if (L.jel === "+") {
    if (max < 100) return false;
    for (p = 0; p < String(max).length; p++) { var s = 0; t.forEach(function (x) { s += vsFzJegy(x, p); }); if (s >= 10) return true; }
    return false;
  }
  if (L.jel === "−") { if (max < 100) return false; for (p = 0; p < String(a).length; p++) if (vsFzJegy(a, p) < vsFzJegy(b, p)) return true; return false; }
  if (L.jel === "·") return max >= 10 && max % 10 !== 0 && !(min >= 10 && min % 10 === 0);
  return a >= 100 || !!L.mar;
}
/* a gyerek tervének értéke (· : előbb) */
function vsFzErtek(t) {
  var sz = [t.tagok[0]], j = [];
  for (var i = 0; i < t.jelek.length; i++) {
    var op = t.jelek[i], v = t.tagok[i + 1];
    if (op === "·") sz[sz.length - 1] *= v; else if (op === ":") sz[sz.length - 1] /= v; else { j.push(op); sz.push(v); }
  }
  var e = sz[0]; j.forEach(function (op, k) { e = op === "+" ? e + sz[k + 1] : e - sz[k + 1]; });
  return e;
}
function vsFzRendez(a) { return a.slice().sort(function (x, y) { return x - y; }).join(","); }
function vsFzEgyezik(L, t) {
  if (t.tagok.length !== L.tagok.length || !t.jelek.every(function (j) { return j === L.jel; })) return false;
  return L.jel === "+" || L.jel === "·" ? vsFzRendez(t.tagok) === vsFzRendez(L.tagok) : t.tagok.join() === L.tagok.join();
}
function vsFzSzamokOk(V, t) {   /* a terv csak a történet számait és a már kiszámolt részeredményeket használja */
  var van = {};
  (ekSima(V.bub.tort.join(" ") + " " + V.bub.kerdes).match(/\d+/g) || []).forEach(function (d) { van[+d] = 1; });
  V.eredmenyek.forEach(function (x) { van[x] = 1; });
  return t.tagok.every(function (x) { return van[x]; });
}

/* ── a GEN.vasar végén: a 4. o. feladat a füzetre ── */
function vsFzAtalakit(f) {
  var V = f.vs, L = vsFzLepesek(V);
  if (!L || !L.length) return f;                   /* nem olvasható sor → marad a régi út (nem fordulhat elő, de ne törjön el) */
  var ut = L[L.length - 1];
  V.lepesek = L; V.becsI = -1;
  L.forEach(function (l, i) { l.iras = vsFzIrasban(l); if (l.iras) V.becsI = i; });
  V.valaszSor = ut.h !== f.helyes || ut.mar != null;
  f.vsF = V; f.vs = null;
  f.csalad = "jelenet"; f.jelenet = "vsfuzet"; f.kartyaHTML = "";
  return f;
}

/* ═════════════════ A KÉP: a pult-sáv (sátor + az unikornis a pultnál) ═════════════════ */
JELENETEK.vsfuzet = {
  kep: function () { return { vb: "0 0 420 120", tabla: null, uni: [96, 117, .3, 1] }; },
  rajz: function (JL) {
    var st = JL.f.vsF && JL.f.vsF.stand, sz = VS_SZIN[st] || VS_SZIN.nagy;
    return '<defs><linearGradient id="vsfz-eg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f9dcc0"/><stop offset="1" stop-color="#f3e8d6"/></linearGradient></defs>' +
      '<rect width="420" height="120" fill="url(#vsfz-eg)"/>' + vsFuzer(6, 420, 9) + vsLampion(40, 34, .7, 0) + vsLampion(380, 30, .7, 2) +
      '<path d="M0 108H420V120H0Z" fill="#e2cfae"/>' + vsSator(262, 114, sz, .78, st === "nagy");
  },
  indit: function (JL) { vsFzIndit(JL); return false; },
  felvesz: function () { return null; }, letesz: function () {}, katt: function () {}, bekuld: function () {},
  gepi: function () { return { katt: [] }; }
};

/* ═════════════════ A FÜZET INDÍTÁSA ═════════════════ */
function vsFzEl(JL, f) { return JL && JL.f === f && J && J.feladat === f; }
function vsFzIndit(JL) {
  var f = JL.f, V = f.vsF, d = irFuzetDoboz(true);
  d.classList.add("vs-fz");
  V.i = 0; V.tervHiba = 0; V.lapHiba = 0; V.konyvelt = {}; V.eredmenyek = []; V.valaszMost = false; V.mozgoVolt = false;
  var F = fzLap(d, irTervLap({ sor: VS_FZ_SOR }), {
    mod: "gyerek", oldalt: true, ell: "vegen", jelol: false, talca: false, mondoka: "hiba", jelek: true, csendesHiba: true,
    onTerv: function (F, t) { return vsFzTerv(JL, f, F, t); },
    onHiba: function (F, info) { return vsFzHiba(JL, f, F, info); },
    onLap: function (F, T) { vsFzLapFelirat(f, F, T); },
    onKesz: function (F) { if (vsFzEl(JL, f)) vsFzLapKesz(JL, f, F); }
  });
  d._F = F; V.F = F; F.svg.setAttribute("preserveAspectRatio", "xMidYMin meet");
  irKepAt(F);
  var b = el("div", "vs-fz-bub"); b.innerHTML = vsBub(V.bub); F.oldal.appendChild(b);
  irTovabbLink(F, d);
  jlRajz();
  F.felirat(J.feladatKesz === 0 && J.allomasIdx <= 1 ? "Írd fel a tervet: számok, jel, a végén = (billentyűn: + - * : =)" : "Írd fel a tervet!");
}
/* a lap elején a felirat: mit kér most a füzet */
function vsFzLapFelirat(f, F, T) {
  var V = f.vsF;
  F.svg.setAttribute("preserveAspectRatio", "xMidYMin meet");   /* a rövid lap is a tetején kezdődik (nem csúszik középre) */
  if (V.valaszMost) { F.felirat("Mi a válasz a kérdésre? " + ekSima(V.bub.kerdes) + " Írd a Válasz: után, aztán Kész (Enter).", "kerd"); return; }
  if (T.tervEredCel) { F.felirat("Ezt fejben is ki tudod számolni: írd az = után, aztán Kész (Enter)."); return; }
  if (T.terv && T.terv.nyitott) return;
  if (T.mezok.length) F.felirat("Ezt írásban számold ki! Előbb becsülj: a B: sorba írd, " + (T.muv === "oszt" ? "mettől meddig lehet a hányados." : "mennyi lesz körülbelül."));
  else if (T.alaSorok) F.felirat("Ezt írásban számold ki! Írd egymás alá a számokat a fejléc alá, aztán számolj. A végén Kész (Enter).");
  else F.felirat("Ezt írásban számold ki! A végén Kész (Enter).");
}

/* ═════════════════ ① A TERV ═════════════════ */
function vsFzTerv(JL, f, F, t) {
  if (!vsFzEl(JL, f)) return { hiba: "", csendes: true };
  var V = f.vsF, L = V.lepesek[V.i], ert = vsFzErtek(t);
  if (vsFzEgyezik(L, t) || (ert === L.h && vsFzSzamokOk(V, t))) {
    V.tervHiba = 0; V.lapHiba = 0;
    if (!L.iras) return { fejben: L.h };
    var o = { terv: true, becsles: V.i === V.becsI, ellenoriz: false, talca: false };
    if (L.jel === "+") return { lap: irGyart("ossz", vsFzEgyezik(L, t) ? t.tagok : L.tagok, null, o) };   /* egymás alá abban a sorrendben, ahogy felírta */
    if (L.jel === "−") return { lap: irGyart("kiv", L.tagok[0], L.tagok[1], o) };
    if (L.jel === "·") return { lap: irGyart("szor", Math.max(L.tagok[0], L.tagok[1]), Math.min(L.tagok[0], L.tagok[1]), o) };   /* a gép rendezi: a szorzandó elöl */
    return { lap: irGyart("oszt", L.tagok[0], L.tagok[1], o) };
  }
  /* rossz terv: egy hiba; a mondat az értékéhez illik */
  V.tervHiba++;
  jlRossz("terv", f.naplo);
  var m, c = V.csap[ert], r = V.resz[ert];
  if ((L.jel === "−" || L.jel === ":") && t.tagok.length === 2 && vsFzRendez(t.tagok) === vsFzRendez(L.tagok) && t.jelek[0] === L.jel)
    m = L.jel === "−" ? "Fordítva írtad: előbb az a szám jön, amiből elveszünk." : "Fordítva írtad: előbb az a szám jön, amit elosztunk.";
  else if (c) {
    m = "🦔 " + c.m; vsCsapdaSzamol(c.t);
    if (c.kep) vsKepCsere(c.kep);
    vsMutat(c.mutat);
  } else if (r && V.eredmenyek.indexOf(ert) >= 0) m = "Ezt már kiszámoltad! Most mi a következő lépés?";
  else if (r) m = "✋ " + r.m;
  else { m = "Ez a terv nem erre a kérdésre felel. Nézd meg a képet, és olvasd el újra a kérdést!"; vsVillant(); vsMutat(); }
  var seg = V.tervHiba >= 2 ? vsFzSegit(V) : "";
  if (seg) m += " Segítek: " + seg;
  if (c && c.mozgo && V.mozgo && !V.mozgoVolt && V.tervHiba === 1) mondd(vsKiejt(c.m), function () { vsFzMozgo(f, function () { mondd(vsKiejt(V.bub.kerdes)); }); });
  else mondd(vsKiejt(m));
  return { hiba: m, csendes: true };
}
/* a végigvezetés kérdései az aktuális lépésig (a vezet: [kérdés, helyes, füzet-sor]) — a terv irányát mutatja, a számolást nem */
function vsFzSegit(V) {
  if (!V.vezet) return "";
  var ki = [];
  for (var i = 0; i < V.vezet.length; i++) {
    var v = V.vezet[i];
    if (v[2] != null && v[2] < V.i) continue;   /* a már kész lépések kérdése nem kell */
    ki.push(v[0]);
    if (v[2] === V.i) break;
  }
  return ki.join(" ");
}
function vsFzMozgo(f, kesz) {
  var V = f.vsF, M = V.mozgo, K = VSM[M && M.klip];
  if (!K) { kesz(); return; }
  V.mozgoVolt = true;
  mkLejatszik({ klip: K, o: M.o }, K.cim(M.o), function () { if (J && J.feladat === f) kesz(); });
}

/* ═════════════════ HIBA A LAPON ═════════════════ */
function vsFzSorSzam(F) {   /* a fejben / válasz sorba írt szám */
  var s = ""; for (var c = 0; c < F.T.osz; c++) { var x = F.k[fzKulcs(0, c)]; if (x && x.v && /^\d$/.test(x.v)) s += x.v; }
  return s ? Number(s) : null;
}
function vsFzHiba(JL, f, F, info) {
  if (!vsFzEl(JL, f)) return true;
  if (info.terv) return false;                      /* a terv mondata már kész (vsFzTerv) */
  var V = f.vsF, kulcs = info.oszlopok ? "o" + V.i + ":" + Object.keys(F.k).sort().map(function (k) { return k + "=" + (F.k[k].v || ""); }).join("|")   /* Kész újra, javítás nélkül: nem új hiba */
    : info.cel ? "c" + V.i + "-" + info.cel.id : "x" + V.i;
  if (!V.konyvelt[kulcs]) { V.konyvelt[kulcs] = 1; jlRossz("füzet", f.naplo); }   /* egy elrontott jegy egyszer számít */
  if (!F.T.tervEredCel || !info.oszlopok) return false;   /* írásbeli lap: a füzet mondja (oszlopok; a 2. hibától a mondóka) */
  V.lapHiba++;
  var n = vsFzSorSzam(F), m, c = V.valaszMost && n != null ? V.csap[n] : null;
  if (V.valaszMost) {
    if (c) { m = "🦔 " + c.m; vsCsapdaSzamol(c.t); if (c.kep) vsKepCsere(c.kep); vsMutat(c.mutat); }
    else { m = "Nézd meg még egyszer, mit kérdeztünk!"; vsVillant(); }
  } else m = "Nem talált. Számold ki újra fejben!";
  if (V.lapHiba >= 2 && !c) { var seg = vsFzSegit(V); if (seg) m += " Segítek: " + seg; }
  F.felirat(m + " Radírozd ki, és írd be újra.", "kerd");
  mondd(vsKiejt(m));
  return true;
}

/* ═════════════════ KÉSZ EGY LAP → a következő lépés / válasz / vége ═════════════════ */
function vsFzLapKesz(JL, f, F) {
  var V = f.vsF;
  if (V.valaszMost) { vsFzVege(JL, f, F); return; }
  var L = V.lepesek[V.i], gyors = window.__UC_GYORS ? 60 : 1500;
  V.eredmenyek.push(L.h); if (L.mar != null) V.eredmenyek.push(L.mar);
  var jegyzet = (F.T.tervSzoveg || "") + " " + L.h + (L.mar ? ", maradék " + L.mar : "");
  V.i++; V.tervHiba = 0; V.lapHiba = 0;
  if (V.i < V.lepesek.length) {                     /* részeredmény: „jó lépés”, aztán új lap a következő tervnek */
    var r = V.resz[L.h], m = r ? r.m : "Jó lépés! Mi a következő?";
    J.vsResz = (J.vsResz || 0) + 1; hangCsilla();
    F.felirat("✋ " + m, "jo"); if (r) vsMutat(r.mutat);
    mondd(vsKiejt(m));
    setTimeout(function () { if (!vsFzEl(JL, f)) return; F.ujLap(irTervLap({ sor: VS_FZ_SOR }), { jegyzet: jegyzet }); F.felirat("✋ " + m + " Írd fel a következő tervet!", "jo"); }, gyors);
    return;
  }
  if (V.valaszSor) {                                /* maradékos osztás a végén: melyik szám felel a kérdésre? */
    V.valaszMost = true;
    setTimeout(function () { if (!vsFzEl(JL, f)) return; F.ujLap(irTervLap({ ered: f.helyes, eredC: 4, elotag: "Válasz:", cimke: "", sor: VS_FZ_SOR }), { jegyzet: jegyzet }); mondd(vsKiejt(V.bub.kerdes)); }, gyors);
    return;
  }
  vsFzVege(JL, f, F);
}
function vsFzVege(JL, f, F) {
  var V = f.vsF;
  F.felirat(ekSima(V.valasz), "jo");
  vsFzKepKesz(f.helyes);
  jlJo(String(f.helyes));
}
/* a kép mozdul: a kérdőjel helyére az eredmény (a cédula kiírja az árat, a szalag végére kerül) */
function vsFzKepKesz(h) {
  var k = document.querySelector(".vs-fz-bub .vs-kep"); if (!k) return;
  var s = k.innerHTML, n = (s.match(/>\? Ft</g) || []).length;
  if (/>= \?</.test(s)) s = s.replace(/>= \?</g, '>= ' + h + '<');
  else if (n === 1) s = s.replace(/>\? Ft</, '>' + h + ' Ft<');
  else return;
  k.innerHTML = s; k.classList.add("vs-fz-kesz");
}
/* jó válasz után (engine-logic ertekel): a füzet a „Tovább ▶” gombig (vagy Enterig) marad — a gyerek megnézheti, mit írt */
function vsFzJoTovabb(f, tovabb) {
  var V = f.vsF, F = V && V.F;
  if (!F || !F.oldal) return false;
  f.vsKesz = true;
  var g = el("div", "ir-gombok vs-fz-gombok"), b = el("button", "nagy-gomb vs-fz-tovabb", "Tovább ▶");
  b.type = "button"; g.appendChild(b); F.oldal.appendChild(g);
  function nyom() { if (g.parentNode) g.parentNode.removeChild(g); J.vsTovabbFn = null; tovabb(); }
  b.addEventListener("click", function () { hangGomb(); nyom(); });
  setTimeout(function () { if (J && J.feladat === f && g.parentNode) { J.vsTovabbFn = nyom; mondd(vsKiejt(V.valasz)); } }, 300);
  return true;
}
