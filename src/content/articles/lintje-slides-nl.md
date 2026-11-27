---
title: "lintje slides: dezelfde huisstijl, nu voor presentaties"
description: "Een presentatie als één HTML-bestand, met dertig vaste indelingen, grafieken uit lintje, een controle per dia, een sprekersweergave en een pdf in licht en donker. Omdat de opmaak uit de indeling komt, maakt een agent dezelfde dia's als jij."
pubDate: 2026-11-27
key: lintje-slides
lang: nl
readMin: 8
project: lintje-slides
repo: https://github.com/h11t-labs/lintje-slides
tags: ["html", "css", "playwright", "agents", "design-systems"]
---

Met [lintje](/writing/lintje/) zat de Rijkshuisstijl in de applicatie. Maar het verhaal
óver die applicatie vertel je meestal in een presentatie — en daar ging het steeds mis.

Een sjabloon in PowerPoint houdt het een dia of drie vol. Daarna versleept iedereen
z'n eigen vakjes, wordt de letter net iets kleiner zodat het past, en komt de grafiek
als screenshot uit Excel, in Excel-kleuren. Vraag je een AI-assistent om een
presentatie, dan krijg je óf een generiek deck dat op elk ander deck lijkt, óf iets
moois in een stijl die het zelf verzon.

Ik wilde dia's die er altijd uitzien als de huisstijl, wie ze ook maakt. Dus bouwde
ik **lintje slides**: dezelfde huisstijl als lintje, nu voor presentaties.

## Eén HTML-bestand, dertig indelingen

Een presentatie is één HTML-bestand. Elke dia is een `<section>` die een van dertig
indelingen kiest en die vult met tekst, foto's en data:

```html
<section class="slide" data-layout="band-list" data-chapter="1 Waarom">
  <h1>Een brief die niet begrepen wordt, kost twee keer</h1>
  <p data-field="intro">Elke vraag die binnenkomt, is werk dat de brief had kunnen voorkomen.</p>
  <div data-field="points">
    <ul>
      <li>Wie de brief niet snapt, belt, mailt of komt langs.</li>
      <li>Op taalniveau B1 lezen de meeste mensen een brief in één keer.</li>
    </ul>
  </div>
</section>
```

Meer schrijf je niet. De voet, het hoofdstuk, het dianummer, het embleem en de
opsommingstekens zet het pakket erbij. De dertig indelingen staan in vijf ondergronden:
een foto, een licht vlak, een blauwe band, vol blauw en half beeld. Er is een titeldia,
een agenda, drie kaarten, vier stappen, een kerncijfer, een citaat, voor en na, een
planning, een samenvatting — wat een presentatie zoal nodig heeft.

De kleuren zijn de tokens van lintje. Daardoor werken de zes thema's en de dark mode
gewoon mee: `?mode=dark` achter de URL en het hele deck is donker, zonder dat je er
iets voor hoeft te doen.

## Waarom dit goed werkt met agents

Het belangrijkste besluit: **in de inhoud staat geen opmaak.** Geen `style`, geen
`class`, geen kleinere letter. Wil je dat een dia er anders uitziet, dan kies je een
andere indeling. Dat klinkt streng, maar het haalt precies weg waar een agent slecht in
is — vakjes uitlijnen en kleuren verzinnen — en laat over waar die goed in is: een
verhaal schrijven en per dia kiezen wat erbij past.

Daarbij hoort een controle die zegt wat er mis is, in een zin waar je iets mee kunt:

```bash
npx lintje-slides check decks/brieven.html --images
```

Die opent het deck in Chromium en meldt per dia wat niet past: een onbekende indeling of
een veld dat ontbreekt, een titel van meer dan zestien woorden, een foto zonder
alt-tekst, opmaak in de inhoud, of tekst die niet in z'n vak past — met erbij wat je
doet: "maak de tekst korter". Met `--images` zet hij ook een png per dia in `out/`, zodat
een agent naar z'n eigen werk kan kijken. De controle ziet namelijk niet of een dia half
leeg is of een titel op één woord breekt; een blik op de png wél. Eén oorzaak geeft één
melding, dus een agent hoeft niet te raden welke van drie regels het echte probleem is.
Een deck met meldingen krijgt geen pdf.

Zo ziet dat eruit als één kaart te veel tekst heeft:

```text
decks/demo.html: 1 melding
  dia 5 (plain-three-cards): veld "cards" past niet (70 woorden, hoogstens 60): maak de tekst korter
```

Met `?check` achter de URL staat dezelfde melding op de dia zelf, net boven de voet, en
heeft het vak dat niet past een dunne foutlijn:

