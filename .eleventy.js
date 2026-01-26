const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
module.exports = function (eleventyConfig) {
	eleventyConfig.addPlugin(syntaxHighlight);
	eleventyConfig.addPassthroughCopy("css");
	eleventyConfig.addPassthroughCopy("assets");
	eleventyConfig.addPassthroughCopy("posts/**/images/**");
	eleventyConfig.addPassthroughCopy("books/**/images/**");
	eleventyConfig.addPassthroughCopy("books/**/*.jpeg");
	eleventyConfig.addPassthroughCopy("books/**/*.jpg");
	eleventyConfig.addPassthroughCopy("books/**/*.png");
	eleventyConfig.addPassthroughCopy("til/**/images/**");
	eleventyConfig.addPassthroughCopy("til/**/*.jpeg");
	eleventyConfig.addPassthroughCopy("til/**/*.jpg");
	eleventyConfig.addPassthroughCopy("til/**/*.png");
	eleventyConfig.addPassthroughCopy("posts/**/*.jpeg");
	eleventyConfig.addPassthroughCopy("posts/**/*.jpg");
	eleventyConfig.addPassthroughCopy("posts/**/*.png");


	return {
		passthroughFileCopy: true,
	};
};
