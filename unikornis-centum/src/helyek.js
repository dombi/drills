/* ═════════════════ 1c) 🐴 HELY-TÁBLÁK: a világkép (Thinking horses) és a közelképek adatai ═════════════════
   Terv: terv/vilagkep-rendszerterv.html 3. pont (✅ jóváhagyva 2026-11-23). A KÓD CSAK EZT A TÁBLÁT OLVASSA (hely.js):
   rajz-csere = új képfájlok + legfeljebb a koordináták igazítása. Minden szám ARÁNY (0–1) a kép szélességéhez / magasságához.
     helyek[i] = { id, x, y (talppont), w, h (a koppintható téglalap = a ráközelítés célja), all (ide sétál az unikornis),
                   jel (állapotjel-horgony), kep (a rajz), cel (hová visz),
                   palyak (a jel-összegzéshez), telefon (2. elrendezés, később) }
     cel: { kepernyo: "odu" | "kert" | "utca" } · { regio: "osszeado" } · { kozelkep: "kezmuvesek" } · { kod: true } (ködben, nem nyílik)
          · { palyak: ["tuske-bolt"] } (3. kör: a ház = a pálya) · { palyak: [a, b] } (2–4 pálya: a ház TÁRGY-NÉZETE, a tárgy a bejárat;
            a tárgyak rajza és téglalapja ma: PC_TARGY[hely-id], piac.js). Pálya után ebbe a közelképbe, a ház elé tér vissza.
     rk: a ház saját nagysága (a köd és az újonc-fény mérete; az ideiglenes JS-rajzé is), ha eltér a tábla jk-jától
     utak: [A, B, [töréspontok]] — A, B hely-id vagy útkereszteződés (pontok); ezen sétál az unikornis (patakon csak a hídon)
     jarhato: sokszögek — szabad séta: ide koppintva odamegy; máshová koppintva a legközelebbi járható pontig
     diszlet: koppintható apróság, jutalom nélkül (mozdul + mondat) · fájlnál: kep + doboz, reszek: [[fájl, doboz, osztály], …] fölé rajzolva
   2. KÖR (2026-11-23): a rajz FÁJLOKBAN él (kep.mappa): rétegek (eg, tavoli, kozep, eloter, mozgo) + helyenként
   <kep>-epul / -kesz / -viragos (+ felveteli-kod). doboz = a hely képének helye [x, y, w, h] (arány). A helyek még a MAI
   ligetekbe / Piactérre visznek (biztonsági háló). Rajz-csere: új fájlok + kep.v emelése (+ sw.js lista, ha új fájlnév).
   kep.kifestve (px): a rétegfájlok (eg, tavoli, kozep, eloter, mozgo) ennyit fednek; a helyek koordinátái a 0–1 tartományban maradnak. */