![Een dia met drie kaarten in de browser, met een rode lijn om de kaarten en net boven de voet één foutmelding: 'veld "cards" past niet (70 woorden, hoogstens 60): maak de tekst korter'.](/writing/lintje-slides/check.png)

Zo wordt het een lus die een agent zelf rond kan maken: schrijven, controleren,
oplossen, kijken. Het resultaat ziet eruit alsof het uit hetzelfde sjabloon komt —
omdat het dat ook doet.

## Grafieken die gewoon kloppen

Een dia met data gebruikt de indeling `band-chart`, en daarin staat een
`<lintje-chart>` — dezelfde grafiek als in lintje, met z'n data als JSON:

```html
<div data-field="chart">
  <lintje-chart>
    <script type="application/json">
      {
        "expandable": false,
        "download": false,
        "description": "Telefoontjes per 1.000 brieven, oude en nieuwe brief: herinnering 210 en 120, …",
        "chart": {
          "kind": "grouped-bar",
          "labels": ["Herinnering", "Beschikking", "Wijziging", "Ontvangst"],
          "series": [
            { "label": "Oude brief", "values": [210, 180, 150, 90], "color": "var(--color-chart-secondary)" },
            { "label": "Nieuwe brief", "values": [120, 110, 95, 70], "color": "sky-blue" }
          ]
        }
      }
    </script>
  </lintje-chart>
</div>
```

Geen screenshot uit Excel dus, maar een echte grafiek in de huisstijl: zes soorten
(staaf, gegroepeerd, gestapeld, lijn, liggende staaf en taart), de datakleuren van de
Rijkshuisstijl bij naam, grijs voor de vergelijking, en een `description` die de cijfers
in woorden zegt voor wie ze niet ziet. In donker blijft het blauw van de data hetzelfde
blauw; het grijs van de vergelijking wordt lichter, zodat het leesbaar blijft, en de band
achter de titel wordt een gedempt blok, zodat elk thema het contrast haalt.

![Een dia met een gegroepeerde staafgrafiek: telefoontjes per 1.000 brieven, de oude brief in grijs en de nieuwe in blauw, met de titel "Na het herschrijven bellen minder mensen na een brief".](/writing/lintje-slides/chart-light.png)

![Dezelfde dia in dark mode: donkere achtergrond, een gedempte donkerblauwe band achter de titel, de oude brief lichtgrijs, de nieuwe in hetzelfde blauw.](/writing/lintje-slides/chart-dark.png)

Voor wie geen grafiek nodig heeft maar één getal: er zijn indelingen voor een kerncijfer
en voor drie cijfers naast elkaar.

![Een dia met drie kerncijfers: −37% minder telefoontjes na een brief, 395 telefoontjes per 1.000 brieven, en 4 brieven herschreven.](/writing/lintje-slides/key-figures.png)

## De skill

Het pakket brengt een skill mee voor een AI-assistent, in `skills/lintje-slides/`. Die
beschrijft de werkwijze van verhaallijn tot pdf:

1. **De verhaallijn.** Eén boodschap per dia, als titel: een bewering die de zaal kan
   onthouden ("Na het herschrijven bellen minder mensen"), geen onderwerp
   ("Telefoontjes"). Klaar als de titels achter elkaar het hele verhaal vertellen.
2. **Een indeling per dia**, uit een tabel met wat de dia moet doen: drie gelijkwaardige
   punten, één getal dat moet tellen, oud tegenover nieuw, een verloop in cijfers.
3. **Het deck schrijven**, vanuit het voorbeeld waarin elke indeling één keer staat, in
   een hoeveelheid tekst die past.
4. **Controleren**, en elke png bekijken.
5. **Exporteren** naar pdf, licht en donker, of als één los bestand.

Daaromheen staat wat een goede presentatie maakt: ongeveer één inhoudsdia per minuut,
wissel van ondergrond zodat drie dia's niet als één lange lezen, bewaar blauw voor wat
de zaal moet onthouden, en geef een getal altijd een eenheid en een vergelijking — "120
telefoontjes per 1.000 brieven, was 210". En per grafieksoort de precieze vorm van de
JSON, want een verkeerde vorm laat de pagina vastlopen.

Installeren gaat zo:

```bash
npm install --save-dev @lintje/slides
npx playwright install chromium
mkdir -p .claude/skills && cp -R node_modules/@lintje/slides/skills/lintje-slides .claude/skills/
```

