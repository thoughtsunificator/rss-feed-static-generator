exports.data = {
	eleventyExcludeFromCollections: true,
	permalink: "/feed.json",
	robots: {
		ignore: true
	}
}

exports.render = function(data) {
	return JSON.stringify({
		"version": "https://jsonfeed.org/version/1",
		"title": data.site.name,
		"home_page_url": data.site.url,
		"feed_url": data.site.url + "/feed.json",
		"description": data.site.description,
		"author": {
			"name": data.site.author.name,
			"url": data.site.url
		},
		"items": data.feed.items.filter(rssItem => !rssItem.tags.find(tag => data.tagIndexBlacklist.includes(tag))).map(rssItem => {
			const item = {
				"id": rssItem.id,
				"url": rssItem.tags.includes("external") ? rssItem.articleURL : `${data.site.url}/${rssItem.getSlug.call(this)}.html`,
				"articleURL": rssItem.articleURL,
				"title": rssItem.title,
				"updated": new Date(rssItem.pubDate * 1000).toISOString()
			}
			return item
		})
	})
}