var VILAG_NEV = "Thinking horses";   /* a játék és a táj neve (a gyerek ezt látja; kiejtés: KIEJTES, audio.js) */
var HELY_HATAR = { taj: 14, kozelkep: 8, targy: 4 };   /* több hely a táblában = a próba-lap pirosan jelez */
var HELYEK = {};
HELYEK.vilag = {
  nev: VILAG_NEV,
  kep: { w: 1600, h: 900, zona: [0.05, 0.05, 0.90, 0.90], hatter: "vilag", mappa: "kepek/vilag/", v: "20261125-2",
         kifestve: [-560, -160, 2720, 1220] },   /* a rajz vektoros: 1600×900 is éles nagyításkor · kifestve: a rétegek a széleken túl is rajzolnak
            (px, [x, y, w, h]; 21:9-től 4:3-ig fed) — a nézet ezen belül marad, így nincs üres sáv (2026-11-24) */
  retegek: ["eg", "tavoli", "kozep"], mozgo: "mozgo", eloter: "eloter",   /* alulról felfelé: rétegek · mozgó (alsó) · díszlet · helyek · mozgó (felső) · unikornis · előtér */
  uni: 0.62, jk: 1.25,   /* az unikornis és a (mai) jelképek mérete a kép egységében */
  pontok: { hid: [0.318, 0.86], tisztas: [0.20, 0.82], kut: [0.47, 0.66] },   /* útkereszteződések (nem koppinthatók) */
  patak: [[0.15, 0.36], [0.19, 0.50], [0.215, 0.62], [0.24, 0.70], [0.30, 0.78], [0.32, 0.88], [0.322, 1.0]],   /* ideiglenes rajzhoz */
  helyek: [
    { id: "odu",           x: 0.11, y: 0.92, w: 0.08, h: 0.15, all: [0.155, 0.935], jel: [0.11, 0.73], kep: "odu", doboz: [0.0575, 0.7222, 0.1050, 0.2200],      cel: { kepernyo: "odu" } },
    { id: "kert",          x: 0.21, y: 0.92, w: 0.09, h: 0.13, all: [0.255, 0.94],  jel: [0.21, 0.84], kep: "kert", doboz: [0.1688, 0.8356, 0.0825, 0.1067],     cel: { kepernyo: "kert" } },
    { id: "postafa",       x: 0.28, y: 0.93, w: 0.07, h: 0.14, all: [0.25, 0.955], jel: [0.28, 0.80], kep: "postafa", doboz: [0.2487, 0.8022, 0.0638, 0.1422], cel: { regio: "egyeni" } },
    { id: "erdoszel",      x: 0.10, y: 0.76, w: 0.08, h: 0.16, all: [0.158, 0.78], jel: [0.10, 0.64], kep: "erdoszel", doboz: [0.0550, 0.6356, 0.1075, 0.1178], cel: { kozelkep: "erdoszel" },   /* 5. kör (2026-11-24): saját közelkép; táj-kép: taj_erdoszel */
      palyak: ["bontas-felmondas", "oszkiv-10", "oszkiv-20", "bujocska-ret"] },
    { id: "utca",          x: 0.37, y: 0.78, w: 0.07, h: 0.15, all: [0.41, 0.795], jel: [0.37, 0.665], kep: "utca", doboz: [0.3250, 0.6622, 0.0988, 0.1333],     cel: { kepernyo: "utca" } },
    { id: "ter",           x: 0.514, y: 0.805, w: 0.14, h: 0.18, all: [0.61, 0.82], jel: [0.514, 0.61], kep: "ter", doboz: [0.4375, 0.6222, 0.1537, 0.2022],    cel: { kozelkep: "ter" },   /* táj-kép 2026-11-24: a Nagyfa tér kicsinyített mása (terv/kozelkep-export.py taj_ter) */
      palyak: ["tuske-bolt", "zsibvasar", "fizess-pontosan", "szalag-eloszoba", "vasar-3", "vasar-3d"] },
    { id: "osszeado-utca", x: 0.70, y: 0.71, w: 0.15, h: 0.23, all: [0.78, 0.725], jel: [0.70, 0.46], kep: "osszeado-utca", doboz: [0.6031, 0.4578, 0.1825, 0.2567], cel: { kozelkep: "osszeado-utca" },   /* 5. kör (2026-11-24): végleges közelkép; táj-kép: taj_osszeado_utca, 11-25 óta 1,7-szeres (alig látszott); a megálló a jobb oldalán */
      palyak: ["rokon-letra", "szamcsalad", "tizesek", "aprok", "lepegeto", "atlepo", "szazas-bujocska", "erdo-melye", "erdo-szive"] },
    { id: "dallam-ter",    x: 0.86, y: 0.72, w: 0.08, h: 0.17, all: [0.81, 0.735], jel: [0.86, 0.52], kep: "dallam-ter", doboz: [0.8237, 0.5222, 0.0725, 0.2133], cel: { regio: "szorzo" } },
    { id: "kezmuvesek",    x: 0.28, y: 0.655, w: 0.125, h: 0.11, all: [0.348, 0.668], jel: [0.285, 0.545], kep: "kezmuvesek", doboz: [0.2112, 0.5311, 0.1313, 0.1333], cel: { kozelkep: "kezmuvesek" } },   /* táj-kép 2026-11-24: a mini utca kicsinyített mása (terv/kozelkep-export.py taj_kezmuvesek) */
    { id: "domboldal",     x: 0.40, y: 0.50, w: 0.10, h: 0.13, all: [0.485, 0.468], jel: [0.385, 0.35], kep: "domboldal", doboz: [0.3475, 0.3622, 0.1075, 0.1511],  cel: { kozelkep: "domboldal" },   /* táj-kép 2026-11-24: szerpentin, Garas tornya, Jósda, Déli vásár (taj_domboldal) */
      palyak: ["vasar-4", "irasbeli-szorzas", "irasbeli-osztas", "josda-eloszoba", "josda-1em"] },
    { id: "konyvtar",      x: 0.63, y: 0.40, w: 0.06, h: 0.17, all: [0.67, 0.415], jel: [0.63, 0.22], kep: "konyvtar", doboz: [0.5938, 0.2111, 0.0725, 0.2022], cel: { regio: "konyvtar" } },
    { id: "fejtoro",       x: 0.78, y: 0.26, w: 0.12, h: 0.18, all: [0.72, 0.275], jel: [0.775, 0.195], kep: "fejtoro", doboz: [0.7475, 0.0333, 0.0612, 0.2422], cel: { regio: "fejtoro" } },
    { id: "felveteli",     x: 0.91, y: 0.20, w: 0.08, h: 0.14, all: [0.86, 0.215], jel: [0.91, 0.08], kep: "felveteli", doboz: [0.8063, 0.0222, 0.2562, 0.2444],   cel: { kod: true } }
  ],
  utak: [
    ["odu", "kert", [[0.20, 0.955]]], ["kert", "postafa", []], ["odu", "erdoszel", [[0.12, 0.86]]],
    ["erdoszel", "tisztas", [[0.17, 0.80]]], ["kert", "tisztas", [[0.24, 0.87]]], ["postafa", "hid", [[0.29, 0.90]]], ["tisztas", "hid", [[0.27, 0.85]]],
    ["hid", "utca", [[0.36, 0.84]]], ["utca", "ter", [[0.47, 0.83]]], ["utca", "kezmuvesek", [[0.37, 0.70]]],
    ["ter", "kut", [[0.55, 0.72]]], ["kut", "osszeado-utca", [[0.62, 0.70]]], ["osszeado-utca", "dallam-ter", [[0.77, 0.75]]],
    ["kut", "domboldal", [[0.44, 0.58], [0.47, 0.52]]], ["domboldal", "konyvtar", [[0.52, 0.47], [0.60, 0.44]]],
    ["konyvtar", "fejtoro", [[0.69, 0.36], [0.70, 0.30]]], ["fejtoro", "felveteli", [[0.80, 0.24], [0.84, 0.22]]]
  ],
  jarhato: [
    [[0.03, 0.70], [0.12, 0.68], [0.20, 0.64], [0.225, 0.71], [0.285, 0.79], [0.302, 0.88], [0.303, 0.99], [0.03, 0.99]],                      /* a hazai part (odú, kert, erdőszél) */
    [[0.30, 0.835], [0.34, 0.835], [0.34, 0.885], [0.30, 0.885]],                                                                              /* a híd */
    [[0.235, 0.63], [0.30, 0.56], [0.40, 0.50], [0.50, 0.56], [0.70, 0.62], [0.97, 0.64], [0.97, 0.99], [0.345, 0.99], [0.342, 0.86], [0.322, 0.78], [0.262, 0.71]],   /* a falu */
    [[0.36, 0.48], [0.43, 0.42], [0.52, 0.44], [0.60, 0.40], [0.66, 0.36], [0.70, 0.43], [0.60, 0.50], [0.48, 0.55], [0.40, 0.52]]          /* a domboldal */
  ],
  diszlet: [
    { id: "tabla", x: 0.057, y: 0.664, w: 0.065, h: 0.085, elol: true, felirat: [0, -48], mondat: function () { return VILAG_NEV; } },
    { id: "hid", x: 0.32, y: 0.885, w: 0.06, h: 0.07, kep: "hid", doboz: [0.2850, 0.8222, 0.0663, 0.0733], mondat: "A híd. Át a patakon!" },
    { id: "steg", x: 0.34, y: 0.995, w: 0.07, h: 0.06, mondat: "Egy csónak a stégnél. Egyszer majd útra kel!" },   /* vízi ígéret-kapu: még nem nyílik */
    { id: "madarak", x: 0.55, y: 0.16, w: 0.12, h: 0.08, mozdul: "rebben", mondat: "Csip-csirip!" }
  ]
};
/* 🧵🧪🧁 Kézművesek — 4. kör (terv: Matekos\vilagkep-4-kor-kezmuvesek.html, ✅ 2026-11-24): mini utca a patak partján.
   Balra a patakon a malom (díszlet), mellette a Mézes pékség, középen hátul (a legmagasabb) a Bájitalkonyha, jobbra a Szabóműhely,
   a szélén üres telek. A ház = a műhely, a TÁRGY a bejárat (PC_TARGY.szabo / bajital / pekseg, piac.js): 4 tárgy a helyén a műhelyben.
   2. kódkör (2026-11-24): a rajz fájlokban (kepek/kezmuvesek/, exportáló: terv/kozelkep-export.py): rétegek + házanként 5 állapot,
   díszlet-fájlok: malom (+ reszek: malom-kerek — a játék forgatja, koppintásra gyorsabban: style.css .hely-malomkerek —, malom-hab),
   kotel, macska; az üres telek a közép rétegben. A 12 tárgy kívülről is látszik (kirakat, párkány, a ház előtt). A patak nem járható. */
