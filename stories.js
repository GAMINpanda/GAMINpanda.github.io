(function () {
    const featuredEl = document.getElementById('wattpad-featured');
    const hubEl = document.getElementById('wattpad-hub');
    if (!featuredEl || !hubEl) return;

    const featuredId = featuredEl.dataset.featuredStoryId || '';
    const profileUrl = hubEl.dataset.profileUrl || '';

    fetch('stories.json', { cache: 'no-cache' })
        .then((r) => {
            if (!r.ok) throw new Error(`stories.json ${r.status}`);
            return r.json();
        })
        .then((data) => render(data))
        .catch((err) => {
            console.error('Failed to load stories.json', err);
            featuredEl.innerHTML = errorCard(profileUrl);
            hubEl.hidden = true;
        });

    function render(data) {
        const stories = Array.isArray(data.stories) ? data.stories : [];
        const featured = stories.find((s) => s.id === featuredId) || stories[0];
        const others = stories.filter((s) => s !== featured);

        if (!featured) {
            featuredEl.innerHTML = emptyCard(profileUrl);
        } else {
            featuredEl.innerHTML = featuredCard(featured);
        }

        if (others.length === 0) {
            hubEl.innerHTML = `
                <h2>More on Wattpad</h2>
                <p class="muted">Find everything else on my Wattpad profile.</p>
                <p><a class="btn btn-primary" href="${escape(profileUrl)}" target="_blank" rel="noopener noreferrer">Visit my Wattpad profile &rarr;</a></p>
            `;
        } else {
            hubEl.innerHTML = `
                <h2>More stories</h2>
                <p class="muted">Other work published on my Wattpad.</p>
                <ul class="story-cards">
                    ${others.map(storyCard).join('')}
                </ul>
                <p class="muted story-profile-link">
                    <a href="${escape(profileUrl)}" target="_blank" rel="noopener noreferrer">Visit my Wattpad profile &rarr;</a>
                </p>
            `;
        }
    }

    function featuredCard(s) {
        const tags = (s.tags || []).map((t) => `<li>#${escape(t)}</li>`).join('');
        const stats = [
            formatStat(s.readCount, 'read', 'reads'),
            formatStat(s.voteCount, 'vote', 'votes'),
            formatStat(s.numParts, 'part', 'parts'),
        ]
            .filter(Boolean)
            .join(' &middot; ');
        const status = s.completed ? 'Complete' : 'Ongoing';
        return `
            <h2>Featured Story</h2>
            <div class="wattpad-featured-card">
                <a class="wattpad-cover-link" href="${escape(s.url)}" target="_blank" rel="noopener noreferrer">
                    <img class="wattpad-cover" src="${escape(s.cover)}" alt="Cover of ${escape(s.title)}" loading="lazy" />
                </a>
                <div class="wattpad-body">
                    <h3 class="wattpad-title"><a href="${escape(s.url)}" target="_blank" rel="noopener noreferrer">${escape(s.title)}</a></h3>
                    <p class="wattpad-meta"><span class="wattpad-status">${status}</span> &middot; ${stats}</p>
                    ${s.description ? `<p class="wattpad-desc">${escape(s.description)}</p>` : ''}
                    ${tags ? `<ul class="wattpad-tags">${tags}</ul>` : ''}
                    <p><a class="btn btn-primary" href="${escape(s.url)}" target="_blank" rel="noopener noreferrer">Read on Wattpad &rarr;</a></p>
                </div>
            </div>
        `;
    }

    function storyCard(s) {
        const stats = [
            formatStat(s.numParts, 'part', 'parts'),
            formatStat(s.readCount, 'read', 'reads'),
        ]
            .filter(Boolean)
            .join(' &middot; ');
        return `
            <li class="story-card">
                <a href="${escape(s.url)}" target="_blank" rel="noopener noreferrer">
                    <img class="story-card-cover" src="${escape(s.cover)}" alt="" loading="lazy" />
                    <div class="story-card-body">
                        <h4>${escape(s.title)}</h4>
                        ${stats ? `<p class="wattpad-meta">${stats}</p>` : ''}
                        ${s.description ? `<p class="story-card-desc">${escape(s.description)}</p>` : ''}
                    </div>
                </a>
            </li>
        `;
    }

    function emptyCard(url) {
        return `
            <h2>Featured Story</h2>
            <p class="muted">No stories published yet.</p>
            <p><a class="btn btn-primary" href="${escape(url)}" target="_blank" rel="noopener noreferrer">Visit my Wattpad profile &rarr;</a></p>
        `;
    }

    function errorCard(url) {
        return `
            <h2>Featured Story</h2>
            <p class="muted">Couldn't load the story list right now.</p>
            <p><a class="btn btn-primary" href="${escape(url)}" target="_blank" rel="noopener noreferrer">Visit my Wattpad profile &rarr;</a></p>
        `;
    }

    function formatStat(n, singular, plural) {
        if (!Number.isFinite(n) || n < 0) return '';
        const label = n === 1 ? singular : plural;
        return `${formatNumber(n)} ${label}`;
    }

    function formatNumber(n) {
        if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
        if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
        return String(n);
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
