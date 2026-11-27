---
title: "lintje slides: the same house style, now for presentations"
description: "A presentation as one HTML file, with thirty fixed layouts, charts from lintje, a check per slide, a presenter view and a PDF in light and dark. Because the styling comes from the layout, an agent makes the same slides you do."
pubDate: 2026-11-27
key: lintje-slides
lang: en
readMin: 8
project: lintje-slides
repo: https://github.com/h11t-labs/lintje-slides
tags: ["html", "css", "playwright", "agents", "design-systems"]
---

With [lintje](/writing/lintje/), the Rijkshuisstijl made it into the application. But the
story *about* that application usually gets told in a presentation — and that's where it
kept going wrong.

A PowerPoint template holds up for about three slides. After that everyone drags their
own boxes around, the font gets a little smaller so it fits, and the chart arrives as a
screenshot from Excel, in Excel colours. Ask an AI assistant for a presentation and you
get either a generic deck that looks like every other deck, or something pretty in a
style it made up.

I wanted slides that always look like the house style, whoever makes them. So I built
**lintje slides**: the same house style as lintje, now for presentations.

## One HTML file, thirty layouts

A presentation is one HTML file. Each slide is a `<section>` that picks one of thirty
layouts and fills it with text, photos and data:

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

That's all you write. The footer, the chapter, the slide number, the emblem and the
bullets are added by the package. The thirty layouts come in five backgrounds: a photo,
a light panel, a blue band, full blue and half image. There's a title slide, an agenda,
three cards, four steps, a key figure, a quote, before and after, a schedule, a summary
— the things a presentation tends to need.

The colours are lintje's tokens. So the six themes and dark mode just come along: add
`?mode=dark` to the URL and the whole deck is dark, without you doing anything for it.

## Why this works well with agents

The key decision: **there's no styling in the content.** No `style`, no `class`, no
smaller font. If you want a slide to look different, you pick a different layout. That
sounds strict, but it takes away exactly what an agent is bad at — lining up boxes and
inventing colours — and leaves what it's good at: writing a story and choosing, per
slide, what fits.

With that comes a check that tells you what's wrong, in a sentence you can act on:

```bash
npx lintje-slides check decks/brieven.html --images
```

It opens the deck in Chromium and reports, per slide, what doesn't fit: an unknown
layout or a missing field, a title longer than sixteen words, a photo without alt text,
styling in the content, or text that overflows its box — along with what to do: "make
the text shorter". With `--images` it also writes a PNG per slide to `out/`, so an agent
can look at its own work. The check can't see whether a slide is half empty or a title
breaks onto a single word; a look at the PNG can. A deck with messages doesn't get a
PDF.

Here's what that looks like when one card has too much text:

```text
decks/demo.html: 2 meldingen
  dia 5 (plain-three-cards): veld "cards": hoogstens 60 woorden, nu 67
  dia 5 (plain-three-cards): een punt in "cards" past niet: maak de tekst korter
```

Add `?check` to the URL and the same messages show up on the slide itself, with an
outline around the box that doesn't fit:

![A slide with three cards in the browser, with red dashed outlines around the cards and two red bars at the bottom: 'een punt in "cards" past niet: maak de tekst korter' and 'veld "cards": hoogstens 60 woorden, nu 67'.](/writing/lintje-slides/check.png)

That makes it a loop an agent can close on its own: write, check, fix, look. The result
looks like it came out of the same template — because it did.

## Charts that just work

A slide with data uses the `band-chart` layout, and in it sits a `<lintje-chart>` — the
same chart as in lintje, with its data as JSON:

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

So no screenshot from Excel, but a real chart in the house style: six kinds (bar,
grouped, stacked, line, horizontal bar and pie), the Rijkshuisstijl data colours by
name, grey for the comparison, and a `description` that puts the numbers into words for
anyone who can't see them. In dark mode the blue stays the same blue; only the grey of
the comparison gets lighter, so it stays readable.

![A slide with a grouped bar chart: calls per 1,000 letters, the old letter in grey and the new one in blue, titled "Na het herschrijven bellen minder mensen na een brief".](/writing/lintje-slides/chart-light.png)

![The same slide in dark mode: dark background, the old letter in light grey, the new one in the same blue.](/writing/lintje-slides/chart-dark.png)

If you need one number rather than a chart, there are layouts for a key figure and for
three figures side by side.

![A slide with three key figures: −37% fewer calls after a letter, 395 calls per 1,000 letters, and 4 letters rewritten.](/writing/lintje-slides/key-figures.png)

