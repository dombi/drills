/* ═════════════════ 1c) 🐴 HELY-TÁBLÁK: a világkép (Thinking horses) és a közelképek adatai ═════════════════
   Terv: terv/vilagkep-rendszerterv.html 3. pont (✅ jóváhagyva 2026-11-23). A KÓD CSAK EZT A TÁBLÁT OLVASSA (hely.js):
   rajz-csere = új képfájlok + legfeljebb a koordináták igazítása. Minden szám ARÁNY (0–1) a kép szélességéhez / magasságához.
     helyek[i] = { id, x, y (talppont), w, h (a koppintható téglalap = a ráközelítés célja), all (ide sétál az unikornis),
                   jel (állapotjel-horgony), kep (a rajz), cel (hová visz),
                   palyak (a jel-összegzéshez), telefon (2. elrendezés, később) }
     cel: { kepernyo: "odu" | "kert" | "utca" } · { regio: "osszeado" } · { kozelkep: "kezmuvesek" } · { kod: true } (ködben, nem nyílik)
     utak: [A, B, [töréspontok]] — A, B hely-id vagy útkereszteződés (pontok); ezen sétál az unikornis (patakon csak a hídon)
     jarhato: sokszögek — szabad séta: ide koppintva odamegy; máshová koppintva a legközelebbi járható pontig
     diszlet: koppintható apróság, jutalom nélkül (mozdul + mondat)
   2. KÖR (2026-11-23): a rajz FÁJLOKBAN él (kep.mappa): rétegek (eg, tavoli, kozep, eloter, mozgo) + helyenként
   <kep>-epul / -kesz / -viragos (+ felveteli-kod). doboz = a hely képének helye [x, y, w, h] (arány). A helyek még a MAI
   ligetekbe / Piactérre visznek (biztonsági háló). Rajz-csere: új fájlok + kep.v emelése (+ sw.js lista, ha új fájlnév). */
