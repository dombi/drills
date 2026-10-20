"""🤖 Gépi próba — ⑧ 📴 Net nélkül-őr (terv/offline-jatek-rendszerterv.html, 2. kör).

A „nincs net” itt: a próba leállítja a saját helyi szerverét — a játék fájljai onnan már nem jönnek.
  1. nettel betölt (?sw → a service worker a helyi próbán is él), megvárja, hogy a worker eltegye a játékot;
  2. még egyszer nettel (most már a worker szolgál ki — „hálózat először”);
  3. a szerver leáll → újratöltés: el kell indulnia a tárolt példányból (stílus, profilválasztó, pálya-indítás);
  4. 💤 Tüneménykert: net nélkül alvó felhő (lépcső „alszik” felirattal), nem eltűnő lépcső és nem nyitott kert;
  5. a szerver visszajön (ugyanazon a porton) → ?friss vészfék: tár üres, worker leiratkozva.
A felhő a próba alatt is el van zárva (a Firestore-hoz senki nem nyúl); a 4. pont a kapu-logikát nézi, a valódi RTDB-t nem.
"""
import json
import motor

OR = "net nélkül"
CACHE_JATEK = "uc-jatek-1"


def futtat(e, J):
    k = motor.Kiszolgalo(); port = k.port; l = None
    try:
        l = e.uj_lap(); l.meret(1366, 768); l.hol = "📴 nettel, első indítás"
        cim = k.cim("_gepi.html?sw=1")
        l.betolt(cim)
        if not l.varj("navigator.serviceWorker && navigator.serviceWorker.controller", 20):
            J.hiba(OR, "piros", "offline:sw-nem-indul", "A service worker nem vette át a lapot 20 mp alatt (sw.js).", "")
            return
        # a worker telepítéskor előre letölt: game.js, style.css, a próba-lap maga
        tar = ("caches.open(%s).then(function(c){return c.keys();}).then(function(k){return k.map(function(r){return r.url;});})"
               % json.dumps(CACHE_JATEK))
        if not l.varj("window.__tar_kesz", 1):
            l.js("window.__tar_kesz=false; (function n(){ %s.then(function(u){ var j=u.join(' ');"
                 " if(/game\\.js\\?v=/.test(j) && /style\\.css/.test(j) && /_gepi\\.html/.test(j)) window.__tar_kesz=true; else setTimeout(n,300); }); })()" % tar,
                 varakozas=False)
        if not l.varj("window.__tar_kesz", 30):
            J.hiba(OR, "piros", "offline:elore-letoltes", "A worker 30 mp alatt sem tette el a játékot (game.js, style.css, az oldal).",
                   "tárban: " + " ".join(l.js(tar) or []))
            return

        l.hol = "📴 nettel, a worker szolgál ki"
        l.betolt(cim)
        tol = len(l.hibak)

        # ── net nélkül ──
        k.leall(); k = None
        l.hol = "📴 net nélkül"
        try:
            l.betolt(cim)
        except Exception as h:
            J.hiba(OR, "piros", "offline:nem-indul", "Net nélkül a játék nem indult el a tárolt példányból.", str(h)[:300])
            return
        allapot = l.js("""(function(){
          var st = Array.prototype.some.call(document.styleSheets, function(s){
            try { return /style\\.css/.test(s.href || '') && s.cssRules.length > 100; } catch(e) { return false; } });
          var pr = document.querySelector('#kepernyo-profil.aktiv');
          var lista = document.querySelectorAll('#profil-lista > *').length;
          return { stilus: st, profil: !!pr, lista: lista, kezelt: !!navigator.serviceWorker.controller };
        })()""")
        if not (allapot["stilus"] and allapot["profil"] and allapot["lista"] > 0):
            J.hiba(OR, "piros", "offline:hianyos", "Net nélkül elindult, de hiányos (stílus / profilválasztó).", json.dumps(allapot))
        # pálya-indítás net nélkül: a liget, majd az első pálya
        palya = l.js("""(function(){ try { UC.mentes.valaszmod = 'beiras'; UC.palyaInditas(UC.PALYAK[0].id);
                          return !!document.querySelector('#kepernyo-jatek.aktiv'); } catch(e) { return String(e); } })()""")
        l.pihen(1)
        if palya is not True:
            J.hiba(OR, "piros", "offline:palya", "Net nélkül az első pálya nem indult el.", json.dumps(palya))
        for h in l.hibak[tol:]:
            J.hiba(OR, "piros", "offline:konzol:%s" % h["szoveg"][:60], "Konzolhiba net nélkül: %s" % h["szoveg"][:140],
                   h.get("verem", h["szoveg"])[:600])

        # ── 💤 Tüneménykert kapuja (a valódi RTDB nélkül: a kapu-logika) ──
        tk = l.belul("""(function(){
          var volt = { aktiv: FELHO.aktiv, uid: FELHO.uid, alszik: TK.alszik, kesz: TK.kesz, jog: TK.jog };
          var r = {};
          try {
            FELHO.aktiv = true; FELHO.uid = 'gepi-proba'; TK.kesz = true; TK.jog = { szoba: 'a' };
            localStorage.setItem('uc_tk_jog_gepi-proba', '1');
            TK.alszik = true;  var k1 = tkKapu(); r.alvo = !!(k1 && k1.alszik && !k1.nyitva); r.svg = /alszik/.test(tkLepcsoSVG());
            localStorage.removeItem('uc_tk_jog_gepi-proba');
            r.idegen = tkKapu() === null;                       /* akinek sosem volt lépcsője: net nélkül sincs */
            TK.alszik = false;                                  /* nettel: a régi kapuk (alvás nélkül) */
            var k2 = tkKapu(); r.ebren = !!(k2 && !k2.alszik);
          } catch (e) { r.hiba = String(e); }
          FELHO.aktiv = volt.aktiv; FELHO.uid = volt.uid; TK.alszik = volt.alszik; TK.kesz = volt.kesz; TK.jog = volt.jog;
          return r;
        })()""")
        if not (tk.get("alvo") and tk.get("svg") and tk.get("idegen") and tk.get("ebren")):
            J.hiba(OR, "piros", "offline:tunemenykert", "A Tüneménykert net nélkül nem alvó felhőt mutat.", json.dumps(tk))

        # ── vészfék: ?friss ──
        k = motor.Kiszolgalo(port=port)
        l.hol = "📴 ?friss vészfék"
        l.parancs("Page.navigate", {"url": k.cim("_gepi.html?friss")})   # a lap közben magát tölti újra (?friss nélkül)
        for _ in range(20):
            try:
                if l.varj("!/friss/.test(location.search) && document.readyState === 'complete'", 5): break
            except RuntimeError:
                pass
        l.betolt(k.cim("_gepi.html"))
        v = l.js("Promise.all([navigator.serviceWorker.getRegistrations(), caches.keys()])"
                 ".then(function(a){ return { worker: a[0].length, tar: a[1].length }; })")
        if v["worker"] or v["tar"]:
            J.hiba(OR, "piros", "offline:friss", "A ?friss után maradt tárolt példány vagy worker.", json.dumps(v))
        J.naplo.append("📴 net nélkül: indulás + pálya ✓, alvó felhőkert ✓, ?friss ✓ (ha fent nincs hiba)")
    finally:
        if l:
            try: l.js("localStorage.clear()")
            except Exception: pass
        if k: k.leall()
