

async function getFeedURLs() {
	const response = await fetch(process.env.FEED_URL)
	return await response.json()
}

module.exports = async function getFeed() {
	const fetch = (await import("node-fetch")).default
	const feedURLs = await getFeedURLs()
	const tags = []
	for(const item of feedURLs) {
		for(const tag of item.tags) {
			if(!tags.find(value => value.title === tag)) {
				tags.push({ title: tag, getSlug: function() { return this.slugify(tag) }, items: [] })
			}
		}
	}
	const response = await fetch(process.env.FEED_ITEMS_URL);
	const body = await response.json();
	const items = body.data.map(data => ({
		...data,
		tags: feedURLs.find(feed => feed.url === data.feedurl)?.tags || [],
		getSlug: function() {
			return `${data.id}-${this.slugify(data.title)}`.slice(0, 50)
		}
	}))
	for(const item of items) {
		for(const tag of item.tags) {
			const tagEntry = tags.find(value => value.title === tag)
			tagEntry.items.push(item)
		}
	}
	const content = items.filter(item => !item.tags.includes("external"))
	return { items, tags, content }
}
