---
pubDatetime: 2022-09-23T15:22:00Z
modDatetime: 2025-03-22T06:25:46.734Z
title: Maintain aspect ratio
slug: aspect-ratio
featured: false
draft: false
tags:
  - javascript
  - aspect-ratio
description:
  Some rules & recommendations for creating or adding new posts using AstroPaper
  theme.
---

# Maintain aspect ratio: Mathematical principles and implementation of image scaling algorithms

In web and application development, we often need to fit content of different sizes(such as image, video or pdf) into fixed size container.
We will talk about this in the following content.

## Problem

Image the scenario: you want to display various sizes in an 800 x 600 pixel container. Some images are 100 x 500, some are 500 x 1000. 

Here's the question：
- How to ensure that image can be fully displayed in the container without cropping?
- How to maintain the aspect ratio of image?
- How to display the image as large as possible?

## Solution

The solution to the problem is simple.

```javascript
let fitScale;
if (pageWidth / pageHeight > containerWidth / containerHeight) {
    fitScale = containerWidth / pageWidth;
} else {
    fitScale = containerHeight / pageHeight;
}
```

## Analysis

### Aspect Ratio

Firstly, we need to know: aspect ratio = width / height. The larger the value, the wider the shape; The smaller the value,
the higher the shape.

For example:
- 16:9, aspect ratio approximately 1.78
- 4:3, aspect ratio approximately 1.33
- 1:1, aspect ratio approximately 1.0

### Scale Factor

We can calculate two possible scaling factors:
- Width scaling factor = container width/content width
- Height scaling factor = container height/content height

These two scaling factors represent:
-If we only considering the width, the scaling multiple of the content
-If we only considering the height, the scaling multiple of the content

### Judgement

The key is a simple judgement:

```javascript
if (pageWidth / pageHeight > containerWidth / containerHeight)
```

This condition compares the aspect ratio of the content with the aspect ratio of the container:
- When the aspect ratio of the content is greater than that of the container, it means that the content is wider
- When the aspect ratio of the content is smaller than that of the container, it means that the content is higher

## Example

### Wide image

Assuming we have an image with 1000px width and 500px height. We want to display it in a 800x600 container.

1. Aspect ratio of content (2.0) is bigger than that of the container (1.33), thus the content is wider.
2. Therefore, fitScale should be `800 / 1000 = 0.8`.
3. Applying this scale, the size of the image should be 800px x 400px

In this case, the image width exactly fills the container, and there will be blank space above and below (the image height is only 400px, while the container height is 600px).

### Scenario 2: Tall content fitting the container

Now suppose we have an image with a width of 500px and a height of 1000px (aspect ratio of 0.5), placed in the same 800×600 container:

1. Content aspect ratio (0.5) < container aspect ratio (1.33), indicating the content is relatively taller
2. Therefore, choose the height scaling factor: `fitScale = 600 / 1000 = 0.6`
3. After applying the scaling, the image size becomes: 300px × 600px

In this case, the image height exactly fills the container, and there will be blank space on the left and right (the image width is only 300px, while the container width is 800px).

## Why does this algorithm always work?

This algorithm works because it always selects the **smaller scaling factor**. This ensures:

1. **Content is fully visible**: By choosing the smaller scaling factor, we ensure that no part of the content will exceed the container
2. **Maintain aspect ratio**: Scaling both width and height by the same proportion maintains the original shape
3. **Maximize space utilization**: Under the premise of meeting the above two conditions, try to fill the container with content as much as possible

## Practical application scenarios

This simple algorithm is widely used in various applications:

- **Image browsers**: Display images of different sizes
- **PDF readers**: Adapt pages of different paper sizes
- **Video players**: Handle videos with different aspect ratios
- **Responsive design**: Adjust UI elements to fit different screen sizes
- **Print preview**: Show how content is laid out on paper

## Code implementation example

Let's extend the original example to provide a complete scaling implementation:

```javascript
function fitContentToContainer(content, container) {
    const contentRatio = content.width / content.height;
    const containerRatio = container.width / container.height;
    
    let scale, newWidth, newHeight;
    
    if (contentRatio > containerRatio) {
        // Content is wider, use container width as the base
        scale = container.width / content.width;
        newWidth = container.width;
        newHeight = content.height * scale;
    } else {
        // Content is taller, use container height as the base
        scale = container.height / content.height;
        newHeight = container.height;
        newWidth = content.width * scale;
    }
    
    // Calculate the centered position of content in the container
    const left = (container.width - newWidth) / 2;
    const top = (container.height - newHeight) / 2;
    
    return {
        width: newWidth,
        height: newHeight,
        left: left,
        top: top,
        scale: scale
    };
}

// Usage example
const result = fitContentToContainer(
    { width: 1000, height: 500 },  // Content dimensions
    { width: 800, height: 600 }    // Container dimensions
);

console.log(result);
// Output: { width: 800, height: 400, left: 0, top: 100, scale: 0.8 }
```

## Algorithm variant: Fill mode

We discussed the "Fit" mode, which ensures the content is fully displayed. Another common variant is the "Fill" mode, which ensures the container is completely filled, potentially cropping part of the content:

```javascript
function fillContainerWithContent(content, container) {
    const contentRatio = content.width / content.height;
    const containerRatio = container.width / container.height;
    
    let scale, newWidth, newHeight;
    
    if (contentRatio > containerRatio) {
        // Content is wider, use container height as the base
        scale = container.height / content.height;
        newHeight = container.height;
        newWidth = content.width * scale;
    } else {
        // Content is taller, use container width as the base
        scale = container.width / content.width;
        newWidth = container.width;
        newHeight = content.height * scale;
    }
    
    // Calculate the centered position of content in the container
    const left = (container.width - newWidth) / 2;
    const top = (container.height - newHeight) / 2;
    
    return {
        width: newWidth,
        height: newHeight,
        left: left,
        top: top,
        scale: scale
    };
}
```

Note that the condition judgment in "Fill" mode is exactly the opposite of "Fit" mode.

## Summary

This seemingly simple scaling algorithm hides elegant mathematical principles. By comparing the aspect ratios of content and container, we can intelligently decide whether to scale based on width or height, thereby achieving maximum utilization of container space while maintaining the original proportions of the content.


