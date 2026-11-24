#!/usr/bin/env python3
"""kozelkep-export.py — Világkép 3. kör, 2. kódkör (2026-11-24): a Nagyfa tér és a Domboldal közelképének VÉGLEGES rajza;
4. kör, 2. kódkör (2026-11-24): a Kézművesek mini utcája (kezmuvesek(): 3 műhely × 5 állapot, malom + kerék + hab, kötél, macska).

Használat: py terv/kozelkep-export.py   →   kepek/ter/*.svg, kepek/domboldal/*.svg, kepek/kezmuvesek/*.svg
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
import os, re

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


if __name__ == "__main__":
    print("kep.kifestve (helyek.js): [%d, %d, %d, %d]" % KIFESTVE)
    vb = taj_kezmuvesek()["kezmuvesek (táj)"]
    print("\nvilag/kezmuvesek — doboz (HELYEK.vilag): [%.4f, %.4f, %.4f, %.4f]" % (vb[0] / W, vb[1] / H, vb[2] / W, vb[3] / H))
    for fn, nev in ((taj_ter, "ter"), (taj_domboldal, "domboldal")):
        vb = list(fn().values())[0]
        print("vilag/%s — doboz (HELYEK.vilag): [%.4f, %.4f, %.4f, %.4f]" % (nev, vb[0] / W, vb[1] / H, vb[2] / W, vb[3] / H))
    for mappa, fn in (("ter", ter), ("domboldal", domboldal), ("kezmuvesek", kezmuvesek)):
        dob = fn()
        print("\n%s — doboz (helyek.js):" % mappa)
        for k, vb in dob.items():
            print("  %s: [%.4f, %.4f, %.4f, %.4f]" % (k, vb[0] / W, vb[1] / H, vb[2] / W, vb[3] / H))
        d = os.path.join(REPO, "kepek", mappa)
        fs = sorted(os.listdir(d)); tot = sum(os.path.getsize(os.path.join(d, x)) for x in fs)
        print("  %d fájl, %.0f KB; legnagyobb: %s" % (len(fs), tot / 1024, max((os.path.getsize(os.path.join(d, x)), x) for x in fs)))