HELYEK.kezmuvesek = {
  nev: "Kézművesek", vissza: "vilag",
  kep: { w: 1600, h: 900, zona: [0.05, 0.04, 0.90, 0.93], hatter: "kezmuvesek", mappa: "kepek/kezmuvesek/", v: "20261124-2", kifestve: [-560, -160, 2720, 1220] },
  retegek: ["eg", "tavoli", "kozep"], mozgo: "mozgo", eloter: "eloter",
  uni: 1.0, jk: 2.4,
  pontok: { kapu: [0.705, 0.965], sarok: [0.735, 0.875], kozep: [0.58, 0.79], malomelo: [0.30, 0.735] },
  helyek: [
    { id: "pekseg",  x: 0.409, y: 0.667, w: 0.17, h: 0.27, all: [0.462, 0.745], jel: [0.409, 0.395], kep: "pekseg",  rk: 3.3, doboz: [0.3013, 0.3756, 0.2050, 0.3111],
      cel: { palyak: ["meres-pekseg-1", "meres-pekseg-2", "meres-pekseg-3", "meres-pekseg-4"] } },
    { id: "bajital", x: 0.603, y: 0.578, w: 0.13, h: 0.39, all: [0.648, 0.665], jel: [0.603, 0.175], kep: "bajital", rk: 3.6, doboz: [0.5031, 0.1333, 0.2037, 0.5067],
      cel: { palyak: ["meres-bajital-1", "meres-bajital-2", "meres-bajital-3", "meres-bajital-4"] } },
    { id: "szabo",   x: 0.806, y: 0.711, w: 0.17, h: 0.25, all: [0.752, 0.80], jel: [0.806, 0.455], kep: "szabo",   rk: 3.2, doboz: [0.6987, 0.4356, 0.2387, 0.2956],
      cel: { palyak: ["meres-szabo-1", "meres-szabo-2", "meres-szabo-3", "meres-szabo-4"] } }
  ],
  utak: [["kapu", "sarok", []], ["sarok", "szabo", []], ["sarok", "kozep", [[0.66, 0.835]]], ["kozep", "bajital", [[0.62, 0.72]]],
         ["kozep", "pekseg", [[0.50, 0.762]]], ["pekseg", "malomelo", [[0.37, 0.73]]]],
  jarhato: [[[0.19, 0.74], [0.24, 0.70], [0.33, 0.69], [0.45, 0.70], [0.53, 0.66], [0.60, 0.63], [0.68, 0.62], [0.72, 0.70], [0.74, 0.76],
             [0.86, 0.80], [0.99, 0.83], [0.99, 0.99], [0.10, 0.99], [0.15, 0.83]]],
  diszlet: [
    { id: "malom", x: 0.228, y: 0.756, w: 0.18, h: 0.37, mozdul: "kelepel", kep: "malom", doboz: [0.1250, 0.3778, 0.2188, 0.3778],
      reszek: [["malom-kerek", [0.1363, 0.5644, 0.1025, 0.1822], "hely-malomkerek"], ["malom-hab", [0.1225, 0.6889, 0.1313, 0.0822]]], mondat: "Kelepel a malom. Lisztet őröl a pékségnek!" },
    { id: "telek", x: 0.9375, y: 0.667, w: 0.11, h: 0.145, mondat: "Ez még üres műhely. Egyszer ide is beköltözik valaki!" },
    { id: "kotel", x: 0.80, y: 0.44, w: 0.15, h: 0.09, kep: "kotel", doboz: [0.7188, 0.3333, 0.1750, 0.2556] },   /* csak meglebben */
    { id: "macska", x: 0.435, y: 0.59, w: 0.04, h: 0.045, elol: true, haz: "pekseg", kep: "macska", doboz: [0.4175, 0.5467, 0.0387, 0.0622], mondat: "Miau!" }
  ]
};
/* 🌳 Nagyfa tér — 3. kör (terv: Matekos\vilagkep-3-kor-ter-domboldal.html, ✅ 2026-11-24). 2. kódkör: a rajz fájlokban (kepek/ter/,
   exportáló: terv/kozelkep-export.py). Telkek: hátul bolt + sátor, elöl Zsivány standja + Szalagműhely, a két szélen 2 üres telek (díszlet).
   A ház képe: <kep>-epul / -teto / -ajto / -kesz / -viragos (helyKepAllapot: a ház pályáinak piacHazLepes-e). rk: a köd és a fénykör nagysága. */
