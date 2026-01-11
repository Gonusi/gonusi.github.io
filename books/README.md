# Books Directory

This directory contains book reviews and notes. Each book should be in its own subdirectory following this structure:

```
books/
  YYYY-MM/
    book-title-slug/
      index.md
      images/  (optional)
        cover.jpg
        ...
```

## Book Entry Format

Each book entry should be a markdown file (`index.md`) with front matter like this:

```markdown
---
title: Book Title
description: A brief description of the book
layout: layout.html
tags: ["books"]
date: YYYY-MM-DD
---

Your book review content here...
```

The `tags: ["books"]` is required for the book to appear in the books listing.
