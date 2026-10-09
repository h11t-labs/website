---
title: "lintje: the Rijkshuisstijl, for applications"
description: "Most component libraries are made for content websites. An application needs more — charts, a side navigation, a dark mode that holds up everywhere — so I built a design system that has all of it. Designed in Claude Design, tested against WCAG in three browsers."
pubDate: 2026-10-09
key: lintje
lang: en
readMin: 8
project: lintje
repo: https://github.com/h11t-labs/lintje
url: https://h11t-labs.github.io/lintje/
tags: ["typescript", "lit", "web-components", "wcag", "design-systems"]
---

There's no shortage of components for Dutch government sites. **NL Design System**
and RVO's own set give you buttons, form fields, alerts and headers, all in the house
style. For a website, that covers most of what you need.

But I wanted to build applications, a dashboard among them — and for that, a lot is
missing.

## Made for content websites

Most component libraries — the government ones, and plenty of others — are built for
simple content websites: a page of text, a form, a header and a footer. They're good at
that. An application needs more: a data table you can sort, filter and edit, a drawer,
tabs, a stepper, a tree view, a split pane, a multiselect, a date range, toasts and
notifications, a confirm dialog, a warning before your session runs out. None of it is
exotic. It's just usually not there.

A dashboard adds more on top: charts, KPI tiles, a filter bar, and a navigation that
sits *beside* the page instead of across the top.

## Why not just add a chart library?

That's the usual fix: government components for the forms, a chart library for the
rest. It works, but you can tell. The library brings its own fonts, its own colours, its
own tooltip and its own idea of dark mode. Next to the house style it looks like it came
from another site. And whether you can read the chart by keyboard or screen reader is up
to the library, not to you.

Take the data colours. The Rijkshuisstijl has them, but a chart library doesn't know
that. Nor does it know they have to stay the same in light, in dark and in every
organization's theme, so a red bar means the same thing everywhere. That's easier to get
right once, in one place, than on every page.

## Why a side navigation?

A government website puts its navigation across the top: a handful of sections, a
submenu per group, and the page scrolls underneath. An application gets used
differently. You jump between ten or fifteen screens all day, on a wide monitor, and you
want to see where you are without opening anything. A menu beside the page does exactly
that. When you need the room, it folds into a narrow rail of icons.

The house style doesn't have one — a website rarely needs it.

## A dark mode that's actually finished

What I also kept missing was a dark mode that's carried through everywhere. Not a dark
background with a bright white date picker on top, or a chart that still draws its
gridlines for a white page. In lintje every component, every chart and every theme has a
dark version, and every test run draws all of them in both modes.

Dark isn't just light flipped around, either. It's its own colour range, the same for
every theme, with its own contrast rules. In dark mode the theme colour gets three
variants — for a fill, a line and text — because each has a different contrast
requirement. And a QR code always stays light, because camera apps want dark modules on
a light background.

## Motion that feels right

I wanted the animation to feel finished too. A chart draws its data in as it comes into
view — once; scroll back and it doesn't replay. A KPI counts up to its value, and a new
number slides into place. What arrives slows down, what leaves speeds up. The whole
interface shares one base duration; data motion takes a little longer.

Two rules keep it in check. A value that animates sits in the accessibility tree at its
final value, so a screen reader never reads out a number halfway. And with reduced
motion switched on, nothing disappears except the motion itself. The focus ring never
moves.

## So I built the rest

