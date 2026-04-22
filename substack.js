const SUBSTACK_FEED_URL = 'https://alexandermitchiner.substack.com/feed';
const FALLBACK_SUBSTACK_PAGE = 'https://substack.com/@alexandermitchiner';

async function loadSubstackPosts() {
    const status = document.getElementById('article-status');
    const list = document.getElementById('article-list');

    try {
        const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(SUBSTACK_FEED_URL)}`;
        const response = await fetch(proxyUrl);

        if (!response.ok) {
            throw new Error(`Could not fetch feed (status ${response.status}).`);
        }

        const data = await response.json();
        const posts = (data.items || []).slice(0, 6);

        if (posts.length === 0) {
            throw new Error('No posts found in feed.');
        }

        list.innerHTML = posts
            .map((post) => {
                const date = new Date(post.pubDate);
                const dateLabel = Number.isNaN(date.getTime())
                    ? 'Date unavailable'
                    : date.toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    });

                return `
                    <li>
                        <h3><a href="${post.link}" target="_blank" rel="noopener noreferrer">${post.title}</a></h3>
                        <time datetime="${post.pubDate}">${dateLabel}</time>
                    </li>
                `;
            })
            .join('');

        status.textContent = 'Latest posts loaded automatically from Substack.';
    } catch (error) {
        console.error(error);
        status.innerHTML = `Couldn't load posts automatically right now. <a href="${FALLBACK_SUBSTACK_PAGE}" target="_blank" rel="noopener noreferrer">Visit Substack directly</a>.`;
    }
}

loadSubstackPosts();
