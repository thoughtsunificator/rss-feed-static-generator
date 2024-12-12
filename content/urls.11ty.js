exports.data = {
	layout: "layouts/base.11ty.js",
	permalink: "urls.html"
}

exports.render = function(data) {
	return `
		${data.feed.urls.map((url) => {
			return `<div class="url"><a href="/urls/${url.getSlug.call(this)}.html">${url.title}</a></div>`
		}).join("")}
	`
}
