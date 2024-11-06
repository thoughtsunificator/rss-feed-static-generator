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
		<h3>${data.tag.title}</h3>
		Last update: ${new Date(data.tag.lastPubDate * 1000).toISOString()}
		${data.tag.items.map((rssItem, index) => {
			const h3 = document.createElement("h3")
			const anchor = document.createElement("a")
			anchor.textContent = rssItem.title
			if(rssItem.tags.includes("external")) {
				anchor.href = rssItem.articleURL
				anchor.target = "_blank"
			} else {
				anchor.href = `/${rssItem.getSlug.call(this)}.html`
			}
			h3.appendChild(anchor)
			return `${h3.outerHTML}`
		}).join("")}

	`
}
