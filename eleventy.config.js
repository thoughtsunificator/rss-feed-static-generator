require('dotenv').config()

module.exports = function(eleventyConfig) {
	eleventyConfig.addPassthroughCopy({
		"./public/": "/",
	});
	return {
		templateFormats: [
			"11ty.js",
		],
		markdownTemplateEngine: "11ty.js",
		htmlTemplateEngine: "11ty.js",
		dir: {
			input: "content",          // default: "."
			includes: "../_includes",  // default: "_includes"
			data: "../_data",          // default: "_data"
			output: "_site"
		},
		pathPrefix: "/",
	};
};
