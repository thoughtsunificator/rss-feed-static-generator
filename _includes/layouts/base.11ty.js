exports.render = function(data) {
	let pageTitle
	if(data.rssItem) {
		pageTitle = data.rssItem.title
	} else if(data.tag) {
		pageTitle = data.tag.title
	}
	return `<!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>${ pageTitle || data.metadata.title }</title>
		<link rel="icon" href="favicon.png" />
		<link rel="stylesheet" href="/a11y-dark.css">
		<style>
		body {
			margin: 5px;
			padding: 0;
			display: grid;
			height: 100vh;
			grid-template-rows: auto 1fr auto;
		}
		main {
			word-break: break-word;
		}
		main img, main video {
			max-width: 100%;
			height: auto;
		}
		code, pre {
			white-space: break-spaces !important;
		}
		footer {
			padding-top: 20px;
			padding-bottom: 10px;
			text-align: center;
		}
		nav {
			text-align: center;
		}

		@media (prefers-color-scheme: dark) {
			body { background-color: #2d2d2d; color: white; }
			a { color: #6eaec8; }
			.feed-entry h3 a:visited { color: gray; }
		}
		</style>
	</head>
	<body>
		<nav style="display: flex; gap: 10px; margin-bottom: 20px; position: sticky; font-size: 1.5em;">
			<a href="/">Home</a>
			<a href="/tags">Tags</a>
			<a href="/urls">URLs</a>
		</nav>
		<main>${data.content}</main>
		<footer><a target="_blank" href="https://github.com/thoughtsunificator/rss-feed-static-generator">Source code</a></footer>
		<script src="/highlight.min.js"></script>
		<script>hljs.highlightAll();</script>
	</body>
</html>`
}
