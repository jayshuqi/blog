---
pubDatetime: 2022-09-23T15:22:00Z
modDatetime: 2025-03-22T06:25:46.734Z
title: How to Fix Blurry Canvas on High-Density Screens
slug: blurry-canvas
featured: false
draft: false
tags:
  - html
  - canvas
  - resolution
description:
  Some rules & recommendations for creating or adding new posts using AstroPaper
  theme.
---

## Problem:
On high-DPI devices, HTML5 Canvas elements often render blurry graphics. This happens because browsers automatically 
scale the Canvas to match the physical screen size, stretching its logical pixels and causing anti-aliasing artifacts.

## Solution:
To achieve crisp rendering, we need to align the Canvas's logical resolution with the device's physical resolution using
window.devicePixelRatio. Here's how it works:

1. Double the Canvas Resolution
Set canvas.width and canvas.height to your desired rendering size multiplied by devicePixelRatio. This creates a higher-resolution backing buffer.

```javascript
const scale = window.devicePixelRatio;
canvas.width = contentWidth * scale;  // Logical pixels (e.g., 800 * 2 = 1600)
canvas.height = contentHeight * scale;
```

2. Scale Down the Display Size
Use CSS to set the Canvas's visible size to your original target dimensions. This compresses the high-res buffer into a 
smaller physical space, maximizing pixel density.

```javascript
canvas.style.width = `${contentWidth}px`;  // Physical display (e.g., 800px)
canvas.style.height = `${contentHeight}px`;
```

Your graphics will now render at the device’s native resolution, eliminating blur and ensuring clear lines, text, and images.

