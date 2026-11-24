#!/usr/bin/env python3
"""vilagkep-export.py — a jóváhagyott rajzterv (Matekos/vilagkep-rajzterv.html, 2026-11-23) szétszedése rétegfájlokra.

Használat: py terv/vilagkep-export.py   →   kepek/vilag/*.svg  (+ kiírja a helyek.js „doboz” sorait és az sw.js listát)

Egyszeri eszköz (Világkép 2. kör). A lapon JS-sel generált fák, fű, virágok, utak, csillogás, nád itt UGYANAZZAL a
seedelt véletlennel (s=7, 16807-es LCG, ugyanabban a sorrendben) készül, és statikus SVG lesz. Ezután a rajz a
fájlokban él: a rajz-csere = új fájlok (a kódhoz nem kell nyúlni). Rétegek: terv/vilagkep-rendszerterv.html 4. pont.
"""
import os, re, sys

ITT = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(ITT)
FORRAS = os.path.join(os.path.expanduser("~"), "Matekos", "vilagkep-rajzterv.html")
CEL = os.path.join(REPO, "kepek", "vilag")
W, H = 1600, 900

src = open(FORRAS, encoding="utf8").read()
taj = src[src.index('<svg id="taj"'):]
taj = taj[:taj.index("</svg>")]


def grab(i, s=taj):
    """a <g id="i"> elem teljes szövege (kiegyensúlyozott nyitó/záró)"""
    a = s.index('<g id="%s"' % i)
    n, k = 0, a
    while True:
        o, c = s.find("<g", k), s.find("</g>", k)
        if o != -1 and o < c and s[o + 2] in " >":
            n += 1; k = o + 2
        else:
            n -= 1; k = c + 4
            if n == 0:
                return s[a:k]


def inner(g):
    return g[g.index(">") + 1:g.rindex("</g>")]


def defn(i):
    a = taj.index(' id="%s"' % i); a = taj.rindex("<", 0, a)
    tag = re.match(r"<(\w+)", taj[a:]).group(1); e = taj.index(">", a)
    return taj[a:e + 1] if taj[e - 1] == "/" else taj[a:taj.index("</%s>" % tag, a) + len(tag) + 3]


DEFS = {k: defn(k) for k in ["firka", "kod", "eg", "nap", "hegy-f", "hegy-v", "domb", "ret", "tavdomb", "vizgr", "csik", "fodrasz", "viz", "m-felv", "m-fejt"]}
DEFS["madar"] = re.search(r'<path id="madar".*?</path>', taj, re.S).group(0)
DEFS["hegy-clip"] = '<clipPath id="hegy-clip"><use href="#m-felv"/><use href="#m-fejt"/></clipPath>'
DEFS["viz-clip"] = '<clipPath id="viz-clip"><use href="#viz"/></clipPath>'
DEFS["szurke"] = '<filter id="szurke"><feColorMatrix type="saturate" values=".3"/></filter>'


def svg(nev, vb, defs, tartalom, elotag=""):
    d = "".join(DEFS[k] for k in defs)
    if elotag:   # a mozgó réteg a játék DOM-jába kerül: az id-k ne ütközzenek
        def pre(t):
            t = re.sub(r'id="([\w-]+)"', lambda m: 'id="%s%s"' % (elotag, m.group(1)), t)
            return re.sub(r'url\(#([\w-]+)\)|href="#([\w-]+)"', lambda m: ('url(#%s%s)' % (elotag, m.group(1))) if m.group(1) else 'href="#%s%s"' % (elotag, m.group(2)), t)
        d, tartalom = pre(d), pre(tartalom)
    x, y, w, h = vb
    s = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="%g %g %g %g" width="%g" height="%g">\n'
         '<!-- Thinking horses · %s · a rajzterv (2026-11-23) exportja; koordináták a 1600×900-as táj rendszerében -->\n'
         '<defs>%s</defs>\n%s\n</svg>\n') % (x, y, w, h, w, h, nev, d, tartalom.strip())
    os.makedirs(CEL, exist_ok=True)
    open(os.path.join(CEL, nev + ".svg"), "w", encoding="utf8", newline="\n").write(s)
    return s


def num(v):   # JS-szerű számkiírás (egész → egész)
    if isinstance(v, float) and v.is_integer():
        return str(int(v))
    return repr(round(v, 6)) if isinstance(v, float) else str(v)


# ── a lap generátora, ugyanabban a sorrendben (seedelt véletlen) ──
_s = [7]
def rnd():
    _s[0] = (_s[0] * 16807) % 2147483647
    return (_s[0] - 1) / 2147483646