HELYEK.ter = {
  nev: "Nagyfa tér", vissza: "vilag",
  kep: { w: 1600, h: 900, zona: [0.05, 0.04, 0.90, 0.93], hatter: "ter", mappa: "kepek/ter/", v: "20261124-2", kifestve: [-560, -160, 2720, 1220] },
  retegek: ["eg", "tavoli", "kozep"], mozgo: "mozgo", eloter: "eloter",
  uni: 1.0, jk: 2.0,
  pontok: { kapu: [0.50, 0.91], fa: [0.50, 0.80] },
  helyek: [
    { id: "bolt",   x: 0.2625, y: 0.585, w: 0.16, h: 0.25, all: [0.36, 0.62], jel: [0.2625, 0.295], kep: "bolt",   rk: 2.2, doboz: [0.1613, 0.2722, 0.1925, 0.3256], cel: { palyak: ["tuske-bolt"] } },
    { id: "vasar",  x: 0.7375, y: 0.585, w: 0.17, h: 0.27, all: [0.63, 0.62], jel: [0.7375, 0.27], kep: "vasar",  rk: 2.4, doboz: [0.6288, 0.3022, 0.2075, 0.2956], cel: { palyak: ["vasar-3", "vasar-3d"] } },
    { id: "zsib",   x: 0.25,   y: 0.90,  w: 0.19, h: 0.21, all: [0.38, 0.92], jel: [0.25, 0.665],  kep: "zsib",   rk: 1.9, doboz: [0.1288, 0.6511, 0.2325, 0.2578], cel: { palyak: ["zsibvasar", "fizess-pontosan"] } },
    { id: "szalag", x: 0.7625, y: 0.90,  w: 0.15, h: 0.24, all: [0.64, 0.92], jel: [0.7625, 0.635], kep: "szalag", rk: 2.1, doboz: [0.6587, 0.6111, 0.1975, 0.2978], cel: { palyak: ["szalag-eloszoba"] } }
  ],
  utak: [["kapu", "fa", []], ["fa", "bolt", [[0.42, 0.68]]], ["fa", "vasar", [[0.58, 0.68]]], ["kapu", "zsib", [[0.44, 0.94]]], ["kapu", "szalag", [[0.56, 0.94]]]],
  jarhato: [[[0.15, 0.66], [0.22, 0.56], [0.35, 0.48], [0.50, 0.46], [0.65, 0.48], [0.78, 0.56], [0.85, 0.66], [0.93, 0.78], [0.97, 0.98], [0.03, 0.98], [0.07, 0.78]]],
  diszlet: [
    { id: "nagyfa", x: 0.50, y: 0.735, w: 0.20, h: 0.45, kep: "nagyfa", doboz: [0.3250, 0.1556, 0.3500, 0.6000], mondat: "A nagyfa. Alatta jó pihenni!" },
    { id: "telek", x: 0.08, y: 0.73, w: 0.10, h: 0.13, mondat: "Ez még üres telek. Egyszer ide is épül valami!" },
    { id: "telek", x: 0.925, y: 0.77, w: 0.10, h: 0.13, mondat: "Ez még üres telek. Egyszer ide is épül valami!" },
    { id: "domb", x: 0.65, y: 0.42, w: 0.08, h: 0.10, mondat: "Arra visz az út fel a Domboldalra." }
  ]
};
/* ☀️ Domboldal — 3. kör: szerpentin; lent a Déli vásár, félúton Garas tornya, a tetőn a Jósda; 2 üres telek a kanyarokban.
   2. kódkör: a rajz fájlokban (kepek/domboldal/); az utak a rajzolt szerpentint követik (exportáló: SZERP). */
