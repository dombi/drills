#!/usr/bin/env python3
"""kozelkep-export.py — Világkép 3. kör, 2. kódkör (2026-11-24): a Nagyfa tér és a Domboldal közelképének VÉGLEGES rajza;
4. kör, 2. kódkör (2026-11-24): a Kézművesek mini utcája (kezmuvesek(): 3 műhely × 5 állapot, malom + kerék + hab, kötél, macska);
5. kör, 1. kódkör (2026-11-24): az Erdőszél tisztása (erdoszel(): 2 gombaház × 5 állapot, tölgy + rét × 3 állapot, lakók, Tas, harkály);
7. kör (2026-11-26): a Postafa (postafa(): fa 6 levél-hellyel × 3 állapot, galambdúc, levelesláda) + a táj díszletei (taj_postafa, taj_steg,
taj_to, taj_barlang, taj_kod);
5. kör, 2. kódkör (2026-11-24): az Összeadó utca (osszeado_utca(): 3 ferde ház × 5 állapot, 5 hely × 3 állapot, kút, tyúk, Bogyó; utca_tabla()
kiírja a helyek.js pontjait, útjait, járható részét és patakját).

Használat: py terv/kozelkep-export.py [erdoszel …]   →   kepek/ter/*.svg, kepek/domboldal/*.svg, kepek/kezmuvesek/*.svg, kepek/erdoszel/*.svg
           (+ kiírja a helyek.js „doboz” sorait és az sw.js listát)

Forrás: a jóváhagyott rajzterv (Matekos/vilagkep-3-kor-ter-domboldal.html, „Mehet, mind A”) kompozíciója, a Thinking horses
(terv/vilagkep-export.py, kepek/vilag/) stílusában: pasztell, kézi vonal (firka-szűrő), fény + árnyék, mozgás. A véletlen
seedelt (16807-es LCG), így minden futás ugyanazt a rajzot adja.
Rétegek jelenetenként (a 1600×900-as kép rendszerében, a széleken túl kifestve: KIFESTVE):
  eg, tavoli, kozep, eloter — statikus · mozgo — vm-also / vm-felso csoport (felhők, lampionok, galambok, madarak …)
Házanként 5 állapot (3. döntés A; piacHazLepes 2–6): <ház>-epul / -teto / -ajto / -kesz / -viragos.
Díszlet-fájl: ter/nagyfa (a lombja leng), domboldal/kecske (legel).
A ház rajza részekből áll (S szerkezet, W nyers nyílások, A ajtó + ablak, K kész díszek, KA élő mozgás, V virágok):
  epul = S+A halványan + S alsó fele + állvány · teto = S+W + létra · ajto = S+A · kesz = +K+KA · viragos = +V + virágsor, csillám.
"""
import json, os, re, sys

ITT = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(ITT)
W, H = 1600, 900
BX0, BY0, BX1, BY1 = -560, -160, 2160, 1060
KIFESTVE = (BX0, BY0, BX1 - BX0, BY1 - BY0)      # helyek.js kep.kifestve
INK = "#5a4a7a"
FIRKA = ('<filter id="firka" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="1" seed="4"/>'
         '<feDisplacementMap in="SourceGraphic" scale="3"/></filter>')
SZURKE = '<filter id="szurke"><feColorMatrix type="saturate" values=".25"/></filter>'


def f(v):
    s = "%.1f" % v
    return s[:-2] if s.endswith(".0") else s


class Rnd:
    def __init__(self, s): self.s = s
    def __call__(self):
        self.s = (self.s * 16807) % 2147483647
        return (self.s - 1) / 2147483646


def irj(mappa, nev, vb, defs, tartalom, elotag=""):
    if elotag:   # a mozgó réteg a játék DOM-jába kerül: az id-k ne ütközzenek
        def pre(t):
            t = re.sub(r'id="([\w-]+)"', lambda m: 'id="%s%s"' % (elotag, m.group(1)), t)
            return re.sub(r'url\(#([\w-]+)\)|href="#([\w-]+)"', lambda m: ('url(#%s%s)' % (elotag, m.group(1))) if m.group(1) else 'href="#%s%s"' % (elotag, m.group(2)), t)
        defs, tartalom = pre(defs), pre(tartalom)
    x, y, w, h = vb
    s = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="%s %s %s %s" width="%s" height="%s">\n'
         '<!-- Thinking horses · %s/%s · terv/kozelkep-export.py (2026-11-24); koordináták a 1600×900-as közelkép rendszerében -->\n'
         '<defs>%s</defs>\n%s\n</svg>\n') % (f(x), f(y), f(w), f(h), f(w), f(h), mappa, nev, defs, tartalom.strip())
    cel = os.path.join(REPO, "kepek", mappa)
    os.makedirs(cel, exist_ok=True)
    open(os.path.join(cel, nev + ".svg"), "w", encoding="utf8", newline="\n").write(s)


# ── közös rajzelemek ──
def arnyek(x, y, rx, ry, op=.13):
    return '<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="#3c2a50" opacity="%s" stroke="none"/>' % (f(x), f(y), f(rx), f(ry), op)

def lomb(x, y, r, c):
    return ('<path d="M%s,%s L%s,%s L%s,%s L%s,%s Z" fill="#9b7656"/><circle cx="%s" cy="%s" r="%s" fill="%s"/><circle cx="%s" cy="%s" r="%s" fill="%s"/>'
            '<circle cx="%s" cy="%s" r="%s" fill="%s"/><circle cx="%s" cy="%s" r="%s" fill="#3c2f5e" opacity=".1"/><circle cx="%s" cy="%s" r="%s" fill="#fff" opacity=".22"/>') % (
        f(x - 2), f(y), f(x - 2), f(y - r), f(x + 2), f(y - r), f(x + 2), f(y),
        f(x - r * .5), f(y - r * 1.3), f(r * .72), c, f(x + r * .5), f(y - r * 1.35), f(r * .76), c, f(x), f(y - r * 1.85), f(r * .8), c,
        f(x + r * .35), f(y - r * 1.3), f(r * .55), f(x - r * .3), f(y - r * 2), f(r * .4))

def fenyo(x, y, h, c):
    w = h * 0.42
    return ('<path d="M{x},{a} L{b},{c1} L{d},{c1} L{e},{g} L{gg},{g} L{gg},{y} L{i},{y} L{i},{g} L{j},{g} L{k},{c1} L{l},{c1} Z" fill="%s"/>'
            '<path d="M{x},{a} L{b},{c1} L{d},{c1} L{e},{g} L{x},{g} Z" fill="#3c2f5e" opacity=".13"/>' % c).format(
        x=f(x), y=f(y), a=f(y - h), b=f(x + w * .55), c1=f(y - h * .55), d=f(x + w * .3), e=f(x + w), g=f(y - h * .1), gg=f(x + w * .15),
        i=f(x - w * .15), j=f(x - w), k=f(x - w * .3), l=f(x - w * .55))

def bokor(x, y, s, c1="#8cc47f", c2="#a7d99a"):
    return ('<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="%s"/><ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="%s" stroke="none"/>'
            '<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="#fff" opacity=".2" stroke="none"/>') % (
        f(x), f(y - 14 * s), f(30 * s), f(20 * s), c1, f(x - 12 * s), f(y - 22 * s), f(14 * s), f(10 * s), c2, f(x - 16 * s), f(y - 26 * s), f(7 * s), f(4 * s))

def pamacs(cx, cy, rx, ry, n, r, ki=1.28):
    """felhő-/lombszerű, csipkés körvonal: n pont az ellipszisen, közöttük kifelé domborodó ívek"""
    import math
    p = []
    for i in range(n):
        a = i / n * 2 * math.pi + r() * .2; k = .9 + r() * .16
        p.append((cx + math.cos(a) * rx * k, cy + math.sin(a) * ry * k))
    d = "M%s,%s" % (f(p[0][0]), f(p[0][1]))
    for i in range(n):
        a, b = p[i], p[(i + 1) % n]
        mx, my = (a[0] + b[0]) / 2, (a[1] + b[1]) / 2
        d += " Q%s,%s %s,%s" % (f(cx + (mx - cx) * ki), f(cy + (my - cy) * ki), f(b[0]), f(b[1]))
    return d + " Z"

def felho(x, y, k, op=.9):
    return '<path transform="translate(%s,%s) scale(%s)" d="M0,34 C-10,12 18,0 36,10 C46,-12 84,-12 92,8 C114,0 134,16 126,34 Z" fill="#fdfdfd" opacity="%s"/>' % (f(x), f(y), k, op)

def uszo_felho(x, y, k, dx, dur, op=.88):
    return ('<g transform="translate(%s,%s) scale(%s)"><path d="M0,34 C-10,12 18,0 36,10 C46,-12 84,-12 92,8 C114,0 134,16 126,34 Z" fill="#fdfdfd" opacity="%s">'
            '<animateTransform attributeName="transform" type="translate" values="0,0;%s,0;0,0" dur="%ss" repeatCount="indefinite"/></path></g>') % (f(x), f(y), k, op, dx, dur)

VSZ = ["#f6a5c0", "#fce49a", "#fff", "#c9a8e6", "#f4a38c"]
def viragok(r, n, x0, x1, y0, y1, kihagy=lambda x, y: False):
    s = ""
    for i in range(n):
        x = x0 + r() * (x1 - x0); y = y0 + r() * (y1 - y0)
        if kihagy(x, y):
            continue
        s += '<circle cx="%d" cy="%d" r="%.1f" fill="%s" opacity=".85"/>' % (round(x), round(y), 1.5 + r() * 1.8 + (y - y0) / max(1, y1 - y0) * 1.2, VSZ[i % 5])
    return s

def fucsomok(r, n, x0, x1, y0, y1, c="#9cc98a", kihagy=lambda x, y: False):
    s = ""
    for i in range(n):
        x = x0 + r() * (x1 - x0); y = y0 + r() * (y1 - y0)
        if kihagy(x, y):
            continue
        h = 5 + r() * 6 + (y - y0) / max(1, y1 - y0) * 6
        s += '<path d="M%s,%s q-1,-%s -4,-%s M%s,%s q1,-%s 3,-%s" stroke="%s" stroke-width="1.5" fill="none" stroke-linecap="round"/>' % (
            f(x), f(y), f(h * .6), f(h), f(x + 2), f(y), f(h * .7), f(h * 1.1), c)
    return s

def sima(p):
    d = "M%s,%s" % (f(p[0][0]), f(p[0][1]))
    for i in range(1, len(p) - 1):
        d += " Q%s,%s %s,%s" % (f(p[i][0]), f(p[i][1]), f((p[i][0] + p[i + 1][0]) / 2), f((p[i][1] + p[i + 1][1]) / 2))
    return d + " L%s,%s" % (f(p[-1][0]), f(p[-1][1]))

def ut(p, w):
    d = sima(p)
    return ('<path d="%s" stroke="#d9c79c" stroke-width="%s" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
            '<path d="%s" stroke="#f4e6c4" stroke-width="%s" fill="none" stroke-linecap="round" stroke-linejoin="round"/>') % (d, f(w + 6), d, f(w))

def cserep(xl, xr, y, lep, c, sw=1.3):
    """tetőcserép-sor: kis lefelé ívek y magasságban xl..xr között"""
    d, x = "M%s,%s" % (f(xl), f(y)), xl
    while x + lep <= xr + .1:
        d += " q%s,%s %s,0" % (f(lep / 2), f(lep * .45), f(lep)); x += lep
    return '<path d="%s" fill="none" stroke="%s" stroke-width="%s"/>' % (d, c, sw)

def teto_cserep(bal, jobb, csucs, alap, sorok, c):
    """háromszög-tető cserépsorai: (bal x, jobb x) az alapon, csúcs y, alap y"""
    s = ""
    for i in range(1, sorok + 1):
        y = alap - (alap - csucs) * i / (sorok + 1)
        t = (y - csucs) / (alap - csucs)
        s += cserep(bal * t + 6, jobb * t - 6, y, 14, c)
    return s

def csillag4(x, y, k, c="#fff6c2"):
    return '<path transform="translate(%s,%s) scale(%s)" d="M0,-5 L1.2,-1.2 L5,0 L1.2,1.2 L0,5 L-1.2,1.2 L-5,0 L-1.2,-1.2Z" fill="%s" stroke="none"/>' % (f(x), f(y), k, c)

def fust(x, y, n=3, dur=4.2, h=50):
    s = ""
    for i in range(n):
        b = round(i * dur / n, 2)
        s += ('<circle cx="%s" cy="%s" r="5" fill="#fff" opacity="0"><animate attributeName="cy" values="%s;%s" dur="%ss" begin="%ss" repeatCount="indefinite"/>'
              '<animate attributeName="cx" values="%s;%s" dur="%ss" begin="%ss" repeatCount="indefinite"/>'
              '<animate attributeName="r" values="4;13" dur="%ss" begin="%ss" repeatCount="indefinite"/><animate attributeName="opacity" values="0;.85;0" dur="%ss" begin="%ss" repeatCount="indefinite"/></circle>') % (
            f(x), f(y), f(y), f(y - h), dur, b, f(x), f(x + 14), dur, b, dur, b, dur, b)
    return s


# ── a ház állapotai ──
def fok(s, sw=2.2):
    return '<g filter="url(#firka)" stroke="%s" stroke-width="%s" stroke-linejoin="round" stroke-linecap="round">%s</g>' % (INK, sw, s)

def allvany(r):
    x0, y0, x1, y1 = r
    s = '<g filter="url(#firka)" stroke="#7a5a3e" stroke-width="2.6" stroke-linecap="round" fill="none">'
    xs = [x0 - 6, x1 + 6] + ([(x0 + x1) / 2] if x1 - x0 > 90 else [])
    top = y0 - 8
    for x in xs:
        s += '<path d="M%s,%s L%s,%s"/>' % (f(x), f(y1 + 1), f(x), f(top))
    hs = [y1 - (y1 - top) * k for k in ((.3, .6, .88) if y1 - top > 220 else (.34, .7))]
    for y in hs:
        s += '<path d="M%s,%s L%s,%s" stroke="#c9a27a" stroke-width="6"/><path d="M%s,%s L%s,%s" stroke-width="1.2"/>' % (f(x0 - 14), f(y), f(x1 + 14), f(y), f(x0 - 14), f(y + 3), f(x1 + 14), f(y + 3))
    s += '<path d="M%s,%s L%s,%s M%s,%s L%s,%s" stroke-width="1.6" opacity=".8"/>' % (f(x0 - 6), f(y1), f((x0 + x1) / 2), f(hs[0]), f(x1 + 6), f(hs[0]), f((x0 + x1) / 2), f(hs[1]))
    s += "</g>" + letra(r, hs[-1])
    s += ('<g filter="url(#firka)" stroke="%s" stroke-width="1.4" stroke-linejoin="round"><path d="M%s,%s l34,0 l0,-5 l-34,0 Z M%s,%s l28,0 l0,-5 l-28,0 Z M%s,%s l22,0 l0,-5 l-22,0 Z" fill="#d8b48a"/>'
          '<path d="M%s,%s l2,-11 l12,0 l2,11 Z" fill="#a7b9c9"/><path d="M%s,%s q7,-10 14,0" fill="none"/></g>') % (
        INK, f(x0 - 44), f(y1 + 2), f(x0 - 41), f(y1 - 3), f(x0 - 38), f(y1 - 8), f(x1 - 16), f(y1 + 2), f(x1 - 15), f(y1 - 9))
    return s

def letra(r, csucs=None):
    x0, y0, x1, y1 = r
    ty = csucs if csucs is not None else y1 - (y1 - y0) * .62
    lx = x1 + 14
    s = '<g filter="url(#firka)" stroke="#7a5a3e" stroke-width="2.2" stroke-linecap="round" fill="none"><path d="M%s,%s L%s,%s M%s,%s L%s,%s"/>' % (
        f(lx), f(y1 + 1), f(lx - 8), f(ty), f(lx + 11), f(y1 + 1), f(lx + 3), f(ty))
    n = max(4, int((y1 - ty) / 16))
    for i in range(1, n):
        t = i / n; y = y1 + (ty - y1) * t
        s += '<path d="M%s,%s L%s,%s" stroke-width="1.6"/>' % (f(lx - 8 * t), f(y), f(lx + 11 - 8 * t), f(y))
    return s + "</g>"

def viragsor(r, rnd):
    x0, y0, x1, y1 = r
    s, x = '<g stroke="none">', x0 - 18
    while x < x1 + 18:
        y = y1 + 3 + (rnd() - .5) * 4; c = VSZ[int(rnd() * 5)]; rr = 2.8 + rnd() * 1.8
        s += ('<path d="M%s,%s q-4,-3 -6,-1 q3,2 6,1 Z" fill="#8cc685"/><path d="M%s,%s q4,-3 6,-1 q-3,2 -6,1 Z" fill="#7fbf86"/>'
              '<circle cx="%s" cy="%s" r="%s" fill="%s"/><circle cx="%s" cy="%s" r="%.1f" fill="#f2c14e"/>') % (
            f(x), f(y), f(x), f(y - 2), f(x), f(y - rr - 3), f(rr), c, f(x), f(y - rr - 3), rr * .35)
        x += 7 + rnd() * 5
    s += "</g>"
    for i, fx in enumerate((.12, .5, .88)):
        cx = x0 + (x1 - x0) * fx; cy = y0 - 8 - i % 2 * 10
        s += ('<path transform="translate(%s,%s)" d="M0,-6 L1.4,-1.4 L6,0 L1.4,1.4 L0,6 L-1.4,1.4 L-6,0 L-1.4,-1.4Z" fill="#fff6c2" stroke="#e3a92a" stroke-width=".8" opacity="0">'
              '<animate attributeName="opacity" values="0;1;0" dur="%ss" begin="%ss" repeatCount="indefinite"/></path>') % (f(cx), f(cy), f(2.6 + i * .7), f(i * .9))
    return s

ALLAPOTOK = ["epul", "teto", "ajto", "kesz", "viragos"]

def haz_fajlok(mappa, nev, alap, h, seed):
    bx, by = alap
    sb = h["sb"]; x0, y0, x1, y1 = sb
    e = h.get("ext", sb)
    vb0 = (min(x0 - 52, e[0]), min(y0 - 40, e[1]), max(x1 + 36, e[2]), max(y1 + 16, e[3]))
    vb = (bx + vb0[0], by + vb0[1], vb0[2] - vb0[0], vb0[3] - vb0[1])
    vagas = y1 - (y1 - y0) * .42
    defs = FIRKA + SZURKE + h.get("defs", "") + '<clipPath id="also"><rect x="%s" y="%s" width="%s" height="%s"/></clipPath>' % (f(x0 - 60), f(vagas), f(x1 - x0 + 120), f(y1 - vagas + 40))
    G = h["G"]
    for a in ALLAPOTOK:
        rnd = Rnd(seed)
        if a == "epul":
            t = G + '<g opacity=".26" filter="url(#szurke)">' + fok(h["S"] + h["A"]) + "</g>" + '<g clip-path="url(#also)">' + fok(h["S"]) + "</g>" + allvany(sb)
        elif a == "teto":
            t = G + fok(h["S"] + h["W"]) + letra(sb)
        elif a == "ajto":
            t = G + fok(h["S"] + h["A"])
        elif a == "kesz":
            t = G + fok(h["S"] + h["A"] + h["K"]) + h["KA"]
        else:
            t = G + fok(h["S"] + h["A"] + h["K"] + h["V"]) + h["KA"] + viragsor(sb, rnd)
        t += h.get("L", "")   # 5. kör: a lakó (és a mozdulata) minden állapotban ott van — „akkor is látja, hogy ott élet van”
        irj(mappa, nev + "-" + a, vb, defs, '<g transform="translate(%s,%s)">%s</g>' % (f(bx), f(by), t))
    return vb


# ══════════════════ A HÁZAK (helyi koordináták: 0,0 = a talppont közepe) ══════════════════
def h_bolt():
    """🦔 Tüske néni boltja: meleg sárga fal, terrakotta tető, csíkos előtető, kémény"""
    S = ('<path d="M-106,0 L106,0 L104,-12 L-104,-12 Z" fill="#d9cbb4"/><path d="M-70,-12 V0 M-30,-12 V0 M12,-12 V0 M54,-12 V0 M90,-12 V0" stroke-width="1.1" opacity=".55"/>'
         '<path d="M58,-150 L58,-206 L84,-206 L84,-168 Z" fill="#c98f6e"/><path d="M54,-214 h34 v9 h-34 z" fill="#a8705a"/><path d="M58,-192 H84 M58,-178 H84 M70,-206 V-192 M64,-192 V-178" stroke-width="1" opacity=".5"/>'
         '<path d="M-100,-12 L-100,-120 L100,-120 L100,-12 Z" fill="url(#falB)"/>'
         '<path d="M46,-119 L99,-119 L99,-13 L46,-13 Z" fill="#3c2f5e" opacity=".07" stroke="none"/>'
         '<path d="M-96,-40 H96 M-96,-74 H96" stroke="#e8c58e" stroke-width="1.3" opacity=".9"/>'
         '<path d="M-122,-116 L0,-202 L122,-116 Q0,-108 -122,-116 Z" fill="#d27a5a"/>' + teto_cserep(-122, 122, -202, -116, 3, "#a8503a") +
         '<path d="M-108,-120 L0,-196 L-14,-170 L-92,-118 Z" fill="#fff" opacity=".18" stroke="none"/>')
    W = ('<path d="M-26,-12 V-62 Q0,-78 26,-62 V-12 Z" fill="#7d6a80" opacity=".85"/><rect x="-86" y="-88" width="44" height="32" fill="#8a7b92"/><rect x="42" y="-88" width="44" height="32" fill="#8a7b92"/>')
    ab = lambda x: ('<rect x="%d" y="-102" width="9" height="40" rx="2" fill="#8fc0a8"/><rect x="%d" y="-102" width="9" height="40" rx="2" fill="#8fc0a8"/>'
                    '<rect x="%d" y="-100" width="44" height="34" fill="#cfe2f2"/><path d="M%d,-100 V-66 M%d,-83 H%d" stroke-width="1.6"/>'
                    '<path d="M%d,-70 L%d,-94" stroke="#fff" stroke-width="3" opacity=".75"/><path d="M%d,-66 h50 v-5 h-50 z" fill="#c99a6a"/>') % (
        x - 11, x + 46, x, x + 22, x, x + 44, x + 5, x + 13, x - 3)
    A = ('<path d="M-34,0 h68 l-4,-7 h-60 z" fill="#cfc6dc"/><path d="M-26,-12 V-62 Q0,-78 26,-62 V-12 Z" fill="#b07a52"/>'
         '<path d="M-9,-14 V-71 M9,-14 V-71" stroke-width="1.2" opacity=".55"/><circle cx="16" cy="-38" r="3" fill="#f2c14e"/>' + ab(-86) + ab(42))
    K = ('<path d="M-106,-114 H106 L98,-102 H-98 Z" fill="url(#csik)"/>'
         '<path d="M-98,-102 q7,8 14,0 q7,8 14,0 q7,8 14,0 q7,8 14,0 q7,8 14,0 q7,8 14,0 q7,8 14,0 q7,8 14,0 q7,8 14,0 q7,8 14,0 q7,8 14,0 q7,8 14,0 q7,8 14,0 q7,8 14,0" fill="#fff6ee" stroke="#a83a44" stroke-width="1.4"/>'
         '<rect x="-46" y="-160" width="92" height="28" rx="6" fill="#fffaf0"/>'
         '<circle cx="-24" cy="-149" r="6" fill="#e8505b"/><path d="M-24,-143 v8" stroke-width="1.6"/>'
         '<rect x="-7" y="-155" width="14" height="16" rx="3" fill="#cfe2f2"/><circle cx="0" cy="-145" r="3.2" fill="#fce49a" stroke="none"/><circle cx="-2" cy="-149" r="2.4" fill="#f6a5c0" stroke="none"/>'
         '<circle cx="24" cy="-147" r="6.5" fill="#a7d99a"/><path d="M24,-153 q2,-4 5,-4" fill="none" stroke-width="1.4"/>'
         '<g stroke-width="1.2"><circle cx="-76" cy="-71" r="4.5" fill="#e8505b"/><circle cx="-66" cy="-71" r="4.5" fill="#fce49a"/><circle cx="-56" cy="-71" r="4.5" fill="#a7d99a"/>'
         '<rect x="54" y="-80" width="10" height="13" rx="2" fill="#f6a5c0"/><rect x="68" y="-78" width="10" height="11" rx="2" fill="#c9a8e6"/></g>'
         '<path d="M30,-72 h14 v6" fill="none" stroke-width="2"/><path d="M38,-66 h12 l-2,13 h-8 z" fill="#fce49a"/>'
         '<path d="M-130,0 Q-134,-18 -128,-32 H-104 Q-100,-18 -104,0 Z" fill="#c99a6a"/><path d="M-131,-12 H-102 M-130,-24 H-103" stroke-width="1.2" opacity=".7"/>'
         '<circle cx="-122" cy="-36" r="5.5" fill="#e8505b"/><circle cx="-111" cy="-37" r="5.5" fill="#f4a38c"/><circle cx="-116" cy="-44" r="5" fill="#e8505b"/>')
    KA = fust(71, -216) + '<circle cx="44" cy="-58" r="14" fill="#fff3b0" opacity=".45"><animate attributeName="opacity" values=".3;.65;.3" dur="3s" repeatCount="indefinite"/></circle>'
    V = ('<path d="M-98,-14 Q-108,-50 -97,-78 Q-90,-98 -100,-112 M98,-14 Q108,-50 97,-78 Q90,-98 100,-112" stroke="#6ea96a" stroke-width="2" fill="none"/>'
         '<g stroke-width="1"><circle cx="-102" cy="-40" r="4.5" fill="#f6a5c0"/><circle cx="-97" cy="-70" r="4.5" fill="#fff"/><circle cx="-101" cy="-96" r="4" fill="#f6a5c0"/>'
         '<circle cx="102" cy="-36" r="4.5" fill="#f6a5c0"/><circle cx="97" cy="-66" r="4.5" fill="#fce49a"/><circle cx="101" cy="-98" r="4" fill="#f6a5c0"/>'
         '<circle cx="-80" cy="-63" r="3.5" fill="#f4a38c"/><circle cx="-62" cy="-63" r="3.5" fill="#fff"/><circle cx="48" cy="-63" r="3.5" fill="#c9a8e6"/><circle cx="66" cy="-63" r="3.5" fill="#f6a5c0"/><circle cx="80" cy="-63" r="3.5" fill="#fce49a"/></g>')
    defs = ('<linearGradient id="falB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbe3b8"/><stop offset="1" stop-color="#f2cd94"/></linearGradient>'
            '<pattern id="csik" width="28" height="28" patternUnits="userSpaceOnUse"><rect width="14" height="28" fill="#e8505b"/><rect x="14" width="14" height="28" fill="#fff6ee"/></pattern>')
    return dict(G=arnyek(0, 4, 132, 16), S=S, W=W, A=A, K=K, KA=KA, V=V, sb=(-110, -206, 110, 0), ext=(-146, -275, 130, 18), defs=defs)


def h_sator():
    """🧺 a Tündérvásár sátra: piros-fehér csíkos, csúcsos sátor; előtte a kosár és a dobozok (a két tárgy)"""
    S = ('<path d="M-114,0 V-104 M114,0 V-104" stroke="#8a5a3a" stroke-width="6"/>'
         '<path d="M-120,-2 L-110,-110 L0,-190 L110,-110 L120,-2 Q0,4 -120,-2 Z" fill="url(#csikP)"/>'
         '<path d="M0,-190 L-60,-2 M0,-190 L60,-2" stroke="#a83a44" stroke-width="1.3" opacity=".55"/>'
         '<path d="M0,-190 L110,-110 L120,-2 Q80,1 40,0 Z" fill="#3c2f5e" opacity=".08" stroke="none"/>'
         '<path d="M-104,-114 L0,-186 L-30,-150 L-96,-112 Z" fill="#fff" opacity=".2" stroke="none"/>'
         '<circle cx="0" cy="-193" r="6" fill="#fce49a"/>')
    W = '<path d="M0,-108 V-2" stroke="#a83a44" stroke-width="2.2"/><path d="M-120,-2 l-12,6 M120,-2 l12,6" stroke-width="1.4"/>'
    A = ('<path d="M-46,0 Q-42,-70 0,-102 Q42,-70 46,0 Z" fill="#6e4458" opacity=".78"/>'
         '<rect x="-32" y="-28" width="64" height="28" fill="#e9c9a0"/><path d="M-32,-20 H32" stroke-width="1.1" opacity=".6"/>'
         '<circle cx="-16" cy="-32" r="5" fill="#fce49a"/><circle cx="-4" cy="-33" r="5" fill="#f6a5c0"/><circle cx="10" cy="-32" r="5" fill="#9ec9f0"/>'
         '<path d="M-46,0 Q-42,-70 0,-102 Q-22,-62 -30,0 Z" fill="url(#csikP)"/><path d="M46,0 Q42,-70 0,-102 Q22,-62 30,0 Z" fill="url(#csikP)"/>'
         '<circle cx="-37" cy="-42" r="3.5" fill="#fce49a"/><circle cx="37" cy="-42" r="3.5" fill="#fce49a"/>')
    K = ('<path d="M-110,-110 q11,14 22,0 q11,14 22,0 q11,14 22,0 q11,14 22,0 q11,14 22,0 q11,14 22,0 q11,14 22,0 q11,14 22,0 q11,14 22,0 q11,14 22,0 Z" fill="#fff6ee" stroke="#a83a44" stroke-width="1.6"/>'
         '<path d="M0,-196 V-238" stroke="#8a6a52" stroke-width="4"/>'
         '<g transform="translate(-84 -2)"><path d="M-30,0 Q-34,-34 0,-36 Q34,-34 30,0 Z" fill="#e8b27a"/><path d="M-26,-30 Q0,-72 26,-30" fill="none" stroke-width="3"/>'
         '<path d="M-29,-12 H29 M-31,-24 H31" stroke="#b5804a" stroke-width="1.4"/><circle cx="-12" cy="-38" r="8" fill="#e8505b"/><circle cx="6" cy="-41" r="8" fill="#fce49a"/><circle cx="20" cy="-35" r="7" fill="#a7d99a"/></g>'
         '<g transform="translate(90 -2)"><rect x="-34" y="-30" width="34" height="30" fill="#e9c9a0"/><rect x="2" y="-24" width="30" height="24" fill="#f2d5ae"/><rect x="-22" y="-56" width="32" height="26" fill="#f2d5ae"/>'
         '<path d="M-34,-15 H0 M2,-12 H32 M-22,-43 H10" stroke="#b5804a" stroke-width="1.4"/><path d="M-6,-56 v26" stroke="#e8505b" stroke-width="2.4"/></g>'
         '<path d="M104,-104 v12" stroke-width="1.6"/><path d="M98,-92 h12 l-2,12 h-8 z" fill="#fce49a"/>')
    KA = ('<path d="M0,-238 L38,-228 L0,-216 Z" fill="#fce49a" stroke="#d1a23a" stroke-width="2"><animateTransform attributeName="transform" type="skewY" values="0;-7;0" dur="3s" repeatCount="indefinite"/></path>'
          '<path transform="translate(0,-193)" d="M0,-9 L2,-2 L9,0 L2,2 L0,9 L-2,2 L-9,0 L-2,-2Z" fill="#fff" opacity="0"><animate attributeName="opacity" values="0;1;0" dur="2.8s" repeatCount="indefinite"/></path>'
          '<circle cx="104" cy="-86" r="12" fill="#fff3b0" opacity=".4"><animate attributeName="opacity" values=".25;.6;.25" dur="3.4s" repeatCount="indefinite"/></circle>')
    V = ''.join('<circle cx="%d" cy="-103" r="3.6" fill="%s" stroke-width="1"/>' % (x, VSZ[i % 5]) for i, x in enumerate(range(-99, 104, 22)))
    defs = '<pattern id="csikP" width="28" height="28" patternUnits="userSpaceOnUse"><rect width="14" height="28" fill="#e8505b"/><rect x="14" width="14" height="28" fill="#fff6ee"/></pattern>'
    return dict(G=arnyek(0, 4, 138, 16), S=S, W=W, A=A, K=K, KA=KA, V=V, sb=(-122, -194, 122, 0), ext=(-140, -248, 140, 18), defs=defs)


def h_zsib():
    """🦊 Zsivány standja: piros ponyva, kacatpolc (bal), kassza (jobb), a róka farka kikandikál"""
    S = ('<path d="M-116,-2 V-128 H116 V-2 Z" fill="#e8cfa6"/><path d="M-80,-128 V-2 M-40,-128 V-2 M0,-128 V-2 M40,-128 V-2 M80,-128 V-2" stroke="#cdae84" stroke-width="1.4"/>'
         '<path d="M-120,0 V-132 M120,0 V-132" stroke="#8a5a3a" stroke-width="7"/>'
         '<path d="M-142,-130 L-110,-172 H110 L142,-130 Z" fill="#e8505b"/>'
         '<path d="M-110,-172 L-124,-130 M-66,-172 L-74,-130 M-22,-172 L-24,-130 M22,-172 L24,-130 M66,-172 L74,-130 M110,-172 L124,-130" stroke="#fff6ee" stroke-width="7" opacity=".85"/>'
         '<path d="M-104,-168 H40 L36,-160 H-100 Z" fill="#fff" opacity=".22" stroke="none"/>')
    polc = '<g transform="translate(-50 -4)"><rect x="-62" y="-92" width="124" height="92" fill="#d8b48a"/><path d="M-62,-62 H62 M-62,-32 H62" stroke-width="2.5"/></g>'
    asztal = '<g transform="translate(76 -4)"><rect x="-38" y="-48" width="76" height="48" rx="4" fill="#c99a6a"/><path d="M-30,-48 V0 M30,-48 V0" stroke-width="1.2" opacity=".5"/></g>'
    W = polc + asztal
    A = (polc + asztal +
         '<g transform="translate(-50 -4)"><circle cx="-40" cy="-73" r="9" fill="#9ec9f0"/><path d="M-12,-64 l10,-18 l10,18z" fill="#fce49a"/><rect x="22" y="-82" width="20" height="18" fill="#c9a8e6"/>'
         '<path d="M-50,-36 q10,-16 20,0" stroke="#8a5a3a" stroke-width="3" fill="none"/><circle cx="8" cy="-44" r="8" fill="#f6a5c0"/><rect x="30" y="-50" width="16" height="16" rx="3" fill="#a7d99a"/>'
         '<path d="M-44,-8 h22 v-12 h-22z" fill="#e9c9a0"/><circle cx="2" cy="-14" r="7" fill="#f4a38c"/><path d="M22,-6 l8,-16 l8,16z" fill="#9ec9f0"/></g>'
         '<g transform="translate(76 -52)"><rect x="-26" y="-28" width="52" height="28" rx="4" fill="#fffaf0"/><circle cx="-10" cy="-14" r="4" fill="#c9862a"/><circle cx="4" cy="-14" r="4" fill="#c9862a"/>'
         '<path d="M-30,0 Q0,12 30,0" fill="none" stroke-width="2"/><circle cx="16" cy="6" r="6" fill="#fce49a" stroke="#d1a23a" stroke-width="2"/></g>')
    K = ('<path d="M-142,-130 q10,16 20,0 q10,16 20,0 q10,16 20,0 q10,16 20,0 q10,16 20,0 q10,16 20,0 q10,16 20,0 q10,16 20,0 q10,16 20,0 q10,16 20,0 q10,16 20,0 q10,16 20,0 q10,16 20,0 q10,16 20,0 Z" fill="#fff6ee" stroke="#a83a44" stroke-width="1.6"/>'
         '<g transform="translate(0 -176)"><rect x="-34" y="-28" width="68" height="28" rx="6" fill="#fffaf0"/><path d="M-12,-6 L-16,-22 L-6,-16 L0,-20 L6,-16 L16,-22 L12,-6 Q0,2 -12,-6 Z" fill="#e8913a"/>'
         '<path d="M-6,-10 l2,2 M6,-10 l-2,2" stroke-width="1.6"/><circle cx="0" cy="-6" r="1.8" fill="' + INK + '"/></g>'
         '<path d="M-96,-118 v12 M-60,-116 v18 M70,-118 v14" stroke-width="1.2"/>'
         '<path d="M-104,-106 h16 l-2,10 h-12 z" fill="#a7b9c9"/><path d="M-102,-106 q6,-6 12,0" fill="none" stroke-width="1.4"/>'
         '<circle cx="-60" cy="-94" r="5" fill="#fce49a"/><path d="M-58,-94 h8 v4 M-53,-94 v4" stroke-width="1.6" fill="none"/>'
         '<path d="M70,-104 q-12,6 -14,16 h28 q-2,-10 -14,-16 Z" fill="#c9a8e6"/><path d="M70,-88 v10 q0,4 4,4" fill="none" stroke-width="1.6"/>'
         '<path d="M36,-36 q-2,-10 6,-12 q8,2 6,12 z" fill="#fce49a"/><circle cx="42" cy="-50" r="2" fill="#d1a23a"/>')
    KA = ('<g filter="url(#firka)" stroke="#a8582a" stroke-width="2.5" stroke-linejoin="round"><path d="M118,-40 Q162,-62 152,-10 Q142,10 120,0 Z" fill="#e8913a">'
          '<animateTransform attributeName="transform" type="rotate" values="0 120 0;9 120 0;0 120 0;0 120 0" dur="3.2s" repeatCount="indefinite"/></path></g>'
          '<path d="M150,-16 q4,4 2,10 q-6,-2 -6,-8 z" fill="#fff6ee" stroke="none" opacity=".9"><animateTransform attributeName="transform" type="rotate" values="0 120 0;9 120 0;0 120 0;0 120 0" dur="3.2s" repeatCount="indefinite"/></path>'
          '<g><path d="M-60,-98 v-18" stroke="' + INK + '" stroke-width="1.2"/><animateTransform attributeName="transform" type="rotate" values="-6 -60 -116;6 -60 -116;-6 -60 -116" dur="2.6s" repeatCount="indefinite"/></g>')
    V = ('<g stroke-width="1"><circle cx="-130" cy="-6" r="5" fill="#f6a5c0"/><circle cx="-122" cy="-12" r="4" fill="#fce49a"/><circle cx="128" cy="-60" r="4" fill="#f6a5c0"/>'
         '<path d="M-120,-20 Q-126,-60 -118,-100 M120,-60 Q126,-90 118,-124" stroke="#6ea96a" stroke-width="2" fill="none"/>'
         '<circle cx="-123" cy="-56" r="4" fill="#fff"/><circle cx="-119" cy="-90" r="4" fill="#f6a5c0"/><circle cx="123" cy="-100" r="4" fill="#fce49a"/></g>')
    return dict(G=arnyek(0, 5, 150, 16, .14), S=S, W=W, A=A, K=K, KA=KA, V=V, sb=(-142, -174, 142, 0), ext=(-160, -214, 166, 18))


def h_szalag():
    """🎀 Szalagműhely: égszínkék ház, a homlokzaton szalagok lengenek, mellette orsós oszlop"""
    S = ('<path d="M-100,0 L100,0 L98,-10 L-98,-10 Z" fill="#cfc6dc"/>'
         '<path d="M-96,-10 L-96,-120 L96,-120 L96,-10 Z" fill="url(#falSz)"/>'
         '<path d="M44,-119 L95,-119 L95,-11 L44,-11 Z" fill="#3c2f5e" opacity=".07" stroke="none"/>'
         '<path d="M-96,-120 V-10 M96,-120 V-10" stroke-width="3"/>'
         '<path d="M-114,-116 L0,-198 L114,-116 Q0,-108 -114,-116 Z" fill="#9fb8e0"/>' + teto_cserep(-114, 114, -198, -116, 3, "#6f86b8") +
         '<path d="M-100,-120 L0,-192 L-12,-168 L-86,-118 Z" fill="#fff" opacity=".2" stroke="none"/><circle cx="0" cy="-150" r="15" fill="#e8f0ff"/>')
    W = ('<path d="M-24,-10 V-60 Q0,-76 24,-60 V-10 Z" fill="#7d7a96" opacity=".85"/><rect x="-82" y="-88" width="40" height="30" fill="#8a87a2"/><rect x="42" y="-88" width="40" height="30" fill="#8a87a2"/><circle cx="0" cy="-150" r="9" fill="#8a87a2"/>')
    ab = lambda x: ('<rect x="%d" y="-88" width="40" height="30" fill="#d6e6f6"/><path d="M%d,-88 V-58 M%d,-73 H%d" stroke-width="1.5"/><path d="M%d,-62 L%d,-84" stroke="#fff" stroke-width="3" opacity=".75"/>'
                    '<path d="M%d,-58 h46 v-5 h-46 z" fill="#b8c6e0"/>') % (x, x + 20, x, x + 40, x + 5, x + 12, x - 3)
    A = ('<path d="M-30,0 h60 l-4,-7 h-52 z" fill="#d9d2e6"/><path d="M-24,-10 V-60 Q0,-76 24,-60 V-10 Z" fill="#a8764f"/><path d="M0,-12 V-70" stroke-width="1.2" opacity=".55"/>'
         '<circle cx="-7" cy="-36" r="2.6" fill="#f2c14e"/><circle cx="7" cy="-36" r="2.6" fill="#f2c14e"/>' + ab(-82) + ab(42) +
         '<circle cx="0" cy="-150" r="9" fill="#d6e6f6"/><path d="M0,-159 V-141 M-9,-150 H9" stroke-width="1.3"/>')
    K = ('<path d="M-96,-104 Q-48,-90 0,-104 Q48,-90 96,-104" fill="none" stroke="#8a6a52" stroke-width="2"/>'
         '<g transform="translate(0 -86)"><path d="M0,0 Q-15,-11 -17,0 Q-15,11 0,0 Q15,-11 17,0 Q15,11 0,0 Z" fill="#f6a5c0"/><path d="M-3,2 l-6,12 M3,2 l6,12" stroke="#e0417a" stroke-width="2.4"/><circle r="3.4" fill="#e0417a"/></g>'
         '<g transform="translate(124 -4)"><rect x="-6" y="-62" width="12" height="62" fill="#d8b48a"/><ellipse cy="-64" rx="19" ry="8" fill="#f6a5c0"/><ellipse cy="-56" rx="15" ry="5" fill="#e0417a" opacity=".5"/>'
         '<path d="M-16,-60 q16,8 32,0" fill="none" stroke="#fff" stroke-width="1.4"/></g>')
    szal = lambda x, y, L, c, dur, dx: ('<path d="M%d,%d v%d" stroke="%s" stroke-width="7" stroke-linecap="round" fill="none"><animate attributeName="d" values="M%d,%d v%d;M%d,%d q%d,%d 0,%d;M%d,%d v%d" dur="%ss" repeatCount="indefinite"/></path>') % (
        x, y, L, c, x, y, L, x, y, dx, L // 2, L, x, y, L, dur)
    KA = (szal(-70, -98, 40, "#f6a5c0", 2.4, 6) + szal(-46, -95, 50, "#fce49a", 3.1, -5) + szal(-22, -94, 30, "#9ec9f0", 2.7, 5) +
          szal(26, -94, 34, "#c9a8e6", 2.9, -5) + szal(48, -95, 46, "#a7d99a", 2.5, 6) + szal(70, -98, 36, "#f4a38c", 2.8, -6) +
          '<path d="M118,-60 q10,30 -2,52" stroke="#f6a5c0" stroke-width="5" fill="none" stroke-linecap="round"><animate attributeName="d" values="M118,-60 q10,30 -2,52;M118,-60 q16,28 4,52;M118,-60 q10,30 -2,52" dur="3.4s" repeatCount="indefinite"/></path>')
    V = ('<g stroke-width="1"><rect x="-92" y="-52" width="44" height="8" fill="#b07a52"/><rect x="46" y="-52" width="44" height="8" fill="#b07a52"/>'
         + ''.join('<circle cx="%d" cy="-55" r="4" fill="%s"/>' % (x, VSZ[i % 5]) for i, x in enumerate([-86, -76, -66, -56, 52, 62, 72, 82])) + '</g>')
    defs = '<linearGradient id="falSz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eef4ff"/><stop offset="1" stop-color="#dbe6fb"/></linearGradient>'
    return dict(G=arnyek(0, 5, 128, 16, .14), S=S, W=W, A=A, K=K, KA=KA, V=V, sb=(-114, -200, 114, 0), ext=(-132, -250, 150, 18), defs=defs)


def h_deli():
    """☀️ Déli vásár: napsárga-krém csíkos sátorsor (nem a Tündérvásár piros csúcsos sátra), a nagyobbik oszlopán a nap"""
    def sator(x, y, w, h, nagy):
        p = ('<g transform="translate(%d %d)"><path d="M-%d,0 V-%d M%d,0 V-%d" stroke="#8a5a3a" stroke-width="6"/>' % (x, y, w - 14, h, w - 14, h) +
             '<path d="M-%d,-%d L0,-%d L%d,-%d Q0,-%d -%d,-%d Z" fill="url(#csikS)"/>' % (w, h, h + 56 + nagy * 8, w, h, h - 8, w, h) +
             '<path d="M0,-%d L%d,-%d Q%d,-%d 0,-%d Z" fill="#3c2f5e" opacity=".08" stroke="none"/>' % (h + 56 + nagy * 8, w, h, w // 2, h - 6, h - 6) +
             '<path d="M-%d,-%d L0,-%d L-14,-%d Z" fill="#fff" opacity=".25" stroke="none"/></g>' % (w - 10, h + 2, h + 52 + nagy * 8, h + 30))
        return p
    S = sator(-110, 0, 84, 80, 0) + sator(90, -10, 96, 96, 1)
    pult = lambda x, y, w: '<g transform="translate(%d %d)"><rect x="-%d" y="-34" width="%d" height="34" fill="#e9c9a0"/><path d="M-%d,-20 H%d" stroke-width="1.1" opacity=".5"/></g>' % (x, y, w, 2 * w, w, w)
    W = pult(-110, 0, 60) + pult(90, -10, 66)
    A = (W + '<path d="M-172,-34 H-48 L-52,-24 H-168 Z M24,-44 H156 L152,-34 H28 Z" fill="#fff6e0"/>'
         '<g stroke-width="1.6"><circle cx="-140" cy="-42" r="9" fill="#e8505b"/><circle cx="-118" cy="-44" r="9" fill="#fce49a"/><circle cx="-96" cy="-42" r="9" fill="#a7d99a"/>'
         '<circle cx="-76" cy="-41" r="7" fill="#f4a38c"/><rect x="50" y="-72" width="26" height="26" fill="#f2d5ae"/><rect x="90" y="-68" width="34" height="22" fill="#f2d5ae"/>'
         '<path d="M136,-48 q2,-14 10,-14 q8,0 10,14 z" fill="#c9a8e6"/><path d="M50,-59 H76 M90,-57 H124" stroke="#b5804a" stroke-width="1.2"/></g>')
    K = ('<path d="M-194,-80 q12,14 24,0 q12,14 24,0 q12,14 24,0 q12,14 24,0 q12,14 24,0 q12,14 24,0 q12,14 24,0 Z" fill="#f2b54a" stroke="#b5804a" stroke-width="1.6"/>'
         '<path d="M-6,-106 q12,14 24,0 q12,14 24,0 q12,14 24,0 q12,14 24,0 q12,14 24,0 q12,14 24,0 q12,14 24,0 q12,14 24,0 Z" fill="#f2b54a" stroke="#b5804a" stroke-width="1.6"/>'
         '<path d="M-110,-136 Q-14,-100 90,-162" fill="none" stroke="#8a6a52" stroke-width="1.4"/>'
         + ''.join('<path d="M%s,%s l7,14 l7,-14 z" fill="%s" stroke-width="1"/>' % (f(-110 + 200 * t - 7), f(-136 + 36 * 2 * t * (1 - t) * 1.3 - 26 * t * t + 0), c)
                   for t, c in ((.15, "#fce49a"), (.32, "#f4a38c"), (.49, "#fff6e0"), (.66, "#f2b54a"), (.83, "#fce49a"))) +
         '<path d="M90,-170 V-206" stroke="#8a6a52" stroke-width="3"/>'
         '<path d="M-186,-80 v10 M-34,-80 v10" stroke-width="1.4"/><path d="M-190,-70 h8 l-1,9 h-6 z M-38,-70 h8 l-1,9 h-6 z" fill="#fce49a"/>'
         '<g transform="translate(176 0)"><path d="M-12,0 L-14,-16 H14 L12,0 Z" fill="#c98f6e"/><path d="M0,-16 V-52" stroke="#6ea96a" stroke-width="2.4"/>'
         '<circle cx="0" cy="-56" r="9" fill="#fce49a"/><circle cx="0" cy="-56" r="4" fill="#a8764f"/><path d="M0,-34 q-10,-6 -12,2 q8,4 12,-2 Z" fill="#8cc685"/></g>')
    KA = ('<g transform="translate(90 -220)"><g><animateTransform attributeName="transform" type="translate" values="0,0;0,-4;0,0" dur="3s" repeatCount="indefinite"/>'
          '<circle r="24" fill="#fff6c2" opacity=".55"/>'
          '<g stroke="#e0a43a" stroke-width="3.4" stroke-linecap="round"><path d="M0,-22v-8M0,22v8M-22,0h-8M22,0h8M-16,-16l-6,-6M16,-16l6,-6M-16,16l-6,6M16,16l6,6"/>'
          '<animateTransform attributeName="transform" type="rotate" values="0;45" dur="6s" repeatCount="indefinite"/></g>'
          '<circle r="15" fill="#fce49a" stroke="#e0a43a" stroke-width="3"/><path d="M-6,-2 q2,-3 4,0 M2,-2 q2,-3 4,0 M-5,5 q5,4 10,0" stroke="#b5804a" stroke-width="1.6" fill="none" stroke-linecap="round"/></g></g>'
          '<circle cx="-186" cy="-64" r="10" fill="#fff3b0" opacity=".35"><animate attributeName="opacity" values=".2;.55;.2" dur="3s" repeatCount="indefinite"/></circle>'
          '<circle cx="-34" cy="-64" r="10" fill="#fff3b0" opacity=".35"><animate attributeName="opacity" values=".2;.55;.2" dur="3.6s" repeatCount="indefinite"/></circle>')
    V = ''.join('<circle cx="%d" cy="%d" r="4" fill="%s" stroke-width="1"/>' % (x, y, VSZ[i % 5]) for i, (x, y) in enumerate([(-190, -78), (-160, -76), (-130, -78), (-60, -76), (-30, -78), (0, -104), (40, -102), (80, -104), (120, -102), (160, -104)]))
    defs = '<pattern id="csikS" width="30" height="30" patternUnits="userSpaceOnUse"><rect width="15" height="30" fill="#f2b54a"/><rect x="15" width="15" height="30" fill="#fff6e0"/></pattern>'
    return dict(G=arnyek(0, 8, 214, 18, .12), S=S, W=W, A=A, K=K, KA=KA, V=V, sb=(-196, -172, 196, 0), ext=(-214, -258, 210, 22), defs=defs)


def h_irasbeli():
    """🏰 Garas tornya: lent kő (Írásbeli szorzás), fent fa (Írásbeli osztás), piros tető, zászló, óra"""
    S = ('<path d="M-56,0 V-150 H56 V0 Z" fill="#ddd0ba"/>'
         '<g stroke="#a8977e" stroke-width="1.8"><path d="M-56,-38 H56 M-56,-76 H56 M-56,-114 H56 M-22,0 V-38 M24,0 V-38 M0,-38 V-76 M-34,-38 V-76 M38,-38 V-76 M-14,-76 V-114 M26,-76 V-114 M-36,-114 V-150 M10,-114 V-150 M44,-114 V-150"/></g>'
         '<path d="M-50,-150 V-262 H50 V-150 Z" fill="#ecd0a8"/>'
         '<path d="M-30,-152 V-260 M-10,-152 V-260 M10,-152 V-260 M30,-152 V-260" stroke="#c9a27a" stroke-width="1.8"/>'
         '<path d="M24,-150 L56,-150 L56,0 L24,0 Z M22,-262 L50,-262 L50,-150 L22,-150 Z" fill="#3c2f5e" opacity=".08" stroke="none"/>'
         '<rect x="-62" y="-158" width="124" height="10" rx="2" fill="#c9a27a"/>'
         '<path d="M-68,-258 L0,-342 L68,-258 Q0,-250 -68,-258 Z" fill="#c96a4a"/>' + teto_cserep(-68, 68, -342, -258, 3, "#a8503a") +
         '<path d="M-56,-262 L0,-336 L-8,-312 L-44,-260 Z" fill="#fff" opacity=".2" stroke="none"/>'
         '<path d="M0,-342 V-384" stroke="#6e4a36" stroke-width="4"/><circle cx="0" cy="-296" r="13" fill="#fffaf0"/>')
    W = ('<path d="M-20,0 V-38 Q0,-62 20,-38 V0 Z" fill="#6e5a6e" opacity=".85"/><rect x="-18" y="-232" width="36" height="40" fill="#8a7b92"/>'
         '<rect x="-38" y="-108" width="10" height="22" rx="5" fill="#8a7b92"/><rect x="28" y="-108" width="10" height="22" rx="5" fill="#8a7b92"/>')
    A = ('<path d="M-28,0 h56 l-4,-6 h-48 z" fill="#cfc6dc"/><path d="M-20,0 V-38 Q0,-62 20,-38 V0 Z" fill="#8a5a3a"/><path d="M0,-2 V-50 M-12,-2 V-44 M12,-2 V-44" stroke-width="1.1" opacity=".5"/>'
         '<circle cx="-8" cy="-22" r="2.2" fill="#f2c14e"/><circle cx="8" cy="-22" r="2.2" fill="#f2c14e"/>'
         '<rect x="-18" y="-232" width="36" height="40" fill="#cfe2f2"/><path d="M0,-232 V-192 M-18,-212 H18" stroke-width="1.5"/><path d="M-13,-198 L-5,-226" stroke="#fff" stroke-width="3" opacity=".75"/>'
         '<rect x="-38" y="-108" width="10" height="22" rx="5" fill="#cfe2f2"/><rect x="28" y="-108" width="10" height="22" rx="5" fill="#cfe2f2"/>'
         '<circle cx="0" cy="-296" r="13" fill="#fffaf0"/><path d="M0,-306 v3 M10,-296 h-3 M0,-286 v-3 M-10,-296 h3" stroke-width="1.4"/>')
    K = ('<path d="M-32,-190 H32 V-184 H-32 Z" fill="#b5804a"/><path d="M-28,-184 V-176 M-14,-184 V-176 M0,-184 V-176 M14,-184 V-176 M28,-184 V-176 M-32,-176 H32" stroke-width="1.6" fill="none"/>'
         '<path d="M-56,-118 h-20 v6" fill="none" stroke-width="2"/><circle cx="-76" cy="-98" r="12" fill="#fce49a" stroke="#d1a23a" stroke-width="2.4"/><circle cx="-76" cy="-98" r="6.5" fill="none" stroke="#d1a23a" stroke-width="1.4"/>'
         '<path d="M28,-52 h12 v6" fill="none" stroke-width="1.8"/><path d="M34,-46 h10 l-2,12 h-6 z" fill="#fce49a"/>'
         '<path d="M-50,-262 L-40,-246 L-30,-262 L-20,-246 L-10,-262 L0,-246 L10,-262 L20,-246 L30,-262 L40,-246 L50,-262" fill="none" stroke="#e0a43a" stroke-width="1.6"/>')
    KA = ('<path d="M0,-384 L42,-374 L0,-362 Z" fill="#fce49a" stroke="#d1a23a" stroke-width="2"><animateTransform attributeName="transform" type="skewY" values="0;-8;0" dur="2.6s" repeatCount="indefinite"/></path>'
          '<g transform="translate(0 -296)" stroke="#6e4a36" stroke-linecap="round"><path d="M0,0 v-8" stroke-width="2"><animateTransform attributeName="transform" type="rotate" values="0;360" dur="60s" repeatCount="indefinite"/></path>'
          '<path d="M0,0 h6" stroke-width="2"><animateTransform attributeName="transform" type="rotate" values="0;360" dur="600s" repeatCount="indefinite"/></path></g>'
          '<circle cx="39" cy="-38" r="11" fill="#fff3b0" opacity=".4"><animate attributeName="opacity" values=".25;.6;.25" dur="3.2s" repeatCount="indefinite"/></circle>')
    V = ('<path d="M-54,-4 Q-62,-40 -50,-70 Q-44,-96 -56,-126 M54,-4 Q60,-30 50,-56" stroke="#6ea96a" stroke-width="2.2" fill="none"/>'
         '<g stroke="#5f8e6a" stroke-width="1"><path d="M-58,-30 q-8,-4 -10,2 q6,4 10,-2 Z M-50,-62 q-8,-4 -10,2 q6,4 10,-2 Z M-52,-100 q-8,-4 -10,2 q6,4 10,-2 Z M56,-30 q8,-4 10,2 q-6,4 -10,-2 Z" fill="#8cc685"/>'
         '<circle cx="-56" cy="-46" r="4" fill="#f6a5c0"/><circle cx="-49" cy="-84" r="4" fill="#fff"/><circle cx="52" cy="-46" r="4" fill="#fce49a"/>'
         '<path d="M-24,-190 q-4,-8 2,-10 M-8,-190 q0,-9 4,-9 M8,-190 q2,-8 6,-8 M24,-190 q4,-8 -2,-10" fill="none" stroke="#6ea96a" stroke-width="1.6"/>'
         '<circle cx="-22" cy="-200" r="3.6" fill="#f6a5c0"/><circle cx="-4" cy="-200" r="3.6" fill="#fce49a"/><circle cx="14" cy="-199" r="3.6" fill="#c9a8e6"/><circle cx="22" cy="-201" r="3.6" fill="#f4a38c"/></g>')
    return dict(G=arnyek(0, 8, 96, 14, .14), S=S, W=W, A=A, K=K, KA=KA, V=V, sb=(-70, -346, 70, 0), ext=(-104, -398, 92, 22))


def h_josda():
    """🔭 Jósda a dombtetőn: égszínkék ház, kupola, a résben a távcső lassan körbenéz, oldalt lámpás"""
    S = ('<path d="M-90,0 L90,0 L86,-10 L-86,-10 Z" fill="#cfc6dc"/>'
         '<rect x="-76" y="-66" width="152" height="56" fill="url(#falJ)"/>'
         '<path d="M30,-66 H76 V-10 H30 Z" fill="#3c2f5e" opacity=".07" stroke="none"/>'
         '<path d="M-74,-70 C-74,-152 74,-152 74,-70 Z" fill="url(#kupola)"/>'
         '<path d="M-38,-72 C-42,-118 -12,-131 0,-132 M38,-72 C42,-118 12,-131 0,-132" stroke="#6f86b8" stroke-width="1.4" fill="none"/>'
         '<path d="M-58,-84 C-60,-120 -30,-136 -10,-136 C-36,-126 -48,-108 -48,-84 Z" fill="#fff" opacity=".28" stroke="none"/>'
         '<path d="M8,-72 L12,-131 L28,-129 L26,-72 Z" fill="#56699a"/>'
         '<rect x="-84" y="-72" width="168" height="8" rx="3" fill="#9fb2d6"/>')
    W = ('<path d="M-16,-10 V-40 Q0,-56 16,-40 V-10 Z" fill="#6e6a86" opacity=".85"/><rect x="-60" y="-54" width="28" height="24" fill="#8a87a2"/><rect x="32" y="-54" width="28" height="24" fill="#8a87a2"/>')
    ab = lambda x: '<rect x="%d" y="-54" width="28" height="24" fill="#fce49a"/><path d="M%d,-54 V-30 M%d,-42 H%d" stroke-width="1.4"/>' % (x, x + 14, x, x + 28)
    A = ('<path d="M-24,0 h48 l-4,-6 h-40 z" fill="#d9d2e6"/><path d="M-16,-10 V-40 Q0,-56 16,-40 V-10 Z" fill="#6a7fae"/><circle cx="9" cy="-26" r="2.4" fill="#f2c14e"/>' + ab(-60) + ab(32))
    K = (csillag4(-40, -108, 1.1) + csillag4(-20, -124, .8) + csillag4(48, -100, .9) + csillag4(-56, -88, .7) +
         '<path d="M-92,-2 V-50 M-92,-46 h-22" fill="none" stroke="#3f5f8f" stroke-width="2.4"/><path d="M-120,-46 h12 l-2,14 h-8 z" fill="#fce49a" stroke="#3f5f8f" stroke-width="1.6"/>'
         '<path d="M-60,-30 h28 v4 h-28 z M32,-30 h28 v4 h-28 z" fill="#9fb2d6"/>')
    KA = ('<g transform="translate(19 -112)"><g><animateTransform attributeName="transform" type="rotate" values="-14;8;-14" dur="9s" repeatCount="indefinite"/>'
          '<g transform="rotate(28)" stroke="#3f5f8f" stroke-width="2.4" stroke-linejoin="round"><rect x="-7" y="-54" width="15" height="56" rx="5" fill="#6a7fae"/>'
          '<rect x="-9" y="-60" width="19" height="9" rx="3" fill="#9fb8e0"/><ellipse cx="0.5" cy="-60" rx="7" ry="2.6" fill="#fff6c2"/></g></g></g>'
          '<circle cx="-114" cy="-38" r="12" fill="#fff3b0" opacity=".5"><animate attributeName="opacity" values=".3;.75;.3" dur="2.4s" repeatCount="indefinite"/></circle>')
    V = ''.join('<circle cx="%d" cy="%d" r="4" fill="%s" stroke-width="1"/>' % (x, y, VSZ[i % 5]) for i, (x, y) in enumerate([(-70, -14), (-56, -12), (56, -12), (70, -14), (-40, -14), (40, -14)]))
    defs = ('<linearGradient id="falJ" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e2ecfa"/><stop offset="1" stop-color="#cbdcf2"/></linearGradient>'
            '<linearGradient id="kupola" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#c4d4f0"/><stop offset="1" stop-color="#8fa8d8"/></linearGradient>')
    return dict(G=arnyek(0, 6, 106, 14, .14), S=S, W=W, A=A, K=K, KA=KA, V=V, sb=(-90, -140, 90, 0), ext=(-138, -190, 96, 20), defs=defs)


# ── a mozgó réteghez a tájról: a madár (helyMadar) jelei ──
_mozgo = open(os.path.join(REPO, "kepek", "vilag", "mozgo.svg"), encoding="utf8").read()
MADAR = re.search(r'<path id="vm-madar".*?</path>', _mozgo, re.S).group(0).replace("vm-", "")
ULO = '<g id="ulo" fill="#6a5f8a" stroke="none"><path d="M-6,0 Q0,-8 6,-2 L11,-4 L7,1 Q0,6 -6,0 Z"/><circle cx="5" cy="-4" r="2.6"/></g>'

def csapat(x, y, k, dx, dur):
    return ('<g transform="translate(%s,%s) scale(%s)" stroke="#6a5f8a" stroke-width="1.8" fill="none" stroke-linecap="round"><g>'
            '<use href="#madar" x="0" y="0"/><use href="#madar" x="22" y="-10"/><use href="#madar" x="40" y="6"/>'
            '<animateTransform attributeName="transform" type="translate" values="0,0;%s,-30" dur="%ss" repeatCount="indefinite"/></g></g>') % (f(x), f(y), k, dx, dur)

def lepke(x, y, c, dur, ut_):
    return ('<g><g transform="translate(%s,%s)"><path d="M0,0 q-7,-8 -9,-2 q2,6 9,2 q7,-8 9,-2 q-2,6 -9,2 Z" fill="%s" stroke="#7a6f93" stroke-width=".8">'
            '<animateTransform attributeName="transform" type="scale" values="1,1;.3,1;1,1" dur=".5s" repeatCount="indefinite"/></path></g>'
            '<animateTransform attributeName="transform" type="translate" values="%s" dur="%ss" repeatCount="indefinite"/></g>') % (f(x), f(y), c, ut_, dur)

def hatso_haz(x, y, w, h, fal, teto, r):
    s = ('<path d="M%s,%s V%s H%s V%s Z" fill="%s"/><path d="M%s,%s L%s,%s L%s,%s Z" fill="%s"/>') % (
        f(x - w / 2), f(y), f(y - h), f(x + w / 2), f(y), fal, f(x - w / 2 - 6), f(y - h + 2), f(x), f(y - h - h * .8), f(x + w / 2 + 6), f(y - h + 2), teto)
    if r() < .7:
        s += '<rect x="%s" y="%s" width="%s" height="%s" fill="#fce49a" opacity=".85"/>' % (f(x - 5), f(y - h * .7), "10", "9")
    if r() < .5:
        s += '<path d="M%s,%s v-%s h8 v%s" fill="%s"/>' % (f(x + w * .2), f(y - h - h * .3), f(h * .4), f(h * .25), teto)
    return s


# ══════════════════ NAGYFA TÉR ══════════════════
def ter():
    M = "ter"
    r = Rnd(311)
    TERKO = (800, 640, 560, 230)
    def terben(x, y, k=1.0):
        return ((x - TERKO[0]) / (TERKO[2] * k)) ** 2 + ((y - TERKO[1]) / (TERKO[3] * k)) ** 2 < 1
    # ég
    eg = ('<rect x="%d" y="%d" width="%d" height="%d" fill="#bcd9f0"/><rect x="%d" y="0" width="%d" height="480" fill="url(#eg)"/><rect x="%d" y="470" width="%d" height="%d" fill="#fdf1e2"/>'
          '<circle cx="220" cy="40" r="240" fill="url(#napfeny)"/><circle cx="220" cy="40" r="34" fill="#fff6cf"/>') % (BX0, BY0, BX1 - BX0, 170, BX0, BX1 - BX0, BX0, BX1 - BX0, BY1 - 470)
    eg += '<g opacity=".55">' + felho(-420, 60, 1.6, .7) + felho(560, -40, 1.2, .6) + felho(1820, 30, 1.5, .7) + '</g>'
    irj(M, "eg", KIFESTVE, '<linearGradient id="eg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bcd9f0"/><stop offset=".75" stop-color="#e6eff3"/><stop offset="1" stop-color="#fdf1e2"/></linearGradient>'
        '<radialGradient id="napfeny"><stop offset="0" stop-color="#fff8d8" stop-opacity=".95"/><stop offset="1" stop-color="#fff8d8" stop-opacity="0"/></radialGradient>', eg)
    # távoli: hegy, a Domboldal a toronnyal és a Jósdával, erdős dombok, hátsó háztetők
    tav = ('<path d="M760,330 L980,170 L1060,220 L1240,60 L1330,130 L1470,20 L1600,110 L1760,40 L1940,140 L2170,90 L2170,380 L760,380 Z" fill="#ddd6ee" stroke="#bdb2d8" stroke-width="2"/>'
           '<path d="M1220,78 L1240,60 L1262,82 L1250,78 L1240,88 L1230,78 Z M1452,36 L1470,20 L1490,40 L1478,36 L1470,46 L1462,36 Z M1744,54 L1760,40 L1778,58 L1766,54 L1760,62 Z" fill="#fff"/>')
    tav += ('<g filter="url(#firka)"><path d="M820,336 Q1000,176 1200,154 Q1380,134 1600,66 Q1800,20 2170,40 V380 H820 Z" fill="url(#dombT)" stroke="#d6bd6a" stroke-width="2"/>'
            '<path d="M1010,334 Q1080,262 1140,242 Q1220,216 1280,164 Q1330,124 1404,106" stroke="#f4e6c4" stroke-width="9" fill="none" stroke-linecap="round"/>'
            '<path d="M1010,334 Q1080,262 1140,242 Q1220,216 1280,164 Q1330,124 1404,106" stroke="#d9c79c" stroke-width="1.4" stroke-dasharray="3 10" fill="none"/>'
            '<g stroke="#8a5a3a" stroke-width="1.6" opacity=".85"><rect x="1128" y="172" width="16" height="30" fill="#ddd0ba"/><rect x="1129" y="152" width="14" height="20" fill="#ecd0a8"/><path d="M1122,153 L1136,130 L1150,153 Z" fill="#c96a4a"/><path d="M1136,130 v-10 l9,3 l-9,3" fill="#fce49a"/></g>'
            '<g stroke="#3f5f8f" stroke-width="1.6" opacity=".85"><rect x="1384" y="90" width="40" height="16" fill="#dce8f8"/><path d="M1386,91 C1386,70 1422,70 1422,91 Z" fill="#a9bde4"/><path d="M1408,80 l10,-10" stroke-width="3"/></g>'
            '<g stroke="#b5804a" stroke-width="1.2" opacity=".8"><path d="M1270,196 L1310,196 L1300,186 L1280,186 Z" fill="#f2b54a"/><path d="M1314,198 L1346,198 L1338,188 L1322,188 Z" fill="#f2b54a"/></g>')
    for x, y in ((880, 318), (930, 300), (1520, 92), (1560, 84), (1700, 64), (1740, 70), (1900, 60), (1960, 66), (2040, 70), (2100, 64)):
        tav += fenyo(x, y, 30, "#8fb89a")
    tav += '</g>'
    # balra erdős dombok
    tav += ('<g filter="url(#firka)"><path d="M%d,330 Q-300,250 -40,290 Q200,240 460,300 Q640,262 840,336 V400 H%d Z" fill="#cfe3c2"/>' % (BX0 - 10, BX0 - 10))
    x = BX0
    while x < 860:
        y = 300 + 30 * ((x - 200) / 700) ** 2 + r() * 14
        tav += lomb(round(x), round(y + 22), 11 + r() * 5, ["#a9cfa0", "#b5d8a8", "#9fc79a"][int(r() * 3)])
        x += 26 + r() * 22
    tav += "</g>"
    # hátsó háztetők (a falu), légperspektívával halványítva
    tav += '<g filter="url(#firka)" stroke="#9a7a6a" stroke-width="1.6" opacity=".82">'
    x = BX0 + 20
    SZINEK = [("#f3dcc0", "#d99a8a"), ("#f6e6c8", "#e3b48c"), ("#efe2f6", "#c9a8e6"), ("#e8f0ff", "#9fb8e0"), ("#f7e1c9", "#d27a5a")]
    while x < BX1:
        if not (940 < x < 1110):
            w_ = 44 + r() * 30; h_ = 30 + r() * 16
            c = SZINEK[int(r() * 5)]
            tav += hatso_haz(x, 372 + r() * 8, w_, h_, c[0], c[1], r)
            x += w_ + 14 + r() * 40
        else:
            x += 30
    tav += "</g>"
    irj(M, "tavoli", KIFESTVE, FIRKA + '<linearGradient id="dombT" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f8ebb6"/><stop offset="1" stop-color="#eedb98"/></linearGradient>', tav)

    # közép: rét, utak, a macskaköves tér, telkek, útjelző, bokrok, fák
    koz = ('<rect x="%d" y="352" width="%d" height="%d" fill="url(#ret)"/>' % (BX0, BX1 - BX0, BY1 - 352) +
           '<path d="M%d,362 Q400,340 800,354 T2170,366 V420 H%d Z" fill="#c6e4b4"/>' % (BX0, BX0))
    koz += '<g filter="url(#firka)">'
    koz += ut([(780, 840), (790, 940), (770, 1070)], 66) + ut([(330, 650), (100, 660), (-200, 700), (BX0 - 10, 740)], 40)
    koz += ut([(1280, 640), (1500, 610), (1800, 560), (BX1 + 10, 520)], 40) + ut([(1010, 450), (1030, 400), (1044, 352)], 26)
    koz += ('<ellipse cx="800" cy="644" rx="566" ry="236" fill="#d9c69e"/>'
            '<ellipse cx="800" cy="640" rx="560" ry="230" fill="url(#terKo)" stroke="#d8bf8e" stroke-width="3"/>'
            '<ellipse cx="760" cy="600" rx="380" ry="130" fill="#fff8e6" opacity=".35"/>')
    # macskakövek (ritkán, hogy könnyű maradjon)
    y = 424
    while y < 866:
        x = 250 + (y % 2) * 13
        sk = .55 + .45 * (y - 410) / 460
        while x < 1350:
            if terben(x, y, .97) and r() < .42:
                koz += '<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="%s" stroke="#d3bc90" stroke-width=".9"/>' % (
                    f(x + r() * 8), f(y + r() * 4), f((8 + r() * 4) * sk), f((3.2 + r() * 1.4) * sk), ["#efdfbe", "#e9d6b0", "#f4e7ca"][int(r() * 3)])
            x += 24 + r() * 8
        y += 15
    # szegélykövek
    import math
    for i in range(72):
        a = i / 72 * 2 * math.pi
        koz += '<ellipse cx="%s" cy="%s" rx="7" ry="3.4" fill="#e5d4b2" stroke="#c9b083" stroke-width="1"/>' % (f(800 + math.cos(a) * 560), f(640 + math.sin(a) * 230))
    # üres telkek (2): cölöpök, kifeszített zsinór, deszkák, köd
    def telek(x, y):
        return ('<g transform="translate(%d %d)"><path d="M-78,0 Q0,10 78,0 L74,-14 Q0,-6 -74,-14 Z" fill="#d6c79a" opacity=".6" stroke="none"/>'
                '<path d="M-70,-2 V-40 M70,-2 V-40 M-40,-12 V-46 M40,-12 V-46" stroke="#a07a5a" stroke-width="4"/>'
                '<path d="M-70,-34 L-40,-40 L40,-40 L70,-34" fill="none" stroke="#e8505b" stroke-width="1.4" stroke-dasharray="5 4"/>'
                '<path d="M-28,-2 l40,0 l0,-5 l-40,0 Z M-24,-7 l32,0 l0,-5 l-32,0 Z" fill="#d8b48a" stroke="%s" stroke-width="1.2"/>'
                '<ellipse cx="0" cy="-30" rx="92" ry="30" fill="#fff" opacity=".42" stroke="none"/><ellipse cx="-20" cy="-48" rx="50" ry="16" fill="#fff" opacity=".3" stroke="none"/></g>') % (x, y, INK)
    koz += telek(130, 650) + telek(1480, 690)
    # útjelző (felirat nélkül: nyilak a két ösvény felé)
    koz += ('<g transform="translate(212 742)" stroke="%s" stroke-width="2" stroke-linejoin="round"><path d="M0,0 V-82" stroke="#8a6a52" stroke-width="6"/>'
            '<path d="M-4,-80 H-74 L-86,-68 L-74,-56 H-4 Z" fill="#fffaf0"/><path d="M4,-52 H70 L82,-40 L70,-28 H4 Z" fill="#fffaf0"/>'
            '<path d="M-60,-68 H-20 M-60,-68 l8,-5 M-60,-68 l8,5" stroke="#b5804a" stroke-width="2.4" fill="none"/>'
            '<path d="M18,-40 H58 M58,-40 l-8,-5 M58,-40 l-8,5" stroke="#b5804a" stroke-width="2.4" fill="none"/></g>') % INK
    # virágládák a tér szélén, lámpaoszlopok
    for x, y in ((560, 830), (1040, 830)):
        koz += ('<g transform="translate(%d %d)" stroke="%s" stroke-width="1.8"><path d="M-22,0 L-18,-20 H18 L22,0 Z" fill="#c98f6e"/>'
                '<ellipse cx="0" cy="-24" rx="22" ry="10" fill="#8cc685"/><circle cx="-10" cy="-28" r="4" fill="#f6a5c0"/><circle cx="2" cy="-31" r="4" fill="#fce49a"/><circle cx="12" cy="-27" r="4" fill="#fff"/></g>') % (x, y, INK)
    for x, y in ((300, 560), (1300, 560)):
        koz += ('<g transform="translate(%d %d)" stroke="%s" stroke-width="2"><ellipse cx="0" cy="2" rx="14" ry="4" fill="#3c2a50" opacity=".14" stroke="none"/><path d="M0,0 V-86" stroke="#6e6a86" stroke-width="4"/>'
                '<path d="M-9,-86 h18 l-3,-18 h-12 z" fill="#fff3b0"/><path d="M-11,-104 h22 l-11,-9 z" fill="#6e6a86"/></g>') % (x, y, INK)
    # bokrok és fák a tér körül és a kifestett részen
    fak = ""
    for x, y, s in ((40, 800, 1.2), (1560, 860, 1.2), (600, 900, .9), (1020, 905, .9), (-80, 600, 1.1), (1690, 640, 1.1), (260, 470, .8), (1350, 470, .8)):
        fak += bokor(x, y, s)
    for x, y, rr in ((-140, 520, 22), (-300, 600, 26), (-460, 700, 28), (-250, 820, 30), (-470, 940, 32), (1760, 520, 22), (1920, 620, 26), (2080, 560, 24),
                     (1840, 800, 30), (2060, 900, 32), (-40, 470, 18), (1640, 470, 18), (-360, 470, 20), (1980, 450, 20)):
        fak += lomb(x, y, rr, ["#8fc98a", "#9fd19a", "#7fbf86", "#a7d99a"][int(r() * 4)])
    koz += fak
    koz += '</g>'
    koz += fucsomok(r, 420, BX0, BX1, 410, BY1, kihagy=lambda x, y: terben(x, y, 1.03) or (740 < x < 840 and y > 840))
    koz += viragok(r, 260, BX0, BX1, 420, BY1, kihagy=lambda x, y: terben(x, y, 1.03) or (720 < x < 860 and y > 840))
    irj(M, "kozep", KIFESTVE, FIRKA + '<linearGradient id="ret" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d4ecc4"/><stop offset="1" stop-color="#b9dc98"/></linearGradient>'
        '<radialGradient id="terKo" cx=".5" cy=".42" r=".62"><stop offset="0" stop-color="#f8ecd2"/><stop offset="1" stop-color="#e6d2ab"/></radialGradient>', koz)

    # előtér: füves szél és két bokor a sarkokban (az ösvényt szabadon hagyja)
    elo = ('<g filter="url(#firka)" stroke="%s" stroke-width="2" fill="#9fcf8f">'
           '<path d="M%d,%d L%d,904 Q-200,884 120,898 Q400,912 704,926 L716,%d Z"/><path d="M866,%d L880,926 Q1200,910 1500,896 Q1800,884 %d,900 L%d,%d Z"/></g>') % (
        INK, BX0 - 10, BY1 + 10, BX0 - 10, BY1 + 10, BY1 + 10, BX1 + 10, BX1 + 10, BY1 + 10)
    elo += '<g filter="url(#firka)" stroke="%s" stroke-width="2">' % INK + bokor(-30, 920, 1.6) + bokor(1640, 920, 1.6, "#7fbf86", "#9fd19a") + '</g>'
    elo += fucsomok(Rnd(77), 140, BX0, BX1, 890, 935, c="#7fae6a", kihagy=lambda x, y: 700 < x < 880)
    irj(M, "eloter", KIFESTVE, FIRKA, elo)

    # mozgó: felhők, lampionfüzér, galambok, lepkék, füst a hátsó kéményekből, madarak
    lamp = ""
    for d, pts in (("M690,420 Q560,446 470,360", [(.2, "#fce49a"), (.4, "#f6a5c0"), (.6, "#9ec9f0"), (.8, "#fce49a")]),
                   ("M910,420 Q1040,446 1130,372", [(.2, "#9ec9f0"), (.4, "#fce49a"), (.6, "#f6a5c0"), (.8, "#c9a8e6")])):
        nums = [float(v) for v in re.findall(r"-?\d+\.?\d*", d)]
        x0_, y0_, cx_, cy_, x1_, y1_ = nums
        lamp += '<path d="%s" fill="none" stroke="#6e4a36" stroke-width="1.6"/>' % d
        for i, (t, c) in enumerate(pts):
            x = (1 - t) ** 2 * x0_ + 2 * (1 - t) * t * cx_ + t * t * x1_; y = (1 - t) ** 2 * y0_ + 2 * (1 - t) * t * cy_ + t * t * y1_
            lamp += ('<g transform="translate(%s,%s)"><path d="M0,0 v4" stroke="#6e4a36" stroke-width="1.2"/><circle cy="13" r="12" fill="#fff3b0" opacity=".3">'
                     '<animate attributeName="opacity" values=".15;.5;.15" dur="%ss" begin="%ss" repeatCount="indefinite"/></circle>'
                     '<ellipse cy="13" rx="8" ry="9" fill="%s" stroke="#8a6a52" stroke-width="1.4"/><path d="M-5,5 h10 M-5,21 h10" stroke="#8a6a52" stroke-width="1.6"/></g>') % (
                f(x), f(y), f(2.6 + i * .4), f(i * .5), c)
    galamb = lambda x, y, tukor, dur, b: ('<g transform="translate(%d %d) scale(%d 1)"><g><ellipse cx="0" cy="-7" rx="10" ry="6" fill="#d4cfe0" stroke="#7d7896" stroke-width="1.5"/>'
                                          '<path d="M-10,-8 l-6,-3 l1,6 z" fill="#b9b3cc" stroke="#7d7896" stroke-width="1.2"/>'
                                          '<g><circle cx="9" cy="-12" r="4.5" fill="#e2deec" stroke="#7d7896" stroke-width="1.5"/><path d="M13,-12 l4,1.5 l-4,1" fill="#e8a05b"/><circle cx="10" cy="-13" r=".9" fill="#3c2f5e"/>'
                                          '<animateTransform attributeName="transform" type="translate" values="0,0;0,0;3,6;0,0;0,0" keyTimes="0;.6;.7;.8;1" dur="%ss" begin="%ss" repeatCount="indefinite"/></g>'
                                          '<path d="M-3,-1 v4 M3,-1 v4" stroke="#e8a05b" stroke-width="1.4"/></g></g>') % (x, y, tukor, dur, b)
    also = ('<g id="also" pointer-events="none">\n<g>' + uszo_felho(-300, 40, 1.3, 90, 140) + uszo_felho(240, 70, 1.0, 70, 120) + uszo_felho(1100, 40, 1.4, -80, 160) + uszo_felho(1900, 80, 1.1, -60, 130) + "</g>\n" +
            '<g opacity=".7">' + fust(420, 300, 3, 5, 40) + fust(1500, 304, 3, 5.5, 40) + fust(-200, 298, 3, 4.8, 40) + "</g>\n" + lamp + "\n" +
            galamb(690, 762, 1, 2.2, 0) + galamb(738, 774, -1, 2.8, .7) + galamb(944, 734, 1, 2.5, 1.2) + "\n" +
            lepke(180, 560, "#f6a5c0", 14, "0,0;60,-30;120,10;40,30;0,0") + lepke(1440, 600, "#fce49a", 16, "0,0;-70,-20;-110,20;-30,30;0,0") + "\n</g>\n")
    felso = ('<g id="felso" pointer-events="none">\n' + csapat(-120, 150, 1, 1900, 46) + "\n" +
             '<g opacity=".9">' + ''.join('<path d="M%s,%s q3,-4 6,0 q-3,4 -6,0 Z" fill="%s"><animateTransform attributeName="transform" type="translate" values="0,0;%s,%s" dur="%ss" begin="%ss" repeatCount="indefinite"/>'
                                           '<animate attributeName="opacity" values="0;1;1;0" dur="%ss" begin="%ss" repeatCount="indefinite"/></path>' % (
                 f(700 + i * 50), f(300 + (i % 3) * 30), "#a7d99a" if i % 2 else "#8cc685", -40 + i * 14, 320 + i * 20, 7 + i, i * 1.7, 7 + i, i * 1.7) for i in range(5)) + "</g>\n</g>")
    irj(M, "mozgo", KIFESTVE, "".join([MADAR, ULO]), also + felso, elotag="vm-")

    # díszlet-fájl: a nagyfa (a lombja lassan leng; koppintásra az egész megbillen — style.css .hely-diszlet.el)
    r2 = Rnd(904)
    fa = (arnyek(800, 630, 186, 36, .12) +
          fok('<path d="M770,622 Q752,630 738,626 M832,622 Q852,630 868,624 M790,624 Q786,634 776,640" fill="none" stroke="#6e4a36" stroke-width="4"/>'
              '<path d="M768,624 Q780,520 788,430 L816,430 Q824,520 834,624 Z" fill="#a8764f"/>'
              '<path d="M790,600 Q794,540 796,470 M812,610 Q814,560 810,500" stroke="#7f5a3e" stroke-width="1.6" fill="none"/>'
              '<path d="M800,480 Q740,430 680,400 M806,460 Q870,420 930,384 M796,450 Q770,380 760,330" stroke="#8a5a3a" stroke-width="13" fill="none"/>'
              '<path d="M820,520 h16 v-14 l-8,-8 l-8,8 z" fill="#f2d5ae" stroke-width="1.6"/><circle cx="828" cy="510" r="3" fill="#6e4a36"/>'))
    korona = ""
    for cx, cy, rx, ry, c in ((690, 350, 130, 96, "#7fb877"), (910, 340, 140, 100, "#7fb877"), (800, 270, 170, 110, "#8cc685"),
                              (700, 300, 110, 80, "#9fd19a"), (900, 290, 120, 84, "#9fd19a"), (800, 230, 120, 76, "#a7d99a")):
        korona += '<path d="%s" fill="%s" stroke="#4f8a52" stroke-width="2.4" stroke-linejoin="round"/>' % (pamacs(cx, cy, rx, ry, 11, r2), c)
    korona += '<g fill="#c4e7a8" opacity=".75">' + ''.join('<path d="%s"/>' % pamacs(x, y, a, b, 7, r2, 1.15) for x, y, a, b in ((740, 208, 34, 16), (870, 250, 30, 14), (640, 300, 24, 12), (950, 300, 22, 11))) + '</g>'
    korona += '<path d="M640,400 Q800,440 960,396 Q900,430 800,436 Q700,432 640,400 Z" fill="#3c2f5e" opacity=".1"/>'
    korona += ''.join('<circle cx="%d" cy="%d" r="4.5" fill="%s" stroke="#b5607e" stroke-width="1"/>' % (x, y, c) for x, y, c in (
        (700, 260, "#f6a5c0"), (760, 320, "#fff"), (860, 220, "#f6a5c0"), (930, 330, "#fff"), (650, 360, "#f6a5c0"), (820, 380, "#fff"), (960, 260, "#f6a5c0"), (740, 190, "#fff")))
    fa += ('<g><animateTransform attributeName="transform" type="rotate" values="-1 800 440;1 800 440;-1 800 440" dur="7s" repeatCount="indefinite"/>' + korona + '</g>')
    fa += fok('<path d="M690,642 h220 v12 h-220 z" fill="#c99a6a"/><path d="M700,654 v16 M900,654 v16 M800,654 v14" stroke="#6e4a36" stroke-width="4"/>'
              '<path d="M690,642 h220" stroke="#e8c49a" stroke-width="2" opacity=".8"/>')
    irj(M, "nagyfa", (520, 140, 560, 540), FIRKA, fa)

    # házak
    dob = {}
    for nev, fn, alap, sd in (("bolt", h_bolt, (420, 520), 11), ("vasar", h_sator, (1180, 520), 12), ("zsib", h_zsib, (400, 800), 13), ("szalag", h_szalag, (1220, 800), 14)):
        dob[nev] = haz_fajlok(M, nev, alap, fn(), sd)
    dob["nagyfa"] = (520, 140, 560, 540)
    return dob


# ══════════════════ DOMBOLDAL ══════════════════
SZERP = [(560, 1070), (574, 930), (700, 834), (930, 762), (906, 690), (800, 622), (600, 566), (540, 520), (600, 470), (760, 410), (960, 380), (1130, 346), (1220, 296), (1262, 262)]

def domboldal():
    M = "domboldal"
    r = Rnd(522)
    eg = ('<rect x="%d" y="%d" width="%d" height="%d" fill="#b6d6ef"/><rect x="%d" y="0" width="%d" height="520" fill="url(#eg)"/><rect x="%d" y="510" width="%d" height="%d" fill="#fdf1e2"/>'
          '<circle cx="300" cy="60" r="260" fill="url(#napfeny)"/>') % (BX0, BY0, BX1 - BX0, 170, BX0, BX1 - BX0, BX0, BX1 - BX0, BY1 - 510)
    eg += '<g opacity=".5">' + felho(-380, 120, 1.4, .7) + felho(760, -60, 1.3, .6) + felho(1900, 10, 1.2, .7) + '</g>'
    irj(M, "eg", KIFESTVE, '<linearGradient id="eg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b6d6ef"/><stop offset=".7" stop-color="#e4eef4"/><stop offset="1" stop-color="#fdf1e2"/></linearGradient>'
        '<radialGradient id="napfeny"><stop offset="0" stop-color="#fff8d8" stop-opacity=".9"/><stop offset="1" stop-color="#fff8d8" stop-opacity="0"/></radialGradient>', eg)
    # távoli: a hegy jobbra hátul (légperspektíva), balra kék dombok
    tav = ('<g filter="url(#firka)"><path d="M940,320 L1180,92 L1260,162 L1380,40 L1470,110 L1560,70 L1700,180 L1860,120 L2000,200 L2170,170 L2170,420 L940,420 Z" fill="#ddd6ee" stroke="#b9b0d4" stroke-width="2"/>'
           '<path d="M1350,72 L1380,40 L1414,76 L1396,70 L1380,84 L1364,70 Z M1160,112 L1180,92 L1200,112 L1190,110 L1180,118 Z M1546,82 L1560,70 L1576,86 L1566,84 Z" fill="#fff"/>'
           '<path d="M1380,40 L1414,76 L1470,110 L1520,180 L1440,240 Z" fill="#3c2f5e" opacity=".06" stroke="none"/>')
    tav += '<path d="M%d,560 Q-300,470 -60,520 Q120,470 320,540 V700 H%d Z" fill="#cfe0d4" stroke="#b9cfc0" stroke-width="2"/>' % (BX0 - 10, BX0 - 10)
    x = BX0
    while x < 300:
        tav += fenyo(round(x), round(530 + r() * 30 + max(0, x - 100) * .1), 24 + r() * 10, "#a9c7b4")
        x += 22 + r() * 16
    tav += "</g>"
    irj(M, "tavoli", KIFESTVE, FIRKA, tav)

    # közép: a domb, lent a falu, a szerpentin, fenyők, kövek, telkek, pad
    koz = '<g filter="url(#firka)">'
    koz += '<path d="M%d,640 Q-300,600 -60,660 Q120,700 260,820 L300,%d L%d,%d Z" fill="url(#ret)" stroke="#a8cf94" stroke-width="2"/>' % (BX0 - 10, BY1 + 10, BX0 - 10, BY1 + 10)
    DOMB = "M-40,%d L-40,900 Q120,520 520,430 Q900,340 1200,200 Q1380,120 1640,120 Q1900,118 %d,150 L%d,%d Z" % (BY1 + 10, BX1 + 10, BX1 + 10, BY1 + 10)
    koz += '<path d="%s" fill="url(#domb)" stroke="#d6bd6a" stroke-width="3"/>' % DOMB
    koz += ('<path d="M140,700 Q300,520 560,470 Q760,430 900,400 Q700,470 520,520 Q320,580 140,700 Z M1000,330 Q1150,270 1260,190 Q1400,140 1620,140 Q1400,170 1280,230 Q1150,310 1000,330 Z" fill="#fff8d6" opacity=".45" stroke="none"/>'
            '<path d="M700,1000 Q1000,880 1500,860 Q1800,856 2160,880 L2160,1070 L700,1070 Z" fill="#e9d48a" opacity=".35" stroke="none"/>')
    # teraszok: halvány szintvonalak
    for k in range(5):
        y0 = 560 + k * 90
        koz += '<path d="M%d,%d Q%d,%d %d,%d" fill="none" stroke="#e5cf86" stroke-width="2" opacity=".7"/>' % (200 + k * 60, y0 + 60, 900, y0 - 120 - k * 6, 1700, y0 - 330 - k * 6)
    # a szerpentin
    d = sima(SZERP)
    koz += ('<path d="%s" stroke="#d9c79c" stroke-width="48" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
            '<path d="%s" stroke="#f4e6c4" stroke-width="40" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
            '<path d="%s" stroke="#e2cfa6" stroke-width="2" stroke-dasharray="4 18" fill="none"/>') % (d, d, d)
    # kőszegély + korlát-cölöpök a kanyarokban
    for x, y in ((960, 700), (950, 740), (560, 500), (552, 540), (1150, 330), (1196, 296)):
        koz += '<path d="M%d,%d v-22 M%d,%d v-22" stroke="#8a6a52" stroke-width="3.6"/><path d="M%d,%d h18" stroke="#a07a5a" stroke-width="2.4"/>' % (x, y, x + 18, y + 4, x, y - 16)
    # fenyők, bokrok a domboldalon és a kifestett platón
    for x, y, h in ((1500, 300, 60), (1540, 330, 64), (1060, 270, 52), (330, 640, 58), (1460, 560, 66), (1520, 600, 70), (1380, 480, 54), (1600, 420, 60),
                    (1700, 200, 56), (1760, 230, 62), (1840, 190, 54), (1920, 250, 64), (2000, 220, 58), (2080, 260, 66), (1680, 520, 70), (1820, 460, 64), (1960, 560, 74), (2100, 480, 70),
                    (1700, 760, 80), (1880, 820, 84), (2060, 740, 80), (680, 300, 48), (220, 900, 70)):
        koz += fenyo(x, y, h, ["#7fb58a", "#8fc09a", "#74a984"][int(r() * 3)])
    for x, y, s in ((380, 520, .8), (700, 700, .9), (1300, 660, 1.0), (1000, 520, .8), (1260, 420, .8), (1580, 760, 1.1), (840, 880, 1.0), (1100, 920, 1.1)):
        koz += bokor(x, y, s, "#a9cf85", "#c4dfa0")
    for x, y in ((640, 640), (1040, 600), (430, 760), (1240, 520), (860, 520), (1420, 720), (720, 520)):
        koz += '<ellipse cx="%d" cy="%d" rx="%s" ry="%s" fill="#e3dccb" stroke="%s" stroke-width="1.4"/>' % (x, y, f(8 + r() * 6), f(5 + r() * 3), INK)
    # üres telkek a kanyarokban
    def telek(x, y):
        return ('<g transform="translate(%d %d)"><path d="M-78,0 Q0,8 78,0 L74,-14 Q0,-6 -74,-14 Z" fill="#d9c27a" opacity=".55" stroke="none"/>'
                '<path d="M-70,-2 V-40 M70,-2 V-40 M-40,-12 V-46 M40,-12 V-46" stroke="#a07a5a" stroke-width="4"/>'
                '<path d="M-70,-34 L-40,-40 L40,-40 L70,-34" fill="none" stroke="#e8505b" stroke-width="1.4" stroke-dasharray="5 4"/>'
                '<path d="M-28,-2 l40,0 l0,-5 l-40,0 Z" fill="#d8b48a" stroke="%s" stroke-width="1.2"/>'
                '<ellipse cx="0" cy="-30" rx="92" ry="28" fill="#fff" opacity=".42" stroke="none"/><ellipse cx="18" cy="-46" rx="46" ry="14" fill="#fff" opacity=".3" stroke="none"/></g>') % (x, y, INK)
    koz += telek(200, 535) + telek(920, 355)
    # pad a kanyarban, kilátással
    koz += '<g transform="translate(770 650)" stroke="%s" stroke-width="2"><path d="M-40,0 h80 v8 h-80 z" fill="#c99a6a"/><path d="M-34,8 v14 M34,8 v14 M-40,-16 h80" stroke="#6e4a36" stroke-width="3"/><path d="M-36,-16 v16 M36,-16 v16" stroke="#6e4a36" stroke-width="2.4"/></g>' % INK
    # lent a falu: a nagyfa koronája és a háztetők (a domb lábánál)
    koz += '<g stroke="#9a7a6a" stroke-width="2">'
    koz += '<path d="%s" fill="#8cc685" stroke="#5f8e6a"/><path d="%s" fill="#a7d99a" stroke="none"/>' % (pamacs(30, 846, 130, 74, 10, r), pamacs(0, 826, 60, 30, 7, r, 1.15))
    for x, y, c, fal in ((-420, 880, "#d99a8a", "#f3dcc0"), (-290, 920, "#e3b48c", "#f6e6c8"), (-150, 890, "#c9a8e6", "#efe2f6"), (-40, 930, "#d27a5a", "#f7e1c9"), (110, 912, "#9fb8e0", "#e8f0ff"), (220, 940, "#e3b48c", "#f6e6c8"), (-520, 960, "#e3b48c", "#f6e6c8")):
        koz += '<path d="M%d,%d V%d H%d V%d Z" fill="%s"/><path d="M%d,%d L%d,%d L%d,%d Z" fill="%s"/><rect x="%d" y="%d" width="12" height="11" fill="#fce49a"/>' % (
            x - 44, y + 60, y - 10, x + 44, y + 60, fal, x - 56, y - 8, x, y - 64, x + 56, y - 8, c, x - 6, y + 6)
    koz += "</g></g>"
    koz += fucsomok(r, 380, BX0, BX1, 300, BY1, c="#b6c97a", kihagy=lambda x, y: y < 160 + max(0, 900 - x) * .5 and x < 1600)
    koz += viragok(r, 240, -40, BX1, 380, BY1, kihagy=lambda x, y: (x < 1400 and y < 1000 - x * .45))
    irj(M, "kozep", KIFESTVE, FIRKA + '<linearGradient id="domb" x1="0" y1="1" x2=".6" y2="0"><stop offset="0" stop-color="#f3df98"/><stop offset="1" stop-color="#fbf0c8"/></linearGradient>'
        '<linearGradient id="ret" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d4ecc4"/><stop offset="1" stop-color="#b9dc98"/></linearGradient>', koz)

    elo = ('<g filter="url(#firka)" stroke="%s" stroke-width="2"><path d="M1040,%d Q1180,960 1310,930 Q1600,894 1900,902 Q2050,906 %d,890 L%d,%d Z" fill="#e8d48c"/>' % (INK, BY1 + 10, BX1 + 10, BX1 + 10, BY1 + 10) +
           bokor(1540, 930, 1.5, "#a9cf85", "#c4dfa0") + bokor(-300, 930, 1.6) + '</g>')
    elo += fucsomok(Rnd(88), 90, 1300, BX1, 896, 940, c="#a8b86a")
    irj(M, "eloter", KIFESTVE, FIRKA, elo)

    also = ('<g id="also" pointer-events="none">\n<g>' + uszo_felho(-260, 110, 1.3, 90, 150) + uszo_felho(300, 60, 1.1, 80, 120) + uszo_felho(1500, 200, 1.0, -70, 140) + uszo_felho(1900, 60, 1.2, -60, 130) + "</g>\n"
            '<ellipse cx="700" cy="560" rx="240" ry="56" fill="#c9b46a" opacity=".13"><animateTransform attributeName="transform" type="translate" values="-500,120;700,-160;-500,120" dur="44s" repeatCount="indefinite"/></ellipse>\n'
            '<g opacity=".7">' + fust(-400, 830, 3, 5, 50) + fust(-130, 842, 3, 5.6, 50) + fust(124, 862, 3, 4.6, 46) + "</g>\n" +
            lepke(980, 600, "#f6a5c0", 15, "0,0;60,-40;110,0;50,30;0,0") + lepke(380, 700, "#c9a8e6", 13, "0,0;-50,-30;-90,10;-30,24;0,0") + lepke(1420, 380, "#fce49a", 17, "0,0;-60,20;-30,-30;0,0") + "\n</g>\n")
    felso = ('<g id="felso" pointer-events="none">\n' + csapat(-100, 120, 1, 1950, 48) + csapat(1900, 330, .8, -2300, 56) + "\n</g>")
    irj(M, "mozgo", KIFESTVE, "".join([MADAR, ULO]), also + felso, elotag="vm-")

    # díszlet-fájl: a kecske (legel; koppintásra megbillen)
    kecske = (arnyek(304, 766, 34, 6, .14) +
              fok('<path d="M288,758 v12 M296,760 v12 M318,760 v12 M326,758 v12" stroke="#8a7a6e" stroke-width="3.4"/>'
                  '<path d="M278,744 Q276,728 296,726 Q320,722 332,736 Q336,754 318,758 Q296,762 282,756 Z" fill="#fffaf0"/>'
                  '<path d="M300,756 Q318,758 330,742" fill="none" stroke="#d9d0c4" stroke-width="3"/>', 2) +
              '<g><animateTransform attributeName="transform" type="rotate" values="-8 280 738;14 280 738;-8 280 738" dur="1.4s" repeatCount="indefinite"/>'
              '<path d="M280,736 q-4,-6 -8,-2" fill="none" stroke="#8a7a6e" stroke-width="2.4" stroke-linecap="round"/></g>'
              '<g><animateTransform attributeName="transform" type="rotate" values="0 330 734;0 330 734;34 330 734;34 330 734;0 330 734" keyTimes="0;.35;.45;.8;1" dur="6s" repeatCount="indefinite"/>'
              '<g stroke="#8a7a6e" stroke-width="2" stroke-linejoin="round"><path d="M328,734 Q338,716 350,722 Q356,734 346,742 Q336,744 330,740 Z" fill="#fffaf0"/>'
              '<path d="M338,720 q-2,-12 -10,-14 M344,720 q2,-12 -4,-16" fill="none" stroke="#a8977e" stroke-width="2.4" stroke-linecap="round"/>'
              '<path d="M336,726 l-8,2 l6,4 z" fill="#e6ddd0"/><circle cx="344" cy="728" r="1.6" fill="#3c2f5e" stroke="none"/><path d="M346,742 q2,6 -2,9" fill="none" stroke-width="1.6"/></g></g>')
    irj(M, "kecske", (262, 696, 100, 82), FIRKA, kecske)

    dob = {}
    for nev, fn, alap, sd in (("deli", h_deli, (1110, 780), 21), ("irasbeli", h_irasbeli, (470, 560), 22), ("josda", h_josda, (1320, 250), 23)):
        dob[nev] = haz_fajlok(M, nev, alap, fn(), sd)
    dob["kecske"] = (262, 696, 100, 82)
    return dob


# ══════════════════ KÉZMŰVESEK (4. kör, 2. kódkör, 2026-11-24) ══════════════════
# Terv: Matekos/vilagkep-4-kor-kezmuvesek.html 1. pont (✅). Délelőtti fény bal felülről; balra a patak a malommal, mellette a
# Mézes pékség, középen hátul (a legmagasabb) a Bájitalkonyha, jobbra a Szabóműhely, a szélén üres telek; a macskaköves utca
# jobbról (az Utca felől) kanyarog a malomig. A 12 tárgy kívülről is látszik (kirakat, párkány, a ház előtt).
def meh(x, y, ut_, dur, b=0):
    return ('<g transform="translate(%s,%s)"><g><ellipse rx="4.6" ry="3.4" fill="#f2c14e" stroke="%s" stroke-width="1.1"/><path d="M-1,-3 v6 M1.8,-3 v6" stroke="%s" stroke-width="1.1"/>'
            '<ellipse cx="-.5" cy="-4.4" rx="3.4" ry="2.2" fill="#fff" opacity=".85" stroke="#9a92b8" stroke-width=".6"><animate attributeName="ry" values="2.2;.6;2.2" dur=".16s" repeatCount="indefinite"/></ellipse>'
            '<animateTransform attributeName="transform" type="translate" values="%s" dur="%ss" begin="%ss" repeatCount="indefinite"/></g></g>') % (f(x), f(y), INK, INK, ut_, dur, b)

def buborek(x, y, c, dur, b, dx, h=80, r1=8):
    return ('<circle cx="%s" cy="%s" r="4" fill="%s" stroke="#fff" stroke-width="1.2" opacity="0">'
            '<animate attributeName="cy" values="%s;%s" dur="%ss" begin="%ss" repeatCount="indefinite"/>'
            '<animate attributeName="cx" values="%s;%s;%s;%s" dur="%ss" begin="%ss" repeatCount="indefinite"/>'
            '<animate attributeName="r" values="3;%s" dur="%ss" begin="%ss" repeatCount="indefinite"/>'
            '<animate attributeName="opacity" values="0;.95;.9;0" dur="%ss" begin="%ss" repeatCount="indefinite"/></circle>') % (
        f(x), f(y), c, f(y), f(y - h), dur, b, f(x), f(x + dx), f(x - dx * .5), f(x + dx * .6), dur, b, r1, dur, b, dur, b)

def csipke(x0, x1, y, n, mely, fill, stroke):
    """előtető alsó csipkés széle: n domború ív x0..x1 között"""
    lep = (x1 - x0) / n
    d = "M%s,%s" % (f(x0), f(y))
    for i in range(n):
        d += " q%s,%s %s,0" % (f(lep / 2), f(mely), f(lep))
    return '<path d="%s Z" fill="%s" stroke="%s" stroke-width="1.4"/>' % (d, fill, stroke)

def kozeli_telek(x, y):
    return ('<g transform="translate(%d %d)"><path d="M-82,0 Q0,10 82,0 L78,-14 Q0,-6 -78,-14 Z" fill="#d6c79a" opacity=".6" stroke="none"/>'
            '<path d="M-72,-2 V-44 M72,-2 V-44 M-42,-12 V-50 M42,-12 V-50" stroke="#a07a5a" stroke-width="4"/>'
            '<path d="M-72,-38 L-42,-44 L42,-44 L72,-38" fill="none" stroke="#e8505b" stroke-width="1.4" stroke-dasharray="5 4"/>'
            '<path d="M-30,-2 l42,0 l0,-5 l-42,0 Z M-26,-7 l34,0 l0,-5 l-34,0 Z" fill="#d8b48a" stroke="%s" stroke-width="1.2"/>'
            '<path d="M30,-2 l14,-10 l8,0 l-6,10 Z" fill="#c9a27a" stroke="%s" stroke-width="1.2"/>'
            '<ellipse cx="0" cy="-34" rx="96" ry="32" fill="#fff" opacity=".42" stroke="none"/><ellipse cx="-20" cy="-52" rx="52" ry="16" fill="#fff" opacity=".3" stroke="none"/></g>') % (x, y, INK, INK)


def h_pekseg():
    """🍯 Mézes pékség: mézsárga fal, terrakotta tető, kemence-kémény (füst), az oromzaton a KALÁCS-cégér.
       Kívülről: a kirakat előtti pulton a mérleg a cipóval és a sótartó a tészta mellett, a jobb ablak párkányán a mézesbödön
       (méhek), a bal sarokban, a malom felől a liszteszsákok. A jobb párkányon ül a macska (külön díszlet-fájl)."""
    S = ('<path d="M-116,0 L116,0 L114,-12 L-114,-12 Z" fill="#d9cbb4"/><path d="M-80,-12 V0 M-40,-12 V0 M0,-12 V0 M40,-12 V0 M80,-12 V0" stroke-width="1.1" opacity=".55"/>'
         '<path d="M58,-150 L58,-228 L86,-228 L86,-160 Z" fill="#c98f6e"/><path d="M54,-236 h36 v9 h-36 z" fill="#a8705a"/>'
         '<path d="M58,-214 H86 M58,-198 H86 M58,-182 H86 M72,-228 V-214 M66,-214 V-198 M78,-198 V-182" stroke-width="1" opacity=".5"/>'
         '<path d="M-110,-12 L-110,-134 L110,-134 L110,-12 Z" fill="url(#falP)"/>'
         '<path d="M52,-133 L109,-133 L109,-13 L52,-13 Z" fill="#3c2f5e" opacity=".07" stroke="none"/>'
         '<path d="M-110,-134 V-12 M110,-134 V-12" stroke="#a8764f" stroke-width="4"/><path d="M-110,-134 H110" stroke="#a8764f" stroke-width="5"/>'
         '<path d="M-132,-130 L0,-218 L132,-130 Q0,-122 -132,-130 Z" fill="#cf8a5c"/>' + teto_cserep(-132, 132, -218, -130, 3, "#a8603a") +
         '<path d="M-116,-134 L0,-212 L-14,-186 L-100,-132 Z" fill="#fff" opacity=".18" stroke="none"/>')
    W = ('<path d="M-26,-12 V-70 Q0,-90 26,-70 V-12 Z" fill="#7d6a80" opacity=".85"/><rect x="-98" y="-104" width="62" height="50" fill="#8a7b92"/>'
         '<rect x="34" y="-108" width="56" height="38" fill="#8a7b92"/>')
    cipo = lambda x, y, k: ('<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="#e0a85e" stroke="#9a6a3a" stroke-width="1.3"/><path d="M%s,%s l3,-3 M%s,%s l3,-3" stroke="#9a6a3a" stroke-width="1.1"/>') % (
        f(x), f(y), f(9 * k), f(5.5 * k), f(x - 4 * k), f(y), f(x + 1 * k), f(y))
    A = ('<path d="M-34,0 h68 l-4,-7 h-60 z" fill="#cfc6dc"/><path d="M-26,-12 V-70 Q0,-90 26,-70 V-12 Z" fill="#b07a52"/>'
         '<path d="M-9,-14 V-80 M9,-14 V-80" stroke-width="1.2" opacity=".55"/><circle cx="0" cy="-64" r="7" fill="#fff4dc"/><circle cx="17" cy="-40" r="3" fill="#f2c14e"/>'
         # a kirakat: kenyerek a polcokon, meleg fény
         '<rect x="-98" y="-104" width="62" height="50" fill="#fff1d2"/><path d="M-98,-80 H-36" stroke="#b5804a" stroke-width="2.4"/>' +
         cipo(-86, -86, 1) + cipo(-66, -87, 1.1) + cipo(-48, -86, .9) +
         '<path d="M-92,-62 q6,-12 12,0 q-6,6 -12,0 Z M-74,-62 q6,-12 12,0 q-6,6 -12,0 Z" fill="#e8b878" stroke="#9a6a3a" stroke-width="1.1"/>'
         '<circle cx="-50" cy="-64" r="6" fill="none" stroke="#c9862a" stroke-width="3"/>'
         '<path d="M-98,-104 h62 v50 h-62 z M-67,-104 V-54" fill="none" stroke-width="2"/><path d="M-94,-58 L-82,-100" stroke="#fff" stroke-width="3" opacity=".6"/>'
         # a pult a kirakat előtt: mérleg a cipóval, tészta, sótartó
         '<path d="M-108,-54 h80 v7 h-80 z" fill="#c99a6a"/><path d="M-102,-47 v35 M-34,-47 v35" stroke="#8a5a3a" stroke-width="3"/>'
         '<path d="M-96,-54 h22 l-3,-5 h-16 z" fill="#d8b48a"/><path d="M-85,-59 V-76 M-99,-76 H-71" stroke-width="1.8"/><circle cx="-85" cy="-77" r="2" fill="#f2c14e"/>'
         '<path d="M-99,-76 l-5,10 M-99,-76 l5,10 M-71,-76 l-5,10 M-71,-76 l5,10" stroke-width=".9"/>'
         '<path d="M-106,-66 q7,5 14,0 z M-78,-66 q7,5 14,0 z" fill="#e8d28a"/>' + cipo(-99, -70, .75) +
         '<path d="M-74,-69 h6 v-3 h-6 z" fill="#c9862a" stroke-width="1"/>'
         '<ellipse cx="-58" cy="-57" rx="8" ry="3.4" fill="#f6ead2" stroke-width="1.2"/>'
         '<rect x="-47" y="-70" width="11" height="16" rx="3" fill="#fffaf0"/><path d="M-47,-70 q5.5,-7 11,0 z" fill="#d9d2e6"/>'
         '<circle cx="-43.5" cy="-72" r=".9" fill="' + INK + '" stroke="none"/><circle cx="-40" cy="-72" r=".9" fill="' + INK + '" stroke="none"/>'
         # a jobb ablak: függöny, párkány (rajta ül a macska), a párkány jobb végén a mézesbödön
         '<rect x="34" y="-108" width="56" height="38" fill="#dceefa"/><path d="M62,-108 V-70 M34,-89 H90" stroke-width="1.5"/>'
         '<path d="M34,-108 q12,12 5,38 h-5 z M90,-108 q-12,12 -5,38 h5 z" fill="#f6a5c0" stroke-width="1.2"/>'
         '<path d="M26,-62 h72 v-6 h-72 z" fill="#c99a6a"/>'
         '<path d="M72,-68 Q68,-86 82,-88 Q96,-86 92,-68 Z" fill="#f2c14e"/><path d="M70,-90 q12,-8 24,0 l-2,4 h-20 z" fill="#fff6ee"/>'
         '<path d="M72,-86 h20" stroke="#c9862a" stroke-width="2"/><path d="M76,-84 q-2,6 1,9" fill="none" stroke="#e0a43a" stroke-width="2.4"/>'
         # liszteszsákok a malom felőli sarokban
         '<path d="M-154,2 Q-158,-30 -142,-36 Q-132,-42 -126,-34 Q-116,-26 -120,2 Z" fill="#f4ecdc"/>'
         '<path d="M-130,2 Q-132,-24 -120,-30 Q-108,-34 -104,-24 Q-100,-12 -104,2 Z" fill="#efe3cc"/>'
         '<path d="M-148,-34 q8,4 16,-2 M-124,-28 q8,4 14,-2" fill="none" stroke-width="1.6"/>'
         '<path d="M-143,-16 l3,-8 l3,8 M-140,-24 v12" fill="none" stroke="#c9a27a" stroke-width="1.4"/>'
         '<ellipse cx="-118" cy="3" rx="20" ry="3" fill="#fff" opacity=".85" stroke="none"/>')
    K = (csipke(-106, -30, -106, 8, 7, "#fff6ee", "#c9862a") +
         '<path d="M-110,-120 H-26 L-30,-106 H-106 Z" fill="url(#csikM)"/>'
         # a kalács-cégér az oromzaton
         '<path d="M-38,-146 h76" stroke-width="2"/><path d="M-30,-146 v6 M30,-146 v6" stroke-width="1.6"/>'
         '<ellipse cx="0" cy="-164" rx="36" ry="21" fill="#fffaf0"/>'
         '<path d="M-26,-157 Q-30,-172 -16,-173 Q-9,-182 0,-175 Q9,-182 16,-173 Q30,-172 26,-157 Q0,-149 -26,-157 Z" fill="#e0a85e"/>'
         '<path d="M-16,-173 q5,8 0,15 M0,-175 q5,9 0,17 M16,-173 q5,8 0,15" fill="none" stroke="#9a6a3a" stroke-width="1.4"/>'
         '<g fill="#fff6ee" stroke="none"><circle cx="-8" cy="-168" r="1.2"/><circle cx="7" cy="-170" r="1.2"/><circle cx="-20" cy="-163" r="1.2"/><circle cx="20" cy="-163" r="1.2"/></g>'
         # búzakoszorú az ajtó fölött
         '<circle cx="0" cy="-100" r="9" fill="none" stroke="#e0b25a" stroke-width="4"/><path d="M-4,-91 l-4,8 M4,-91 l4,8" stroke="#e8505b" stroke-width="2.4"/>')
    KA = (fust(72, -240, 3, 4.6, 56) +
          '<rect x="-98" y="-104" width="62" height="50" fill="#fff3b0" opacity=".18" stroke="none"><animate attributeName="opacity" values=".1;.35;.1" dur="3.4s" repeatCount="indefinite"/></rect>' +
          meh(82, -98, "0,0;-12,-8;-20,2;-8,10;0,0", 3.2) + meh(96, -86, "0,0;10,-10;16,0;6,8;0,0", 2.6, .6) + meh(70, -104, "0,0;8,-6;-4,-12;-10,-2;0,0", 3.8, 1.2) +
          '<circle cx="77" cy="-76" r="2" fill="#e0a43a" stroke="none"><animate attributeName="cy" values="-76;-76;-68" keyTimes="0;.7;1" dur="2.8s" repeatCount="indefinite"/>'
          '<animate attributeName="opacity" values="1;1;0" keyTimes="0;.7;1" dur="2.8s" repeatCount="indefinite"/></circle>')
    V = ('<path d="M-108,-14 Q-118,-50 -106,-80 Q-100,-100 -110,-126 M108,-14 Q118,-50 106,-84 Q100,-104 110,-126" stroke="#6ea96a" stroke-width="2" fill="none"/>'
         '<g stroke-width="1"><circle cx="-112" cy="-40" r="4.5" fill="#f6a5c0"/><circle cx="-106" cy="-74" r="4.5" fill="#fff"/><circle cx="-110" cy="-106" r="4" fill="#f6a5c0"/>'
         '<circle cx="112" cy="-36" r="4.5" fill="#fce49a"/><circle cx="106" cy="-62" r="4.5" fill="#f6a5c0"/><circle cx="110" cy="-110" r="4" fill="#fff"/>'
         '<path d="M30,-2 l-3,-14 h16 l-3,14 z" fill="#c98f6e"/><circle cx="31" cy="-20" r="4" fill="#f6a5c0"/><circle cx="39" cy="-22" r="4" fill="#fce49a"/></g>')
    defs = ('<linearGradient id="falP" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fcebc0"/><stop offset="1" stop-color="#f4d394"/></linearGradient>'
            '<pattern id="csikM" width="24" height="24" patternUnits="userSpaceOnUse"><rect width="12" height="24" fill="#f2b54a"/><rect x="12" width="12" height="24" fill="#fff6ee"/></pattern>')
    return dict(G=arnyek(0, 4, 140, 16), S=S, W=W, A=A, K=K, KA=KA, V=V, sb=(-120, -222, 120, 0), ext=(-164, -252, 128, 18), defs=defs)


def h_bajital():
    """🧪 Bájitalkonyha: a legmagasabb ház — lila fal, ferde, csúcsos türkiz tető, KEREK ABLAK; a kéményből színes buborékok.
       Kívülről: a bal párkányon a mérőpohár, a jobbon a cseppentős üvegcse, a ház előtt az üst a tűz fölött, a sarokban a hordó."""
    S = ('<path d="M-98,0 L98,0 L96,-12 L-96,-12 Z" fill="#cfc6dc"/>'
         '<path d="M-60,-246 V-298 H-34 V-256 Z" fill="#b9a8d8"/><path d="M-64,-306 h34 v9 h-34 z" fill="#9a86c4"/><path d="M-60,-282 H-34 M-60,-266 H-34 M-47,-298 V-282" stroke-width="1" opacity=".5"/>'
         '<path d="M-90,-12 L-90,-40 L90,-40 L90,-12 Z" fill="#cfd5e8"/><path d="M-60,-12 V-40 M-24,-12 V-40 M14,-12 V-40 M52,-12 V-40 M-90,-26 H90" stroke="#a9b0cc" stroke-width="1.4"/>'
         '<path d="M-90,-40 L-92,-206 Q-90,-226 -78,-232 L80,-232 Q92,-224 92,-204 L90,-40 Z" fill="url(#falK)"/>'
         '<path d="M42,-231 L90,-231 L90,-41 L42,-41 Z" fill="#3c2f5e" opacity=".07" stroke="none"/>'
         '<path d="M-92,-150 H92" stroke="#c7b6e2" stroke-width="2.4"/>'
         '<path d="M-112,-226 Q-40,-250 4,-326 Q20,-354 34,-362 Q46,-350 40,-330 Q48,-284 112,-226 Q0,-216 -112,-226 Z" fill="url(#tetoK)"/>'
         '<path d="M-84,-238 Q0,-230 86,-238 M-54,-262 Q6,-256 66,-262 M-26,-288 Q12,-284 48,-290 M2,-314 Q18,-312 40,-316" fill="none" stroke="#4a8a9a" stroke-width="1.3"/>'
         '<path d="M-96,-228 Q-34,-246 6,-318 Q-6,-280 -30,-252 Q-62,-236 -96,-228 Z" fill="#fff" opacity=".22" stroke="none"/>'
         '<circle cx="0" cy="-180" r="31" fill="#c7b6e2"/>')
    W = ('<path d="M-24,-12 V-84 Q0,-108 24,-84 V-12 Z" fill="#6e6a86" opacity=".85"/><rect x="-80" y="-126" width="36" height="34" fill="#8a87a2"/>'
         '<rect x="44" y="-126" width="36" height="34" fill="#8a87a2"/><circle cx="0" cy="-180" r="23" fill="#8a87a2"/>')
    A = ('<path d="M-32,0 h64 l-4,-7 h-56 z" fill="#d9d2e6"/><path d="M-24,-12 V-84 Q0,-108 24,-84 V-12 Z" fill="#7a5cd6"/>'
         '<path d="M-8,-14 V-96 M8,-14 V-96" stroke-width="1.2" opacity=".5"/>'
         '<path transform="translate(14,-48)" d="M0,-4 L1,-1 L4,0 L1,1 L0,4 L-1,1 L-4,0 L-1,-1Z" fill="#fce49a" stroke-width=".8"/>'
         '<rect x="-80" y="-126" width="36" height="34" fill="#fce49a"/><rect x="44" y="-126" width="36" height="34" fill="#fce49a"/>'
         '<path d="M-62,-126 V-92 M-80,-109 H-44 M62,-126 V-92 M44,-109 H80" stroke-width="1.5"/>'
         '<path d="M-86,-92 h48 v6 h-48 z M38,-92 h48 v6 h-48 z" fill="#8a6a4a"/>'
         '<circle cx="0" cy="-180" r="23" fill="#bfeaf0"/><path d="M0,-203 V-157 M-23,-180 H23" stroke-width="1.6"/><circle cx="0" cy="-180" r="9" fill="none" stroke-width="1.2"/>'
         '<path d="M-14,-170 L-6,-194" stroke="#fff" stroke-width="3" opacity=".7"/>'
         # mérőpohár (bal párkány) és cseppentős üvegcse (jobb párkány)
         '<path d="M-72,-92 h16 l3,-24 h-22 z" fill="#eef9fb"/><path d="M-71.4,-92 h14.8 l1.6,-13 h-18 z" fill="#8fd3e0" stroke="none"/>'
         '<path d="M-72,-92 h16 l3,-24 h-22 z M-53,-116 l4,-3" fill="none" stroke-width="1.5"/><path d="M-58,-99 h-4 M-57,-105 h-4 M-56,-111 h-4" stroke-width="1"/>'
         '<path d="M56,-92 q-7,-14 4,-19 v-6 h6 v6 q11,5 4,19 z" fill="#c9a8e6"/><path d="M59,-117 h8 v-5 q-4,-7 -8,0 z" fill="#e8505b"/>'
         '<path d="M58,-104 h10" stroke="#fff" stroke-width="2" opacity=".6"/>'
         # az üst a tűz fölött (a ház előtt, balra)
         '<path d="M-130,44 l8,-16 M-94,44 l-8,-16 M-112,46 v-16" stroke-width="3"/>'
         '<path d="M-124,44 l10,-6 l10,6 l-6,3 h-8 z" fill="#a8764f" stroke-width="1.4"/>'
         '<path d="M-122,38 q4,-12 10,-16 q6,4 10,16 z" fill="#f2a24e" stroke="#d1702a" stroke-width="1.2"/><path d="M-116,38 q2,-6 4,-9 q3,3 4,9 z" fill="#fce49a" stroke="none"/>'
         '<path d="M-138,26 Q-142,-2 -112,-4 Q-82,-2 -86,26 Q-112,34 -138,26 Z" fill="#5a5a6e"/>'
         '<ellipse cx="-112" cy="-3" rx="27" ry="6" fill="#9fe0c0"/><path d="M-140,-3 a28,7 0 0 0 56,0" fill="none" stroke-width="2.4"/>'
         '<path d="M-130,8 q4,10 -2,16" fill="none" stroke="#fff" stroke-width="2" opacity=".35"/>'
         # a hordó a sarokban (jobbra)
         '<path d="M100,40 Q94,8 100,-24 H144 Q150,8 144,40 Z" fill="#c99a6a"/><path d="M97,-12 H147 M97,28 H147" stroke="#6e4a36" stroke-width="3.4"/>'
         '<path d="M112,-24 V40 M132,-24 V40" stroke="#a8764f" stroke-width="1.2"/><ellipse cx="122" cy="-24" rx="22" ry="5" fill="#d8b48a"/>'
         '<rect x="146" y="10" width="8" height="6" fill="#8a6a4a" stroke-width="1"/>')
    K = (# gyógyfű-csokrok az eresz alatt, holdsarló a tető csúcsán, lámpás az ajtó mellett
         '<path d="M-74,-232 v8 M-50,-232 v10 M50,-232 v8" stroke-width="1.2"/>'
         '<path d="M-80,-224 l6,14 l6,-14 z M-56,-222 l6,16 l6,-16 z M44,-224 l6,14 l6,-14 z" fill="#8cc685"/>'
         '<path d="M36,-362 v-10" stroke-width="2"/><path d="M44,-388 a11,11 0 1 0 0,16 a8,8 0 1 1 0,-16 z" fill="#fce49a" stroke="#d1a23a" stroke-width="1.6"/>'
         '<path d="M28,-74 h12 v6" fill="none" stroke-width="2"/><path d="M34,-68 h12 l-2,14 h-8 z" fill="#e6d6ff"/>'
         + csillag4(-60, -160, 1.1) + csillag4(-34, -198, .8) + csillag4(56, -170, .9) + csillag4(50, -206, .7))
    KA = (buborek(-47, -310, "#f6a5c0", 4.2, 0, 10, 90) + buborek(-44, -310, "#8fd3e0", 4.2, 1.4, -9, 96) + buborek(-49, -310, "#c9a8e6", 4.2, 2.8, 12, 84) + buborek(-46, -310, "#fce49a", 5.6, 2.1, -6, 110, 6) +
          buborek(-118, -8, "#cff3df", 1.8, 0, 3, 24, 5) + buborek(-104, -8, "#cff3df", 2.2, .9, -3, 28, 4) +
          '<path d="M-124,-10 q6,-14 0,-26 q-6,-12 2,-22" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".0"><animate attributeName="opacity" values="0;.6;0" dur="3s" repeatCount="indefinite"/>'
          '<animateTransform attributeName="transform" type="translate" values="0,0;4,-10" dur="3s" repeatCount="indefinite"/></path>'
          '<path d="M-122,38 q4,-12 10,-16 q6,4 10,16 z" fill="#fce49a" opacity=".6"><animate attributeName="opacity" values=".2;.8;.3;.7;.2" dur="1.1s" repeatCount="indefinite"/></path>'
          '<circle cx="0" cy="-180" r="20" fill="#fff" opacity="0"><animate attributeName="opacity" values="0;.35;0" dur="4s" repeatCount="indefinite"/></circle>'
          '<circle cx="40" cy="-60" r="13" fill="#e6d6ff" opacity=".4"><animate attributeName="opacity" values=".25;.7;.25" dur="2.6s" repeatCount="indefinite"/></circle>'
          '<circle cx="63" cy="-123" r="2.2" fill="#8fd3e0" stroke="none"><animate attributeName="cy" values="-123;-123;-96" keyTimes="0;.75;1" dur="2.4s" repeatCount="indefinite"/>'
          '<animate attributeName="opacity" values="1;1;0" keyTimes="0;.75;1" dur="2.4s" repeatCount="indefinite"/></circle>')
    V = ('<path d="M-88,-42 Q-100,-90 -88,-130 Q-80,-160 -92,-196 M88,-42 Q98,-80 88,-110" stroke="#6ea96a" stroke-width="2" fill="none"/>'
         '<g stroke-width="1"><circle cx="-94" cy="-70" r="4.5" fill="#c9a8e6"/><circle cx="-88" cy="-112" r="4.5" fill="#fff"/><circle cx="-90" cy="-170" r="4" fill="#c9a8e6"/>'
         '<circle cx="92" cy="-66" r="4.5" fill="#f6a5c0"/><circle cx="90" cy="-100" r="4" fill="#c9a8e6"/>'
         '<circle cx="-78" cy="-96" r="3.5" fill="#f6a5c0"/><circle cx="-48" cy="-96" r="3.5" fill="#fce49a"/><circle cx="78" cy="-96" r="3.5" fill="#c9a8e6"/>'
         '<path d="M-150,40 q2,-10 8,-10 q6,0 8,10 z M80,42 q2,-8 6,-8 q4,0 6,8 z" fill="#f4a38c"/></g>')
    defs = ('<linearGradient id="falK" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#efe8fa"/><stop offset="1" stop-color="#ddd2f1"/></linearGradient>'
            '<linearGradient id="tetoK" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#86c3cf"/><stop offset="1" stop-color="#5a98a8"/></linearGradient>')
    return dict(G=arnyek(10, 6, 150, 18, .13), S=S, W=W, A=A, K=K, KA=KA, V=V, sb=(-104, -352, 106, 0), ext=(-160, -400, 166, 56), defs=defs)


def h_szabo():
    """🧵 Szabóműhely: rózsaszín fal, manzárdtető tetőablakkal, csíkos előtető, a sarkon az OLLÓ-cégér; a kirakatban próbababa.
       Kívülről: a kirakat párkányán a mérőszalag és a tűpárna, az ajtó melletti polcon a szövetvégek, a sarokban a nagy szalagorsó."""
    S = ('<path d="M-116,0 L116,0 L114,-12 L-114,-12 Z" fill="#d9cbb4"/><path d="M-80,-12 V0 M-40,-12 V0 M0,-12 V0 M40,-12 V0 M80,-12 V0" stroke-width="1.1" opacity=".55"/>'
         '<path d="M-110,-12 V-130 H110 V-12 Z" fill="url(#falS)"/>'
         '<path d="M54,-129 H109 V-13 H54 Z" fill="#3c2f5e" opacity=".07" stroke="none"/>'
         '<path d="M-110,-130 V-12 M110,-130 V-12" stroke-width="3"/>'
         '<path d="M-128,-130 L-46,-206 H46 L128,-130 Q0,-124 -128,-130 Z" fill="#b97fa0"/>'
         '<path d="M-104,-150 H104 M-82,-170 H82 M-60,-190 H60" stroke="#9a5f80" stroke-width="1.2" opacity=".7"/>'
         '<path d="M-114,-132 L-44,-200 L-30,-200 L-100,-132 Z" fill="#fff" opacity=".18" stroke="none"/>'
         '<rect x="-118" y="-138" width="236" height="9" rx="2" fill="#ecc8da"/>'
         '<path d="M-22,-148 V-176 Q0,-196 22,-176 V-148 Z" fill="#fbe3ee"/><path d="M-26,-176 Q0,-202 26,-176" fill="none" stroke-width="2.4"/>')
    W = ('<rect x="-100" y="-106" width="104" height="62" fill="#8a7b92"/><rect x="22" y="-92" width="50" height="80" rx="6" fill="#7d6a80"/>'
         '<path d="M-13,-150 V-172 Q0,-186 13,-172 V-150 Z" fill="#8a87a2"/>')
    A = ('<path d="M16,0 h62 l-4,-7 h-54 z" fill="#d9d2e6"/><rect x="22" y="-92" width="50" height="80" rx="6" fill="#a8764f"/>'
         '<rect x="30" y="-84" width="34" height="26" rx="3" fill="#e9f4fb"/><path d="M47,-84 V-58" stroke-width="1.2"/><circle cx="62" cy="-40" r="3" fill="#f2c14e"/>'
         '<path d="M-13,-150 V-172 Q0,-186 13,-172 V-150 Z" fill="#dceefa"/><path d="M0,-150 V-182" stroke-width="1.2"/>'
         # a kirakat: próbababa rózsaszín ruhában, kék anyag-drapéria
         '<rect x="-100" y="-106" width="104" height="62" fill="#eef6fc"/>'
         '<path d="M-14,-106 q-12,24 -4,62 h18 v-62 z" fill="#9ec9f0" stroke-width="1.4"/><path d="M-10,-100 q-6,20 0,50" fill="none" stroke="#fff" stroke-width="1.4" opacity=".7"/>'
         '<path d="M-64,-44 v-8 M-72,-46 h16" stroke="#8a6a4a" stroke-width="2.2"/>'
         '<path d="M-78,-52 Q-82,-74 -74,-84 Q-64,-90 -54,-84 Q-46,-74 -50,-52 Z" fill="#f4a6c8"/><path d="M-74,-80 q10,6 20,0" fill="none" stroke="#e0417a" stroke-width="1.6"/>'
         '<circle cx="-64" cy="-90" r="5" fill="#d8b48a"/>'
         '<path d="M-100,-106 h104 v62 h-104 z M-48,-106 V-44" fill="none" stroke-width="2"/><path d="M-96,-50 L-84,-100" stroke="#fff" stroke-width="3" opacity=".55"/>'
         # a kirakat párkánya: mérőszalag és tűpárna
         '<path d="M-108,-44 h120 v7 h-120 z" fill="#c99a6a"/><path d="M-100,-37 l6,8 M2,-37 l-6,8" stroke="#8a5a3a" stroke-width="2.4"/>'
         '<circle cx="-84" cy="-52" r="8" fill="#fce49a"/><circle cx="-84" cy="-52" r="3" fill="#d1a23a"/>'
         '<path d="M-48,-44 q0,-16 12,-16 q12,0 12,16 z" fill="#e8505b"/><path d="M-42,-56 l-4,-10 M-36,-58 v-12 M-30,-56 l4,-10" stroke="#8a8aa6" stroke-width="1.3"/>'
         '<g stroke="none"><circle cx="-46" cy="-66" r="2.2" fill="#fce49a"/><circle cx="-36" cy="-70" r="2.2" fill="#9ec9f0"/><circle cx="-26" cy="-66" r="2.2" fill="#a7d99a"/></g>'
         # polc az ajtó mellett a szövetvégekkel
         '<path d="M80,-12 V-84 M108,-12 V-84" stroke="#8a5a3a" stroke-width="3"/><path d="M78,-84 h32 M78,-58 h32 M78,-32 h32" stroke="#8a5a3a" stroke-width="3"/>'
         '<rect x="82" y="-70" width="22" height="12" fill="#c9a8e6"/><ellipse cx="104" cy="-64" rx="3.4" ry="6" fill="#b593d8"/>'
         '<rect x="82" y="-44" width="22" height="12" fill="#a7d99a"/><ellipse cx="104" cy="-38" rx="3.4" ry="6" fill="#8cc685"/>'
         '<rect x="82" y="-96" width="22" height="12" fill="#f4a38c"/><ellipse cx="104" cy="-90" rx="3.4" ry="6" fill="#e8876e"/>'
         # a nagy szalagorsó a földön (jobb sarok)
         '<rect x="128" y="-12" width="46" height="11" rx="3" fill="#c99a6a"/><rect x="134" y="-64" width="34" height="52" fill="#f4a6c8"/>'
         '<path d="M134,-50 H168 M134,-38 H168 M134,-26 H168" stroke="#fff" stroke-width="2" opacity=".7"/><rect x="128" y="-74" width="46" height="11" rx="3" fill="#c99a6a"/>')
    K = (csipke(-114, 80, -108, 14, 7, "#fff6f9", "#b97fa0") +
         '<path d="M-118,-122 H84 L80,-108 H-114 Z" fill="url(#csikSz)"/>'
         # az olló-cégér a bal sarkon
         '<path d="M-110,-124 H-152 M-110,-112 L-124,-124" fill="none" stroke="#6e4a36" stroke-width="2.6"/><path d="M-148,-124 v8 M-132,-124 v8" stroke-width="1.2"/>'
         '<circle cx="-140" cy="-98" r="19" fill="#fffaf0"/>'
         '<path d="M-150,-112 L-134,-90 M-130,-112 L-146,-90" stroke="#8a8aa6" stroke-width="3.2"/>'
         '<circle cx="-148" cy="-86" r="5" fill="none" stroke="#e0417a" stroke-width="2.4"/><circle cx="-132" cy="-86" r="5" fill="none" stroke="#e0417a" stroke-width="2.4"/>'
         # masni az ajtó fölött, gombfüzér
         '<g transform="translate(47 -100)"><path d="M0,0 Q-12,-8 -14,0 Q-12,8 0,0 Q12,-8 14,0 Q12,8 0,0 Z" fill="#f6a5c0"/><circle r="2.6" fill="#e0417a"/></g>'
         '<path d="M-26,-146 Q0,-140 26,-146" fill="none" stroke-width="1.2"/>'
         '<g stroke-width="1"><circle cx="-16" cy="-143" r="3" fill="#fce49a"/><circle cx="0" cy="-141" r="3" fill="#9ec9f0"/><circle cx="16" cy="-143" r="3" fill="#a7d99a"/></g>')
    KA = ('<path d="M-77,-48 q4,10 -2,22" fill="none" stroke="#fce49a" stroke-width="5" stroke-linecap="round"><animate attributeName="d" values="M-77,-48 q4,10 -2,22;M-77,-48 q8,10 4,22;M-77,-48 q4,10 -2,22" dur="2.6s" repeatCount="indefinite"/></path>'
          '<path d="M-77,-48 q4,10 -2,22" fill="none" stroke="#d1a23a" stroke-width="1" stroke-dasharray="1 3"><animate attributeName="d" values="M-77,-48 q4,10 -2,22;M-77,-48 q8,10 4,22;M-77,-48 q4,10 -2,22" dur="2.6s" repeatCount="indefinite"/></path>'
          '<path d="M168,-40 Q196,-24 190,4" fill="none" stroke="#f4a6c8" stroke-width="8" stroke-linecap="round"><animate attributeName="d" values="M168,-40 Q196,-24 190,4;M168,-40 Q202,-30 200,0;M168,-40 Q196,-24 190,4" dur="3s" repeatCount="indefinite"/></path>'
          '<g><animateTransform attributeName="transform" type="rotate" values="-5 -140 -124;5 -140 -124;-5 -140 -124" dur="3.6s" repeatCount="indefinite"/>'
          '<path d="M-140,-117 v-7" stroke="' + INK + '" stroke-width="1"/></g>'
          '<path transform="translate(-36,-74)" d="M0,-5 L1.2,-1.2 L5,0 L1.2,1.2 L0,5 L-1.2,1.2 L-5,0 L-1.2,-1.2Z" fill="#fff" opacity="0"><animate attributeName="opacity" values="0;1;0" dur="2.2s" repeatCount="indefinite"/></path>')
    V = ('<g stroke-width="1"><path d="M-108,-14 Q-118,-50 -106,-80 M108,-14 Q116,-40 110,-60" stroke="#6ea96a" stroke-width="2" fill="none"/>'
         '<circle cx="-112" cy="-36" r="4.5" fill="#f6a5c0"/><circle cx="-108" cy="-66" r="4.5" fill="#fff"/><circle cx="112" cy="-30" r="4" fill="#fce49a"/>'
         '<path d="M-8,-2 l-3,-14 h18 l-3,14 z" fill="#c98f6e"/><circle cx="-6" cy="-20" r="4" fill="#f6a5c0"/><circle cx="4" cy="-22" r="4" fill="#c9a8e6"/>'
         '<circle cx="-30" cy="-160" r="3" fill="#f6a5c0"/><circle cx="30" cy="-160" r="3" fill="#fce49a"/></g>')
    defs = ('<linearGradient id="falS" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fdeef4"/><stop offset="1" stop-color="#f7d6e5"/></linearGradient>'
            '<pattern id="csikSz" width="24" height="24" patternUnits="userSpaceOnUse"><rect width="12" height="24" fill="#f4a6c8"/><rect x="12" width="12" height="24" fill="#fff6f9"/></pattern>')
    return dict(G=arnyek(10, 4, 150, 16), S=S, W=W, A=A, K=K, KA=KA, V=V, sb=(-120, -208, 120, 0), ext=(-166, -232, 210, 18), defs=defs)


def ivpontok(p, n=10):
    """a sima() görbe pontjai (a cobble és a kihagyás miatt)"""
    q = [p[0]]
    for i in range(1, len(p) - 1):
        a = q[-1]; c = p[i]; b = ((p[i][0] + p[i + 1][0]) / 2, (p[i][1] + p[i + 1][1]) / 2) if i < len(p) - 2 else p[-1]
        for k in range(1, n + 1):
            t = k / n
            q.append(((1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0], (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1]))
    if q[-1] != p[-1]:
        q.append(p[-1])
    return q

def tav_vonal(q, x, y):
    best = 1e9
    for i in range(len(q) - 1):
        ax, ay = q[i]; bx, by = q[i + 1]; dx, dy = bx - ax, by - ay
        L = dx * dx + dy * dy or 1
        t = max(0, min(1, ((x - ax) * dx + (y - ay) * dy) / L))
        best = min(best, ((ax + t * dx - x) ** 2 + (ay + t * dy - y) ** 2) ** .5)
    return best

def bent(poly, x, y):
    c = False
    for i in range(len(poly)):
        x1, y1 = poly[i]; x2, y2 = poly[i - 1]
        if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / (y2 - y1) + x1:
            c = not c
    return c

PATAK_J = [(345, 352), (318, 440), (292, 520), (262, 620), (205, 720), (150, 820), (96, 920), (64, 1000), (44, 1070)]   # jobb part (a malom felől)
PATAK_B = [(262, 352), (226, 440), (196, 520), (160, 610), (92, 712), (20, 810), (-60, 920), (-120, 1000), (-170, 1070)]
UTCA = [(BX1 + 10, 905), (1640, 870), (1360, 840), (1180, 790), (960, 720), (780, 690), (600, 664), (470, 650)]
KAPU_AG = [(1100, BY1 + 10), (1120, 940), (1150, 860), (1180, 795)]
MALOM = (400, 610)          # a malom talppontja
KEREK = (300, 590, 76)      # a kerék közepe és sugara (a lapátokkal)

def kezmuvesek():
    M = "kezmuvesek"
    r = Rnd(431)
    patak_poly = ivpontok(PATAK_J, 4) + list(reversed(ivpontok(PATAK_B, 4)))
    utca_q, ag_q = ivpontok(UTCA, 12), ivpontok(KAPU_AG, 10)
    def utcan(x, y, plusz=0):
        return tav_vonal(utca_q, x, y) < 52 + plusz or tav_vonal(ag_q, x, y) < 40 + plusz
    def patakban(x, y, plusz=0):
        return bent(patak_poly, x, y) or (plusz and (bent(patak_poly, x - plusz, y) or bent(patak_poly, x + plusz, y)))

    # ég: délelőtti nap bal fent
    eg = ('<rect x="%d" y="%d" width="%d" height="%d" fill="#c4def2"/><rect x="%d" y="0" width="%d" height="440" fill="url(#eg)"/><rect x="%d" y="430" width="%d" height="%d" fill="#fdf1e2"/>'
          '<circle cx="170" cy="90" r="250" fill="url(#napfeny)"/><circle cx="170" cy="90" r="38" fill="#fff6cf"/>') % (BX0, BY0, BX1 - BX0, 170, BX0, BX1 - BX0, BX0, BX1 - BX0, BY1 - 430)
    eg += '<g opacity=".55">' + felho(-420, 70, 1.5, .7) + felho(700, -30, 1.2, .6) + felho(1880, 40, 1.4, .7) + '</g>'
    irj(M, "eg", KIFESTVE, '<linearGradient id="eg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c4def2"/><stop offset=".75" stop-color="#e8f0f3"/><stop offset="1" stop-color="#fdf1e2"/></linearGradient>'
        '<radialGradient id="napfeny"><stop offset="0" stop-color="#fff8d8" stop-opacity=".95"/><stop offset="1" stop-color="#fff8d8" stop-opacity="0"/></radialGradient>', eg)

    # távoli: a hegy, a Domboldal Garas tornyával és a Jósdával; balra a patakon túl az Erdőszél; jobbra az Utca háztetői
    tav = ('<g filter="url(#firka)"><path d="M1000,330 L1250,110 L1340,180 L1460,60 L1560,140 L1700,50 L1880,170 L2000,110 L2170,190 L2170,400 L1000,400 Z" fill="#ddd6ee" stroke="#bdb2d8" stroke-width="2"/>'
           '<path d="M1432,88 L1460,60 L1490,92 L1472,86 L1460,98 L1446,86 Z M1678,72 L1700,50 L1724,76 L1710,72 L1700,82 Z M1234,124 L1250,110 L1266,126 L1256,124 Z" fill="#fff"/>'
           '<path d="M1460,60 L1490,92 L1560,140 L1580,210 L1480,240 Z" fill="#3c2f5e" opacity=".06" stroke="none"/>'
           '<path d="M740,372 Q960,240 1180,222 Q1400,204 1640,150 Q1900,110 2170,130 V400 H740 Z" fill="url(#dombT)" stroke="#d6bd6a" stroke-width="2"/>'
           '<path d="M1060,300 Q1160,250 1240,236 Q1300,224 1340,196 Q1380,170 1440,166" stroke="#f4e6c4" stroke-width="8" fill="none" stroke-linecap="round"/>'
           '<g stroke="#8a5a3a" stroke-width="1.6" opacity=".85"><rect x="1281" y="182" width="18" height="30" fill="#ddd0ba"/><rect x="1282" y="160" width="16" height="22" fill="#ecd0a8"/>'
           '<path d="M1275,161 L1290,136 L1305,161 Z" fill="#c96a4a"/><path d="M1290,136 v-10 l9,3 l-9,3" fill="#fce49a"/></g>'
           '<g stroke="#3f5f8f" stroke-width="1.6" opacity=".85"><rect x="1430" y="150" width="40" height="16" fill="#dce8f8"/><path d="M1432,151 C1432,130 1468,130 1468,151 Z" fill="#a9bde4"/></g>')
    for x, y in ((820, 352), (870, 336), (1560, 140), (1600, 134), (1760, 118), (1800, 122), (1940, 116), (2010, 120), (2090, 126)):
        tav += fenyo(x, y, 28, "#8fb89a")
    tav += '</g>'
    tav += '<g filter="url(#firka)"><path d="M%d,360 Q-300,300 -40,330 Q140,300 330,350 V420 H%d Z" fill="#cfe3c2"/>' % (BX0 - 10, BX0 - 10)
    x = BX0
    while x < 330:
        tav += fenyo(round(x), round(392 + r() * 30 - max(0, x - 200) * .1), 34 + r() * 18, ["#7fae8c", "#8fb89a", "#6fa883"][int(r() * 3)])
        x += 30 + r() * 22
    tav += '</g><g filter="url(#firka)" stroke="#9a7a6a" stroke-width="1.6" opacity=".82">'
    x = 1330
    SZINEK = [("#f3dcc0", "#d99a8a"), ("#f6e6c8", "#e3b48c"), ("#efe2f6", "#c9a8e6"), ("#e8f0ff", "#9fb8e0"), ("#f7e1c9", "#d27a5a")]
    while x < BX1:
        w_ = 44 + r() * 30; h_ = 28 + r() * 16; c = SZINEK[int(r() * 5)]
        tav += hatso_haz(x, 384 + r() * 8, w_, h_, c[0], c[1], r)
        x += w_ + 18 + r() * 40
    tav += '</g>'
    irj(M, "tavoli", KIFESTVE, FIRKA + '<linearGradient id="dombT" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f8ebb6"/><stop offset="1" stop-color="#eedb98"/></linearGradient>', tav)

    # közép: rét, a patak partokkal, a macskaköves utca, a kis utak a házakhoz, az üres telek, fák, bokrok, virágok
    koz = ('<rect x="%d" y="362" width="%d" height="%d" fill="url(#ret)"/>' % (BX0, BX1 - BX0, BY1 - 362) +
           '<path d="M%d,374 Q400,352 800,368 T2170,376 V430 H%d Z" fill="#c6e4b4"/>' % (BX0, BX0))
    koz += '<g filter="url(#firka)">'
    # hátul, a házak mögött: fák, sövény
    for x, y, rr in ((520, 470, 22), (760, 410, 18), (1110, 430, 22), (1470, 470, 24), (1700, 520, 26), (1900, 560, 28), (2080, 520, 26), (600, 420, 16), (1240, 400, 16)):
        koz += lomb(x, y, rr, ["#8fc98a", "#9fd19a", "#7fbf86", "#a7d99a"][int(r() * 4)])
    # a patak: a jobb part (a malom felől) kövekkel, nád; a víz
    pd = sima(PATAK_J) + " " + sima(list(reversed(PATAK_B))).replace("M", "L", 1) + " Z"
    koz += ('<path d="%s" fill="#b9d8a0" stroke="none" transform="translate(10 4)"/>' % pd +
            '<path d="%s" fill="url(#viz)" stroke="#7fb3d6" stroke-width="3"/>' % pd +
            '<path d="%s" fill="none" stroke="#e4f4fb" stroke-width="2" opacity=".7" transform="translate(-8 0)"/>' % sima([(320, 380), (296, 470), (268, 560), (232, 660), (176, 760), (120, 860), (70, 960)]))
    koz += bokor(236, 376, 1.3) + bokor(330, 372, 1.15, "#7fbf86", "#9fd19a") + bokor(284, 384, .9)   # a patak hátul a bokrok mögül bukkan elő
    for (x, y), (x2, y2) in zip(PATAK_J[1:-1], PATAK_J[2:]):
        for t in (.2, .6):
            sx, sy = x + (x2 - x) * t + 6, y + (y2 - y) * t
            koz += '<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="#e3dccb" stroke="%s" stroke-width="1.4"/>' % (f(sx), f(sy), f(9 + r() * 5), f(5 + r() * 2), INK)
    for x, y in ((-90, 900), (-30, 830), (40, 740), (110, 650), (150, 560), (186, 470)):
        koz += '<path d="M%d,%d q-3,-22 -1,-36 M%d,%d q2,-20 6,-30 M%d,%d q-6,-16 -10,-24" stroke="#7fae6a" stroke-width="2" fill="none"/><ellipse cx="%d" cy="%d" rx="2.6" ry="7" fill="#a8764f" stroke="none"/>' % (
            x, y, x + 4, y, x - 4, y, x - 2, y - 38)
    # a malom körüli udvar (döngölt föld) és a malomárok kőpartja
    koz += '<ellipse cx="420" cy="642" rx="150" ry="40" fill="#e6d6b0" opacity=".8"/>'
    # macskaköves utca + ág a kapuhoz + kis utak a házak ajtajához
    koz += ('<path d="%s" stroke="#d6c49c" stroke-width="104" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' % sima(UTCA) +
            '<path d="%s" stroke="#d6c49c" stroke-width="80" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' % sima(KAPU_AG) +
            '<path d="%s" stroke="url(#ko)" stroke-width="96" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' % sima(UTCA) +
            '<path d="%s" stroke="url(#ko)" stroke-width="72" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' % sima(KAPU_AG))
    koz += ut([(654, 606), (662, 640), (674, 676)], 30) + ut([(965, 526), (978, 600), (994, 660), (1000, 724)], 30) + ut([(1338, 646), (1334, 720), (1318, 832)], 30) + ut([(400, 614), (430, 640), (476, 652)], 30)
    koz += '</g>'
    # macskakövek
    y = 600
    while y < BY1:
        x = 380 + (y % 2) * 12
        sk = .6 + .4 * (y - 600) / 460
        while x < BX1:
            if utcan(x, y, -8) and r() < .5:
                koz += '<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="%s" stroke="#cdb488" stroke-width=".9"/>' % (
                    f(x + r() * 8), f(y + r() * 4), f((9 + r() * 4) * sk), f((3.6 + r() * 1.4) * sk), ["#efdfbe", "#e9d6b0", "#f4e7ca"][int(r() * 3)])
            x += 24 + r() * 8
        y += 15
    koz += '<g filter="url(#firka)">'
    # az üres telek (a szélén; később a gépész-műhely)
    koz += kozeli_telek(1500, 600)
    # útjelző a kapunál: nyíl az Utca felé; lámpaoszlopok az utca mentén; pad a malom előtt
    koz += ('<g transform="translate(1010 860)" stroke="%s" stroke-width="2" stroke-linejoin="round"><ellipse cx="0" cy="2" rx="14" ry="4" fill="#3c2a50" opacity=".14" stroke="none"/><path d="M0,0 V-80" stroke="#8a6a52" stroke-width="6"/>'
            '<path d="M4,-80 H86 L98,-68 L86,-56 H4 Z" fill="#fffaf0"/><path d="M24,-68 H72 M72,-68 l-8,-5 M72,-68 l-8,5" stroke="#b5804a" stroke-width="2.4" fill="none"/></g>') % INK
    for x, y in ((1236, 752), (560, 610)):
        koz += ('<g transform="translate(%d %d)" stroke="%s" stroke-width="2"><ellipse cx="0" cy="2" rx="14" ry="4" fill="#3c2a50" opacity=".14" stroke="none"/><path d="M0,0 V-86" stroke="#6e6a86" stroke-width="4"/>'
                '<path d="M-9,-86 h18 l-3,-18 h-12 z" fill="#fff3b0"/><path d="M-11,-104 h22 l-11,-9 z" fill="#6e6a86"/></g>') % (x, y, INK)
    koz += ('<g transform="translate(520 720)" stroke="%s" stroke-width="2"><path d="M-36,0 h72 v8 h-72 z" fill="#c99a6a"/><path d="M-30,8 v14 M30,8 v14" stroke="#6e4a36" stroke-width="3"/>'
            '<path d="M-36,-14 h72" stroke="#6e4a36" stroke-width="3"/><path d="M-32,-14 v14 M32,-14 v14" stroke="#6e4a36" stroke-width="2.4"/></g>') % INK
    # bokrok, fák elöl és a kifestett részen (nem az utcára, nem a patakba)
    for x, y, s in ((470, 780, 1.0), (800, 900, 1.0), (1130, 650, .9), (800, 620, .8), (1580, 700, 1.0), (1700, 760, 1.2), (1900, 820, 1.1), (560, 860, .9), (330, 760, 1.0), (-260, 560, 1.1)):
        koz += bokor(x, y, s)
    for x, y, rr in ((1780, 640, 26), (1960, 700, 30), (2100, 640, 28), (2020, 860, 34), (1860, 960, 30), (2120, 1000, 32)):
        koz += lomb(x, y, rr, ["#8fc98a", "#9fd19a", "#7fbf86", "#a7d99a"][int(r() * 4)])
    for x, y, h in ((-480, 560, 66), (-380, 640, 72), (-500, 760, 80), (-340, 820, 74), (-460, 960, 86), (-260, 700, 64), (-170, 600, 58), (-80, 520, 54), (40, 470, 50), (100, 430, 46), (-300, 1020, 80)):
        koz += fenyo(x, y, h, ["#7fb58a", "#8fc09a", "#74a984"][int(r() * 3)])
    koz += '</g>'
    kihagy = lambda x, y: utcan(x, y, 6) or patakban(x, y, 10)
    koz += fucsomok(r, 460, BX0, BX1, 420, BY1, kihagy=kihagy)
    koz += viragok(r, 300, BX0, BX1, 430, BY1, kihagy=kihagy)
    irj(M, "kozep", KIFESTVE, FIRKA + '<linearGradient id="ret" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d4ecc4"/><stop offset="1" stop-color="#b9dc98"/></linearGradient>'
        '<linearGradient id="viz" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#c4e6f4"/><stop offset="1" stop-color="#8cc6e4"/></linearGradient>'
        '<linearGradient id="ko" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6e9cc"/><stop offset="1" stop-color="#ead6ae"/></linearGradient>', koz)

    # előtér: füves szél (a kapu és a patak torkolata szabad), nád a patak két partján, egy-egy bokor a sarkokban
    elo = ('<g filter="url(#firka)" stroke="%s" stroke-width="2" fill="#9fcf8f">'
           '<path d="M%d,%d L%d,930 Q-400,912 -200,922 L-190,%d Z"/><path d="M70,%d L90,930 Q500,906 1040,926 L1046,%d Z"/>'
           '<path d="M1230,%d L1240,924 Q1700,902 %d,914 L%d,%d Z"/></g>') % (
        INK, BX0 - 10, BY1 + 10, BX0 - 10, BY1 + 10, BY1 + 10, BY1 + 10, BY1 + 10, BX1 + 10, BX1 + 10, BY1 + 10)
    elo += '<g filter="url(#firka)" stroke="%s" stroke-width="2">' % INK + bokor(-330, 940, 1.6) + bokor(1700, 940, 1.6, "#7fbf86", "#9fd19a") + bokor(640, 950, 1.3) + '</g>'
    for x in (-210, -190, 80, 98, 116):
        elo += '<path d="M%d,%d q-4,-30 -2,-52 M%d,%d q4,-26 10,-40" stroke="#6f9e5e" stroke-width="2.4" fill="none"/><ellipse cx="%d" cy="%d" rx="3" ry="8" fill="#a8764f"/>' % (
            x, BY1 - 100, x + 5, BY1 - 100, x - 2, BY1 - 156)
    elo += fucsomok(Rnd(97), 160, BX0, BX1, 915, 950, c="#7fae6a", kihagy=lambda x, y: (1050 < x < 1230) or (-190 < x < 80))
    irj(M, "eloter", KIFESTVE, FIRKA, elo)

    # mozgó: felhők, csillogó víz a patakon, kacsa, lepkék, füst a háztetőkről, madarak, szálló levelek
    csillam = ""
    for i, (x, y) in enumerate(((300, 400), (280, 480), (250, 560), (226, 610), (186, 700), (140, 780), (90, 860), (50, 940), (10, 1010))):
        csillam += ('<path d="M%s,%s q-6,14 -14,24" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none" stroke-dasharray="10 30">'
                    '<animate attributeName="stroke-dashoffset" values="0;-80" dur="%ss" repeatCount="indefinite"/><animate attributeName="opacity" values=".2;.85;.2" dur="%ss" repeatCount="indefinite"/></path>') % (
            f(x), f(y), f(1.8 + (i % 3) * .3), f(2.6 + (i % 2) * .8))
    kacsa = ('<g transform="translate(30 890)"><g><animateTransform attributeName="transform" type="translate" values="0,0;-30,24;0,0" dur="16s" repeatCount="indefinite"/>'
             '<g><animateTransform attributeName="transform" type="translate" values="0,0;0,2;0,0" dur="1.6s" repeatCount="indefinite"/>'
             '<path d="M-14,0 Q-16,-12 0,-10 Q10,-10 12,-2 Q8,4 -10,4 Z" fill="#fffaf0" stroke="#7d7896" stroke-width="1.6"/><circle cx="8" cy="-14" r="5.5" fill="#fffaf0" stroke="#7d7896" stroke-width="1.6"/>'
             '<path d="M13,-14 l6,1.5 l-6,1.5 z" fill="#f2a24e"/><circle cx="9" cy="-15" r="1" fill="#3c2f5e"/>'
             '<path d="M-18,4 q18,6 34,0" fill="none" stroke="#fff" stroke-width="2" opacity=".8"/></g></g></g>')
    also = ('<g id="also" pointer-events="none">\n<g>' + uszo_felho(-300, 50, 1.3, 90, 140) + uszo_felho(420, 70, 1.0, 70, 120) + uszo_felho(1180, 30, 1.4, -80, 160) + uszo_felho(1900, 80, 1.1, -60, 130) + "</g>\n" +
            csillam + "\n" + kacsa + "\n" +
            '<g opacity=".7">' + fust(1400, 330, 3, 5, 40) + fust(1700, 340, 3, 5.5, 40) + fust(2000, 336, 3, 4.8, 40) + "</g>\n" +
            lepke(520, 560, "#f6a5c0", 14, "0,0;60,-30;120,10;40,30;0,0") + lepke(1560, 560, "#fce49a", 16, "0,0;-70,-20;-110,20;-30,30;0,0") + lepke(860, 820, "#c9a8e6", 13, "0,0;50,-24;90,6;30,20;0,0") + "\n</g>\n")
    felso = ('<g id="felso" pointer-events="none">\n' + csapat(-120, 140, 1, 1900, 46) + csapat(1900, 250, .8, -2300, 58) + "\n" +
             '<g opacity=".9">' + ''.join('<path d="M%s,%s q3,-4 6,0 q-3,4 -6,0 Z" fill="%s"><animateTransform attributeName="transform" type="translate" values="0,0;%s,%s" dur="%ss" begin="%ss" repeatCount="indefinite"/>'
                                           '<animate attributeName="opacity" values="0;1;1;0" dur="%ss" begin="%ss" repeatCount="indefinite"/></path>' % (
                 f(500 + i * 260), f(400 + (i % 3) * 20), "#a7d99a" if i % 2 else "#e8b878", -40 + i * 14, 300 + i * 20, 8 + i, i * 1.9, 8 + i, i * 1.9) for i in range(5)) + "</g>\n</g>")
    irj(M, "mozgo", KIFESTVE, "".join([MADAR, ULO]), also + felso, elotag="vm-")

    # díszlet-fájlok: a malom (épület) · a kereke (a játék forgatja: style.css .hely-malomkerek) · a hab a kerék alatt
    mx, my = MALOM
    malom = (arnyek(mx + 20, my + 6, 128, 16, .13) +
             '<path d="M%s,%s q60,-14 140,-6 q10,22 -6,40 q-70,10 -140,-4 z" fill="#c9bfa6" stroke="%s" stroke-width="2" filter="url(#firka)"/>' % (f(224), f(my + 26), INK) +
             fok(('<g transform="translate(%s %s)">' % (f(mx), f(my))) +
                 '<path d="M-90,0 V-110 H90 V0 Z" fill="#e6dccb"/>'
                 '<path d="M-90,-36 H90 M-90,-72 H90 M-40,0 V-36 M30,0 V-36 M-10,-36 V-72 M54,-36 V-72 M-60,-72 V-110 M20,-72 V-110" stroke="#b5a68e" stroke-width="2"/>'
                 '<path d="M40,-109 H89 V-1 H40 Z" fill="#3c2f5e" opacity=".07" stroke="none"/>'
                 '<path d="M-82,-110 V-182 H82 V-110 Z" fill="#e9c9a0"/><path d="M-52,-110 V-182 M-22,-110 V-182 M8,-110 V-182 M38,-110 V-182 M66,-110 V-182" stroke="#c49a6a" stroke-width="2"/>'
                 '<path d="M-104,-178 L0,-256 L104,-178 Q0,-170 -104,-178 Z" fill="#c98b5e"/>' + teto_cserep(-104, 104, -256, -178, 3, "#a8603a") +
                 '<path d="M-90,-180 L0,-250 L-12,-226 L-76,-178 Z" fill="#fff" opacity=".18" stroke="none"/>'
                 '<path d="M-18,0 V-44 Q0,-62 18,-44 V0 Z" fill="#8a5a3a"/><path d="M0,-2 V-56" stroke-width="1.2" opacity=".5"/>'
                 '<rect x="34" y="-162" width="30" height="30" fill="#e9f4fb"/><path d="M49,-162 V-132 M34,-147 H64" stroke-width="1.4"/>'
                 '<rect x="-60" y="-166" width="28" height="36" fill="#a8764f"/><path d="M-46,-166 V-130" stroke-width="1.2" opacity=".6"/>'
                 '<path d="M-46,-186 v-12 M-60,-198 h28" stroke="#6e4a36" stroke-width="3"/><circle cx="-36" cy="-194" r="4" fill="#a8764f"/>'
                 '<path d="M-36,-190 V-176" stroke="#8a6a52" stroke-width="1.4"/><path d="M-44,-176 q8,-6 16,0 q2,12 -8,14 q-10,-2 -8,-14 z" fill="#f4ecdc"/>'
                 '<path d="M-8,-236 h16 v-16 h-16 z" fill="#fffaf0"/><path d="M0,-236 v-16 M-8,-244 h16" stroke-width="1"/>'
                 '<path d="M66,0 l6,-18 l14,0 l4,18 z" fill="#efe3cc"/><path d="M58,0 l4,-14 l10,0 l2,14 z" fill="#f4ecdc"/>'
                 '<circle cx="-90" cy="-20" r="9" fill="#8a6a4a"/>'
                 '</g>'))
    irj(M, "malom", (200, 340, 350, 340), FIRKA, malom)
    kx, ky, kr = KEREK
    kerek = fok(('<g transform="translate(%s %s)">' % (f(kx), f(ky))) +
                '<circle r="64" fill="none" stroke="#8a6a4a" stroke-width="8"/><circle r="64" fill="none" stroke="#c99a6a" stroke-width="3"/><circle r="46" fill="none" stroke="#b98a64" stroke-width="3"/>'
                '<path d="M-64,0 H64 M0,-64 V64 M-45,-45 L45,45 M-45,45 L45,-45" stroke="#8a6a4a" stroke-width="4.4"/>' +
                ''.join('<rect x="-7" y="-76" width="14" height="18" rx="2" fill="#c99a6a" transform="rotate(%d)"/>' % a for a in range(0, 360, 30)) +
                '<circle r="11" fill="#b98a64"/><circle r="4" fill="#6e4a36"/></g>', 2)
    irj(M, "malom-kerek", (kx - kr - 6, ky - kr - 6, 2 * kr + 12, 2 * kr + 12), FIRKA, kerek)
    tav_ = lambda dy: "M214,%s q22,-%s 44,0 q22,%s 44,0 q22,-%s 44,0 q20,%s 40,0" % (f(ky + 54), dy, dy, dy, dy)
    hab = ('<path d="M206,%s Q250,%s 300,%s Q352,%s 388,%s Q398,%s 384,%s Q300,%s 222,%s Q200,%s 206,%s Z" fill="#a9d6ef" opacity=".95" stroke="#7fb3d6" stroke-width="2.4"/>' % (
               f(ky + 52), f(ky + 46), f(ky + 50), f(ky + 46), f(ky + 56), f(ky + 70), f(ky + 82), f(ky + 94), f(ky + 88), f(ky + 70), f(ky + 52)) +
           '<path d="M384,%s Q300,%s 222,%s" fill="none" stroke="#c9bfa6" stroke-width="5" stroke-linecap="round" filter="url(#firka)"/>' % (f(ky + 82), f(ky + 94), f(ky + 88)) +
           ('<path d="%s" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".85"><animate attributeName="d" values="%s;%s;%s" dur="2.2s" repeatCount="indefinite"/></path>' % (
               tav_(5), tav_(5), tav_(-5), tav_(5))))
    for i, (x, y, rr) in enumerate(((248, ky + 54, 9), (272, ky + 58, 11), (300, ky + 56, 10), (326, ky + 58, 9), (352, ky + 55, 7), (236, ky + 60, 6))):
        hab += ('<circle cx="%s" cy="%s" r="%s" fill="#fff" opacity=".9"><animate attributeName="r" values="%s;%s;%s" dur="%ss" begin="%ss" repeatCount="indefinite"/>'
                '<animate attributeName="opacity" values=".9;.4;.9" dur="%ss" begin="%ss" repeatCount="indefinite"/></circle>') % (
            f(x), f(y), rr, rr * .6, rr, rr * .6, f(1.2 + i * .17), f(i * .2), f(1.2 + i * .17), f(i * .2))
    for i in range(4):
        hab += ('<circle cx="%s" cy="%s" r="2.6" fill="#fff" opacity="0"><animate attributeName="cx" values="%s;%s" dur="1.4s" begin="%ss" repeatCount="indefinite"/>'
                '<animate attributeName="cy" values="%s;%s;%s" dur="1.4s" begin="%ss" repeatCount="indefinite"/><animate attributeName="opacity" values="0;1;0" dur="1.4s" begin="%ss" repeatCount="indefinite"/></circle>') % (
            f(kx - 40 + i * 6), f(ky + 40), f(kx - 40 + i * 6), f(kx - 70 - i * 6), f(ky + 40), f(ky + 10 - i * 4), f(ky + 50), f(i * .35), f(i * .35), f(i * .35))
    hab += '<path d="M232,%s q8,-3 16,0 M300,%s q10,-3 20,0" stroke="#fff" stroke-width="2" fill="none" opacity=".8"/>' % (f(ky + 76), f(ky + 82))
    irj(M, "malom-hab", (196, ky + 30, 210, 74), FIRKA, hab)

    # a ruhaszárító kötél a szabóműhely mögött (az anyagok lengenek)
    lap = lambda x, y, w, h, c, v, dur: ('<g transform="translate(%d %d)"><path d="M0,0 h%d v%d h-%d z" fill="%s" stroke="%s" stroke-width="1.6"><animateTransform attributeName="transform" type="skewX" values="%s" dur="%ss" repeatCount="indefinite"/></path>'
                                         '<path d="M4,-4 v8 M%d,-4 v8" stroke="#a8764f" stroke-width="2.4"/></g>') % (x, y, w, h, w, c, INK, v, dur, w - 4)
    kotel = (fok('<path d="M1170,522 V322 M1406,522 V320" stroke="#8a6a4a" stroke-width="6"/><path d="M1164,322 h12 M1400,320 h12" stroke="#6e4a36" stroke-width="3"/>') +
             '<path d="M1170,326 Q1290,356 1406,324" stroke="#6e4a36" stroke-width="1.8" fill="none"/>' +
             lap(1196, 336, 36, 44, "#8fd3e0", "0;6;0;-4;0", 4) + lap(1246, 345, 30, 52, "#fce49a", "0;-5;0;5;0", 4.6) +
             lap(1294, 346, 34, 40, "url(#csikKo)", "0;4;0;-6;0", 4.2) + lap(1344, 338, 28, 36, "#c9a8e6", "0;5;0;-5;0", 3.8))
    irj(M, "kotel", (1150, 300, 280, 230), FIRKA + '<pattern id="csikKo" width="12" height="12" patternUnits="userSpaceOnUse"><rect width="12" height="12" fill="#fff6f9"/><rect width="6" height="12" fill="#f4a6c8"/></pattern>', kotel)

    # a macska a pékség jobb párkányán — képregényes rajz (2026-11-24, a producer kérése: „legyen rajzoltabb”): körvonal, fény-árnyék,
    # fehér pofa + mellény, mancsok, csíkok, csillogó szem (néha pislog), csíkos farok lelóg a párkányról (jár), a füle néha rebben
    BUN, BUN_S, CSIK, FEH = "url(#macskaB)", "#8f82b3", "#7d6fa3", "#f6f1fb"
    farok_d = ("M10,-3 C20,-4 25,2 23,14", "M10,-3 C22,-8 28,0 27,10", "M10,-3 C17,0 19,6 16,16", "M10,-3 C20,-4 25,2 23,14")
    def farok(stroke, w, extra=""):
        return ('<path d="%s" stroke="%s" stroke-width="%s" fill="none" stroke-linecap="round"%s><animate attributeName="d" values="%s" dur="2.6s" repeatCount="indefinite"/></path>') % (
            farok_d[0], stroke, w, extra, ";".join(farok_d))
    szem = lambda x: ('<ellipse cx="%s" cy="-23.6" rx="1.7" ry="2.2" fill="%s"><animate attributeName="ry" values="2.2;2.2;.3;2.2;2.2" keyTimes="0;.9;.93;.96;1" dur="4.2s" repeatCount="indefinite"/></ellipse>'
                      '<circle cx="%s" cy="-24.4" r=".65" fill="#fff"><animate attributeName="opacity" values="1;1;0;1;1" keyTimes="0;.9;.93;.96;1" dur="4.2s" repeatCount="indefinite"/></circle>') % (f(x), INK, f(x + .6))
    macska = ('<g transform="translate(696 532)">' + arnyek(1, .6, 15, 2.2, .16) +
              farok(INK, 6.6) + farok(BUN_S, 4) + farok(CSIK, 4, ' stroke-dasharray="2.4 4.2" stroke-dashoffset="-6"') +
              '<g filter="url(#firkaM)" stroke="%s" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round">' % INK +
              # test: ülő, kerek hát; hátsó comb; mellény; mancsok; csíkok
              '<path d="M-12,0 C-15,-9 -12,-17 -3,-18.5 C7,-20 14.5,-11 12.5,0 Z" fill="%s"/>' % BUN +
              '<path d="M5,-1 C12,-2 12,-11 6,-12" fill="none" stroke="%s" stroke-width="1.1"/>' % CSIK +
              '<path d="M8.6,-15 q-2.2,2 -1.2,4.4 M11.2,-11.6 q-2,1.6 -1.2,3.8" fill="none" stroke="%s" stroke-width="1.3"/>' % CSIK +
              '<path d="M-6.4,-1 Q-7.4,-10 -2,-14.6 Q3.4,-10 3,-1 Z" fill="%s" stroke="none"/>' % FEH +
              '<path d="M-10.5,-4 C-11.5,-10 -8,-15 -4,-16.4 C-8.6,-13 -9.6,-8 -9,-3 Z" fill="#fff" opacity=".35" stroke="none"/>'
              '<ellipse cx="-5.2" cy="-1.2" rx="3.4" ry="2.1" fill="%s" stroke-width="1.2"/><ellipse cx="2" cy="-1.2" rx="3.4" ry="2.1" fill="%s" stroke-width="1.2"/>' % (FEH, FEH) +
              '<path d="M-6.2,-1.9 v1.4 M-4.2,-1.9 v1.4 M1,-1.9 v1.4 M3,-1.9 v1.4" stroke-width=".6"/>'
              # fej: kerek, oldalt pofaszőr-pamacs
              '<path d="M-11.6,-22.4 Q-12,-31.4 -2,-31.6 Q8,-31.4 7.6,-22.4 Q8.6,-20 6.4,-18.6 Q2,-15.4 -2,-15.4 Q-6,-15.4 -10.4,-18.6 Q-12.6,-20 -11.6,-22.4 Z" fill="%s"/>' % BUN +
              '<path d="M-3.8,-31.4 v2.6 M-2,-31.6 v3.2 M-.2,-31.4 v2.6" stroke="%s" stroke-width="1"/>' % CSIK +
              '<path d="M-9.6,-27 Q-8.4,-30 -5,-30.6" fill="none" stroke="#fff" stroke-width="1.2" opacity=".5"/>'
              '<path d="M3,-30.2 L6.4,-38 L8,-27.6 Z" fill="%s"/><path d="M4.4,-29.6 L6.3,-34.6 L7,-28.6 Z" fill="#f6b8cf" stroke="none"/>' % BUN +
              '</g>'
              # a bal fül külön: néha rebben
              '<g><g filter="url(#firkaM)" stroke="%s" stroke-width="1.5" stroke-linejoin="round"><path d="M-11.2,-27.4 L-11.6,-38 L-4.8,-30.4 Z" fill="%s"/>'
              '<path d="M-10.2,-29 L-10.5,-34.6 L-6.6,-30.4 Z" fill="#f6b8cf" stroke="none"/></g>'
              '<animateTransform attributeName="transform" type="rotate" values="0 -8 -29;0 -8 -29;-16 -8 -29;0 -8 -29" keyTimes="0;.8;.86;.92" dur="5s" repeatCount="indefinite"/></g>' % (INK, BUN) +
              # arc: fehér pofa, szem, orr, száj, pirosság, bajusz
              '<ellipse cx="-2" cy="-19.4" rx="4.4" ry="2.8" fill="%s"/>' % FEH +
              '<ellipse cx="-8.8" cy="-20" rx="1.9" ry="1.1" fill="#f6a5c0" opacity=".55"/><ellipse cx="4.8" cy="-20" rx="1.9" ry="1.1" fill="#f6a5c0" opacity=".55"/>' +
              szem(-6) + szem(2) +
              '<path d="M-3.2,-21 h2.4 l-1.2,1.4 z" fill="#f08aa8" stroke="%s" stroke-width=".5" stroke-linejoin="round"/>' % INK +
              '<path d="M-2,-19.6 v.8 M-4.2,-18.6 q1.1,1.3 2.2,0 q1.1,1.3 2.2,0" fill="none" stroke="%s" stroke-width=".9" stroke-linecap="round"/>' % INK +
              '<path d="M-7,-19.4 l-7,-1.4 M-7,-18.4 l-6.6,1.2 M3,-19.4 l7,-1.4 M3,-18.4 l6.6,1.2" stroke="%s" stroke-width=".6" stroke-linecap="round" opacity=".8"/>' % INK +
              '</g>')
    MDEFS = ('<filter id="firkaM" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="1" seed="7"/>'
             '<feDisplacementMap in="SourceGraphic" scale="1.3"/></filter>'
             '<linearGradient id="macskaB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bdb1de"/><stop offset="1" stop-color="#9d90c2"/></linearGradient>')
    irj(M, "macska", (668, 492, 62, 56), MDEFS, macska)

    dob = {}
    for nev, fn, alap, sd in (("pekseg", h_pekseg, (654, 600), 41), ("bajital", h_bajital, (965, 520), 42), ("szabo", h_szabo, (1290, 640), 43)):
        dob[nev] = haz_fajlok(M, nev, alap, fn(), sd)
    dob["malom"] = (200, 340, 350, 340)
    dob["malom-kerek"] = (kx - kr - 6, ky - kr - 6, 2 * kr + 12, 2 * kr + 12)
    dob["malom-hab"] = (196, ky + 30, 210, 74)
    dob["kotel"] = (1150, 300, 280, 230)
    dob["macska"] = (668, 492, 62, 56)
    return dob


# ══════════════════ A KÉZMŰVESEK TÁJ-KÉPE (a világtérképen; 4. kör, 2. kódkör kiegészítés, 2026-11-24) ══════════════════
# A mini utca kicsinyített, felismerhető mása a táj 1600×900-as rendszerében: a malomház a táj saját forgó kereke (mozgo.svg,
# vm-malomkerek, 356,574) mellett, aztán a Mézes pékség (kalács-cégér), a Bájitalkonyha (a legmagasabb: ferde türkiz tető, kerek
# ablak) és a Szabóműhely (manzárdtető, csíkos előtető, olló-cégér). A vilagkep-export.py ezt a három fájlt NEM írja felül.
TAJ_KEZM_DOBOZ = (338, 478, 210, 120)
def taj_kezmuvesek():
    rk = lambda x, y, s: '<g transform="translate(%s %s)">%s</g>' % (f(x), f(y), s)
    malom = ('<path d="M-14,0 V-17 H14 V0 Z" fill="#e6dccb"/><path d="M-14,-8 H14 M-4,0 V-8 M6,-8 V-17" stroke="#b5a68e" stroke-width="1"/>'
             '<path d="M-13,-17 V-29 H13 V-17 Z" fill="#e9c9a0"/><path d="M-5,-17 V-29 M4,-17 V-29" stroke="#c49a6a" stroke-width="1"/>'
             '<path d="M-17,-28 L0,-41 L17,-28 Q0,-27 -17,-28 Z" fill="#c98b5e"/><path d="M-3,0 V-7 Q0,-10 3,-7 V0 Z" fill="#8a5a3a" stroke-width="1"/>'
             '<rect x="5" y="-26" width="5" height="5" fill="#e9f4fb" stroke-width="1"/>')
    pekseg = ('<path d="M-17,0 V-21 H17 V0 Z" fill="#f8e0a8"/><path d="M9,-23 V-38 H14 V-27" fill="#c98f6e"/>'
              '<path d="M-21,-20 L0,-36 L21,-20 Q0,-19 -21,-20 Z" fill="#cf8a5c"/>'
              '<ellipse cx="0" cy="-26" rx="6.5" ry="4" fill="#fffaf0" stroke-width="1"/><path d="M-4,-25 q0,-3 2,-3 q2,-2 4,0 q2,0 2,3 z" fill="#e0a85e" stroke="#9a6a3a" stroke-width=".8"/>'
              '<path d="M-16,-17 H-6 L-7,-14 H-15 Z" fill="#f2b54a" stroke-width="1"/><rect x="-15" y="-14" width="8" height="7" fill="#fff1d2" stroke-width="1"/>'
              '<path d="M-4,0 V-9 Q0,-13 4,-9 V0 Z" fill="#b07a52" stroke-width="1"/><rect x="6" y="-16" width="9" height="6" fill="#dceefa" stroke-width="1"/>'
              '<circle cx="13" cy="-12" r="1.8" fill="#f2c14e" stroke-width=".8"/><path d="M-24,0 q-1,-7 3,-8 q4,1 3,8 z" fill="#f4ecdc" stroke-width="1"/>')
    bajital = ('<path d="M-14,0 V-37 H14 V0 Z" fill="#e9e1f7"/><path d="M-14,0 V-6 H14 V0 Z" fill="#cfd5e8" stroke-width="1"/>'
               '<path d="M-10,-39 V-47 H-6 V-41" fill="#b9a8d8"/>'
               '<path d="M-18,-36 Q-6,-40 1,-52 Q3,-58 6,-59 Q8,-56 6,-52 Q8,-45 18,-36 Q0,-34 -18,-36 Z" fill="#6aa9b8"/>'
               '<circle cx="0" cy="-27" r="5" fill="#bfeaf0"/><path d="M0,-32 V-22 M-5,-27 H5" stroke-width=".8"/>'
               '<path d="M-4,-1 V-11 Q0,-15 4,-11 V-1 Z" fill="#7a5cd6" stroke-width="1"/>'
               '<rect x="-11" y="-19" width="5" height="5" fill="#fce49a" stroke-width="1"/><rect x="6" y="-19" width="5" height="5" fill="#fce49a" stroke-width="1"/>'
               '<path d="M8,-63 a3,3 0 1 0 0,5 a2.2,2.2 0 1 1 0,-5 z" fill="#fce49a" stroke="#d1a23a" stroke-width=".8"/>'
               '<path d="M-23,3 q-1,-6 5,-6 q6,0 5,6 z" fill="#5a5a6e" stroke-width="1"/><path d="M15,3 q-1,-5 0,-9 h6 q1,4 0,9 z" fill="#c99a6a" stroke-width="1"/>')
    szabo = ('<path d="M-17,0 V-21 H17 V0 Z" fill="#fbe3ee"/><path d="M-20,-21 L-7,-33 H7 L20,-21 Q0,-20 -20,-21 Z" fill="#b97fa0"/>'
             '<path d="M-3,-24 V-28 Q0,-31 3,-28 V-24 Z" fill="#dceefa" stroke-width=".8"/>'
             '<path d="M-18,-19 H13 L12,-15 H-17 Z" fill="url(#csikTk)" stroke-width="1"/>'
             '<rect x="-16" y="-14" width="15" height="9" fill="#eef6fc" stroke-width="1"/><path d="M-10,-6 q-1,-5 1,-6 q2,1 1,6 z" fill="#f4a6c8" stroke-width=".7"/>'
             '<rect x="4" y="-14" width="8" height="13" rx="1" fill="#a8764f" stroke-width="1"/>'
             '<path d="M-17,-19 h-5" stroke-width="1"/><circle cx="-22" cy="-13" r="5" fill="#fffaf0" stroke-width="1"/><path d="M-24.5,-17 L-20.5,-12 M-19.5,-17 L-23.5,-12" stroke="#7a7a96" stroke-width="1.1"/><circle cx="-24" cy="-10.8" r="1.4" fill="none" stroke="#e0417a" stroke-width=".9"/><circle cx="-20" cy="-10.8" r="1.4" fill="none" stroke="#e0417a" stroke-width=".9"/>')
    HAZAK = ((372, 580, malom, (358, 539, 386, 580)), (409, 577, pekseg, (392, 541, 426, 577)),
             (456, 565, bajital, (442, 506, 470, 565)), (503, 583, szabo, (486, 550, 520, 583)))
    ut_ = '<path d="M376,586 Q440,582 470,580 Q500,586 548,592" stroke="#e9d9b8" stroke-width="7" fill="none" stroke-linecap="round" opacity=".9"/>'
    arny = '<ellipse cx="445" cy="584" rx="96" ry="8" fill="#3c2a50" opacity=".1" stroke="none"/>'
    alap = arny + ut_ + '<g filter="url(#firka)" stroke="%s" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round">%s</g>' % (
        INK, "".join(rk(x, y, s) for x, y, s, _ in HAZAK))
    elo = (fust(420, 540, 3, 5, 26) +
           ''.join(('<circle cx="448" cy="518" r="2" fill="%s" stroke="#fff" stroke-width=".6" opacity="0"><animate attributeName="cy" values="518;488" dur="4s" begin="%ss" repeatCount="indefinite"/>'
                    '<animate attributeName="opacity" values="0;1;0" dur="4s" begin="%ss" repeatCount="indefinite"/></circle>') % (c, b, b) for c, b in (("#f6a5c0", 0), ("#8fd3e0", 1.3), ("#c9a8e6", 2.6))))
    def allv(r):
        x0, y0, x1, y1 = r
        return ('<g filter="url(#firka)" stroke="#7a5a3e" stroke-width="1.8" stroke-linecap="round" fill="none"><path d="M%s,%s V%s M%s,%s V%s"/>'
                '<path d="M%s,%s H%s M%s,%s H%s" stroke="#c9a27a" stroke-width="3.4"/></g>') % (
            f(x0 - 2), f(y1), f(y0 - 4), f(x1 + 2), f(y1), f(y0 - 4), f(x0 - 5), f(y1 - (y1 - y0) * .35), f(x1 + 5), f(x0 - 5), f(y1 - (y1 - y0) * .7), f(x1 + 5))
    defs = FIRKA + SZURKE + '<pattern id="csikTk" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="2" height="4" fill="#f4a6c8"/><rect x="2" width="2" height="4" fill="#fff6f9"/></pattern>'
    vb = TAJ_KEZM_DOBOZ
    rnd = Rnd(77)
    virag = ''
    for x in range(380, 524, 6):
        c = VSZ[int(rnd() * 5)]
        virag += '<circle cx="%s" cy="%s" r="%s" fill="%s" stroke="none"/>' % (f(x + rnd() * 3), f(590 + rnd() * 3), f(1.8 + rnd() * 1.2), c)
    for i, (cx, cy) in enumerate(((410, 534), (456, 498), (500, 544))):
        virag += ('<path transform="translate(%s,%s)" d="M0,-5 L1.2,-1.2 L5,0 L1.2,1.2 L0,5 L-1.2,1.2 L-5,0 L-1.2,-1.2Z" fill="#fff6c2" stroke="#e3a92a" stroke-width=".8" opacity="0">'
                  '<animate attributeName="opacity" values="0;1;0" dur="%ss" begin="%ss" repeatCount="indefinite"/></path>') % (cx, cy, 2.6 + i * .7, i * .9)
    irj("vilag", "kezmuvesek-kesz", vb, defs, alap + elo)
    irj("vilag", "kezmuvesek-viragos", vb, defs, alap + elo + virag)
    irj("vilag", "kezmuvesek-epul", vb, defs, '<g opacity=".5" filter="url(#szurke)">' + alap + '</g>' + "".join(allv(r) for _, _, _, r in HAZAK[1:]))
    return {"kezmuvesek (táj)": vb}


# ══════════════════ A NAGYFA TÉR ÉS A DOMBOLDAL TÁJ-KÉPE (a világtérképen; 3. kör kiegészítés, 2026-11-24) ══════════════════
# Mint a Kézműveseké: a közelkép kicsinyített, felismerhető mása a táj 1600×900-as rendszerében, ugyanazokkal a színekkel.
# Helyi koordináták: 0,0 = a ház talppontja; a vonalvastagság a táj mértéke (nem kicsinyítjük a közelkép vonalát).
def fodor(x0, x1, y, n, fill, stroke, sw=.8, mely=.55):
    """lefelé ívelő fodor (előtető-szél): n ív x0..x1 között"""
    lep = (x1 - x0) / n
    return '<path d="M%s,%s %s Z" fill="%s" stroke="%s" stroke-width="%s"/>' % (
        f(x0), f(y), " ".join("q%s,%s %s,0" % (f(lep / 2), f(lep * mely * 2), f(lep)) for _ in range(n)), fill, stroke, sw)

def taj_allv(r):
    x0, y0, x1, y1 = r
    return ('<g filter="url(#firka)" stroke="#7a5a3e" stroke-width="1.8" stroke-linecap="round" fill="none"><path d="M%s,%s V%s M%s,%s V%s"/>'
            '<path d="M%s,%s H%s M%s,%s H%s" stroke="#c9a27a" stroke-width="3.4"/></g>') % (
        f(x0 - 2), f(y1), f(y0 - 4), f(x1 + 2), f(y1), f(y0 - 4), f(x0 - 5), f(y1 - (y1 - y0) * .35), f(x1 + 5), f(x0 - 5), f(y1 - (y1 - y0) * .7), f(x1 + 5))

def taj_csillam(pontok):
    return "".join(('<path transform="translate(%s,%s)" d="M0,-5 L1.2,-1.2 L5,0 L1.2,1.2 L0,5 L-1.2,1.2 L-5,0 L-1.2,-1.2Z" fill="#fff6c2" stroke="#e3a92a" stroke-width=".8" opacity="0">'
                     '<animate attributeName="opacity" values="0;1;0" dur="%ss" begin="%ss" repeatCount="indefinite"/></path>') % (f(x), f(y), f(2.6 + i * .7), f(i * .9))
                    for i, (x, y) in enumerate(pontok))

def taj_viragsor(rnd, x0, x1, y, lep=6):
    s, x = "", x0
    while x < x1:
        s += '<circle cx="%s" cy="%s" r="%s" fill="%s" stroke="none"/>' % (f(x + rnd() * 3), f(y + rnd() * 3), f(1.8 + rnd() * 1.2), VSZ[int(rnd() * 5)])
        x += lep
    return s

def rk(x, y, s):
    return '<g transform="translate(%s %s)">%s</g>' % (f(x), f(y), s)

def lengo(s, x, y, fok_, dur):   # ide-oda billen a (x, y) pont körül
    return '<g>%s<animateTransform attributeName="transform" type="rotate" values="%s %s %s;%s %s %s;%s %s %s" dur="%ss" repeatCount="indefinite"/></g>' % (
        s, -fok_, f(x), f(y), fok_, f(x), f(y), -fok_, f(x), f(y), dur)

def zaszlo(x, y, h, w, dur, c="#fce49a", cs="#d1a23a"):
    return ('<g transform="translate(%s %s)"><path d="M0,0 V%s" stroke="#6e4a36" stroke-width="1.2"/><path d="M0,%s l%s,%s l%s,%s Z" fill="%s" stroke="%s" stroke-width=".8">'
            '<animateTransform attributeName="transform" type="skewY" values="0;-7;0" dur="%ss" repeatCount="indefinite"/></path></g>') % (
        f(x), f(y - h), f(h), f(0), f(w), f(w * .24), f(-w), f(w * .32), c, cs, dur)


# ── Nagyfa tér ──
def t_bolt():   # 🦔 Tüske néni boltja: sárga fal, terrakotta tető, piros-fehér csíkos előtető, cégér, almás láda
    ab = lambda x: ('<rect x="%s" y="-17" width="2" height="7.5" rx=".6" fill="#8fc0a8" stroke-width=".6"/><rect x="%s" y="-17" width="8" height="7" fill="#cfe2f2" stroke-width=".9"/>'
                    '<rect x="%s" y="-17" width="2" height="7.5" rx=".6" fill="#8fc0a8" stroke-width=".6"/>') % (f(x - 2.4), f(x), f(x + 8.4))
    return ('<path d="M11,-30 V-41 H16 V-33" fill="#c98f6e"/><path d="M10,-42.5 h7 v2 h-7 z" fill="#a8705a" stroke-width=".8"/>'
            '<path d="M-20,0 V-24 H20 V0 Z" fill="url(#falTb)"/><path d="M9,-24 H20 V0 H9 Z" fill="#3c2f5e" opacity=".07" stroke="none"/>'
            '<path d="M-24.5,-23 L0,-40.5 L24.5,-23 Q0,-21.4 -24.5,-23 Z" fill="#d27a5a"/><path d="M-13,-29.5 q1.4,1 2.8,0 q1.4,1 2.8,0 q1.4,1 2.8,0 q1.4,1 2.8,0 q1.4,1 2.8,0 q1.4,1 2.8,0 q1.4,1 2.8,0 q1.4,1 2.8,0 q1.4,1 2.8,0" fill="none" stroke="#a8503a" stroke-width=".7"/>'
            '<path d="M-21.5,-38 L0,-39.5 L-3,-34 L-18.5,-24 Z" fill="#fff" opacity=".18" stroke="none"/>'
            '<rect x="-8.5" y="-34" width="17" height="5.4" rx="1.2" fill="#fffaf0" stroke-width=".8"/><g stroke="none"><circle cx="-4.6" cy="-31.3" r="1.3" fill="#e8505b"/><circle cx="0" cy="-31.3" r="1.2" fill="#f6a5c0"/><circle cx="4.6" cy="-31.3" r="1.3" fill="#a7d99a"/></g>'
            '<path d="M-21.5,-23 H21.5 L20,-20 H-20 Z" fill="url(#csikT)" stroke-width=".9"/>' + fodor(-20, 20, -20, 10, "#fff6ee", "#a83a44", .7, .45) +
            '<path d="M-5.2,0 V-10 Q0,-14 5.2,-10 V0 Z" fill="#b07a52" stroke-width="1"/><circle cx="3" cy="-6" r=".8" fill="#f2c14e" stroke="none"/>' + ab(-15.6) + ab(7.6) +
            '<path d="M-27.5,0 Q-28.2,-4 -27,-6.5 H-21.6 Q-20.8,-4 -21.6,0 Z" fill="#c99a6a" stroke-width=".9"/>'
            '<g stroke="none"><circle cx="-26" cy="-7.6" r="1.6" fill="#e8505b"/><circle cx="-23" cy="-7.8" r="1.6" fill="#f4a38c"/><circle cx="-24.4" cy="-9.4" r="1.4" fill="#e8505b"/></g>')

def t_sator():   # 🧺 a Tündérvásár piros-fehér csúcsos sátra: kosár és dobozok előtte
    return ('<path d="M-23,0 V-21 M23,0 V-21" stroke="#8a5a3a" stroke-width="1.6"/>'
            '<path d="M-24,0 L-22,-22 L0,-38 L22,-22 L24,0 Q0,1 -24,0 Z" fill="url(#csikT)"/>'
            '<path d="M0,-38 L22,-22 L24,0 Q14,.6 8,0 Z" fill="#3c2f5e" opacity=".08" stroke="none"/><path d="M-20.5,-22.6 L0,-37 L-6,-30 L-19,-22 Z" fill="#fff" opacity=".2" stroke="none"/>'
            + fodor(-22, 22, -22, 10, "#fff6ee", "#a83a44", .7, .5) +
            '<path d="M-9,0 Q-8.4,-14 0,-20.4 Q8.4,-14 9,0 Z" fill="#6e4458"/>'
            '<rect x="-6.4" y="-5.6" width="12.8" height="5.6" fill="#e9c9a0" stroke-width=".8"/><g stroke="none"><circle cx="-3.2" cy="-6.6" r="1.1" fill="#fce49a"/><circle cx="-.8" cy="-6.8" r="1.1" fill="#f6a5c0"/><circle cx="2" cy="-6.6" r="1.1" fill="#9ec9f0"/></g>'
            '<path d="M-9,0 Q-8.4,-14 0,-20.4 Q-4.4,-12.4 -6,0 Z M9,0 Q8.4,-14 0,-20.4 Q4.4,-12.4 6,0 Z" fill="url(#csikT)" stroke-width=".7"/>'
            '<circle cx="0" cy="-38.6" r="1.3" fill="#fce49a" stroke-width=".7"/>'
            '<path d="M-31,0 Q-32,-6.6 -26,-7 Q-20,-6.6 -21,0 Z" fill="#e8b27a" stroke-width=".9"/><path d="M-30.6,-2.6 H-21.4" stroke="#b5804a" stroke-width=".6"/>'
            '<g stroke="none"><circle cx="-28.2" cy="-7.8" r="1.7" fill="#e8505b"/><circle cx="-25" cy="-8.4" r="1.7" fill="#fce49a"/><circle cx="-22.4" cy="-7.4" r="1.5" fill="#a7d99a"/></g>'
            '<rect x="22.6" y="-6" width="7" height="6" fill="#e9c9a0" stroke-width=".9"/><rect x="24.4" y="-11.2" width="6.4" height="5.2" fill="#f2d5ae" stroke-width=".9"/><path d="M27.6,-11.2 v5.2" stroke="#e8505b" stroke-width=".9"/>')

def t_zsib():   # 🦊 Zsivány standja: piros ponyva, kacatpolc, kassza, róka-cégér (a farok az élő rétegben)
    return ('<path d="M-23,0 V-26 H23 V0 Z" fill="#e8cfa6"/><path d="M-15,-26 V0 M-7,-26 V0 M1,-26 V0 M9,-26 V0 M17,-26 V0" stroke="#cdae84" stroke-width=".8"/>'
            '<path d="M-24,0 V-27 M24,0 V-27" stroke="#8a5a3a" stroke-width="2"/>'
            '<rect x="-20" y="-19" width="22" height="18" fill="#d8b48a" stroke-width=".9"/><path d="M-20,-13 H2 M-20,-7 H2" stroke-width=".8"/>'
            '<g stroke-width=".6"><circle cx="-16" cy="-15.6" r="1.8" fill="#9ec9f0"/><path d="M-11.4,-13.4 l2,-3.6 l2,3.6z" fill="#fce49a"/><rect x="-4.4" y="-17.2" width="4" height="3.6" fill="#c9a8e6"/>'
            '<circle cx="-14" cy="-9.4" r="1.7" fill="#f6a5c0"/><rect x="-7" y="-10.6" width="3.4" height="3.4" rx=".6" fill="#a7d99a"/><circle cx="-11" cy="-3.6" r="1.5" fill="#f4a38c"/><path d="M-5,-1.6 l1.6,-3.2 l1.6,3.2z" fill="#9ec9f0"/></g>'
            '<rect x="6" y="-10" width="15" height="10" rx="1" fill="#c99a6a" stroke-width=".9"/><rect x="8" y="-15.4" width="10.4" height="5.4" rx="1" fill="#fffaf0" stroke-width=".8"/>'
            '<circle cx="11" cy="-12.7" r=".9" fill="#c9862a" stroke="none"/><circle cx="14" cy="-12.7" r=".9" fill="#c9862a" stroke="none"/><circle cx="17.4" cy="-9.2" r="1.5" fill="#fce49a" stroke="#d1a23a" stroke-width=".6"/>'
            '<path d="M-28.4,-26 L-22,-34.4 H22 L28.4,-26 Z" fill="#e8505b"/>'
            '<path d="M-22,-34.4 L-24.8,-26 M-13.2,-34.4 L-14.8,-26 M-4.4,-34.4 L-4.8,-26 M4.4,-34.4 L4.8,-26 M13.2,-34.4 L14.8,-26 M22,-34.4 L24.8,-26" stroke="#fff6ee" stroke-width="1.5" opacity=".85"/>'
            + fodor(-28.4, 28.4, -26, 14, "#fff6ee", "#a83a44", .7, .45) +
            '<rect x="-7" y="-41.4" width="14" height="6" rx="1.4" fill="#fffaf0" stroke-width=".8"/>'
            '<path d="M-2.4,-36.4 L-3.2,-39.8 L-1.2,-38.6 L0,-39.4 L1.2,-38.6 L3.2,-39.8 L2.4,-36.4 Q0,-35 -2.4,-36.4 Z" fill="#e8913a" stroke-width=".5"/>')

def t_szalag():   # 🎀 Szalagműhely: égszínkék ház, kerek ablak, masni, orsós oszlop (a szalagok az élő rétegben)
    ab = lambda x: '<rect x="%s" y="-17.4" width="8" height="6" fill="#d6e6f6" stroke-width=".9"/><path d="M%s,-11.4 h9.2 v-1.1 h-9.2 z" fill="#b8c6e0" stroke-width=".5"/>' % (f(x), f(x - .6))
    return ('<path d="M-19,0 V-24 H19 V0 Z" fill="url(#falTsz)"/><path d="M9,-24 H19 V0 H9 Z" fill="#3c2f5e" opacity=".07" stroke="none"/>'
            '<path d="M-23,-23 L0,-39.6 L23,-23 Q0,-21.4 -23,-23 Z" fill="#9fb8e0"/><path d="M-11,-29.6 q1.4,1 2.8,0 q1.4,1 2.8,0 q1.4,1 2.8,0 q1.4,1 2.8,0 q1.4,1 2.8,0 q1.4,1 2.8,0 q1.4,1 2.8,0 q1.4,1 2.8,0" fill="none" stroke="#6f86b8" stroke-width=".7"/>'
            '<circle cx="0" cy="-31" r="3" fill="#d6e6f6" stroke-width=".8"/><path d="M0,-34 V-28 M-3,-31 H3" stroke-width=".5"/>'
            '<path d="M-4.6,0 V-10 Q0,-14 4.6,-10 V0 Z" fill="#a8764f" stroke-width="1"/>' + ab(-15.6) + ab(7.6) +
            '<path d="M-19,-21 Q-9.6,-18.2 0,-21 Q9.6,-18.2 19,-21" fill="none" stroke="#8a6a52" stroke-width=".7"/>'
            '<path transform="translate(0 -17.4)" d="M0,0 Q-3,-2.2 -3.4,0 Q-3,2.2 0,0 Q3,-2.2 3.4,0 Q3,2.2 0,0 Z" fill="#f6a5c0" stroke="#e0417a" stroke-width=".6"/>'
            '<rect x="22.6" y="-12" width="2.6" height="12" fill="#d8b48a" stroke-width=".7"/><ellipse cx="23.9" cy="-12.6" rx="4" ry="1.7" fill="#f6a5c0" stroke-width=".7"/>')

def t_szalagok(x, y):   # a homlokzaton lengő szalagok (élő)
    s = ""
    for dx, L, c, dur, k in ((-14, 7, "#f6a5c0", 2.4, 1.4), (-9.4, 9, "#fce49a", 3.1, -1.2), (-4.6, 6, "#9ec9f0", 2.7, 1.2),
                             (5, 6.6, "#c9a8e6", 2.9, -1.2), (9.6, 8.6, "#a7d99a", 2.5, 1.4), (14, 7, "#f4a38c", 2.8, -1.4)):
        x0, y0 = x + dx, y - 19.6 + abs(dx) * .03
        s += ('<path d="M%s,%s v%s" stroke="%s" stroke-width="1.5" stroke-linecap="round" fill="none"><animate attributeName="d" values="M%s,%s v%s;M%s,%s q%s,%s 0,%s;M%s,%s v%s" dur="%ss" repeatCount="indefinite"/></path>') % (
            f(x0), f(y0), f(L), c, f(x0), f(y0), f(L), f(x0), f(y0), f(k), f(L / 2), f(L), f(x0), f(y0), f(L), dur)
    return s

def t_nagyfa(ox, oy, s, rr):
    """a közelkép nagyfája kicsinyítve (talppont: ox, oy); vissza: (törzs + pad, lombkorona)"""
    T = lambda x, y: "%s,%s" % (f(ox + (x - 800) * s), f(oy + (y - 630) * s))
    torzs = ('<path d="M%s Q%s %s L%s Q%s %s Z" fill="#a8764f" stroke-width="1.3"/>' % (T(768, 624), T(780, 520), T(788, 430), T(816, 430), T(824, 520), T(834, 624)) +
             '<path d="M%s Q%s %s M%s Q%s %s M%s Q%s %s" stroke="#8a5a3a" stroke-width="%s" fill="none"/>' % (
                 T(800, 480), T(740, 430), T(680, 400), T(806, 460), T(870, 420), T(930, 384), T(796, 450), T(770, 380), T(760, 330), f(13 * s)) +
             '<path d="M%s Q%s %s" stroke="#7f5a3e" stroke-width=".7" fill="none"/>' % (T(790, 600), T(794, 540), T(796, 470)) +
             '<path d="M%s h%s v%s h%s z" fill="#c99a6a" stroke-width="1"/><path d="M%s v%s M%s v%s" stroke="#6e4a36" stroke-width="1.3"/>' % (
                 T(712, 642), f(176 * s), f(12 * s), f(-176 * s), T(722, 654), f(14 * s), T(878, 654), f(14 * s)))
    TX = lambda x: ox + (x - 800) * s
    TY = lambda y: oy + (y - 630) * s
    korona = ""
    for cx, cy, rx, ry, c in ((690, 350, 130, 96, "#7fb877"), (910, 340, 140, 100, "#7fb877"), (800, 270, 170, 110, "#8cc685"),
                              (700, 300, 110, 80, "#9fd19a"), (900, 290, 120, 84, "#9fd19a"), (800, 230, 120, 76, "#a7d99a")):
        korona += '<path d="%s" fill="%s" stroke="#4f8a52" stroke-width="1.3" stroke-linejoin="round"/>' % (pamacs(TX(cx), TY(cy), rx * s, ry * s, 11, rr), c)
    korona += '<g fill="#c4e7a8" opacity=".75" stroke="none">' + ''.join('<path d="%s"/>' % pamacs(TX(x), TY(y), a * s, b * s, 7, rr, 1.15)
                                                                       for x, y, a, b in ((740, 208, 34, 16), (870, 250, 30, 14), (640, 300, 24, 12), (950, 300, 22, 11))) + '</g>'
    korona += ''.join('<circle cx="%s" cy="%s" r="1.5" fill="%s" stroke="#b5607e" stroke-width=".5"/>' % (f(TX(x)), f(TY(y)), c) for x, y, c in (
        (700, 260, "#f6a5c0"), (760, 320, "#fff"), (860, 220, "#f6a5c0"), (930, 330, "#fff"), (650, 360, "#f6a5c0"), (820, 380, "#fff"), (960, 260, "#f6a5c0"), (740, 190, "#fff")))
    return torzs, lengo(korona, TX(800), TY(440), 1.2, 7)

TAJ_TER_DOBOZ = (700, 560, 246, 182)
def taj_ter():
    rr = Rnd(905)
    terko = ('<ellipse cx="822" cy="716" rx="112" ry="20" fill="#d9c69e" stroke="none"/><ellipse cx="822" cy="714" rx="109" ry="18" fill="#efe0bd" stroke="#d8bf8e" stroke-width="1.6"/>'
             '<ellipse cx="808" cy="709" rx="70" ry="9" fill="#fff8e6" opacity=".4" stroke="none"/>')
    rk_ = Rnd(31)
    for i in range(26):
        x, y = 722 + rk_() * 200, 700 + rk_() * 28
        if ((x - 822) / 104) ** 2 + ((y - 714) / 15) ** 2 < 1:
            terko += '<ellipse cx="%s" cy="%s" rx="%s" ry="1.2" fill="%s" stroke="#d3bc90" stroke-width=".5"/>' % (f(x), f(y), f(2.4 + rk_() * 1.4), ["#efdfbe", "#e9d6b0", "#f4e7ca"][int(rk_() * 3)])
    torzs, korona = t_nagyfa(822, 702, .26, rr)
    HATSO = ((776, 696, t_bolt(), (752, 656, 800, 696)), (870, 696, t_sator(), (846, 658, 894, 696)))
    ELSO = ((744, 724, t_zsib(), (716, 690, 772, 724)), (902, 724, t_szalag(), (883, 685, 921, 724)))
    arny = "".join(arnyek(x, y + 1, 26, 3.4, .1) for x, y, _, _ in HATSO + ELSO)
    g = lambda s: '<g filter="url(#firka)" stroke="%s" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round">%s</g>' % (INK, s)
    alap = (terko + arny + g("".join(rk(x, y, s) for x, y, s, _ in HATSO)) + arnyek(822, 703, 34, 4, .12) + g(torzs) + g(korona) +
            g("".join(rk(x, y, s) for x, y, s, _ in ELSO)))
    farok = ('<g stroke="#a8582a" stroke-width="1" stroke-linejoin="round"><path d="M767.5,716 Q776,711.5 774.5,722 Q772.5,726 768,724 Z" fill="#e8913a"/>'
             '<path d="M774,718.6 q1,1 .6,2.6 q-1.6,-.4 -1.6,-2 z" fill="#fff6ee" stroke="none"/>'
             '<animateTransform attributeName="transform" type="rotate" values="0 768 724;10 768 724;0 768 724;0 768 724" dur="3.2s" repeatCount="indefinite"/></g>')
    elo = (farok + t_szalagok(902, 724) + zaszlo(870, 658, 9, 8, 3) +
           '<circle cx="790" cy="683" r="4" fill="#fff3b0" opacity=".45" stroke="none"><animate attributeName="opacity" values=".25;.65;.25" dur="3s" repeatCount="indefinite"/></circle>'
           '<path transform="translate(870,657.4)" d="M0,-2.4 L.6,-.6 L2.4,0 L.6,.6 L0,2.4 L-.6,.6 L-2.4,0 L-.6,-.6Z" fill="#fff" opacity="0" stroke="none"><animate attributeName="opacity" values="0;1;0" dur="2.8s" repeatCount="indefinite"/></path>')
    elo = '<g stroke="%s">%s</g>' % (INK, elo)
    virag = taj_viragsor(Rnd(78), 712, 934, 731, 6) + taj_viragsor(Rnd(79), 752, 892, 699, 9) + taj_csillam(((776, 650), (822, 566), (870, 646), (744, 682), (902, 680)))
    defs = (FIRKA + SZURKE + '<pattern id="csikT" width="5" height="5" patternUnits="userSpaceOnUse"><rect width="2.5" height="5" fill="#e8505b"/><rect x="2.5" width="2.5" height="5" fill="#fff6ee"/></pattern>'
            '<linearGradient id="falTb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbe3b8"/><stop offset="1" stop-color="#f2cd94"/></linearGradient>'
            '<linearGradient id="falTsz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eef4ff"/><stop offset="1" stop-color="#dbe6fb"/></linearGradient>')
    vb = TAJ_TER_DOBOZ
    irj("vilag", "ter-kesz", vb, defs, alap + elo)
    irj("vilag", "ter-viragos", vb, defs, alap + elo + virag)
    irj("vilag", "ter-epul", vb, defs, '<g opacity=".5" filter="url(#szurke)">' + alap + '</g>' + "".join(taj_allv(r) for _, _, _, r in HATSO + ELSO))
    return {"ter (táj)": vb}


# ── Domboldal ──
def d_torony():   # 🏰 Garas tornya: lent kő, fent fa, piros tető, óra, pénz-cégér (a zászló az élő rétegben)
    return ('<path d="M-11.2,0 V-30 H11.2 V0 Z" fill="#ddd0ba"/><path d="M-11.2,-10 H11.2 M-11.2,-20 H11.2 M-4.4,0 V-10 M4.8,0 V-10 M0,-10 V-20 M-6.8,-10 V-20 M7.6,-10 V-20 M-2.8,-20 V-30 M5.2,-20 V-30" stroke="#a8977e" stroke-width=".7"/>'
            '<path d="M-10,-30 V-52.4 H10 V-30 Z" fill="#ecd0a8"/><path d="M-6,-30.4 V-52 M-2,-30.4 V-52 M2,-30.4 V-52 M6,-30.4 V-52" stroke="#c9a27a" stroke-width=".7"/>'
            '<path d="M4.8,-30 H11.2 V0 H4.8 Z M4.4,-52.4 H10 V-30 H4.4 Z" fill="#3c2f5e" opacity=".08" stroke="none"/>'
            '<rect x="-12.4" y="-31.6" width="24.8" height="2" rx=".6" fill="#c9a27a" stroke-width=".7"/>'
            '<path d="M-13.6,-51.6 L0,-68.4 L13.6,-51.6 Q0,-50 -13.6,-51.6 Z" fill="#c96a4a"/><path d="M-6,-58 q1.2,.9 2.4,0 q1.2,.9 2.4,0 q1.2,.9 2.4,0 q1.2,.9 2.4,0 q1.2,.9 2.4,0" fill="none" stroke="#a8503a" stroke-width=".6"/>'
            '<path d="M-11.2,-52.4 L0,-67.2 L-1.6,-62.4 L-8.8,-52 Z" fill="#fff" opacity=".2" stroke="none"/>'
            '<circle cx="0" cy="-59.2" r="2.6" fill="#fffaf0" stroke-width=".7"/><path d="M0,-59.2 v-1.8 M0,-59.2 h1.3" stroke="#6e4a36" stroke-width=".5"/>'
            '<rect x="-3.6" y="-46.4" width="7.2" height="8" fill="#cfe2f2" stroke-width=".8"/><path d="M0,-46.4 V-38.4 M-3.6,-42.4 H3.6" stroke-width=".4"/>'
            '<path d="M-6.4,-38 H6.4 V-36.8 H-6.4 Z M-5.6,-36.8 V-35.2 M-2.8,-36.8 V-35.2 M0,-36.8 V-35.2 M2.8,-36.8 V-35.2 M5.6,-36.8 V-35.2" fill="#b5804a" stroke-width=".5"/>'
            '<rect x="-7.6" y="-21.6" width="2" height="4.4" rx="1" fill="#cfe2f2" stroke-width=".6"/><rect x="5.6" y="-21.6" width="2" height="4.4" rx="1" fill="#cfe2f2" stroke-width=".6"/>'
            '<path d="M-4,0 V-7.6 Q0,-12.4 4,-7.6 V0 Z" fill="#8a5a3a" stroke-width=".9"/>'
            '<path d="M-11.2,-23.6 h-4 v1.4" fill="none" stroke-width=".7"/><circle cx="-15.2" cy="-19.6" r="2.6" fill="#fce49a" stroke="#d1a23a" stroke-width=".8"/><circle cx="-15.2" cy="-19.6" r="1.3" fill="none" stroke="#d1a23a" stroke-width=".4"/>')

def d_josda():   # 🔭 Jósda: égszínkék ház, kupola, a résben a távcső (az élő rétegben), lámpás
    return ('<path d="M-21.6,0 L21.6,0 L20.6,-2.4 L-20.6,-2.4 Z" fill="#cfc6dc" stroke-width=".8"/>'
            '<rect x="-18.2" y="-15.8" width="36.4" height="13.4" fill="url(#falTj)"/><path d="M7.2,-15.8 H18.2 V-2.4 H7.2 Z" fill="#3c2f5e" opacity=".07" stroke="none"/>'
            '<path d="M-17.8,-16.8 C-17.8,-36.5 17.8,-36.5 17.8,-16.8 Z" fill="url(#kupolaT)"/>'
            '<path d="M-9,-17.2 C-10,-28 -3,-31.4 0,-31.7 M9,-17.2 C10,-28 3,-31.4 0,-31.7" stroke="#6f86b8" stroke-width=".6" fill="none"/>'
            '<path d="M-14,-20 C-14.4,-28.8 -7.2,-32.6 -2.4,-32.6 C-8.6,-30.2 -11.5,-26 -11.5,-20 Z" fill="#fff" opacity=".28" stroke="none"/>'
            '<path d="M1.9,-17.3 L2.9,-31.4 L6.7,-31 L6.2,-17.3 Z" fill="#56699a" stroke="none"/>'
            '<rect x="-20.2" y="-17.6" width="40.4" height="2" rx=".7" fill="#9fb2d6" stroke-width=".7"/>'
            '<rect x="-14.4" y="-13" width="6.7" height="5.8" fill="#fce49a" stroke-width=".7"/><rect x="7.7" y="-13" width="6.7" height="5.8" fill="#fce49a" stroke-width=".7"/>'
            '<path d="M-3.8,-2.4 V-9.6 Q0,-13.4 3.8,-9.6 V-2.4 Z" fill="#6a7fae" stroke-width=".8"/>'
            '<path d="M-22,-.5 V-12 M-22,-11 h-5.2" fill="none" stroke="#3f5f8f" stroke-width=".9"/><path d="M-28.8,-11 h2.9 l-.5,3.4 h-1.9 z" fill="#fce49a" stroke="#3f5f8f" stroke-width=".6"/>'
            + csillag4(-9.6, -26, .3) + csillag4(11.5, -24, .26))

def d_deli():   # ☀️ Déli vásár: napsárga-krém csíkos sátorsor (a nap az élő rétegben)
    def sator(x, y, w, h, pk):
        return ('<g transform="translate(%s %s)"><path d="M%s,0 V%s M%s,0 V%s" stroke="#8a5a3a" stroke-width="1.4"/>' % (f(x), f(y), f(-w + 2.8), f(-h), f(w - 2.8), f(-h)) +
                '<path d="M%s,%s L0,%s L%s,%s Q0,%s %s,%s Z" fill="url(#csikTd)"/>' % (f(-w), f(-h), f(-pk), f(w), f(-h), f(-h + 1.6), f(-w), f(-h)) +
                '<path d="M0,%s L%s,%s Q%s,%s 0,%s Z" fill="#3c2f5e" opacity=".08" stroke="none"/>' % (f(-pk), f(w), f(-h), f(w / 2), f(-h + 1.2), f(-h + 1.2)) +
                fodor(-w + 1, w - 1, -h, 7, "#f2b54a", "#b5804a", .6, .5) +
                '<rect x="%s" y="-6.8" width="%s" height="6.8" fill="#e9c9a0" stroke-width=".8"/><path d="M%s,-6.8 H%s L%s,-4.8 H%s Z" fill="#fff6e0" stroke-width=".5"/></g>' % (
                    f(-w * .72), f(w * 1.44), f(-w * .76), f(w * .76), f(w * .7), f(-w * .7)))
    return (sator(-22, 0, 16.8, 16, 27.2) + sator(18, -2, 19.2, 19.2, 32) +
            '<g stroke-width=".6"><circle cx="-28" cy="-8.4" r="1.8" fill="#e8505b"/><circle cx="-23.6" cy="-8.8" r="1.8" fill="#fce49a"/><circle cx="-19.2" cy="-8.4" r="1.8" fill="#a7d99a"/><circle cx="-15.2" cy="-8.2" r="1.4" fill="#f4a38c"/>'
            '<rect x="10" y="-14.4" width="5.2" height="5.2" fill="#f2d5ae"/><rect x="18" y="-13.6" width="6.8" height="4.4" fill="#f2d5ae"/><path d="M27.2,-9.6 q.4,-2.8 2,-2.8 q1.6,0 2,2.8 z" fill="#c9a8e6"/></g>'
            '<path d="M18,-34 V-41" stroke="#8a6a52" stroke-width=".9"/>'
            '<g transform="translate(40.6 0)"><path d="M-2.4,0 L-2.8,-3.2 H2.8 L2.4,0 Z" fill="#c98f6e" stroke-width=".6"/><path d="M0,-3.2 V-10.4" stroke="#6ea96a" stroke-width=".8"/>'
            '<circle cx="0" cy="-11.2" r="1.8" fill="#fce49a" stroke-width=".5"/><circle cx="0" cy="-11.2" r=".8" fill="#a8764f" stroke="none"/></g>')

def d_nap(x, y):   # a nagyobbik sátor oszlopán a nap: lebeg, a sugarai lassan forognak
    return ('<g transform="translate(%s %s)"><g><animateTransform attributeName="transform" type="translate" values="0,0;0,-1.2;0,0" dur="3s" repeatCount="indefinite"/>'
            '<circle r="5.2" fill="#fff6c2" opacity=".55" stroke="none"/>'
            '<g stroke="#e0a43a" stroke-width="1" stroke-linecap="round"><path d="M0,-4.6v-1.8M0,4.6v1.8M-4.6,0h-1.8M4.6,0h1.8M-3.3,-3.3l-1.3,-1.3M3.3,-3.3l1.3,-1.3M-3.3,3.3l-1.3,1.3M3.3,3.3l1.3,1.3"/>'
            '<animateTransform attributeName="transform" type="rotate" values="0;45" dur="6s" repeatCount="indefinite"/></g>'
            '<circle r="3.2" fill="#fce49a" stroke="#e0a43a" stroke-width=".8"/><path d="M-1.3,-.4 q.4,-.6 .8,0 M.5,-.4 q.4,-.6 .8,0 M-1,1 q1,.8 2,0" stroke="#b5804a" stroke-width=".4" fill="none"/></g></g>') % (f(x), f(y))

TAJ_DOMB_DOBOZ = (556, 326, 172, 136)
def taj_domboldal():
    szerp = 'M720,453 Q692,453 685,443 Q678,434 700,431 Q719,428 703,417'
    ut_ = ('<path d="%s" stroke="#d9c79c" stroke-width="8.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
           '<path d="%s" stroke="#f4e6c4" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
           '<path d="%s" stroke="#e2cfa6" stroke-width=".6" stroke-dasharray="1 4" fill="none"/>') % (szerp, szerp, szerp)
    korlat = '<g stroke="#8a6a52" stroke-width=".9"><path d="M676,441 v-4.4 M679,445 v-4.4 M675.5,438 l4,4"/></g>'
    TORONY, JOSDA, DELI = (604, 418), (694, 416), (628, 449)
    HAZAK = ((TORONY[0], TORONY[1], d_torony(), (590, 350, 618, 418)), (JOSDA[0], JOSDA[1], d_josda(), (674, 382, 714, 416)), (DELI[0], DELI[1], d_deli(), (586, 420, 664, 449)))
    kecske = ('<g transform="translate(578 438)"><path d="M-3.4,0 v2.4 M-1.6,.4 v2.4 M2,.4 v2.4 M3.6,0 v2.4" stroke="#8a7a6e" stroke-width=".8"/>'
              '<path d="M-5,-1.2 Q-5.4,-4.4 -1.4,-4.8 Q3.4,-5.6 5,-2.8 Q5.6,.6 2,1 Q-2,1.6 -4.6,.6 Z" fill="#fffaf0" stroke-width=".7"/></g>')
    kecske_fej = ('<g><g stroke="#8a7a6e" stroke-width=".6" stroke-linejoin="round"><path d="M582.6,435.6 Q584.6,432 587,433.2 Q588.2,435.6 586.2,437.2 Q584.2,437.6 583,436.8 Z" fill="#fffaf0"/>'
                  '<path d="M584.4,432.8 q-.4,-2.4 -2,-2.8 M585.6,432.8 q.4,-2.4 -.8,-3.2" fill="none" stroke="#a8977e" stroke-width=".6"/></g>'
                  '<animateTransform attributeName="transform" type="rotate" values="0 583 436;0 583 436;30 583 436;30 583 436;0 583 436" keyTimes="0;.35;.45;.8;1" dur="6s" repeatCount="indefinite"/></g>')
    arny = arnyek(604, 419, 16, 2.6, .12) + arnyek(694, 417, 24, 2.8, .12) + arnyek(630, 450, 42, 3.4, .1)
    g = lambda s: '<g filter="url(#firka)" stroke="%s" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round">%s</g>' % (INK, s)
    alap = '<g filter="url(#firka)">' + ut_ + '</g>' + korlat + arny + g(kecske + "".join(rk(x, y, s) for x, y, s, _ in HAZAK))
    tav = ('<g transform="translate(%s %s)"><g><animateTransform attributeName="transform" type="rotate" values="-14;8;-14" dur="9s" repeatCount="indefinite"/>'
           '<g transform="rotate(28)" stroke="#3f5f8f" stroke-width=".8" stroke-linejoin="round"><rect x="-1.7" y="-13" width="3.6" height="13.4" rx="1.2" fill="#6a7fae"/>'
           '<rect x="-2.2" y="-14.6" width="4.6" height="2.2" rx=".8" fill="#9fb8e0"/></g></g></g>') % (f(JOSDA[0] + 4.6), f(JOSDA[1] - 26.9))
    elo = (tav + zaszlo(TORONY[0], TORONY[1] - 68.4, 9, 8.4, 2.6) + d_nap(DELI[0] + 18, DELI[1] - 45.6) + kecske_fej +
           '<circle cx="%s" cy="%s" r="3" fill="#fff3b0" opacity=".5" stroke="none"><animate attributeName="opacity" values=".3;.75;.3" dur="2.4s" repeatCount="indefinite"/></circle>' % (f(JOSDA[0] - 27.4), f(JOSDA[1] - 9.4)))
    elo = '<g stroke="%s">%s</g>' % (INK, elo)
    virag = (taj_viragsor(Rnd(81), 586, 680, 455, 6) + taj_viragsor(Rnd(82), 590, 620, 423, 5) + taj_viragsor(Rnd(83), 670, 718, 421, 6)
             + taj_csillam(((604, 362), (694, 376), (628, 422), (576, 424))))
    defs = (FIRKA + SZURKE + '<pattern id="csikTd" width="5" height="5" patternUnits="userSpaceOnUse"><rect width="2.5" height="5" fill="#f2b54a"/><rect x="2.5" width="2.5" height="5" fill="#fff6e0"/></pattern>'
            '<linearGradient id="falTj" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e2ecfa"/><stop offset="1" stop-color="#cbdcf2"/></linearGradient>'
            '<linearGradient id="kupolaT" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#c4d4f0"/><stop offset="1" stop-color="#8fa8d8"/></linearGradient>')
    vb = TAJ_DOMB_DOBOZ
    irj("vilag", "domboldal-kesz", vb, defs, alap + elo)
    irj("vilag", "domboldal-viragos", vb, defs, alap + elo + virag)
    irj("vilag", "domboldal-epul", vb, defs, '<g opacity=".5" filter="url(#szurke)">' + alap + '</g>' + "".join(taj_allv(r) for _, _, _, r in HAZAK))
    return {"domboldal (táj)": vb}


# ══════════════════ ERDŐSZÉL (5. kör, 1. kódkör, 2026-11-24) ══════════════════
# Terv: Matekos/vilagkep-5-kor-erdoszel-osszeado-utca.html 5–8. pont (✅ mind A). Tisztás a fák között, délelőtti fény bal felülről
# (fénycsóvák a lombok közt). Lent középen érkezik az ösvény (az Odú felől), a villánál szétágazik: elöl balra a kis gombaház
# (Kitti bogyót tesz a kosárba, aztán kivesz egyet), balra hátul az öreg tölgy (Mia két kupacba rakja a makkot, át-át dob egyet;
# a harkály a törzsön), jobbra hátul az ér mögött, pallón át a nagy gombaház (Brekus átugrik a pallón, oda-vissza), elöl jobbra a rét
# a nagy levelekkel (Cincin kukucskál ki a középső mögül), hátul középen a mohás tisztás (üres telek) a gombás tuskóval. A fák közti
# résen jobbra kilátszik a patak és a falu tetői. Tas, a teknős elöl balra lassan ballag. A lakók a figurak.js mai rajza
# (terv/figurak-alak.json, terv/figura-pillanatkep.py). Házak: 5 állapot (haz_fajlok, a lakó: L) · tölgy, rét: kopar / berendezett / viragos.
_FIG = {}
def figura(nev, x, y, k, tukor=False):
    """a szereplő egész alakos rajza (figurak.js fgAlak, vidám arc): talppont x, y; k: méret (1 = 150 egység magas)"""
    if not _FIG:
        _FIG.update(json.load(open(os.path.join(ITT, "figurak-alak.json"), encoding="utf8")))
    s = re.sub(r' (class|style)="[^"]*"', "", _FIG[nev])
    return '<g transform="translate(%s %s) scale(%s%s,%s) translate(-60 -146)">%s</g>' % (f(x), f(y), "-" if tukor else "", k, k, s)

def leleg(s, dy=1.2, dur=2.6, b=0):   # a lakó finoman „lélegzik” (fel-le), hogy ne álljon mozdulatlanul
    return '<g>%s<animateTransform attributeName="transform" type="translate" values="0,0;0,-%s;0,0" dur="%ss" begin="%ss" repeatCount="indefinite"/></g>' % (s, dy, dur, b)

def makk(x, y, k=1.0, fordit=0):
    return ('<g transform="translate(%s %s) rotate(%s) scale(%s)"><ellipse cy="2" rx="5.6" ry="6.8" fill="#c98a4b" stroke="#7a4f28" stroke-width="1.3"/>'
            '<path d="M-6.6,-1.6 Q0,-8.4 6.6,-1.6 Q0,1.4 -6.6,-1.6 Z" fill="#8a5a33" stroke="#5e3b1e" stroke-width="1.1"/><path d="M0,-5.6 L1,-9" stroke="#5e3b1e" stroke-width="1.5"/>'
            '<ellipse cx="-2" cy="1" rx="1.6" ry="2.6" fill="#fff" opacity=".3"/></g>') % (f(x), f(y), fordit, k)

def kupac(x, y, n, r):
    """makk-kupac: n makk egymásra rakva (alul széles)"""
    s, sor, i = "", 0, 0
    while i < n:
        db = max(1, 3 - sor)
        for j in range(db):
            if i >= n: break
            s += makk(x + (j - (db - 1) / 2) * 10.5 + (r() - .5) * 2, y - sor * 9, .95, (r() - .5) * 30); i += 1
        sor += 1
    return s

def level(x, y, szog, hossz, szel, c, cs="#4f8a42", ers=True):
    """nagy álló levél (bojtorján-forma): talppont x, y; szog fokban (0 = fölfelé); erezettel és fénnyel"""
    L, w = hossz, szel
    d = "M0,0 C%s,%s %s,%s 0,%s C%s,%s %s,%s 0,0 Z" % (f(-w * .9), f(-L * .25), f(-w * .7), f(-L * .95), f(-L), f(w * .7), f(-L * .95), f(w * .9), f(-L * .25))
    s = '<g transform="translate(%s %s) rotate(%s)"><path d="M0,10 Q-2,4 0,0" stroke="%s" stroke-width="5" fill="none" stroke-linecap="round"/>' % (f(x), f(y), szog, cs)
    s += '<path d="%s" fill="%s" stroke="%s" stroke-width="2.4" stroke-linejoin="round"/>' % (d, c, cs)
    s += '<path d="M0,-4 C%s,%s %s,%s 0,%s Z" fill="#fff" opacity=".16" stroke="none"/>' % (f(-w * .8), f(-L * .3), f(-w * .5), f(-L * .9), f(-L * .96))
    if ers:
        s += '<path d="M0,-2 Q%s,%s 0,%s" stroke="%s" stroke-width="1.8" fill="none" opacity=".75"/>' % (f(w * .06), f(-L * .5), f(-L * .92), cs)
        for t in (.3, .5, .7):
            s += '<path d="M0,%s q%s,%s %s,%s M0,%s q%s,%s %s,%s" stroke="%s" stroke-width="1.2" fill="none" opacity=".6"/>' % (
                f(-L * t), f(-w * .3), f(-L * .05), f(-w * .55), f(-L * .14), f(-L * t), f(w * .3), f(-L * .05), f(w * .55), f(-L * .14), cs)
    return s + '</g>'

def pafrany(x, y, k, c="#7fb36e", tukor=False):
    s = '<g transform="translate(%s %s) scale(%s%s,%s)" stroke="%s" stroke-width="2" fill="none" stroke-linecap="round">' % (f(x), f(y), "-" if tukor else "", k, k, "#5f8f4e")
    for a, L in ((-38, 46), (-14, 58), (12, 54), (36, 40)):
        import math
        ex, ey = math.sin(math.radians(a)) * L, -math.cos(math.radians(a)) * L
        s += '<path d="M0,0 Q%s,%s %s,%s"/>' % (f(ex * .3), f(ey * .7), f(ex), f(ey))
        for t in (.3, .5, .7, .88):
            px, py = ex * t, ey * t
            s += '<path d="M%s,%s q-6,-2 -9,-8 M%s,%s q6,-2 9,-8" stroke="%s" stroke-width="2.6"/>' % (f(px), f(py), f(px), f(py), c)
    return s + '</g>'

def gomba(x, y, k, c="#e8913a", pottyos=False):
    s = ('<g transform="translate(%s %s) scale(%s)"><path d="M-3,0 Q-4,-7 -2.6,-10 H2.6 Q4,-7 3,0 Z" fill="#fbf2dc" stroke="%s" stroke-width="1.2"/>'
         '<path d="M-9,-9 Q-8,-19 0,-19 Q8,-19 9,-9 Q0,-7 -9,-9 Z" fill="%s" stroke="%s" stroke-width="1.3"/>') % (f(x), f(y), k, INK, c, INK)
    if pottyos:
        s += '<circle cx="-3.4" cy="-14" r="1.6" fill="#fff" stroke="none"/><circle cx="3" cy="-15.6" r="1.3" fill="#fff" stroke="none"/>'
    return s + '<path d="M-7,-12 Q-5,-17 0,-17.4" stroke="#fff" stroke-width="1.2" fill="none" opacity=".5"/></g>'

def tusko(x, y, w, h):
    return ('<g transform="translate(%s %s)"><path d="M%s,2 Q%s,-%s %s,-%s H%s Q%s,-%s %s,2 Z" fill="#b98a5a" stroke="%s" stroke-width="2"/>'
            '<ellipse cx="0" cy="-%s" rx="%s" ry="%s" fill="#e2c49a" stroke="%s" stroke-width="2"/><ellipse cx="0" cy="-%s" rx="%s" ry="%s" fill="none" stroke="#c49a6a" stroke-width="1.2"/>'
            '<path d="M%s,-%s q2,%s 0,%s M%s,-%s q-2,%s 0,%s" stroke="#8a6a4a" stroke-width="1.2" fill="none"/></g>') % (
        f(x), f(y), f(-w / 2 - 4), f(-w / 2), f(h * .4), f(-w / 2), f(h), f(w / 2), f(w / 2), f(h * .4), f(w / 2 + 4), INK,
        f(h), f(w / 2), f(w * .2), INK, f(h), f(w * .26), f(w * .1), f(-w * .2), f(h - 4), f(h * .4), f(h * .6), f(w * .25), f(h - 3), f(h * .5), f(h * .6))

def bogyo(x, y, c="#7a5ac0", r=4.4):
    return '<circle cx="%s" cy="%s" r="%s" fill="%s" stroke="#4a3a7a" stroke-width="1"/><circle cx="%s" cy="%s" r="%s" fill="#fff" opacity=".55" stroke="none"/>' % (
        f(x), f(y), r, c, f(x - r * .35), f(y - r * .35), f(r * .3))

E_ER = [(1244, 424), (1210, 446), (1152, 482), (1154, 530), (1176, 578), (1194, 626), (1168, 682), (1150, 712)]
E_TOCSA = (1150, 714, 88, 28)
E_KIS, E_NAGY, E_TOLGY, E_RET = (520, 800), (1350, 560), (330, 645), (1345, 812)
E_UTAK = [([(776, BY1 + 10), (778, 920), (780, 820), (782, 738)], 50),
          ([(782, 738), (735, 790), (700, 815)], 36),
          ([(782, 738), (640, 716), (520, 690)], 34),
          ([(782, 738), (790, 630), (800, 562)], 26),
          ([(782, 738), (912, 688), (1040, 640), (1128, 598), (1176, 578), (1224, 574), (1250, 584)], 34),
          ([(782, 738), (928, 774), (1056, 792), (1140, 806)], 34)]
E_TELEK = (800, 526, 118, 38)

def e_kisgomba():
    """🍄 a kis gombaház (oszkiv-10): krémszínű tönk-ház, piros pöttyös kalap; Kitti mellette a kosárral (L)"""
    S = ('<path d="M-46,0 C-50,-30 -45,-60 -40,-76 H40 C45,-60 50,-30 46,0 Z" fill="url(#tonkE)"/>'
         '<path d="M22,-74 H40 C45,-60 50,-30 46,0 H24 C28,-28 27,-56 22,-74 Z" fill="#3c2f5e" opacity=".08" stroke="none"/>'
         '<path d="M-36,-10 Q-38,-40 -32,-66" stroke="#fff" stroke-width="5" fill="none" opacity=".35" stroke-linecap="round"/>'
         '<path d="M-92,-64 C-92,-168 92,-168 92,-64 Q0,-46 -92,-64 Z" fill="url(#kalapE)"/>'
         '<path d="M-92,-64 Q0,-46 92,-64 Q86,-56 70,-52 Q0,-40 -70,-52 Q-86,-56 -92,-64 Z" fill="#f6d9c4"/>'
         '<path d="M-60,-50 v-6 M-40,-47 v-7 M-20,-46 v-7 M0,-45 v-7 M20,-46 v-7 M40,-47 v-7 M60,-50 v-6" stroke="#d9a890" stroke-width="1.2"/>'
         '<ellipse cx="-48" cy="-104" rx="13" ry="9" fill="#fffaf2" stroke-width="1.6"/><ellipse cx="6" cy="-132" rx="16" ry="10" fill="#fffaf2" stroke-width="1.6"/>'
         '<ellipse cx="54" cy="-98" rx="11" ry="8" fill="#fffaf2" stroke-width="1.6"/><ellipse cx="-14" cy="-92" rx="8" ry="6" fill="#fffaf2" stroke-width="1.4"/><ellipse cx="74" cy="-78" rx="6" ry="4.4" fill="#fffaf2" stroke-width="1.2"/>'
         '<path d="M-74,-82 Q-66,-130 -20,-146" stroke="#fff" stroke-width="7" fill="none" opacity=".25" stroke-linecap="round"/>'
         '<path d="M40,-140 Q86,-118 90,-70 Q60,-64 50,-110 Z" fill="#3c2f5e" opacity=".08" stroke="none"/>')
    W = '<path d="M-15,0 V-30 Q0,-48 15,-30 V0 Z" fill="#6e5a7e" opacity=".55"/><circle cx="27" cy="-44" r="10" fill="#6e5a7e" opacity=".5"/>'
    A = ('<path d="M-15,0 V-30 Q0,-48 15,-30 V0 Z" fill="#b07a52"/><path d="M-8,-2 V-32 M0,-2 V-37 M8,-2 V-32" stroke="#8a5a3a" stroke-width="1.2" opacity=".7"/>'
         '<circle cx="8" cy="-16" r="2" fill="#f2c14e" stroke-width="1"/>'
         '<circle cx="27" cy="-44" r="10" fill="#e9f4fb"/><path d="M27,-54 V-34 M17,-44 H37" stroke-width="1.4"/><path d="M21,-48 q3,-3 6,-3" stroke="#fff" stroke-width="1.6" fill="none"/>')
    K = ('<path d="M-22,4 q10,-6 22,-2 q-4,8 -22,2 Z M2,6 q10,-5 20,-1 q-5,7 -20,1 Z" fill="#d9d2c4" stroke-width="1.4"/>'
         '<path d="M-64,2 V-52" stroke="#8a6a52" stroke-width="3.4"/><path d="M-72,-52 h16 l-3,-14 h-10 z" fill="#fff3b0" stroke-width="1.6"/><path d="M-73,-66 h18 l-9,-8 z" fill="#8a6a52" stroke-width="1.4"/>'
         '<path d="M54,-128 v-22 h10 v18" fill="#c99a6a" stroke-width="1.6"/><path d="M52,-150 h14" stroke-width="2.4"/>'
         '<path d="M16,-33 h22 l-2,6 h-18 z" fill="#c99a6a" stroke-width="1.2"/>')
    KA = ('<circle cx="-64" cy="-59" r="14" fill="#fff3b0" opacity=".35" stroke="none"><animate attributeName="opacity" values=".2;.5;.2" dur="3s" repeatCount="indefinite"/></circle>' +
          fust(59, -156, 3, 4.6, 40))
    V = ('<g stroke-width="1"><circle cx="20" cy="-36" r="3" fill="#f6a5c0"/><circle cx="27" cy="-37" r="3" fill="#fce49a"/><circle cx="34" cy="-36" r="3" fill="#c9a8e6"/></g>'
         '<path d="M-46,-6 q-6,-14 2,-26 q4,-10 -2,-22" stroke="#7fae6a" stroke-width="2" fill="none"/>'
         '<circle cx="-47" cy="-20" r="3.2" fill="#f6a5c0" stroke-width=".8"/><circle cx="-44" cy="-36" r="3" fill="#fff" stroke-width=".8"/><circle cx="-48" cy="-50" r="3.2" fill="#f6a5c0" stroke-width=".8"/>')
    # Kitti (jobbra) bogyót tesz a kosárba, aztán kivesz egyet — a bogyó ívben jár a keze és a kosár között
    kosar = ('<g transform="translate(92 0)"><path d="M-16,0 L-19,-15 H19 L16,0 Z" fill="#d8b48a" stroke="%s" stroke-width="1.8" stroke-linejoin="round"/>'
             '<path d="M-17,-8 H17 M-10,-15 L-9,0 M0,-15 V0 M10,-15 L9,0" stroke="#b5804a" stroke-width="1.2"/>'
             '<path d="M-14,-15 Q0,-36 14,-15" stroke="#a8764f" stroke-width="2.6" fill="none"/>' % INK +
             bogyo(-8, -17) + bogyo(1, -19, "#8a64cc") + bogyo(9, -17) + bogyo(-3, -21, "#6a4ab0", 4) + '</g>')
    jar = ('<g><circle cx="0" cy="0" r="4.6" fill="#7a5ac0" stroke="#4a3a7a" stroke-width="1"/><circle cx="-1.4" cy="-1.4" r="1.3" fill="#fff" opacity=".6"/>'
           '<animateMotion path="M108,-30 Q102,-62 94,-24" keyPoints="0;1;1;0;0" keyTimes="0;.3;.5;.8;1" calcMode="linear" dur="5s" repeatCount="indefinite"/></g>')
    L = kosar + leleg(figura("kitti", 124, 2, .44), 1.4, 2.5) + jar
    return {"sb": (-48, -140, 48, 0), "ext": (-108, -172, 160, 14), "G": arnyek(10, 3, 104, 12), "S": S, "W": W, "A": A, "K": K, "KA": KA, "V": V, "L": L,
            "defs": '<linearGradient id="tonkE" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fffaf0"/><stop offset="1" stop-color="#f1dfbc"/></linearGradient>'
                    '<linearGradient id="kalapE" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f07a6e"/><stop offset="1" stop-color="#d9434e"/></linearGradient>'}

def e_nagygomba():
    """🍄 a nagy gombaház (oszkiv-20) az ér mögött: szélesebb, magasabb, két ablak, a kalapban padlásablak; csiga a kalapon"""
    S = ('<path d="M-64,0 C-70,-40 -63,-88 -56,-110 H56 C63,-88 70,-40 64,0 Z" fill="url(#tonkE)"/>'
         '<path d="M30,-108 H56 C63,-88 70,-40 64,0 H34 C40,-38 38,-80 30,-108 Z" fill="#3c2f5e" opacity=".08" stroke="none"/>'
         '<path d="M-50,-12 Q-54,-56 -46,-96" stroke="#fff" stroke-width="7" fill="none" opacity=".33" stroke-linecap="round"/>'
         '<path d="M-130,-96 C-132,-268 132,-268 130,-96 Q0,-70 -130,-96 Z" fill="url(#kalapN)"/>'
         '<path d="M-130,-96 Q0,-70 130,-96 Q122,-84 100,-78 Q0,-62 -100,-78 Q-122,-84 -130,-96 Z" fill="#f6d9c4"/>'
         '<path d="M-90,-75 v-8 M-60,-71 v-9 M-30,-69 v-9 M0,-68 v-9 M30,-69 v-9 M60,-71 v-9 M90,-75 v-8" stroke="#d9a890" stroke-width="1.3"/>'
         '<ellipse cx="-70" cy="-150" rx="19" ry="13" fill="#fffaf2" stroke-width="1.8"/><ellipse cx="62" cy="-176" rx="16" ry="11" fill="#fffaf2" stroke-width="1.6"/>'
         '<ellipse cx="96" cy="-118" rx="13" ry="9" fill="#fffaf2" stroke-width="1.6"/><ellipse cx="-104" cy="-108" rx="9" ry="6.4" fill="#fffaf2" stroke-width="1.4"/>'
         '<ellipse cx="-30" cy="-206" rx="12" ry="8" fill="#fffaf2" stroke-width="1.4"/><ellipse cx="22" cy="-118" rx="9" ry="6" fill="#fffaf2" stroke-width="1.3"/>'
         '<path d="M-108,-122 Q-96,-196 -30,-222" stroke="#fff" stroke-width="9" fill="none" opacity=".24" stroke-linecap="round"/>'
         '<path d="M60,-208 Q124,-176 128,-104 Q86,-96 74,-160 Z" fill="#3c2f5e" opacity=".08" stroke="none"/>')
    W = ('<path d="M-18,0 V-38 Q0,-60 18,-38 V0 Z" fill="#6e5a7e" opacity=".55"/><circle cx="-40" cy="-62" r="12" fill="#6e5a7e" opacity=".5"/>'
         '<circle cx="40" cy="-62" r="12" fill="#6e5a7e" opacity=".5"/><circle cx="0" cy="-150" r="13" fill="#6e5a7e" opacity=".45"/>')
    A = ('<path d="M-18,0 V-38 Q0,-60 18,-38 V0 Z" fill="#a8764f"/><path d="M-9,-2 V-42 M0,-2 V-48 M9,-2 V-42" stroke="#8a5a3a" stroke-width="1.3" opacity=".7"/>'
         '<circle cx="10" cy="-20" r="2.4" fill="#f2c14e" stroke-width="1"/>' +
         "".join('<circle cx="%d" cy="-62" r="12" fill="#e9f4fb"/><path d="M%d,-74 V-50 M%d,-62 H%d" stroke-width="1.4"/><path d="M%d,-66 q3,-4 7,-4" stroke="#fff" stroke-width="1.8" fill="none"/>' % (
             x, x, x - 12, x + 12, x - 7) for x in (-40, 40)) +
         '<circle cx="0" cy="-150" r="13" fill="#fce49a"/><path d="M0,-163 V-137 M-13,-150 H13" stroke-width="1.4"/>')
    K = ('<path d="M-26,6 q12,-7 26,-2 q-5,9 -26,2 Z M4,8 q12,-6 24,-1 q-6,8 -24,1 Z" fill="#d9d2c4" stroke-width="1.4"/>'
         '<path d="M84,2 V-60" stroke="#8a6a52" stroke-width="3.6"/><path d="M75,-60 h18 l-3,-16 h-12 z" fill="#fff3b0" stroke-width="1.6"/><path d="M73,-76 h22 l-11,-9 z" fill="#8a6a52" stroke-width="1.4"/>'
         '<path d="M-82,-206 v-26 h12 v22" fill="#c99a6a" stroke-width="1.6"/><path d="M-84,-232 h16" stroke-width="2.6"/>'
         '<path d="M-54,-48 h28 l-2,6 h-24 z M26,-48 h28 l-2,6 h-24 z" fill="#c99a6a" stroke-width="1.2"/>'
         '<ellipse cx="-90" cy="4" rx="20" ry="7" fill="#8fd07a" stroke="#4f8a42" stroke-width="1.4"/><path d="M-90,4 l14,-5" stroke="#4f8a42" stroke-width="1.2"/>')
    csiga = ('<g><g transform="translate(-6 -238)"><path d="M-10,0 Q-12,-4 -6,-5 H10 Q14,-3 12,0 Z" fill="#e8d6b0" stroke="%s" stroke-width="1.3"/>'
             '<circle cx="-1" cy="-9" r="8" fill="#d99a6a" stroke="%s" stroke-width="1.4"/><path d="M-1,-9 m-4,0 a4,4 0 1 1 4,4" fill="none" stroke="%s" stroke-width="1.1"/>'
             '<path d="M10,-4 l3,-7 M12,-3 l5,-5" stroke="%s" stroke-width="1.1"/></g>'
             '<animateTransform attributeName="transform" type="translate" values="0,0;34,4;0,0" dur="40s" repeatCount="indefinite"/></g>') % (INK, INK, INK, INK)
    KA = ('<circle cx="84" cy="-67" r="15" fill="#fff3b0" opacity=".35" stroke="none"><animate attributeName="opacity" values=".2;.5;.2" dur="3.4s" repeatCount="indefinite"/></circle>' +
          fust(-76, -240, 3, 5, 46) + csiga)
    V = ('<g stroke-width="1">' + "".join('<circle cx="%d" cy="-50" r="3.2" fill="%s"/>' % (x + dx, c) for x in (-40, 40) for dx, c in ((-8, "#f6a5c0"), (0, "#fce49a"), (8, "#c9a8e6"))) + '</g>'
         '<path d="M-64,-6 q-7,-18 2,-32 q5,-12 -2,-28 q-4,-14 4,-26" stroke="#7fae6a" stroke-width="2" fill="none"/>'
         '<circle cx="-66" cy="-24" r="3.4" fill="#f6a5c0" stroke-width=".8"/><circle cx="-62" cy="-44" r="3.2" fill="#fff" stroke-width=".8"/><circle cx="-66" cy="-66" r="3.4" fill="#f6a5c0" stroke-width=".8"/><circle cx="-60" cy="-86" r="3" fill="#fce49a" stroke-width=".8"/>')
    return {"sb": (-66, -226, 66, 0), "ext": (-142, -262, 146, 16), "G": arnyek(10, 4, 140, 15), "S": S, "W": W, "A": A, "K": K, "KA": KA, "V": V,
            "defs": '<linearGradient id="tonkE" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fffaf0"/><stop offset="1" stop-color="#f1dfbc"/></linearGradient>'
                    '<linearGradient id="kalapN" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e46a6a"/><stop offset="1" stop-color="#c63c4c"/></linearGradient>'}

ALLAPOT3 = ["kopar", "berendezett", "viragos"]
def hely3_fajlok(mappa, nev, alap, vb_helyi, defs, alapr, bere, virag, lako, seed):
    """a nem-ház hely 3 állapota: kopar = alap + lakó · berendezett = + berendezés · viragos = + virágok, csillám"""
    bx, by = alap
    vb = (bx + vb_helyi[0], by + vb_helyi[1], vb_helyi[2] - vb_helyi[0], vb_helyi[3] - vb_helyi[1])
    for a in ALLAPOT3:
        t = alapr(a)
        if a != "kopar": t += bere
        if a == "viragos": t += virag
        t += lako(a)
        irj(mappa, nev + "-" + a, vb, FIRKA + defs, '<g transform="translate(%s,%s)">%s</g>' % (f(bx), f(by), t))
    return vb

def e_tolgy():
    """🌳 az öreg tölgy (bontas-felmondas): göcsörtös törzs, gyökerek, odú; Mia két kupacba rakja a makkot, át-át dob egyet"""
    r = Rnd(611)
    torzs = ('<path d="M-30,-8 Q-70,-6 -98,10 Q-70,2 -40,4 Z M34,-6 Q76,-6 106,12 Q74,4 40,6 Z M-12,0 Q-24,10 -44,18 Q-20,12 -2,4 Z" fill="#8a5e40" stroke="%s" stroke-width="2.4" stroke-linejoin="round"/>' % INK +
             '<path d="M-64,6 Q-40,-2 -34,-44 Q-30,-130 -40,-236 L42,-236 Q30,-130 36,-44 Q42,-2 72,6 Q0,16 -64,6 Z" fill="url(#kereg)" stroke="%s" stroke-width="2.6" stroke-linejoin="round"/>' % INK +
             '<path d="M14,-236 L42,-236 Q30,-130 36,-44 Q42,-2 72,6 Q40,10 20,8 Q24,-60 14,-236 Z" fill="#3c2f5e" opacity=".12" stroke="none"/>'
             '<path d="M-24,-20 Q-30,-90 -24,-200" stroke="#c9a07a" stroke-width="6" fill="none" opacity=".45" stroke-linecap="round"/>'
             '<g stroke="#6e4630" stroke-width="1.6" fill="none" opacity=".7"><path d="M-14,-30 q-4,-30 2,-56 q4,-24 -2,-50"/><path d="M6,-20 q4,-36 -2,-70"/><path d="M22,-60 q-3,-40 4,-80 q3,-30 -2,-60"/>'
             '<path d="M-26,-120 q-2,-26 4,-50"/><path d="M-8,-176 q3,-20 -2,-42"/></g>'
             '<ellipse cx="6" cy="-150" rx="17" ry="25" fill="#4a3428" stroke="%s" stroke-width="2"/><path d="M-8,-168 Q6,-180 20,-166" stroke="#c9a07a" stroke-width="3" fill="none"/>' % INK +
             '<path d="M-30,-206 Q-92,-248 -134,-306" stroke="%s" stroke-width="22" fill="none" stroke-linecap="round"/><path d="M-30,-206 Q-92,-248 -134,-306" stroke="#8a5e40" stroke-width="17" fill="none" stroke-linecap="round"/>'
             '<path d="M30,-196 Q92,-236 144,-296" stroke="%s" stroke-width="22" fill="none" stroke-linecap="round"/><path d="M30,-196 Q92,-236 144,-296" stroke="#7d5438" stroke-width="17" fill="none" stroke-linecap="round"/>'
             '<path d="M-118,-262 Q-150,-250 -168,-226" stroke="%s" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M-118,-262 Q-150,-250 -168,-226" stroke="#8a5e40" stroke-width="8" fill="none" stroke-linecap="round"/>') % (INK, INK, INK)
    korona = ""
    for cx, cy, rx, ry, n, c in ((-128, -282, 100, 76, 9, "#7fbf7a"), (128, -290, 104, 78, 9, "#76b672"), (0, -330, 176, 118, 13, "#86c47c"),
                                 (-30, -410, 116, 72, 10, "#8fcb84"), (-150, -330, 64, 52, 7, "#8fcb84"), (70, -404, 84, 58, 8, "#86c47c")):
        korona += '<path d="%s" fill="%s"/>' % (pamacs(cx, cy, rx, ry, n, r), c)
    korona += '<path d="%s" fill="#3c2f5e" opacity=".09" stroke="none"/>' % pamacs(110, -284, 96, 64, 8, r)
    korona += '<path d="%s" fill="#3c2f5e" opacity=".07" stroke="none"/>' % pamacs(10, -246, 150, 36, 9, r)
    for cx, cy, rx, ry, op in ((-70, -400, 60, 34, .32), (-150, -320, 34, 24, .28), (-10, -360, 50, 30, .2), (60, -430, 36, 20, .25)):
        korona += '<path d="%s" fill="#fff" opacity="%s" stroke="none"/>' % (pamacs(cx, cy, rx, ry, 7, r, 1.2), op)
    for i in range(16):   # makkok a lombban
        korona += makk(-150 + r() * 300, -250 - r() * 150, .8, (r() - .5) * 40)
    fold = ('<ellipse cx="10" cy="6" rx="150" ry="22" fill="#3c2a50" opacity=".14" stroke="none"/>'
            '<ellipse cx="40" cy="4" rx="140" ry="16" fill="#d9c59a" opacity=".55" stroke="none"/>')
    lev = "".join('<path transform="translate(%s %s) rotate(%d)" d="M0,0 q4,-5 8,0 q-4,5 -8,0 Z" fill="%s" stroke="none"/>' % (
        f(-120 + r() * 300), f(-2 + r() * 14), int(r() * 180), ["#e8b878", "#d9a05a", "#a7d99a"][int(r() * 3)]) for _ in range(14))
    def alapr(a):
        k = kupac(48, -2, 3 if a == "kopar" else 6, Rnd(5)) + kupac(132, -2, 2 if a == "kopar" else 5, Rnd(6))
        return fold + lev + fok(torzs + korona) + k
    bere = (fok('<path d="M-6,-128 V-160 Q6,-178 18,-160 V-128 Z" fill="#c98a5a"/><circle cx="13" cy="-144" r="1.8" fill="#f2c14e"/>'
                '<path d="M-10,-126 h32" stroke="#8a5e40" stroke-width="3"/>'
                # kötélhinta a bal ágon
                '<path d="M-112,-270 V-118 M-84,-252 V-114" stroke="#a8764f" stroke-width="2"/><path d="M-120,-118 h44 v-6 h-44 z" fill="#c99a6a"/>'
                # kosár makkal a bal gyökérnél
                '<g transform="translate(-74 2)"><path d="M-14,0 L-16,-13 H16 L14,0 Z" fill="#d8b48a"/><path d="M-15,-7 H15" stroke="#b5804a" stroke-width="1.2"/>'
                '<path d="M-12,-13 Q0,-30 12,-13" stroke="#a8764f" stroke-width="2.4" fill="none"/></g>', 2) +
            makk(-80, -15, .8) + makk(-70, -16, .8, 20) +
            '<g transform="translate(16 -166)"><path d="M0,0 v8" stroke="#6e4630" stroke-width="1.4"/><path d="M-5,8 h10 l-2,9 h-6 z" fill="#fff3b0" stroke="%s" stroke-width="1.2"/>'
            '<circle cx="0" cy="13" r="9" fill="#fff3b0" opacity=".3" stroke="none"><animate attributeName="opacity" values=".15;.45;.15" dur="3s" repeatCount="indefinite"/></circle></g>' % INK +
            gomba(-30, 14, 1.1, "#e8913a") + gomba(-18, 16, .8, "#f0a54a"))
    rv = Rnd(612)
    virag = ""
    for i in range(30):   # virágkoszorú a gyökerek körül
        import math
        a = i / 30 * math.pi; x = math.cos(a) * 150 + 20; y = 8 + math.sin(a) * 10 - (rv() * 4)
        virag += '<circle cx="%s" cy="%s" r="%s" fill="%s" stroke="%s" stroke-width=".6"/>' % (f(x), f(y), f(2.6 + rv() * 1.6), VSZ[int(rv() * 5)], INK)
    virag += "".join('<circle cx="%s" cy="%s" r="2.8" fill="%s" stroke="%s" stroke-width=".6"/>' % (f(-112 + (i % 2) * 28), f(-250 + i * 18), VSZ[i % 5], INK) for i in range(7))
    virag += taj_csillam(((-120, -360), (0, -440), (110, -330), (-40, -300), (150, -260)))
    def lako(a):
        dob = ('<g>' + makk(0, 0) + '<animateMotion path="M54,-20 Q92,-82 128,-22" keyPoints="0;1;1;0;0" keyTimes="0;.32;.5;.82;1" calcMode="linear" dur="5.2s" repeatCount="indefinite"/></g>')
        return leleg(figura("mia", 90, 2, .42), 1.4, 2.6) + dob
    return alapr, bere, virag, lako

def e_ret():
    """🍃 a rét (bujocska-ret): nagy zöld levelek a dombocskán; a középső mögül Cincin kukucskál ki"""
    r = Rnd(721)
    fold = ('<ellipse cx="0" cy="8" rx="182" ry="42" fill="#3c2a50" opacity=".08" stroke="none"/>'
            '<path d="M-182,14 Q-150,-24 -40,-30 Q90,-34 186,10 Q0,40 -182,14 Z" fill="#bfe3ad" stroke="%s" stroke-width="2"/>'
            '<path d="M-140,-6 Q-80,-26 0,-26" stroke="#fff" stroke-width="5" fill="none" opacity=".3" stroke-linecap="round"/>') % INK
    fu = fucsomok(r, 40, -170, 170, -24, 14, c="#7fae6a")
    kozep = level(-6, 6, -6, 150, 50, "#7cc46a")
    bal = level(-92, 10, -34, 104, 40, "#8fd07a")
    def alapr(a):
        return fold + fu
    jobb = level(74, 12, 32, 118, 44, "#9ad986") + level(-150, 16, -62, 70, 30, "#a6dc90") + level(150, 16, 64, 74, 30, "#8fd07a")
    bere = ('<g stroke="%s" stroke-width="1.6">' % INK +
            ''.join('<ellipse cx="%d" cy="%d" rx="%d" ry="5" fill="#e3dccb"/>' % (x, y, rx) for x, y, rx in ((-200, 30, 12), (-178, 24, 10), (-160, 30, 11))) + '</g>' +
            ''.join('<g transform="translate(%d %d)" stroke="#4f8a42" stroke-width="1" fill="#9ad986"><circle cx="-3" cy="-2" r="3"/><circle cx="3" cy="-2" r="3"/><circle cx="0" cy="-6" r="3"/></g>' % (x, y)
                    for x, y in ((-60, 22), (40, 24), (120, 20), (-130, 22))) +
            gomba(110, 22, .9, "#e8505b", True))
    rv = Rnd(722)
    virag = "".join('<g transform="translate(%s %s)"><path d="M0,0 v-14" stroke="#6f9e5e" stroke-width="1.6"/><circle cy="-16" r="%s" fill="%s" stroke="%s" stroke-width=".7"/><circle cy="-16" r="1.6" fill="#f2c14e" stroke="none"/></g>' % (
        f(-170 + rv() * 340), f(14 + rv() * 14), f(3.4 + rv() * 1.4), ["#f6a5c0", "#fce49a", "#fff", "#f4a6c8"][i % 4], INK) for i in range(18))
    virag += taj_csillam(((-90, -110), (60, -150), (150, -60), (-150, -50)))
    def lako(a):
        # Cincin a középső levél MÖGÖTT: kikukucskál balra, aztán vissza
        cin = ('<g><g transform="translate(-6 6)">' + figura("cincin", 0, 0, .36) + '</g>'
               '<animateTransform attributeName="transform" type="translate" values="0,6;0,6;-46,-2;-46,-2;0,6" keyTimes="0;.4;.5;.8;.9" dur="6.4s" repeatCount="indefinite"/></g>')
        return cin
    return alapr, bere, virag, lako, kozep, bal, jobb

def e_tas():
    """🐢 Tas, a teknős: elöl balra nagyon lassan ballag oda-vissza (díszlet-fájl; koppintásra: „Lassan járj, tovább érsz!”)"""
    return ('<g transform="translate(190 852)"><g>' + arnyek(0, 0, 26, 4, .14) +
            '<g><g>' + figura("tas", 0, 2, .36) +
            '<animateTransform attributeName="transform" type="scale" values="1,1;-1,1" keyTimes="0;.5" calcMode="discrete" dur="70s" repeatCount="indefinite"/></g>'
            '<animateTransform attributeName="transform" type="translate" values="0,0;0,-1;0,0" dur="1.6s" repeatCount="indefinite"/></g>'
            '<animateTransform attributeName="transform" type="translate" values="0,0;108,0;108,0;0,0;0,0" keyTimes="0;.46;.5;.96;1" dur="70s" repeatCount="indefinite"/></g></g>')

def e_harkaly(x, y):
    """🐦 a harkály a tölgy törzsén: kopog (a feje előre-hátra billen)"""
    fej = ('<g><circle cx="7" cy="-26" r="7" fill="#f4f0f6" stroke="%s" stroke-width="1.5"/><path d="M2,-31 Q7,-37 12,-30 Q8,-29 2,-31 Z" fill="#e8505b" stroke="%s" stroke-width="1"/>'
           '<path d="M13,-26 l9,1.4 l-9,1.6 Z" fill="#6e6a86" stroke="%s" stroke-width=".8"/><circle cx="9" cy="-27" r="1.4" fill="#3c2f5e"/>'
           '<animateTransform attributeName="transform" type="rotate" values="0 4 -22;-16 4 -22;0 4 -22;-16 4 -22;0 4 -22;0 4 -22" keyTimes="0;.08;.16;.24;.32;1" dur="2.6s" repeatCount="indefinite"/></g>') % (INK, INK, INK)
    return ('<g transform="translate(%s %s)"><path d="M-4,-2 L-10,10 L-2,6 Z" fill="#3c3c4a" stroke="%s" stroke-width="1"/>'
            '<path d="M-6,0 Q-10,-14 -2,-24 Q6,-26 8,-18 Q8,-6 -6,0 Z" fill="#3c3c4a" stroke="%s" stroke-width="1.4"/>'
            '<path d="M-5,-6 Q-6,-14 -1,-19" stroke="#fff" stroke-width="2.4" fill="none" stroke-dasharray="3 2.4"/>'
            '<path d="M2,-12 q4,2 6,6" stroke="%s" stroke-width="1.4" fill="none"/>' % (f(x), f(y), INK, INK, INK) + fej + '</g>')

E_HARKALY = (296, 474)
def erdoszel():
    M = "erdoszel"
    r = Rnd(517)
    er_q = ivpontok(E_ER, 10)
    utak_q = [(ivpontok(p, 10), w) for p, w in E_UTAK]
    def uton(x, y, plusz=0):
        return any(tav_vonal(q, x, y) < w / 2 + 6 + plusz for q, w in utak_q)
    def vizben(x, y, plusz=0):
        tx, ty, rx, ry = E_TOCSA
        return tav_vonal(er_q, x, y) < 22 + plusz or ((x - tx) / (rx + plusz)) ** 2 + ((y - ty) / (ry + plusz)) ** 2 < 1
    def telekben(x, y):
        tx, ty, rx, ry = E_TELEK
        return ((x - tx) / rx) ** 2 + ((y - ty) / ry) ** 2 < 1

    # ég: halvány, zöldes alj (a lombok szűrik), délelőtti nap bal fent
    eg = ('<rect x="%d" y="%d" width="%d" height="%d" fill="url(#eg)"/>'
          '<circle cx="170" cy="80" r="280" fill="url(#napfeny)"/><circle cx="170" cy="80" r="40" fill="#fff6cf"/>') % (BX0, BY0, BX1 - BX0, BY1 - BY0)
    eg += '<g opacity=".55">' + felho(560, 30, 1.2, .7) + felho(1180, 10, 1.4, .6) + felho(1880, 60, 1.2, .7) + '</g>'
    irj(M, "eg", KIFESTVE, '<linearGradient id="eg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c8e2f2"/><stop offset=".42" stop-color="#e4f0e6"/><stop offset=".6" stop-color="#eef5e0"/><stop offset="1" stop-color="#eef5e0"/></linearGradient>'
        '<radialGradient id="napfeny"><stop offset="0" stop-color="#fff8d8" stop-opacity=".95"/><stop offset="1" stop-color="#fff8d8" stop-opacity="0"/></radialGradient>', eg)

    # távoli: a résen át (jobbra) a hegy, a falu tetői, a patak; körben a hátsó erdőfal
    tav = ('<g filter="url(#firka)"><path d="M1200,400 L1330,250 L1420,300 L1520,214 L1630,300 L1760,230 L1900,320 L2170,280 L2170,420 L1200,420 Z" fill="#ddd6ee" stroke="#bdb2d8" stroke-width="2"/>'
           '<path d="M1500,232 L1520,214 L1542,236 L1528,232 L1520,242 L1510,232 Z M1742,246 L1760,230 L1780,250 L1768,246 L1760,254 Z" fill="#fff"/>'
           '<path d="M1220,408 Q1380,372 1560,380 Q1700,386 1900,370 V430 H1220 Z" fill="#d8ecc6" stroke="#bcd8a8" stroke-width="2"/></g>'
           '<g filter="url(#firka)" stroke="#8a7a9a" stroke-width="1.5" opacity=".85">')
    for i, (x, fal, teto) in enumerate(((1430, "#f9d6de", "#c96a4a"), (1472, "#fff1d6", "#5fb3ad"), (1516, "#dfeccd", "#a8683e"), (1560, "#fde9b0", "#c96a4a"), (1604, "#efe2f6", "#9f86c9"))):
        y = 398 - (i % 2) * 6
        tav += '<rect x="%d" y="%d" width="30" height="22" fill="%s"/><path d="M%d,%d L%d,%d L%d,%d Z" fill="%s"/>' % (x, y - 22, fal, x - 4, y - 20, x + 15, y - 38, x + 34, y - 20, teto)
        if i % 2 == 0:
            tav += '<rect x="%d" y="%d" width="8" height="7" fill="#fce49a" stroke="none"/>' % (x + 11, y - 15)
    tav += ('</g><path d="M1210,418 Q1340,404 1460,412 Q1560,418 1700,408 V428 Q1560,436 1420,430 Q1300,426 1210,432 Z" fill="#a9d6ef" stroke="#7fb3d6" stroke-width="2"/>'
            '<path d="M1300,420 h40 M1450,424 h30 M1580,418 h36" stroke="#fff" stroke-width="2" opacity=".8"/>')
    tav += '<g filter="url(#firka)">'
    x = BX0   # a hátsó erdőfal (a résnél nyitva)
    while x < BX1:
        if not (1236 < x < 1660):
            tav += fenyo(round(x), round(436 + r() * 14), 90 + r() * 50, ["#8fb89a", "#7fae8c", "#9cc4a2"][int(r() * 3)])
        x += 34 + r() * 26
    x = BX0 + 10
    while x < BX1:
        if not (1226 < x < 1640):
            tav += lomb(round(x), round(442 + r() * 10), 36 + r() * 16, ["#9cc79a", "#8fbf8f", "#a7cfa2"][int(r() * 3)])
        x += 70 + r() * 50
    tav += '</g>'
    irj(M, "tavoli", KIFESTVE, FIRKA, tav)

    # közép: a tisztás, az ösvények, az ér + tócsa + palló, a mohás tisztás (üres telek), a gombás tuskó, a sövény az ér túlsó partján,
    # az erdő a két szélen (a kifestett részen is), páfrány, gomba, fű, virág
    koz = ('<rect x="%d" y="430" width="%d" height="%d" fill="url(#ret)"/>' % (BX0, BX1 - BX0, BY1 - 430) +
           '<path d="M%d,446 Q300,428 700,450 Q1100,474 1500,440 T%d,446 V500 H%d Z" fill="#c8e6b6"/>' % (BX0, BX1, BX0))
    koz += '<g filter="url(#firka)">'
    for x, y, rr in ((180, 486, 30), (470, 470, 26), (640, 474, 30), (1000, 470, 30), (1110, 486, 26), (60, 520, 30), (1700, 500, 34), (1880, 520, 36), (2060, 500, 34),
                     (-120, 500, 34), (-320, 520, 36), (-480, 500, 34)):
        koz += lomb(x, y, rr, ["#8fc98a", "#9fd19a", "#7fbf86", "#a7d99a"][int(r() * 4)])
    for x, y, h in ((880, 470, 100), (1150, 460, 96), (360, 468, 90), (560, 462, 86), (1600, 470, 110), (1760, 520, 120)):
        koz += fenyo(x, y, h, ["#7fb58a", "#8fc09a", "#74a984"][int(r() * 3)])
    koz += '</g>'
    # ösvények (döngölt föld, kicsit kopott szél)
    for p, w in E_UTAK:
        d = sima(p)
        koz += ('<path d="%s" stroke="#d9c49a" stroke-width="%s" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
                '<path d="%s" stroke="#efdfba" stroke-width="%s" fill="none" stroke-linecap="round" stroke-linejoin="round"/>') % (d, f(w + 8), d, f(w))
    # az ér a tócsáig (a fák közül bukkan elő), nád, kövek
    tx, ty, rx, ry = E_TOCSA
    ed = sima(E_ER)
    koz += ('<path d="%s" stroke="#a6cf92" stroke-width="54" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' % ed +
            '<ellipse cx="%d" cy="%d" rx="%d" ry="%d" fill="#a6cf92"/>' % (tx, ty + 3, rx + 12, ry + 10) +
            '<path d="%s" stroke="#7fb3d6" stroke-width="40" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' % ed +
            '<path d="%s" stroke="url(#vizE)" stroke-width="34" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' % ed +
            '<ellipse cx="%d" cy="%d" rx="%d" ry="%d" fill="url(#vizE)" stroke="#7fb3d6" stroke-width="3"/>' % (tx, ty, rx, ry) +
            '<ellipse cx="%d" cy="%d" rx="%d" ry="%d" fill="#fff" opacity=".22"/>' % (tx - 20, ty - 8, rx * .5, ry * .3))
    koz += '<g filter="url(#firka)">' + bokor(1236, 432, 1.5) + bokor(1270, 446, 1.1, "#7fbf86", "#9fd19a") + '</g>'
    for x, y in ((1118, 708), (1104, 720), (1188, 736), (1212, 724), (1228, 702)):
        koz += '<path d="M%d,%d q-3,-22 -1,-36 M%d,%d q2,-20 6,-30" stroke="#6f9e5e" stroke-width="2.2" fill="none"/><ellipse cx="%d" cy="%d" rx="2.6" ry="7" fill="#a8764f" stroke="none"/>' % (x, y, x + 4, y, x - 2, y - 38)
    koz += '<g stroke="%s" stroke-width="1.4">' % INK + "".join('<ellipse cx="%d" cy="%d" rx="%d" ry="%d" fill="#e3dccb"/>' % q for q in (
        (1128, 470, 9, 5), (1182, 520, 8, 4), (1210, 660, 10, 5), (1138, 650, 8, 4), (1066, 714, 10, 5))) + '</g>'
    # a palló (a ráközelítő unikornis ezen sétál át)
    koz += fok('<path d="M1128,566 L1224,558 L1226,572 L1130,580 Z" fill="#c9a77e"/><path d="M1132,578 L1226,570 L1228,586 L1134,594 Z" fill="#d6b48a"/>'
               '<path d="M1134,592 L1228,584 L1229,598 L1136,606 Z" fill="#c9a77e"/><path d="M1150,566 v40 M1206,560 v40" stroke="#8a6a4a" stroke-width="1.4" opacity=".6"/>'
               '<path d="M1124,562 v24 M1230,554 v24 M1126,598 v14 M1232,592 v14" stroke="#7a5a3e" stroke-width="5" stroke-linecap="round"/>', 2)
    # a mohás tisztás (üres telek): mohafoltok, két tuskó, páfrány; a bal tuskón a gombacsoport (díszlet)
    tx, ty, rx, ry = E_TELEK
    koz += ('<ellipse cx="%d" cy="%d" rx="%d" ry="%d" fill="#a9d495" stroke="#8fbf7a" stroke-width="2"/>' % (tx, ty, rx, ry) +
            ''.join('<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="%s" opacity=".8"/>' % (f(tx + (r() - .5) * rx * 1.4), f(ty + (r() - .5) * ry), f(10 + r() * 18), f(4 + r() * 5), ["#8fc47a", "#b9e0a0", "#7fb36e"][int(r() * 3)]) for _ in range(12)))
    koz += fok(tusko(735, 532, 34, 22) + tusko(866, 534, 28, 16), 2)
    koz += gomba(726, 512, 1.15, "#e8913a") + gomba(740, 509, .85, "#f0a54a") + gomba(749, 514, .7, "#e8913a") + gomba(870, 520, .6, "#e8505b", True)
    koz += pafrany(690, 540, .7) + pafrany(912, 540, .6, tukor=True)
    # a sövény az ér túlsó partján (a nagy gombaház kertje nem a rétre nyílik)
    koz += '<g filter="url(#firka)" stroke="%s" stroke-width="2">' % INK
    for i, x in enumerate(range(1252, 1590, 46)):
        koz += bokor(x, 690 - i * 2, 1.05 + (i % 2) * .15, "#7fbf86" if i % 2 else "#8cc47f", "#9fd19a")
    koz += '</g>'
    # az erdő a két szélen és elöl a kifestett részen
    koz += '<g filter="url(#firka)">'
    for x, y, h in ((-500, 640, 150), (-380, 720, 170), (-480, 860, 190), (-300, 900, 170), (-200, 640, 140), (-80, 580, 120), (30, 620, 130), (70, 760, 150),
                    (-120, 760, 160), (-420, 1040, 200), (-160, 1000, 170), (1560, 600, 140), (1640, 700, 160), (1720, 620, 150), (1820, 760, 180), (1960, 660, 170),
                    (2080, 800, 190), (1700, 900, 190), (1900, 960, 200), (2100, 1040, 200), (1600, 820, 150)):
        koz += fenyo(x, y, h, ["#7fb58a", "#8fc09a", "#74a984"][int(r() * 3)])
    for x, y, rr in ((-260, 760, 40), (-40, 860, 40), (1640, 860, 40), (1980, 900, 44), (2120, 700, 40)):
        koz += lomb(x, y, rr, ["#8fc98a", "#9fd19a", "#7fbf86", "#a7d99a"][int(r() * 4)])
    for x, y, s in ((140, 700, 1.1), (610, 640, .8), (980, 560, .9), (1040, 860, 1.1), (900, 880, .9), (600, 880, .9), (240, 800, 1.0), (1510, 860, 1.0), (1530, 560, .9)):
        koz += bokor(x, y, s)
    koz += '</g>'
    for x, y, k, t in ((120, 600, .9, False), (260, 740, .8, True), (660, 600, .7, False), (1000, 900, .9, True), (1480, 880, .9, False), (980, 620, .7, True), (430, 880, .8, False)):
        koz += pafrany(x, y, k, tukor=t)
    for x, y, k, c, p in ((200, 650, .9, "#e8505b", True), (214, 654, .7, "#e8505b", True), (620, 876, .8, "#e8913a", False), (1030, 700, .7, "#c9a8e6", False), (1500, 600, .8, "#e8913a", False), (960, 846, .7, "#e8505b", True)):
        koz += gomba(x, y, k, c, p)
    kihagy = lambda x, y: uton(x, y) or vizben(x, y, 12) or telekben(x, y)
    koz += fucsomok(r, 420, BX0, BX1, 470, BY1, kihagy=kihagy)
    koz += viragok(r, 150, BX0, BX1, 480, BY1, kihagy=kihagy)
    koz += ''.join('<path transform="translate(%s %s) rotate(%d)" d="M0,0 q5,-6 10,0 q-5,6 -10,0 Z" fill="%s" opacity=".85"/>' % (
        f(BX0 + r() * (BX1 - BX0)), f(480 + r() * (BY1 - 480)), int(r() * 180), ["#e8b878", "#d9a05a", "#c9d98a"][int(r() * 3)]) for _ in range(120))
    irj(M, "kozep", KIFESTVE, FIRKA + '<linearGradient id="ret" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d4ecc4"/><stop offset="1" stop-color="#b6d996"/></linearGradient>'
        '<linearGradient id="vizE" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#c4e6f4"/><stop offset="1" stop-color="#8cc6e4"/></linearGradient>', koz)

    # előtér: páfrány és fű a két alsó sarokban (a bejárat szabad), lelógó lomb a felső sarkokban
    elo = '<g filter="url(#firka)" stroke="%s" stroke-width="2" fill="#9fcf8f">' % INK
    elo += '<path d="M%d,%d L%d,930 Q-200,904 300,926 Q520,916 640,936 L650,%d Z"/>' % (BX0 - 10, BY1 + 10, BX0 - 10, BY1 + 10)
    elo += '<path d="M920,%d L930,936 Q1200,912 1500,928 Q1800,906 %d,924 L%d,%d Z"/></g>' % (BY1 + 10, BX1 + 10, BX1 + 10, BY1 + 10)
    elo += pafrany(-60, 960, 1.9) + pafrany(170, 970, 1.6, tukor=True) + pafrany(1460, 966, 1.7) + pafrany(1700, 960, 1.9, tukor=True)
    elo += '<g filter="url(#firka)" stroke="%s" stroke-width="2">' % INK + bokor(420, 960, 1.4) + bokor(1180, 960, 1.4, "#7fbf86", "#9fd19a") + '</g>'
    re_ = Rnd(91)
    for cx, cy, k in ((-420, -120, 1), (-220, -110, .9), (-20, -120, .8), (40, -100, .6), (1560, -110, .8), (1760, -120, 1), (1960, -110, .9), (2120, -100, 1)):
        elo += '<g filter="url(#firka)"><path d="%s" fill="%s" stroke="%s" stroke-width="2"/><path d="%s" fill="#fff" opacity=".18" stroke="none"/></g>' % (
            pamacs(cx, cy, 170 * k, 110 * k, 10, re_), ["#7fbf7a", "#86c47c", "#76b672"][int(re_() * 3)], INK, pamacs(cx - 30 * k, cy - 20 * k, 70 * k, 40 * k, 7, re_, 1.2))
    elo += fucsomok(Rnd(97), 140, BX0, BX1, 920, 960, c="#7fae6a", kihagy=lambda x, y: 650 < x < 920)
    irj(M, "eloter", KIFESTVE, FIRKA, elo)

    # mozgó: fénycsóvák (lüktetnek), felhők, csillogó víz az éren, lepkék, szálló levelek; fölül Brekus ugrál a pallón, madárcsapat
    csova = ''.join(('<path d="M%d,-160 L%d,-160 L%d,%d L%d,%d Z" fill="#fffbe0" opacity=".3"><animate attributeName="opacity" values=".18;.38;.18" dur="%ss" repeatCount="indefinite"/></path>') % (
        x0, x0 + w, x0 + w + dx, y1, x0 + dx, y1, dur) for x0, w, dx, y1, dur in ((60, 150, 560, 760, 9), (330, 70, 470, 700, 11), (-200, 90, 520, 720, 13)))
    csillam = ""
    for i, (x, y) in enumerate(((1196, 454), (1160, 500), (1158, 540), (1186, 610), (1186, 650), (1160, 696))):
        csillam += ('<path d="M%s,%s q-4,10 -3,22" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none" stroke-dasharray="8 26">'
                    '<animate attributeName="stroke-dashoffset" values="0;-68" dur="%ss" repeatCount="indefinite"/><animate attributeName="opacity" values=".2;.85;.2" dur="%ss" repeatCount="indefinite"/></path>') % (
            f(x), f(y), f(1.8 + (i % 3) * .3), f(2.6 + (i % 2) * .8))
    csillam += ('<ellipse cx="1130" cy="712" rx="20" ry="4" fill="none" stroke="#fff" stroke-width="2"><animate attributeName="rx" values="4;30" dur="3s" repeatCount="indefinite"/>'
                '<animate attributeName="opacity" values=".9;0" dur="3s" repeatCount="indefinite"/></ellipse>')
    also = ('<g id="also" pointer-events="none">\n' + csova + "\n<g>" + uszo_felho(400, 10, 1.0, 70, 120) + uszo_felho(1500, 40, 1.2, -60, 150) + "</g>\n" + csillam + "\n" +
            lepke(620, 620, "#f6a5c0", 14, "0,0;80,-40;160,10;60,30;0,0") + lepke(1000, 760, "#fce49a", 16, "0,0;-70,-20;-110,20;-30,30;0,0") + lepke(260, 820, "#c9a8e6", 13, "0,0;60,-24;100,6;30,20;0,0") + "\n</g>\n")
    brekus = ('<g><g>' + figura("brekus", 0, 0, .4) + '</g>'
              '<animateMotion path="M1100,606 Q1176,500 1252,592" keyPoints="0;0;1;1;0;0" keyTimes="0;.12;.34;.6;.82;1" calcMode="linear" dur="6s" repeatCount="indefinite"/></g>')
    levelek = '<g opacity=".9">' + ''.join(('<path d="M%s,%s q3,-4 6,0 q-3,4 -6,0 Z" fill="%s"><animateTransform attributeName="transform" type="translate" values="0,0;%s,%s" dur="%ss" begin="%ss" repeatCount="indefinite"/>'
                                            '<animate attributeName="opacity" values="0;1;1;0" dur="%ss" begin="%ss" repeatCount="indefinite"/></path>') % (
        f(160 + i * 210), f(240 + (i % 3) * 30), "#e8b878" if i % 2 else "#a7d99a", 30 + i * 6, 380 + i * 20, 9 + i, i * 1.7, 9 + i, i * 1.7) for i in range(6)) + '</g>'
    felso = ('<g id="felso" pointer-events="none">\n' + brekus + "\n" + csapat(-120, 120, 1, 1900, 46) + "\n" + levelek + "\n</g>")
    irj(M, "mozgo", KIFESTVE, "".join([MADAR, ULO]), also + felso, elotag="vm-")

    # díszlet-fájlok: Tas (elöl balra ballag), a harkály (a tölgy törzsén kopog)
    irj(M, "tas", (150, 796, 190, 66), FIRKA, e_tas())
    hx, hy = E_HARKALY
    irj(M, "harkaly", (hx - 16, hy - 40, 44, 54), "", e_harkaly(hx, hy))

    dob = {}
    for nev, fn, alap, sd in (("kisgomba", e_kisgomba, E_KIS, 51), ("nagygomba", e_nagygomba, E_NAGY, 52)):
        dob[nev] = haz_fajlok(M, nev, alap, fn(), sd)
    alapr, bere, virag, lako = e_tolgy()
    dob["tolgy"] = hely3_fajlok(M, "tolgy", E_TOLGY, (-232, -500, 236, 30), '<linearGradient id="kereg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#b48460"/><stop offset="1" stop-color="#8a5e40"/></linearGradient>',
                                alapr, bere, virag, lako, 61)
    alapr, bere, virag, lako, kozep_l, bal_l, jobb_l = e_ret()
    # a rét rétegei: föld → (berendezett: a többi levél) → Cincin → a középső és a bal levél elől (mögülük kukucskál)
    alap3 = lambda a: alapr(a)
    def lako3(a):
        return lako(a) + bal_l + kozep_l
    bere3 = jobb_l + bere
    dob["ret"] = hely3_fajlok(M, "ret", E_RET, (-210, -170, 210, 44), "", alap3, bere3, virag, lako3, 71)
    dob["tas"] = (150, 796, 190, 66)
    dob["harkaly"] = (hx - 16, hy - 40, 44, 54)
    return dob


# ══════════════════ AZ ERDŐSZÉL TÁJ-KÉPE (a világtérképen; 5. kör, 2026-11-24) ══════════════════
# A tisztás kicsinyített mása: balra az öreg tölgy, előtte a kis gombaház, jobbra az ér a pallóval, mögötte a nagy gombaház,
# elöl jobbra a nagy levelek. A megálló (all) a hely jobb oldalán. A vilagkep-export.py ezt a három fájlt NEM írja felül.
TAJ_ERDO_DOBOZ = (88, 572, 172, 106)
def taj_erdoszel():
    r = Rnd(311)
    tolgy = ('<path d="M-6,0 Q-4,-8 -4,-18 L4,-18 Q4,-8 7,0 Z" fill="#8a5e40"/><path d="M-8,0 q-4,0 -7,2 M8,0 q4,0 7,2" stroke="#8a5e40" stroke-width="2"/>' +
             '<path d="%s" fill="#86c47c"/><path d="%s" fill="#7fbf7a"/><path d="%s" fill="#fff" opacity=".25" stroke="none"/>' % (
                 pamacs(0, -32, 22, 16, 9, r), pamacs(10, -26, 12, 9, 6, r), pamacs(-7, -38, 9, 5, 6, r, 1.2)) +
             '<ellipse cx="1" cy="-12" rx="1.6" ry="2.4" fill="#4a3428" stroke="none"/>')
    kis = ('<path d="M-5,0 C-5.5,-3 -5,-6 -4.4,-8 H4.4 C5,-6 5.5,-3 5,0 Z" fill="#fff6e0"/><path d="M-11,-7 C-11,-19 11,-19 11,-7 Q0,-5 -11,-7 Z" fill="#e8505b"/>'
           '<circle cx="-5" cy="-11" r="1.5" fill="#fff" stroke="none"/><circle cx="2" cy="-14" r="1.7" fill="#fff" stroke="none"/><circle cx="6" cy="-10" r="1.2" fill="#fff" stroke="none"/>'
           '<path d="M-1.6,0 V-3.4 Q0,-5 1.6,-3.4 V0 Z" fill="#a8764f" stroke-width=".8"/>')
    nagy = ('<path d="M-7,0 C-7.6,-4 -7,-10 -6.2,-12 H6.2 C7,-10 7.6,-4 7,0 Z" fill="#fff6e0"/><path d="M-15,-10 C-15,-29 15,-29 15,-10 Q0,-7 -15,-10 Z" fill="#d8434e"/>'
            '<circle cx="-7" cy="-17" r="2" fill="#fff" stroke="none"/><circle cx="4" cy="-22" r="2.2" fill="#fff" stroke="none"/><circle cx="10" cy="-14" r="1.5" fill="#fff" stroke="none"/>'
            '<path d="M-2,0 V-4.6 Q0,-7 2,-4.6 V0 Z" fill="#a8764f" stroke-width=".8"/><circle cx="-4.4" cy="-7" r="1.4" fill="#e9f4fb" stroke-width=".6"/><circle cx="4.4" cy="-7" r="1.4" fill="#e9f4fb" stroke-width=".6"/>')
    ret = '<g transform="scale(.22)">' + level(-28, 0, -30, 70, 28, "#8fd07a", ers=False) + level(4, 0, -4, 88, 32, "#7cc46a", ers=False) + level(36, 0, 30, 70, 28, "#9ad986", ers=False) + '</g>'
    er = ('<path d="M186,620 Q178,636 181,650 Q186,664 180,678 Q176,688 178,694" stroke="#7fb3d6" stroke-width="7" fill="none" stroke-linecap="round"/>'
          '<path d="M186,620 Q178,636 181,650 Q186,664 180,678 Q176,688 178,694" stroke="#bfe3f3" stroke-width="4.4" fill="none" stroke-linecap="round"/>'
          '<ellipse cx="179" cy="695" rx="11" ry="3.6" fill="#bfe3f3" stroke="#7fb3d6" stroke-width="1"/>')
    pallo = '<path d="M174,659 L190,657 L190.6,661 L174.6,663 Z" fill="#d6b48a" stroke="%s" stroke-width=".8"/>' % INK
    utacska = ('<path d="M150,702 Q164,694 176,684 Q186,672 200,666 M168,700 Q188,698 208,700" stroke="#efdfba" stroke-width="3" fill="none" stroke-linecap="round" opacity=".9"/>')
    g = lambda s: '<g filter="url(#firka)" stroke="%s" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round">%s</g>' % (INK, s)
    arny = arnyek(150, 696, 60, 6, .1)
    HAZAK = ((206, 644, nagy, (196, 618, 216, 644)), (132, 672, kis, (124, 656, 140, 672)))
    # az Odú lombja (a táj elején) alul eltakarná: 22-vel feljebb, a rét az Odú jobb oldalán
    fel = lambda s: '<g transform="translate(0 -22)">%s</g>' % s
    alap = fel(arny + utacska + er + g(pallo) + g(rk(112, 684, tolgy)) + g(rk(206, 666, nagy)) + g(rk(132, 694, kis))) + g(rk(238, 672, ret))
    elo = fel(fust(198, 638, 2, 5, 12) + '<g><circle cx="0" cy="0" r="1.6" fill="#9ed686" stroke="#4f8f42" stroke-width=".6"/>'
           '<animateMotion path="M174,664 Q182,652 192,662" keyPoints="0;1;1;0;0" keyTimes="0;.3;.5;.8;1" calcMode="linear" dur="5s" repeatCount="indefinite"/></g>')
    virag = fel(taj_viragsor(Rnd(83), 96, 146, 703, 6) + taj_csillam(((112, 646), (206, 634), (132, 676)))) + taj_viragsor(Rnd(84), 226, 254, 674, 5) + taj_csillam(((244, 656),))
    defs = FIRKA + SZURKE
    vb = TAJ_ERDO_DOBOZ
    irj("vilag", "erdoszel-kesz", vb, defs, alap + elo)
    irj("vilag", "erdoszel-viragos", vb, defs, alap + elo + virag)
    irj("vilag", "erdoszel-epul", vb, defs, '<g opacity=".5" filter="url(#szurke)">' + alap + '</g>' + "".join(taj_allv(rr) for _, _, _, rr in HAZAK))
    return {"erdoszel (táj)": vb}



# ══════════════════ ÖSSZEADÓ UTCA (5. kör, 2. kódkör, 2026-11-24) ══════════════════
# Terv: Matekos/vilagkep-5-kor-erdoszel-osszeado-utca.html 1., 3., 4. pont (✅ mind A). Kanyargó falusi utca fölfelé: bal lent érkezik
# (a Nagyfa tér felől), a kanyarban kúttér, fönt a dombocskán a nagy ház. A házak kicsit össze-vissza állnak (megdőlnek, a tetőgerinc
# oldalra csúszik, más-más eresz). Vegyes utca: 3 ház (5 állapot) + 5 hely (3 állapot) + 2 halvány díszlet-ház. Minden lakó a pálya
# mozdulatát csinálja, szám és felirat nélkül.
U_SEG = [((-260, 972), None, (40, 910)), ((40, 910), (300, 850), (560, 838)), ((560, 838), (820, 826), (900, 742)),
         ((900, 742), (980, 652), (1130, 634)), ((1130, 634), (1280, 616), (1322, 520)), ((1322, 520), (1352, 452), (1418, 424))]
U_SZEL = [94, 90, 80, 68, 58, 48]           # az utca szélessége szakaszonként (fölfelé keskenyedik: messzebb van)
U_ER = [(838, 536), (890, 560), (950, 576), (1010, 572), (1070, 560), (1120, 564), (1156, 558)]   # a csobogó ér (forrás a létrás ház mögött)
U_TO = (1176, 558, 30, 11)                  # a kis tócsa az ér végén
U_KUTTER = (1040, 792, 150, 48)             # a kúttér (ellipszis)
U_MELLEK = [(1287, 572), (1330, 626), (1384, 676)]   # mellékösvény a bokros kerthez
U_LEGELO = (1222, 446, 136, 46)
U_DOMBOCSKA = (1400, 428, 200, 58)
U_FAVAGO, U_KORTE, U_LETRA, U_CSALAD, U_KERITES, U_KERT, U_NAGY = (250, 790), (622, 772), (790, 700), (1192, 842), (1210, 506), (1428, 716), (1400, 404)
U_KUT, U_TYUK, U_BOGYO = (1008, 776), (1074, 806), (900, 826)
U_KOVEK_X = (905, 950, 995, 1040, 1085)     # az ugrókövek: egyforma távolságra


def qpont(a, c, b, t):
    if c is None:
        return (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)
    return ((1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0], (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1])

def utca_pontok(n=24):
    """az utca középvonala sűrűn: [(x, y, szélesség)]"""
    q = []
    for i, (a, c, b) in enumerate(U_SEG):
        w0 = U_SZEL[i]; w1 = U_SZEL[min(i + 1, len(U_SZEL) - 1)]
        for k in range(0 if i == 0 else 1, n + 1):
            t = k / n; p = qpont(a, c, b, t)
            q.append((p[0], p[1], w0 + (w1 - w0) * t))
    return q

def utca_d(i):
    a, c, b = U_SEG[i]
    if c is None:
        return "M%s,%s L%s,%s" % (f(a[0]), f(a[1]), f(b[0]), f(b[1]))
    return "M%s,%s Q%s,%s %s,%s" % (f(a[0]), f(a[1]), f(c[0]), f(c[1]), f(b[0]), f(b[1]))

def er_y(x):
    q = ivpontok(U_ER, 16)
    return min(q, key=lambda p: abs(p[0] - x))[1]


# ── a ferde ház (közös a 3 pályás házhoz és a 2 díszlet-házhoz) ──
def tetosor(cx, csucs, bal, jobb, alap, sorok, c):
    s = ""
    for i in range(1, sorok + 1):
        t = i / (sorok + 1); y = csucs + (alap - csucs) * t
        s += cserep(cx + (bal - cx) * t + 6, cx + (jobb - cx) * t - 6, y, 14, c)
    return s

def ferde_haz(o):
    """o: w, hB, hJ (bal/jobb falmagasság), tH (tető), cs (a gerinc eltolása), eB, eJ (eresz), dol (fok), fal, falA (árnyék), teto, tetoA,
    ablak [(x, y, w, h)], kerek [(x, y, r)], ajto (x, w, h, szín), kemeny (x, szel, mag), lab (lábazat színe), toldas (x0, x1, h)"""
    w, hB, hJ, tH, cs = o["w"], o["hB"], o.get("hJ", o["hB"]), o["tH"], o.get("cs", 0)
    eB, eJ = o.get("eB", 12), o.get("eJ", 12)
    x0, x1 = -w / 2, w / 2
    gy = -max(hB, hJ) - tH                       # a gerinc magassága
    rot = lambda s: '<g transform="rotate(%s)">%s</g>' % (o.get("dol", 0), s)
    S = ""
    if "toldas" in o:   # toldott rész (alacsonyabb, félnyeregtető)
        tx0, tx1, th = o["toldas"]
        S += ('<path d="M%s,0 V%s H%s V0 Z" fill="%s"/><path d="M%s,%s L%s,%s L%s,%s Z" fill="%s"/>') % (
            f(tx0), f(-th), f(tx1), o["fal"], f(tx0 - 8), f(-th + 2), f(tx1), f(-th - 34), f(tx1), f(-th + 2), o["teto"])
    if "kemeny" in o:
        kx, ksz, km = o["kemeny"]
        S += '<path d="M%s,%s V%s H%s V%s Z" fill="#c98f6e"/><path d="M%s,%s H%s" stroke-width="3"/>' % (f(kx), f(gy * .6), f(gy - km), f(kx + ksz), f(gy * .6), f(kx - 3), f(gy - km), f(kx + ksz + 3))
    S += '<path d="M%s,0 V%s L%s,%s V0 Z" fill="%s"/>' % (f(x0), f(-hB), f(x1), f(-hJ), o["fal"])
    S += '<path d="M%s,0 V%s L%s,%s V0 Z" fill="#3c2f5e" opacity=".09" stroke="none"/>' % (f(x1 - w * .22), f(-hJ - (hB - hJ) * .22), f(x1), f(-hJ))
    S += '<path d="M%s,-6 Q%s,%s %s,%s" stroke="#fff" stroke-width="6" fill="none" opacity=".33" stroke-linecap="round"/>' % (f(x0 + 10), f(x0 + 8), f(-hB * .5), f(x0 + 12), f(-hB + 16))
    S += '<path d="M%s,0 H%s V-10 H%s Z" fill="%s" stroke-width="1.4"/>' % (f(x0), f(x1), f(x0), o.get("lab", "#d9cbb4"))
    if o.get("kupola"):   # 6. kör: kerek ház — kupolatető (a gerinc helyett a kupola teteje), arany gombbal
        xl, yl, xr, yr = x0 - eB, -hB + 6, x1 + eJ, -hJ + 6
        S += '<path d="M%s,%s Q%s,%s %s,%s Q%s,%s %s,%s Q%s,%s %s,%s Z" fill="%s"/>' % (
            f(xl), f(yl), f(xl + 4), f(gy), f(cs), f(gy), f(xr - 4), f(gy), f(xr), f(yr), f(cs), f(min(yl, yr) + 8), f(xl), f(yl), o["teto"])
        S += '<path d="M%s,%s Q%s,%s %s,%s Q%s,%s %s,%s Z" fill="#3c2f5e" opacity=".1" stroke="none"/>' % (
            f(cs + 10), f(gy + 2), f(xr - 6), f(gy + 4), f(xr), f(yr), f(cs + 30), f(yr - 4), f(cs + 10), f(gy + 2))
        S += '<g stroke="%s" fill="none" stroke-width="1.3">%s</g>' % (o.get("tetoA", "#5a4a9a"), "".join(
            '<path d="M%s,%s Q%s,%s %s,%s"/>' % (f(xl + (cs - xl) * t + 8), f(yl + (gy - yl) * t), f(cs), f(yl + (gy - yl) * t - 10 * (1 - t)), f(xr - (xr - cs) * t - 8), f(yr + (gy - yr) * t))
            for t in (.3, .6)))
        S += '<path d="M%s,%s Q%s,%s %s,%s" stroke="#fff" stroke-width="4" opacity=".3" stroke-linecap="round" fill="none"/>' % (f(xl + 12), f(yl - 8), f(xl + 14), f(gy + 16), f(cs - 14), f(gy + 6))
        S += '<path d="M%s,%s V%s" stroke-width="2"/><circle cx="%s" cy="%s" r="7" fill="#f2c14e"/>' % (f(cs), f(gy), f(gy - 10), f(cs), f(gy - 16))
        gy -= 24
    else:
        S += roof_ferde(o, x0, x1, hB, hJ, eB, eJ, cs, gy, tH)
    W = A = ""
    return ferde_haz_vege(o, S, W, A, w, x0, x1, gy)


def roof_ferde(o, x0, x1, hB, hJ, eB, eJ, cs, gy, tH):
    S = ""
    S += '<path d="M%s,%s L%s,%s L%s,%s Q%s,%s %s,%s Z" fill="%s"/>' % (
        f(x0 - eB), f(-hB + 6), f(cs), f(gy), f(x1 + eJ), f(-hJ + 6), f(cs), f(-max(hB, hJ) + 2), f(x0 - eB), f(-hB + 6), o["teto"])
    S += '<path d="M%s,%s L%s,%s L%s,%s Z" fill="#3c2f5e" opacity=".1" stroke="none"/>' % (f(cs), f(gy), f(x1 + eJ), f(-hJ + 6), f(cs + (x1 - cs) * .35), f(-hJ + 2))
    S += '<g stroke="%s" fill="none">%s</g>' % (o.get("tetoA", "#7a4a3a"), tetosor(cs, gy, x0 - eB, x1 + eJ, -max(hB, hJ) + 4, max(2, int(tH / 22)), o.get("tetoA", "#7a4a3a")))
    S += '<path d="M%s,%s L%s,%s" stroke="#fff" stroke-width="4" opacity=".3" stroke-linecap="round"/>' % (f(x0 - eB + 10), f(-hB + 2), f(cs - 6), f(gy + 10))
    return S


def ferde_haz_vege(o, S, W, A, w, x0, x1, gy):
    eB, eJ = o.get("eB", 12), o.get("eJ", 12)
    rot = lambda s: '<g transform="rotate(%s)">%s</g>' % (o.get("dol", 0), s)
    for ax, ay, aw, ah in o.get("ablak", []):
        W += '<rect x="%s" y="%s" width="%s" height="%s" fill="#6e5a7e" opacity=".55"/>' % (f(ax), f(ay), f(aw), f(ah))
        A += ('<rect x="%s" y="%s" width="%s" height="%s" rx="2" fill="#e9f4fb"/><path d="M%s,%s V%s M%s,%s H%s" stroke-width="1.4"/>'
              '<path d="M%s,%s q4,-4 9,-4" stroke="#fff" stroke-width="1.8" fill="none"/>') % (
            f(ax), f(ay), f(aw), f(ah), f(ax + aw / 2), f(ay), f(ay + ah), f(ax), f(ay + ah / 2), f(ax + aw), f(ax + 5), f(ay + 9))
        A += '<rect x="%s" y="%s" width="6" height="%s" fill="%s" stroke-width="1.2"/><rect x="%s" y="%s" width="6" height="%s" fill="%s" stroke-width="1.2"/>' % (
            f(ax - 7), f(ay), f(ah), o.get("spaletta", "#8fc0a8"), f(ax + aw + 1), f(ay), f(ah), o.get("spaletta", "#8fc0a8"))
    for kx, ky, kr in o.get("kerek", []):
        W += '<circle cx="%s" cy="%s" r="%s" fill="#6e5a7e" opacity=".5"/>' % (f(kx), f(ky), f(kr))
        A += '<circle cx="%s" cy="%s" r="%s" fill="#e9f4fb" stroke-width="2"/>' % (f(kx), f(ky), f(kr))
    dx, dw, dh, dc = o["ajto"]
    W += '<path d="M%s,0 V%s Q%s,%s %s,%s V0 Z" fill="#6e5a7e" opacity=".55"/>' % (f(dx - dw / 2), f(-dh + dw * .4), f(dx), f(-dh - dw * .2), f(dx + dw / 2), f(-dh + dw * .4))
    A += ('<path d="M%s,0 V%s Q%s,%s %s,%s V0 Z" fill="%s"/><path d="M%s,-2 V%s M%s,-2 V%s" stroke="#7a4f30" stroke-width="1.2" opacity=".6"/>'
          '<circle cx="%s" cy="%s" r="2.2" fill="#f2c14e" stroke-width="1"/>') % (
        f(dx - dw / 2), f(-dh + dw * .4), f(dx), f(-dh - dw * .2), f(dx + dw / 2), f(-dh + dw * .4), dc,
        f(dx - dw / 6), f(-dh + dw * .2), f(dx + dw / 6), f(-dh + dw * .2), f(dx + dw * .3), f(-dh * .45))
    K = '<path d="M%s,4 q14,-7 30,-2 q-6,9 -30,2 Z" fill="#d9d2c4" stroke-width="1.4"/>' % f(dx - 16)
    for ax, ay, aw, ah in o.get("ablak", [])[:o.get("ladak", 99)]:   # virágláda az ablak alatt
        K += '<path d="M%s,%s h%s l-2,7 h-%s z" fill="#c99a6a" stroke-width="1.2"/>' % (f(ax - 3), f(ay + ah + 1), f(aw + 6), f(aw + 2))
    K += '<path d="M%s,%s v-26 M%s,%s h12 l-2,-11 h-8 z" stroke-width="1.6" fill="#fff3b0"/>' % (f(dx + dw / 2 + 10), f(-dh * .55), f(dx + dw / 2 + 4), f(-dh * .55 - 26))
    V = ""
    for ax, ay, aw, ah in o.get("ablak", [])[:o.get("ladak", 99)]:
        V += "".join('<circle cx="%s" cy="%s" r="3" fill="%s" stroke-width=".8"/>' % (f(ax + 2 + (aw - 4) * i / 3), f(ay + ah - 1), VSZ[(i + int(ax)) % 5]) for i in range(4))
    V += '<path d="M%s,-4 q-8,-18 2,-34 q6,-14 -2,-30" stroke="#7fae6a" stroke-width="2" fill="none"/>' % f(x0 + 4)
    V += "".join('<circle cx="%s" cy="%s" r="3.2" fill="%s" stroke-width=".8"/>' % (f(x0 + 3 + (i % 2) * 6), f(-12 - i * 14), ["#f6a5c0", "#fff", "#f6a5c0", "#fce49a", "#f6a5c0"][i]) for i in range(5))
    KA = ""
    if "kemeny" in o:
        kx, ksz, km = o["kemeny"]
        KA += '<g transform="rotate(%s)">%s</g>' % (o.get("dol", 0), fust(kx + ksz / 2, gy - km - 4, 3, 4.6, 46))
    top = gy - (o["kemeny"][2] if "kemeny" in o else 0)
    sb = (x0, top, x1, 0)
    ext = (x0 - eB - 20, top - 30, x1 + eJ + 20, 14)
    return {"S": rot(S), "W": rot(W), "A": rot(A), "K": rot(K), "V": rot(V), "KA": KA, "sb": sb, "ext": ext, "G": arnyek(8, 3, w * .62, 11), "gy": gy}


def kevek(x, y, n, r):
    """rőzsekéve-rakás: alul széles sorok, minden kéve EGÉSZ köteg (vékony pálcák, piros kötés)"""
    s, sor, i = "", 0, 0
    while i < n:
        db = max(1, 4 - sor)
        for j in range(db):
            if i >= n: break
            s += keve(x + (j - (db - 1) / 2) * 38 + (r() - .5) * 3, y - sor * 13, (r() - .5) * 4); i += 1
        sor += 1
    return s

def keve(x, y, fok_=0):
    return ('<g transform="translate(%s %s) rotate(%s)"><path d="M-22,-1 Q-22,-13 -16,-13 H16 Q22,-13 22,-1 Q22,1 16,1 H-16 Q-22,1 -22,-1 Z" fill="#c9a06a" stroke="%s" stroke-width="1.4"/>'
            '<path d="M-20,-4 H20 M-20,-8 H20 M-18,-11 H18" stroke="#9a7044" stroke-width="1"/><circle cx="-21" cy="-3" r="1.5" fill="#e8cfa0" stroke="none"/><circle cx="-20" cy="-9" r="1.5" fill="#e8cfa0" stroke="none"/>'
            '<circle cx="21" cy="-6" r="1.5" fill="#e8cfa0" stroke="none"/><path d="M-3,-14 V2 M3,-14 V2" stroke="#d9434e" stroke-width="2.4"/></g>') % (f(x), f(y), f(fok_), INK)

def u_favago():
    """🪵 favágó-udvar (tizesek): Bence, a borz egész rőzsekévéket rak a rakásra — mindig egy egész köteget, sosem egy pálcát"""
    r = Rnd(811)
    fold = ('<ellipse cx="0" cy="2" rx="156" ry="36" fill="#3c2a50" opacity=".07" stroke="none"/>'
            '<ellipse cx="0" cy="0" rx="150" ry="32" fill="#e6d6b4" stroke="#c9b48a" stroke-width="2"/>'
            '<path d="M-120,-10 Q-40,-26 60,-22" stroke="#fff" stroke-width="5" fill="none" opacity=".25" stroke-linecap="round"/>')
    forgacs = "".join('<path transform="translate(%s %s) rotate(%d)" d="M0,0 h7 l-1,2.4 h-6 z" fill="#e2c49a" stroke="none"/>' % (f(-130 + r() * 260), f(-18 + r() * 34), int(r() * 180)) for _ in range(26))
    tusko_ = ('<g transform="translate(-122 12)"><path d="M-22,2 Q-23,-12 -20,-18 H20 Q23,-12 22,2 Z" fill="#b98a5a" stroke="%s" stroke-width="2"/>'
              '<ellipse cx="0" cy="-18" rx="20" ry="7" fill="#e2c49a" stroke="%s" stroke-width="2"/><ellipse cx="0" cy="-18" rx="11" ry="3.6" fill="none" stroke="#c49a6a" stroke-width="1.2"/>'
              '<path d="M4,-20 L20,-50" stroke="#8a5a3a" stroke-width="4.4" stroke-linecap="round"/><path d="M15,-56 l13,4 l-6,11 z" fill="#b8c0cc" stroke="#5a5a6a" stroke-width="1.5"/></g>') % (INK, INK)
    def alapr(a):
        n = 4 if a == "kopar" else 9
        return fold + forgacs + fok(tusko_) + fok(kevek(-6, 4, n, Rnd(812)), 1.4)
    bak = ('<g transform="translate(-60 6)" stroke="#8a5a3a" stroke-width="5" stroke-linecap="round"><path d="M-20,0 L8,-34 M20,0 L-8,-34 M-26,-22 H26"/>'
           '<path d="M-44,-27 H44 V-37 H-44 Z" fill="#c99a6a" stroke="%s" stroke-width="1.6"/><ellipse cx="44" cy="-32" rx="3" ry="5" fill="#e2c49a" stroke="%s" stroke-width="1.2"/></g>') % (INK, INK)
    talicska = ('<g transform="translate(140 10)"><path d="M-30,-14 L22,-14 L16,-2 L-24,-2 Z" fill="#a8c8d8" stroke="%s" stroke-width="1.6"/>'
                '<circle cx="-20" cy="2" r="8" fill="#8a6a52" stroke="%s" stroke-width="1.6"/><path d="M22,-12 L40,-4" stroke="#8a5a3a" stroke-width="3"/>' % (INK, INK) +
                keve(-4, -14) + keve(-2, -26, 4) + '</g>')
    kerites = '<g stroke="#a07a54" stroke-width="3.4" fill="none" stroke-linecap="round"><path d="M-152,-4 Q-160,-40 -130,-44 M-152,-22 H-118"/></g>'
    bere = fok(bak + talicska + kerites, 1.6)
    rv = Rnd(813)
    virag = ('<g transform="translate(-60 -26)"><path d="M-22,-4 h44 l-3,-9 h-38 z" fill="#c99a6a" stroke="%s" stroke-width="1.2"/>' % INK +
             "".join('<circle cx="%s" cy="-14" r="3.2" fill="%s" stroke="%s" stroke-width=".7"/>' % (f(-17 + i * 7), VSZ[i % 5], INK) for i in range(6)) + '</g>')
    virag += "".join('<circle cx="%s" cy="%s" r="%s" fill="%s" stroke="%s" stroke-width=".6"/>' % (f(-150 + rv() * 300), f(22 + rv() * 10), f(2.4 + rv() * 1.4), VSZ[int(rv() * 5)], INK) for _ in range(24))
    virag += taj_csillam(((-60, -80), (10, -90), (110, -60), (-120, -60)))
    def lako(a):
        top = -26 if a == "kopar" else -40          # a rakás teteje
        ben = leleg(figura("bence", 96, 6, .46, tukor=True), 1.2, 2.4)
        # egy egész kéve a kezéből ívben a rakás tetejére, ott marad, aztán (a következő körre) eltűnik
        kv = ('<g>%s<animateMotion path="M74,-34 Q40,%s 4,%s" keyPoints="0;1;1;1" keyTimes="0;.32;.9;1" calcMode="linear" dur="4.4s" repeatCount="indefinite"/>'
              '<animate attributeName="opacity" values="1;1;1;0" keyTimes="0;.32;.9;1" dur="4.4s" repeatCount="indefinite"/></g>') % (keve(0, 0), f(top - 44), f(top))
        return ben + kv
    return alapr, bere, virag, lako

def korte(x, y, k=1.0):
    return ('<g transform="translate(%s %s) scale(%s)"><path d="M0,-12 Q-7,-6 -6,1 Q-5,7 0,7 Q5,7 6,1 Q7,-6 0,-12 Z" fill="#e4d65a" stroke="#9a8a2a" stroke-width="1.1"/>'
            '<path d="M0,-12 v-4" stroke="#6e4630" stroke-width="1.4"/><ellipse cx="-2" cy="0" rx="1.6" ry="3" fill="#fff" opacity=".4"/></g>') % (f(x), f(y), k)

def hangya(c=True):
    return ('<g><ellipse cx="-3" cy="0" rx="2.6" ry="2" fill="#4a3a3a"/><ellipse cx="2" cy="0" rx="2" ry="1.7" fill="#4a3a3a"/><circle cx="5" cy="-.6" r="1.6" fill="#4a3a3a"/>'
            '<path d="M-3,1 l-2,2.6 M0,1 l0,3 M2,1 l2,2.6" stroke="#4a3a3a" stroke-width=".8"/>' + ('<circle cx="6" cy="-4" r="2" fill="#f7e2b0" stroke="#c9a060" stroke-width=".6"/>' if c else '') + '</g>')

def u_korte():
    """🍐 körtefa a hangyabollyal (aprok): Pötyi a padon pogácsát majszol, a hangyák EGYESÉVEL hordják a morzsát a bolyba"""
    r = Rnd(821)
    torzs = ('<path d="M-16,4 Q-10,-50 -22,-108 L-4,-120 L6,-118 L22,-108 Q12,-50 18,4 Q0,10 -16,4 Z" fill="url(#kereg2)" stroke="%s" stroke-width="2.4"/>' % INK +
             '<path d="M-8,-60 Q-30,-100 -60,-128 M10,-80 Q36,-110 62,-130" stroke="%s" stroke-width="12" fill="none" stroke-linecap="round"/>' % INK +
             '<path d="M-8,-60 Q-30,-100 -60,-128 M10,-80 Q36,-110 62,-130" stroke="#8a5e40" stroke-width="8" fill="none" stroke-linecap="round"/>'
             '<path d="M-6,-10 Q-4,-50 -12,-96" stroke="#c9a07a" stroke-width="4" fill="none" opacity=".45"/>')
    kor = ""
    for cx, cy, rx, ry, n, c in ((-60, -150, 64, 50, 8, "#94c983"), (62, -156, 66, 52, 8, "#8cc47f"), (0, -190, 92, 66, 11, "#9ccf8c"), (-14, -236, 60, 36, 8, "#a6d696")):
        kor += '<path d="%s" fill="%s"/>' % (pamacs(cx, cy, rx, ry, n, r), c)
    kor += '<path d="%s" fill="#3c2f5e" opacity=".08" stroke="none"/>' % pamacs(50, -150, 60, 40, 7, r)
    kor += '<path d="%s" fill="#fff" opacity=".28" stroke="none"/>' % pamacs(-40, -220, 44, 22, 7, r, 1.2)
    fold = '<ellipse cx="0" cy="4" rx="120" ry="18" fill="#3c2a50" opacity=".1" stroke="none"/>'
    boly = ('<g transform="translate(92 4)"><path d="M-26,2 Q-20,-26 0,-30 Q20,-26 26,2 Z" fill="#c49a6a" stroke="%s" stroke-width="1.8"/>'
            '<path d="M-14,-8 l3,-3 M6,-18 l3,-2 M12,-6 l2,-3 M-4,-22 l2,-2" stroke="#8a6a4a" stroke-width="1.2"/><ellipse cx="0" cy="-27" rx="4" ry="2.4" fill="#5a3a2a"/></g>') % INK
    def alapr(a):
        n = 3 if a == "kopar" else 10
        rp = Rnd(822)
        pk = "".join(korte(-90 + rp() * 180, -130 - rp() * 120, .9) for _ in range(n))
        ules = ('<g transform="translate(-96 2)">' + ('<path d="M-20,0 Q-22,-14 -18,-18 H18 Q22,-14 20,0 Z" fill="#b98a5a" stroke="%s" stroke-width="1.8"/><ellipse cx="0" cy="-18" rx="18" ry="5" fill="#e2c49a" stroke="%s" stroke-width="1.6"/>' % (INK, INK)
                if a == "kopar" else
                '<path d="M-40,0 V-20 M40,0 V-20 M-36,0 V-20 M36,0 V-20" stroke="#8a5a3a" stroke-width="4"/><path d="M-46,-20 H46 V-27 H-46 Z" fill="#c99a6a" stroke="%s" stroke-width="1.6"/>'
                '<path d="M-42,-27 V-50 M42,-27 V-50" stroke="#8a5a3a" stroke-width="3.4"/><path d="M-46,-44 H46 V-52 H-46 Z" fill="#d6b48a" stroke="%s" stroke-width="1.4"/>' % (INK, INK)) + '</g>')
        return fold + fok(torzs + kor, 2) + pk + fok(ules + boly, 1.6)
    kosar = ('<g transform="translate(-40 6)"><path d="M-14,0 L-16,-13 H16 L14,0 Z" fill="#d8b48a" stroke="%s" stroke-width="1.6"/><path d="M-15,-7 H15" stroke="#b5804a" stroke-width="1.2"/>'
             '<path d="M-12,-13 Q0,-30 12,-13" stroke="#a8764f" stroke-width="2.4" fill="none"/>' % INK + korte(-6, -14, .8) + korte(5, -15, .8) + '</g>')
    letra_ = '<g stroke="#8a6a52" stroke-width="3" stroke-linecap="round"><path d="M40,4 L58,-110 M54,4 L72,-110"/><path d="M43,-14 h14 M46,-36 h14 M50,-58 h14 M53,-80 h14" stroke-width="2.4"/></g>'
    madarhaz = '<g transform="translate(-62 -120)"><path d="M-10,0 V-16 H10 V0 Z" fill="#f2d5ae" stroke="%s" stroke-width="1.4"/><path d="M-13,-15 L0,-26 L13,-15 Z" fill="#c96a4a" stroke="%s" stroke-width="1.4"/><circle cx="0" cy="-8" r="3" fill="#5a3a2a"/></g>' % (INK, INK)
    bere = fok(kosar + letra_, 1.6) + madarhaz
    rv = Rnd(823)
    virag = "".join('<circle cx="%s" cy="%s" r="%s" fill="%s" stroke="%s" stroke-width=".6"/>' % (f(-130 + rv() * 260), f(8 + rv() * 12), f(2.4 + rv() * 1.6), VSZ[int(rv() * 5)], INK) for _ in range(30))
    virag += "".join('<circle cx="%s" cy="%s" r="2.6" fill="#fff" stroke="#e8b4c8" stroke-width=".6"/>' % (f(-110 + rv() * 220), f(-150 - rv() * 110)) for _ in range(16))
    virag += taj_csillam(((-80, -220), (40, -250), (100, -150), (-110, -140)))
    def lako(a):
        p = leleg(figura("potyi", -96, -22, .4), 1.2, 2.2)
        # a pogácsa a kezében: kicsit fel-le (majszol)
        pog = ('<g><circle cx="-78" cy="-50" r="5.4" fill="#f2c37a" stroke="#b8803a" stroke-width="1.2"/><path d="M-81,-51 h6 M-80,-48 h4" stroke="#b8803a" stroke-width=".8"/>'
               '<animateTransform attributeName="transform" type="translate" values="0,0;-3,-6;0,0;0,0" keyTimes="0;.2;.4;1" dur="2.6s" repeatCount="indefinite"/></g>')
        # a hangyák egyesével: mindegyik visz egy morzsát a padtól a bolyig, a bolyban eltűnik
        ut_ = "M-66,8 Q-20,18 30,12 Q66,8 86,-10 L92,-24"
        hs = "".join(('<g opacity="0">%s<animateMotion path="%s" dur="6s" begin="%ss" repeatCount="indefinite" rotate="auto"/>'
                      '<animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.05;.9;1" dur="6s" begin="%ss" repeatCount="indefinite"/></g>') % (hangya(), ut_, f(i * 1.5), f(i * 1.5)) for i in range(4))
        return p + pog + hs
    return alapr, bere, virag, lako

def u_letra():
    """🪜 a létrás ház (rokon-letra): magas, keskeny, türkiz tető; Juli a falnak támasztott létrán UGYANAKKORA lépésekkel lépeget föl és le"""
    h = ferde_haz({"w": 124, "hB": 204, "hJ": 196, "tH": 68, "cs": 14, "eB": 14, "eJ": 10, "dol": -2.6, "fal": "#fff1d6", "teto": "#5fb3ad", "tetoA": "#3f8a85",
                   "ablak": [(-46, -178, 28, 30), (16, -174, 28, 30), (-46, -112, 28, 30)], "ajto": (24, 30, 56, "#b07a52"), "kemeny": (-34, 14, 22),
                   "spaletta": "#e8a0b4", "ladak": 2})
    lepes = 24
    lt = ('<g stroke="#8a5a3a" stroke-linecap="round"><path d="M70,2 L60,-206 M92,2 L82,-206" stroke-width="5"/>' +
          "".join('<path d="M%s,%s h22" stroke-width="4"/>' % (f(70 - k * 1.25), f(-18 - k * lepes)) for k in range(8)) + '</g>')
    # Juli diszkrét lépésekkel: minden lépés ugyanannyi (egy fok), föl, aztán le
    fel = [(-k * 1.25, -18 - k * lepes) for k in range(6)]
    ut_ = fel + fel[-2:0:-1]
    juli = ('<g><g>%s</g><animateTransform attributeName="transform" type="translate" calcMode="discrete" values="%s" dur="%ss" repeatCount="indefinite"/></g>') % (
        figura("juli", 81, 0, .4), ";".join("%s,%s" % (f(x), f(y + 18)) for x, y in ut_), f(len(ut_) * .7))
    h["L"] = fok(lt, 1.4) + juli
    h["defs"] = ""
    return h

def u_csalad():
    """🦆 Kacsáék háza (szamcsalad): széles sárga ház, 4 ablak — az ablakokban SORBAN kigyullad a fény; Kata és a kiskacsák a ház előtt totyognak"""
    ab = [(-94, -98, 32, 30), (-50, -98, 32, 30), (16, -98, 32, 30), (60, -98, 32, 30)]
    h = ferde_haz({"w": 214, "hB": 112, "hJ": 124, "tH": 62, "cs": -40, "eB": 10, "eJ": 34, "dol": 2, "fal": "#fde9b0", "teto": "#c96a4a", "tetoA": "#8a4a3a",
                   "ablak": ab, "ajto": (-1, 30, 56, "#a8764f"), "kemeny": (40, 14, 20), "toldas": (107, 150, 70), "spaletta": "#7fb2e8"})
    feny = "".join(('<rect x="%s" y="%s" width="%s" height="%s" rx="2" fill="#fff1a8" opacity="0"><animate attributeName="opacity" values="0;0;.95;.95;0" keyTimes="0;%s;%s;.86;1" dur="6s" repeatCount="indefinite"/></rect>') % (
        f(x), f(y), f(w), f(hh), f(.08 + i * .16), f(.1 + i * .16)) for i, (x, y, w, hh) in enumerate(ab))
    h["KA"] += '<g transform="rotate(2)">%s</g>' % feny
    kacsak = ('<g><g>' + figura("kata", -132, 26, .42) + figura("kata", -96, 28, .22) + figura("kata", -76, 28, .22) + figura("kata", -56, 28, .22) +
              '</g><animateTransform attributeName="transform" type="translate" values="0,0;10,-2;20,0;30,-2;40,0;30,-2;20,0;10,-2;0,0" dur="5s" repeatCount="indefinite"/></g>')
    h["L"] = kacsak
    h["ext"] = (h["ext"][0] - 60, h["ext"][1], h["ext"][2], 40)
    h["defs"] = ""
    return h

def u_kovek(x0, y0):
    """🪨 ugrókövek a csobogó éren (lepegeto): Pali NAGY, EGYFORMA ugrásokkal ugrál a köveken oda és vissza"""
    kp = [(x - x0, er_y(x) - y0 + 2) for x in U_KOVEK_X]
    kov = "".join('<g><ellipse cx="%s" cy="%s" rx="19" ry="8" fill="#d9d2c4" stroke="%s" stroke-width="1.8"/><ellipse cx="%s" cy="%s" rx="9" ry="3" fill="#fff" opacity=".45" stroke="none"/></g>' % (
        f(x), f(y), INK, f(x - 4), f(y - 3)) for x, y in kp)
    moha = "".join('<path d="M%s,%s q6,-4 12,0" stroke="#8fc47a" stroke-width="3" fill="none" stroke-linecap="round"/>' % (f(x - 10), f(y - 6)) for x, y in kp[::2])
    def alapr(a):
        return kov + (moha if a != "kopar" else "")
    nad = "".join('<path d="M%d,%d q-3,-24 -1,-38 M%d,%d q2,-22 6,-32" stroke="#6f9e5e" stroke-width="2.2" fill="none"/><ellipse cx="%d" cy="%d" rx="2.6" ry="7" fill="#a8764f" stroke="none"/>' % (
        x, y, x + 4, y, x - 2, y - 40) for x, y in ((-128, -6), (-118, 2), (126, -10), (136, -2)))
    pallo = fok('<path d="M-150,10 l26,-4 l2,8 l-26,4 z" fill="#c9a77e"/><path d="M124,0 l26,-2 l1,8 l-26,2 z" fill="#c9a77e"/>', 1.4)
    bere = nad + pallo
    rv = Rnd(831)
    virag = "".join('<g transform="translate(%s %s)"><ellipse rx="9" ry="3.4" fill="#8fd07a" stroke="#4f8a42" stroke-width="1"/><circle cy="-2" r="3" fill="%s" stroke="%s" stroke-width=".6"/></g>' % (
        f(x), f(y + 6), ["#f6a5c0", "#fff"][i % 2], INK) for i, (x, y) in enumerate(((-66, er_y(930) - y0), (22, er_y(1018) - y0), (64, er_y(1062) - y0 + 2))))
    virag += "".join('<circle cx="%s" cy="%s" r="%s" fill="%s" stroke="%s" stroke-width=".6"/>' % (f(-130 + rv() * 260), f(-26 - rv() * 8), f(2.2 + rv() * 1.4), VSZ[int(rv() * 5)], INK) for _ in range(16))
    virag += taj_csillam(((-90, -50), (0, -60), (90, -46)))
    def lako(a):
        # egyforma ívek kőről kőre (oda, aztán vissza)
        d = "M%s,%s" % (f(kp[0][0]), f(kp[0][1] - 2))
        for (xa, ya), (xb, yb) in list(zip(kp, kp[1:])) + list(zip(kp[::-1], kp[-2::-1])):
            d += " Q%s,%s %s,%s" % (f((xa + xb) / 2), f(min(ya, yb) - 46), f(xb), f(yb - 2))
        return ('<g>' + figura("pali", 0, 0, .38) + '<animateMotion path="%s" dur="8s" repeatCount="indefinite"/></g>') % d
    return alapr, bere, virag, lako, kp

def u_kerites():
    """🪵 kerítés-lépcső a legelő szélén (atlepo): Samu, a sün a lépcsőn átmászik — föl, át, le, aztán vissza; bent a kecske legel"""
    oszlop = [-112, -80, -48, -16, 52, 84, 116]
    def ker(a):
        s = '<g stroke="#a07a54" stroke-linecap="round" fill="none">'
        s += "".join('<path d="M%d,4 V-30" stroke-width="5.4"/>' % x for x in oszlop)
        if a == "kopar":
            s += '<path d="M-116,-22 H-20 M48,-22 H120 M-116,-8 H-56 M-38,-6 H-18 M48,-8 H120" stroke-width="4"/><path d="M-56,-8 L-46,2" stroke-width="4"/>'
        else:
            s += '<path d="M-116,-22 H-20 M48,-22 H120 M-116,-8 H-20 M48,-8 H120" stroke-width="4"/>'
        return s + '</g>'
    # a lépcső: két fokos falépcső a kerítés két oldalán, középen a felső deszka
    lepcso = ('<g fill="#c9a77e" stroke="%s" stroke-width="1.4"><path d="M-22,4 h18 v-12 h-18 z M-12,-8 h18 v-12 h-18 z"/><path d="M28,4 h-18 v-12 h18 z M18,-8 h-18 v-12 h18 z"/>'
              '<path d="M-6,-20 h22 v-6 h-22 z" fill="#d6b48a"/></g><path d="M-20,-30 V4 M36,-30 V4" stroke="#8a6a52" stroke-width="3"/>') % INK
    kecske = ('<g transform="translate(70 -54)"><g><ellipse cx="0" cy="-16" rx="22" ry="12" fill="#fffaf0" stroke="%s" stroke-width="2"/><path d="M-14,-6 V6 M-6,-6 V6 M8,-6 V6 M14,-6 V6" stroke="%s" stroke-width="2.6"/>'
              '<path d="M20,-22 q6,0 6,-6" stroke="%s" stroke-width="2" fill="none"/>'
              '<g><ellipse cx="-24" cy="-20" rx="8" ry="7" fill="#fffaf0" stroke="%s" stroke-width="2"/><path d="M-26,-26 l-4,-9 M-21,-26 l1,-9" stroke="#8a6a4a" stroke-width="2"/><circle cx="-27" cy="-21" r="1.3" fill="%s"/>'
              '<path d="M-30,-14 q2,5 0,7" stroke="%s" stroke-width="1.4" fill="none"/>'
              '<animateTransform attributeName="transform" type="rotate" values="0 -16 -16;34 -16 -16;34 -16 -16;0 -16 -16;0 -16 -16" keyTimes="0;.2;.6;.8;1" dur="5s" repeatCount="indefinite"/></g></g></g>') % (INK, INK, INK, INK, INK, INK)
    def alapr(a):
        return fok(ker(a) + lepcso, 1.2)
    szena = ('<g transform="translate(-78 -56)"><path d="M-22,0 V-24 M22,0 V-24 M-22,-24 L22,-24" stroke="#8a6a52" stroke-width="3"/><path d="M-20,-24 Q0,-44 20,-24 Z" fill="#f2d56a" stroke="%s" stroke-width="1.4"/>'
             '<path d="M-20,-10 h40 v8 h-40 z" fill="#c9a77e" stroke="%s" stroke-width="1.2"/></g>') % (INK, INK)
    vodor = '<g transform="translate(108 -46)"><path d="M-12,0 L-14,-14 H14 L12,0 Z" fill="#a8c8d8" stroke="%s" stroke-width="1.4"/><ellipse cy="-14" rx="14" ry="3" fill="#bfe3f3" stroke="%s" stroke-width="1"/></g>' % (INK, INK)
    bere = szena + vodor
    rv = Rnd(841)
    virag = "".join('<g transform="translate(%s %s)"><path d="M0,0 v-12" stroke="#6f9e5e" stroke-width="1.4"/><circle cy="-14" r="%s" fill="%s" stroke="%s" stroke-width=".6"/></g>' % (
        f(-120 + rv() * 240), f(6 + rv() * 6), f(2.6 + rv() * 1.2), VSZ[int(rv() * 5)], INK) for _ in range(22))
    virag += '<g transform="translate(-80 -36)">%s</g>' % ULO.replace('id="ulo" ', '')
    virag += taj_csillam(((-90, -60), (10, -70), (100, -80)))
    def lako(a):
        # föl a bal fokokon, át a deszkán, le a jobb fokokon, aztán vissza
        samu = ('<g>' + figura("samu", 0, 0, .3) +
                '<animateMotion path="M-46,6 L-24,6 L-14,-6 L-4,-18 L12,-24 L22,-18 L32,-6 L42,6 L60,6" keyPoints="0;1;1;0;0" keyTimes="0;.42;.5;.92;1" calcMode="linear" dur="8s" repeatCount="indefinite"/></g>')
        return kecske + samu
    return alapr, bere, virag, lako

def u_kert():
    """🍂 bokros kert (szazas-bujocska): Cirmi szaglászik az őszi levélkupacnál, és néha kikukucskál belőle Cincin"""
    fold = ('<ellipse cx="0" cy="6" rx="150" ry="34" fill="#3c2a50" opacity=".07" stroke="none"/>'
            '<ellipse cx="0" cy="0" rx="142" ry="30" fill="#c4e4b0" stroke="%s" stroke-width="2"/>') % INK
    def bokrok(n):
        p = [(-110, -6, 1.3, "#8cc47f"), (104, -4, 1.25, "#86c07a"), (-70, -26, 1.0, "#9fd19a"), (78, -26, 1.05, "#8cc47f")][:n]
        return '<g stroke="%s" stroke-width="2">' % INK + "".join(bokor(x, y, s, c, "#a7d99a") for x, y, s, c in p) + '</g>'
    kupac_h = ('<g stroke="#a8603a" stroke-width="1.4"><ellipse cx="-24" cy="-4" rx="18" ry="9" fill="#e9884a"/><ellipse cx="2" cy="-10" rx="20" ry="10" fill="#d9663a"/><ellipse cx="24" cy="-4" rx="18" ry="9" fill="#f2b04a"/>'
               '<ellipse cx="-6" cy="-20" rx="16" ry="8" fill="#e9a04a"/></g>')
    kupac_e = ('<g stroke="#a8603a" stroke-width="1.4"><ellipse cx="-30" cy="6" rx="16" ry="7" fill="#f2b04a"/><ellipse cx="-4" cy="4" rx="22" ry="9" fill="#c9783a"/><ellipse cx="24" cy="6" rx="18" ry="7" fill="#e9884a"/>'
               '<path d="M-14,-2 l6,-4 l4,5 M10,0 l5,-5 l3,6" stroke="#8a4a2a" stroke-width="1" fill="none"/></g>')
    def alapr(a):
        return fold + bokrok(2 if a == "kopar" else 4) + kupac_h
    iv = ('<g stroke="#8a5a3a" stroke-width="5" fill="none" stroke-linecap="round"><path d="M-30,-40 Q0,-104 30,-40"/><path d="M-30,-40 V-2 M30,-40 V-2"/></g>'
          '<g stroke="#8a5a3a" stroke-width="1.6"><path d="M-30,-20 h-6 M-30,-34 h-6 M30,-20 h6 M30,-34 h6"/></g>')
    gereblye = '<g transform="translate(-58 2) rotate(-14)"><path d="M0,0 V-60" stroke="#a8764f" stroke-width="3"/><path d="M-10,-60 H10 M-8,-60 v6 M-3,-60 v6 M3,-60 v6 M8,-60 v6" stroke="#6e6a86" stroke-width="2"/></g>'
    kanna = '<g transform="translate(70 10)"><path d="M-12,0 V-16 H10 V0 Z" fill="#8fbfd8" stroke="%s" stroke-width="1.4"/><path d="M10,-12 L22,-22" stroke="%s" stroke-width="2.6"/><path d="M-12,-14 q-8,0 -6,8" stroke="%s" stroke-width="2" fill="none"/></g>' % (INK, INK, INK)
    bere = fok(iv + gereblye + kanna, 1.4)
    rv = Rnd(851)
    virag = "".join('<circle cx="%s" cy="%s" r="3.2" fill="%s" stroke="%s" stroke-width=".6"/>' % (
        f((-30 if i < 6 else 30) + (i % 2) * (3 if i < 6 else -3)), f(-12 - (i % 6) * 14), ["#f6a5c0", "#e8505b", "#fff"][i % 3], INK) for i in range(12))
    virag += '<g transform="translate(0 -100)">' + "".join('<circle cx="%s" cy="%s" r="3.4" fill="%s" stroke="%s" stroke-width=".6"/>' % (f(-16 + i * 8), f(abs(i - 2) * 3), ["#f6a5c0", "#e8505b"][i % 2], INK) for i in range(5)) + '</g>'
    virag += "".join('<circle cx="%s" cy="%s" r="%s" fill="%s" stroke="%s" stroke-width=".6"/>' % (f(-140 + rv() * 280), f(14 + rv() * 12), f(2.4 + rv() * 1.4), VSZ[int(rv() * 5)], INK) for _ in range(20))
    virag += taj_csillam(((-100, -70), (0, -120), (100, -60)))
    def lako(a):
        cin = ('<g><g transform="translate(-4 4)">' + figura("cincin", 0, 0, .3) + '</g>'
               '<animateTransform attributeName="transform" type="translate" values="0,30;0,30;0,-4;0,-4;0,30" keyTimes="0;.42;.52;.8;.9" dur="6.4s" repeatCount="indefinite"/></g>')
        cirmi = ('<g><g>' + figura("cirmi", 66, 24, .4, tukor=True) + '</g>'
                 '<animateTransform attributeName="transform" type="translate" values="0,0;-8,0;-8,0;-3,0;-8,0;0,0" keyTimes="0;.2;.4;.5;.6;1" dur="4.6s" repeatCount="indefinite"/></g>')
        return cin + kupac_e + cirmi
    return alapr, bere, virag, lako

def u_nagyhaz():
    """🏠 a nagy ház a dombocskán (erdo-melye + erdo-szive): lent a pinceablakban lámpás fénye mozog, fönt a kerek padlásablakban egy távcső fordul az ég felé"""
    h = ferde_haz({"w": 196, "hB": 162, "hJ": 172, "tH": 92, "cs": 16, "eB": 16, "eJ": 14, "dol": -1.6, "fal": "#f6d6c4", "teto": "#9a5a3a", "tetoA": "#6e3a2a",
                   "ablak": [(-82, -156, 30, 30), (52, -160, 30, 30), (-82, -88, 30, 30)], "kerek": [(10, -210, 19)], "ajto": (8, 34, 62, "#8a5a3a"),
                   "kemeny": (44, 16, 26), "spaletta": "#9ec9f0", "lab": "#c9bba8"})
    # a pinceablak (a lábazatban, jobbra) — benne mozog a lámpás fénye
    pince_w = '<rect x="46" y="-24" width="36" height="16" rx="3" fill="#5a4a5a"/>'
    h["S"] += '<g transform="rotate(-1.6)"><path d="M-98,0 H98 V-30 H-98 Z" fill="#c9bba8" stroke-width="1.4"/><path d="M-70,-30 V0 M-30,-30 V-16 M20,-16 V0 M60,-30 V-24" stroke-width="1" opacity=".5"/>%s</g>' % pince_w
    feny = ('<g transform="rotate(-1.6)"><clipPath id="pinceN"><rect x="46" y="-24" width="36" height="16" rx="3"/></clipPath><g clip-path="url(#pinceN)">'
            '<g><circle cx="52" cy="-16" r="10" fill="#ffd46a" opacity=".9"/><circle cx="52" cy="-16" r="4" fill="#fff6c2"/>'
            '<animateTransform attributeName="transform" type="translate" values="0,0;24,0;24,0;0,0;0,0" keyTimes="0;.35;.5;.85;1" dur="7s" repeatCount="indefinite"/></g></g></g>')
    tav = ('<g transform="rotate(-1.6)"><clipPath id="padlasN"><circle cx="10" cy="-210" r="17"/></clipPath><g clip-path="url(#padlasN)"><g transform="translate(6 -200)"><g>'
           '<rect x="-4" y="-30" width="10" height="32" rx="3" fill="#6e5a7a" stroke="%s" stroke-width="1.4"/><rect x="-6" y="-34" width="14" height="7" rx="2" fill="#f2c14a" stroke="%s" stroke-width="1.4"/>'
           '<animateTransform attributeName="transform" type="rotate" values="20;48;48;20;20" keyTimes="0;.35;.6;.9;1" dur="8s" repeatCount="indefinite"/></g></g></g>'
           '<circle cx="10" cy="-210" r="19" fill="none" stroke="%s" stroke-width="2.4"/><path d="M10,-229 V-191" stroke="%s" stroke-width="1.2" opacity=".5"/></g>') % (INK, INK, INK, INK)
    h["KA"] += feny + tav
    h["L"] = leleg(figura("brumi", -122, 6, .46), 1.4, 2.8)
    h["ext"] = (h["ext"][0] - 40, h["ext"][1], h["ext"][2], 18)
    h["defs"] = ""
    return h

def u_kut():
    """⛲ a kút a kúttéren: a vödör lemegy és feljön (koppintásra: „Csobb! Friss víz a kútból.”)"""
    x, y = U_KUT
    vodor = ('<g><path d="M0,-82 V-60" stroke="#6e5a4a" stroke-width="1.5"/><path d="M-9,-60 h18 l-3,14 h-12 z" fill="#b98a64" stroke="%s" stroke-width="1.5"/>'
             '<path d="M-9,-58 h18" stroke="#8a6a4a" stroke-width="1"/>'
             '<animateTransform attributeName="transform" type="translate" values="0,0;0,26;0,26;0,0;0,0" keyTimes="0;.3;.5;.8;1" dur="7s" repeatCount="indefinite"/></g>') % INK
    s = (arnyek(4, 4, 46, 8) +
         fok('<ellipse cx="0" cy="0" rx="36" ry="11" fill="#cfc4b4"/><path d="M-36,0 V-34 A36 11 0 0 0 36 -34 V0 A36 11 0 0 1 -36 0 Z" fill="#e6dccb"/>'
             '<path d="M-36,-12 Q0,-2 36,-12 M-36,-24 Q0,-14 36,-24 M-20,-34 V-22 M12,-30 V-18 M-4,-20 V-8 M24,-20 V-8 M-26,-10 V0" stroke-width="1.1" opacity=".55"/>'
             '<ellipse cx="0" cy="-34" rx="36" ry="11" fill="#7fb3d6"/><ellipse cx="-6" cy="-36" rx="16" ry="4" fill="#fff" opacity=".4" stroke="none"/>'
             '<path d="M-31,-34 V-98 M31,-34 V-98" stroke="#8a5a3a" stroke-width="6"/><path d="M-31,-34 V-98 M31,-34 V-98" stroke="#b07a52" stroke-width="3"/>'
             '<path d="M-48,-92 L0,-128 L48,-92 Q0,-96 -48,-92 Z" fill="#c98b5e"/><path d="M-30,-100 L0,-121 M-12,-96 L4,-118" stroke="#8a4a3a" stroke-width="1" opacity=".6"/>'
             '<path d="M-31,-82 H31" stroke="#6e5a4a" stroke-width="5"/><path d="M31,-82 h10 v10" stroke="#6e5a4a" stroke-width="3" fill="none"/>', 2) + vodor)
    return '<g transform="translate(%s %s)">%s</g>' % (f(x), f(y), s), (x - 52, y - 134, 104, 146)

def u_tyuk():
    x, y = U_TYUK
    s = ('<g transform="translate(%s %s)">' % (f(x), f(y)) + arnyek(0, 2, 16, 3) +
         '<g filter="url(#firka)" stroke="%s" stroke-width="1.8" stroke-linejoin="round"><path d="M-14,-8 Q-22,-20 -16,-26 L-10,-18 Z" fill="#c9a06a"/>'
         '<ellipse cx="0" cy="-12" rx="15" ry="11" fill="#fffaf0"/><path d="M-6,-12 q6,6 12,0" fill="none" stroke-width="1.2"/><path d="M-4,0 v4 M4,0 v4" stroke="#e0a03a" stroke-width="2.4"/>'
         '<g><circle cx="12" cy="-22" r="7" fill="#fffaf0"/><path d="M8,-30 l3,-5 l2,4 l3,-4 l1,5" fill="#e8505b" stroke-width="1"/><path d="M18,-22 l7,2 l-7,2 z" fill="#f2a03a" stroke-width="1"/>'
         '<circle cx="13" cy="-23" r="1.3" fill="%s" stroke="none"/><path d="M17,-18 q1,4 -1,5" fill="#e8505b" stroke-width=".8"/>'
         '<animateTransform attributeName="transform" type="rotate" values="0 4 -16;0 4 -16;30 4 -16;0 4 -16;0 4 -16;30 4 -16;0 4 -16" dur="3.5s" repeatCount="indefinite"/></g></g></g>') % (INK, INK)
    return s, (x - 26, y - 40, 56, 48)

def u_bogyo():
    """🐈‍⬛ Bogyó a padon szundít (összegömbölyödve; a z-betűk szállnak)"""
    x, y = U_BOGYO
    s = ('<g transform="translate(%s %s)">' % (f(x), f(y - 20)) +
         '<g filter="url(#firka)" stroke="#2e2936" stroke-width="2" stroke-linejoin="round">'
         '<path d="M18,-2 Q34,-4 30,-18 Q28,-26 20,-24" fill="none" stroke-width="8" stroke-linecap="round"/><path d="M18,-2 Q34,-4 30,-18 Q28,-26 20,-24" fill="none" stroke="#4f4858" stroke-width="5" stroke-linecap="round"/>'
         '<g><ellipse cx="2" cy="-10" rx="24" ry="13" fill="#4f4858"/><animateTransform attributeName="transform" type="scale" values="1,1;1.02,1.06;1,1" dur="3.2s" repeatCount="indefinite" additive="sum"/></g>'
         '<ellipse cx="2" cy="-6" rx="13" ry="6" fill="#a99fb6" stroke="none"/>'
         '<circle cx="-18" cy="-12" r="11" fill="#4f4858"/><path d="M-27,-18 L-28,-30 L-19,-22 Z M-14,-22 L-8,-31 L-8,-19 Z" fill="#4f4858"/>'
         '<path d="M-26,-20 L-26.5,-27 L-21,-22 Z" fill="#e8b4c8" stroke="none"/>'
         '<path d="M-24,-12 q3,2 6,0 M-15,-12 q3,2 6,0" fill="none" stroke="#e8e2f0" stroke-width="1.4"/><path d="M-19,-7 l-1,1.4 l2,0 z" fill="#e8b4c8" stroke="none"/></g>' +
         "".join(('<text x="-6" y="-30" font-size="%s" fill="#7a6f93" font-family="Fredoka,sans-serif" opacity="0">z<animate attributeName="y" values="-30;-62" dur="3.6s" begin="%ss" repeatCount="indefinite"/>'
                  '<animate attributeName="x" values="-6;8" dur="3.6s" begin="%ss" repeatCount="indefinite"/><animate attributeName="opacity" values="0;1;0" dur="3.6s" begin="%ss" repeatCount="indefinite"/></text>') % (
             12 + i * 3, f(i * 1.2), f(i * 1.2), f(i * 1.2)) for i in range(3)) + '</g>')
    return s, (x - 40, y - 90, 76, 70)

def osszeado_utca():
    M = "osszeado-utca"
    r = Rnd(905)
    UP = utca_pontok()
    def uton(x, y, plusz=0):
        return any(((x - px) ** 2 + (y - py) ** 2) ** .5 < w / 2 + 6 + plusz for px, py, w in UP)
    erq = ivpontok(U_ER, 10)
    def vizben(x, y, plusz=0):
        tx, ty, rx, ry = U_TO
        return tav_vonal(erq, x, y) < 18 + plusz or ((x - tx) / (rx + plusz)) ** 2 + ((y - ty) / (ry + plusz)) ** 2 < 1
    def ellben(e, x, y, plusz=0):
        cx, cy, rx, ry = e
        return ((x - cx) / (rx + plusz)) ** 2 + ((y - cy) / (ry + plusz)) ** 2 < 1
    mellq = ivpontok(U_MELLEK, 10)
    HELYEK_ = [(U_FAVAGO, 160, 40), (U_KORTE, 120, 30), (U_LETRA, 90, 20), (U_CSALAD, 130, 30), (U_KERITES, 130, 26), (U_KERT, 150, 36), (U_NAGY, 120, 20)]
    def foglalt(x, y):
        return (uton(x, y) or vizben(x, y, 10) or ellben(U_KUTTER, x, y, 10) or tav_vonal(mellq, x, y) < 30 or
                any(abs(x - hx) < rx and hy - 60 < y < hy + ry for (hx, hy), rx, ry in HELYEK_))

    # ég: délelőtti fény bal fentről
    eg = ('<rect x="%d" y="%d" width="%d" height="%d" fill="url(#eg)"/>'
          '<circle cx="170" cy="80" r="300" fill="url(#napfeny)"/><circle cx="170" cy="80" r="42" fill="#fff6cf"/>') % (BX0, BY0, BX1 - BX0, BY1 - BY0)
    eg += '<g opacity=".6">' + felho(520, 40, 1.3, .8) + felho(1100, 10, 1.5, .7) + felho(1800, 50, 1.2, .8) + felho(-300, 30, 1.2, .7) + '</g>'
    irj(M, "eg", KIFESTVE, '<linearGradient id="eg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cde6f6"/><stop offset=".55" stop-color="#f3eee2"/><stop offset="1" stop-color="#fdf1e2"/></linearGradient>'
        '<radialGradient id="napfeny"><stop offset="0" stop-color="#fff8d8" stop-opacity=".95"/><stop offset="1" stop-color="#fff8d8" stop-opacity="0"/></radialGradient>', eg)

    # távoli: hegyek, a Domboldal Garas tornyával, balra hátul a nagyfa koronája (a Nagyfa tér), jobbra a Dallam-tér haranglába
    tav = ('<g filter="url(#firka)"><path d="M560,330 L760,170 L880,230 L1040,90 L1240,250 L1400,150 L1600,270 L1860,180 L2170,300 L2170,420 L560,420 Z" fill="#ddd6ee" stroke="#bdb2d8" stroke-width="2"/>'
           '<path d="M1012,116 L1040,90 L1070,122 L1052,116 L1040,128 L1026,116 Z M1376,170 L1400,150 L1424,172 L1410,168 L1400,178 Z" fill="#fff"/>'
           '<path d="M-560,420 Q-300,330 -60,350 Q120,360 300,330 L560,360 V430 H-560 Z" fill="#e2dcf0" stroke="#c4bade" stroke-width="2"/>'
           '<path d="M540,396 Q760,272 980,262 Q1160,254 1330,304 V420 H540 Z" fill="#f4e4a8" stroke="#d6bd6a" stroke-width="2"/>'
           '<path d="M640,380 Q780,330 880,316 M1000,300 Q1110,296 1220,320" stroke="#e8d088" stroke-width="5" fill="none" stroke-linecap="round"/></g>')
    # Garas tornya (kicsiben, halványan)
    tav += ('<g transform="translate(900 268)" opacity=".85" filter="url(#firka)" stroke="#8a7a9a" stroke-width="1.6"><rect x="-10" y="-30" width="20" height="30" fill="#e2d6c2"/>'
            '<rect x="-9" y="-50" width="18" height="20" fill="#e9c9a0"/><path d="M-14,-50 L0,-74 L14,-50 Z" fill="#c96a4a"/><circle cx="0" cy="-40" r="4" fill="#fff6dd"/>'
            '<path d="M0,-74 v-10" stroke-width="1.2"/><path d="M0,-84 l9,3 l-9,3 z" fill="#fce49a" stroke-width="1"/></g>')
    tav += ('<g transform="translate(1020 300)" opacity=".75" filter="url(#firka)" stroke="#8a7a9a" stroke-width="1.4"><rect x="-12" y="-14" width="24" height="14" fill="#e9e1f7"/><path d="M-15,-13 Q0,-30 15,-13 Z" fill="#9ec9f0"/></g>')
    # a nagyfa (a Nagyfa tér) balra hátul
    tav += ('<g transform="translate(40 418)" opacity=".8" filter="url(#firka)"><path d="M-14,0 Q-10,-50 -16,-96 H16 Q10,-50 14,0 Z" fill="#a88a72"/>'
            '<path d="%s" fill="#a9d79a"/><path d="%s" fill="#9ccf8c"/><path d="%s" fill="#9ccf8c"/><path d="%s" fill="#fff" opacity=".2" stroke="none"/></g>') % (
        pamacs(0, -170, 110, 84, 12, r), pamacs(-80, -128, 60, 44, 8, r), pamacs(84, -134, 62, 46, 8, r), pamacs(-30, -220, 50, 26, 7, r, 1.2))
    # a Dallam-tér harangláb jobbra
    tav += ('<g transform="translate(1548 392)" opacity=".85" filter="url(#firka)" stroke="#534ab7" stroke-width="1.6"><path d="M-22,0 L-16,-96 M22,0 L16,-96 M-19,-40 H19 M-18,-70 H18" stroke-width="6" fill="none"/>'
            '<path d="M-32,-94 L0,-128 L32,-94 Z" fill="#8f86e0"/><g><path d="M-9,-60 Q0,-80 9,-60 Z" fill="#f2c14a" stroke="#b8903a" stroke-width="1.2"/>'
            '<animateTransform attributeName="transform" type="rotate" values="-8 0 -76;8 0 -76;-8 0 -76" dur="3s" repeatCount="indefinite"/></g></g>')
    tav += '<g filter="url(#firka)">'
    for x, y, h in ((300, 404, 86), (352, 412, 74), (600, 412, 70), (1290, 398, 84), (1680, 410, 90), (1760, 404, 76), (-200, 416, 80), (-120, 410, 70), (2000, 412, 86)):
        tav += fenyo(x, y, h, ["#8fb89a", "#7fae8c", "#9cc4a2"][int(r() * 3)])
    for x, y, rr in ((180, 420, 28), (470, 416, 26), (700, 420, 24), (1460, 414, 26), (1880, 424, 30), (-380, 420, 30), (2100, 420, 30)):
        tav += lomb(x, y, rr, ["#9cc79a", "#8fbf8f", "#a7cfa2"][int(r() * 3)])
    tav += '</g>'
    irj(M, "tavoli", KIFESTVE, FIRKA, tav)

    # közép: a rét, a dombocska, a legelő, az utca (fölfelé keskenyedik), a kúttér, a mellékösvény, az ér + tócsa, a 2 halvány díszlet-ház,
    # a pad (Bogyóé), lámpák, kerítés-maradék, bokrok, virág, fű, őszi levél
    koz = ('<rect x="%d" y="400" width="%d" height="%d" fill="url(#ret)"/>' % (BX0, BX1 - BX0, BY1 - 400) +
           '<path d="M%d,412 Q400,392 800,406 T%d,412 V460 H%d Z" fill="#c4e4b4"/>' % (BX0, BX1, BX0))
    cx, cy, rx, ry = U_DOMBOCSKA
    koz += '<g filter="url(#firka)"><path d="M%s,%s Q%s,%s %s,%s Q%s,%s %s,%s Z" fill="#c9e8b4" stroke="#a7cf92" stroke-width="2"/></g>' % (
        f(cx - rx - 60), f(cy + 30), f(cx - rx * .6), f(cy - ry * 1.6), f(cx), f(cy - ry), f(cx + rx * 1.3), f(cy - ry * .4), f(cx + rx + 160), f(cy + 30))
    lx, ly, lrx, lry = U_LEGELO
    koz += '<ellipse cx="%d" cy="%d" rx="%d" ry="%d" fill="#bfe6a8" stroke="#a7d08f" stroke-width="2"/>' % (lx, ly, lrx, lry)
    koz += fucsomok(Rnd(906), 40, lx - lrx + 10, lx + lrx - 10, ly - lry + 8, ly + lry - 6, c="#8fc47a", kihagy=lambda x, y: not ellben(U_LEGELO, x, y))
    koz += '<g filter="url(#firka)">'
    for x, y, rr in ((560, 470, 26), (680, 460, 30), (180, 500, 30), (-120, 520, 34), (-380, 500, 36), (1700, 520, 36), (1860, 500, 34), (2060, 540, 38)):
        koz += lomb(x, y, rr, ["#8fc98a", "#9fd19a", "#7fbf86", "#a7d99a"][int(r() * 4)])
    koz += '</g>'
    # a két halvány díszlet-ház helyén (a producer, 11-25: ne legyenek üres házak) fa és bokor
    koz += '<g filter="url(#firka)" stroke="%s" stroke-width="2">' % INK + lomb(236, 648, 40, "#94c983") + bokor(300, 652, 1.1) + bokor(186, 656, .9, "#86c07a", "#9fd19a") + '</g>'
    koz += '<g filter="url(#firka)" stroke="%s" stroke-width="2">' % INK + lomb(1010, 492, 30, "#8cc47f") + bokor(1062, 496, .9) + '</g>'
    # az ér a forrástól a tócsáig (a ház mögül bukkan elő), nád, kő
    tx, ty, trx, tryy = U_TO
    ed = sima(U_ER)
    koz += ('<path d="%s" stroke="#a6cf92" stroke-width="44" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' % ed +
            '<ellipse cx="%d" cy="%d" rx="%d" ry="%d" fill="#a6cf92"/>' % (tx, ty + 2, trx + 10, tryy + 8) +
            '<path d="%s" stroke="#7fb3d6" stroke-width="32" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' % ed +
            '<path d="%s" stroke="url(#vizU)" stroke-width="26" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' % ed +
            '<ellipse cx="%d" cy="%d" rx="%d" ry="%d" fill="url(#vizU)" stroke="#7fb3d6" stroke-width="3"/>' % (tx, ty, trx, tryy))
    koz += '<g filter="url(#firka)" stroke="%s" stroke-width="1.6">' % INK + "".join('<ellipse cx="%d" cy="%d" rx="%d" ry="%d" fill="#e3dccb"/>' % q for q in ((836, 528, 12, 6), (822, 540, 8, 4), (850, 546, 7, 4))) + '</g>'
    # a mellékösvény (a bokros kerthez) és a kúttér
    koz += ut(U_MELLEK, 34)
    kx, ky, krx, kry = U_KUTTER
    koz += ('<ellipse cx="%d" cy="%d" rx="%d" ry="%d" fill="#d9c79c"/><ellipse cx="%d" cy="%d" rx="%d" ry="%d" fill="#efe0c4"/>' % (kx, ky, krx + 4, kry + 4, kx, ky, krx, kry))
    koz += "".join('<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="#e2cfaa" opacity=".9"/>' % (f(kx + (r() - .5) * krx * 1.6), f(ky + (r() - .5) * kry * 1.4), f(8 + r() * 6), f(3 + r() * 2)) for _ in range(14))
    # az utca: szakaszonként keskenyedik; macskakő-foltok
    for i in range(len(U_SEG)):
        koz += '<path d="%s" stroke="#d9c79c" stroke-width="%s" fill="none" stroke-linecap="round"/>' % (utca_d(i), f(U_SZEL[i] + 8))
    for i in range(len(U_SEG)):
        koz += '<path d="%s" stroke="#efe0c4" stroke-width="%s" fill="none" stroke-linecap="round"/>' % (utca_d(i), f(U_SZEL[i]))
    for px, py, w in UP[::3]:
        if r() < .7:
            koz += '<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="#e2cfaa" opacity=".9"/>' % (f(px + (r() - .5) * w * .7), f(py + (r() - .5) * w * .3), f(w * .1 + r() * 4), f(w * .04 + 1.5))
    # Bogyó padja a kúttér szélén
    bx, by = U_BOGYO
    koz += fok('<path d="M%s,%s V%s M%s,%s V%s" stroke="#8a5a3a" stroke-width="5"/><path d="M%s,%s H%s V%s H%s Z" fill="#c99a6a"/>' % (
        f(bx - 38), f(by), f(by - 18), f(bx + 38), f(by), f(by - 18), f(bx - 46), f(by - 18), f(bx + 46), f(by - 25), f(bx - 46)), 1.6)
    # lámpák az utca mentén (nem koppinthatók)
    for lx_, ly_ in ((470, 912), (748, 884), (1300, 474)):
        koz += fok('<path d="M%s,%s V%s" stroke="#6e5a4a" stroke-width="4"/><path d="M%s,%s h18 l-3,-16 h-12 z" fill="#fff3c4"/><path d="M%s,%s h22 l-11,-9 z" fill="#6e5a4a"/>' % (
            f(lx_), f(ly_), f(ly_ - 74), f(lx_ - 9), f(ly_ - 74), f(lx_ - 11), f(ly_ - 90)), 1.6)
    # bokrok, virág, fű, őszi levelek
    koz += '<g filter="url(#firka)" stroke="%s" stroke-width="2">' % INK
    for x, y, s in ((40, 700, 1.2), (470, 740, 1.0), (930, 470, .9), (1520, 560, 1.1), (1600, 660, 1.2), (690, 680, .8), (-200, 760, 1.3), (1880, 760, 1.3), (1960, 600, 1.1), (-420, 640, 1.2), (440, 560, .9), (1700, 860, 1.3), (-300, 900, 1.3)):
        if not foglalt(x, y):
            koz += bokor(x, y, s)
    koz += '</g>'
    koz += fucsomok(r, 460, BX0, BX1, 440, BY1, kihagy=foglalt)
    koz += viragok(r, 150, BX0, BX1, 450, BY1, kihagy=foglalt)
    koz += ''.join('<path transform="translate(%s %s) rotate(%d)" d="M0,0 q5,-6 10,0 q-5,6 -10,0 Z" fill="%s" opacity=".85"/>' % (
        f(x), f(y), int(r() * 180), ["#e8b878", "#d9a05a", "#e9884a"][int(r() * 3)]) for x, y in ((BX0 + r() * (BX1 - BX0), 460 + r() * (BY1 - 460)) for _ in range(90)) if not foglalt(x, y))
    irj(M, "kozep", KIFESTVE, FIRKA + '<linearGradient id="ret" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d4ecc4"/><stop offset="1" stop-color="#b9dc9c"/></linearGradient>'
        '<linearGradient id="vizU" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#c4e6f4"/><stop offset="1" stop-color="#8cc6e4"/></linearGradient>', koz)

    # előtér: fű és bokor a jobb alsó sarokban és középen lent (a bal alsó bejárat szabad), fent balra lelógó lomb
    elo = '<g filter="url(#firka)" stroke="%s" stroke-width="2" fill="#a9d79a">' % INK
    elo += '<path d="M600,%d L610,946 Q760,926 900,944 L910,%d Z"/>' % (BY1 + 10, BY1 + 10)
    elo += '<path d="M1320,%d L1330,936 Q1600,906 1900,926 Q2050,910 %d,920 L%d,%d Z"/></g>' % (BY1 + 10, BX1 + 10, BX1 + 10, BY1 + 10)
    elo += '<g filter="url(#firka)" stroke="%s" stroke-width="2">' % INK + bokor(1480, 960, 1.6) + bokor(1720, 950, 1.5, "#7fbf86", "#9fd19a") + bokor(760, 966, 1.2) + '</g>'
    re_ = Rnd(93)
    for cx_, cy_, k in ((-440, -110, 1), (-240, -120, .9), (-60, -110, .7), (2080, -110, 1), (1900, -120, .8)):
        elo += '<g filter="url(#firka)"><path d="%s" fill="%s" stroke="%s" stroke-width="2"/><path d="%s" fill="#fff" opacity=".18" stroke="none"/></g>' % (
            pamacs(cx_, cy_, 170 * k, 110 * k, 10, re_), ["#7fbf7a", "#86c47c", "#76b672"][int(re_() * 3)], INK, pamacs(cx_ - 30 * k, cy_ - 20 * k, 70 * k, 40 * k, 7, re_, 1.2))
    elo += fucsomok(Rnd(98), 120, 560, BX1, 920, 960, c="#7fae6a", kihagy=lambda x, y: x < 600)
    irj(M, "eloter", KIFESTVE, FIRKA, elo)

    # mozgó: felhők, csillogó víz az éren, füst a díszlet-házakból, lepkék; fölül szálló őszi levelek, madárcsapat
    csillam = ""
    for i, x in enumerate((870, 930, 990, 1050, 1110)):
        y = er_y(x)
        csillam += ('<path d="M%s,%s q12,4 24,2" stroke="#fff" stroke-width="2.6" stroke-linecap="round" fill="none" stroke-dasharray="8 22">'
                    '<animate attributeName="stroke-dashoffset" values="0;-60" dur="%ss" repeatCount="indefinite"/><animate attributeName="opacity" values=".2;.85;.2" dur="%ss" repeatCount="indefinite"/></path>') % (
            f(x - 12), f(y - 2), f(1.8 + (i % 3) * .3), f(2.6 + (i % 2) * .8))
    csillam += ('<ellipse cx="1176" cy="558" rx="14" ry="3" fill="none" stroke="#fff" stroke-width="2"><animate attributeName="rx" values="4;24" dur="3s" repeatCount="indefinite"/>'
                '<animate attributeName="opacity" values=".9;0" dur="3s" repeatCount="indefinite"/></ellipse>')
    also = ('<g id="also" pointer-events="none">\n<g>' + uszo_felho(380, 20, 1.0, 80, 120) + uszo_felho(1460, 50, 1.2, -70, 150) + uszo_felho(-260, 60, 1.1, 60, 130) + "</g>\n" + csillam + "\n" +
            "\n" +
            lepke(560, 640, "#f6a5c0", 14, "0,0;80,-40;160,10;60,30;0,0") + lepke(1500, 640, "#fce49a", 16, "0,0;-70,-20;-110,20;-30,30;0,0") + lepke(380, 700, "#c9a8e6", 13, "0,0;60,-24;100,6;30,20;0,0") + "\n</g>\n")
    levelek = '<g opacity=".9">' + ''.join(('<path d="M%s,%s q3,-4 6,0 q-3,4 -6,0 Z" fill="%s"><animateTransform attributeName="transform" type="translate" values="0,0;%s,%s" dur="%ss" begin="%ss" repeatCount="indefinite"/>'
                                            '<animate attributeName="opacity" values="0;1;1;0" dur="%ss" begin="%ss" repeatCount="indefinite"/></path>') % (
        f(120 + i * 250), f(200 + (i % 3) * 40), ["#e8b878", "#e9884a", "#d9a05a"][i % 3], 40 + i * 6, 400 + i * 20, 10 + i, i * 1.6, 10 + i, i * 1.6) for i in range(6)) + '</g>'
    felso = ('<g id="felso" pointer-events="none">\n' + csapat(-140, 130, 1, 1900, 48) + "\n" + levelek + "\n</g>")
    irj(M, "mozgo", KIFESTVE, "".join([MADAR, ULO]), also + felso, elotag="vm-")

    # díszlet-fájlok: a kút (a vödör jár), a tyúk (magot keres), Bogyó (a padon szundít)
    dob = {}
    for nev, fn in (("kut", u_kut), ("tyuk", u_tyuk), ("bogyo", u_bogyo)):
        s, vb = fn()
        irj(M, nev, vb, FIRKA, s)
        dob[nev] = vb

    # házak (5 állapot) és helyek (3 állapot)
    for nev, fn, alap, sd in (("letra", u_letra, U_LETRA, 81), ("csalad", u_csalad, U_CSALAD, 82), ("nagyhaz", u_nagyhaz, U_NAGY, 83)):
        dob[nev] = haz_fajlok(M, nev, alap, fn(), sd)
    kereg = '<linearGradient id="kereg2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#b48460"/><stop offset="1" stop-color="#8a5e40"/></linearGradient>'
    alapr, bere, virag, lako = u_favago()
    dob["favago"] = hely3_fajlok(M, "favago", U_FAVAGO, (-170, -150, 176, 46), "", alapr, bere, virag, lako, 91)
    alapr, bere, virag, lako = u_korte()
    dob["korte"] = hely3_fajlok(M, "korte", U_KORTE, (-156, -276, 150, 30), kereg, alapr, bere, virag, lako, 92)
    k0 = (U_KOVEK_X[2], round(er_y(U_KOVEK_X[2])))
    alapr, bere, virag, lako, _ = u_kovek(*k0)
    dob["kovek"] = hely3_fajlok(M, "kovek", k0, (-160, -96, 160, 26), "", alapr, bere, virag, lako, 93)
    alapr, bere, virag, lako = u_kerites()
    dob["kerites"] = hely3_fajlok(M, "kerites", U_KERITES, (-132, -100, 132, 22), "", alapr, bere, virag, lako, 94)
    alapr, bere, virag, lako = u_kert()
    dob["bokroskert"] = hely3_fajlok(M, "bokroskert", U_KERT, (-156, -150, 156, 40), "", alapr, bere, virag, lako, 95)
    return dob


def utca_tabla():
    """a helyek.js HELYEK["osszeado-utca"] pontjai, útjai, járható részei és patakja (arányban) — ide írva, hogy a rajz és a tábla együtt mozduljon"""
    UP = utca_pontok(30)
    def pont(x):   # a középvonal pontja x-nél (a mellékösvénynél az első találat)
        return min(UP, key=lambda p: abs(p[0] - x))
    R = lambda p: "[%.3f, %.3f]" % (p[0] / W, p[1] / H)
    allx = [("kapu", 186), ("favago", 330), ("korte", 648), ("letra", 820), ("kanyar", 900), ("kovek", 1000), ("kerites", 1236), ("elag", 1287), ("nagyhaz", 1362)]
    cs = {k: pont(x) for k, x in allx}
    print("  all / pontok:")
    for k, _ in allx:
        print("    %s: %s" % (k, R(cs[k])))
    # utak a középvonal mentén
    idx = {k: UP.index(cs[k]) for k, _ in allx}
    print("  utak:")
    for (a, _), (b, _) in zip(allx, allx[1:]):
        koz = UP[idx[a] + 1:idx[b]][::6]
        print('    ["%s", "%s", [%s]],' % (a, b, ", ".join(R(p) for p in koz)))
    # járható: az utca sávja (középvonal ± fél szélesség + 4)
    bal, jobb = [], []
    for i in range(0, len(UP), 5):
        x, y, w = UP[i]
        a = UP[min(i + 1, len(UP) - 1)]; b = UP[max(i - 1, 0)]
        dx, dy = a[0] - b[0], a[1] - b[1]; L = (dx * dx + dy * dy) ** .5 or 1
        nx, ny = -dy / L, dx / L
        hw = w / 2 + 4
        bal.append((x + nx * hw, y + ny * hw)); jobb.append((x - nx * hw, y - ny * hw))
    poly = bal + jobb[::-1]
    print("  jarhato (utca): [%s]" % ", ".join(R(p) for p in poly))
    import math
    cx, cy, rx, ry = U_KUTTER
    print("  jarhato (kúttér): [%s]" % ", ".join(R((cx + math.cos(a / 12 * 2 * math.pi) * (rx - 10), cy + math.sin(a / 12 * 2 * math.pi) * (ry - 6))) for a in range(12)))
    m = U_MELLEK
    print("  jarhato (mellékösvény): [%s]" % ", ".join(R(p) for p in ((m[0][0] - 20, m[0][1] - 14), (m[0][0] + 22, m[0][1] - 8), (m[2][0] + 22, m[2][1] - 8), (m[2][0] + 6, m[2][1] + 22), (m[2][0] - 24, m[2][1] + 10), (m[0][0] - 18, m[0][1] + 18))))
    q = ivpontok(U_ER, 2)
    tx, ty, rx, ry = U_TO
    print("  patak: [%s]" % ", ".join(R(p) for p in q + [(tx + rx, ty)]))
    print("  kövek y:", [round(er_y(x)) for x in U_KOVEK_X])


# ══════════════════ AZ ÖSSZEADÓ UTCA TÁJ-KÉPE (a világtérképen) ══════════════════
# A kanyargó utca kicsinyített mása: bal lent indul, kanyarog fölfelé jobbra; a létrás ház (türkiz tető), a kacsák sárga háza,
# a körtefa, a kút, fönt a dombocskán a nagy ház. A megálló (all, a tájon .735/.715) a hely jobb oldalán, a kép jobb alsó sarkánál.
TAJ_UTCA_DOBOZ = (1022, 494, 174, 148)     # a rajz saját kerete (1-szeresen)
TAJ_UTCA_TALP, TAJ_UTCA_K = (1104, 640), 1.7
def taj_osszeado_utca():
    r = Rnd(331)
    ut_ = 'M1030,640 Q1060,626 1086,624 Q1110,622 1118,606 Q1126,590 1142,586 Q1160,582 1164,566 Q1168,552 1178,546'
    utca = ('<path d="%s" stroke="#d9c79c" stroke-width="9" fill="none" stroke-linecap="round"/><path d="%s" stroke="#f4e6c4" stroke-width="6.4" fill="none" stroke-linecap="round"/>'
            '<ellipse cx="1124" cy="626" rx="14" ry="5" fill="#efe0c4" stroke="#d9c79c" stroke-width="1"/>') % (ut_, ut_)
    def haz(w, h, tH, cs, fal, teto, dol, ablak=1):
        s = ('<g transform="rotate(%s)"><path d="M%s,0 V%s H%s V0 Z" fill="%s"/><path d="M%s,%s L%s,%s L%s,%s Z" fill="%s"/>'
             '<path d="M-1.6,0 V-4 Q0,-6 1.6,-4 V0 Z" fill="#a8764f" stroke-width=".7"/>') % (
            dol, f(-w / 2), f(-h), f(w / 2), fal, f(-w / 2 - 2), f(-h + 1), f(cs), f(-h - tH), f(w / 2 + 2), f(-h + 1), teto)
        for i in range(ablak):
            s += '<rect x="%s" y="%s" width="3.2" height="3" fill="#e9f4fb" stroke-width=".6"/>' % (f(-w / 2 + 2 + i * (w - 7) / max(1, ablak - 1) if ablak > 1 else -w / 2 + 2), f(-h * .7))
        return s + '</g>'
    letra = haz(10, 18, 7, 1, "#fff1d6", "#5fb3ad", -2, 1) + '<path d="M6,0 L4.6,-16 M8.4,0 L7,-16" stroke="#8a5a3a" stroke-width=".9"/>'
    csalad = haz(22, 12, 7, -4, "#fde9b0", "#c96a4a", 1.5, 4)
    nagy = haz(20, 18, 10, 1, "#f6d6c4", "#9a5a3a", -1, 2) + '<circle cx="1" cy="-23" r="1.6" fill="#e9f4fb" stroke-width=".6"/>'
    hatter = '<path d="%s" fill="#94c983"/>' % pamacs(1052, 602, 8, 6, 6, r)
    korte_ = '<path d="M-1.6,0 V-7 H1.6 V0 Z" fill="#8a5e40"/><path d="%s" fill="#9ccf8c"/>' % pamacs(0, -13, 8, 7, 7, r) + "".join(
        '<circle cx="%s" cy="%s" r="1.1" fill="#e4d65a" stroke="none"/>' % (f(-4 + i * 3), f(-12 - (i % 2) * 3)) for i in range(3))
    kut = '<ellipse cx="0" cy="0" rx="3.6" ry="1.4" fill="#e6dccb"/><path d="M-3.6,0 V-3 H3.6 V0" fill="#e6dccb"/><path d="M-3,-3 V-8 M3,-3 V-8" stroke="#8a5a3a" stroke-width=".8"/><path d="M-5,-7.6 L0,-11 L5,-7.6 Z" fill="#c98b5e"/>'
    er = '<path d="M1114,596 Q1126,602 1138,598 Q1146,596 1152,598" stroke="#7fb3d6" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M1114,596 Q1126,602 1138,598 Q1146,596 1152,598" stroke="#bfe3f3" stroke-width="2" fill="none" stroke-linecap="round"/>'
    kerites = '<path d="M1142,576 H1160 M1142,572 H1160 M1144,578 V570 M1150,578 V570 M1156,578 V570" stroke="#a07a54" stroke-width=".9"/>'
    domb = '<path d="M1150,556 Q1170,536 1190,540 Q1200,544 1196,556 Z" fill="#c9e8b4" stroke="#a7cf92" stroke-width="1"/>'
    g = lambda s: '<g filter="url(#firka)" stroke="%s" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">%s</g>' % (INK, s)
    arny = arnyek(1100, 630, 76, 6, .08)
    # a producer (11-25, 2. kör): még mindig elveszett → a házak, a körtefa és a kút saját magukban is nagyobbak (vastagabb körvonallal)
    rkk = lambda x, y, s, k: '<g transform="translate(%s %s) scale(%s)">%s</g>' % (f(x), f(y), k, s)
    K = 1.6
    HAZAK = ((1096, 616, letra, (1087, 576, 1105, 616)), (1146, 636, csalad, (1128, 602, 1164, 636)), (1176, 546, nagy, (1160, 500, 1192, 546)))
    alap = (arny + domb + utca + er + g(kerites) + hatter + g(rkk(1060, 630, korte_, 1.5)) + g(rkk(1116, 624, kut, 1.5)) +
            g("".join(rkk(x, y, s, K) for x, y, s, _ in HAZAK)))
    elo = fust(1178, 498, 2, 5, 12) + ('<g><circle cx="0" cy="0" r="1.3" fill="#ece6f0" stroke="#9187a3" stroke-width=".5"/>'
                                       '<animateMotion path="M1120,598 Q1126,590 1132,598 Q1138,590 1144,598" keyPoints="0;1;1;0;0" keyTimes="0;.4;.5;.9;1" calcMode="linear" dur="5s" repeatCount="indefinite"/></g>')
    virag = taj_viragsor(Rnd(85), 1036, 1080, 638, 6) + taj_viragsor(Rnd(86), 1130, 1166, 640, 6) + taj_csillam(((1096, 570), (1176, 494), (1146, 598)))
    defs = FIRKA + SZURKE
    # a producer (11-25): a világtérképen alig látszott → 1,7-szeres, a talppont (TAJ_UTCA_TALP) körül
    tx, ty = TAJ_UTCA_TALP
    nagy = lambda s: '<g transform="translate(%s %s) scale(%s) translate(%s %s)">%s</g>' % (tx, ty, TAJ_UTCA_K, -tx, -ty, s)
    x0, y0, w0, h0 = TAJ_UTCA_DOBOZ
    vb = (round(tx + (x0 - tx) * TAJ_UTCA_K), round(ty + (y0 - ty) * TAJ_UTCA_K), round(w0 * TAJ_UTCA_K), round(h0 * TAJ_UTCA_K))
    irj("vilag", "osszeado-utca-kesz", vb, defs, nagy(alap + elo))
    irj("vilag", "osszeado-utca-viragos", vb, defs, nagy(alap + elo + virag))
    irj("vilag", "osszeado-utca-epul", vb, defs, nagy('<g opacity=".5" filter="url(#szurke)">' + alap + '</g>' + "".join(taj_allv(rr) for _, _, _, rr in HAZAK)))
    return {"osszeado-utca (táj)": vb}



# ══════════════════ DALLAM-TÉR (6. kör, kódkör, 2026-11-25) ══════════════════
# Terv: Matekos/vilagkep-6-kor-dallam-ter.html (✅ 2026-11-25, mind A). Kerek, macskaköves tér a harangláb körül: bal lent érkezik
# (az Összeadó utca felől; balra hátul a dombocskán az utca nagy háza), körben ferdén, más-más tetővel a kerek ház (egy-szam),
# a Holdfény-ház (holdfeny-bujocska), a répás kamra (mi-maradt), a harangjátékos ház (vegyes-szorzo); elöl a kút (osztas-100),
# középen a harangláb (szorzo-dallam); jobbra hátul az üres pódium. Lila tetők, arany harangok. Minden lakó a pálya mozdulatát
# csinálja, szám és felirat nélkül. dallam_tabla() kiírja a helyek.js pontjait, útjait, járható részét és gátját.
D_TER = (800, 712, 440, 150)                # a tér (ellipszis)
D_TALAP = (800, 652, 80, 24)                # a harangláb talapzata (nem járható)
D_HARANG, D_KEREK, D_HOLD, D_KAMRA, D_HJ, D_KUT = (800, 652), (300, 714), (585, 548), (1090, 548), (1300, 738), (1112, 846)
D_PODIUM, D_FA = (1462, 640), (118, 604)
D_BEJ = [(-260, 1010), (60, 940), (260, 870), (452, 800)]
D_CSENGO = (236, 452)                       # a szélcsengő akasztója (a fa ága)
LILA, LILA_A = "#9585e0", "#5e4ea8"


def f3(v):
    return "%.3f" % v

def harang_d(r, c="#f2c14e", cs="#a8782a"):
    """harang: az akasztó (0,0)-ban, lefelé lóg"""
    return ('<path d="M0,0 V%s" stroke="#6e5a4a" stroke-width="1.6"/>'
            '<path d="M%s,%s Q%s,%s %s,%s H%s Q%s,%s %s,%s Q0,%s %s,%s Z" fill="%s" stroke="%s" stroke-width="1.6"/>'
            '<ellipse cx="0" cy="%s" rx="%s" ry="%s" fill="%s" stroke="%s" stroke-width="1.4"/><circle cx="0" cy="%s" r="%s" fill="#8a6a3a" stroke="none"/>'
            '<path d="M%s,%s Q%s,%s %s,%s" stroke="#fff" stroke-width="%s" opacity=".55" fill="none" stroke-linecap="round"/>') % (
        f(r * .3), f(-r * .55), f(r * .35), f(-r * .62), f(r * 1.3), f(-r), f(r * 1.6), f(r), f(r * .62), f(r * 1.3), f(r * .55), f(r * .35), f(-r * .1), f(-r * .55), f(r * .35), c, cs,
        f(r * 1.6), f(r), f(r * .2), c, cs, f(r * 1.85), f(r * .2), f(-r * .3), f(r * .55), f(-r * .45), f(r * 1.05), f(-r * .62), f(r * 1.38), f(max(1.2, r * .14)))

def leng_ki(s, x, y, fok_, dur, kezdok, hossz):
    """egyszeri (vagy többszöri) meglendülés a ciklus kezdok-időpontjaiban (arány), egyébként áll"""
    k, v = [0.0], [0.0]
    for t in sorted(kezdok):
        for dt, a in ((0, 0), (.25, fok_), (.5, -fok_ * .7), (.75, fok_ * .35), (1, 0)):
            tt = min(1.0, t + hossz * dt)
            if tt < k[-1]: tt = k[-1]
            k.append(tt); v.append(a)
    if k[-1] < 1: k.append(1.0); v.append(0)
    return ('<g>%s<animateTransform attributeName="transform" type="rotate" values="%s" keyTimes="%s" dur="%ss" repeatCount="indefinite"/></g>') % (
        s, ";".join("%s %s %s" % (f(a), f(x), f(y)) for a in v), ";".join(f3(t) for t in k), dur)

def diszkret(vals, idok, dur, attr, tipus=None):
    """discrete animáció: vals[i] az idok[i]-től (idok[0] = 0)"""
    if tipus:
        return '<animateTransform attributeName="transform" type="%s" calcMode="discrete" values="%s" keyTimes="%s" dur="%ss" repeatCount="indefinite"/>' % (
            tipus, ";".join(vals), ";".join(f3(t) for t in idok), dur)
    return '<animate attributeName="%s" calcMode="discrete" values="%s" keyTimes="%s" dur="%ss" repeatCount="indefinite"/>' % (attr, ";".join(vals), ";".join(f3(t) for t in idok), dur)

def hangjegy(c="#6a5f8a"):
    return ('<g><ellipse cx="0" cy="0" rx="4.6" ry="3.4" transform="rotate(-22)" fill="%s"/><path d="M4,-1 V-17 q7,2 8,9" stroke="%s" stroke-width="2" fill="none" stroke-linecap="round"/></g>') % (c, c)

def fel_szall(s, x0, y0, dx, dy, dur, b):
    return ('<g opacity="0"><g transform="translate(%s %s)">%s</g><animateTransform attributeName="transform" type="translate" values="0,0;%s,%s" dur="%ss" begin="%ss" repeatCount="indefinite"/>'
            '<animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.15;.7;1" dur="%ss" begin="%ss" repeatCount="indefinite"/></g>') % (f(x0), f(y0), s, f(dx), f(dy), dur, f(b), dur, f(b))


# ── a harangláb (szorzo-dallam): Mia ütemre húzza a kötelet, a három harang sorban leng (kicsi, nagy, közepes), hangjegyek szállnak ──
def d_harang():
    talap = ('<ellipse cx="0" cy="4" rx="92" ry="24" fill="#3c2a50" opacity=".1" stroke="none"/>' +
             fok('<path d="M-80,0 V-26 A80 22 0 0 0 80 -26 V0 A80 22 0 0 1 -80 0 Z" fill="#ddd3c4"/><ellipse cx="0" cy="-26" rx="80" ry="22" fill="#eee6da"/>'
                 '<path d="M-80,-12 Q0,6 80,-12 M-50,-4 V8 M-10,0 V12 M30,-2 V10 M62,-8 V4" stroke-width="1.1" opacity=".5" fill="none"/>', 2))
    fa = lambda d, w: '<path d="%s" stroke="%s" stroke-width="%s" fill="none" stroke-linecap="round"/><path d="%s" stroke="#b5855a" stroke-width="%s" fill="none" stroke-linecap="round"/>' % (d, INK, w + 4, d, w)
    lab = fa("M-58,-34 L-46,-266 M58,-34 L46,-266", 7) + fa("M-55,-96 L51,-190 M55,-96 L-51,-190", 4) + fa("M-56,-96 H56 M-51,-190 H51", 4)
    kamra = fa("M-62,-266 H62", 7) + fa("M-48,-266 V-330 M48,-266 V-330", 5) + fa("M-56,-328 H56", 6)
    teto = ('<path d="M-78,-330 Q-40,-352 0,-412 Q40,-352 78,-330 Q0,-342 -78,-330 Z" fill="%s"/>'
            '<path d="M0,-412 Q40,-352 78,-330 Q40,-336 6,-338 Z" fill="#3c2f5e" opacity=".12" stroke="none"/>'
            '<path d="M-58,-342 Q0,-352 58,-342 M-38,-362 Q0,-370 38,-362 M-20,-384 Q0,-390 20,-384" stroke="%s" stroke-width="1.3" fill="none"/>'
            '<path d="M-62,-336 Q-34,-356 -6,-398" stroke="#fff" stroke-width="4" opacity=".3" fill="none" stroke-linecap="round"/>'
            '<path d="M0,-412 V-422" stroke-width="2"/><circle cx="0" cy="-428" r="7" fill="#f2c14e"/>') % (LILA, LILA_A)
    def alapr(a):
        return talap + fok(lab + kamra + teto, 2)
    pad = fok('<path d="M-130,4 V-14 M-92,4 V-14" stroke="#8a5a3a" stroke-width="4"/><path d="M-138,-14 H-84 V-21 H-138 Z" fill="#c99a6a"/>', 1.6)
    bere = pad + zaszlo(0, -434, 22, 26, 3.2, "#f6a5c0", "#c9607a")
    rv = Rnd(612)
    fuzer = '<path d="M-62,-262 Q-31,-246 0,-262 Q31,-246 62,-262" stroke="#7fae6a" stroke-width="2.4" fill="none"/>' + "".join(
        '<circle cx="%s" cy="%s" r="3.6" fill="%s" stroke="%s" stroke-width=".7"/>' % (f(-56 + i * 14), f(-256 + 6 * (1 - ((i % 4.5) / 2.25 - 1) ** 2)), VSZ[i % 5], INK) for i in range(9))
    szalag = "".join(lengo('<path d="M%s,-330 q-6,26 2,48 q5,14 -2,30" stroke="%s" stroke-width="3.4" fill="none" stroke-linecap="round"/>' % (f(x), c), x, -330, 6, d)
                     for x, c, d in ((-76, "#f6a5c0", 2.6), (76, "#c9a8e6", 3.1)))
    cserep = "".join('<g transform="translate(%s 2)"><path d="M-10,0 L-12,-14 H12 L10,0 Z" fill="#c98b5e" stroke="%s" stroke-width="1.2"/>%s</g>' % (
        f(x), INK, "".join('<circle cx="%s" cy="-18" r="3" fill="%s" stroke="%s" stroke-width=".6"/>' % (f(-6 + j * 6), VSZ[(j + i) % 5], INK) for j in range(3))) for i, x in enumerate((-70, 70)))
    virag = fuzer + szalag + cserep + "".join('<circle cx="%s" cy="%s" r="%s" fill="%s" stroke="%s" stroke-width=".6"/>' % (
        f(-120 + rv() * 240), f(14 + rv() * 10), f(2.2 + rv() * 1.4), VSZ[int(rv() * 5)], INK) for _ in range(18)) + taj_csillam(((-90, -300), (0, -450), (90, -290), (-70, -150)))
    def lako(a):
        D = 3.6
        harangok = [(-30, 9, 0), (0, 15, 1 / 3), (30, 12, 2 / 3)] if a != "kopar" else [(0, 15, None)]
        hs = ""
        for x, r, t in harangok:
            b = '<g transform="translate(%s -326)">%s</g>' % (f(x), harang_d(r))
            hs += leng_ki(b, x, -326, 16, D, [t] if t is not None else [0, 1 / 3, 2 / 3], .3)
        # a kötél a kamra padlójától Mia kezéig; húzáskor lejjebb jön
        kotel = ('<g><path d="M24,-264 Q40,-170 62,-70" stroke="#c9a77e" stroke-width="3" fill="none"/><path d="M24,-264 Q40,-170 62,-70" stroke="#8a6a4a" stroke-width="1" fill="none" stroke-dasharray="3 4"/>'
                 '<circle cx="62" cy="-68" r="4" fill="#d9434e" stroke="%s" stroke-width="1"/>'
                 '<animateTransform attributeName="transform" type="translate" values="0,0;0,9;0,0" keyTimes="0;.25;1" dur="%ss" repeatCount="indefinite"/></g>') % (INK, f(D / 3))
        mia = ('<g>' + figura("mia", 84, 4, .5, tukor=True) +
               '<animateTransform attributeName="transform" type="translate" values="0,0;-2,7;0,0" keyTimes="0;.25;1" dur="%ss" repeatCount="indefinite"/></g>') % f(D / 3)
        jegyek = "".join(fel_szall(hangjegy(c), x, -300, dx, -150, D, b) for x, dx, c, b in ((-30, -26, "#6a5f8a", 0), (0, 10, "#9585e0", D / 3), (30, 30, "#c96a9a", 2 * D / 3)))
        return kotel + mia + hs + jegyek
    return alapr, bere, virag, lako


# ── a kút (osztas-100): Brekus a vödörből sorban tölt a négy kannába; a víz mind a négyben egyformán nő ──
def d_kut():
    kut = (arnyek(4, 4, 46, 8) +
           fok('<ellipse cx="0" cy="0" rx="36" ry="11" fill="#cfc4b4"/><path d="M-36,0 V-34 A36 11 0 0 0 36 -34 V0 A36 11 0 0 1 -36 0 Z" fill="#e6dccb"/>'
               '<path d="M-36,-12 Q0,-2 36,-12 M-36,-24 Q0,-14 36,-24 M-20,-34 V-22 M12,-30 V-18 M-4,-20 V-8 M24,-20 V-8 M-26,-10 V0" stroke-width="1.1" opacity=".55"/>'
               '<ellipse cx="0" cy="-34" rx="36" ry="11" fill="#7fb3d6"/><ellipse cx="-6" cy="-36" rx="16" ry="4" fill="#fff" opacity=".4" stroke="none"/>'
               '<path d="M-31,-34 V-100 M31,-34 V-100" stroke="#8a5a3a" stroke-width="6"/><path d="M-31,-34 V-100 M31,-34 V-100" stroke="#b07a52" stroke-width="3"/>'
               '<path d="M-52,-94 Q-24,-112 0,-138 Q24,-112 52,-94 Q0,-100 -52,-94 Z" fill="%s"/><path d="M0,-138 Q24,-112 52,-94 Q26,-97 4,-98 Z" fill="#3c2f5e" opacity=".12" stroke="none"/>'
               '<path d="M-34,-104 Q0,-112 34,-104 M-18,-120 Q0,-125 18,-120" stroke="%s" stroke-width="1.1" fill="none"/>'
               '<path d="M-31,-84 H31" stroke="#6e5a4a" stroke-width="5"/><path d="M31,-84 h10 v10" stroke="#6e5a4a" stroke-width="3" fill="none"/>'
               '<path d="M0,-84 V-62" stroke="#6e5a4a" stroke-width="1.5"/><path d="M-9,-62 h18 l-3,14 h-12 z" fill="#b98a64"/>' % (LILA, LILA_A), 2))
    fold = '<ellipse cx="80" cy="14" rx="130" ry="20" fill="#e8dcc0" stroke="#d2c29c" stroke-width="2"/>'
    def alapr(a):
        return fold + kut
    bere = fok('<g transform="translate(0 -140)"><path d="M0,0 V-8" stroke-width="1.4"/><path d="M-9,-10 Q0,-18 9,-12 L14,-14 L10,-9 Q0,-4 -9,-10 Z" fill="#f2c14e" stroke-width="1.2"/></g>'
               '<g transform="translate(-50 10)"><path d="M-10,0 L-12,-14 H12 L10,0 Z" fill="#a8c8d8"/><ellipse cy="-14" rx="12" ry="3" fill="#bfe3f3" stroke-width="1"/></g>', 1.4)
    rv = Rnd(622)
    virag = ('<g transform="translate(-40 14)"><path d="M-22,-2 h44 l-3,-10 h-38 z" fill="#c99a6a" stroke="%s" stroke-width="1.2"/>' % INK +
             "".join('<circle cx="%s" cy="-15" r="3.4" fill="%s" stroke="%s" stroke-width=".7"/>' % (f(-17 + i * 7), VSZ[i % 5], INK) for i in range(6)) + '</g>' +
             '<path d="M-31,-60 q-10,-10 -4,-24 M31,-60 q10,-10 4,-24" stroke="#7fae6a" stroke-width="2" fill="none"/>' +
             "".join('<circle cx="%s" cy="%s" r="3" fill="%s" stroke="%s" stroke-width=".6"/>' % (f(x), f(y), VSZ[i % 5], INK) for i, (x, y) in enumerate(((-35, -70), (-38, -82), (35, -70), (38, -82))))
             + "".join('<circle cx="%s" cy="%s" r="%s" fill="%s" stroke="%s" stroke-width=".6"/>' % (f(-50 + rv() * 260), f(24 + rv() * 8), f(2.2 + rv() * 1.4), VSZ[int(rv() * 5)], INK) for _ in range(16))
             + taj_csillam(((-40, -120), (40, -110), (150, -40))))
    KX = (62, 96, 130, 164)
    def kanna(x):
        return ('<path d="M%s,16 L%s,-8 H%s L%s,16 Z" fill="#8fbfd8"/><path d="M%s,-4 L%s,-16" stroke-width="2.6"/><path d="M%s,-6 q-8,0 -7,9" stroke-width="2" fill="none"/>') % (
            f(x - 10), f(x - 9), f(x + 9), f(x + 10), f(x + 9), f(x + 18), f(x - 9))
    def lako(a):
        ks = [0] if a == "kopar" else [0, 1, 2, 3]
        N, T, D = 8, 9, 9
        s = ""
        for i in ks:   # a kannák, bennük a víz: minden töltéskor egy egyforma lépcsőt nő
            x = KX[i]; db = [k for k in range(N) if ks[k % len(ks)] == i]; lep = 20.0 / len(db)
            vals, idok = ["0"], [0.0]
            for j, k in enumerate(db):
                vals.append(f(lep * (j + 1))); idok.append((k + .6) / T)
            vals.append("0"); idok.append(8.6 / T)
            yv = [f(14 - float(v)) for v in vals]
            s += fok(kanna(x), 1.4)
            s += ('<clipPath id="kanna%d"><path d="M%s,14 L%s,-6 H%s L%s,14 Z"/></clipPath><g clip-path="url(#kanna%d)"><rect x="%s" y="14" width="22" height="0" fill="#7fc0e8">%s%s</rect></g>') % (
                i, f(x - 8), f(x - 7.4), f(x + 7.4), f(x + 8), i, f(x - 11), diszkret(vals, idok, D, "height"), diszkret(yv, idok, D, "y"))
        # Brekus kannáról kannára lép (8 töltés, aztán újra az elsőnél)
        hol = [ks[k % len(ks)] for k in range(N)] + [ks[0]]
        tr = diszkret(["%s,0" % f(KX[h] - KX[0]) for h in hol], [k / T for k in range(T)], D, None, "translate")
        on, ok = ["0"], [0.0]
        for k in range(N):
            on += ["1", "0"]; ok += [(k + .2) / T, (k + .85) / T]
        dont = ['<animate attributeName="opacity" calcMode="discrete" values="%s" keyTimes="%s" dur="%ss" repeatCount="indefinite"/>' % (";".join(on), ";".join(f3(t) for t in ok), D)]
        billen = diszkret(["0 %s -30" % f(KX[0] - 14) if v == "0" else "-38 %s -30" % f(KX[0] - 14) for v in on], ok, D, None, "rotate")
        vodor = '<g>%s%s</g>' % (fok('<path d="M%s,-38 h16 l-3,14 h-10 z" fill="#b98a64"/><path d="M%s,-38 q8,-10 16,0" fill="none" stroke-width="1.2"/>' % (f(KX[0] - 22), f(KX[0] - 22)), 1.4), billen)
        sugar = '<path d="M%s,-30 Q%s,-28 %s,-6" stroke="#7fc0e8" stroke-width="4" fill="none" stroke-linecap="round" opacity="0">%s</path>' % (f(KX[0] - 8), f(KX[0] - 2), f(KX[0]), dont[0])
        brekus = '<g>%s%s%s%s</g>' % (figura("brekus", KX[0] - 28, 18, .42), vodor, sugar, tr)
        return s + brekus
    return alapr, bere, virag, lako


# ── a négy ház (5 állapot); a lakó (L) minden állapotban ott van ──
def d_kerek():
    """🔮 a kerek ház (egy-szam): lila kupolatető, két kerek ablak; Kitti három egyforma tálba rak bogyót, mindegyikbe ugyanannyit,
    aztán mindet a kosárba önti, és kezdi elölről"""
    h = ferde_haz({"w": 150, "hB": 118, "hJ": 112, "tH": 92, "cs": 4, "eB": 10, "eJ": 10, "dol": -2, "fal": "#fdf3e2", "teto": LILA, "tetoA": LILA_A,
                   "kerek": [(-40, -78, 15), (40, -74, 15)], "ajto": (0, 30, 58, "#a8764f"), "kupola": True, "spaletta": "#a8c88f"})
    TAL = (-104, -64, -24)
    D = 10
    tal = "".join('<g transform="translate(%s 44)"><path d="M-19,-10 Q0,9 19,-10 Z" fill="#f4ead8"/><path d="M-19,-10 Q0,-5 19,-10" fill="none" stroke-width="1.2"/></g>' % f(x) for x in TAL)
    kosar = ('<g transform="translate(-148 42)"><path d="M-18,0 L-21,-17 H21 L18,0 Z" fill="#d8b48a"/><path d="M-20,-9 H20" stroke="#b5804a" stroke-width="1.2"/>'
             '<path d="M-15,-17 Q0,-38 15,-17" stroke="#a8764f" stroke-width="2.6" fill="none"/></g>')
    bogyok = ""
    for n in range(9):
        x = TAL[n % 3] + (-7, 7, 0)[n // 3]; y = 37 - (0, 0, 7)[n // 3]
        t = .06 + n * .085
        bogyok += '<g opacity="0">%s<animate attributeName="opacity" calcMode="discrete" values="0;1;0" keyTimes="0;%s;.84" dur="%ss" repeatCount="indefinite"/></g>' % (bogyo(x, y), f3(t), D)
    kupac = '<g opacity="0">%s<animate attributeName="opacity" calcMode="discrete" values="0;1;0" keyTimes="0;.86;.98" dur="%ss" repeatCount="indefinite"/></g>' % (
        "".join(bogyo(-148 + dx, 24 + dy) for dx, dy in ((-10, 0), (-2, 0), (6, 0), (12, 0), (-6, -6), (2, -6), (9, -6), (-2, -11), (5, -11))), D)
    # Kitti a soron következő tál fölé hajol
    hol = [TAL[n % 3] - TAL[1] for n in range(9)] + [-56]
    tr = diszkret(["%s,0" % f(x * .5) for x in hol], [0] + [.06 + n * .085 - .03 for n in range(1, 9)] + [.84], D, None, "translate")
    kitti = '<g>%s%s</g>' % (leleg(figura("kitti", -64, 24, .42), 1, 2.2), tr)
    h["L"] = kitti + fok(tal + kosar, 1.4) + bogyok + kupac
    h["ext"] = (-178, h["ext"][1], h["ext"][2], 58)
    h["defs"] = ""
    return h

def d_hold():
    """🌙 a Holdfény-ház (holdfeny-bujocska): kék fal, lila tető, hold-cégér; a lámpásfüzér előtt egy kis felhő úszik, mindig egy
    lámpást takar el; a ház előtti felhő-bokor mögül Cincin kukucskál ki"""
    h = ferde_haz({"w": 140, "hB": 150, "hJ": 142, "tH": 82, "cs": 10, "eB": 12, "eJ": 14, "dol": 2.4, "fal": "#d3e4f7", "teto": LILA, "tetoA": LILA_A,
                   "ablak": [(-50, -124, 26, 28), (22, -128, 26, 28)], "ajto": (-6, 30, 58, "#7a6aa8"), "kemeny": (30, 12, 20), "spaletta": "#f2c14e"})
    h["K"] += ('<g transform="rotate(2.4)"><g filter="url(#firka)" stroke="%s" stroke-width="1.6"><path d="M70,-112 H98 M78,-112 L70,-100" stroke="#6e5a4a" stroke-width="3" fill="none"/>'
               '<path d="M94,-112 V-104" stroke-width="1.2"/><path d="M100,-104 A14 14 0 1 0 100,-76 A10 11 0 1 1 100,-104 Z" fill="#fce49a"/></g></g>') % INK
    # a lámpásfüzér: a ház bal ereszétől egy oszlopig
    a, c, b = (-156, -126), (-120, -92), (-78, -150)
    lp = [qpont(a, c, b, t) for t in (.1, .28, .46, .64, .82)]
    fuz = ('<path d="M-156,4 V-132" stroke="#8a5a3a" stroke-width="5"/><path d="M-162,-132 h12" stroke="#6e5a4a" stroke-width="3"/>'
           '<path d="M%s,%s Q%s,%s %s,%s" stroke="#6e5a4a" stroke-width="1.4" fill="none"/>') % (f(a[0]), f(a[1]), f(c[0]), f(c[1]), f(b[0]), f(b[1]))
    lamp = "".join('<path d="M%s,%s v5" stroke-width="1"/><path d="M%s,%s h10 l-1,12 h-8 z" fill="#fff1a8"/><path d="M%s,%s h12" stroke-width="1.6"/>' % (
        f(x), f(y), f(x - 5), f(y + 5), f(x - 6), f(y + 5)) for x, y in lp)
    feny = "".join('<circle cx="%s" cy="%s" r="9" fill="#fff3b0" opacity=".45" stroke="none"/>' % (f(x), f(y + 11)) for x, y in lp)
    # a kis felhő: lámpásról lámpásra úszik, mindig egyet eltakar
    sor = (2, 0, 3, 1, 4)
    vals, kt = [], []
    for i, j in enumerate(sor):
        x, y = lp[j]
        for t in (i / 5 + .04, (i + 1) / 5 - .02):
            vals.append("%s,%s" % (f(x), f(y + 10))); kt.append(t)
    vals = [vals[-1]] + vals + [vals[-1]]; kt = [0] + kt + [1]
    rr = Rnd(631)
    felho_ = ('<g><path d="%s" fill="#fff" stroke="#b8b0d0" stroke-width="1.4"/><animateTransform attributeName="transform" type="translate" values="%s" keyTimes="%s" dur="10s" repeatCount="indefinite"/></g>') % (
        pamacs(0, 0, 15, 11, 7, rr), ";".join(vals), ";".join(f3(t) for t in kt))
    # a felhő-bokor, mögüle Cincin kukucskál
    bokr = '<path d="%s" fill="#d9ecd6"/><path d="%s" fill="#fff" opacity=".4" stroke="none"/>' % (pamacs(96, -16, 34, 20, 9, rr), pamacs(88, -24, 14, 7, 6, rr, 1.2))
    cin = ('<g><g transform="translate(96 0)">' + figura("cincin", 0, 0, .36) + '</g>'
           '<animateTransform attributeName="transform" type="translate" values="0,34;0,34;0,-6;0,-6;0,34" keyTimes="0;.4;.5;.8;.9" dur="6.8s" repeatCount="indefinite"/></g>')
    h["L"] = fok(fuz + lamp, 1.2) + feny + felho_ + cin + fok(bokr, 1.6)
    h["ext"] = (-176, h["ext"][1], 136, 30)
    h["defs"] = ""
    return h

def repa(k=1.0):
    return ('<g transform="scale(%s)"><path d="M-3,-2 Q0,14 1,16 Q3,10 4,-2 Z" fill="#f08a3a" stroke="#b8602a" stroke-width="1"/>'
            '<path d="M0,-2 l-4,-8 M1,-2 l1,-9 M2,-2 l5,-7" stroke="#6fae5a" stroke-width="1.8" stroke-linecap="round"/></g>') % k

def d_kamra():
    """🧺 a répás kamra (mi-maradt): sárga, toldott ház, lila tető; Pali répát oszt három tányérra, körbe, egyesével —
    a végén egy répa a kezében marad: azt megrágcsálja"""
    h = ferde_haz({"w": 160, "hB": 112, "hJ": 122, "tH": 64, "cs": -22, "eB": 10, "eJ": 26, "dol": -2.2, "fal": "#fde39a", "teto": LILA, "tetoA": LILA_A,
                   "ablak": [(-60, -92, 28, 28), (24, -96, 28, 28)], "ajto": (-8, 30, 56, "#a8764f"), "kemeny": (28, 14, 18), "toldas": (80, 134, 70), "spaletta": "#a8c88f"})
    h["K"] += '<g transform="rotate(-2.2)"><path d="M-74,-112 h40" stroke="#6e5a4a" stroke-width="2"/>%s</g>' % "".join(
        '<g transform="translate(%s -110) rotate(%s)">%s</g>' % (f(-68 + i * 10), (-8, 4, -2, 6)[i], repa(1.2)) for i in range(4))
    TAN = (-156, -116, -76)
    D = 9
    tany = "".join('<g transform="translate(%s 30)"><ellipse rx="16" ry="5.4" fill="#fff" stroke="#7f9ed6" stroke-width="2"/><ellipse rx="9" ry="2.8" fill="none" stroke="#c8d8f0" stroke-width="1"/></g>' % f(x) for x in TAN)
    kez = (-182, -40)
    rk_ = ""
    for n in range(6):
        x, y = TAN[n % 3] + (-4, 5)[n // 3], 26 - (0, 3)[n // 3]
        t = .05 + n * .11
        rk_ += ('<g opacity="0"><g transform="rotate(-70)">%s</g><animateMotion path="M%s,%s Q%s,%s %s,%s" keyPoints="0;0;1;1" keyTimes="0;%s;%s;1" calcMode="linear" dur="%ss" repeatCount="indefinite"/>'
                '<animate attributeName="opacity" calcMode="discrete" values="0;1;0" keyTimes="0;%s;.9" dur="%ss" repeatCount="indefinite"/></g>') % (
            repa(), f(kez[0]), f(kez[1]), f((kez[0] + x) / 2), f(kez[1] - 40), f(x), f(y), f3(t), f3(t + .05), D, f3(t), D)
    # a hetedik: a kezében marad, megrágcsálja (kisebbedik)
    rag = ('<g opacity="0"><g transform="translate(%s %s) rotate(-20)"><g>%s<animateTransform attributeName="transform" type="scale" values="1;1;.75;.5;.25;.25" keyTimes="0;.72;.78;.84;.9;1" dur="%ss" repeatCount="indefinite"/></g></g>'
           '<animate attributeName="opacity" calcMode="discrete" values="0;1;0" keyTimes="0;.7;.92" dur="%ss" repeatCount="indefinite"/></g>') % (f(kez[0]), f(kez[1]), repa(1.1), D, D)
    pali = leleg(figura("pali", -200, 8, .48), 1.2, 2.4)
    h["L"] = pali + fok(tany, 1.4) + rk_ + rag
    h["ext"] = (-236, h["ext"][1], h["ext"][2], 44)
    h["defs"] = ""
    return h

def d_harangjatek():
    """🔔 a harangjátékos ház (vegyes-szorzo): rózsaszín fal, lila tető, tornác csengősorral; Bogyó a korláton ugrál, mindig egyforma
    nagyot (három csengőnyit) előre, aztán vissza — ahol földet ér, ott megszólal a csengő"""
    h = ferde_haz({"w": 164, "hB": 138, "hJ": 128, "tH": 76, "cs": 12, "eB": 12, "eJ": 12, "dol": 1.8, "fal": "#f9d6e2", "teto": LILA, "tetoA": LILA_A,
                   "ablak": [(-62, -118, 28, 28), (32, -114, 28, 28)], "ajto": (-6, 30, 58, "#b07a9a"), "kemeny": (-42, 12, 20), "spaletta": "#9ec9f0", "ladak": 2})
    D = 6
    CX = [-84 + i * 28 for i in range(7)]
    kor = ('<path d="M-96,14 H96 V20 H-96 Z" fill="#d6b48a"/>' + "".join('<path d="M%s,18 V-34" stroke="#a07a54" stroke-width="4.4" stroke-linecap="round"/>' % f(x) for x in (-94, -42, 42, 94)) +
           '<path d="M-98,-38 H98 V-31 H-98 Z" fill="#c99a6a"/><path d="M-94,-8 H94" stroke="#a07a54" stroke-width="2.4"/>')
    leng = {0: [0, .95], 3: [.2, .7], 6: [.45]}
    cs = ""
    for i, x in enumerate(CX):
        b = '<g transform="translate(%s -31)">%s</g>' % (f(x), harang_d(5.6, "#f2c14e" if i % 3 == 0 else "#f6dc8a"))
        cs += leng_ki(b, x, -31, 22, D, leng[i], .16) if i in leng else b
    # Bogyó: 0 → 3 → 6 → 3 → 0 (egyforma ugrások)
    p = [(CX[i], -38) for i in (0, 3, 6, 3, 0)]
    d = "M%s,%s" % (f(p[0][0]), f(p[0][1])) + "".join(" Q%s,%s %s,%s" % (f((p[i][0] + p[i + 1][0]) / 2), f(-96), f(p[i + 1][0]), f(p[i + 1][1])) for i in range(4))
    bog = ('<g><g>%s</g><animateMotion path="%s" keyPoints="0;.25;.25;.5;.5;.75;.75;1;1" keyTimes="0;.18;.25;.43;.5;.68;.75;.93;1" calcMode="linear" dur="%ss" repeatCount="indefinite"/></g>') % (
        figura("bogyo", 0, 2, .32), d, D)
    jegy = "".join(fel_szall(hangjegy("#c96a9a"), CX[i], -10, 8, -60, D, t * D) for i, t in ((3, .2), (6, .45), (3, .7), (0, .95)))
    h["L"] = fok(kor, 1.4) + cs + bog + jegy
    h["ext"] = (-110, h["ext"][1] - 10, 110, 34)
    h["defs"] = ""
    return h


# ── díszlet-fájlok: a madarak a harangláb tetején, a szélcsengő a fán ──
def d_madarak():
    x, y = D_HARANG
    def m(dx, dy, tuk, b):
        return ('<g><g transform="translate(%s %s) scale(%s,1)"><path d="M-9,0 Q0,-12 9,-3 L16,-6 L10,1 Q0,9 -9,0 Z" fill="#6a5f8a"/><circle cx="7" cy="-6" r="3.8" fill="#6a5f8a"/>'
                '<path d="M11,-6 l4,1 l-4,1 z" fill="#f2a03a"/><circle cx="8" cy="-7" r="1" fill="#fff"/></g>'
                '<animateTransform attributeName="transform" type="translate" values="0,0;0,0;0,-7;0,0;0,0" keyTimes="0;.6;.66;.72;1" dur="4.6s" begin="%ss" repeatCount="indefinite"/></g>') % (
            f(x + dx), f(y + dy), "-1" if tuk else "1", b)
    s = m(-30, -364, False, 0) + m(28, -366, True, 1.7)
    return s, (x - 52, y - 392, 104, 36)

def d_szelcsengo():
    x, y = D_CSENGO
    cs = ('<path d="M0,0 V14" stroke="#6e5a4a" stroke-width="1.4"/><ellipse cx="0" cy="16" rx="15" ry="4.4" fill="#c99a6a" stroke="%s" stroke-width="1.4"/>' % INK +
          "".join('<path d="M%s,18 V%s" stroke="#8a7a9a" stroke-width="1"/><rect x="%s" y="%s" width="4.4" height="%s" rx="2" fill="%s" stroke="%s" stroke-width="1"/>' % (
              f(dx), f(24), f(dx - 2.2), f(24), f(L), c, INK) for dx, L, c in ((-11, 26, "#d9d2ec"), (-5, 34, "#f2dc9a"), (1, 40, "#d9d2ec"), (7, 32, "#f2dc9a"), (12, 24, "#d9d2ec"))) +
          '<path d="M0,18 V58" stroke="#8a7a9a" stroke-width="1"/><circle cx="0" cy="50" r="3.4" fill="#c99a6a" stroke="%s" stroke-width="1"/><path d="M0,58 q-7,8 0,18 q7,-10 0,-18 Z" fill="#f6a5c0" stroke="%s" stroke-width="1"/>' % (INK, INK))
    s = '<g transform="translate(%s %s)">%s</g>' % (f(x), f(y), lengo(cs, 0, 0, 5, 3.4))
    return s, (x - 24, y - 6, 48, 86)


def dallam_ter():
    M = "dallam-ter"
    r = Rnd(906)
    tcx, tcy, trx, try_ = D_TER
    def tereben(x, y, plusz=0):
        return ((x - tcx) / (trx + plusz)) ** 2 + ((y - tcy) / (try_ + plusz)) ** 2 < 1
    bq = ivpontok(D_BEJ, 10)
    HELYEK_ = [(D_KEREK, 260, 40), (D_HOLD, 190, 30), (D_KAMRA, 260, 40), (D_HJ, 130, 40), (D_KUT, 190, 40), (D_PODIUM, 70, 20), (D_FA, 60, 20)]
    def foglalt(x, y):
        return (tereben(x, y, 14) or tav_vonal(bq, x, y) < 44 or
                any(abs(x - hx) < rx and hy - 70 < y < hy + ry for (hx, hy), rx, ry in HELYEK_))

    # ég
    eg = ('<rect x="%d" y="%d" width="%d" height="%d" fill="url(#eg)"/>'
          '<circle cx="170" cy="80" r="300" fill="url(#napfeny)"/><circle cx="170" cy="80" r="42" fill="#fff6cf"/>') % (BX0, BY0, BX1 - BX0, BY1 - BY0)
    eg += '<g opacity=".6">' + felho(560, 50, 1.3, .8) + felho(1180, 20, 1.5, .7) + felho(1840, 60, 1.2, .8) + felho(-280, 40, 1.2, .7) + '</g>'
    irj(M, "eg", KIFESTVE, '<linearGradient id="eg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cde6f6"/><stop offset=".55" stop-color="#f3eee2"/><stop offset="1" stop-color="#fdf1e2"/></linearGradient>'
        '<radialGradient id="napfeny"><stop offset="0" stop-color="#fff8d8" stop-opacity=".95"/><stop offset="1" stop-color="#fff8d8" stop-opacity="0"/></radialGradient>', eg)

    # távoli: a hegység (a Fejtörő-hegy, a Doromboló-hegy), balra hátul a dombocskán az Összeadó utca nagy háza
    tav = ('<g filter="url(#firka)"><path d="M-560,360 L-300,230 L-120,300 L120,150 L340,290 L560,180 L760,280 L980,120 L1180,260 L1360,170 L1560,290 L1800,200 L2170,320 L2170,430 L-560,430 Z" fill="#ddd6ee" stroke="#bdb2d8" stroke-width="2"/>'
           '<path d="M94,172 L120,150 L148,176 L132,172 L120,182 L108,172 Z M954,144 L980,120 L1008,146 L992,142 L980,152 L968,142 Z M1338,188 L1360,170 L1382,190 L1368,186 L1360,196 Z" fill="#fff"/>'
           '<path d="M-560,420 Q-300,330 -40,360 Q200,380 420,350 L620,392 V440 H-560 Z" fill="#e2dcf0" stroke="#c4bade" stroke-width="2"/>'
           '<path d="M-200,410 Q40,300 300,320 Q440,334 520,410 Z" fill="#c9e8b4" stroke="#a7cf92" stroke-width="2"/></g>')
    # az Összeadó utca nagy háza a dombocskán (kicsiben)
    tav += ('<g transform="translate(150 330)" opacity=".9" filter="url(#firka)" stroke="#8a7a9a" stroke-width="1.6"><path d="M-30,0 V-36 L32,-40 V0 Z" fill="#f6d6c4"/>'
            '<path d="M-36,-34 L2,-66 L38,-38 Z" fill="#9a5a3a"/><rect x="14" y="-62" width="8" height="12" fill="#c98f6e"/><circle cx="2" cy="-46" r="5" fill="#e9f4fb"/>'
            '<rect x="-20" y="-28" width="9" height="9" fill="#e9f4fb"/><rect x="12" y="-28" width="9" height="9" fill="#e9f4fb"/><path d="M-2,0 V-14 H6 V0" fill="#8a5a3a"/></g>')
    tav += fust(164, 262, 2, 5, 30)
    tav += '<g filter="url(#firka)">'
    for x, y, h in ((380, 410, 80), (430, 416, 66), (640, 412, 74), (1240, 404, 86), (1300, 410, 72), (1700, 410, 90), (1780, 404, 76), (-260, 416, 80), (2040, 412, 86)):
        tav += fenyo(x, y, h, ["#8fb89a", "#7fae8c", "#9cc4a2"][int(r() * 3)])
    for x, y, rr in ((560, 420, 26), (760, 418, 24), (900, 420, 28), (1040, 418, 26), (1460, 414, 26), (1900, 424, 30), (-400, 420, 30), (2110, 420, 30)):
        tav += lomb(x, y, rr, ["#9cc79a", "#8fbf8f", "#a7cfa2"][int(r() * 3)])
    tav += '</g>'
    irj(M, "tavoli", KIFESTVE, FIRKA, tav)

    # közép: a rét, a bejárati út, a kerek tér macskakővel, a harangláb körüli világosabb kör, a fa (a szélcsengő ága), az üres pódium,
    # lámpák, bokrok, virág, fű
    koz = ('<rect x="%d" y="400" width="%d" height="%d" fill="url(#ret)"/>' % (BX0, BX1 - BX0, BY1 - 400) +
           '<path d="M%d,414 Q400,394 800,408 T%d,414 V470 H%d Z" fill="#c4e4b4"/>' % (BX0, BX1, BX0))
    koz += '<g filter="url(#firka)">'
    for x, y, rr in ((520, 470, 28), (700, 452, 24), (920, 450, 26), (1240, 470, 30), (1660, 500, 34), (1860, 480, 32), (2060, 520, 38), (-140, 500, 34), (-400, 520, 36), (340, 460, 26)):
        koz += lomb(x, y, rr, ["#8fc98a", "#9fd19a", "#7fbf86", "#a7d99a"][int(r() * 4)])
    koz += '</g>'
    koz += ut(D_BEJ, 92)
    koz += ('<ellipse cx="%d" cy="%d" rx="%d" ry="%d" fill="#d9c79c"/><ellipse cx="%d" cy="%d" rx="%d" ry="%d" fill="#efe0c4"/>' % (tcx, tcy, trx + 8, try_ + 6, tcx, tcy, trx, try_))
    for _ in range(170):
        x = tcx + (r() - .5) * 2 * trx; y = tcy + (r() - .5) * 2 * try_
        if tereben(x, y, -10):
            koz += '<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="#e2cfaa" opacity=".9"/>' % (f(x), f(y), f(7 + r() * 6), f(2.6 + r() * 2))
    koz += '<ellipse cx="%d" cy="%d" rx="170" ry="54" fill="none" stroke="#e2cfaa" stroke-width="10" opacity=".7"/>' % (D_TALAP[0], D_TALAP[1] + 20)
    koz += '<ellipse cx="%d" cy="%d" rx="300" ry="100" fill="none" stroke="#e2cfaa" stroke-width="6" opacity=".5" stroke-dasharray="18 14"/>' % (tcx, tcy)
    # a fa, jobbra nyúló ággal (rajta lóg a szélcsengő)
    fx, fy = D_FA
    koz += fok(('<path d="M%s,%s Q%s,%s %s,%s L%s,%s Q%s,%s %s,%s Z" fill="url(#kereg)"/>' % (f(fx - 18), f(fy), f(fx - 10), f(fy - 90), f(fx - 16), f(fy - 170), f(fx + 14), f(fy - 170), f(fx + 8), f(fy - 90), f(fx + 18), f(fy))) +
               '<path d="M%s,%s Q%s,%s %s,%s" stroke="%s" stroke-width="13" fill="none" stroke-linecap="round"/><path d="M%s,%s Q%s,%s %s,%s" stroke="#8a5e40" stroke-width="8" fill="none" stroke-linecap="round"/>' % (
                   f(fx + 6), f(fy - 130), f(fx + 70), f(fy - 160), f(D_CSENGO[0] + 18), f(D_CSENGO[1] - 6), INK, f(fx + 6), f(fy - 130), f(fx + 70), f(fy - 160), f(D_CSENGO[0] + 18), f(D_CSENGO[1] - 6)), 2.2)
    for cx_, cy_, rx_, ry_, c in ((fx - 30, fy - 210, 90, 64, "#94c983"), (fx + 40, fy - 236, 80, 56, "#8cc47f"), (fx, fy - 270, 76, 48, "#9ccf8c")):
        koz += '<g filter="url(#firka)"><path d="%s" fill="%s" stroke="%s" stroke-width="2.2"/></g>' % (pamacs(cx_, cy_, rx_, ry_, 9, r), c, INK)
    koz += '<path d="%s" fill="#fff" opacity=".25" stroke="none"/>' % pamacs(fx - 40, fy - 270, 40, 20, 7, r, 1.2)
    # az üres pódium a kottatartóval
    px, py = D_PODIUM
    koz += arnyek(px + 4, py + 4, 58, 9) + fok(
        '<path d="M%s,%s V%s A54 15 0 0 0 %s %s V%s A54 15 0 0 1 %s %s Z" fill="#c99a6a"/><ellipse cx="%s" cy="%s" rx="54" ry="15" fill="#e2c49a"/>' % (
            f(px - 54), f(py), f(py - 16), f(px + 54), f(py - 16), f(py), f(px - 54), f(py), f(px), f(py - 16)) +
        '<path d="M%s,%s A54 15 0 0 0 %s %s" stroke="#f2c14e" stroke-width="3" fill="none"/>' % (f(px - 50), f(py - 10), f(px + 50), f(py - 10)) +
        '<path d="M%s,%s V%s M%s,%s l-10,8 M%s,%s l10,8" stroke="#6e5a4a" stroke-width="2.6"/><path d="M%s,%s l26,-4 l2,-20 l-26,4 z" fill="#fffaf0"/>' % (
            f(px + 8), f(py - 18), f(py - 64), f(px + 8), f(py - 18), f(px + 8), f(py - 18), f(px - 6), f(py - 62)) +
        '<path d="M%s,%s h18 M%s,%s h18 M%s,%s h14" stroke="#b8b0d0" stroke-width="1"/>' % (f(px - 3), f(py - 72), f(px - 3), f(py - 68), f(px - 3), f(py - 64)), 1.8)
    # lámpák a tér szélén
    for lx_, ly_ in ((470, 800), (360, 640)):
        koz += fok('<path d="M%s,%s V%s" stroke="#6e5a4a" stroke-width="4"/><path d="M%s,%s h18 l-3,-16 h-12 z" fill="#fff3c4"/><path d="M%s,%s h22 l-11,-9 z" fill="%s"/>' % (
            f(lx_), f(ly_), f(ly_ - 74), f(lx_ - 9), f(ly_ - 74), f(lx_ - 11), f(ly_ - 90), LILA), 1.6)
    koz += '<g filter="url(#firka)" stroke="%s" stroke-width="2">' % INK
    for x, y, s in ((40, 760, 1.2), (460, 560, .9), (720, 520, .8), (880, 510, .8), (1600, 560, 1.1), (1540, 820, 1.2), (-220, 760, 1.3), (1880, 760, 1.3), (1980, 600, 1.1), (-420, 640, 1.2), (1400, 900, 1.1), (840, 930, 1.0)):
        if not foglalt(x, y):
            koz += bokor(x, y, s)
    koz += '</g>'
    koz += fucsomok(r, 420, BX0, BX1, 440, BY1, kihagy=foglalt)
    koz += viragok(r, 150, BX0, BX1, 450, BY1, kihagy=foglalt)
    irj(M, "kozep", KIFESTVE, FIRKA + '<linearGradient id="ret" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d4ecc4"/><stop offset="1" stop-color="#b9dc9c"/></linearGradient>'
        '<linearGradient id="kereg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#b48460"/><stop offset="1" stop-color="#8a5e40"/></linearGradient>', koz)

    # előtér: fű és bokor lent (a bal alsó bejárat szabad), fent a sarkokban lelógó lomb
    elo = '<g filter="url(#firka)" stroke="%s" stroke-width="2" fill="#a9d79a">' % INK
    elo += '<path d="M560,%d Q600,948 680,940 Q780,926 880,938 Q960,946 1000,%d Z"/>' % (BY1 + 10, BY1 + 10)
    elo += '<path d="M1260,%d Q1300,944 1400,936 Q1600,906 1900,926 Q2050,910 %d,918 L%d,%d Z"/></g>' % (BY1 + 10, BX1 + 10, BX1 + 10, BY1 + 10)
    elo += '<g filter="url(#firka)" stroke="%s" stroke-width="2">' % INK + bokor(1500, 966, 1.6) + bokor(1740, 952, 1.5, "#7fbf86", "#9fd19a") + bokor(780, 968, 1.2) + '</g>'
    re_ = Rnd(94)
    for cx_, cy_, k in ((-440, -110, 1), (-240, -120, .9), (-60, -116, .7), (2080, -110, 1), (1900, -120, .8), (1700, -130, .6)):
        elo += '<g filter="url(#firka)"><path d="%s" fill="%s" stroke="%s" stroke-width="2"/><path d="%s" fill="#fff" opacity=".18" stroke="none"/></g>' % (
            pamacs(cx_, cy_, 170 * k, 110 * k, 10, re_), ["#7fbf7a", "#86c47c", "#76b672"][int(re_() * 3)], INK, pamacs(cx_ - 30 * k, cy_ - 20 * k, 70 * k, 40 * k, 7, re_, 1.2))
    elo += fucsomok(Rnd(99), 120, 600, BX1, 922, 962, c="#7fae6a", kihagy=lambda x, y: x < 640)
    irj(M, "eloter", KIFESTVE, FIRKA, elo)

    # mozgó: felhők, lepkék; fölül madárcsapat (a leszálló madár: MADAR, ULO)
    also = ('<g id="also" pointer-events="none">\n<g>' + uszo_felho(420, 30, 1.0, 80, 120) + uszo_felho(1500, 60, 1.2, -70, 150) + uszo_felho(-240, 70, 1.1, 60, 130) + "</g>\n" +
            lepke(560, 860, "#f6a5c0", 14, "0,0;80,-40;160,10;60,30;0,0") + lepke(1520, 700, "#fce49a", 16, "0,0;-70,-20;-110,20;-30,30;0,0") + lepke(200, 700, "#c9a8e6", 13, "0,0;60,-24;100,6;30,20;0,0") + "\n</g>\n")
    felso = '<g id="felso" pointer-events="none">\n' + csapat(-140, 140, 1, 1900, 52) + "\n</g>"
    irj(M, "mozgo", KIFESTVE, "".join([MADAR, ULO]), also + felso, elotag="vm-")

    dob = {}
    for nev, fn in (("madarak", d_madarak), ("szelcsengo", d_szelcsengo)):
        s, vb = fn()
        irj(M, nev, vb, FIRKA, s)
        dob[nev] = vb
    for nev, fn, alap, sd in (("kerekhaz", d_kerek, D_KEREK, 61), ("holdfeny", d_hold, D_HOLD, 62), ("kamra", d_kamra, D_KAMRA, 63), ("harangjatek", d_harangjatek, D_HJ, 64)):
        dob[nev] = haz_fajlok(M, nev, alap, fn(), sd)
    alapr, bere, virag, lako = d_harang()
    dob["harang"] = hely3_fajlok(M, "harang", D_HARANG, (-150, -470, 120, 34), "", alapr, bere, virag, lako, 65)
    alapr, bere, virag, lako = d_kut()
    dob["kut"] = hely3_fajlok(M, "kut", D_KUT, (-64, -176, 200, 40), "", alapr, bere, virag, lako, 66)
    return dob


def dallam_tabla():
    """a helyek.js HELYEK["dallam-ter"] pontjai, útjai, járható részei és gátja (arányban)"""
    import math
    R = lambda p: "[%.3f, %.3f]" % (p[0] / W, p[1] / H)
    cx, cy, rx, ry = D_TER
    print("  jarhato (tér): [%s]" % ", ".join(R((cx + math.cos(a / 28 * 2 * math.pi) * (rx - 8), cy + math.sin(a / 28 * 2 * math.pi) * (ry - 6))) for a in range(28)))
    q = ivpontok(D_BEJ, 3)
    bal, jobb = [], []
    for i in range(len(q)):
        a = q[min(i + 1, len(q) - 1)]; b = q[max(i - 1, 0)]
        dx, dy = a[0] - b[0], a[1] - b[1]; L = (dx * dx + dy * dy) ** .5 or 1
        nx, ny = -dy / L, dx / L
        bal.append((q[i][0] + nx * 44, q[i][1] + ny * 44)); jobb.append((q[i][0] - nx * 44, q[i][1] - ny * 44))
    print("  jarhato (bejárat): [%s]" % ", ".join(R(p) for p in bal + jobb[::-1]))
    tx, ty, trx, tryy = D_TALAP
    print("  gat (talapzat): [%s]" % ", ".join(R((tx + math.cos(a / 14 * 2 * math.pi) * trx, ty + 6 + math.sin(a / 14 * 2 * math.pi) * tryy)) for a in range(15)))



# ══════════════════ A DALLAM-TÉR TÁJ-KÉPE (a világtérképen) ══════════════════
# A tér kicsinyített mása, eleve akkora, mint a régi jel (nem kell utólag nagyítani): középen a magas, áttört harangláb (a tájon az
# egyetlen ilyen), a lábánál a négy ház lila teteje, elöl a kút. A harang leng, a két madár a tetején ül (a leszálló madár is ide száll).
TAJ_DALLAM_DOBOZ = (1284, 430, 222, 264)   # 11-25: nagyobb (a házak 1,7-szeresek), lásd taj_dallam_ter
def taj_dallam_ter():
    r = Rnd(341)
    def haz(w, h, tH, cs, fal, teto, dol, ablak=1, kupola=False):
        if kupola:
            tet = '<path d="M%s,%s Q%s,%s %s,%s Q%s,%s %s,%s Z" fill="%s"/><circle cx="%s" cy="%s" r="1.3" fill="#f2c14e" stroke-width=".5"/>' % (
                f(-w / 2 - 1.5), f(-h + 1), f(-w / 2), f(-h - tH), f(cs), f(-h - tH), f(w / 2), f(-h - tH), f(w / 2 + 1.5), f(-h + 1), teto, f(cs), f(-h - tH - 1.6))
        else:
            tet = '<path d="M%s,%s L%s,%s L%s,%s Z" fill="%s"/>' % (f(-w / 2 - 2), f(-h + 1), f(cs), f(-h - tH), f(w / 2 + 2), f(-h + 1), teto)
        s = ('<g transform="rotate(%s)"><path d="M%s,0 V%s H%s V0 Z" fill="%s"/>%s<path d="M-1.6,0 V-4 Q0,-6 1.6,-4 V0 Z" fill="#a8764f" stroke-width=".7"/>') % (
            dol, f(-w / 2), f(-h), f(w / 2), fal, tet)
        for i in range(ablak):
            x = -w / 2 + 2 + i * (w - 7) / max(1, ablak - 1) if ablak > 1 else -w / 2 + 2
            s += ('<circle cx="%s" cy="%s" r="1.7" fill="#e9f4fb" stroke-width=".6"/>' if kupola else '<rect x="%s" y="%s" width="3.2" height="3" fill="#e9f4fb" stroke-width=".6"/>') % (
                (f(x + 2), f(-h * .6)) if kupola else (f(x), f(-h * .7)))
        return s + '</g>'
    kerek = haz(20, 14, 11, 0, "#fdf3e2", LILA, -2, 2, True)
    hold = haz(18, 18, 9, 1, "#d3e4f7", LILA, 2.4, 1) + '<path d="M12,-15 A3.4 3.4 0 1 0 12,-8 A2.4 2.6 0 1 1 12,-15 Z" fill="#fce49a" stroke-width=".5"/>'
    kamra = haz(22, 14, 8, -3, "#fde39a", LILA, -2, 2) + '<path d="M11,0 V-9 H17 V0 Z M10,-9 L17,-14 V-9 Z" fill="#fde39a" stroke-width=".7"/>'
    hj = haz(22, 16, 9, 1, "#f9d6e2", LILA, 1.8, 2) + '<path d="M-12,1 H12 M-12,-4 H12" stroke="#a07a54" stroke-width=".8"/>' + "".join(
        '<circle cx="%s" cy="-2.6" r="1" fill="#f2c14e" stroke="none"/>' % f(-10 + i * 4) for i in range(6))
    kut = ('<ellipse cx="0" cy="0" rx="4" ry="1.4" fill="#e6dccb"/><path d="M-4,0 V-3 H4 V0" fill="#e6dccb"/><path d="M-3.4,-3 V-8 M3.4,-3 V-8" stroke="#8a5a3a" stroke-width=".8"/>'
           '<path d="M-5.6,-7.6 Q0,-9 0,-12 Q0,-9 5.6,-7.6 Z" fill="%s"/>' % LILA)
    fa_ = '<path d="M-1.6,0 V-9 H1.6 V0 Z" fill="#8a5e40"/><path d="%s" fill="#94c983"/>' % pamacs(0, -16, 9, 8, 7, r)
    ter_ = '<ellipse cx="1381" cy="642" rx="70" ry="13" fill="#efe0c4" stroke="#d9c79c" stroke-width="1.2"/><path d="M1300,662 Q1316,652 1330,648" stroke="#efe0c4" stroke-width="6" fill="none" stroke-linecap="round"/>'
    hl = ('<ellipse cx="1381" cy="640" rx="16" ry="4.4" fill="#e6dccb"/>'
          '<path d="M1369,639 L1373,540 M1393,639 L1389,540" stroke="#b5855a" stroke-width="3"/><path d="M1370,610 L1392,576 M1392,610 L1370,576 M1370,610 H1392 M1371,576 H1391" stroke="#b5855a" stroke-width="1.6"/>'
          '<path d="M1368,540 H1394" stroke="#b5855a" stroke-width="3"/><path d="M1370,540 V516 M1392,540 V516 M1368,517 H1394" stroke="#b5855a" stroke-width="2"/>'
          '<path d="M1360,517 Q1372,510 1381,488 Q1390,510 1402,517 Q1381,513 1360,517 Z" fill="%s"/><circle cx="1381" cy="484" r="2.6" fill="#f2c14e"/>' % LILA)
    kis_h = '<g transform="translate(1373 519) scale(.22)">%s</g><g transform="translate(1390 519) scale(.26)">%s</g>' % (harang_d(12), harang_d(12))
    nagy_h = lengo('<g transform="translate(1381 519) scale(.34)">%s</g>' % harang_d(15), 1381, 519, 12, 2.4)
    madar = lambda x, y, tk, b: ('<g><g transform="translate(%s %s) scale(%s,.45)"><path d="M-9,0 Q0,-12 9,-3 L16,-6 L10,1 Q0,9 -9,0 Z" fill="#6a5f8a" stroke="none"/><circle cx="7" cy="-6" r="3.8" fill="#6a5f8a" stroke="none"/></g>'
                                 '<animateTransform attributeName="transform" type="translate" values="0,0;0,0;0,-3;0,0;0,0" keyTimes="0;.6;.66;.72;1" dur="4.6s" begin="%ss" repeatCount="indefinite"/></g>') % (
        f(x), f(y), "-.45" if tk else ".45", b)
    g = lambda s: '<g filter="url(#firka)" stroke="%s" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">%s</g>' % (INK, s)
    # a producer (11-25): a világtérképen elveszett → a házak 1,7-szeresek (vastagabb körvonallal), szorosan a tér körül; a harangláb 1,15-szörös
    rkk = lambda x, y, s, k: '<g transform="translate(%s %s) scale(%s)">%s</g>' % (f(x), f(y), k, s)
    HN = lambda s: '<g transform="translate(1381 640) scale(1.15) translate(-1381 -640)">%s</g>' % s
    arny = arnyek(1390, 656, 108, 10, .1)
    ter2 = ('<ellipse cx="1390" cy="654" rx="100" ry="20" fill="#ead6ae" stroke="#c9ad7c" stroke-width="1.8"/><ellipse cx="1390" cy="652" rx="78" ry="13" fill="none" stroke="#f4e6c8" stroke-width="2" stroke-dasharray="6 5"/>'
            '<path d="M1288,680 Q1300,668 1312,664" stroke="#ead6ae" stroke-width="9" fill="none" stroke-linecap="round"/>')
    K = 1.7
    HAZAK = ((1318, 664, kerek, (1301, 622, 1335, 664)), (1338, 616, hold, (1323, 570, 1353, 616)), (1446, 616, kamra, (1427, 579, 1468, 616)), (1468, 668, hj, (1449, 625, 1487, 668)))
    alap = (arny + ter2 + g(rkk(1496, 630, fa_, 1.4)) + g("".join(rkk(x, y, s, K) for x, y, s, _ in HAZAK[:3])) + g(HN(hl)) + g(HN(kis_h)) +
            g(rkk(HAZAK[3][0], HAZAK[3][1], HAZAK[3][2], K)) + g(rkk(1404, 684, kut, 1.8)))
    elo = g(HN(nagy_h)) + HN(madar(1372, 500, False, 0) + madar(1391, 498, True, 1.7))
    virag = (taj_viragsor(Rnd(87), 1300, 1336, 670, 5) + taj_viragsor(Rnd(88), 1450, 1490, 674, 5) + taj_viragsor(Rnd(89), 1366, 1414, 520, 6) +
             taj_csillam(((1381, 446), (1318, 610), (1468, 614), (1446, 566))))
    defs = FIRKA + SZURKE
    vb = TAJ_DALLAM_DOBOZ
    irj("vilag", "dallam-ter-kesz", vb, defs, alap + elo)
    irj("vilag", "dallam-ter-viragos", vb, defs, alap + elo + virag)
    irj("vilag", "dallam-ter-epul", vb, defs, '<g opacity=".5" filter="url(#szurke)">' + alap + '</g>' + "".join(taj_allv(rr) for _, _, _, rr in HAZAK) + taj_allv((1360, 470, 1404, 640)))
    return {"dallam-ter (táj)": vb}


# ══════════════════ 📮 A POSTAFA (7. kör, 2026-11-26) ══════════════════
# Terv: Matekos/vilagkep-7-kor-postafa-kapuk-kod.html (A változat): kis tisztás a patak partján. Középen az öreg, széles koronájú fa,
# a két lelógó ágán zsinóron 6 levél-hely (a levél a hely képe: level-lepecsetelt / -megkezdett / -viragos, a játék lengeti),
# a tövében a piros levelesláda (zárva a közép rétegben; lada-teli: nyitva, kilógó levelekkel; a zászló díszlet), jobbra rúdon a
# galambdúc (duc-level: a galamb csőrében levél · duc-ures: levél nélkül · duc-repul: a galamb épp elrepült). Jobbra a patak a
# híddal, a túlparton a falu tetői. A számok a helyek.js HELYEK.postafa sorával egyeznek (talppont, doboz).
P_FA = (800, 700)                                                                     # a törzs talppontja
P_LEVEL = ((440, 560), (575, 505), (700, 575), (905, 575), (1030, 505), (1160, 560))   # a levelek talppontja (level-1 … level-6)
P_SZAL = 116                                                                          # a zsinór teteje (az ág) a talppont fölött
P_LADA = (640, 735)
P_DUC = (1300, 722)
P_PATAK = [(1640, 452), (1590, 488), (1500, 548), (1446, 640), (1448, 765), (1488, 945), (1510, BY1 + 10)]   # 11-27: a rét túlsó szélén ered (a bokrok mögül), lefelé szélesedik
P_UT = [(40, BY1 + 10), (150, 940), (260, 860), (420, 812), (600, 786), (800, 774)]
P_UT2 = [(800, 774), (980, 786), (1130, 774), (1236, 754)]
PIROS, PIROS_S = "#e8505b", "#b5303e"


def p_boritek(all_):
    """egy levél (helyi: 0,0 = a boríték alja; a zsinór a (0,-116) ágtól)"""
    s = '<path d="M0,-116 Q2.5,-84 0,-52" stroke="#8a7a6a" stroke-width="1.6" fill="none"/>'
    if all_ == "megkezdett":   # nyitott boríték: a fedél hátra hajtva, kilóg a levélpapír
        s += fok('<path d="M-30,-44 L0,-70 L30,-44 Z" fill="#efdcbc"/><path d="M-21,-62 H21 V-18 H-21 Z" fill="#fffdf6"/>'
                 '<path d="M-14,-54 H14 M-14,-47 H11 M-14,-40 H13 M-14,-33 H8" stroke="#b8b0d0" stroke-width="1.4"/>'
                 '<path d="M-30,-44 V-2 H30 V-44 L0,-20 Z" fill="#fbefd8"/><path d="M-30,-2 L-7,-23 M30,-2 L7,-23" stroke-width="1.1" opacity=".55"/>', 1.8)
    else:
        s += fok('<path d="M-30,-44 H30 V-2 H-30 Z" fill="#fbefd8"/><path d="M-30,-44 L0,-19 L30,-44" fill="#f4e3c6"/>'
                 '<path d="M-30,-2 L-8,-21 M30,-2 L8,-21" stroke-width="1.1" opacity=".55"/>', 1.8)
        if all_ == "viragos":   # a pecsét helyén virág, a sarkán csillag
            s += '<g transform="translate(0 -21)" stroke="%s" stroke-width="1.1">' % INK + "".join(
                '<ellipse cx="0" cy="-6" rx="4.4" ry="6.4" fill="#f6a5c0" transform="rotate(%d)"/>' % a for a in (0, 72, 144, 216, 288)) + '<circle r="3.6" fill="#f2c14e"/></g>'
            s += ('<path transform="translate(21 -34)" d="M0,-7 L2,-2 L7,-2 L3,1.4 L4.6,7 L0,3.6 L-4.6,7 L-3,1.4 L-7,-2 L-2,-2 Z" fill="#fce49a" stroke="#d1a23a" stroke-width="1.1"/>'
                  '<circle cx="-4" cy="-80" r="3" fill="#f6a5c0" stroke="none"/><circle cx="3" cy="-92" r="2.6" fill="#fff" stroke="none"/><circle cx="-2" cy="-104" r="2.6" fill="#c9a8e6" stroke="none"/>')
            s += taj_csillam(((-26, -56), (28, -60), (24, 4)))
        else:   # piros viaszpecsét, benne szív
            s += ('<circle cx="0" cy="-21" r="7.4" fill="%s" stroke="%s" stroke-width="1.3"/>'
                  '<path d="M0,-17.6 C-5,-21 -4,-25.4 -1.6,-25.4 Q0,-25.4 0,-23.6 Q0,-25.4 1.6,-25.4 C4,-25.4 5,-21 0,-17.6 Z" fill="#ffd6dc" stroke="none"/>') % (PIROS, PIROS_S)
    s += '<rect x="-3.4" y="-56" width="6.8" height="15" rx="1.6" fill="#d8b48a" stroke="%s" stroke-width="1.4"/>' % INK   # csipesz
    return s


def p_galamb(level, x=0, y=0, tuk=False):
    """a postagalamb a párkányon (balra néz); level: csőrében levél"""
    s = ('<g transform="translate(%s %s) scale(%s,1)"><g>' % (f(x), f(y), "-1" if tuk else "1") +
         '<path d="M14,-2 Q4,-22 -10,-16 Q-18,-12 -16,-4 Q-6,6 14,-2 Z" fill="#fbfaf6"/><path d="M12,-4 L26,-10 L22,0 Z" fill="#e9e6f2"/>'
         '<path d="M-2,-12 Q8,-20 16,-8 Q6,-6 -2,-12 Z" fill="#e3e1ee"/><path d="M-4,-2 V4 M2,-1 V5" stroke="#f2a03a" stroke-width="1.6"/>'
         '<circle cx="-12" cy="-18" r="7" fill="#fbfaf6"/><circle cx="-14" cy="-19.5" r="1.3" fill="%s" stroke="none"/><path d="M-19,-18 l-5,1.6 l5,1.4 Z" fill="#f2a03a" stroke-width="1"/>' % INK)
    if level:
        s += '<g transform="translate(-33 -20) rotate(-10)"><rect x="-9" y="-6" width="18" height="13" rx="1.6" fill="#fff6e6"/><path d="M-9,-6 L0,1 L9,-6" fill="none" stroke-width="1.2"/><circle cx="0" cy="2" r="2.4" fill="%s" stroke="none"/></g>' % PIROS
    s += '<animateTransform attributeName="transform" type="rotate" values="0;0;-8;0;0" keyTimes="0;.7;.78;.86;1" dur="3.8s" repeatCount="indefinite"/></g></g>'
    return s


def p_duc(all_):
    """a galambdúc a rúdon (helyi: 0,0 = a rúd talpa)"""
    s = arnyek(4, 2, 40, 7)
    s += fok('<path d="M-5,0 V-212 H5 V0 Z" fill="#a8764f"/><path d="M-18,0 Q0,-12 18,0 Z" fill="#9cc98a"/>'
             '<path d="M-44,-214 H62 V-206 H-44 Z" fill="#c99a6a"/>'
             '<path d="M-42,-214 V-272 H42 V-214 Z" fill="#fdf3e2"/><path d="M-42,-214 V-272 H-30 V-214 Z" fill="#3c2f5e" opacity=".06" stroke="none"/>'
             '<path d="M-56,-268 L0,-320 L56,-268 Z" fill="%s"/><path d="M-56,-268 L0,-320 L-20,-268 Z" fill="#fff" opacity=".18" stroke="none"/>'
             '<circle cx="-20" cy="-244" r="10" fill="#3c2a50"/><circle cx="20" cy="-244" r="10" fill="#3c2a50"/><circle cx="0" cy="-288" r="6.4" fill="#3c2a50"/>'
             '<path d="M-28,-230 H-12 M12,-230 H28" stroke="#a8764f" stroke-width="3"/>' % LILA, 2)
    s += ('<g><circle cx="20" cy="-244" r="6" fill="#fbfaf6" stroke="%s" stroke-width="1.4"/><circle cx="18" cy="-246" r="1" fill="%s"/>'
          '<animateTransform attributeName="transform" type="translate" values="0,3;0,3;0,-1;0,-1;0,3" keyTimes="0;.4;.5;.8;1" dur="6s" repeatCount="indefinite"/></g>') % (INK, INK)
    if all_ != "repul":
        s += fok(p_galamb(all_ == "level", 35, -207), 1.5)
    else:   # a galamb épp elrepült: egy toll libeg
        s += ('<path d="M30,-222 q6,-8 14,-6 q-6,4 -14,6 Z" fill="#fbfaf6" stroke="%s" stroke-width="1"><animateTransform attributeName="transform" type="translate" values="0,0;8,14;2,28" dur="2.4s" fill="freeze"/></path>') % INK
    return s


def p_lada_zart():
    """a levelesláda csukva (a közép rétegben; helyi: 0,0 = a láb talpa)"""
    return arnyek(2, 2, 30, 6) + fok(
        '<path d="M-5,0 V-46 H5 V0 Z" fill="#8a5a3a"/>'
        '<path d="M-34,-44 V-90 Q-34,-108 0,-110 Q34,-108 34,-90 V-44 Z" fill="%s"/><path d="M-34,-90 Q0,-96 34,-90" fill="none" stroke="%s" stroke-width="1.6"/>'
        '<path d="M-14,-74 H14" stroke="#3c2a50" stroke-width="4"/><path d="M-34,-44 V-90 H-24 V-44 Z" fill="#3c2f5e" opacity=".08" stroke="none"/>' % (PIROS, PIROS_S), 2)


def p_lada_teli():
    """nyitva: a fedél hátra csapva, kilógnak a régi levelek"""
    s = fok('<path d="M-5,0 V-46 H5 V0 Z" fill="#8a5a3a"/>'
            '<path d="M-34,-96 L-30,-132 Q0,-140 30,-132 L34,-96 Z" fill="#f07078"/>'
            '<path d="M-34,-44 V-96 H34 V-44 Z" fill="%s"/><path d="M-30,-96 Q0,-102 30,-96 Z" fill="#3c2a50"/>' % PIROS, 2)
    for x, rot, c in ((-16, -14, "#fff6e6"), (0, 4, "#fbefd8"), (15, 16, "#fff6e6")):
        s += fok('<g transform="translate(%s -98) rotate(%s)"><rect x="-10" y="-14" width="20" height="16" rx="1.6" fill="%s"/><circle cx="0" cy="-5" r="3" fill="#f6a5c0" stroke-width="1"/></g>' % (x, rot, c), 1.4)
    s += fok('<path d="M-34,-44 V-90 H34 V-44 Z" fill="%s"/><path d="M-14,-74 H14" stroke="#3c2a50" stroke-width="4"/>' % PIROS, 2)
    return s + taj_csillam(((-30, -128), (30, -118)))


def p_zaszlo():
    x, y = P_LADA[0] + 40, P_LADA[1] - 46
    zs = '<path d="M0,0 l26,6 l-26,8 Z" fill="#f2c14e" stroke="%s" stroke-width="1.4"><animateTransform attributeName="transform" type="skewY" values="0;-8;0;5;0" dur="2.8s" repeatCount="indefinite"/></path>' % INK
    s = fok('<path d="M-6,0 H2 V-4 H-6 Z" fill="#8a5a3a"/><path d="M0,0 V-56" stroke="#6e4a36" stroke-width="3"/>', 1.6) + '<g transform="translate(0 -56)">%s</g>' % zs
    return '<g transform="translate(%s %s)">%s</g>' % (f(x), f(y), s), (x - 8, y - 62, 40, 70)


def p_fa(r):
    """az öreg fa: a két lelógó ág (a levelek zsinórjával), a felfelé ágazó vastag ágak, a törzs (takarja az ágak tövét), a korona
    (11-27, a producer: a korona ne lebegjen a törzs fölött — a törzs felfelé is folytatódik, és a lombba ágazik)"""
    fx, fy = P_FA
    s = arnyek(fx, fy + 6, 270, 30, .12)
    ag = lambda d, w, c="#9b6c4a": ('<path d="%s" stroke="%s" stroke-width="%s" fill="none" stroke-linecap="round" stroke-linejoin="round" filter="url(#firka)"/>'
                                    '<path d="%s" stroke="%s" stroke-width="%s" fill="none" stroke-linecap="round" stroke-linejoin="round"/>') % (d, INK, f(w + 5), d, c, f(w))
    # a két lelógó ág: a törzs oldalából, a tövén vastagabb (két szakasz), a végén kis lombpamacs
    for oldal in (-1, 1):
        lv = [l for l in P_LEVEL if (l[0] - fx) * oldal > 0]
        lv.sort(key=lambda l: abs(l[0] - fx))
        pts = [(fx + oldal * 4, fy - 305)] + [(x, y - P_SZAL) for x, y in lv] + [(lv[-1][0] + oldal * 70, lv[-1][1] - P_SZAL - 22)]
        s += ag(sima(pts), 12)
        s += ag(sima([pts[0], ((pts[0][0] * 2 + pts[1][0]) / 3, (pts[0][1] * 2 + pts[1][1]) / 3 - 6), pts[1]]), 18)
        ex, ey = pts[-1]
        s += '<g filter="url(#firka)"><path d="%s" fill="#8cc47f" stroke="%s" stroke-width="2"/></g>' % (pamacs(ex, ey - 6, 52, 32, 8, r), INK)
    # felfelé ágazó vastag ágak a lombba
    for vx, vy, cx, cy, w in ((-170, -440, -80, -330, 22), (180, -450, 90, -340, 22), (10, -500, -10, -400, 26), (-60, -480, -40, -380, 14), (90, -490, 50, -390, 14)):
        s += ag("M%s,%s Q%s,%s %s,%s" % (f(fx + vx * .1), f(fy - 290), f(fx + cx), f(fy + cy), f(fx + vx), f(fy + vy)), w)
    # a törzs: lent a gyökerekkel kiszélesedik, fent a lombig ér
    s += fok('<path d="M%s,%s Q%s,%s %s,%s Q%s,%s %s,%s Q%s,%s %s,%s L%s,%s Q%s,%s %s,%s Q%s,%s %s,%s Q%s,%s %s,%s Z" fill="url(#kereg)"/>' % (
        f(fx - 74), f(fy + 4), f(fx - 36), f(fy - 18), f(fx - 34), f(fy - 120), f(fx - 32), f(fy - 220), f(fx - 26), f(fy - 290), f(fx - 30), f(fy - 330), f(fx - 40), f(fy - 350),
        f(fx + 40), f(fy - 350), f(fx + 30), f(fy - 330), f(fx + 26), f(fy - 290), f(fx + 32), f(fy - 220), f(fx + 34), f(fy - 120), f(fx + 36), f(fy - 18), f(fx + 78), f(fy + 4)) +
        '<path d="M%s,%s q20,-24 40,-20 M%s,%s q-18,-26 -44,-18 M%s,%s q-4,-60 6,-110 M%s,%s q-6,-40 2,-80" stroke="#7a4e32" stroke-width="2" fill="none" opacity=".7"/>' % (
        f(fx - 60), f(fy + 2), f(fx + 64), f(fy + 2), f(fx + 6), f(fy - 30), f(fx - 12), f(fy - 200)) +
        '<ellipse cx="%s" cy="%s" rx="8" ry="11" fill="#6e4a36"/>' % (f(fx - 8), f(fy - 150)), 2.4)
    for cx_, cy_, rx_, ry_, c in ((fx - 240, fy - 440, 210, 96, "#86c07a"), (fx + 240, fy - 440, 210, 96, "#8cc47f"), (fx, fy - 470, 290, 130, "#94c983"),
                                  (fx - 120, fy - 570, 200, 100, "#9ccf8c"), (fx + 130, fy - 575, 190, 96, "#94c983"), (fx - 10, fy - 385, 120, 48, "#86c07a")):
        s += '<g filter="url(#firka)"><path d="%s" fill="%s" stroke="%s" stroke-width="2.2"/></g>' % (pamacs(cx_, cy_, rx_, ry_, 11, r), c, INK)
    s += '<path d="%s" fill="#fff" opacity=".22" stroke="none"/>' % pamacs(fx - 150, fy - 590, 90, 40, 8, r, 1.2)
    s += '<path d="%s" fill="#3c2f5e" opacity=".07" stroke="none"/>' % pamacs(fx + 170, fy - 400, 150, 50, 8, r, 1.2)
    for _ in range(14):   # piros almák / bogyók a lombban
        x = fx + (r() - .5) * 620; y = fy - 400 - r() * 220
        s += '<circle cx="%s" cy="%s" r="5" fill="#f4a38c" stroke="%s" stroke-width="1.2"/>' % (f(x), f(y), INK)
    return s


def p_patak():
    """a patak: a rét túlsó szélén, a bokrok mögül ered (vékonyan), és lefelé szélesedik (távlat) — kitöltött sáv, nem kerek végű vonal"""
    q = ivpontok(P_PATAK, 10)
    y0, y1 = P_PATAK[0][1], 760
    def fel(y): return 5 + 31 * max(0, min(1, (y - y0) / (y1 - y0)))   # a fél-szélesség
    bal, jobb = [], []
    for i in range(len(q)):
        a = q[min(i + 1, len(q) - 1)]; b = q[max(i - 1, 0)]
        dx, dy = a[0] - b[0], a[1] - b[1]; L = (dx * dx + dy * dy) ** .5 or 1
        nx, ny = -dy / L, dx / L; w = fel(q[i][1])
        bal.append((q[i][0] + nx * w, q[i][1] + ny * w)); jobb.append((q[i][0] - nx * w, q[i][1] - ny * w))
    pd = lambda pts: "M" + " L".join("%s,%s" % (f(x), f(y)) for x, y in pts)
    viz = pd(bal + jobb[::-1]) + " Z"
    s = '<path d="%s" fill="url(#vizp)" stroke="#86c0e3" stroke-width="7" stroke-linejoin="round"/>' % viz
    s += '<path d="%s" stroke="#d4eefa" stroke-width="5" fill="none" stroke-dasharray="40 60" opacity=".7"/>' % sima(P_PATAK[2:])
    s += '<g filter="url(#firka)">' + "".join('<path d="%s" stroke="#7fb36e" stroke-width="3" fill="none"/>' % pd(p_) for p_ in (bal, jobb)) + '</g>'
    # a forrás: bokrok és egy kis kő takarják az eredetét
    fx, fy = P_PATAK[0]
    s += '<g filter="url(#firka)" stroke="%s" stroke-width="2">' % INK + bokor(fx - 30, fy + 10, .9, "#8cc47f", "#a7d99a") + bokor(fx + 26, fy + 6, .8) + '</g>'
    s += fok('<ellipse cx="%s" cy="%s" rx="13" ry="7" fill="#d8d2e6"/>' % (f(fx - 6), f(fy + 14)), 1.6)
    return s


def p_hid():
    x, y = 1446, 702
    return fok(('<path d="M%s,%s Q%s,%s %s,%s" stroke="#9a6f52" stroke-width="16" fill="none"/><path d="M%s,%s Q%s,%s %s,%s" stroke="#c99a6a" stroke-width="10" fill="none"/>'
                '<path d="M%s,%s V%s M%s,%s V%s M%s,%s V%s M%s,%s Q%s,%s %s,%s" stroke="#8a6a52" stroke-width="4" fill="none"/>') % (
        f(x - 78), f(y), f(x), f(y - 34), f(x + 78), f(y), f(x - 78), f(y), f(x), f(y - 34), f(x + 78), f(y),
        f(x - 62), f(y - 8), f(y - 38), f(x), f(y - 22), f(y - 54), f(x + 62), f(y - 8), f(y - 38), f(x - 62), f(y - 38), f(x), f(y - 64), f(x + 62), f(y - 38)), 2)


def postafa():
    M = "postafa"
    r = Rnd(707)
    fx, fy = P_FA
    uq = ivpontok(P_UT, 8) + ivpontok(P_UT2, 8)
    pq = ivpontok(P_PATAK, 8)
    def foglalt(x, y):
        return (tav_vonal(uq, x, y) < 40 or tav_vonal(pq, x, y) < 60 or (abs(x - fx) < 90 and fy - 260 < y < fy + 20) or
                (abs(x - P_LADA[0]) < 46 and P_LADA[1] - 120 < y < P_LADA[1] + 10) or (abs(x - P_DUC[0]) < 60 and y < P_DUC[1] + 10 and y > P_DUC[1] - 340) or
                any(abs(x - lx) < 40 and ly - 130 < y < ly + 10 for lx, ly in P_LEVEL))

    # ég
    eg = ('<rect x="%d" y="%d" width="%d" height="%d" fill="url(#eg)"/>'
          '<circle cx="170" cy="80" r="300" fill="url(#napfeny)"/><circle cx="170" cy="80" r="42" fill="#fff6cf"/>') % (BX0, BY0, BX1 - BX0, BY1 - BY0)
    eg += '<g opacity=".6">' + felho(520, 40, 1.2, .8) + felho(1160, 10, 1.4, .7) + felho(1800, 50, 1.2, .8) + felho(-300, 30, 1.2, .7) + '</g>'
    irj(M, "eg", KIFESTVE, '<linearGradient id="eg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c6e2f6"/><stop offset=".55" stop-color="#f1efe4"/><stop offset="1" stop-color="#fdf1e2"/></linearGradient>'
        '<radialGradient id="napfeny"><stop offset="0" stop-color="#fff8d8" stop-opacity=".95"/><stop offset="1" stop-color="#fff8d8" stop-opacity="0"/></radialGradient>', eg)

    # távoli: lila hegyek, a Kert felőli erdősáv balra, jobbra a túlparton a falu tetői
    tav = ('<g filter="url(#firka)"><path d="M-560,380 L-280,250 L-80,320 L160,190 L380,300 L620,210 L820,300 L1040,170 L1260,290 L1460,200 L1700,300 L1900,220 L2170,330 L2170,440 L-560,440 Z" fill="#ddd6ee" stroke="#bdb2d8" stroke-width="2"/>'
           '<path d="M134,212 L160,190 L186,214 L172,210 L160,220 L148,210 Z M1014,194 L1040,170 L1066,196 L1050,192 L1040,202 L1028,192 Z" fill="#fff"/>'
           '<path d="M-560,430 Q-200,360 200,400 Q600,430 1000,396 Q1400,370 1800,404 L2170,420 V470 H-560 Z" fill="#cfe8b8" stroke="#a7cf92" stroke-width="2"/></g>')
    tav += '<g filter="url(#firka)">'
    for x, y, h in ((-420, 452, 84), (-330, 458, 70), (-240, 450, 90), (-150, 456, 74), (-60, 452, 82), (30, 458, 70), (120, 454, 78), (2060, 450, 86), (1980, 456, 72)):
        tav += fenyo(x, y, h, ["#8fb89a", "#7fae8c", "#9cc4a2"][int(r() * 3)])
    for x, y, rr in ((240, 460, 26), (360, 456, 22), (1200, 452, 24), (1320, 458, 22), (1880, 460, 26)):
        tav += lomb(x, y, rr, ["#9cc79a", "#8fbf8f", "#a7cfa2"][int(r() * 3)])
    tav += '</g>'
    tav += '<g filter="url(#firka)" stroke="#8a7a9a" stroke-width="1.6">'   # a falu a túlparton (kicsiben, a hídon túl)
    for x, y, w, h, fal, teto in ((1580, 560, 70, 46, "#fdf3e2", "#c96f5a"), (1680, 540, 60, 52, "#f9d6e2", LILA), (1780, 566, 84, 44, "#fde39a", "#c96f5a"),
                                  (1900, 548, 64, 50, "#d3e4f7", LILA), (2010, 570, 80, 40, "#fdf3e2", "#9a5a3a")):
        tav += hatso_haz(x, y, w, h, fal, teto, r)
    tav += '</g>' + fust(1700, 470, 2, 5, 30)
    irj(M, "tavoli", KIFESTVE, FIRKA, tav)

    # közép: rét, ösvény, patak + híd, a fa, a láda (csukva), bokrok, virág, fű
    koz = ('<rect x="%d" y="440" width="%d" height="%d" fill="url(#ret)"/>' % (BX0, BX1 - BX0, BY1 - 440) +
           '<path d="M%d,460 Q400,436 800,452 T%d,456 V520 H%d Z" fill="#c4e4b4"/>' % (BX0, BX1, BX0))
    koz += '<g filter="url(#firka)">'
    for x, y, rr in ((-300, 520, 36), (-120, 540, 30), (60, 520, 28), (1320, 520, 26), (1700, 640, 32), (1900, 620, 36), (2080, 660, 34)):
        koz += lomb(x, y, rr, ["#8fc98a", "#9fd19a", "#7fbf86", "#a7d99a"][int(r() * 4)])
    koz += '</g>'
    koz += p_patak() + p_hid()
    koz += ut(P_UT, 60) + ut(P_UT2, 44)
    koz += '<ellipse cx="%d" cy="%d" rx="150" ry="22" fill="#f4e6c4" stroke="#d9c79c" stroke-width="3"/>' % (fx, fy + 74)
    koz += p_fa(r)
    koz += '<g transform="translate(%d %d)">%s</g>' % (P_LADA[0], P_LADA[1], p_lada_zart())
    koz += '<g filter="url(#firka)" stroke="%s" stroke-width="2">' % INK
    for x, y, s in ((60, 700, 1.3), (300, 640, 1.0), (1000, 660, 1.0), (1180, 640, .9), (-160, 700, 1.3), (-380, 780, 1.4), (1350, 860, 1.2), (1600, 820, 1.3),
                    (1840, 860, 1.4), (360, 1000, 1.2), (1100, 1000, 1.3), (520, 690, .9)):
        if not foglalt(x, y):
            koz += bokor(x, y, s)
    koz += '</g>'
    koz += fucsomok(r, 460, BX0, BX1, 480, BY1, kihagy=foglalt)
    koz += viragok(r, 170, BX0, BX1, 490, BY1, kihagy=foglalt)
    irj(M, "kozep", KIFESTVE, FIRKA + '<linearGradient id="ret" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d4ecc4"/><stop offset="1" stop-color="#b9dc9c"/></linearGradient>'
        '<linearGradient id="kereg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#b48460"/><stop offset="1" stop-color="#8a5e40"/></linearGradient>'
        '<linearGradient id="vizp" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#d4eefa"/><stop offset=".5" stop-color="#a9d6ef"/><stop offset="1" stop-color="#86c0e3"/></linearGradient>', koz)

    # előtér: fű és bokor lent (a bal alsó érkezés szabad), fent a sarkokban lelógó lomb
    elo = '<g filter="url(#firka)" stroke="%s" stroke-width="2" fill="#a9d79a">' % INK
    elo += '<path d="M420,%d Q470,950 560,944 Q700,930 820,946 Q900,952 960,%d Z"/>' % (BY1 + 10, BY1 + 10)
    elo += '<path d="M1180,%d Q1240,948 1340,940 Q1560,912 1860,930 Q2040,916 %d,924 L%d,%d Z"/></g>' % (BY1 + 10, BX1 + 10, BX1 + 10, BY1 + 10)
    elo += '<g filter="url(#firka)" stroke="%s" stroke-width="2">' % INK + bokor(1260, 968, 1.5) + bokor(1700, 956, 1.5, "#7fbf86", "#9fd19a") + bokor(640, 972, 1.2) + '</g>'
    re_ = Rnd(95)
    for cx_, cy_, k in ((-440, -110, 1), (-240, -120, .9), (-60, -116, .7), (2080, -110, 1), (1900, -120, .8), (1700, -130, .6)):
        elo += '<g filter="url(#firka)"><path d="%s" fill="%s" stroke="%s" stroke-width="2"/><path d="%s" fill="#fff" opacity=".18" stroke="none"/></g>' % (
            pamacs(cx_, cy_, 170 * k, 110 * k, 10, re_), ["#7fbf7a", "#86c47c", "#76b672"][int(re_() * 3)], INK, pamacs(cx_ - 30 * k, cy_ - 20 * k, 70 * k, 40 * k, 7, re_, 1.2))
    elo += fucsomok(Rnd(98), 120, 440, BX1, 926, 966, c="#7fae6a")
    irj(M, "eloter", KIFESTVE, FIRKA, elo)

    # mozgó: felhők, lepkék, a patak csillogása, egy galamb köröz a dúc fölött, a fáról le-lehull egy levél; fölül madárcsapat
    csill = "".join(('<path d="%s" stroke="#fff" stroke-width="3" fill="none" stroke-dasharray="14 90" opacity=".8">'
                     '<animate attributeName="stroke-dashoffset" values="0;-104" dur="%ss" repeatCount="indefinite"/></path>') % (sima([(x + dx * min(1, (y - 520) / 240 + .2), y) for x, y in P_PATAK[2:]]), d)
                    for dx, d in ((-16, 2.6), (14, 3.4)))
    kor = ('<g><g><path d="M10,-2 Q2,-14 -8,-10 Q-14,-6 -12,-2 Q-4,4 10,-2 Z M-2,-8 Q6,-22 14,-16 Q8,-8 2,-6 Z" fill="#fbfaf6" stroke="%s" stroke-width="1.4"/>'
           '<animateTransform attributeName="transform" type="scale" values="1,1;1,.5;1,1" dur=".4s" repeatCount="indefinite"/></g>'
           '<animateMotion path="M1240,380 C1320,300 1420,320 1400,400 C1380,460 1260,460 1240,380 Z" dur="11s" repeatCount="indefinite" rotate="auto"/></g>') % INK
    hull = ('<g opacity="0"><path d="M0,0 q6,-8 14,-4 q-4,8 -14,4 Z" fill="#8cc47f" stroke="%s" stroke-width="1"/>'
            '<animateMotion path="M620,380 C660,440 580,500 640,560 C690,610 620,660 660,720" dur="9s" begin="2s" repeatCount="indefinite" rotate="auto"/>'
            '<animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.1;.85;1" dur="9s" begin="2s" repeatCount="indefinite"/></g>') % INK
    also = ('<g id="also" pointer-events="none">\n<g>' + uszo_felho(420, 20, 1.0, 80, 120) + uszo_felho(1500, 50, 1.2, -70, 150) + uszo_felho(-240, 60, 1.1, 60, 130) + "</g>\n" +
            csill + hull + kor +
            lepke(380, 860, "#f6a5c0", 14, "0,0;80,-40;160,10;60,30;0,0") + lepke(1120, 840, "#fce49a", 16, "0,0;-70,-20;-110,20;-30,30;0,0") + lepke(980, 700, "#c9a8e6", 13, "0,0;60,-24;100,6;30,20;0,0") + "\n</g>\n")
    felso = '<g id="felso" pointer-events="none">\n' + csapat(-140, 150, 1, 1900, 52) + "\n</g>"
    irj(M, "mozgo", KIFESTVE, "".join([MADAR, ULO]), also + felso, elotag="vm-")

    dob = {}
    # a levél 3 állapota (egy fájl mind a 6 helyre: a doboz a helyek.js-ben)
    for a in ("lepecsetelt", "megkezdett", "viragos"):
        irj(M, "level-" + a, (-40, -116, 80, 120), FIRKA, p_boritek(a))
    for i, (x, y) in enumerate(P_LEVEL):
        dob["level-%d" % (i + 1)] = (x - 40, y - 116, 80, 120)
    bx, by = P_DUC
    vbd = (bx - 80, by - 342, 160, 350)
    for a in ("level", "ures", "repul"):
        irj(M, "duc-" + a, vbd, FIRKA, '<g transform="translate(%s,%s)">%s</g>' % (f(bx), f(by), p_duc(a)))
    dob["duc"] = vbd
    lx, ly = P_LADA
    vbl = (lx - 50, ly - 135, 110, 140)
    irj(M, "lada-teli", vbl, FIRKA, '<g transform="translate(%s,%s)">%s</g>' % (f(lx), f(ly), p_lada_teli()))
    dob["lada"] = vbl
    s, vb = p_zaszlo()
    irj(M, "lada-zaszlo", vb, FIRKA, s)
    dob["lada-zaszlo"] = vb
    return dob


# ══════════════════ A POSTAFA TÁJ-KÉPE + a tó a stéggel, a barlang, a Doromboló-hegy köde (7. kör) ══════════════════
# A Postafa a közelkép kicsinyített mása: fa levelekkel, láda, galambdúc (a Kert és a híd közé szorítva — a korona a patak fölé hajlik).
TAJ_POSTA_DOBOZ = (370, 700, 132, 164)
def taj_postafa():
    r = Rnd(77)
    g = lambda s: '<g filter="url(#firka)" stroke="%s" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round">%s</g>' % (INK, s)
    arny = arnyek(434, 856, 50, 6, .12)
    torzs = ('<path d="M424,856 Q430,834 428,814 Q427,800 422,792 L446,792 Q441,802 442,816 Q442,836 448,856 Z" fill="#9b6c4a"/>'
             '<path d="M428,806 Q414,800 398,806 M442,804 Q458,798 474,804" stroke="#9b6c4a" stroke-width="5" fill="none"/>')
    korona = "".join('<path d="%s" fill="%s"/>' % (pamacs(cx, cy, rx, ry, 9, r), c) for cx, cy, rx, ry, c in
                     ((410, 778, 30, 20, "#86c07a"), (460, 776, 30, 20, "#8cc47f"), (434, 764, 44, 26, "#94c983"), (424, 740, 30, 18, "#9ccf8c"), (448, 742, 28, 17, "#94c983")))
    korona += '<path d="%s" fill="#fff" opacity=".22" stroke="none"/>' % pamacs(422, 738, 16, 7, 6, r, 1.2)
    levelek = ""
    for x, y, d in ((402, 816, 0), (418, 824, .7), (450, 824, 1.4), (468, 815, 2.1)):
        lv = '<path d="M%s,%s V%s" stroke="#8a7a6a" stroke-width=".8"/><rect x="%s" y="%s" width="10" height="7.4" rx=".8" fill="#fbefd8" stroke-width=".9"/><circle cx="%s" cy="%s" r="1.4" fill="%s" stroke="none"/>' % (
            f(x), f(y - 10), f(y), f(x - 5), f(y), f(x), f(y + 3.8), PIROS)
        levelek += lengo(lv, x, y - 10, 7, 2.6 + d)
    lada = '<path d="M404,858 V846" stroke="#8a5a3a" stroke-width="2.4"/><path d="M396,846 V834 Q396,829 404,828 Q412,829 412,834 V846 Z" fill="%s"/><path d="M400,839 H408" stroke="#3c2a50" stroke-width="1.4"/>' % PIROS
    lada += zaszlo(414, 846, 14, 9, 2.4, "#f2c14e", "#b5873a")
    duc = ('<path d="M484,860 V826" stroke="#a8764f" stroke-width="2.6"/><path d="M475,826 H494" stroke="#c99a6a" stroke-width="2.4"/><path d="M476,826 V812 H492 V826 Z" fill="#fdf3e2"/>'
           '<path d="M472,813 L484,802 L496,813 Z" fill="%s"/><circle cx="480" cy="819" r="2.2" fill="#3c2a50"/><circle cx="488" cy="819" r="2.2" fill="#3c2a50"/>' % LILA)
    galamb = ('<g><g transform="translate(491 824)"><path d="M3,0 Q1,-5 -3,-4 Q-6,-3 -5,0 Q-1,2 3,0 Z" fill="#fbfaf6" stroke-width=".8"/><circle cx="-4" cy="-5" r="2" fill="#fbfaf6" stroke-width=".7"/></g>'
              '<animateTransform attributeName="transform" type="translate" values="0,0;0,0;0,-2;0,0;0,0" keyTimes="0;.6;.66;.72;1" dur="4s" repeatCount="indefinite"/></g>')
    alap = arny + g(torzs + korona) + g(lada) + g(duc)
    elo = g(levelek) + g(galamb)
    virag = taj_viragsor(Rnd(71), 396, 476, 858, 5) + taj_viragsor(Rnd(72), 404, 470, 782, 7) + taj_csillam(((420, 732), (470, 770), (400, 790)))
    defs = FIRKA + SZURKE
    vb = TAJ_POSTA_DOBOZ
    irj("vilag", "postafa-kesz", vb, defs, alap + elo)
    irj("vilag", "postafa-viragos", vb, defs, alap + elo + virag)
    irj("vilag", "postafa-epul", vb, defs, '<g opacity=".5" filter="url(#szurke)">' + arny + g(torzs + korona) + g(duc) + '</g>' + taj_allv((396, 790, 470, 856)))
    return {"postafa (táj)": vb}


# a tó a stéggel: a patak a híd alatt kis tóba fut (a tó maga a közép rétegben: TAJ_TO — vilagkep-export.py teszi be), a stég díszlet,
# a csónak és a kacsa külön fájl (a játék ringatja: style.css .hely-csonak / .hely-kacsa)
TAJ_TO = (600, 832, 74, 24)
def taj_steg():
    tx, ty, rx, ry = TAJ_TO
    steg = fok(('<path d="M%s,%s L%s,%s L%s,%s L%s,%s Z" fill="#d8b48a"/>' % (f(tx + 66), f(ty - 18), f(tx - 4), f(ty - 12), f(tx - 4), f(ty - 6), f(tx + 66), f(ty - 10))) +
               "".join('<path d="M%s,%s V%s" stroke-width="2.4"/>' % (f(x), f(ty - 8 + (x - tx) * -.06), f(ty + 2)) for x in (tx + 4, tx + 30, tx + 56)) +
               "".join('<path d="M%s,%s l2,7" stroke-width="1" opacity=".6"/>' % (f(x), f(ty - 17 + (tx + 66 - x) * .08)) for x in (tx + 10, tx + 22, tx + 34, tx + 46)) +
               '<path d="M%s,%s V%s" stroke-width="2"/><circle cx="%s" cy="%s" r="2.4" fill="#c99a6a"/>' % (f(tx + 2), f(ty - 12), f(ty - 22), f(tx + 2), f(ty - 22)), 1.4)
    cs = fok(('<path d="M%s,%s Q%s,%s %s,%s L%s,%s L%s,%s Z" fill="#f4a38c"/>' % (f(tx - 26), f(ty + 2), f(tx - 6), f(ty + 16), f(tx + 22), f(ty + 2), f(tx + 18), f(ty - 4), f(tx - 22), f(ty - 4))) +
             '<path d="M%s,%s H%s" stroke="#fff" stroke-width="1.4" opacity=".8"/>' % (f(tx - 20), f(ty + 1), f(tx + 16)) +
             '<path d="M%s,%s V%s" stroke="#8a6a52" stroke-width="2"/><path d="M%s,%s L%s,%s L%s,%s Z" fill="#fffaf0"/>' % (f(tx), f(ty - 4), f(ty - 34), f(tx + 2), f(ty - 32), f(tx + 2), f(ty - 8), f(tx + 18), f(ty - 9)) +
             '<path d="M%s,%s Q%s,%s %s,%s" stroke="#8a7a6a" stroke-width="1" fill="none"/>' % (f(tx + 18), f(ty - 2), f(tx + 26), f(ty - 8), f(tx + 34), f(ty - 9)), 1.3)
    kx, ky = tx - 50, ty + 4
    kacsa = fok(('<path d="M%s,%s Q%s,%s %s,%s Q%s,%s %s,%s Z" fill="#fce49a"/><circle cx="%s" cy="%s" r="4.4" fill="#fce49a"/>'
                 '<path d="M%s,%s l-5,1.2 l5,1.4 Z" fill="#f2a03a" stroke-width=".8"/><circle cx="%s" cy="%s" r=".9" fill="%s" stroke="none"/>') % (
        f(kx - 9), f(ky), f(kx), f(ky + 6), f(kx + 10), f(ky - 1), f(kx + 4), f(ky - 4), f(kx - 9), f(ky), f(kx - 8), f(ky - 6), f(kx - 12), f(ky - 6.4), f(kx - 9), f(ky - 7), INK) +
                '<path d="M%s,%s q4,2 8,0 q4,-2 8,0" stroke="#fff" stroke-width="1" fill="none" opacity=".8"/>' % (f(kx - 10), f(ky + 4)), 1.2)
    vb_s = (tx - 10, ty - 30, 82, 36)
    vb_c = (tx - 32, ty - 40, 70, 60)
    vb_k = (kx - 18, ky - 14, 34, 24)
    irj("vilag", "steg", vb_s, FIRKA, steg)
    irj("vilag", "steg-csonak", vb_c, FIRKA, cs)
    irj("vilag", "steg-kacsa", vb_k, FIRKA, kacsa)
    return {"steg": vb_s, "steg-csonak": vb_c, "steg-kacsa": vb_k}


def taj_to():
    """a tó a közép rétegbe (vilagkep-export.py hívja): a patak jobb partjánál kiszélesedik"""
    tx, ty, rx, ry = TAJ_TO
    return ('<g filter="url(#firka)"><ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="#9cc98a" stroke="#5a4a7a" stroke-width="1.6"/>'
            '<path d="M%s,%s Q%s,%s %s,%s Q%s,%s %s,%s Q%s,%s %s,%s Z" fill="url(#vizgr)" stroke="#7fb3d6" stroke-width="1.4"/></g>'
            '<path d="M%s,%s q10,-3 20,0 M%s,%s q8,-2 16,0" stroke="#fff" stroke-width="1.6" fill="none" opacity=".7"/>'
            '<path d="M%s,%s q-4,-12 0,-20 M%s,%s q2,-10 6,-16 M%s,%s q-2,-12 -6,-18" stroke="#7fae6a" stroke-width="2" fill="none"/>') % (
        f(tx), f(ty + 2), f(rx + 8), f(ry + 6),
        f(tx - rx - 40), f(ty - 6), f(tx - rx + 10), f(ty - ry - 4), f(tx + 10), f(ty - ry), f(tx + rx + 6), f(ty - ry + 6), f(tx + rx), f(ty + 4),
        f(tx + rx - 20), f(ty + ry + 6), f(tx - rx - 44), f(ty + 12),
        f(tx - 30), f(ty + 4), f(tx + 20), f(ty + 12), f(tx + rx + 2), f(ty - 2), f(tx + rx + 8), f(ty), f(tx + rx - 4), f(ty + 6))


# a barlang a hegy jobb lábánál, a fenyves szélén (telekterv 11-22): sziklakapu, sötét száj, benne lila és kék kristályok (külön fájl,
# csillannak); koppintásra fehér karikák jönnek ki (barlang-hang, a játék mutatja: .hely-visszhang). Nem ijesztő: nincs szem, denevér.
TAJ_BARLANG = (1488, 450)
def taj_barlang():
    x, y = TAJ_BARLANG
    szikla = fok(('<path d="M%s,%s Q%s,%s %s,%s Q%s,%s %s,%s Q%s,%s %s,%s Q%s,%s %s,%s Z" fill="#cfc6de"/>' % (
        f(x - 56), f(y), f(x - 60), f(y - 30), f(x - 34), f(y - 52), f(x - 6), f(y - 74), f(x + 22), f(y - 60), f(x + 48), f(y - 52), f(x + 58), f(y - 22), f(x + 60), f(y), f(x - 56), f(y))) +
        '<path d="M%s,%s Q%s,%s %s,%s Q%s,%s %s,%s Z" fill="#3c2a50"/>' % (f(x - 22), f(y), f(x - 24), f(y - 40), f(x), f(y - 44), f(x + 24), f(y - 40), f(x + 22), f(y)) +
        '<path d="M%s,%s q10,-6 18,0 M%s,%s q8,-4 14,2 M%s,%s q-6,10 -2,20" stroke="#a79fc0" stroke-width="1.4" fill="none"/>' % (f(x - 48), f(y - 26), f(x + 30), f(y - 40), f(x + 44), f(y - 30)) +
        '<path d="M%s,%s l10,-2 l8,2 M%s,%s l-8,-2" stroke="#7fae6a" stroke-width="2" fill="none"/>' % (f(x - 40), f(y - 52), f(x + 40), f(y - 50)), 1.8)
    szikla += '<path d="%s" fill="#fff" opacity=".25" stroke="none"/>' % pamacs(x - 26, y - 56, 16, 8, 6, Rnd(5), 1.1)
    szikla += fok('<path d="M%s,%s q4,-8 10,-4 q4,-8 12,-2" fill="#8cc47f"/><path d="M%s,%s q6,-10 14,-4" fill="#9fd19a"/>' % (f(x - 64), f(y), f(x + 50), f(y)), 1.4)
    krist = ""
    for dx, h, c, sz in ((-12, 16, "#b9a6f0", .8), (-4, 24, "#9ec9f2", 1.1), (6, 18, "#c9a8e6", .9), (13, 12, "#9ec9f2", .7)):
        krist += '<path d="M%s,%s l%s,-%s l%s,-%s l%s,%s l%s,%s Z" fill="%s" stroke="#6a5f9a" stroke-width=".9"/>' % (
            f(x + dx - 4 * sz), f(y), f(1 * sz), f(h * .7), f(3 * sz), f(h * .3), f(3 * sz), f(h * .3), f(1 * sz), f(h * .7), c)
    krist += csillag4(x - 4, y - 22, .9) + csillag4(x + 8, y - 14, .6)
    hang = "".join('<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="none" stroke="#fff" stroke-width="%s" opacity="%s"/>' % (f(x), f(y - 20), f(16 + k * 14), f(14 + k * 11), f(3 - k * .7), f(1 - k * .25)) for k in range(3))
    vb = (x - 70, y - 84, 140, 92)
    vbk = (x - 20, y - 30, 40, 32)
    vbh = (x - 50, y - 60, 100, 80)
    irj("vilag", "barlang", vb, FIRKA, szikla)
    irj("vilag", "barlang-kristaly", vbk, "", krist)
    irj("vilag", "barlang-hang", vbh, "", hang)
    return {"barlang": vb, "barlang-kristaly": vbk, "barlang-hang": vbh}


# a Doromboló-hegy köde: két gomolygó réteg (más ütemben), a csúcson a jelzőtűz fénye pislákol át — a felveteli-kod.svg ködrésze
def taj_kod():
    p = os.path.join(REPO, "kepek", "vilag", "felveteli-kod.svg")
    s = open(p, encoding="utf8").read()
    a = s.find('<g id="jelzotuz"')
    if a < 0:
        a = s.index('<g id="kod-felveteli"')
    tuz = ('<g id="jelzotuz"><circle cx="1470" cy="48" r="22" fill="url(#tuzfeny)"><animate attributeName="opacity" values=".45;.95;.6;1;.5;.85;.45" dur="3.1s" repeatCount="indefinite"/></circle>'
           '<path d="M1465,52 Q1463,42 1470,34 Q1471,42 1476,44 Q1478,50 1474,52 Z" fill="#ffb347"><animateTransform attributeName="transform" type="scale" values="1,1;1,1.12;1,.94;1,1" dur=".9s" additive="sum" repeatCount="indefinite"/></path></g>')
    def reteg(id_, op, elemek, dur, dx):
        return ('<g id="%s" filter="url(#kod)" fill="#fff" opacity="%s">' % (id_, op) + "".join(
            '<ellipse cx="%s" cy="%s" rx="%s" ry="%s"/>' % e for e in elemek) +
            '<animateTransform attributeName="transform" type="translate" values="0,0;%s,-3;0,2;0,0" dur="%ss" repeatCount="indefinite"/>'
            '<animate attributeName="opacity" values="%s;%s;%s" dur="%ss" repeatCount="indefinite"/></g>') % (dx, dur, op, round(op * .78, 2), op, round(dur * .7, 1))
    hatso = reteg("kod-hatso", .62, ((1440, 150, 120, 28), (1510, 104, 86, 22), (1400, 196, 100, 20), (1560, 170, 70, 18)), 26, 30)
    elso = reteg("kod-elso", .72, ((1470, 128, 90, 22), (1380, 170, 80, 18), (1530, 140, 70, 20), (1476, 62, 54, 13), (1450, 206, 110, 16)), 17, -26)
    s = s[:a] + tuz + hatso + elso + "\n</svg>\n"
    if "tuzfeny" not in s: s = s.replace("</defs>", '<radialGradient id="tuzfeny"><stop offset="0" stop-color="#ffd27a" stop-opacity=".95"/><stop offset=".5" stop-color="#ffb347" stop-opacity=".45"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></radialGradient></defs>', 1)
    open(p, "w", encoding="utf8", newline="\n").write(s)
    return {"felveteli-kod": (1290, 20, 410, 220)}


if __name__ == "__main__":
    # py terv/kozelkep-export.py            → minden közelkép + a táj-képeik
    # py terv/kozelkep-export.py erdoszel   → csak a megnevezett(ek) (ter, domboldal, kezmuvesek, erdoszel, osszeado-utca, dallam-ter, postafa;
    #                                          a tájon még: steg, barlang, kod — 7. kör)
    CSAK = set(sys.argv[1:])
    kell = lambda n: not CSAK or n in CSAK
    print("kep.kifestve (helyek.js): [%d, %d, %d, %d]" % KIFESTVE)
    TAJ = (("kezmuvesek", taj_kezmuvesek), ("ter", taj_ter), ("domboldal", taj_domboldal), ("erdoszel", taj_erdoszel), ("osszeado-utca", taj_osszeado_utca), ("dallam-ter", taj_dallam_ter),
           ("postafa", taj_postafa), ("steg", taj_steg), ("barlang", taj_barlang), ("kod", taj_kod))
    for nev, fn in TAJ:
        if not kell(nev): continue
        for k_, vb in fn().items():
            print("vilag/%s — doboz (HELYEK.vilag): [%.4f, %.4f, %.4f, %.4f]" % (k_, vb[0] / W, vb[1] / H, vb[2] / W, vb[3] / H))
    for mappa, fn in (("ter", ter), ("domboldal", domboldal), ("kezmuvesek", kezmuvesek), ("erdoszel", erdoszel), ("osszeado-utca", osszeado_utca), ("dallam-ter", dallam_ter), ("postafa", postafa)):
        if not kell(mappa): continue
        dob = fn()
        print("\n%s — doboz (helyek.js):" % mappa)
        for k, vb in dob.items():
            print("  %s: [%.4f, %.4f, %.4f, %.4f]" % (k, vb[0] / W, vb[1] / H, vb[2] / W, vb[3] / H))
        d = os.path.join(REPO, "kepek", mappa)
        fs = sorted(os.listdir(d)); tot = sum(os.path.getsize(os.path.join(d, x)) for x in fs)
        print("  %d fájl, %.0f KB; legnagyobb: %s" % (len(fs), tot / 1024, max((os.path.getsize(os.path.join(d, x)), x) for x in fs)))
        if mappa == "osszeado-utca":
            utca_tabla()
        if mappa == "dallam-ter":
            dallam_tabla()
