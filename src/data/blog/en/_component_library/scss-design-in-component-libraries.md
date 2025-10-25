---
pubDatetime: 2022-09-23T15:22:00Z
modDatetime: 2025-03-22T06:25:46.734Z
title: 组件库中的scss设计
slug: sass-design-in-component-libraries
featured: false
draft: true
tags:
  - component
  - scss
  - css
description:
  组件库中的sass设计
---

主要包括 BEM，基础的mixin和主题色变量的定义。

## BEM
组件库中的类名命名采用 BEM 方法，BEM 即 block-element--modifier，要求元素的 CSS 只包含这三部分。block 作为独立的块，element 是块中的
一部分，modifier 表示元素状态。

因此可以先定义好命名空间、元素连接符和修饰符连接符。

```scss
//定义变量
$namespace: 'tx';
$namespaceConnector: '-';
$elementConnector: '__';
$modifierConnector: '--';
```

接下来是基础的mixin，方便每个组件使用。

```scss
//定义 block 的方法
@mixin block($block) {
  $component-root-class: $namespace + $namespaceConnector + $block !global;
  
  .#{$component-root-class} {// #{} 插值语法
    @content;// 插入@include调用时大括号里的内容
  }
}

@mixin elem($element...) {// ...表示接收任意数量的参数并转为列表
  $selector: &; // &表示从顶部到当前选择器所嵌套的选择器，
  $selectors: "";

  @each $item in $element {
    $selectors: #{$selectors + $selector + $elementConnector + $item + ","};
  }

  @at-root {// 生成的样式会在样式表最顶层
    #{$selectors} {
      @content;
    }
  }
}

@mixin modifier($modifier...) {
  $selectors: "";

  @each $item in $modifier {
    $selectors: #{$selectors + & + $modifierSeparator + $item + ","};
  }

  @at-root {
    #{$selectors} {
      @content;
    }
  }
}

@mixin state($states...) {
  @at-root {
    @each $state in $states {
      &.is-#{$state} {
        @content;
      }
    }
  }
}
```

最后是基础变量的定义，定义整体主题色和每个组件用到的颜色、字体大小等变量：



## 使用
在使用的时候就能引入上述
