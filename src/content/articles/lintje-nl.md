---
title: "lintje: de Rijkshuisstijl, voor applicaties"
description: "De meeste componentbibliotheken zijn gemaakt voor contentwebsites. Een applicatie heeft meer nodig — grafieken, een verticale navigatie, een dark mode die overal klopt — dus bouwde ik een design system waar dat allemaal in zit. Ontworpen in Claude Design, getest tegen WCAG in drie browsers."
pubDate: 2026-10-09
key: lintje
lang: nl
readMin: 8
project: lintje
repo: https://github.com/h11t-labs/lintje
url: https://h11t-labs.github.io/lintje/
tags: ["typescript", "lit", "web-components", "wcag", "design-systems"]
---

Aan componenten voor overheidssites geen gebrek. **NL Design System** en de set van RVO
geven je knoppen, formuliervelden, meldingen en headers, netjes in de huisstijl. Voor
een website heb je daarmee het meeste wel.

Maar ik wilde applicaties bouwen, met onder meer een dashboard. En daarvoor mist er
nogal wat.

## Gemaakt voor contentwebsites

De meeste componentbibliotheken — die van de overheid, maar ook veel andere — zijn
bedoeld voor eenvoudige contentwebsites: een pagina met tekst, een formulier, een header
en een footer. Daar zijn ze goed in. Maar een applicatie heeft meer nodig: een datatabel
waarin je kunt sorteren, filteren en bewerken, een drawer, tabs, een stepper, een
boomstructuur, een split pane, een multiselect, een datumbereik, toasts en meldingen,
een bevestigingsdialoog, een waarschuwing als je sessie bijna verloopt. Niks bijzonders,
maar het zit er meestal gewoon niet in.

Voor een dashboard komt daar nog meer bij: grafieken, KPI-tegels, een filterbalk en een
navigatie die *naast* de pagina staat in plaats van erboven.

## Waarom niet gewoon een grafiekbibliotheek?

De gebruikelijke oplossing: overheidscomponenten voor de formulieren, en een
grafiekbibliotheek voor de rest. Dat werkt, maar je ziet het meteen. Zo'n bibliotheek
brengt z'n eigen lettertype, kleuren en tooltip mee, en z'n eigen idee van dark mode.
Naast de huisstijl lijkt het een stuk van een andere site. En of je de grafiek met
toetsenbord of screenreader kunt lezen, bepaalt de bibliotheek, niet jij.

Neem de datakleuren. De Rijkshuisstijl heeft ze, maar dat weet een grafiekbibliotheek
niet. Die weet ook niet dat ze hetzelfde moeten blijven in licht, in donker en in het
thema van elke organisatie, zodat een rode staaf overal hetzelfde betekent. Dat kun je
beter één keer goed regelen, op één plek, dan op elke pagina opnieuw.

## Waarom een verticale navigatie?

Een overheidswebsite heeft z'n navigatie bovenaan: een handvol secties, een submenu per
groep, en de pagina scrolt eronder. Een applicatie gebruik je anders. Je springt de hele
dag tussen tien, vijftien schermen, op een breed scherm, en je wilt zien waar je bent
zonder iets open te klikken. Een menu naast de pagina doet precies dat. Heb je de ruimte
nodig, dan klap je het in tot een smalle balk met iconen.

In de huisstijl zit zo'n menu niet — een website heeft het zelden nodig.

## Een dark mode die echt af is

Wat ik ook steeds miste: een dark mode die overal is doorgevoerd. Dus niet een donkere
achtergrond met daarop een felwitte datumkiezer, of een grafiek die z'n rasterlijnen nog
voor een witte pagina tekent. In lintje heeft elk component, elke grafiek en elk thema
een donkere versie, en bij elke testrun tekent de styleguide ze allemaal in beide modi.

Donker is ook niet gewoon licht omgedraaid. Het is een eigen kleurenreeks, voor elk thema
dezelfde, met eigen contrastregels. Zo krijgt de themakleur in dark mode drie varianten —
voor een vlak, een lijn en tekst — omdat elk een andere contrasteis heeft. En een
QR-code blijft altijd licht, want camera-apps willen donkere blokjes op een lichte
achtergrond.

## Beweging die klopt

Ik wilde ook dat de animaties af voelen. Een grafiek tekent z'n data in zodra-ie in beeld
komt — één keer; scroll je terug, dan gebeurt het niet opnieuw. Een KPI telt op naar z'n
waarde, en een nieuw getal schuift op z'n plek. Wat binnenkomt remt af, wat weggaat
versnelt. De hele interface gebruikt één basisduur; databeweging duurt net iets langer.

Twee regels houden het netjes. Een waarde die animeert, staat met z'n eindwaarde in de
accessibility tree, zodat een screenreader nooit een tussenstand voorleest. En zet je
'beweging beperken' aan, dan verdwijnt er niks behalve de beweging zelf. De focusring
beweegt nooit.

## Dus bouwde ik de rest

