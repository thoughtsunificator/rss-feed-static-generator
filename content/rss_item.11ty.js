exports.data = {
	layout: "layouts/base.11ty.js",
	pagination: {
		data: "feed.content",
		size: 1,
		alias: "rssItem"
	},
	permalink: function(data) { return `${data.rssItem.getSlug.call(this)}.html` }
}

exports.render = function(data) {
	return `
		<div style="display: flex;place-items: center;flex-wrap: wrap;">
		<h2 style="flex-grow: 1">${data.rssItem.title}</h2>
		<a target="_blank" href="${data.rssItem.url}">Go to feed URL</a>
		</div>
		<div>Feed URL: ${new URL(data.rssItem.feedurl)}</div>
		<div style="white-space: break-spaces;font-size: 20px;">${data.rssItem.content}</div>
	`
}
