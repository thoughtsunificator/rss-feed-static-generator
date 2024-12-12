exports.data = {
	layout: "layouts/base.11ty.js",
	permalink: "tags.html"
}

exports.render = function(data) {
	return `
		${data.feed.tags.map((tag) => {
			return `<div class="tag"><a href="/tags/${tag.getSlug.call(this)}.html">${tag.title}</a></div>`
		}).join("")}
	`
}
