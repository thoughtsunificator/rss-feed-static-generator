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


const DAY_MILLISECONDS = 1000 * 60 * 60 * 24;
function getRelativeTime(timestamp) {
  const rtf = new Intl.RelativeTimeFormat('en', {
		numeric: "auto", // other values: "auto"
		style: "narrow", // other values: "short" or "narrow"
  });
  const daysDifference = Math.round((timestamp - new Date().getTime()) / DAY_MILLISECONDS);
  return rtf.format(daysDifference, 'day');
}

exports.render = function(data) {
	const virtualDOM = new JSDOM()
	const { document } = virtualDOM.window
	return `
		<style>

			.feed-entry h3 {
				flex-grow: 1;
			}
		</style>
		${data.feedItems.filter(rssItem => !rssItem.tags.find(tag => data.tagIndexBlacklist.includes(tag))).map(rssItem => {
			const h3 = document.createElement("h3")
			const anchor = document.createElement("a")
			anchor.textContent = rssItem.title
			if(rssItem.tags.includes("external")) {
				anchor.href = rssItem.url
				anchor.target = "_blank"
			} else {
				anchor.href = `/${rssItem.getSlug.call(this)}.html`
			}
			h3.appendChild(anchor)
			return `
			<div class="feed-entry">
			<div><span>${getRelativeTime(new Date(rssItem.pubDate * 1000).getTime())}</span></div>
				<small>${new URL(rssItem.feedurl)}</small>
				<div>${rssItem.tags.map(tag => ` <a${tag == "source" ? ' style="font-weight: bold"' : ""} href="/tags/${this.slugify(tag)}.html">${tag}</a>`).join(" | ") }</div>
				${h3.outerHTML}
			</div><hr>`

		}).join("")}
		<nav style="display: flex; gap: 10px; flex-flow: wrap">
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