HELYEK.domboldal = {
  nev: "Domboldal", vissza: "vilag",
  kep: { w: 1600, h: 900, zona: [0.05, 0.04, 0.90, 0.93], hatter: "domboldal", mappa: "kepek/domboldal/", v: "20261124-2", kifestve: [-560, -160, 2720, 1220] },
  retegek: ["eg", "tavoli", "kozep"], mozgo: "mozgo", eloter: "eloter",
  uni: 0.85, jk: 1.6,
  pontok: { kapu: [0.385, 0.94], kanyar: [0.58, 0.83], kanyar2: [0.369, 0.522] },
  helyek: [
    { id: "deli",     x: 0.6875,  y: 0.885, w: 0.24, h: 0.27, all: [0.555, 0.875], jel: [0.6875, 0.565], kep: "deli",     rk: 2.4, doboz: [0.5387, 0.5800, 0.3000, 0.3111], cel: { palyak: ["vasar-4"] } },
    { id: "irasbeli", x: 0.29375, y: 0.635, w: 0.10, h: 0.43, all: [0.366, 0.645], jel: [0.29375, 0.165], kep: "irasbeli", rk: 2.6, doboz: [0.2175, 0.1800, 0.1425, 0.4667], cel: { palyak: ["irasbeli-szorzas", "irasbeli-osztas"] } },
    { id: "josda",    x: 0.825,   y: 0.285, w: 0.13, h: 0.20, all: [0.74, 0.333],  jel: [0.825, 0.075],   kep: "josda",    rk: 1.9, doboz: [0.7362, 0.0667, 0.1675, 0.2333], cel: { palyak: ["josda-eloszoba", "josda-1em"] } }
  ],
  utak: [["kapu", "kanyar", [[0.4375, 0.922], [0.53, 0.867]]], ["kanyar", "deli", []], ["kanyar", "irasbeli", [[0.56, 0.765], [0.50, 0.69], [0.43, 0.655]]],
         ["irasbeli", "kanyar2", [[0.34, 0.58]]], ["kanyar2", "josda", [[0.47, 0.455], [0.60, 0.422], [0.70, 0.385]]]],
  jarhato: [[[0.24, 0.99], [0.14, 0.86], [0.12, 0.70], [0.20, 0.58], [0.33, 0.505], [0.56, 0.405], [0.75, 0.245], [0.86, 0.17], [0.97, 0.16], [0.97, 0.99]]],
  diszlet: [
    { id: "telek", x: 0.125, y: 0.60, w: 0.10, h: 0.12, mondat: "Ez még üres telek. Egyszer ide is épül valami!" },
    { id: "telek", x: 0.575, y: 0.40, w: 0.10, h: 0.12, mondat: "Ez még üres telek. Egyszer ide is épül valami!" },
    { id: "kecske", x: 0.19, y: 0.855, w: 0.06, h: 0.08, kep: "kecske", doboz: [0.1638, 0.7733, 0.0625, 0.0911], mondat: "Mek-mek!" }
  ]
};
/* 🍄 Erdőszél — 5. kör, 1. kódkör (terv: Matekos\vilagkep-5-kor-erdoszel-osszeado-utca.html 5–8. pont, ✅ 2026-11-24, mind A):
   tisztás a fák között. Lent középen érkezik (az Odú felől), az ösvény a villánál ágazik szét. Elöl balra a kis gombaház (Kitti
   bogyót tesz a kosárba, aztán kivesz egyet), balra hátul az öreg tölgy (Mia két kupacba rakja a makkot), jobbra hátul az ér mögött,
   PALLÓN át a nagy gombaház (Brekus átugrik a pallón), elöl jobbra a rét (a nagy levél mögül Cincin kukucskál), hátul középen a
   mohás tisztás = üres telek. Az ér nem járható (patak + pontok.hid: csak a pallón át). A két gombaházat a méretük különbözteti meg.
   lepes: 3 — nem ház, hanem hely: kopar → berendezett → viragos (helyKepAllapot); a ház 5 lépésben, mint a 3–4. körben.
   sorrend: true — rejtett sorrend: mindig csak a következő hely világít (helySorrend, hely.js); szám sehol. Rajz: kepek/erdoszel/
   (terv/kozelkep-export.py erdoszel(); a lakók a figurak.js mai rajza: terv/figurak-alak.json). */
