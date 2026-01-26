#!/usr/bin/env node

const fs = require("fs/promises");
const path = require("path");
const sharp = require("sharp");

const ROOTS = ["til", "posts", "books"];
const EXTENSIONS = new Set([".jpg", ".jpeg", ".png"]);
const RESIZED_FLAG = ".resized"; // DANGER IF CHANGED WILL RE-PROCESS ALL IMAGES!!!
const MAX_WIDTH = 1024;
const MAX_HEIGHT = 800;
const JPEG_QUALITY = 70;
const PNG_QUALITY = 70;
const SKIP_DIRS = new Set(["node_modules", "_site", ".git"]);

function isResizable(filePath) {
	const parsed = path.parse(filePath);
	const ext = parsed.ext.toLowerCase();
	if (!EXTENSIONS.has(ext)) return false;
	if (parsed.name.includes(RESIZED_FLAG)) return false;
	return true;
}

function toResizedPath(filePath) {
	const parsed = path.parse(filePath);
	return path.join(parsed.dir, `${parsed.name}${RESIZED_FLAG}${parsed.ext}`);
}

async function moveOrCopy(sourcePath, destPath, preserveOriginals) {
	await fs.rm(destPath, { force: true });
	if (preserveOriginals) {
		await fs.copyFile(sourcePath, destPath);
		return;
	}
	await fs.rename(sourcePath, destPath);
}

async function resizeFile(filePath, preserveOriginals) {
	const resizedPath = toResizedPath(filePath);
	const metadata = await sharp(filePath).metadata();
	const width = metadata.width || 0;
	const height = metadata.height || 0;
	const needsResize = width > MAX_WIDTH || height > MAX_HEIGHT;
	const ext = path.extname(filePath).toLowerCase();

	if (!needsResize) {
		await moveOrCopy(filePath, resizedPath, preserveOriginals);
		console.log(
			`[images] ${preserveOriginals ? "copied" : "renamed"} (no resize needed) ${path.relative(
				process.cwd(),
				resizedPath
			)}`
		);
		return;
	}

	await fs.rm(resizedPath, { force: true });
	let pipeline = sharp(filePath).resize({
		width: MAX_WIDTH,
		height: MAX_HEIGHT,
		fit: "inside",
		withoutEnlargement: true,
	});

	if (ext === ".jpg" || ext === ".jpeg") {
		pipeline = pipeline.jpeg({ quality: JPEG_QUALITY });
	} else if (ext === ".png") {
		pipeline = pipeline.png({ quality: PNG_QUALITY });
	}

	await pipeline.toFile(resizedPath);
	if (!preserveOriginals) {
		await fs.unlink(filePath);
	}
	console.log(`[images] resized ${path.relative(process.cwd(), resizedPath)}`);
}

const processing = new Set();

async function processFile(filePath, preserveOriginals) {
	const absolutePath = path.resolve(filePath);
	if (!isResizable(absolutePath)) return;
	if (processing.has(absolutePath)) return;

	processing.add(absolutePath);
	try {
		await resizeFile(absolutePath, preserveOriginals);
	} catch (error) {
		console.error(`[images] failed ${absolutePath}`);
		console.error(error);
	} finally {
		processing.delete(absolutePath);
	}
}

async function walk(directory, preserveOriginals) {
	let entries;
	try {
		entries = await fs.readdir(directory, { withFileTypes: true });
	} catch (error) {
		if (error.code === "ENOENT") return;
		throw error;
	}

	for (const entry of entries) {
		const fullPath = path.join(directory, entry.name);
		if (entry.isDirectory()) {
			if (SKIP_DIRS.has(entry.name)) continue;
			await walk(fullPath, preserveOriginals);
			continue;
		}

		if (entry.isFile()) {
			await processFile(fullPath, preserveOriginals);
		}
	}
}

async function runOnce(preserveOriginals) {
	for (const root of ROOTS) {
		const rootPath = path.join(process.cwd(), root);
		await walk(rootPath, preserveOriginals);
	}
}

async function watch(preserveOriginals) {
	const chokidar = require("chokidar");
	const patterns = ROOTS.map((root) =>
		path.join(root, "**/*.{jpg,jpeg,png}")
	);

	const watcher = chokidar.watch(patterns, {
		ignored: /\.resized\./,
		ignoreInitial: true,
		awaitWriteFinish: {
			stabilityThreshold: 500,
			pollInterval: 100,
		},
	});

	watcher.on("add", (filePath) => processFile(filePath, preserveOriginals));
	watcher.on("change", (filePath) => processFile(filePath, preserveOriginals));

	console.log(`[images] watching ${ROOTS.join(", ")}`);
}

const shouldWatch = process.argv.includes("--watch");
const preserveOriginals = shouldWatch;

runOnce(preserveOriginals)
	.then(() => (shouldWatch ? watch(preserveOriginals) : undefined))
	.catch((error) => {
		console.error(error);
		process.exitCode = 1;
	});
