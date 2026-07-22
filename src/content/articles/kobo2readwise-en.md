---
title: "Kobo highlights into Readwise — no desktop app, just the browser"
description: "Highlights from sideloaded Kobo books live only on the device. October solves that with a desktop app; I did the same thing in the browser, using the File System Access API and sql.js."
pubDate: 2026-07-22
key: kobo2readwise
lang: en
readMin: 5
project: kobo2readwise
repo: https://github.com/h11t-labs/kobo2readwise
url: https://kobo2readwise.fly.dev
tags: ["python", "fastapi", "sqlite", "wasm", "readwise"]
---

I borrow my books from the [online library](/writing/online-bibliotheek-catalogus) and
read them on my Kobo. While reading I highlight a lot — lines that stick, things I want to
keep. I want those annotations in [Readwise](https://readwise.io), where the rest of my
highlights already live. Except that doesn't happen by itself.

Books from the Kobo store, Kobo Plus, and library loans already sync through Readwise's
own integration. But **sideloaded** books — EPUBs you put on the device yourself via
Calibre, email, or USB, or a loan from the
[online library](/writing/online-bibliotheek-catalogus) that you transfer to your Kobo
with Adobe Digital Editions — are a different story. Their highlights live only in the local
`KoboReader.sqlite` on the e-reader and never reach the Kobo cloud, so Readwise can't get
at them.

## The existing fix is a desktop app

For exactly this problem there's [October](https://october.utf9k.net/): a tidy,
open-source desktop app that detects your Kobo the moment you plug it in, reads the
database, and uploads the highlights to Readwise. It works well. But it's still something
you install, per operating system, and keep around.

I figured this can just run in the browser now. Chrome and Edge can read a file on your
disk *without* uploading it via the
[File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API),
and [sql.js](https://sql.js.org) runs SQLite as WebAssembly right inside the tab. Together
that's everything you need: no install, one URL.

## How it works

The flow is short:

**pick the file** → **read SQLite in the browser** → **forward highlights to Readwise**.

You choose your `KoboReader.sqlite`, sql.js reads it locally (the file never leaves your
computer), and the app shows, per book, which highlights it will send. A thin proxy takes
that batch and forwards it to the Readwise API — that's all the server does.

## The trust model: the token is forgotten

There is one thing the server does touch: your Readwise token, because it has to go into
the `Authorization` header to Readwise. So the whole design is built around it — the proxy
forwards your token and then immediately forgets it. **No request-body logging, no
persistence, no database.** The token lives only in memory for the duration of a single
request. That's the entire point of the app, and it's stated as an explicit promise at the
top of [`app.py`](https://github.com/h11t-labs/kobo2readwise/blob/main/app.py).

For the same reason sql.js is **self-hosted** rather than loaded from a CDN: on the page
that briefly holds your token, you don't want any third-party script running.

## Finding the file: showing hidden folders

The `KoboReader.sqlite` sits in a **hidden** folder called `.kobo`, at the root of your
e-reader when you mount it over USB. Hidden folders — anything starting with a dot — don't
show by default in Finder or in the macOS file dialog.

The trick: in Finder or the "Choose file" dialog, press **Shift + Command + .** (period).
That toggles hidden files on and off; now the `.kobo` folder appears and you can navigate
into it to `KoboReader.sqlite`. The same shortcut again hides them.

## Why Chromium-only, desktop-only

The File System Access API today only works in **Chrome or Edge on desktop**. Firefox,
Safari, and mobile browsers don't support it. Rather than failing cryptically, the app
shows a clear notice in those cases: this is a Chromium desktop tool. That's the cost of
installing nothing — and for me a fine trade.

## Hosting

Runs on [Fly.io](https://fly.io) as a single scale-to-zero app at
[kobo2readwise.fly.dev](https://kobo2readwise.fly.dev). Because every user enters their own
token in the browser, the server needs no Readwise secret at all. Deploys go through
release-please: a real version bump (merging the release PR) triggers a production deploy;
ordinary feature merges don't.

The stack, in one line: Python 3.14+, **FastAPI** for the proxy, **sql.js** (SQLite as
WASM) and the **File System Access API** for reading in the browser, vanilla JS for the
UI, and **uv** for packaging.