**lintje** — vernoemd naar het lint in het logo van de Rijksoverheid — is de
Rijkshuisstijl als standaard custom elements, gebouwd met [Lit 3](https://lit.dev). Eén
script registreert alle `lintje-*`-tags; op je pagina schrijf je een tag en zet je de
attributen.

```html
<link rel="stylesheet" href="dist-elements/tokens.css" />
<link rel="stylesheet" href="dist-elements/fonts.css" />
<script type="module" src="dist-elements/lintje.js"></script>

<lintje-tile heading="Aanvraag">
  <lintje-text-input label="Naam"></lintje-text-input>
  <lintje-button variant="primary">Versturen</lintje-button>
</lintje-tile>
```

## De huisstijl is geschreven voor communicatie

De Rijkshuisstijl regelt de kleuren, het lettertype, het logo en de header van een
overheidssite. Maar er staat niet in hoe een geselecteerde tabelrij eruitziet, hoe een
grafiek zich in dark mode gedraagt of waar het menu op een telefoon blijft. Voor een
applicatie heb je dat allemaal nodig.

lintje vult dat in, in de geest van de huisstijl. Wat er al is, gebruikt het gewoon —
RijksSans en de iconen komen rechtstreeks uit de assets van RVO. De rest voegt het toe:

- **Grafieken.** Tien soorten, met één vormtaal en zonder grafiekbibliotheek: staaf,
  liggende staaf, gegroepeerd, gestapeld, lijn, twee assen, taart, heatmap, voortgang
  naar een doel, en een kaart — van Nederland op PDOK-geometrie, of van de wereld. De
  datakleuren komen vast uit de Rijkshuisstijl.
- **Twee navigatie-layouts.** De bekende balk bovenaan, en een layout met het menu aan de
  zijkant: vast in beeld, of als smalle balk die over de inhoud uitklapt. Onder de 768 px
  worden ze allebei een header met een menu dat het hele scherm vult.
- **De onderdelen van een dashboard.** Een shell met menu, een paginakop, een filterbalk,
  KPI-tegels, een datatabel waarin je cellen kunt bewerken. Bij elkaar ruim honderd
  elementen, verdeeld over dertien categorieën, van het paginakader tot een chat met je
  data.
- **Zes thema's.** Een thema stelt maar twee properties in, `--primary` en `--accent`;
  de rest wordt daarvan afgeleid met `color-mix()` en OKLCH, in licht en in donker.

## Ontworpen in Claude Design

Het hele ontwerp — de componenten, hun states, de dark mode en de layouts voor de
telefoon — is gemaakt in Claude Design, en de code volgt dat ontwerp. De styleguide in de
repo laat elk element zien in al z'n states, met de properties en events eronder. Zo kijk
je naar ontwerp en code tegelijk.

## WCAG AA als ondergrens

Botsen de huisstijl en WCAG AA, dan wint AA — met de kleinste aanpassing die nodig is.
Een paar voorbeelden:

- Kleur is nooit het enige wat iets betekent. Naast een kleur staat altijd een symbool,
  een getal of een woord.
- Je kunt een grafiek met het toetsenbord lezen: met de pijltjestoetsen loop je langs de
  categorieën, en een screenreader leest de tooltip voor.
- Onder de 768 px blijft elke kolom van een tabel bereikbaar; er wordt niks weggelaten.

Elke afwijking van de huisstijl is vastgelegd, met de reden erbij.

## Getest in een echte browser

De unittests draaien in happy-dom. De rest draait in een echte browser, via Vitest en
Playwright. Elk voorbeeld uit de styleguide wordt getekend in licht en donker, op 1440 en
390 px breed, en moet aan vier dingen voldoen: de tags bestaan, er komt niks in
`console.error`, elk icoon heeft een bestand, en axe vindt geen overtreding van WCAG A
of AA. CI draait dat bij elke pull request in Chromium, WebKit en Firefox, en nog een
keer vóór elke release.

Dat is geen volledige audit. Axe kijkt niet naar een pagina zoals een mens dat doet, en
luistert niet mee met een screenreader. Eén bevinding staat nog open en is als issue
genoteerd; los je die op zonder de notitie weg te halen, dan faalt de test. Maar een
achteruitgang in contrast of labels zie je zo wél voordat het live staat.

## De pagina houdt de regie

Eén regel bepaalt de hele API: een element haalt nooit zelf data op, leest nooit de URL
en houdt geen timers bij voor de server. Wil een element iets, dan stuurt het een event;
de pagina antwoordt door een property te zetten.

Daardoor is het lekker saai in gebruik. Een pagina die op de server wordt gerenderd — met
PHP, Python of als statisch bestand — heeft geen eigen script nodig: links zijn gewoon
links, invoervelden posten in een normaal `<form>`, en de data voor een grafiek staat als
JSON-script in het element. Heeft je pagina wel eigen JavaScript, dan luistert die gewoon
naar de events.

## Uitgebracht

lintje is uit, als versie 0.1. Het staat op npm als `lintje`, en de code staat op GitHub
onder de EUPL-1.2-licentie. De styleguide en de voorbeeldapplicaties — met verzonnen data
— staan op [GitHub Pages](https://h11t-labs.github.io/lintje/), dus je kunt overal
doorheen klikken zonder iets te bouwen. Er zit ook een skill bij voor een AI-assistent
die er een applicatie mee bouwt.

Het is nog 0.x: tot 1.0 kunnen tags, properties en events nog veranderen. In de changelog
staat elke wijziging die iets breekt.

Voor de duidelijkheid: lintje is geen officieel product van de Rijksoverheid en heeft er
geen band mee. De huisstijl en de emblemen zijn van de Rijksoverheid en van de
organisaties die ze vertegenwoordigen, en alleen organisaties die ze mogen voeren,
gebruiken ze. lintje levert de code, niet dat recht.
