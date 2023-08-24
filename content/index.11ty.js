const { JSDOM } = require("jsdom")

exports.data = {
	layout: "layouts/base.11ty.js",
	permalink: "index.html"
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
			.feed-entry {
				display: flex;
				align-items: center;
				column-gap: 20px;
				flex-wrap: wrap;
			}

			.feed-entry h2 {
				flex-grow: 1;
			}
		</style>
		${data.feed.items.filter(rssItem => !rssItem.tags.find(tag => data.tagIndexBlacklist.includes(tag))).map(rssItem => {
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
			return `
			<div class="feed-entry">${h2.outerHTML}
				<small>${new URL(rssItem.feedurl)}</small>
				<div><span>${getRelativeTime(new Date(rssItem.pubDate * 1000).getTime())}</span></div>
				<div>${rssItem.tags.map(tag => ` <a href="/tags/${this.slugify(tag)}.html">${tag}</a>`).join(" | ") }</div>
			</div>`
		}).join("")}
		`;
};
