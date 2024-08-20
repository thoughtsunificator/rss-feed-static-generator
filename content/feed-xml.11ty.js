const { JSDOM } = require("jsdom")
const virtualDOM = new JSDOM()
const { document } = virtualDOM.window

exports.data = {
	eleventyExcludeFromCollections: true,
	permalink: "/feed.xml",
	robots: {
		ignore: true
	}
}

exports.render = function(data) {
	return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
	<title>${ data.site.name }</title>
	<subtitle>${ data.site.description }</subtitle>
	<link href="${data.site.url}/feed.xml" rel="self"/>
	<link href="${data.site.url}"/>
	<id>${data.site.feed.id}</id>
	<author>
		<name>${data.site.author.name}</name>
	</author>
	${data.feed.items.filter(rssItem => !rssItem.tags.find(tag => data.tagIndexBlacklist.includes(tag))).map(rssItem => {
		document.body.textContent = rssItem.title
		return `<entry>
			<id>${rssItem.id}</id>
			<link href="${data.site.url}/${rssItem.getSlug.call(this)}.html"/>
			<title>${ document.body.innerHTML }</title>
			<updated>${new Date(rssItem.pubDate * 1000).toISOString()}</updated>
		</entry>`
	}).join("")}
</feed>`
}
