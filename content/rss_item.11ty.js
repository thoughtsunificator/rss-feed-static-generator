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
		<h2 style="flex-grow: 1">${data.rssItem.title}</h2>
		<div style="width: 50vw;background-color: #131313;padding: 20px;margin: 20px;">${data.rssItem.content}</div>
		<a target="_blank" href="${data.rssItem.url}">Go to article URL</a>
		<div>Feed URL: ${new URL(data.rssItem.feedurl)}</div>
	`
}
