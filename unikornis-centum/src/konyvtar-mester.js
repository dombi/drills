/* ============ 6e) 🏅 MESTERPRÓBA + 🏰 KOCKAVÁR — a Bagolykönyvtár létrájának teteje (útiterv 5b) ============
   Terv: Matekos\epitokocka-palyak-terv.html · rajz: …-rajzterv.html (6–8. rész) · tartalom: …-tartalom.html („🏅 Mesterpróba”).
   Létra: 📖 Mesekönyv → 📜 Varázstekercs (kocka-napok ▢▢▢) → 🏅 Mesterpróba. A kapu akkor nyílik, ha a Varázstekercsen
   megvan a stabil-küszöb (ekStabil: alap 3 külön nap × 80% elsőre jó; a pult 🧱 füle gyerekenként / csoportra állíthatja).
   A Mesterpróba EGY valódi versenyfeladat a Fejtörő-hegy képernyőjén (fejtoro.js, FTJ.mester): A–E, segítség-gomb NINCS,
   rossz válasz → csapda-mondat + végigvezetés + füzet. A feladatok kockánként: EK_KOCKA_DEF[k].mester (constants.js),
   vagy a pult felülírása (versenyPalyak/mester-K1 … { liget:"mesterproba", kocka, feladatok }); sorban váltakoznak,
   egy teljes kör után a számváltozataik jönnek. A szövegek a FELHŐBEN vannak → belépés nélkül a kapu „hamarosan” marad.
   Elsőre jó → EK_MESTER_CSILLA ✨ + EK_MESTER_HARMAT 💧, és a kocka berepül a 🏰 Kockavárba.
   Rossz → a munkáért FT_ALLOMAS_CSILLA ✨, és aznap már nem próbálhatja újra („egy másik napon jön egy hasonló”).
   Állapot (P().ek): mester{tekercsId: nap} · mesterTilt{tekercsId: nap} · mesterDb{tekercsId: próbák} · varSor[kocka-helyek sorrendben] */
var EK_MESTER_CSILLA = 10;
var EK_MESTER_HARMAT = 2;

/* ── a stabil-küszöb: alap < csoport < egyéni (config.js FELULIR.ekStabil) ── */
var EK_STABIL_ALAP = { nap: 3, arany: 0.8 };
function ekStabil() { return (typeof FELULIR !== "undefined" && FELULIR.ekStabil) || EK_STABIL_ALAP; }