HELYEK.erdoszel = {
  nev: "Erdőszél", vissza: "vilag", sorrend: true,
  kep: { w: 1600, h: 900, zona: [0.05, 0.04, 0.90, 0.93], hatter: "erdoszel", mappa: "kepek/erdoszel/", v: "20261124-2", kifestve: [-560, -160, 2720, 1220] },
  retegek: ["eg", "tavoli", "kozep"], mozgo: "mozgo", eloter: "eloter",
  uni: 0.95, jk: 2.2,
  pontok: { kapu: [0.485, 0.955], villa: [0.489, 0.82], hid: [0.735, 0.642], tisztas: [0.50, 0.625] },
  patak: [[0.756, 0.467], [0.72, 0.531], [0.721, 0.589], [0.735, 0.642], [0.746, 0.696], [0.73, 0.758], [0.719, 0.778], [0.666, 0.793], [0.7725, 0.793],
           [0.7725, 0.7844], [0.8313, 0.7711], [0.9125, 0.7644], [1.0, 0.7511], [1.075, 0.7511]],   /* az ér, a tócsa és a sövény a túlsó part alján: nem járható (csak a pallón át) */
  helyek: [
    { id: "kisgomba",  x: 0.3419, y: 0.889, w: 0.16, h: 0.21, all: [0.4375, 0.906], jel: [0.325, 0.66], kep: "kisgomba",  rk: 2.0, doboz: [0.2575, 0.6889, 0.1675, 0.2178], cel: { palyak: ["oszkiv-10"] } },
    { id: "nagygomba", x: 0.8438, y: 0.622, w: 0.17, h: 0.29,  all: [0.781, 0.649], jel: [0.8438, 0.30], kep: "nagygomba", rk: 2.6, doboz: [0.7550, 0.3267, 0.1800, 0.3133], cel: { palyak: ["oszkiv-20"] } },
    { id: "ret",       x: 0.8406, y: 0.924, w: 0.235, h: 0.19, all: [0.7125, 0.8956], jel: [0.8406, 0.72], kep: "ret", lepes: 3, rk: 2.0, doboz: [0.7094, 0.7133, 0.2625, 0.2378], cel: { palyak: ["bujocska-ret"] } },
    { id: "tolgy",     x: 0.2075, y: 0.717, w: 0.28, h: 0.53, all: [0.325, 0.767], jel: [0.2063, 0.19], kep: "tolgy", lepes: 3, rk: 3.4, doboz: [0.0612, 0.1611, 0.2925, 0.5889], cel: { palyak: ["bontas-felmondas"] } }
  ],
  utak: [["kapu", "villa", []], ["villa", "kisgomba", [[0.459, 0.878]]], ["villa", "tolgy", [[0.40, 0.795]]], ["villa", "tisztas", [[0.494, 0.70]]],
         ["villa", "hid", [[0.57, 0.765], [0.65, 0.711], [0.705, 0.665]]], ["hid", "nagygomba", [[0.765, 0.638]]], ["villa", "ret", [[0.58, 0.86], [0.66, 0.88]]]],
  jarhato: [
    [[0.019, 0.678], [0.10, 0.622], [0.30, 0.60], [0.4125, 0.556], [0.5875, 0.556], [0.681, 0.556], [0.699, 0.578], [0.705, 0.622], [0.716, 0.662],
     [0.725, 0.70], [0.7125, 0.747], [0.6625, 0.767], [0.656, 0.828], [0.719, 0.836], [0.781, 0.824], [0.825, 0.791], [0.9875, 0.778], [0.9875, 0.985], [0.019, 0.985]],   /* a tisztás (az ér innenső partja) */
    [[0.7325, 0.522], [0.9875, 0.50], [0.9875, 0.722], [0.83, 0.742], [0.764, 0.738], [0.76, 0.693], [0.75, 0.644], [0.739, 0.589]],                                         /* az ér túlsó partja (a nagy gombaház) */
    [[0.7075, 0.622], [0.7638, 0.618], [0.765, 0.667], [0.7088, 0.671]]                                                                                                       /* a palló */
  ],
  diszlet: [
    { id: "telek", x: 0.50, y: 0.606, w: 0.15, h: 0.09, mondat: "Ez a tisztás még üres. Egyszer ide is beköltözik valaki!" },
    { id: "gombak", x: 0.4594, y: 0.587, w: 0.045, h: 0.06, mondat: "Ezek csak gombák. Itt nem lakik senki." },
    { id: "tas", x: 0.153, y: 0.958, w: 0.13, h: 0.075, kep: "tas", doboz: [0.0938, 0.8844, 0.1187, 0.0733], mondat: "Lassan járj, tovább érsz!" },
    { id: "harkaly", x: 0.1875, y: 0.545, w: 0.04, h: 0.07, elol: true, kep: "harkaly", doboz: [0.1750, 0.4822, 0.0275, 0.0600], mondat: "Kop-kop-kop!" }
  ]
};
/* 🏡 Összeadó utca — 5. kör, 2. kódkör (terv: Matekosilagkep-5-kor-erdoszel-osszeado-utca.html 1., 3., 4., 6–8. pont, ✅ 2026-11-24, mind A):
   kanyargó falusi utca fölfelé. Bal lent érkezik (a Nagyfa tér felől), a kanyarban kúttér, fönt a dombocskán a nagy ház. A házak kicsit
   össze-vissza állnak (megdőlnek, a gerinc oldalra csúszik). Vegyes utca: 3 ház (5 állapot) + 5 hely (lepes: 3); díszlet-ház nincs
   (11-25: kivéve, a producer: ne legyenek üres házak; a helyükön fa és bokor). Minden lakó a pálya mozdulatát csinálja, szám és felirat nélkül:
     favago (tizesek): Bence egész rőzsekévéket rak · korte (aprok): Pötyi majszol, a hangyák egyesével hordják a morzsát ·
     letra (rokon-letra): Juli egyforma lépésekkel a létrán · csalad (szamcsalad): az ablakokban sorban kigyullad a fény, Kata + kiskacsák ·
     kovek (lepegeto): Pali nagy, egyforma ugrásokkal a köveken · kerites (atlepo): Samu átmászik a kerítés-lépcsőn, bent a kecske ·
     bokroskert (szazas-bujocska): Cirmi szaglászik, Cincin kikukucskál a levélkupacból ·
     nagyhaz: lent a pince (erdo-melye), fent a padlás (erdo-szive) — a TÁRGY-NÉZET a PC_TARGY.nagyhaz (hely.js); Brumi a ház előtt.
   Díszlet: kút, tyúk, Bogyó a padon. Nincs üres telek (a 8 ház a felső határ). sorrend: true — rejtett sorrend (helySorrend).
   Az ér nem járható (patak; a kövekhez az utcáról lehet odaállni). A pontok, utak, járható részek a rajzból: terv/kozelkep-export.py
   (utca_tabla() kiírja). A régi Összeadó liget a menetből kikerült (a kódja a 8. hullámig biztonsági háló). */
