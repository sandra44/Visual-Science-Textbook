import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

const index = JSON.parse(await readFile(new URL('../public/data/textbook-index.json', import.meta.url)));
const vite = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' });
try {
  const { bookVisual } = await vite.ssrLoadModule('/src/simulations/bookVisuals.ts');
  const { topicStories } = await vite.ssrLoadModule('/src/simulations/topicStories.ts');
  const { TopicScene } = await vite.ssrLoadModule('/src/components/TopicScene.tsx');
  const tested = new Set();
  for (const topic of index.orderedPages.flatMap(page => page.topics)) {
    const visual = bookVisual(topic.curatedSimId, topic.number);
    assert.ok(visual, `No visual for ${topic.id}`);
    if (!visual.film?.startsWith('topic:')) continue;
    const number = topic.number, story = topicStories[number];
    for (const flat of [true, false]) {
      const frames = [0, .28, .72, 1].map(p => renderToStaticMarkup(createElement(TopicScene, { number, story, flat, p })));
      assert.ok(frames.every(html => html.includes('<svg') && !/NaN|Infinity|class="lucide/.test(html)), `Invalid illustration: ${number}`);
      assert.ok(new Set(frames).size > 1, `No change during playback: ${number}`);
    }
    tested.add(number);
  }
  assert.equal(tested.size, Object.keys(topicStories).length, 'Not every authored topic is reachable');
  console.log(`Rendered ${tested.size} topic illustrations in both views; all indexed headings have a visual.`);
} finally {
  await vite.close();
}
