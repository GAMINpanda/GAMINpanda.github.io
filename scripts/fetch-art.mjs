#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';

const ALBUM_ID = '72177720333262404';
const USER_ID = '204478262@N05';
const FEED = `https://api.flickr.com/services/feeds/photoset.gne?set=${ALBUM_ID}&nsid=${encodeURIComponent(USER_ID)}&format=json&nojsoncallback=1`;
const ALBUM_URL = `https://www.flickr.com/photos/${USER_ID}/albums/${ALBUM_ID}/`;
const OUT = 'art.json';

const res = await fetch(FEED, {
    headers: {
        'User-Agent': 'gaminpanda-site/1.0 (+https://gaminpanda.github.io)',
        Accept: 'application/json',
    },
});

if (!res.ok) {
    throw new Error(`Flickr feed ${FEED} returned ${res.status} ${res.statusText}`);
}

const data = await res.json();
const items = Array.isArray(data.items) ? data.items : [];

const photos = items
    .map((it) => {
        const media = it?.media?.m ?? '';
        const base = media.replace(/_m\.jpg$/i, '');
        const idMatch = /\/photos\/[^/]+\/(\d+)/.exec(it?.link || '');
        return {
            id: idMatch ? idMatch[1] : '',
            title: it?.title ?? '',
            base,
            page: it?.link ?? '',
        };
    })
    .filter((p) => p.base && p.id);

const existing = await readFile(OUT, 'utf8')
    .then((t) => JSON.parse(t))
    .catch(() => null);

if (existing && JSON.stringify(existing.photos) === JSON.stringify(photos)) {
    console.log(`No art changes (${photos.length} photos).`);
    process.exit(0);
}

const payload = {
    updated: new Date().toISOString(),
    album_url: ALBUM_URL,
    photos,
};

await writeFile(OUT, JSON.stringify(payload, null, 2) + '\n');
console.log(`Wrote ${photos.length} photos to ${OUT}.`);
