"""🤖 Gépi próba — a bejárt képernyők listája (① indulás-őr; a ② méret-őr is ezt járja be).

⭐ ÚJ HELYSZÍN = EGY ÚJ SOR. Ha egy .kepernyo-t senki nem néz, az őr szól („van olyan képernyő, amit senki nem néz”).

Egy sor: (név, lépések, várt képernyő, látszik)
  lépések (a térképről indulva, sorban):
    "hely:X"     — koppintás a térkép X helyére (az unikornis odasétál)
    "katt:#sel"  — valódi kattintás egy elemre
    "nyom:#sel"  — hosszú nyomás
    "js:kód"     — JS a játékban (pl. egy zárt hely kinyitása kitalált mentés-adattal, vagy UC-függvény)
  várt képernyő: a .kepernyo.aktiv id-je a végén
  látszik:       (nem kötelező) ennek a selectornak is látszania kell (pl. egy panel a képernyőn belül)
A pályák indítását nem itt soroljuk: azokat az őr a UC.PALYAK-ból veszi (mindet).
"""

# ez a profil + mentés-előkészítés: új gyerek, üres mentés (a 3A döntés: csak kitalált mentés)
NYIT_SZALON = "js:(function(){ var p=UC.mentes.profilok[UC.mentes.leny]; (p.szalon||(p.szalon={})).nyitva=true; })()"

KEPERNYOK = [
    ("Első perc",          [],                                              "kepernyo-elsoperc", ".ny-mozgo"),   # 🚪 az első kép, üres mentéssel: az újonc első perce
    ("Térkép",             [],                                              "kepernyo-fomenu", ".terkep-hely"),
    ("Összeadó liget",     ["hely:osszeado"],                               "kepernyo-fomenu", ".palya-kartya, #palya-racs"),
    ("Szorzós liget",      ["hely:szorzo"],                                 "kepernyo-fomenu", "#palya-racs"),
    ("Tündérvásár",        ["hely:vasar"],                                  "kepernyo-fomenu", "#palya-racs"),
    ("Szabóműhely",        ["hely:szabo"],                                  "kepernyo-fomenu", "#palya-racs"),
    ("Bájitalkonyha",      ["hely:bajital"],                                "kepernyo-fomenu", "#palya-racs"),
    ("Mézes pékség",       ["hely:pekseg"],                                 "kepernyo-fomenu", "#palya-racs"),
    ("Bagolykönyvtár",     ["hely:konyvtar"],                               "kepernyo-fomenu", "#palya-racs"),
    ("Fejtörő-hegy",       ["js:UC.ligetbeLep('fejtoro')"],                 "kepernyo-fomenu", "#palya-racs"),
    ("Odú",                ["hely:odu"],                                    "kepernyo-odu", None),
    ("Odú: szekrény",      ["hely:odu", "katt:#odu-szekreny"],              "kepernyo-odu", "#odu-lap"),
    ("Odú: jelvények",     ["hely:odu", "katt:#odu-t-jelveny"],             "kepernyo-odu", "#odu-lap"),
    ("Odú: gyűjtemény",    ["hely:odu", "katt:#odu-t-gyujt"],               "kepernyo-odu", "#odu-lap"),
    ("Odú: heti kártya",   ["hely:odu", "katt:#het-odu"],                   "kepernyo-odu", "#het-fuzet"),
    ("Odú: ágy",           ["hely:odu", "katt:#odu-t-agy"],                 "kepernyo-odu", None),
    ("Kert",               ["hely:kert"],                                   "kepernyo-kert", None),
    ("Kert: fészer",       ["hely:kert", "katt:#kert-eszkozsor button"],    "kepernyo-kert", "#kert-feszer"),
    ("Tény-kert",          ["hely:kert", "katt:.kc-agyas"],                 "kepernyo-kert", "#tvk-vissza"),
    ("Kalandtérkép",       ["hely:odu", "js:UC.kalandNyit()"],              "kepernyo-odu", "#kaland-fedo"),   # az odúban hagyott térkép-tekercsből
    ("Utca",               ["hely:utca"],                                   "kepernyo-utca", None),
    ("Utca: bolt",         ["hely:utca", "katt:#utca-bolt"],                "kepernyo-utca", "#odu-panel"),
    ("Utca: pad (cica)",   ["hely:utca", "katt:#utca-pad"],                 "kepernyo-utca", None),
    ("Fodrászat",          [NYIT_SZALON, "hely:utca", "katt:#utca-fodrasz"], "kepernyo-szalon", None),
    ("Tündérbank",         ["hely:utca", "katt:#utca-bank"],                "kepernyo-bank", None),
    ("Profilválasztó",     ["katt:#fomenu-vissza"],                         "kepernyo-profil", "#profil-lista .profil-kartya"),   # a térkép „🦄 Váltás” gombja
    ("Nyitókép",           ["js:UC.nyitoRajzol('sajat')"],                  "kepernyo-nyito", "#nyito-szin .ny-alvo"),   # 🚪 minden indulás kapuja (alvó unikornis + fatábla)
    ("Szülői rész",        ["nyom:#fomenu-szuloi"],                         "kepernyo-szuloi", None),
]

# amit az indulás-őr szándékosan NEM néz (a lefedettség-figyelmeztetésből kimarad), és miért
NEM_NEZI = {
    "kepernyo-jatek": "a pályák indítása nézi (minden pálya)",
    "kepernyo-vege": "a végigjátszás nézi (vegig.py: minden végigjátszott pálya vége-képernyője, a szövegei a szöveg-őrhöz mennek)",
    "kepernyo-tunemenykert": "csak felhővel él — a próba alatt a felhő el van zárva",
    "kepernyo-fejtoro": "a feladatok a felhőből jönnek — a próba alatt a felhő el van zárva",
}

# a vissza-gombok, amelyekkel a térképre lehet jutni (a VISSZA tábla gombjai + a panel-zárók)
VISSZA_GOMBOK = ["kt-vissza", "tvk-vissza", "het-zar", "odu-panel-zar", "odu-lap-zar", "szalon-vissza", "bank-vissza", "tk-vissza", "utca-vissza",
                 "odu-vissza", "kert-vissza", "ft-haza", "jatek-haza", "vege-terkep", "szuloi-vissza", "fomenu-vissza"]

# ② méret-őr: amit szándékosan NEM néz (se fontos elemként, se takaróként), és miért. "*" = minden képernyőn.
MERET_KIVETEL = {
    "*": [".kt-puff", "[id^='kt-felho']"],   # a kalandtérkép felhői szándékosan takarják a még fel nem fedezett helyeket (és a térkép szélén túllóghatnak)
    "Tény-kert": [".kert-terkep-jel"],       # ráközelítéskor a kert „Térkép” táblája kiesik a képből; innen a „Vissza a kertbe” visz ki
}
