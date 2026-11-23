import 'dotenv/config';
import express from 'express';

const app = express();
app.use(express.json({ limit: '2mb' }));

const PORT = Number(process.env.PORT || 3001);
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen2.5-coder:7b';

function buildSystemPrompt() {
  return `You are an expert Grade 9 science educator and interactive simulation developer.
Generate a self-contained, interactive 2D HTML5 Canvas or SVG simulation (not a static diagram or slide deck!) for the requested science concept.

Respond with ONLY a valid JSON object matching this exact schema:
{
  "title": "Short concept title",
  "subtitle": "Grade 9 • Chapter or topic summary",
  "hotspots": [
    {
      "id": "unique_id",
      "label": "Clickable part name",
      "category": "object | vector | concept | energy",
      "explanation": "Clear 9th-grade explanation in 1-2 sentences.",
      "formula": "Optional formula string"
    }
  ],
  "controls": [
    {
      "id": "param_id",
      "label": "Parameter Name",
      "type": "slider",
      "min": 0,
      "max": 100,
      "step": 1,
      "unit": "unit",
      "defaultValue": 50
    }
  ],
  "experiments": [
    {
      "id": "exp_1",
      "title": "Short experiment title",
      "prompt": "What to try using the controls or clicking on the canvas.",
      "hint": "What to observe."
    }
  ],
  "html": "<!doctype html><html>...complete self-contained HTML5+CSS+JS interactive simulation...</html>"
}

CRITICAL REQUIREMENTS FOR "html":
1. Use a clean light off-white/pastel palette: background #FAF9F6 or #FFFFFF, dark stone text #292524, pastel accents (#7C3AED violet, #0284C7 sky, #059669 emerald, #D97706 amber, #E11D48 rose).
2. Make it genuinely interactive and animated (requestAnimationFrame loop, play/pause/reset buttons, clickable parts on the canvas/SVG).
3. Wire clickable elements to notify the parent Inspector:
   window.parent.postMessage({ type: 'select-hotspot', id: 'matching_hotspot_id' }, '*');
4. Listen for live control updates from the parent Inspector:
   window.addEventListener('message', (e) => {
     if (e.data && e.data.type === 'control-change') {
       // update parameter e.data.id = e.data.value
     }
   });
5. Fill 100% of the viewport cleanly (html, body { margin:0; width:100%; height:100%; overflow:hidden; font-family: system-ui, sans-serif; }).
6. Always include clear on-canvas titles, part labels, axis titles with units, and a compact legend so every graph or diagram is immediately self-explanatory.
Draw recognizable specimens or apparatus with their defining structures. For invisible phenomena, show the physical setting and explicitly identify the abstract model; do not suggest model colours or scales are literal.
7. Wrap risky code in try/catch and report errors via window.parent.postMessage({ type: 'sim-error', message: err.message }, '*').
8. Do NOT use external scripts unless strictly necessary; pure Canvas 2D / SVG + vanilla JS is fastest and most reliable.`;
}

function extractJson(rawText) {
  const trimmed = rawText.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenced) {
      return JSON.parse(fenced[1].trim());
    }
    const firstBrace = trimmed.indexOf('{');
    const lastBrace = trimmed.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      return JSON.parse(trimmed.slice(firstBrace, lastBrace + 1));
    }
    throw new Error('Model did not return valid JSON.');
  }
}

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    geminiConfigured: Boolean(GEMINI_API_KEY),
    geminiModel: GEMINI_MODEL,
    ollamaUrl: OLLAMA_URL,
    ollamaModel: OLLAMA_MODEL,
  });
});

app.get('/api/ollama/models', async (_req, res) => {
  try {
    const r = await fetch(`${OLLAMA_URL}/api/tags`);
    if (!r.ok) return res.json({ models: [] });
    const data = await r.json();
    res.json({ models: (data.models || []).map((m) => m.name) });
  } catch {
    res.json({ models: [] });
  }
});

app.post('/api/visualize', async (req, res) => {
  const {
    prompt,
    provider = 'gemini',
    model,
    chapterTitle,
    topicTitle,
    textbookExcerpt,
  } = req.body || {};

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  const userPrompt = [
    `Concept to visualize: "${prompt}"`,
    chapterTitle ? `Textbook Chapter: ${chapterTitle}` : '',
    topicTitle ? `Textbook Topic: ${topicTitle}` : '',
    textbookExcerpt
      ? `Grade 9 Textbook Excerpt for grounding:\n"""\n${textbookExcerpt.slice(0, 2200)}\n"""`
      : '',
  ]
    .filter(Boolean)
    .join('\n\n');

  try {
    let parsed;

    if (provider === 'ollama') {
      const targetModel = model || OLLAMA_MODEL;
      const r = await fetch(`${OLLAMA_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: targetModel,
          format: 'json',
          stream: false,
          messages: [
            { role: 'system', content: buildSystemPrompt() },
            { role: 'user', content: userPrompt },
          ],
        }),
      });
      if (!r.ok) {
        const errText = await r.text();
        return res.status(502).json({
          error: `Ollama error (${r.status}): ${errText.slice(0, 300)}`,
        });
      }
      const data = await r.json();
      parsed = extractJson(data?.message?.content || '');
    } else {
      if (!GEMINI_API_KEY) {
        return res.status(400).json({
          error: 'GEMINI_API_KEY is not set in .env',
        });
      }
      const targetModel = model || GEMINI_MODEL;
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
        targetModel
      )}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;

      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: buildSystemPrompt() }] },
          contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.4,
          },
        }),
      });

      const data = await r.json();
      if (!r.ok) {
        const msg = data?.error?.message || JSON.stringify(data).slice(0, 300);
        return res.status(r.status).json({ error: `Gemini error: ${msg}` });
      }

      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      parsed = extractJson(text);
    }

    if (!parsed?.html) {
      return res.status(502).json({
        error: 'Generated response was missing the interactive HTML simulation.',
      });
    }

    res.json({
      title: parsed.title || prompt,
      subtitle: parsed.subtitle || 'AI-Generated Grade 9 Simulation',
      hotspots: Array.isArray(parsed.hotspots) ? parsed.hotspots : [],
      controls: Array.isArray(parsed.controls) ? parsed.controls : [],
      experiments: Array.isArray(parsed.experiments) ? parsed.experiments : [],
      html: parsed.html,
    });
  } catch (err) {
    res.status(500).json({
      error: err?.message || 'Failed to generate visualization.',
    });
  }
});

app.listen(PORT, () => {
  console.log(`AI Visualizer API listening on http://localhost:${PORT} (Gemini model: ${GEMINI_MODEL})`);
});
