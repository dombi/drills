"""🤖 Gépi próba — a közös motor (terv/gepi-proba-terv.html, 4. pont).

Három rész, csak a Python szabványos könyvtárával (nincs telepítés, nincs külső könyvtár):
  • Kiszolgalo — helyi webszerver a játék mappájára, szabad porton; a /_gepi.html címen a teszt-lapot
    adja (index.html + hamis beszéd + némítás), fájl nem keletkezik.
  • Edge — a gépen lévő Edge láthatatlanul, üres, ideiglenes profillal; a végén a profil törlődik.
  • Lap — a Chrome DevTools-protokoll (CDP) egy saját, kicsi websocket-klienssel: JS futtatás,
    konzolhibák gyűjtése, képernyőméret.
"""
import base64, http.server, json, os, re, shutil, socket, socketserver, struct, subprocess
import tempfile, threading, time, urllib.request

UC = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))   # …\unikornis-centum
EDGE_HELYEK = [r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
               r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"]
# a felhőt a próba alatt elzárjuk (a gyerekek mentésébe véletlenül se írjon) — a betűtípus mehet
TILTOTT_CIMEK = ["*firebase*", "*firestore*", "*identitytoolkit*", "*securetoken*", "*googleapis.com/*/firebase*"]

# ── a teszt-lap: ugyanaz, mint a próbacsapat build_teszt.py-ja (hamis beszéd, néma hang), csak fájl nélkül ──
ELOJATEK = r"""<script>
window.__UC_GYORS = true;
window.__mondatok = [];
function FakeSR(){ this.lang="hu-HU"; this.continuous=false; this.interimResults=false; }
FakeSR.prototype.start=function(){ window.__activeSR=this; if(this.onstart) this.onstart(); };
FakeSR.prototype.stop=function(){ if(this.onend) this.onend(); };
FakeSR.prototype.abort=function(){ if(this.onend) this.onend(); };
window.SpeechRecognition = window.webkitSpeechRecognition = FakeSR;
window.__say=function(t){ var r=window.__activeSR; if(!r) return; var it=[{transcript:t,confidence:0.95}]; it.isFinal=true; r.onresult&&r.onresult({resultIndex:0,results:[it]}); };
try {
  var ss = window.speechSynthesis;
  ss.speak = function (u) { setTimeout(function(){ if(u.onstart) u.onstart(); if(u.onend) u.onend(); }, 1); };
  ss.cancel = function(){};
  ss.getVoices = function(){ return [{ lang:"hu-HU", name:"Szabolcs", voiceURI:"hu" }]; };
} catch(e) {}
</script>"""
# amit a játék kimondana (mondd), az a window.__mondatok-ba kerül — a szöveg-őr ezt is olvassa
UTOJATEK = r"""<script>
(function () {
  if (typeof mondd !== "function") return;
  var eredeti = mondd;
  mondd = function (szoveg) { try { window.__mondatok.push(String(szoveg)); } catch (e) {} return eredeti.apply(this, arguments); };
})();
</script>"""


def teszt_lap(mappa=UC):
    html = open(os.path.join(mappa, "index.html"), encoding="utf-8").read()
    js_minta = re.compile(r'(<script src="game\.js[^"]*"></script>)')
    if not js_minta.search(html):
        raise RuntimeError("index.html: nem találom a game.js betöltését")
    return js_minta.sub(lambda m: ELOJATEK + m.group(1) + UTOJATEK, html)


def kemlelo_js(mappa=UC):
    """A game.js a lemezről, a végén egy kémlelővel: window.__GEPI_EVAL(kód) a játék belsejében fut
    (a P(), J, FELULIR, boltKivalasztott… így a próbából elérhető). Csak a próba-szerver adja így; a fájl nem változik."""
    js = open(os.path.join(mappa, "game.js"), encoding="utf-8").read()
    ultet = os.environ.get("GEPI_BEULTET")   # az őrök próbája: JSON-fájl [[régi, új], …] — szándékosan elrontott játék
    if ultet:
        for regi, uj in json.load(open(ultet, encoding="utf-8")):
            if regi not in js: raise RuntimeError("GEPI_BEULTET: nem találom: " + regi[:60])
            js = js.replace(regi, uj, 1)
    i = js.rstrip().rfind("})();")
    if i < 0: raise RuntimeError("game.js: nem találom a záró })(); sort")
    return (js[:i] + "window.__GEPI_EVAL = function (__k) { return eval(__k); };\n" + js[i:]).encode("utf-8")


class Kiszolgalo:
    """A játék mappája egy szabad porton (127.0.0.1); a /_gepi.html a teszt-lap.
    mappa: alapból a mostani játék; a ⑥ mentés-gyártó egy régi változat kicsomagolt mappáját adja."""
    def __init__(self, mappa=UC, port=0):
        lap = teszt_lap(mappa).encode("utf-8")

        class Kezelo(http.server.SimpleHTTPRequestHandler):
            def __init__(s, *a, **k): super().__init__(*a, directory=mappa, **k)
            def log_message(s, *a): pass
            def end_headers(s):
                s.send_header("Cache-Control", "no-store"); super().end_headers()
            def do_GET(s):
                ut = s.path.split("?")[0]
                if ut == "/_gepi.html":
                    s.send_response(200); s.send_header("Content-Type", "text/html; charset=utf-8")
                    s.send_header("Content-Length", str(len(lap))); s.end_headers(); s.wfile.write(lap)
                elif ut == "/game.js":
                    js = kemlelo_js(mappa)
                    s.send_response(200); s.send_header("Content-Type", "text/javascript; charset=utf-8")
                    s.send_header("Content-Length", str(len(js))); s.end_headers(); s.wfile.write(js)
                else:
                    super().do_GET()

        class Szerver(socketserver.ThreadingMixIn, http.server.HTTPServer):
            daemon_threads = True
        self.szerver = Szerver(("127.0.0.1", port), Kezelo)   # port: a 📴 net nélkül-őr ugyanott indítja újra
        self.port = self.szerver.server_address[1]
        threading.Thread(target=self.szerver.serve_forever, daemon=True).start()

    def cim(self, ut="_gepi.html"):
        return "http://127.0.0.1:%d/%s" % (self.port, ut)

    def leall(self):
        self.szerver.shutdown(); self.szerver.server_close()


# ── websocket (RFC 6455, csak ami a CDP-hez kell) ──
class Websocket:
    def __init__(self, url):
        m = re.match(r"ws://([^:/]+):(\d+)(/.*)", url)
        self.s = socket.create_connection((m.group(1), int(m.group(2))), timeout=120)
        kulcs = base64.b64encode(os.urandom(16)).decode()
        self.s.sendall(("GET %s HTTP/1.1\r\nHost: %s:%s\r\nUpgrade: websocket\r\nConnection: Upgrade\r\n"
                        "Sec-WebSocket-Key: %s\r\nSec-WebSocket-Version: 13\r\n\r\n"
                        % (m.group(3), m.group(1), m.group(2), kulcs)).encode())
        fej = b""
        while b"\r\n\r\n" not in fej:
            d = self.s.recv(4096)
            if not d: raise RuntimeError("websocket: a kapcsolat bezárult")
            fej += d
        if b" 101 " not in fej.split(b"\r\n")[0]:
            raise RuntimeError("websocket: nem sikerült a kézfogás")
        self.puffer = fej.split(b"\r\n\r\n", 1)[1]

    def _olvas(self, n):
        while len(self.puffer) < n:
            d = self.s.recv(1 << 20)
            if not d: raise RuntimeError("websocket: a kapcsolat bezárult")
            self.puffer += d
        ki, self.puffer = self.puffer[:n], self.puffer[n:]
        return ki

    def kuld(self, szoveg, opkod=1):
        adat = szoveg.encode("utf-8") if isinstance(szoveg, str) else szoveg
        fej = bytes([0x80 | opkod]); n = len(adat)
        if n < 126: fej += bytes([0x80 | n])
        elif n < 65536: fej += bytes([0x80 | 126]) + struct.pack(">H", n)
        else: fej += bytes([0x80 | 127]) + struct.pack(">Q", n)
        maszk = os.urandom(4)
        self.s.sendall(fej + maszk + bytes(b ^ maszk[i % 4] for i, b in enumerate(adat)))

    def fogad(self):
        darabok = []
        while True:
            b1, b2 = self._olvas(2)
            opkod, n = b1 & 0x0F, b2 & 0x7F
            if n == 126: n = struct.unpack(">H", self._olvas(2))[0]
            elif n == 127: n = struct.unpack(">Q", self._olvas(8))[0]
            maszk = self._olvas(4) if b2 & 0x80 else None
            adat = self._olvas(n)
            if maszk: adat = bytes(b ^ maszk[i % 4] for i, b in enumerate(adat))
            if opkod == 9: self.kuld(adat, 10); continue          # ping → pong
            if opkod == 8: raise RuntimeError("websocket: a böngésző bezárta a kapcsolatot")
            if opkod in (0, 1, 2): darabok.append(adat)
            if b1 & 0x80 and opkod != 10: return b"".join(darabok).decode("utf-8")

    def zar(self):
        try: self.s.close()
        except OSError: pass


class JSHiba(Exception):
    pass


class Lap:
    """Egy böngészőfül a CDP-n át: js(), varj(), meret(); a konzolhibák a .hibak listába gyűlnek."""
    def __init__(self, ws_url):
        self.ws = Websocket(ws_url)
        self.n = 0
        self.esemenyek = []
        self.hibak = []          # [{"szoveg":…, "hol":…}] — konzol-hiba és el nem kapott kivétel
        self.hol = "indulás"     # az őrök ide írják, épp mit csinálnak → a hiba mellé kerül
        self.parancs("Runtime.enable"); self.parancs("Log.enable"); self.parancs("Page.enable")
        self.parancs("Network.enable")
        self.parancs("Network.setBlockedURLs", {"urls": TILTOTT_CIMEK})
        self.parancs("Emulation.setFocusEmulationEnabled", {"enabled": True})   # a billentyűk a lapra menjenek

    def _esemeny(self, u):
        m, p = u.get("method"), u.get("params", {})
        if m == "Runtime.exceptionThrown":
            d = p.get("exceptionDetails", {})
            sz = (d.get("exception") or {}).get("description") or d.get("text", "")
            self.hibak.append({"szoveg": sz.split("\n")[0][:300], "hol": self.hol, "verem": sz[:1200]})
        elif m == "Runtime.consoleAPICalled" and p.get("type") == "info" and p.get("args") and \
                p["args"][0].get("value") == "GEPI-HOL":   # a böngészőben futó őr jelzi, épp hol tart
            self.hol = str(p["args"][1].get("value")) if len(p["args"]) > 1 else self.hol
        elif m == "Runtime.consoleAPICalled" and p.get("type") == "error":
            sz = " ".join(str(a.get("value", a.get("description", ""))) for a in p.get("args", []))
            self.hibak.append({"szoveg": sz[:300], "hol": self.hol})
        elif m == "Log.entryAdded" and p.get("entry", {}).get("level") == "error":
            e = p["entry"]
            if "ERR_BLOCKED_BY_CLIENT" in e.get("text", "") or e.get("source") == "network": return
            self.hibak.append({"szoveg": e.get("text", "")[:300], "hol": self.hol})
        else:
            self.esemenyek.append(u)
            del self.esemenyek[:-200]

    def parancs(self, metodus, params=None):
        self.n += 1; az = self.n
        self.ws.kuld(json.dumps({"id": az, "method": metodus, "params": params or {}}))
        while True:
            u = json.loads(self.ws.fogad())
            if u.get("id") == az:
                if "error" in u: raise RuntimeError("%s: %s" % (metodus, u["error"].get("message")))
                return u.get("result", {})
            if "method" in u: self._esemeny(u)

    def js(self, kod, varakozas=True):
        """JS kifejezés értéke (JSON-ként). Az async függvény / Promise is jó (varakozas)."""
        r = self.parancs("Runtime.evaluate", {"expression": kod, "returnByValue": True,
                                               "awaitPromise": varakozas, "userGesture": True})
        if "exceptionDetails" in r:
            d = r["exceptionDetails"]
            raise JSHiba(((d.get("exception") or {}).get("description") or d.get("text", "")).split("\n")[0])
        return r.get("result", {}).get("value")

    def belul(self, kod):
        """JS a játék belsejében (a zárt csomag változóival és függvényeivel: P(), FELULIR, …)."""
        return self.js("__GEPI_EVAL(%s)" % json.dumps(kod))

    def pihen(self, mp):
        """Vár, közben feldolgozza a beérkező eseményeket (konzolhibák)."""
        self.js("new Promise(function(r){ setTimeout(r, %d); })" % int(mp * 1000))

    def varj(self, feltetel, mp=10):
        """Vár, amíg a JS feltétel igaz lesz; False, ha lejárt az idő."""
        return self.js("new Promise(function(r){ var t0=Date.now(); (function n(){ var ok=false;"
                       " try { ok = !!(%s); } catch(e) {} if (ok) r(true); else if (Date.now()-t0 > %d) r(false);"
                       " else setTimeout(n, 50); })(); })" % (feltetel, int(mp * 1000)))

    def betolt(self, url, kesz="window.UC && window.UC.PALYAK"):
        """kesz: mikor számít betöltöttnek (a régi változatoknak még nem volt UC-fogantyújuk → a gyártó mást ad)."""
        self.parancs("Page.navigate", {"url": url})
        if not self.varj("document.readyState === 'complete' && " + kesz, 30):
            raise RuntimeError("a játék nem töltődött be 30 mp alatt: " + url)

    def katt(self, selector, mp=0):
        """Valódi egérkattintás az elem közepére (a böngésző bemenetén át, mint egy gyerek keze).
        False, ha nincs ilyen látható elem. mp: utána ennyit vár."""
        r = self.js("(function(){ var e=document.querySelector(%s); if(!e || !e.getClientRects().length) return null;"
                    " e.scrollIntoView({block:'center', inline:'center'}); var b=e.getBoundingClientRect();"
                    " return [b.left+b.width/2, b.top+b.height/2]; })()" % json.dumps(selector))
        if not r: return False
        for tipus in ("mouseMoved", "mousePressed", "mouseReleased"):
            self.parancs("Input.dispatchMouseEvent", {"type": tipus, "x": r[0], "y": r[1], "button": "left",
                                                      "buttons": 1 if tipus == "mousePressed" else 0, "clickCount": 1})
        if mp: self.pihen(mp)
        return True

    def duplakatt(self, selector, mp=0):
        """Két gyors kattintás ugyanoda (kapkodó gyerek / dupla koppintás); a második a böngészőnek dupla katt."""
        r = self.js("(function(){ var e=document.querySelector(%s); if(!e || !e.getClientRects().length) return null;"
                    " e.scrollIntoView({block:'center', inline:'center'}); var b=e.getBoundingClientRect();"
                    " return [b.left+b.width/2, b.top+b.height/2]; })()" % json.dumps(selector))
        if not r: return False
        self.parancs("Input.dispatchMouseEvent", {"type": "mouseMoved", "x": r[0], "y": r[1]})
        for n in (1, 2):
            for tipus in ("mousePressed", "mouseReleased"):
                self.parancs("Input.dispatchMouseEvent", {"type": tipus, "x": r[0], "y": r[1], "button": "left",
                                                          "buttons": 1 if tipus == "mousePressed" else 0, "clickCount": n})
        if mp: self.pihen(mp)
        return True

    def gombok(self, sor, szunet=0):
        """Valódi billentyűleütések: „4 Enter 4 Enter”, „a l m a Enter”, „- 3”, „2 , 5”.
        A szóközzel elválasztott elemek egy-egy billentyű; szunet: ennyi mp két billentyű között (0 = gépi tempó)."""
        for i, k in enumerate(sor.split()):
            if szunet and i: self.pihen(szunet)
            if k.isdigit() and len(k) == 1: p = {"key": k, "code": "Digit" + k, "windowsVirtualKeyCode": 48 + int(k), "text": k}
            elif k == "Enter": p = {"key": "Enter", "code": "Enter", "windowsVirtualKeyCode": 13, "text": "\r"}
            elif k == "Backspace": p = {"key": "Backspace", "code": "Backspace", "windowsVirtualKeyCode": 8}
            elif k == "-": p = {"key": "-", "code": "Minus", "windowsVirtualKeyCode": 189, "text": "-"}
            elif k == ",": p = {"key": ",", "code": "Comma", "windowsVirtualKeyCode": 188, "text": ","}
            elif len(k) == 1 and k.isalpha(): p = {"key": k, "code": "Key" + k.upper(), "windowsVirtualKeyCode": ord(k.upper()), "text": k}
            else: raise ValueError("ismeretlen billentyű: " + k)
            self.parancs("Input.dispatchKeyEvent", dict(p, type="keyDown" if "text" in p else "rawKeyDown"))
            self.parancs("Input.dispatchKeyEvent", {"type": "keyUp", "key": p["key"], "code": p["code"],
                                                    "windowsVirtualKeyCode": p["windowsVirtualKeyCode"]})

    def nyom(self, selector, tart=1.2, mp=0):
        """Hosszú nyomás (pl. a szülői rész gombja)."""
        r = self.js("(function(){ var e=document.querySelector(%s); if(!e || !e.getClientRects().length) return null;"
                    " var b=e.getBoundingClientRect(); return [b.left+b.width/2, b.top+b.height/2]; })()" % json.dumps(selector))
        if not r: return False
        self.parancs("Input.dispatchMouseEvent", {"type": "mousePressed", "x": r[0], "y": r[1], "button": "left", "buttons": 1, "clickCount": 1})
        self.pihen(tart)
        self.parancs("Input.dispatchMouseEvent", {"type": "mouseReleased", "x": r[0], "y": r[1], "button": "left", "buttons": 0, "clickCount": 1})
        if mp: self.pihen(mp)
        return True

    def aktiv(self):
        return self.js("(document.querySelector('.kepernyo.aktiv')||{}).id || null")

    def meret(self, w, h, telefon=False):
        self.parancs("Emulation.setDeviceMetricsOverride", {"width": w, "height": h, "deviceScaleFactor": 1,
                                                            "mobile": bool(telefon)})

    def kep(self, utvonal):
        d = self.parancs("Page.captureScreenshot", {"format": "png"})
        with open(utvonal, "wb") as f: f.write(base64.b64decode(d["data"]))

    def zar(self):
        self.ws.zar()


def arvak_takaritasa():
    """Egy megszakított próba (időkorlát, leállított beszélgetés) Edge-je bent ragad: a `finally` nem fut le,
    a láthatatlan lapok órákig viszik a gépet (2026-10-21: 6 ragadt bent, 41 folyamat). Induláskor leállítjuk
    azokat, amelyek indító Pythonja már nem él, és töröljük a gazdátlan uc-gepi-* profilmappákat.
    Egy épp futó másik próbához nem nyúl (annak él az indítója, a profilja a parancssorában van)."""
    if os.name != "nt": return
    ps = ("Get-CimInstance Win32_Process | Select-Object ProcessId,ParentProcessId,CommandLine,"
          "@{n='T';e={if($_.CreationDate){$_.CreationDate.ToFileTimeUtc()}else{0}}} | ConvertTo-Json -Compress")
    try:
        ki = subprocess.run(["powershell", "-NoProfile", "-NonInteractive", "-Command", ps],
                            capture_output=True, timeout=60).stdout.decode("utf-8", "replace")
        folyamatok = {p["ProcessId"]: p for p in json.loads(ki)}
    except Exception:
        return                                   # a takarítás sosem akaszthatja meg a próbát
    elok, leallitott = [], 0                     # a még élő próbák parancssorai (bennük a profilmappa neve)
    for p in folyamatok.values():
        cmd = p.get("CommandLine") or ""
        if "uc-gepi-" not in cmd or "--headless" not in cmd or "--type=" in cmd: continue
        szulo = folyamatok.get(p["ParentProcessId"])
        if szulo and szulo["T"] <= p["T"]:       # él az indítója (és nem egy később kapott, újrahasznált PID)
            elok.append(cmd); continue
        subprocess.run(["taskkill", "/PID", str(p["ProcessId"]), "/T", "/F"],
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        leallitott += 1
    if leallitott: time.sleep(1)                 # a leállított Edge-ek elengedik a mappáikat
    tmp = tempfile.gettempdir()
    for nev in os.listdir(tmp):
        ut = os.path.join(tmp, nev)
        if not nev.startswith("uc-gepi-") or not os.path.isdir(ut): continue
        if any(nev in c for c in elok): continue
        if time.time() - os.path.getmtime(ut) < 120: continue   # épp most induló másik próbáé lehet
        shutil.rmtree(ut, ignore_errors=True)


class Edge:
    """Láthatatlan Edge üres, ideiglenes profillal; a .lap egy fül, a .uj_lap() újat nyit."""
    def __init__(self):
        exe = next((p for p in EDGE_HELYEK if os.path.isfile(p)), None)
        if not exe: raise RuntimeError("nem találom az Edge-et")
        arvak_takaritasa()
        self.profil = tempfile.mkdtemp(prefix="uc-gepi-")
        self.proc = subprocess.Popen([exe, "--headless=new", "--remote-debugging-port=0",
                                      "--user-data-dir=" + self.profil, "--no-first-run",
                                      "--no-default-browser-check", "--disable-extensions", "--mute-audio",
                                      "--disable-features=Translate,msEdgeSidebarV2", "--window-size=1366,768",
                                      "about:blank"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        fajl = os.path.join(self.profil, "DevToolsActivePort")
        t0, tart = time.time(), ""
        while not tart:
            if time.time() - t0 > 30: self.leall(); raise RuntimeError("az Edge nem indult el 30 mp alatt")
            time.sleep(0.1)
            try: tart = open(fajl).read().strip()       # írás közben a Windows zárolja → újra
            except OSError: tart = ""
        self.port = int(tart.split()[0])
        self.lapok = []

    def _lista(self):
        with urllib.request.urlopen("http://127.0.0.1:%d/json/list" % self.port, timeout=10) as r:
            return json.loads(r.read().decode())

    def uj_lap(self):
        req = urllib.request.Request("http://127.0.0.1:%d/json/new?about:blank" % self.port, method="PUT")
        with urllib.request.urlopen(req, timeout=10) as r:
            cel = json.loads(r.read().decode())
        lap = Lap(cel["webSocketDebuggerUrl"]); self.lapok.append(lap)
        return lap

    def leall(self):
        for l in getattr(self, "lapok", []): l.zar()
        # az egész folyamatfa (a lapok saját folyamatai is): csak a fő folyamat leállítása után a láthatatlan lapok
        # tovább futottak és vitték a processzort (3. kód-kör, 2026-10-14)
        if os.name == "nt":
            subprocess.run(["taskkill", "/PID", str(self.proc.pid), "/T", "/F"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        try:
            self.proc.terminate(); self.proc.wait(10)
        except Exception:
            try: self.proc.kill()
            except Exception: pass
        for _ in range(20):                      # a profil-mappa csak a böngésző leállása után törölhető
            try: shutil.rmtree(self.profil); break
            except OSError: time.sleep(0.3)


# ── jelentés ──
SULY = {"piros": "🔴", "sarga": "🟡", "zold": "🟢"}


class Jelentes:
    """Az őrök ide írják, amit találtak. kulcs: rövid, állandó azonosító (az „ismert” listához)."""
    def __init__(self, ismert_fajl):
        self.talalatok = []      # {"or","suly","kulcs","szoveg","reszlet"}
        self.ismert = set()
        if os.path.isfile(ismert_fajl):
            for sor in open(ismert_fajl, encoding="utf-8"):
                sor = sor.split("#", 1)[0].strip()
                if sor: self.ismert.add(sor)
        self.naplo = []          # a futás menete (mi futott, mennyi ideig)

    def hiba(self, orr, suly, kulcs, szoveg, reszlet=""):
        for t in self.talalatok:                 # ugyanaz a kulcs egyszer, a részletek gyűlnek
            if t["kulcs"] == kulcs:
                t["db"] += 1
                if reszlet and len(t["peldak"]) < 5: t["peldak"].append(reszlet)
                return
        self.talalatok.append({"or": orr, "suly": suly, "kulcs": kulcs, "szoveg": szoveg, "db": 1,
                               "peldak": [reszlet] if reszlet else [], "ismert": kulcs in self.ismert})

    def uj(self):
        return [t for t in self.talalatok if not t["ismert"]]

    def osszegzes(self, fajta):
        uj = self.uj()
        db = {s: sum(1 for t in uj if t["suly"] == s) for s in SULY}
        ism = len(self.talalatok) - len(uj)
        if not uj:
            return "🤖 Gépi próba (%s): tiszta." % fajta + (" (%d ismert hiba elrejtve)" % ism if ism else "")
        sorok = ["🤖 Gépi próba (%s): 🔴 %d · 🟡 %d · 🟢 %d" % (fajta, db["piros"], db["sarga"], db["zold"])
                 + (" · (%d ismert elrejtve)" % ism if ism else "")]
        for s in ("piros", "sarga", "zold"):
            for t in uj:
                if t["suly"] == s:
                    sorok.append("%s %s%s" % (SULY[s], t["szoveg"], " (%d×)" % t["db"] if t["db"] > 1 else ""))
        return "\n".join(sorok)

    def markdown(self, fajta, ido):
        s = ["# 🤖 Gépi próba — %s" % fajta, "", "Futás: %s · %.0f mp" % (time.strftime("%Y-%m-%d %H:%M"), ido), "",
             "```", self.osszegzes(fajta), "```", "", "## Menet", ""]
        s += ["- " + n for n in self.naplo]
        s += ["", "## Részletek", ""]
        if not self.talalatok: s.append("Nincs találat.")
        for t in sorted(self.talalatok, key=lambda t: ("piros", "sarga", "zold").index(t["suly"])):
            s.append("### %s %s%s" % (SULY[t["suly"]], t["szoveg"], " — ISMERT" if t["ismert"] else ""))
            s.append("- őr: %s · kulcs: `%s` · %d előfordulás" % (t["or"], t["kulcs"], t["db"]))
            for p in t["peldak"]: s.append("  - " + str(p).replace("\n", " ⏎ ")[:600])
            s.append("")
        return "\n".join(s)
