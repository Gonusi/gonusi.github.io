const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
module.exports = function (eleventyConfig) {
	eleventyConfig.addPlugin(syntaxHighlight);
	eleventyConfig.addPassthroughCopy("css");
	eleventyConfig.addPassthroughCopy("assets");
	eleventyConfig.addPassthroughCopy("posts/**/images/**");
	eleventyConfig.addPassthroughCopy("books/**/images/**");
	eleventyConfig.addPassthroughCopy("books/**/*.jpeg");
	eleventyConfig.addPassthroughCopy("books/**/*.jpg");


	return {
		passthroughFileCopy: true,
	};
};
