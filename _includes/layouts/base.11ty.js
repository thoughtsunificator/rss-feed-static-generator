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
		<!-- Prevent, to some degree, the execution of inline JavaScript, as well as blocking all plugin content  -->
		<meta http-equiv="Content-Security-Policy" content="script-src 'none'; object-src 'none'; img-src 'none'; font-src 'none'; media-src 'none'; worker-src 'none'; connect-src 'none'; style-src 'self' ">
		<title>${ pageTitle || data.metadata.title }</title>
		<link rel="icon" href="favicon.png" />
		<link rel="stylesheet" href="/a11y-dark.css">
		<link rel="stylesheet" href="/style.css">
	</head>
	<body>
		<nav>
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