**lintje** — named after the ribbon (*het lint*) in the Rijksoverheid logo — is the
Rijkshuisstijl as standard custom elements, built with [Lit 3](https://lit.dev). One
script registers all the `lintje-*` tags; on your page you write a tag and set its
attributes.

```html
<link rel="stylesheet" href="dist-elements/tokens.css" />
<link rel="stylesheet" href="dist-elements/fonts.css" />
<script type="module" src="dist-elements/lintje.js"></script>

<lintje-tile heading="Aanvraag">
  <lintje-text-input label="Naam"></lintje-text-input>
  <lintje-button variant="primary">Versturen</lintje-button>
</lintje-tile>
```

## The house style is written for communication

The Rijkshuisstijl covers the colours, the typeface, the logo and the header of a
government site. It doesn't say what a selected table row looks like, how a chart
behaves in dark mode, or where the menu goes on a phone. An application needs all of
that.

lintje fills it in, in the spirit of the house style. What already exists, it simply
uses — RijksSans and the icons come straight from RVO's assets. The rest it adds:

- **Charts.** Ten kinds, one visual grammar, no chart library: bar, horizontal bar,
  grouped, stacked, line, dual-axis, pie, heatmap, progress towards a target, and a map —
  of the Netherlands on PDOK geometry, or of the world. The data colours are fixed by the
  Rijkshuisstijl.
- **Two navigation layouts.** The familiar bar across the top, and a layout with the
  menu at the side: pinned, or as a narrow rail that expands over the content. Below
  768 px both become a header with a full-screen menu.
- **The parts of a dashboard.** A shell with its menu, a page header, a filter bar, KPI
  tiles, a data table with editable cells. Over a hundred elements in all, in thirteen
  categories, from the page frame to a chat with your data.
- **Six themes.** A theme sets just two properties, `--primary` and `--accent`; the rest
  is derived from them with `color-mix()` and OKLCH, in light and in dark.

## Designed in Claude Design

The whole design — the components, their states, the dark mode and the phone layouts —
was made in Claude Design, and the code follows it. The style guide in the repo shows
every element in all its states, with its properties and events underneath, so you see
the design and the code in one place.

## WCAG AA as the floor

When the house style and WCAG AA clash, AA wins — with the smallest change that does the
job. A few examples:

- Colour is never the only thing that carries meaning. Next to a colour there's always a
  symbol, a number or a word.
- You can read a chart by keyboard: the arrow keys walk through the categories, and a
  screen reader reads out the tooltip.
- Below 768 px every column of a table stays within reach; nothing is dropped.

Every departure from the house style is written down, with the reason.

## Tested in a real browser

Unit tests run in happy-dom. The rest runs in a real browser, through Vitest and
Playwright. Every example in the style guide is drawn in light and dark, at 1440 and
390 px wide, and has to pass four checks: its tags exist, nothing lands in
`console.error`, every icon has a file, and axe finds no WCAG A or AA violation. CI runs
that on every pull request in Chromium, WebKit and Firefox, and once more before every
release.

That's not a full audit. Axe doesn't look at a page the way a person does, and it
doesn't listen along with a screen reader. One finding is still open and tracked as an
issue; fix it without removing the note and the test fails. But it does mean a
regression in contrast or labelling shows up before it goes live.

## The page stays in charge

One rule shapes the whole API: an element never fetches data, never reads the URL and
never keeps timers for the server. When an element wants something, it sends an event;
the page answers by setting a property.

That makes it pleasantly boring to use. A page rendered on the server — with PHP, Python
or as a static file — needs no script of its own: links are just links, inputs post in a
normal `<form>`, and a chart's data sits in the element as a JSON script. If your page
does have its own JavaScript, it just listens for the events.

## Released

lintje is out, as version 0.1. It's on npm as `lintje`, and the code is on GitHub under
the EUPL-1.2 licence. The style guide and the example applications — with made-up data —
are on [GitHub Pages](https://h11t-labs.github.io/lintje/), so you can click through all
of it without building anything. It also comes with a skill for an AI assistant that
builds an application with it.

It's still 0.x: until 1.0, tags, properties and events can still change. The changelog
lists every change that breaks something.

To be clear: lintje is not an official Rijksoverheid product and has no connection to
it. The house style and the emblems belong to the Rijksoverheid and the organizations
they represent, and only organizations that are allowed to carry them use them. lintje
provides the code, not that right.