## The skill

The package comes with a skill for an AI assistant, in `skills/lintje-slides/`. It lays
out the workflow from storyline to PDF:

1. **The storyline.** One message per slide, written as its title: a claim the room can
   remember ("Fewer people call after the rewrite"), not a topic ("Calls"). Done when
   the titles, read in a row, tell the whole story.
2. **A layout per slide**, from a table of what the slide has to do: three equal points,
   one number that has to land, old versus new, a trend in numbers.
3. **Writing the deck**, starting from the example that uses every layout once, with an
   amount of text that fits.
4. **Checking**, and looking at every PNG.
5. **Exporting** to PDF, light and dark, or as a single file.

Around that sits what makes a good presentation: roughly one content slide per minute,
switch backgrounds so three slides don't read as one long one, save blue for what the
room should remember, and always give a number a unit and a comparison — "120 calls per
1,000 letters, was 210". And per chart kind the exact shape of the JSON, because a wrong
shape locks up the page.

Installing goes like this:

```bash
npm install --save-dev @lintje/slides
npx playwright install chromium
mkdir -p .claude/skills && cp -R node_modules/@lintje/slides/skills/lintje-slides .claude/skills/
```

That last line is for Claude Code. An assistant without skills gets pointed the right
way with one line in your `AGENTS.md`: "For a presentation, follow
`node_modules/@lintje/slides/skills/lintje-slides/SKILL.md`." After that you just ask for
a presentation — "ten minutes on the new application form, for the department" — and you
get a deck that passes the check, with a PDF to go with it.

## Presenting

`npx lintje-slides serve` starts a server with a link per deck. You present in the
browser: arrow keys, space or a clicker to move, F for full screen, D for light or dark.
Move the mouse and the buttons fade in at the bottom; keep still or page with the keys
and they fade out again. The slide number sits in the URL, so a shared link opens on the
right slide.

![A slide with the bar chart in the browser, with a row of buttons at the bottom: previous, 16 / 30, next, light or dark, all slides, presenter view, full screen and shortcuts.](/writing/lintje-slides/presenting.png)

O opens an overview of all slides, small and side by side. The one you're on has a
border, the rest is dimmed; click one, or pick it with the arrow keys and Enter.

![The overview: slides 9 to 20 small in a four-column grid, numbered. Slide 16 with the chart has a dark border, the others are dimmed.](/writing/lintje-slides/overview.png)

### Presenter view

Since 0.2 a slide can have notes, in an `<aside data-notes>` at the end of the slide. The
room never sees them — not on the slide, not in the overview and not in the PDF:

```html
<aside data-notes>
  <p>Loop de vier onderdelen langs, in één zin elk.</p>
  <ul>
    <li>Noem de deadline van <strong>1 december</strong> nu al.</li>
    <li>Vragen mogen tussendoor.</li>
  </ul>
</aside>
```

S opens the presenter view in a second window: the slide the room sees, the next one,
your notes, the time and how long you've been going. The two windows stay in step, also
when you page or switch to dark in the other one. That one goes on your own screen; you
drag the room window to the projector and press F there.

![The presenter view: the current slide (the agenda) large on the left, the next one smaller on the right, the notes underneath, and the time, the duration and the buttons at the top right.](/writing/lintje-slides/presenter.png)

### PDF and a single file

```bash
npx lintje-slides pdf decks/brieven.html           # out/brieven.pdf
npx lintje-slides pdf decks/brieven.html --dark    # out/brieven-dark.pdf
npx lintje-slides bundle decks/brieven.html        # out/brieven.html
```

That last one is new in 0.2 too: the deck as one standalone HTML file, with the styling,
the scripts, the font, the icons and the photos inside. It opens with a double-click,
without a server or internet, and does everything the deck does through the server — the
presenter view included. Only the parts of lintje the deck actually draws come along, so
most of the size is the photos. Handy for mailing, or for taking on a USB stick to a room
where you don't know what's set up.

## Released

lintje slides is out, now at version 0.2. It's on npm as `@lintje/slides`, brings its own
version of lintje along, and the code is on GitHub under the EUPL-1.2 licence. The
layouts, the skill and the check's messages are in Dutch, like the presentations it's
made for.

Like lintje, it's not an official Rijksoverheid product and has no connection to it. The
emblem and the house style belong to the organizations that are allowed to carry them;
the package provides the slides, not that right.
