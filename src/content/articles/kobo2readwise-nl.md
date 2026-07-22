---
title: "Kobo-aantekeningen naar Readwise — zonder desktop-app, gewoon in de browser"
description: "Aantekeningen uit zelf-geüploade Kobo-boeken staan alleen lokaal op je e-reader. October lost dat op met een desktop-app; ik deed hetzelfde in de browser, met de File System Access API en sql.js."
pubDate: 2026-07-22
key: kobo2readwise
lang: nl
readMin: 5
project: kobo2readwise
repo: https://github.com/h11t-labs/kobo2readwise
url: https://kobo2readwise.fly.dev
tags: ["python", "fastapi", "sqlite", "wasm", "readwise"]
---

Ik leen mijn boeken uit de [online bibliotheek](/writing/online-bibliotheek-catalogus)
en lees ze op mijn Kobo. Tijdens het lezen markeer ik van alles — zinnen die blijven
hangen, dingen die ik wil onthouden. Die aantekeningen wil ik in
[Readwise](https://readwise.io) hebben, waar de rest van mijn highlights ook staat.
Alleen: dat gaat niet vanzelf.

Boeken uit de Kobo-winkel, Kobo Plus en bibliotheekleningen synct Readwise zelf al. Maar
**zelf-geüploade** boeken — EPUB's die je via Calibre, mail of USB op het apparaat zet,
of bijvoorbeeld een lening uit de [online bibliotheek](/writing/online-bibliotheek-catalogus)
die je met Adobe Digital Editions op je Kobo zet — zijn een ander verhaal. Hun highlights leven alleen in de lokale `KoboReader.sqlite` op
de e-reader en bereiken de Kobo-cloud nooit, dus Readwise kan er niet bij.

## De bestaande oplossing is een desktop-app

Voor precies dit probleem bestaat [October](https://october.utf9k.net/): een keurige,
open-source desktop-app die je Kobo herkent zodra je 'm inplugt, de database uitleest en
de highlights naar Readwise uploadt. Werkt prima. Maar het is wél iets dat je installeert,
per besturingssysteem, en bijhoudt.

Ik dacht: dat kan tegenwoordig ook gewoon in de browser. Chrome en Edge kunnen met de
[File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API)
een bestand op je schijf lezen zónder het te uploaden, en
[sql.js](https://sql.js.org) draait SQLite als WebAssembly ín het tabblad. Samen is dat
alles wat je nodig hebt: geen installatie, één URL.

## Hoe het werkt

De flow is kort:

**bestand kiezen** → **SQLite lezen in de browser** → **highlights doorsturen naar Readwise**.

Je kiest je `KoboReader.sqlite`, sql.js leest 'm lokaal uit (het bestand verlaat je
computer nooit), en de app laat per boek zien welke highlights ze gaat sturen. Een dunne
proxy neemt die batch aan en zet 'm door naar de Readwise-API — meer doet de server niet.

## Het vertrouwensmodel: de token wordt vergeten

Er is één ding dat de server wél aanraakt: je Readwise-token, want dat moet in de
`Authorization`-header naar Readwise. Dus daar is de hele opzet omheen gebouwd: de proxy
stuurt je token door en vergeet 'm daarna meteen. **Geen logging van request-bodies, geen
opslag, geen database.** De token leeft alleen in het geheugen voor de duur van één
verzoek. Dat is het hele punt van de app — en het staat als expliciete belofte boven in
[`app.py`](https://github.com/h11t-labs/kobo2readwise/blob/main/app.py).

Om diezelfde reden is sql.js **self-hosted** in plaats van van een CDN geladen: op de
pagina die tijdelijk je token vasthoudt, wil je geen script van derden laten draaien.

## Het bestand vinden: verborgen mappen tonen

De `KoboReader.sqlite` zit in een **verborgen** map genaamd `.kobo`, in de root van je
e-reader wanneer je 'm via USB aankoppelt. Verborgen mappen — alles wat met een punt
begint — zie je standaard niet in Finder of het bestandsdialoog van macOS.

De truc: druk in Finder of in het "Kies bestand"-venster op **Shift + Command + .**
(punt). Dat schakelt verborgen bestanden aan en uit; nu verschijnt de `.kobo`-map en kun
je erin naar `KoboReader.sqlite` navigeren. Nog een keer dezelfde toetscombinatie
verbergt ze weer.

## Waarom alleen Chromium, alleen desktop

De File System Access API werkt vandaag alleen in **Chrome of Edge op desktop**. Firefox,
Safari en mobiele browsers ondersteunen 'm niet. In plaats van cryptisch te falen toont
de app in die gevallen een duidelijke melding: dit is een Chromium-desktop-tool. Dat is
de prijs van geen-app-installeren — en voor mij een prima ruil.

## Hosting

Draait op [Fly.io](https://fly.io) als één scale-to-zero-app op
[kobo2readwise.fly.dev](https://kobo2readwise.fly.dev). Omdat elke gebruiker z'n eigen
token in de browser invoert, heeft de server geen enkel Readwise-geheim nodig. Deploys
gaan via release-please: een echte versiebump (het mergen van de release-PR) triggert een
productie-deploy, gewone feature-merges niet.

De stack, in één regel: Python 3.14+, **FastAPI** voor de proxy, **sql.js** (SQLite als
WASM) en de **File System Access API** voor het lezen in de browser, vanilla JS voor de
UI, en **uv** voor packaging.
