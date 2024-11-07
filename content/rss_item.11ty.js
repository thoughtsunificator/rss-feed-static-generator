const { JSDOM } = require("jsdom")
const Prism = require('prismjs');

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
	const virtualDOM = new JSDOM()
	const { document } = virtualDOM.window
	document.body.innerHTML = data.rssItem.content
	const treeWalker = document.createTreeWalker(
		document.body,
		0x1,
	)
	const nodesToRemoves = []
	while (treeWalker.nextNode()) {
		const node = treeWalker.currentNode;
		node.removeAttribute("style")
		if(["script","style", "iframe", "embed", "object", "img"].includes(node.tagName.toLowerCase())) {
			nodesToRemoves.push(node)
		} else if(node.tagName === "A") {
			node.setAttribute("rel", "noreferrer")
			node.setAttribute("target", "_blank")
		}
	}
	for(const nodesToRemove of nodesToRemoves.slice()) {
		nodesToRemove.remove()
	}
	const h1 = document.createElement("h1")
	h1.style = "flex-grow: 1"
	h1.textContent = data.rssItem.title
	return `
		${h1.outerHTML}
		<div class="date"><b>${new Date(data.rssItem.pubDate * 1000).toISOString()}</b></div>
		<small>${data.rssItem.url ? `<a href="/urls/${data.rssItem.url.getSlug.call(this)}">${data.rssItem.url.title}</a>` : `${feedURL.hostname + feedURL.pathname}`}</small>
		<div>${data.rssItem.tags.map(tag => ` <a${tag == "source" ? ' style="font-weight: bold"' : ""} href="/tags/${this.slugify(tag)}.html">${tag}</a>`).join(" | ") }</div>
		<br>
		<a target="_blank" rel="noreferrer" href="${data.rssItem.articleURL}">Go to article URL</a>
		<div style="border: 1px solid black; border-left: 0; border-right: 0; margin: 20px 0px;"><p></p>${document.body.innerHTML}<p></p></div>
	`
}