var VILAG_NEV = "Thinking horses";   /* a játék és a táj neve (a gyerek ezt látja; kiejtés: KIEJTES, audio.js) */
var HELY_HATAR = { taj: 14, kozelkep: 8, targy: 4 };   /* több hely a táblában = a próba-lap pirosan jelez */
var HELYEK = {};
HELYEK.vilag = {
  nev: VILAG_NEV,
  kep: { w: 1600, h: 900, zona: [0.05, 0.05, 0.90, 0.90], hatter: "vilag", mappa: "kepek/vilag/", v: "20261123-2" },   /* a rajz vektoros: 1600×900 is éles nagyításkor */
  retegek: ["eg", "tavoli", "kozep"], mozgo: "mozgo", eloter: "eloter",   /* alulról felfelé: rétegek · mozgó (alsó) · díszlet · helyek · mozgó (felső) · unikornis · előtér */
  uni: 0.62, jk: 1.25,   /* az unikornis és a (mai) jelképek mérete a kép egységében */
  pontok: { hid: [0.318, 0.86], tisztas: [0.20, 0.82], kut: [0.47, 0.66] },   /* útkereszteződések (nem koppinthatók) */
  patak: [[0.15, 0.36], [0.19, 0.50], [0.215, 0.62], [0.24, 0.70], [0.30, 0.78], [0.32, 0.88], [0.322, 1.0]],   /* ideiglenes rajzhoz */
  helyek: [
    { id: "odu",           x: 0.11, y: 0.92, w: 0.08, h: 0.15, all: [0.155, 0.935], jel: [0.11, 0.73], kep: "odu", doboz: [0.0575, 0.7222, 0.1050, 0.2200],      cel: { kepernyo: "odu" } },
    { id: "kert",          x: 0.21, y: 0.92, w: 0.09, h: 0.13, all: [0.255, 0.94],  jel: [0.21, 0.84], kep: "kert", doboz: [0.1688, 0.8356, 0.0825, 0.1067],     cel: { kepernyo: "kert" } },
    { id: "postafa",       x: 0.28, y: 0.93, w: 0.07, h: 0.14, all: [0.25, 0.955], jel: [0.28, 0.80], kep: "postafa", doboz: [0.2487, 0.8022, 0.0638, 0.1422], cel: { regio: "egyeni" } },
    { id: "erdoszel",      x: 0.10, y: 0.76, w: 0.08, h: 0.16, all: [0.15, 0.775], jel: [0.10, 0.665], kep: "erdoszel", doboz: [0.0575, 0.6622, 0.0875, 0.1133], cel: { regio: "osszeado" },
      palyak: ["bontas-felmondas", "oszkiv-10", "oszkiv-20", "bujocska-ret"] },
    { id: "utca",          x: 0.37, y: 0.78, w: 0.07, h: 0.15, all: [0.41, 0.795], jel: [0.37, 0.665], kep: "utca", doboz: [0.3250, 0.6622, 0.0988, 0.1333],     cel: { kepernyo: "utca" } },
    { id: "ter",           x: 0.52, y: 0.80, w: 0.11, h: 0.15, all: [0.585, 0.815], jel: [0.52, 0.60], kep: "ter", doboz: [0.4525, 0.6000, 0.1375, 0.2156],    cel: { regio: "piac" },
      palyak: ["tuske-bolt", "zsibvasar", "fizess-pontosan", "szalag-eloszoba", "vasar-3", "vasar-3d"] },
    { id: "osszeado-utca", x: 0.69, y: 0.70, w: 0.08, h: 0.14, all: [0.735, 0.715], jel: [0.69, 0.56], kep: "osszeado-utca", doboz: [0.6388, 0.5622, 0.1075, 0.1511], cel: { regio: "osszeado" },
      palyak: ["rokon-letra", "szamcsalad", "tizesek", "aprok", "lepegeto", "atlepo", "szazas-bujocska", "erdo-melye", "erdo-szive"] },
    { id: "dallam-ter",    x: 0.86, y: 0.72, w: 0.08, h: 0.17, all: [0.81, 0.735], jel: [0.86, 0.52], kep: "dallam-ter", doboz: [0.8237, 0.5222, 0.0725, 0.2133], cel: { regio: "szorzo" } },
    { id: "kezmuvesek",    x: 0.27, y: 0.64, w: 0.11, h: 0.14, all: [0.33, 0.655], jel: [0.27, 0.50], kep: "kezmuvesek", doboz: [0.2188, 0.4778, 0.1163, 0.1778], cel: { kozelkep: "kezmuvesek" } },
    { id: "domboldal",     x: 0.40, y: 0.46, w: 0.08, h: 0.13, all: [0.445, 0.475], jel: [0.40, 0.31], kep: "domboldal", doboz: [0.3550, 0.3111, 0.1087, 0.1644],  cel: { regio: "piac" },
      palyak: ["vasar-4", "irasbeli-szorzas", "irasbeli-osztas", "josda-eloszoba", "josda-1em"] },
    { id: "konyvtar",      x: 0.63, y: 0.40, w: 0.06, h: 0.17, all: [0.67, 0.415], jel: [0.63, 0.22], kep: "konyvtar", doboz: [0.5938, 0.2111, 0.0725, 0.2022], cel: { regio: "konyvtar" } },
    { id: "fejtoro",       x: 0.78, y: 0.26, w: 0.12, h: 0.18, all: [0.72, 0.275], jel: [0.775, 0.195], kep: "fejtoro", doboz: [0.7475, 0.0333, 0.0612, 0.2422], cel: { regio: "fejtoro" } },
    { id: "felveteli",     x: 0.91, y: 0.20, w: 0.08, h: 0.14, all: [0.86, 0.215], jel: [0.91, 0.08], kep: "felveteli", doboz: [0.8063, 0.0222, 0.1938, 0.2444],   cel: { kod: true } }
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
/* 🧵🧪🧁 Kézművesek — ideiglenes közelkép a mai három műhellyel (a 4. körben a rajz: mini utca a malommal) */
HELYEK.kezmuvesek = {
  nev: "Kézművesek", vissza: "vilag",
  kep: { w: 1600, h: 900, zona: [0.05, 0.05, 0.90, 0.90], hatter: "kezmuvesek" },
  uni: 1.1, jk: 2.6,
  pontok: { kapu: [0.50, 0.93] },
  helyek: [
    { id: "szabo",   x: 0.22, y: 0.70, w: 0.16, h: 0.30, all: [0.31, 0.75], jel: [0.22, 0.34], kep: "szabo",   cel: { regio: "szabo" } },
    { id: "bajital", x: 0.50, y: 0.60, w: 0.16, h: 0.32, all: [0.59, 0.65], jel: [0.50, 0.22], kep: "bajital", cel: { regio: "bajital" } },
    { id: "pekseg",  x: 0.78, y: 0.70, w: 0.16, h: 0.30, all: [0.70, 0.75], jel: [0.78, 0.34], kep: "pekseg", cel: { regio: "pekseg" } }
  ],
  utak: [["kapu", "szabo", [[0.40, 0.82]]], ["kapu", "bajital", [[0.52, 0.80]]], ["kapu", "pekseg", [[0.62, 0.82]]]],
  jarhato: [[[0.04, 0.66], [0.96, 0.66], [0.96, 0.98], [0.04, 0.98]]],
  diszlet: []
};
/* a helyek neve (átnevezés = egy sor; a mai LIGET_NEV mintájára) */
var HELY_NEV = {
  odu: "Odú", kert: "Kert", postafa: "Postafa", erdoszel: "Erdőszél", utca: "Utca", ter: "Nagyfa tér", "osszeado-utca": "Összeadó utca",
  "dallam-ter": "Dallam-tér", kezmuvesek: "Kézművesek", domboldal: "Domboldal", konyvtar: "Bagolykönyvtár", fejtoro: "Fejtörő-hegy",
  felveteli: "Felvételi-csúcs", szabo: "Szabóműhely", bajital: "Bájitalkonyha", pekseg: "Mézes pékség"
};
