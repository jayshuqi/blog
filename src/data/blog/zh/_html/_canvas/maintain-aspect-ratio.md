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

在这种情况下，图片宽度刚好填满容器，上下会有空白（图片高度只有400px，而容器高600px）。 

### 场景2：高内容适应容器

现在假设我们有一个宽为500px、高为1000px的图片（宽高比为0.5），放入同样的800×600容器：

1. 内容宽高比(0.5) < 容器宽高比(1.33)，说明内容相对更高
2. 因此选择高度缩放因子：`fitScale = 600 / 1000 = 0.6`
3. 应用缩放后，图片尺寸变为：300px × 600px

在这种情况下，图片高度刚好填满容器，左右会有空白（图片宽度只有300px，而容器宽800px）。

## 为什么这个算法总是有效？

这个算法之所以有效，是因为它总是选择**较小的缩放因子**。这确保了：

1. **内容完全可见**：选择较小的缩放因子，确保内容的任何部分都不会超出容器
2. **保持宽高比**：同时按相同比例缩放宽度和高度，维持原始形状
3. **最大化利用空间**：在满足上述两个条件的前提下，尽可能让内容填充容器

## 实际应用场景

这个简单的算法在各种应用中被广泛使用：

- **图片浏览器**：显示不同尺寸的图片
- **PDF阅读器**：适配不同纸张大小的页面
- **视频播放器**：处理不同宽高比的视频
- **响应式设计**：调整UI元素以适应不同屏幕尺寸
- **打印预览**：显示如何在纸张上布局内容

## 代码实现示例

让我们扩展一下最初的例子，提供一个完整的缩放实现：

```javascript
function fitContentToContainer(content, container) {
    const contentRatio = content.width / content.height;
    const containerRatio = container.width / container.height;
    
    let scale, newWidth, newHeight;
    
    if (contentRatio > containerRatio) {
        // 内容较宽，以容器宽度为基准
        scale = container.width / content.width;
        newWidth = container.width;
        newHeight = content.height * scale;
    } else {
        // 内容较高，以容器高度为基准
        scale = container.height / content.height;
        newHeight = container.height;
        newWidth = content.width * scale;
    }
    
    // 计算内容在容器中的居中位置
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

// 使用示例
const result = fitContentToContainer(
    { width: 1000, height: 500 },  // 内容尺寸
    { width: 800, height: 600 }    // 容器尺寸
);

console.log(result);
// 输出: { width: 800, height: 400, left: 0, top: 100, scale: 0.8 }
```

## 算法变体：Fill模式

我们讨论的是"Fit"模式，确保内容完全显示。另一种常见变体是"Fill"模式，它确保容器完全填满，可能会裁剪内容的一部分：

```javascript
function fillContainerWithContent(content, container) {
    const contentRatio = content.width / content.height;
    const containerRatio = container.width / container.height;
    
    let scale, newWidth, newHeight;
    
    if (contentRatio > containerRatio) {
        // 内容较宽，以容器高度为基准
        scale = container.height / content.height;
        newHeight = container.height;
        newWidth = content.width * scale;
    } else {
        // 内容较高，以容器宽度为基准
        scale = container.width / content.width;
        newWidth = container.width;
        newHeight = content.height * scale;
    }
    
    // 计算内容在容器中的居中位置
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

注意"Fill"模式与"Fit"模式的条件判断正好相反。

## 总结

这个看似简单的缩放算法隐藏着优雅的数学原理。通过比较内容和容器的宽高比，我们可以智能地决定以宽度还是高度为基准进行缩放，从而实现内容在保持原始比例的同时最大化利用容器空间。


