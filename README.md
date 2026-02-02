# VoyagePoint Travel — Static Prototype

This repository contains two lightweight static pages for VoyagePoint Travel:

- `index.html` — Nostalgia (1980s voice/style)
- `robot.html` — Modern/robotic (2026 voice/style)

Features:
- Simple modal dialog guided by button-click choices.
- Two separate pages that reuse the same `js/chat.js` logic; which script runs is chosen by the `data-script` attribute on `<body>`.

How to run locally

1. Open `index.html` or `robot.html` directly in your browser.
2. Or run a simple HTTP server (recommended):

```bash
# from repository root
python3 -m http.server 8000
# then open http://localhost:8000/index.html
```