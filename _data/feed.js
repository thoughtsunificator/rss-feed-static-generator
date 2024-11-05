/**
 * FEED_ITEMS_URL = list of feed (urls and their contents)
 * FEED_URL = list of feed URLs and their associated tags ([{ url: "", tags: ["foo", "bar"] }])
 */

async function getFeedURLs() {
	const response = await fetch(process.env.FEED_URL)
	return await response.json()
}

module.exports = async function() {
	/**
	 * Eleventy obliges... Requires are not supported outsides methods.
	 */
	const fetch = (await import("node-fetch")).default
	/**
	 * Retrieve the list of feed URLs and their associated tags ({ url: "", tags: ["foo", "bar"] }).
	 */
	const feedURLs = await getFeedURLs()
	/**
	 * Create a list of unique tags from the feed URLs
	 */
	const tags = []
	for(const item of feedURLs) {
		for(const tag of item.tags) {2
			if(!tags.find(value => value.title === tag)) {
				tags.push({ title: tag, getSlug: function() { return this.slugify(tag) }, items: [] })
			}
		}
	}
	/**
	 * Create a list of unique feed urls
	 */
	const urls = []
	for(const item of feedURLs) {
		const feedURL = new URL(item.url)
		const title = feedURL.hostname + feedURL.pathname
		if(!urls.find(value => value.url === item.url)) {
			urls.push({ title, url: item.url, getSlug: function() { return this.slugify(title) }, items: [] })
		}
	}
	/**
	 * Retrieve all feeds
	 */
	const response = await fetch(process.env.FEED_ITEMS_URL)
	const body = await response.json()
	/**
	 * Map tags and url to feed
	 */
	const items = body.data.map(data => ({
		...data,
		tags: feedURLs.find(feed => feed.url === data.feedurl)?.tags || [],
		articleURL: data.url,
		url: urls.find(url => url.url === data.feedurl), // A feed item already has a feed url, but it still need an object for ease-of-use (slug and title mostly)
		getSlug: function() {
			return `${data.id}-${this.slugify(data.title)}`.slice(0, 50)
		}
	}))
	/**
	 * Add feed to the corresponding tags and urls feeds array
	 */
	for(const item of items) {
		for(const tag of item.tags) {
			const tagEntry = tags.find(value => value.title === tag)
			tagEntry.items.push(item)
		}
		if(item.url) {
			item.url.items.push(item)
		}
	}
	/**
	 * Add lastPubDate
	 */
	for(const tag of tags) {
		tag.lastPubDate = tag.items[0]?.pubDate || 0
	}
	for(const url of urls) {
		url.lastPubDate = url.items[0]?.pubDate || 0
	}
	/**
	 * Sort tags and urls by lastPubDate
	 */
	tags.sort((a, b) => b.lastPubDate - a.lastPubDate)
	urls.sort((a, b) => b.lastPubDate - a.lastPubDate)
	const content = items.filter(item => !item.tags.includes("external"))
	return { items, tags, urls, content }
}
