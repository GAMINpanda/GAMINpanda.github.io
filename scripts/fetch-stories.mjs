#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';

const USERNAME = 'GAMIN_panda';
const API = `https://www.wattpad.com/api/v3/users/${USERNAME}/stories`;
const OUT = 'stories.json';

const res = await fetch(API, {
    headers: {
        'User-Agent': 'gaminpanda-site/1.0 (+https://gaminpanda.github.io)',
        Accept: 'application/json',
    },
});

if (!res.ok) {
    throw new Error(`Wattpad API ${API} returned ${res.status} ${res.statusText}`);
}

const data = await res.json();
const rawStories = Array.isArray(data.stories) ? data.stories : [];

const stories = rawStories
    .filter((s) => s && !s.deleted)
    .map((s) => ({
        id: String(s.id),
        title: s.title ?? '',
        description: s.description ?? '',
        cover: s.cover ?? '',
        url: s.url ?? '',
        tags: Array.isArray(s.tags) ? s.tags : [],
        numParts: Number.isFinite(s.numParts) ? s.numParts : 0,
        readCount: Number.isFinite(s.readCount) ? s.readCount : 0,
        voteCount: Number.isFinite(s.voteCount) ? s.voteCount : 0,
        completed: !!s.completed,
    }));

const existing = await readFile(OUT, 'utf8')
    .then((t) => JSON.parse(t))
    .catch(() => null);

if (existing && JSON.stringify(existing.stories) === JSON.stringify(stories)) {
    console.log(`No story changes (${stories.length} stories).`);
    process.exit(0);
}

const payload = {
    updated: new Date().toISOString(),
    username: USERNAME,
    stories,
};

await writeFile(OUT, JSON.stringify(payload, null, 2) + '\n');
console.log(`Wrote ${stories.length} stories to ${OUT}.`);
