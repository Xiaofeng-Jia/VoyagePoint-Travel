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

Where to place images

- Add your 1980s-themed image as `images/1980s.jpg` and a modern image as `images/2026.jpg`.

Deploy

- GitHub Pages: push this repo and enable Pages from the `main` branch (or use `gh-pages` branch). For a simple static site, serve the repo root.
- Netlify / Vercel: connect the repo and deploy — no build step required for static files.

Next steps I can help with

- Wire the dialog choices to collect user emails or send a mock booking email.
- Add images and refine the styles for the nostalgia/look-and-feel you prefer.
- Create a small CI/CD deploy (Netlify/Vercel) and set a custom domain.