/* ── melyik feladat, milyen állapot ── */
function ekTekercsPalya(kocka, szarny) {
  return PALYAK.filter(function (p) { return p.konyvtar && p.fok === "tekercs" && p.kocka === kocka && (!szarny || p.szarny === szarny); })[0] || null;
}
function ekMesterLista(kocka) {
  var L = (FT.mesterL && FT.mesterL[kocka]) || (EK_KOCKA_DEF[kocka] && EK_KOCKA_DEF[kocka].mester) || [];
  return L.filter(function (id) { return !!FT.feladatok[id]; });
}
/* "kesz" · "zarva" (még nem stabil) · "holnap" (ma már próbálta) · "nincs" (nincs betöltött feladat) · "nyitva" */
function ekMesterAllapot(tek) {
  if (!tek) return "zarva";
  var st = ekAllapot();
  if (st.mester[tek.id]) return "kesz";
  if (ekNapDb(tek.id) < ekStabil().nap) return "zarva";
  if (st.mesterTilt[tek.id] === helyiNap()) return "holnap";
  if (!ekMesterLista(tek.kocka).length) return "nincs";
  return "nyitva";
}
var EK_MESTER_MONDAT = {
  kesz: "Ezt a Mesterpróbát már kiálltad! Ez a kocka a tiéd, ott van a Kockavárban.",
  zarva: "Mesterpróba: ha a Varázstekercsen három külön napon ügyes vagy, itt vár rád egy igazi versenyfeladat!",
  holnap: "Ma már próbáltad. Egy másik napon jön egy hasonló — addig gyakorolj a Varázstekercsen!",
  nincs: "Ez a kocka stabil! A Mesterpróba-kapu hamarosan kinyílik."
};
function ekMesterKatt(tek) {
  var a = ekMesterAllapot(tek);
  if (a === "nyitva") { ekMesterIndit(tek); return; }
  var m = EK_MESTER_MONDAT[a];
  if (a === "zarva" && ekStabil().nap !== 3) m = m.replace("három", String(ekStabil().nap));
  mondd(m);
}
function ekMesterIndit(tek) {
  var st = ekAllapot(), L = ekMesterLista(tek.kocka);
  if (!L.length) return;
  var db = st.mesterDb[tek.id] || 0;
  st.mesterDb[tek.id] = db + 1;                      /* a próba az indulással számít: kilépés után a következő feladat jön */
  ment();
  fejtoroMesterInditas(tek, L[db % L.length], db >= L.length);
}
/* a pálya végén (fejtoro.js ftAllomasKesz hívja): jó = elsőre, segítség nélkül */
function ekMesterVege(tek, jo, fid, idoMp) {
  var st = ekAllapot(), ma = helyiNap(), cs = jo ? EK_MESTER_CSILLA : FT_ALLOMAS_CSILLA, h = jo ? EK_MESTER_HARMAT : 0;
  var elotte = ekKockaLista();
  if (jo) {
    st.mester[tek.id] = ma;
    var hely = EK_KOCKA_DEF[tek.kocka] ? EK_KOCKA_DEF[tek.kocka].var : null;
    if (hely != null && elotte.indexOf(hely) < 0) st.varSor = elotte.concat([hely]);
  } else st.mesterTilt[tek.id] = ma;
  P().csillampor += cs;
  P().tunderharmat = (P().tunderharmat || 0) + h;
  ment();
  esemeny("palya_end", { palyaId: "mester-" + tek.id, fejtoro: true, mester: true, feladat: 1, elsore: jo ? 1 : 0, idoMp: idoMp,
    teljes: true, csillampor: cs, harmat: h, ek: { kocka: tek.kocka, szarny: tek.szarny, fok: "mester", feladatId: fid, jo: jo } });
  $("vege-kovetkezo").style.display = "none";
  if (jo) {
    var lista = ekKockaLista(), uj = lista.length > elotte.length;
    $("vege-szoveg").innerHTML = '<div class="ek-var-nagy">' + ekKockavarNagySVG(lista, uj ? lista.length - 1 : -1) + '</div>' +
      '<b>🏅 Mesterpróba kész!</b> Ez a kocka a tiéd: <b>' + tek.kockaIkon + " " + kiiras(tek.kockaNev) + '</b><br>' +
      '<b>+' + cs + ' ✨</b> csillámpor · <span style="color:#2f7fb0;font-weight:800">💧 +' + h + ' tündérharmat</span><br>' +
      '<span class="ek-vege">🏰 ' + (lista.length >= EK_KOCKAK.length ? "Kész a Kockavár!" : lista.length + " kocka a várban") + '</span>';
    konfettiSzor(); hangVege();
    mutat("kepernyo-vege");
    ekKockaBerepul();
    mondd("Mesterpróba kész! Ez a kocka a tiéd — nézd, repül a Kockavárba!");
  } else {
    $("vege-szoveg").innerHTML = '<div class="ek-mester-ikon">🏅</div><b>Majdnem!</b> Most együtt végigmentünk rajta.<br>' +
      'Egy másik napon jön egy hasonló — addig gyakorolj a 📜 Varázstekercsen!<br>' +
      'A munkádért: <b>+' + cs + ' ✨</b> csillámpor.';
    mutat("kepernyo-vege");
    mondd("Majdnem! Egy másik napon jön egy hasonló. Addig gyakorolj a Varázstekercsen!");
  }
}
/* a pálya-vége képernyő „🏅 Mesterpróba-kapu” gombja (ekPalyaVege teszi ki) */
document.addEventListener("click", function (e) {
  var b = e.target && e.target.closest ? e.target.closest(".ek-mester-gomb") : null;
  if (!b) return;
  hangGomb();
  ekMesterKatt(palyaKeres(b.getAttribute("data-pid")));
});

