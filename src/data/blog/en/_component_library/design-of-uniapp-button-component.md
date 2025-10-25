---
pubDatetime: 2022-09-23T15:22:00Z
modDatetime: 2025-03-22T06:25:46.734Z
title: Uniapp按钮组件的设计
slug: implementation-of-uniapp-button-component
featured: false
draft: true
tags:
  - component
  - uniapp
description:
  讲讲 uniapp 中的按钮组件设计。
---

把 uniapp 中 button 支持的属性都支持，
id class style hover-class 传给 button
size 用自己定义的，
type 也自己定义，多端统一
plain 同样自己定义
disabled 自己定义，然后在点击事件中判断 disabled 来实现禁止点击
loading 也自己定义，不用 uniapp 支持的
form-type 没用，免得逃过点击事件中的 disabled判断
open-type，禁止或加载中的话，就undefined 否则就传入的open-type

抖音、qq、小红书、百度小程序特有的属性没管