HELYEK["osszeado-utca"] = {
  nev: "Összeadó utca", vissza: "vilag", sorrend: true,
  kep: { w: 1600, h: 900, zona: [0.05, 0.04, 0.90, 0.93], hatter: "osszeado-utca", mappa: "kepek/osszeado-utca/", v: "20261124-2", kifestve: [-560, -160, 2720, 1220] },
  retegek: ["eg", "tavoli", "kozep"], mozgo: "mozgo", eloter: "eloter",
  uni: 0.95, jk: 2.2,
  pontok: { kapu: [0.122, 0.976], kanyar: [0.562, 0.824], kutter: [0.619, 0.878], elag: [0.804, 0.634] },
  patak: [[0.524, 0.596], [0.553, 0.618], [0.575, 0.631], [0.594, 0.637], [0.613, 0.638], [0.631, 0.634], [0.650, 0.629], [0.668, 0.624], [0.684, 0.624],
          [0.702, 0.624], [0.723, 0.620], [0.754, 0.620]],   /* az ér a forrástól a tócsa végéig: nem járható */
  gat: [[[0.631, 0.804], [0.663, 0.791], [0.694, 0.778], [0.731, 0.767], [0.769, 0.742], [0.795, 0.718], [0.819, 0.778], [0.831, 0.844], [0.831, 0.98]]],   /* a Kacsáék háza és a fű: a kúttérről a bokros kertbe
                                                                                    és az utcára az utakon át (ne toronyiránt a házon át) */
  helyek: [
    { id: "favago",     x: 0.156,  y: 0.90,  w: 0.20,  h: 0.155, all: [0.209, 0.953], jel: [0.156, 0.74],  kep: "favago", lepes: 3, rk: 2.2, doboz: [0.0500, 0.7111, 0.2162, 0.2178], cel: { palyak: ["tizesek"] } },
    { id: "korte",      x: 0.389,  y: 0.87,  w: 0.15,  h: 0.33,  all: [0.401, 0.924], jel: [0.389, 0.53],  kep: "korte", lepes: 3, rk: 2.6, doboz: [0.2913, 0.5511, 0.1913, 0.3400], cel: { palyak: ["aprok"] } },
    { id: "letra",      x: 0.494,  y: 0.783, w: 0.105, h: 0.30,  all: [0.511, 0.882], jel: [0.49, 0.43],   kep: "letra", rk: 2.6, doboz: [0.4225, 0.4067, 0.1325, 0.3889], cel: { palyak: ["rokon-letra"] } },
    { id: "csalad",     x: 0.745,  y: 0.94,  w: 0.15,  h: 0.23,  all: [0.70, 0.911],  jel: [0.745, 0.68], kep: "csalad", rk: 2.4, doboz: [0.6219, 0.6622, 0.2238, 0.3178], cel: { palyak: ["szamcsalad"] } },
    { id: "kovek",      x: 0.622,  y: 0.66,  w: 0.16,  h: 0.10,  all: [0.623, 0.744], jel: [0.622, 0.56], kep: "kovek", lepes: 3, rk: 1.8, doboz: [0.5219, 0.5300, 0.2000, 0.1356], cel: { palyak: ["lepegeto"] } },
    { id: "kerites",    x: 0.756,  y: 0.575, w: 0.15,  h: 0.13,  all: [0.770, 0.675], jel: [0.756, 0.44], kep: "kerites", lepes: 3, rk: 1.9, doboz: [0.6737, 0.4511, 0.1650, 0.1356], cel: { palyak: ["atlepo"] } },
    { id: "bokroskert", x: 0.8925, y: 0.82,  w: 0.17,  h: 0.15,  all: [0.865, 0.751], jel: [0.8925, 0.64], kep: "bokroskert", lepes: 3, rk: 2.2, doboz: [0.7950, 0.6289, 0.1950, 0.2111], cel: { palyak: ["szazas-bujocska"] } },
    { id: "nagyhaz",    x: 0.875,  y: 0.465, w: 0.14,  h: 0.30,  all: [0.851, 0.513], jel: [0.83, 0.20], kep: "nagyhaz", rk: 2.8, doboz: [0.7662, 0.0822, 0.1925, 0.3867], cel: { palyak: ["erdo-melye", "erdo-szive"] } }
  ],
  utak: [["kapu", "favago", [[0.188, 0.958]]], ["favago", "korte", [[0.285, 0.939], [0.350, 0.931]]], ["korte", "letra", [[0.462, 0.908]]],
         ["letra", "kanyar", [[0.547, 0.848]]], ["kanyar", "kovek", [[0.588, 0.782], [0.614, 0.753]]], ["kovek", "kerites", [[0.659, 0.721], [0.694, 0.707], [0.730, 0.698]]],
         ["kerites", "elag", [[0.798, 0.644]]], ["elag", "nagyhaz", [[0.822, 0.592], [0.841, 0.532]]], ["kanyar", "kutter", []], ["kutter", "csalad", []],
         ["elag", "bokroskert", [[0.831, 0.696]]]],
  jarhato: [
    [[-0.156, 1.135], [-0.062, 1.100], [0.032, 1.064], [0.085, 1.043], [0.138, 1.024], [0.191, 1.009], [0.245, 0.996], [0.298, 0.987], [0.351, 0.980], [0.404, 0.972],
     [0.450, 0.959], [0.491, 0.942], [0.527, 0.919], [0.556, 0.890], [0.580, 0.854], [0.595, 0.825], [0.613, 0.801], [0.633, 0.780], [0.655, 0.763], [0.681, 0.750],
     [0.709, 0.741], [0.740, 0.730], [0.768, 0.714], [0.793, 0.692], [0.814, 0.664], [0.830, 0.630], [0.842, 0.591], [0.848, 0.570], [0.855, 0.551], [0.863, 0.535],
     [0.872, 0.521], [0.882, 0.510], [0.893, 0.500], [0.879, 0.443], [0.864, 0.456], [0.851, 0.472], [0.838, 0.491], [0.827, 0.513], [0.818, 0.538], [0.810, 0.565],
     [0.801, 0.592], [0.789, 0.615], [0.773, 0.634], [0.754, 0.649], [0.731, 0.661], [0.704, 0.668], [0.672, 0.677], [0.642, 0.690], [0.614, 0.709], [0.588, 0.733],
     [0.565, 0.762], [0.545, 0.795], [0.529, 0.817], [0.507, 0.837], [0.477, 0.854], [0.441, 0.867], [0.398, 0.877], [0.349, 0.882], [0.294, 0.887], [0.239, 0.895],
     [0.184, 0.907], [0.128, 0.921], [0.073, 0.938], [0.018, 0.958], [-0.044, 0.980], [-0.106, 1.002], [-0.169, 1.025]],                                  /* az utca */
    [[0.748, 0.880], [0.740, 0.903], [0.719, 0.922], [0.687, 0.935], [0.650, 0.940], [0.613, 0.935], [0.581, 0.922], [0.560, 0.903], [0.552, 0.880], [0.560, 0.857],
     [0.581, 0.838], [0.613, 0.825], [0.650, 0.820], [0.687, 0.825], [0.719, 0.838], [0.740, 0.857]],                                                    /* a kúttér (a kanyarnál átfed az utcával) */
    [[0.792, 0.620], [0.818, 0.627], [0.879, 0.742], [0.869, 0.776], [0.850, 0.762], [0.793, 0.656]]                                                       /* a mellékösvény a bokros kerthez */
  ],
  diszlet: [
    { id: "kut", x: 0.63, y: 0.87, w: 0.06, h: 0.15, kep: "kut", doboz: [0.5975, 0.7133, 0.0650, 0.1622], mondat: "Csobb! Friss víz a kútból." },
    { id: "tyuk", x: 0.671, y: 0.902, w: 0.04, h: 0.06, kep: "tyuk", doboz: [0.6550, 0.8511, 0.0350, 0.0533], mondat: "Kot-kot! Magot keresek." },
    { id: "bogyo", x: 0.5625, y: 0.905, w: 0.05, h: 0.08, kep: "bogyo", doboz: [0.5375, 0.8178, 0.0475, 0.0778], mondat: "Bogyó szundít. Pszt!" }
  ]
};
/* a helyek neve (átnevezés = egy sor; a mai LIGET_NEV mintájára) · felveteli: „Doromboló-hegy” (producer, 2026-11-25: lakója majd a pékség macskája) */
var HELY_NEV = {
  odu: "Odú", kert: "Kert", postafa: "Postafa", erdoszel: "Erdőszél", utca: "Utca", ter: "Nagyfa tér", "osszeado-utca": "Összeadó utca",
  "dallam-ter": "Dallam-tér", kezmuvesek: "Kézművesek", domboldal: "Domboldal", konyvtar: "Bagolykönyvtár", fejtoro: "Fejtörő-hegy",
  felveteli: "Doromboló-hegy", szabo: "Szabóműhely", bajital: "Bájitalkonyha", pekseg: "Mézes pékség",
  bolt: "Tüske néni boltja", vasar: "Tündérvásár", zsib: "Zsivány standja", szalag: "Szalagműhely", deli: "Déli vásár", irasbeli: "Garas tornya", josda: "Jósda",
  "osszeado-liget": "Összeadó liget", letra: "Rokon-létra", csalad: "Számcsalád", nagyhaz: "A nagy ház", favago: "Favágó-udvar", korte: "Körtefa",
  kovek: "Ugrókövek", kerites: "Kerítés-lépcső", bokroskert: "Bokros kert",
  kisgomba: "Kis gombaház", nagygomba: "Nagy gombaház", ret: "Rét", tolgy: "Öreg tölgy"
};