/* ═════════════════ 🏰 KOCKAVÁR ═════════════════ */
/* a megszerzett kockák helye (EK_KOCKAK index) a szerzés sorrendjében — a vár alulról fölfelé ebben a sorban telik */
function ekKockaLista() {
  var st = ekAllapot(), L = (st.varSor || []).slice();
  for (var pid in st.mester) {                       /* régebbi mentés / pult-javítás: ami a mester-listában van, az is a vár része */
    if (!st.mester[pid]) continue;
    var pa = palyaKeres(pid), d = pa && EK_KOCKA_DEF[pa.kocka];
    if (d && d.var != null && L.indexOf(d.var) < 0) L.push(d.var);
  }
  return L.slice(0, EK_KOCKAK.length);
}
function ekKockaDb() { return ekKockaLista().length; }
/* nagy vár (600×360) — az ünneplésnél; uj = a berepülő kocka sorszáma a listában (-1 = nincs) */
function ekKockavarNagySVG(lista, uj) {
  var n = lista.length, S = 3.4, ox = 300 - 60 * S, oy = 290 - 108 * S;
  var s = '<svg viewBox="0 0 600 360" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="ekvg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe0f7"/><stop offset="1" stop-color="#fbe4ef"/></linearGradient></defs>' +
    '<rect width="600" height="360" rx="18" fill="url(#ekvg)"/><ellipse cx="120" cy="60" rx="46" ry="14" fill="#fff" opacity=".8"/><ellipse cx="470" cy="90" rx="60" ry="16" fill="#fff" opacity=".7"/>' +
    '<path d="M0 300 Q300 230 600 300 V342 Q600 360 582 360 H18 Q0 360 0 342Z" fill="#b6e0a8"/><path d="M0 330 Q300 280 600 330 V342 Q600 360 582 360 H18 Q0 360 0 342Z" fill="#a7d99a"/>';
  function blokk(i) { var h = EK_VAR_HELY[i]; return [ox + (h[0] - 9.5) * S, oy + (h[1] - 7.5) * S, 19 * S, 15 * S]; }
  EK_VAR_HELY.forEach(function (h, i) {
    var b = blokk(i), x = b[0], y = b[1], w = b[2], hh = b[3];
    if (i < n) {
      var K = EK_KOCKAK[lista[i]];
      s += '<g' + (i === uj ? ' class="ek-uj-kocka" style="transform:translate(0,-260px);opacity:0"' : '') + '><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + hh + '" rx="6" fill="' + K[1] + '" stroke="#fff" stroke-width="3"/>' +
        '<rect x="' + (x + 5) + '" y="' + (y + 5) + '" width="' + (w - 10) + '" height="8" rx="3" fill="#fff" opacity=".35"/>' +
        '<text x="' + (x + w / 2) + '" y="' + (y + hh / 2 + 11) + '" font-size="28" text-anchor="middle">' + K[0] + '</text></g>';
    } else s += '<rect x="' + (x + 2) + '" y="' + (y + 2) + '" width="' + (w - 4) + '" height="' + (hh - 4) + '" rx="6" fill="rgba(255,255,255,.35)" stroke="#fff" stroke-width="2.5" stroke-dasharray="7 5"/>';
  });
  [[10, "#c9a8e6"], [12, "#f6a5c0"]].forEach(function (t) {           /* toronytetők */
    var b = blokk(t[0]), d = 'M' + (b[0] - 4) + ' ' + b[1] + ' L' + (b[0] + b[2] / 2) + ' ' + (b[1] - 52) + ' L' + (b[0] + b[2] + 4) + ' ' + b[1] + 'Z';
    s += n > t[0] ? '<path d="' + d + '" fill="' + t[1] + '" stroke="#fff" stroke-width="3"/>' : '<path d="' + d + '" fill="none" stroke="#fff" stroke-width="2.5" stroke-dasharray="7 5"/>';
  });
  [6, 8].forEach(function (i) {                                          /* pártázat a falon */
    if (n <= i) return;
    var b = blokk(i);
    for (var k = 0; k < 3; k++) s += '<rect x="' + (b[0] + 4 + k * (b[2] - 8) / 2.5) + '" y="' + (b[1] - 12) + '" width="' + ((b[2] - 8) / 5) + '" height="12" rx="2" fill="' + EK_KOCKAK[lista[i]][1] + '" stroke="#fff" stroke-width="2"/>';
  });
  if (n >= EK_KOCKAK.length) {
    var ty = oy + (EK_VAR_HELY[13][1] - 7.5) * S;
    s += '<path d="M300 ' + ty + ' V' + (ty - 70) + '" stroke="#6b5442" stroke-width="5"/><path d="M300 ' + (ty - 70) + ' L350 ' + (ty - 56) + ' L300 ' + (ty - 42) + 'Z" fill="#e2589b"/>';
  }
  return s + '</svg>';
}
function ekKockaBerepul() {
  var k = document.querySelector(".ek-var-nagy .ek-uj-kocka");
  if (!k) return;
  k.style.transition = "transform 1.4s cubic-bezier(.3,1.5,.5,1), opacity .5s";
  setTimeout(function () { requestAnimationFrame(function () { k.style.transform = "translate(0,0)"; k.style.opacity = "1"; }); }, window.__UC_GYORS ? 0 : 700);
}

/* ═════════════════ a pálya-jelenet: arany Mesterpróba-kapu az Odú-küszöb mögött ═════════════════ */
function ekMesterKapuSVG(palya) {
  if (palya.fok !== "tekercs") return "";
  var a = ekMesterAllapot(palya);
  if (a === "zarva") return "";
  var kesz = a === "kesz";
  return '<g class="ek-kapu" transform="translate(-8,0)"><path d="M-52,40 C-54,-70 -36,-150 0,-158 C36,-150 54,-70 52,40" fill="none" stroke="#e8b43a" stroke-width="12" stroke-linecap="round"/>' +
    '<path d="M-52,40 C-54,-70 -36,-150 0,-158 C36,-150 54,-70 52,40" fill="none" stroke="#fff3b8" stroke-width="4" stroke-linecap="round" stroke-dasharray="3 10"/>' +
    '<circle cx="0" cy="-160" r="18" fill="#fff6d8" stroke="#e8b43a" stroke-width="3"/><text x="0" y="-153" font-size="20" text-anchor="middle">' + (kesz ? "✅" : "🏅") + '</text></g>';
}
