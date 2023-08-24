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
		<h2>${data.tag.title}</h2>
		${data.tag.items.map((rssItem, index) => {
			const h2 = document.createElement("h2")
			const anchor = document.createElement("a")
			anchor.textContent = rssItem.title
			if(rssItem.tags.includes("external")) {
				anchor.href = rssItem.url
				anchor.target = "_blank"
			} else {
				anchor.href = `/${rssItem.getSlug.call(this)}.html`
			}
			h2.appendChild(anchor)
			return `${h2.outerHTML}`
		}).join("")}

	`
}
