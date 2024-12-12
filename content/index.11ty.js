const { JSDOM } = require("jsdom")

exports.data = {
	layout: "layouts/base.11ty.js",
	// permalink: "index.html",
	pagination: {
		data: "feed.items",
		size: 15,
		alias: "feedItems"
	},
	permalink: function(data) {
		if(data.pagination.pageNumber > 0) {
			return `index-${data.pagination.pageNumber + 1}.html`
		}
		else {
			return "index.html"
		}
	}
}


// const DAY_MILLISECONDS = 1000 * 60 * 60 * 24;
// function getRelativeTime(timestamp) {
//   const rtf = new Intl.RelativeTimeFormat('en', {
// 		numeric: "auto", // other values: "auto"
// 		style: "narrow", // other values: "short" or "narrow"
//   });
//   const daysDifference = Math.round((timestamp - new Date().getTime()) / DAY_MILLISECONDS);
//   return rtf.format(daysDifference, 'day');
// }

exports.render = function(data) {
	const virtualDOM = new JSDOM()
	const { document } = virtualDOM.window
	return `
		<div id="feed-entries">
		${data.feedItems.filter(rssItem => !rssItem.tags.find(tag => data.tagIndexBlacklist.includes(tag))).map(rssItem => {
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
			const feedURL = new URL(rssItem.feedurl)
			const pubDate = new Date(rssItem.pubDate * 1000)
			return `
			<div class="feed-entry">
			<div class="feed-meta">
				<div><b><time datetime=${pubDate.toISOString()}>${new Intl.DateTimeFormat('en-GB', { month: "long", day: 'numeric' , year: 'numeric',}).format(pubDate)}</time></b></div>
			</div>
			${div.outerHTML}
			</div>`

		}).join("")}
		</div>
		<nav>
			${[...Array(data.pagination.pages.length).keys()].map(function(item) {
				if(data.pagination.pageNumber === item) {
					return `<b>Page ${item + 1}</b>`;
				} else  if(item > 0) {
					return `<a href="/index-${item + 1}.html">Page ${item + 1}</a>`;
				} else {
					return `<a href="/index.html">Page ${item + 1}</a>`;
				}
				}).join("")
			}
		</nav>
		`;
};
