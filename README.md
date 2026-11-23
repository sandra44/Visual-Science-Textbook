# Learning Visualizer

A local-first PDF textbook reader. Open the cover, turn a spread, or jump to a chapter or page. A sparkle at a measured heading opens a synchronised illustrated lesson above the same page. Physical subjects can have orbitable Three.js models; graphs remain 2D. The source includes the Grade 9 science lesson pack, not the publisher's PDF.

## Run a clean clone

**Deploy the full Grade 9 book on Vercel:** Push this repository to GitHub, import it in Vercel, and use the repository settings (remove any previous demo build override). `vercel.json` runs `npm run build:hosted` and serves `dist`. No Python, PDF upload, API keys, or environment variables are needed. The deployed reader requests each chapter of NCERT's [Exploration: Textbook of Science for Grade 9](https://ncert.nic.in/textbook/pdf/iesc1ps.pdf) through a same-origin Vercel rewrite to the official publisher. Reading requires NCERT to be reachable; the repo includes heading locations and lessons, not a mirror of the PDF or extracted prose. To preview this mode, use Vercel Preview or `vercel dev`; plain `vite preview` does not execute external rewrites.

Use Node.js 22 with npm and Python 3.10+ (a Python virtual environment is recommended). In the repository root:

```sh
npm ci
python -m pip install -r requirements.txt
python scripts/create_demo.py
npm run dev:web
```

Open the local URL printed by Vite (normally `http://localhost:5173`). Open the two-page demo book and select the sparkle beside the potato activity. No API key is necessary. Demo generation refuses to replace an existing book.

**Original Grade 9 book:** instead of generating the demo, place your authorised copy of the matching 272-page edition at the repository root as `Science Textbook.pdf`, then run `npm run index-pdf`. Do not use that edition's reverse-chapter profile for another PDF. **Different textbook:** follow [agent.md](agent.md).

**Build:** `npm run build` then `npm run preview`. The build copies the local PDF and generated indexes into `dist`; publishing that folder distributes the book. Check permissions first. For the original full science pack, `node scripts/check-topic-scenes.mjs` checks the authored scene coverage; its counts are not a demo or arbitrary-book test.

**Optional AI:** copy `.env.example` to `.env`, configure your chosen provider, then use `npm run dev` for the local API and web server together. Server credentials never belong in browser code. The curated reader does not use that API. A static deployment alone does not serve `/api`.
