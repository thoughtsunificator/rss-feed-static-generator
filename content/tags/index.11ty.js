const { JSDOM } = require("jsdom")

exports.data = {
	layout: "layouts/base.11ty.js",
	pagination: {
		data: "feed.tags",
		size: 1,
		alias: "tag"
	},
	permalink: function(data) { return `tags/${data.tag.getSlug.call(this)}.html` }
}

exports.render = function(data) {
	const virtualDOM = new JSDOM()
	const { document } = virtualDOM.window
	return `
		<b>${data.tag.title}</b>
		<div>Last update: <span class="date">${new Date(data.tag.lastPubDate * 1000).toISOString()}</span></div>
		${data.tag.items.map((rssItem, index) => {
			const div = document.createElement("div")
			const anchor = document.createElement("a")
			anchor.textContent = rssItem.title
			if(rssItem.tags.includes("external")) {
				anchor.href = rssItem.articleURL
				anchor.target = "_blank"
			} else {
				anchor.href = `/${rssItem.getSlug.call(this)}.html`
			}
			div.appendChild(anchor)
			return `${div.outerHTML}`
		}).join("")}

	`
}
