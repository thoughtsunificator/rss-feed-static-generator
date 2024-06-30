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
	return `
		<h3 style="flex-grow: 1;">${data.rssItem.title}</h3>
		<div>${document.body.innerHTML}</div>
		<a target="_blank" href="${data.rssItem.url}">Go to article URL</a>
		<div>Feed URL: ${new URL(data.rssItem.feedurl)}</div>
	`
}
