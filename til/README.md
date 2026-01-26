# TIL Directory

This directory contains "Today I Learned" posts. Each TIL entry should be in its own subdirectory following this structure:

```
til/
  YYYY-MM/
    til-title-slug/
      index.md
      images/  (optional)
        image.jpg
        ...
```

## TIL Entry Format

Each TIL entry should be a markdown file (`index.md`) with front matter like this:

```markdown
---
title: What I Learned Today
description: A brief description of what was learned
layout: layout.html
tags: ["til"]
date: YYYY-MM-DD
---

Your TIL content here...
```

The `tags: ["til"]` is required for the TIL to appear in the TIL listing.
