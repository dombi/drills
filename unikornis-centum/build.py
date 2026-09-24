#!/usr/bin/env python3
"""build.py — src/ modulok összefűzése IIFE-be → game.js.

Használat: python build.py
A game.js a build után is egyetlen fájl marad (a böngésző azt tölti).
A forráskód a src/ alatt él.

A SORREND KÖTÖTT: az eredeti game.js szekció-sorrendjét tükrözi.
A var-inicializálások és a load-time kód (pl. SZOTAR IIFE, speechSynthesis
onvoiceschanged, 11. szekció betolt()) egymásra épülnek — ne rendezd át!
"""
import os, sys

SRC = os.path.join(os.path.dirname(os.path.abspath(__file__)), "src")
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "game.js")

MODULES = [
    # ── Adatok ──
    "constants.js",       # 1) PALYAK, LENYEK, paletta, ikon SVG-k

    # ── Segédek ──
    "helpers.js",         # 2) $, el, veletlen, szo(), szamokKinyer()

    # ── Motor (1/2) ──
    "engine-gen.js",      # 3) feladatgenerátor

    # ── Perzisztencia ──
    "mentes.js",          # 4) localStorage mentés/betöltés, jutalom-motor

    # ── Hang ──
    "audio.js",           # 5a) AudioContext, beep, TTS (mondd), kert-hangok
    "speech.js",          # 5b) SpeechRecognition, felmondás-logika

    # ── Grafika ──
    "renderer.js",        # 6) SVG: unikornis, jelenet, tárgyak, díszek

    # ── Képernyők ──
    "ui.js",              # 7) mutat(), renderProfil, renderFomenu

    # ── Motor (2/2) ──
    "engine-logic.js",    # 8) játékmenet: pontok, állomások, kapu

    # ── Szülői nézet ──
    "parent.js",          # 9) szülői statisztika-oldal

    # ── Események ──
    "events.js",          # 10) kattintások, gombok, kézmentes hang

    # ── Helyszínek ──
    "odu.js",             # 10b) odú + bolt (napszak, időjárás, bútorok, díszek, ruhák, kristályok)
    "kert.js",            # 10d) kert/udvar (séta, trükkök, berendezés, ételek)
    "szalon.js",          # 10e) fodrászat/szépségszalon

    # ── Gyűjtemény ──
    "badges.js",          # 10c) jelvények, gyűjtemény-könyv, talált tárgyak

    # ── Felhő (backend 1. fázis — csak ?felho kapcsolóval él) ──
    "firebase-config.js", # 12) Firebase config, FELHO állapot, kapcsoló
    "auth.js",            # 12b) belépés kóddal, belépő képernyő
    "db.js",              # 12c) Firestore betöltés, első feltöltés, élő figyelés
    "sync.js",            # 12d) delta-küldés + 3-utas összefésülés
    "analytics.js",       # 12e) eseménynapló (events)
    "config.js",          # 12f) producer-felülírások + csoportok (4. fázis)
    "tunemenykert.js",    # 12g) Égi Tüneménykert: RTDB jelenlét + közös tér (5. fázis)

    # ── Indítás ──
    "main.js",            # 11) betolt(), esemenyek(), renderProfil(), window.UC
]

HEADER = '/* AmbitusNumerorum: Unicornis Centum — MVP-A. Vanilla JS, függőség nélkül, file:// alól fut. */\n'
GENERATED = '/* ⚠️ GENERÁLT FÁJL — NE SZERKESZD! Forrás: src/ · Build: python build.py */\n'

def build():
    parts = [HEADER, GENERATED, '\n(function () {\n"use strict";\n\n']
    for mod in MODULES:
        path = os.path.join(SRC, mod)
        if not os.path.isfile(path):
            print(f"HIBA: {path} nem található!", file=sys.stderr)
            sys.exit(1)
        with open(path, "r", encoding="utf-8") as f:
            parts.append(f.read())
        if not parts[-1].endswith("\n"):
            parts.append("\n")
    parts.append("\n})();\n")
    with open(OUT, "w", encoding="utf-8", newline="\n") as f:
        f.write("".join(parts))
    total = sum(1 for c in "".join(parts) if c == "\n")
    print(f"✓ game.js built — {len(MODULES)} modul, {total} sor")

if __name__ == "__main__":
    build()