Dat laatste is voor Claude Code. Een assistent zonder skills wijs je de weg met één
regel in je `AGENTS.md`: "Volg voor een presentatie
`node_modules/@lintje/slides/skills/lintje-slides/SKILL.md`." Daarna vraag je gewoon om
een presentatie — "tien minuten over het nieuwe aanvraagformulier, voor de afdeling" —
en krijg je een deck dat door de controle komt, met een pdf erbij.

## Presenteren

`npx lintje-slides serve` start een server met een link per deck. Je presenteert in de
browser: bladeren met de pijltjes, spatie of een clicker, F voor volledig scherm, D voor
licht of donker. Beweeg je de muis, dan faden de knoppen in; sta je stil of blader je
met de toetsen, dan faden ze weer uit. Het nummer van de dia staat in de URL, dus een
gedeelde link opent op de goede dia.

De knoppen staan in de marge onder de dia als het scherm die heeft, zoals op een laptop
van 16:10, en anders in de band van de voet. Ze liggen dus nooit over de bron of de
voet.

![Een dia met de staafgrafiek in de browser, met in de marge eronder een rij knoppen: vorige, 16 / 30, volgende, licht of donker, alle dia's, sprekersweergave, volledig scherm en sneltoetsen.](/writing/lintje-slides/presenting.png)

Sinds 0.3 kan de balk ook boven, links of rechts staan: met `data-controls="right"` op
`<body>` voor het hele deck, of voor één keer met `?controls=right` achter de URL.
Links en rechts staan de knoppen onder elkaar. Dat is handig op een breed scherm, of als
je aan de zijkant van de zaal staat.

![Dezelfde dia op een breed scherm, met de knoppen onder elkaar in de marge rechts van de dia.](/writing/lintje-slides/controls-right.png)

O opent een overzicht van alle dia's, klein naast elkaar. De dia waar je bent heeft een
rand en een gevuld nummer; klik er een aan of kies met de pijltjes en Enter.

![Het overzicht: dia 9 tot en met 20 klein in een raster van vier kolommen, met nummers erboven. Dia 16 met de grafiek heeft een donkere rand en een gevuld nummer.](/writing/lintje-slides/overview.png)

### Sprekersweergave

Sinds 0.2 kan een dia notities hebben, in een `<aside data-notes>` als laatste in de dia.
De zaal ziet ze nooit — niet op de dia, niet in het overzicht en niet in de pdf:

```html
<aside data-notes>
  <p>Loop de vier onderdelen langs, in één zin elk.</p>
  <ul>
    <li>Noem de deadline van <strong>1 december</strong> nu al.</li>
    <li>Vragen mogen tussendoor.</li>
  </ul>
</aside>
```

S opent de sprekersweergave in een tweede venster. Bovenin staan de naam van het deck,
de dia waar je bent, hoe lang je al bezig bent als groot cijfer, de tijd en knoppen voor
vorige en volgende. Links staat de dia die de zaal ziet, met de volgende klein eronder;
rechts hebben je notities de hele kolom. De twee vensters lopen gelijk, ook als je in
het andere bladert of naar donker wisselt. De sprekersweergave zet je op je eigen
scherm; het zaalvenster sleep je naar de beamer en daar druk je op F.

![De sprekersweergave: bovenin de naam van het deck, de duur, de tijd en de knoppen Vorige, Volgende en Sluiten; links groot de huidige dia (de agenda) met de volgende klein eronder, rechts de notities.](/writing/lintje-slides/presenter.png)

### Pdf en een los bestand

```bash
npx lintje-slides pdf decks/brieven.html           # out/brieven.pdf
npx lintje-slides pdf decks/brieven.html --dark    # out/brieven-dark.pdf
npx lintje-slides bundle decks/brieven.html        # out/brieven.html
```

Dat laatste is ook nieuw in 0.2: het deck als één los HTML-bestand, met de opmaak, de
scripts, het lettertype, de iconen en de foto's erin. Het opent met een dubbelklik,
zonder server of internet, en doet alles wat het deck via de server doet — de
sprekersweergave ook. Van lintje gaat alleen mee wat het deck tekent, dus de grootte
zit vooral in de foto's. Handig om te mailen, of om op een USB-stick mee te nemen naar
een zaal waar je niet weet wat er staat.

## Uitgebracht

lintje slides is uit, nu als versie 0.3. Het staat op npm als `@lintje/slides`, brengt z'n
eigen versie van lintje mee, en de code staat op GitHub onder de EUPL-1.2-licentie. De
indelingen, de skill en de meldingen zijn in het Nederlands, net als de presentaties
waar het voor is.

Net als lintje is het geen officieel product van de Rijksoverheid en heeft het er geen
band mee. Het embleem en de huisstijl zijn van de organisaties die ze mogen voeren; het
pakket levert de dia's, niet dat recht.