K = [[240, 324, 3], [304, 450, 8], [344, 558, 12], [384, 630, 15], [480, 702, 20], [512, 792, 24], [515, 905, 30]]
def folyo(t):
    n = len(K) - 1; f = t * n; i = min(int(f // 1), n - 1); u = f - i; a, b = K[i], K[i + 1]
    return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u]
def sima(p):
    d = "M%s,%s" % (num(p[0][0]), num(p[0][1]))
    for i in range(1, len(p) - 1):
        d += " Q%s,%s %s,%s" % (num(p[i][0]), num(p[i][1]), num((p[i][0] + p[i + 1][0]) / 2), num((p[i][1] + p[i + 1][1]) / 2))
    return d + " L%s,%s" % (num(p[-1][0]), num(p[-1][1]))
def f1(v): return "%.1f" % v

aramlas = ""
for j, o in enumerate([-0.45, 0, 0.4]):
    p = [[k[0] + o * k[2] * 0.9, k[1]] for k in K]
    aramlas += ('<path d="%s" fill="none" stroke="#fff" stroke-width="%s" stroke-linecap="round" opacity=".6" stroke-dasharray="%s %s">'
                '<animate attributeName="stroke-dashoffset" values="0;-%s" dur="%ss" repeatCount="indefinite"/></path>') % (
        sima(p), num(1.6 + j * 0.4), num(10 + j * 6), num(40 + j * 10), num(60 + j * 20), num(round(2.6 + j * 0.7, 2)))
csillogas = ""
for i in range(26):
    q = folyo(0.08 + rnd() * 0.9); x = q[0] + (rnd() - 0.5) * q[2] * 1.2; y = q[1]; r = 1.5 + rnd() * 2.2
    csillogas += ('<path transform="translate(%s,%s) scale(%.2f)" d="M0,-4 L1,-1 L4,0 L1,1 L0,4 L-1,1 L-4,0 L-1,-1Z" fill="#fff" opacity="0">'
                  '<animate attributeName="opacity" values="0;1;0" dur="%ss" begin="%ss" repeatCount="indefinite"/></path>') % (
        f1(x), f1(y), r / 3, f1(1.8 + rnd() * 2), f1(rnd() * 3))
kovek, fodor = "", ""
for k in [[0.32, -1.25], [0.47, 1.3], [0.6, -1.2], [0.83, 1.25], [0.95, -1.2], [0.7, 0.2], [0.9, -0.3]]:
    q = folyo(k[0]); x = q[0] + k[1] * q[2]; y = q[1]; r = 3 + q[2] * 0.18
    if abs(k[1]) < 1:
        fodor += ('<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="none" stroke="#fff" stroke-width="1.2"><animate attributeName="rx" values="%s;%s" dur="2.4s" repeatCount="indefinite"/>'
                  '<animate attributeName="opacity" values=".9;0" dur="2.4s" repeatCount="indefinite"/></ellipse>') % (f1(x), f1(y + 1), f1(r + 2), f1(r * 0.5 + 1), f1(r + 1), f1(r + 6))
    kovek += '<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="#cfc6dc" stroke="#8f86a8" stroke-width="1.3"/>' % (f1(x), f1(y), f1(r), f1(r * 0.65))
nad = ""
for j, k in enumerate([[0.2, -1.5], [0.22, -1.9], [0.42, 1.6], [0.66, -1.5], [0.68, -1.8], [0.8, 1.5], [0.87, -1.4], [0.89, -1.7]]):
    q = folyo(k[0]); x = q[0] + k[1] * q[2]; y = q[1]; h = 16 + rnd() * 10
    X, Y = f1(x), f1(y)
    nad += ('<g><path d="M%s,%s q2,-%s 4,-%s M%s,%s q-3,-%s -6,-%s" stroke="#7a9a5a" stroke-width="1.6" fill="none"/><ellipse cx="%s" cy="%s" rx="2" ry="5" fill="#a07a5a"/>'
            '<animateTransform attributeName="transform" type="rotate" values="-3 %s %s;3 %s %s;-3 %s %s" dur="%ss" repeatCount="indefinite"/></g>') % (
        X, Y, f1(h / 2), f1(h), X, Y, f1(h / 2.5), f1(h * 0.7), f1(float(X) + 4), f1(float(Y) - h + 3), X, Y, X, Y, X, Y, num(round(3.5 + j * 0.3, 2)))

def fenyo(x, y, h, c):
    w = h * 0.42; n = num
    return ('<path d="M{x},{a} L{b},{c1} L{d},{c1} L{e},{f} L{g},{f} L{g},{y} L{i},{y} L{i},{f} L{j},{f} L{k},{c1} L{l},{c1} Z" fill="%s"/>'
            '<path d="M{x},{a} L{b},{c1} L{d},{c1} L{e},{f} L{x},{f} Z" fill="#3c2f5e" opacity=".13"/>' % c).format(
        x=n(x), y=n(y), a=n(y - h), b=n(x + w * .55), c1=n(y - h * .55), d=n(x + w * .3), e=n(x + w), f=n(y - h * .1), g=n(x + w * .15),
        i=n(x - w * .15), j=n(x - w), k=n(x - w * .3), l=n(x - w * .55))
def lomb(x, y, r, c):
    n = num
    return ('<path d="M%s,%s L%s,%s L%s,%s L%s,%s Z" fill="#9b7656"/><circle cx="%s" cy="%s" r="%s" fill="%s"/><circle cx="%s" cy="%s" r="%s" fill="%s"/>'
            '<circle cx="%s" cy="%s" r="%s" fill="%s"/><circle cx="%s" cy="%s" r="%s" fill="#3c2f5e" opacity=".1"/><circle cx="%s" cy="%s" r="%s" fill="#fff" opacity=".22"/>') % (
        n(x - 2), n(y), n(x - 2), n(y - r), n(x + 2), n(y - r), n(x + 2), n(y),
        n(x - r * .5), n(y - r * 1.3), n(r * .72), c, n(x + r * .5), n(y - r * 1.35), n(r * .76), c, n(x), n(y - r * 1.85), n(r * .8), c,
        n(x + r * .35), n(y - r * 1.3), n(r * .55), n(x - r * .3), n(y - r * 2), n(r * .4))

HE_SOROK = [[300, 7, "#a9c2bf", 0.55], [340, 9, "#93b8a8", 0.7], [380, 12, "#7fae95", 0.85], [420, 15, "#6c9f86", 1], [455, 18, "#5f9479", 1]]
he_sor = []   # soronként (a kifestés a sor végére fűzi a folytatást, hogy a hátsó sor ne takarja az elsőt)
for sr in HE_SOROK:
    x = 1050 + rnd() * 14; s_ = ""
    while x < 1600:
        y = sr[0] + (rnd() - 0.5) * 14 + (-(x - 1450) * 0.08 if x > 1450 else 0)
        skip = sr[0] <= 340 and rnd() < 0.45
        if not skip and not (abs(x - 1100) < 26 and y < 380):
            s_ += '<g opacity="%s">%s</g>' % (num(sr[3]), fenyo(round(x), round(y), sr[1] * 2.4, sr[2]))
        x += sr[1] * 1.1 + rnd() * 8
    he_sor.append(s_)
he_domb = ""
x = 860
while x < 990:
    he_domb += fenyo(round(x), round(458 + rnd() * 12), 36, "#6c9f86")
    x += 14 + rnd() * 8
# JS: Math.round(x) — a fél felfelé kerekít; a Python banki kerekítése itt csak tört pixelt jelenthet, látványra mindegy

def folyoX(y):
    for i in range(len(K) - 1):
        if K[i][1] <= y <= K[i + 1][1]:
            u = (y - K[i][1]) / (K[i + 1][1] - K[i][1])
            return K[i][0] + (K[i + 1][0] - K[i][0]) * u - (K[i][2] + (K[i + 1][2] - K[i][2]) * u)
    return 999
ho, sz = "", ["#8fc98a", "#9fd19a", "#7fbf86", "#a7d99a"]
y = 400
while y <= 640:
    x = -10
    while x < folyoX(y) - 34:
        yy = y + rnd() * 10
        ok = not (40 < x < 146 and 500 < yy < 600) and not (90 < x < 230 and yy > 610)
        if ok:
            r = 10 + (yy - 400) / 240 * 10
            ho += fenyo(round(x), round(yy), r * 2.8, "#7fae95") if (yy < 470 and rnd() < 0.5) else lomb(round(x), round(yy), r, sz[int(rnd() * 4)])
        x += 30 + rnd() * 16
    y += 26
ho += lomb(250, 720, 16, "#9fd19a") + lomb(40, 760, 20, "#8fc98a") + lomb(1540, 560, 18, "#9fd19a") + lomb(1580, 600, 22, "#8fc98a") + lomb(1490, 700, 18, "#a7d99a") + lomb(960, 640, 14, "#9fd19a") + lomb(700, 560, 12, "#a7d99a") + lomb(1250, 660, 16, "#8fc98a")

vi = ""
for i in range(90):
    x = rnd() * 1600; y = 600 + rnd() * 290
    if abs(x - folyoX(y) - 25) < 55:
        continue
    vi += '<circle cx="%d" cy="%d" r="%.1f" fill="%s" opacity=".8"/>' % (round(x), round(y), 1.5 + rnd() * 1.6, ["#f6a5c0", "#fce49a", "#fff", "#c9a8e6"][i % 4])

fu = ""
x = 0
while x < 1600:
    if not (470 < x < 600):
        y = 884 + rnd() * 16; h = 10 + rnd() * 14
        fu += '<path d="M%s,%s q-2,-%s -5,-%s M%s,%s q1,-%s 2,-%s M%s,%s q3,-%s 7,-%s" stroke="#7fae6a" stroke-width="1.8" fill="none" stroke-linecap="round"/>' % (
            f1(x), f1(y), f1(h * .6), f1(h), f1(x), f1(y), f1(h * .7), f1(h * 1.1), f1(x), f1(y), f1(h * .5), f1(h * .8))
    x += 12 + rnd() * 14

fuzer = '<path d="M548,646 Q596,672 646,640" fill="none" stroke="#6a5a7a" stroke-width="1"/>'
fz = ["#f6a5c0", "#fce49a", "#9ec9f0", "#a7d99a", "#c9a8e6"]
for i in range(1, 10):
    t = i / 10; x = (1 - t) ** 2 * 548 + 2 * (1 - t) * t * 596 + t * t * 646; y = (1 - t) ** 2 * 646 + 2 * (1 - t) * t * 672 + t * t * 640
    fuzer += '<circle cx="%s" cy="%s" r="3" fill="%s" stroke="#5a4a7a" stroke-width=".8"><animate attributeName="opacity" values="1;.4;1" dur="%ss" begin="%ss" repeatCount="indefinite"/></circle>' % (
        f1(x), f1(y + 3), fz[i % 5], num(round(1.4 + (i % 3) * .5, 2)), num(round(i * .2, 2)))

P = {"hid": [.318, .86], "tisztas": [.20, .82], "kut": [.47, .66], "odu": [.155, .935], "kert": [.255, .94], "postafa": [.25, .955], "erdoszel": [.15, .775], "utca": [.41, .795],
     "ter": [.585, .815], "osszeado-utca": [.735, .715], "dallam-ter": [.81, .735], "kezmuvesek": [.348, .668], "domboldal": [.445, .475], "konyvtar": [.67, .415]}
U = [["odu", "kert", [[.20, .955]]], ["kert", "postafa", []], ["odu", "erdoszel", [[.12, .86]]], ["erdoszel", "tisztas", [[.17, .80]]], ["kert", "tisztas", [[.24, .87]]], ["postafa", "hid", [[.29, .90]]],
     ["tisztas", "hid", [[.27, .85]]], ["hid", "utca", [[.36, .84]]], ["utca", "ter", [[.47, .83]]], ["utca", "kezmuvesek", [[.37, .70]]], ["ter", "kut", [[.55, .72]]], ["kut", "osszeado-utca", [[.62, .70]]],
     ["osszeado-utca", "dallam-ter", [[.77, .75]]], ["kut", "domboldal", [[.44, .58], [.47, .52]]], ["domboldal", "konyvtar", [[.52, .47], [.60, .44]]]]
ut = ""
for u in U:
    p = [[a[0] * W, a[1] * H] for a in [P[u[0]]] + u[2] + [P[u[1]]]]
    w = 4 + (p[0][1] + p[-1][1]) / 2 / H * 9; d = sima(p)
    ut += '<path d="%s" stroke="#d9c79c" stroke-width="%.1f" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="%s" stroke="#f4e6c4" stroke-width="%.1f" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' % (d, w + 3, d, w)
ut += '<g stroke="#5a4a7a" stroke-width="1.6"><ellipse cx="752" cy="596" rx="12" ry="6" fill="#cfc6dc"/><path d="M742,594 L742,578 M762,594 L762,578 M738,580 L766,580" fill="none"/></g>'

# ── KIFESTÉS (2026-11-24): a rétegek a 1600×900-on túl is rajzolnak, hogy széles (21:9) és magas (4:3) ablakon se maradjon
#    üres sáv. A fenti, jóváhagyott rész VÁLTOZATLAN (ugyanaz a véletlen-sor); a folytatás saját véletlennel készül.
#    Ég + felhők fölül, bal oldalt a hazai erdő, jobbra a hegy lába fenyvessel, alul rét és füves partszél. Hely, jel, felirat nincs.
BX0, BY0, BX1, BY1 = -560, -160, 2160, 1060
BLEED = (BX0, BY0, BX1 - BX0, BY1 - BY0)   # helyek.js kep.kifestve
_b = [4242]
def brnd():
    _b[0] = (_b[0] * 16807) % 2147483647
    return (_b[0] - 1) / 2147483646

# jobbra a hegyi fenyves folytatása (soronként a régi sor után); a hegy lába jobbra lassan ereszkedik
he = ""
for sr, s_ in zip(HE_SOROK, he_sor):
    x = 1600 + brnd() * 10
    while x < BX1 + 20:
        y = sr[0] + (brnd() - 0.5) * 14 - (min(x, 1760) - 1450) * 0.08 + max(0, x - 1800) * 0.08
        if not (sr[0] <= 340 and brnd() < 0.45):
            s_ += '<g opacity="%s">%s</g>' % (num(sr[3]), fenyo(round(x), round(y), sr[1] * 2.4, sr[2]))
        x += sr[1] * 1.1 + brnd() * 8
    he += s_
he += he_domb

# bal oldalt a hazai erdő (a régi elé rajzolva, hogy a régi szél fái maradjanak elöl)
ho_bal = ""
y = 380
while y <= BY1:
    x = BX0 - 10
    while x < -24:
        yy = y + brnd() * 10; r = min(22, 10 + (yy - 400) / 240 * 10)
        ho_bal += fenyo(round(x), round(yy), r * 2.8, "#7fae95") if (yy < 470 and brnd() < 0.5) else lomb(round(x), round(yy), r, sz[int(brnd() * 4)])
        x += 30 + brnd() * 16
    y += 26
ho = ho_bal + ho
# jobbra a réten néhány fa (a hegy lábánál sűrűbb)
for i in range(14):
    x = 1630 + brnd() * (BX1 - 1630); y = 500 + brnd() * 520
    ho += lomb(round(x), round(y), 12 + (y - 500) / 520 * 12, sz[int(brnd() * 4)])
# virágok a kifestett részen (a patak alsó folytatását kihagyva)
for i in range(110):
    x = BX0 + brnd() * (BX1 - BX0); y = 600 + brnd() * (BY1 - 600)
    if 0 <= x <= 1600 and y < 900:
        continue
    if 440 < x < 600 and y > 880:
        continue
    vi += '<circle cx="%d" cy="%d" r="%.1f" fill="%s" opacity=".8"/>' % (round(x), round(y), 1.5 + brnd() * 1.6, ["#f6a5c0", "#fce49a", "#fff", "#c9a8e6"][i % 4])
# fű a széleken túl is
for xa, xb in ((BX0, 0), (1600, BX1)):
    x = xa
    while x < xb:
        y = 884 + brnd() * 16; h = 10 + brnd() * 14
        fu += '<path d="M%s,%s q-2,-%s -5,-%s M%s,%s q1,-%s 2,-%s M%s,%s q3,-%s 7,-%s" stroke="#7fae6a" stroke-width="1.8" fill="none" stroke-linecap="round"/>' % (
            f1(x), f1(y), f1(h * .6), f1(h), f1(x), f1(y), f1(h * .7), f1(h * 1.1), f1(x), f1(y), f1(h * .5), f1(h * .8))
        x += 12 + brnd() * 14
# felhők a kifestett égen (lassan úsznak, mint a régiek)
def felho(x, y, k, dx, dur, op):
    return ('<g transform="translate(%s,%s) scale(%s)"><path d="M0,34 C-10,12 18,0 36,10 C46,-12 84,-12 92,8 C114,0 134,16 126,34 Z" opacity="%s">'
            '<animateTransform attributeName="transform" type="translate" values="0,0;%s,0;0,0" dur="%ss" repeatCount="indefinite"/></path></g>') % (x, y, k, op, dx, dur)
felho_ki = (felho(-420, 110, 1.2, 60, 150, .85) + felho(-260, -70, 1.4, -50, 180, .8) + felho(380, -110, 1.1, 70, 160, .75) +
            felho(1040, -90, 1.3, -60, 175, .8) + felho(1760, 60, 1.2, -70, 155, .85) + felho(1980, -60, 1.0, 50, 140, .7))
# a patak alul a kép szélén túl is folyik (a víz alakja meghosszabbítva)
DEFS["viz"] = DEFS["viz"].replace("Q535,788 545,905 L485,905", "Q535,788 545,905 L556,%d L476,%d L485,905" % (BY1 + 10, BY1 + 10))
# a hegyek jobbra a szélig: a Felvételi lába ereszkedő gerinccel, a Fejtörő lába lassan a rétig
FELV_LAB = "L1640,200 L1780,236 L1880,222 L2000,256 L%d,272" % (BX1 + 10)
FEJT_LAB = "L1640,344 L1800,372 L2000,396 L%d,410" % (BX1 + 10)
DEFS["m-felv"] = DEFS["m-felv"].replace("L1640,200 L1640,470", "%s L%d,480" % (FELV_LAB, BX1 + 10))
DEFS["m-fejt"] = DEFS["m-fejt"].replace("L1640,344 L1640,480", "%s L%d,480" % (FEJT_LAB, BX1 + 10))

# ── RÉTEGEK ──
anim = re.compile(r"<animate")
eg_g = inner(grab("r-eg"))
felhok = eg_g[eg_g.index('<g fill="#fdfdfd"'):]
felhok = felhok[:felhok.index("</g>") + 4]
EG_RECT = '<rect width="1600" height="900" fill="url(#eg)"/>'
assert EG_RECT in eg_g
eg_g = eg_g.replace(EG_RECT, '<rect x="%d" y="%d" width="%d" height="%d" fill="#a9cdee"/><rect x="%d" y="0" width="%d" height="900" fill="url(#eg)"/>'
                    '<rect x="%d" y="900" width="%d" height="%d" fill="#fbf0dc"/>' % (BX0, BY0, BX1 - BX0, -BY0 + 1, BX0, BX1 - BX0, BX0, BX1 - BX0, BY1 - 900))
svg("eg", BLEED, ["eg", "nap"], eg_g.replace(felhok, ""))

tav = inner(grab("r-tavoli"))
vizeses = re.search(r'<path d="M236,302.*?</path>', tav, re.S).group(0)
arnyek = re.search(r'<g clip-path="url\(#hegy-clip\)".*?</g>', tav, re.S).group(0)
for a, b in (("M0,330 Q150,288", "M%d,318 Q-290,292 0,330 Q150,288" % (BX0 - 10)), ("L1290,470 L0,470 Z", "L1290,470 L%d,470 Z" % (BX0 - 10)),
             ("M0,372 Q90,306", "M%d,352 Q-300,330 0,372 Q90,306" % (BX0 - 10)), ("L640,620 L0,620 Z", "L640,620 L%d,620 Z" % (BX0 - 10)),
             ("L1640,200 L1640,470 L1520,470", "%s L%d,470 L1520,470" % (FELV_LAB, BX1 + 10)),
             ("L1640,344 L1640,480 L1336,480", "%s L%d,480 L1336,480" % (FEJT_LAB, BX1 + 10))):
    assert a in tav, a
    tav = tav.replace(a, b)
tav = tav.replace(vizeses, "").replace(arnyek, "").replace('<g id="hegyi-erdo"></g>', '<g filter="url(#firka)">' + he + "</g>")
svg("tavoli", BLEED, ["firka", "hegy-f", "hegy-v", "tavdomb", "m-felv", "m-fejt"], tav)

koz = inner(grab("r-kozep"))
for a, b in (("M0,545 Q200,522", "M%d,540 Q-280,528 0,545 Q200,522" % (BX0 - 10)), ("1640,462 L1640,900 L0,900 Z", "1640,462 L%d,470 L%d,%d L%d,%d Z" % (BX1 + 10, BX1 + 10, BY1 + 10, BX0 - 10, BY1 + 10))):
    assert a in koz, a
    koz = koz.replace(a, b)
koz = koz.replace('<g id="hazai-erdo"></g>', '<g filter="url(#firka)">' + ho + "</g>").replace('<g id="viragok"></g>', vi)
fo = inner(grab("folyo"))
fo_hasznos = fo[:fo.index('<g clip-path="url(#viz-clip)">')]
fo_tukor = re.search(r'<!-- tükröződés.*?(?=<g id="aramlas">)', fo, re.S).group(0)
steg = '<g stroke="#5a4a7a" stroke-width="1.6" stroke-linejoin="round"><path d="M542,866 L592,872 L592,880 L540,874 Z" fill="#d8b48a"/><path d="M556,880 L556,890 M584,880 L584,892" stroke-width="2.4"/></g>'
csonak = re.search(r'<path d="M498,872.*?</path>\s*<path d="M530,868[^>]*/>', fo, re.S).group(0)
koz += fo_hasznos + '<g clip-path="url(#viz-clip)">' + fo_tukor + "</g>" + kovek + steg + "\n<!-- utak (a helyek.js utak-táblájából) -->\n" + ut
svg("kozep", BLEED, ["firka", "domb", "ret", "vizgr", "viz", "viz-clip"], koz)

hid = grab("hid")
svg("hid", (456, 740, 106, 66), ["firka"], hid)

elo = inner(grab("r-eloter"))
elo = elo.replace(elo[elo.index('<g id="fu">'):elo.index("</g>", elo.index('<g id="fu">')) + 4], "")
elo = re.sub(r"<text.*?</text>", "", elo, flags=re.S)   # a tábla felirata a kódban (diszlet „tabla”): betűtípus csak a lapon van
# füves partszél elöl (a bokrok talpát takarja; a patak a kettő közt folyik ki a képből)
elo += ('<g filter="url(#firka)" stroke="#5a4a7a" stroke-width="2" fill="#9fcf8f">'
        '<path d="M%d,%d L%d,930 Q-300,900 -60,896 Q40,894 120,930 Q300,968 472,962 L478,%d Z"/>'
        '<path d="M566,%d L568,966 Q800,950 1100,960 Q1350,968 1460,920 Q1520,890 1600,892 Q1700,898 1800,930 Q2000,962 %d,950 L%d,%d Z"/></g>') % (
    BX0 - 10, BY1 + 10, BX0 - 10, BY1 + 10, BY1 + 10, BX1 + 10, BX1 + 10, BY1 + 10)
svg("eloter", BLEED, ["firka"], elo)

malom = grab("malomkerek")
hab = re.search(r'<g fill="#fff" stroke="none" opacity=".85">.*?</g>', taj, re.S).group(0)
madarak = inner(grab("madarak"))
csapat = madarak[madarak.index('<g opacity=".6">'):madarak.index("</g>", madarak.index('<g opacity=".6">')) + 4]
ULO = '<g id="ulo" fill="#6a5f8a" stroke="none"><path d="M-6,0 Q0,-8 6,-2 L11,-4 L7,1 Q0,6 -6,0 Z"/><circle cx="5" cy="-4" r="2.6"/></g>'
DEFS["ulo"] = ULO
mozgo = ('<g id="also" pointer-events="none">\n'
         '<g fill="#fdfdfd" opacity=".92">' + inner(felhok) + felho_ki + "</g>\n" + vizeses + "\n" + arnyek + "\n"
         '<g clip-path="url(#viz-clip)">' + aramlas + csillogas + "</g>\n" + fodor + "\n" + nad + "\n"
         '<g stroke="#5a4a7a" stroke-width="1.6" stroke-linejoin="round">' + csonak + "</g>\n" + malom + "\n" + hab + "\n</g>\n"
         '<g id="felso" pointer-events="none">\n<g stroke="#6a5f8a" stroke-width="1.8" fill="none" stroke-linecap="round">' + csapat + "</g>\n"
         '<g>' + fu + '<animateTransform attributeName="transform" type="skewX" values="0;1.2;0;-0.8;0" dur="7s" repeatCount="indefinite"/></g>\n</g>')
svg("mozgo", BLEED, ["madar", "ulo", "m-felv", "m-fejt", "hegy-clip", "viz", "viz-clip"], mozgo, elotag="vm-")

# ── HELYEK: 13 × 3 állapot (épül / kész / virágos) + felveteli-kod ──
HELYEK_G = grab("helyek")
def hg(i): return grab("h-" + i, HELYEK_G if ('id="h-%s"' % i) in HELYEK_G else taj)
zaszlo = re.search(r'<path d="M1251,46.*?</path>', taj, re.S).group(0)
harang = re.search(r'<path d="M1368,544.*?</path>', taj, re.S).group(0)
fust = re.search(r'<!-- füst -->\s*<g fill="#fff" stroke="none">(.*?)\n </g>', taj, re.S).group(1)
fust_c = re.findall(r"<circle.*?</circle>", fust, re.S)
ulo2 = madarak[madarak.index("<!-- két madár"):]
ulo2 = ulo2[ulo2.index("<g"):]
kod = grab("kod-felveteli")
FOK = 'stroke="#5a4a7a" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"'
#  id: (kép-doboz x0,y0,x1,y1) (állvány/virágsor: x0,y0,x1,y1 — y1 a talp), extra (élő apróság: csak „kész” és „virágos”)
HT = {
    "odu":           ((92, 650, 260, 848),    (146, 770, 208, 836), ""),
    "kert":          ((270, 752, 402, 848),   (290, 790, 380, 828), ""),
    "postafa":       ((398, 722, 500, 850),   (428, 780, 476, 837), ""),
    "erdoszel":      ((92, 596, 232, 698),    (108, 652, 212, 684), ""),
    "utca":          ((520, 596, 678, 716),   (544, 636, 656, 702), '<g id="fuzer">' + fuzer + "</g>"),
    "ter":           ((724, 540, 944, 734),   (748, 668, 920, 720), ""),
    "osszeado-utca": ((1022, 506, 1194, 642), (1040, 584, 1174, 628), '<g fill="#fff" stroke="none">' + fust_c[0] + fust_c[1] + "</g>"),
    "dallam-ter":    ((1318, 470, 1434, 662), (1342, 530, 1410, 648), harang + ulo2),
    "kezmuvesek":    ((350, 430, 536, 590),   (378, 532, 510, 576), '<g fill="#fff" stroke="none">' + fust_c[2] + "</g>"),
    "domboldal":     ((568, 280, 742, 428),   (592, 330, 718, 414), ""),
    "konyvtar":      ((950, 190, 1066, 372),  (980, 262, 1036, 360), ""),
    "fejtoro":       ((1196, 30, 1294, 248),  (1214, 192, 1266, 234), zaszlo),
    "felveteli":     ((1290, 20, 1700, 240),  (1412, 148, 1448, 180), ""),
}
_s[0] = 2026
def allvany(r):
    x0, y0, x1, y1 = r; s = '<g filter="url(#firka)" stroke="#7a5a3e" stroke-width="2.4" stroke-linecap="round" fill="none">'
    xs = [x0 - 4, x1 + 4] + ([(x0 + x1) / 2] if x1 - x0 > 70 else [])
    top = y0 - 8
    for x in xs: s += '<path d="M%s,%s L%s,%s"/>' % (f1(x), f1(y1 + 1), f1(x), f1(top))
    hs = [y1 - (y1 - top) * f for f in (.34, .68)]
    for y in hs:
        s += '<path d="M%s,%s L%s,%s" stroke="#c9a27a" stroke-width="5"/><path d="M%s,%s L%s,%s" stroke-width="1.2"/>' % (f1(x0 - 10), f1(y), f1(x1 + 10), f1(y), f1(x0 - 10), f1(y + 2.5), f1(x1 + 10), f1(y + 2.5))
    s += '<path d="M%s,%s L%s,%s M%s,%s L%s,%s" stroke-width="1.6" opacity=".8"/>' % (f1(x0 - 4), f1(y1), f1((x0 + x1) / 2), f1(hs[0]), f1(x1 + 4), f1(hs[0]), f1((x0 + x1) / 2), f1(hs[1]))
    lx = x1 + 12   # létra a jobb oldalon
    s += '<path d="M%s,%s L%s,%s M%s,%s L%s,%s" stroke-width="2"/>' % (f1(lx), f1(y1 + 1), f1(lx + 4), f1(hs[1]), f1(lx + 9), f1(y1 + 1), f1(lx + 13), f1(hs[1]))
    k = 5
    for i in range(1, k):
        t = i / k; y = y1 + (hs[1] - y1) * t
        s += '<path d="M%s,%s L%s,%s" stroke-width="1.6"/>' % (f1(lx + 4 * t), f1(y), f1(lx + 9 + 4 * t), f1(y))
    s += "</g>"
    # deszkarakás + vödör a talpnál
    s += '<g filter="url(#firka)" stroke="#5a4a7a" stroke-width="1.4" stroke-linejoin="round"><path d="M%s,%s l26,0 l0,-4 l-26,0 Z M%s,%s l22,0 l0,-4 l-22,0 Z" fill="#d8b48a"/>' % (
        f1(x0 - 34), f1(y1 + 2), f1(x0 - 31), f1(y1 - 2))
    s += '<path d="M%s,%s l2,-9 l10,0 l2,9 Z" fill="#a7b9c9"/></g>' % (f1(x1 - 12), f1(y1 + 2))
    return s
def viragsor(r):
    x0, y0, x1, y1 = r; s = '<g stroke="none">'
    x = x0 - 16
    while x < x1 + 16:
        y = y1 + 2 + (rnd() - .5) * 4; c = ["#f6a5c0", "#fce49a", "#fff", "#c9a8e6", "#f4a38c"][int(rnd() * 5)]; rr = 2.4 + rnd() * 1.6
        s += '<path d="M%s,%s q-4,-3 -6,-1 q3,2 6,1 Z" fill="#8cc685"/><circle cx="%s" cy="%s" r="%s" fill="%s"/><circle cx="%s" cy="%s" r="%.1f" fill="#f2c14e"/>' % (
            f1(x), f1(y), f1(x), f1(y - rr - 2), f1(rr), c, f1(x), f1(y - rr - 2), rr * .35)
        x += 7 + rnd() * 5
    s += "</g>"
    # három lassan pislákoló csillám a tető fölött (a „minden csillagos” öröme)
    for i, fx in enumerate((.15, .55, .9)):
        cx = x0 + (x1 - x0) * fx; cy = y0 - 6 - i % 2 * 8
        s += ('<path transform="translate(%s,%s)" d="M0,-5 L1.2,-1.2 L5,0 L1.2,1.2 L0,5 L-1.2,1.2 L-5,0 L-1.2,-1.2Z" fill="#fff6c2" stroke="#e3a92a" stroke-width=".8" opacity="0">'
              '<animate attributeName="opacity" values="0;1;0" dur="%ss" begin="%ss" repeatCount="indefinite"/></path>') % (f1(cx), f1(cy), num(2.6 + i * .7), num(i * .9))
    return s

doboz_sorok, fajlok = [], ["eg", "tavoli", "kozep", "hid", "eloter", "mozgo"]
for i, (box, r, extra) in HT.items():
    if i == "kezmuvesek":   # 2026-11-24 óta a mini utca kicsinyített mása: terv/kozelkep-export.py taj_kezmuvesek() írja, itt NE írjuk felül
        fajlok += [i + "-epul", i + "-kesz", i + "-viragos"]
        doboz_sorok.append("kezmuvesek: lásd terv/kozelkep-export.py (TAJ_KEZM_DOBOZ)")
        continue
    alap = '<g filter="url(#firka)" %s>%s</g>' % (FOK, hg(i)) if i not in ("fejtoro", "felveteli") else hg(i)
    vb = (box[0], box[1], box[2] - box[0], box[3] - box[1])
    defs = ["firka", "szurke"] + (["csik"] if i == "ter" else []) + (["fodrasz"] if i == "utca" else []) + (["kod"] if i == "felveteli" else [])
    svg(i + "-kesz", vb, defs, alap + extra)
    svg(i + "-epul", vb, defs, '<g opacity=".5" filter="url(#szurke)">' + alap + "</g>" + allvany(r))
    svg(i + "-viragos", vb, defs, alap + extra + viragsor(r))
    fajlok += [i + "-epul", i + "-kesz", i + "-viragos"]
    if i == "felveteli":
        svg(i + "-kod", vb, defs, alap + kod)
        fajlok.append(i + "-kod")
    doboz_sorok.append('%s: [%.4f, %.4f, %.4f, %.4f]' % (i, vb[0] / W, vb[1] / H, vb[2] / W, vb[3] / H))

print("kep.kifestve (helyek.js): [%d, %d, %d, %d]" % BLEED)
print("doboz (helyek.js):\n  " + "\n  ".join(doboz_sorok))
print("\nsw.js VILAG_KEPEK:", ", ".join('"%s"' % f for f in fajlok))
tot = 0
for f in fajlok:
    tot += os.path.getsize(os.path.join(CEL, f + ".svg"))
print("\n%d fájl, összesen %.0f KB; legnagyobb: %s" % (len(fajlok), tot / 1024, max(((os.path.getsize(os.path.join(CEL, f + ".svg")), f) for f in fajlok))))
