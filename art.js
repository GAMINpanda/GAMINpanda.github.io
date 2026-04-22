(function () {
    const grid = document.querySelector('.art-grid');
    if (!grid) return;

    fetch('art.json', { cache: 'no-cache' })
        .then((r) => {
            if (!r.ok) throw new Error(`art.json ${r.status}`);
            return r.json();
        })
        .then(render)
        .catch((err) => {
            console.error('Failed to load art.json', err);
            grid.innerHTML = '<p class="muted">Could not load gallery.</p>';
        });

    function render(data) {
        const photos = Array.isArray(data.photos) ? data.photos : [];
        if (!photos.length) {
            const url = escape(data.album_url || '');
            grid.innerHTML = `<p class="muted">No art yet. <a href="${url}" target="_blank" rel="noopener noreferrer">See the Flickr album &rarr;</a></p>`;
            return;
        }
        grid.innerHTML = photos
            .map((p) => {
                const title = humanize(p.title);
                const thumb = `${p.base}_n.jpg`;
                const full = `${p.base}_b.jpg`;
                return `<img class="art-img" src="${escape(thumb)}" data-full-src="${escape(full)}" alt="${escape(title)}" loading="lazy" />`;
            })
            .join('');
    }

    function humanize(title) {
        return String(title ?? '').replace(/_/g, ' ').trim();
    }

    function escape(s) {
        return String(s ?? '').replace(/[&<>"']/g, (c) => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
        }[c]));
    }
})();
