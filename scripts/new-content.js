#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const today = new Date();
const yearMonth = today.toISOString().slice(0, 7); // YYYY-MM
const dateStr = today.toISOString().slice(0, 10); // YYYY-MM-DD

const type = process.argv[2];
const slug = process.argv[3] || "new-entry";

const roots = {
  til: "til",
  post: "posts",
  book: "books",
};

const frontmatter = {
  til: `---
title: 
description: 
layout: layout.html
tags: ["til"]
date: ${dateStr}
---
`,

  post: `---
title: 
description: 
layout: layout.html
tags: []
date: ${dateStr}
---
`,

  book: `---
title: 
author: 
ISBN: 
year: 
description: 
layout: layout.html
tags: []
date: ${dateStr}
score: 
---
`,
};

if (!type || !roots[type]) {
  console.error("Usage: node new-content.js <til|post|book> [slug]");
  process.exit(1);
}

const root = roots[type];
const dir = path.join(process.cwd(), root, yearMonth, slug);
const filePath = path.join(dir, "index.md");

if (fs.existsSync(filePath)) {
  console.error(`File already exists: ${filePath}`);
  process.exit(1);
}

fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(filePath, frontmatter[type], "utf8");

console.log(`Created ${type}: ${filePath}`);
