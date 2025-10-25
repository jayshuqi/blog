---
pubDatetime: 2021-10-05T09:01:50Z
modDatetime: 2023-05-10T10:09:00Z
title: react基础
slug: react-basic
featured: false
draft: true
tags:
  - react
description:
  react基础知识
---

## 组件
React 中的组件是返回标签的函数，使用时需要以大写字母开头。

### prop
prop的传递是在标签上声明，子组件在函数的参数列表内声明并接收。

## JSX
1、组件返回的标签只能由一个顶级元素，或者使用空标签。

2、元素的class通过 `className` 设置。

3、引用js变量或写表达式需要用大括号`{}`。

4、变量可以保存JSX标签。

5、监听事件写法和html类似，`onClick={}`。

## hook
约定以 use 开头。

hook 只能在组件或其他hook的顶层被调用。

### useState
`useState`接收初始值，返回数组，第一个成员是变量，第二个成员是更新变量的异步函数，更新会触发重新渲染，重新渲染会再运行一次组件的代码。

#### 关于 state
state 是只读的，如果要更新引用类型时，要求必须创建新的“引用”。

> 可以使用 use-immer 来简化这些操作。

#### 关于更新函数
可以传入一个值或者一个回调函数作为参数。

更新函数的更新操作时类似与直接把值赋值给state，所以根据当前 state 来更新 state 可能结果不符预期。

传入的回调函数会接收一个参数，是当前最新的 state 值，而不是调用更新函数时所对应的快照state值。

```javascript
function handleClick() {
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
}
function handleClick() {
  setAge(a => a + 1); // setAge(42 => 43)
  setAge(a => a + 1); // setAge(43 => 44)
  setAge(a => a + 1); // setAge(44 => 45)
}
```








