---
pubDatetime: 2021-09-23T15:22:00Z
modDatetime: 2021-09-23T15:22:00Z
title: 解决 cloudflare 中的 edge certificate 显示待验证的问题
slug: cloudflare-pending-validation-solution
featured: true
draft: false
tags:
  - cloudflare
description:
  解决 cloudflare 中的 edge certificate 显示待验证的问题
---

## edge certificate 显示待验证的解决方法

1、在 cloudflare 的控制面板中找到 DNS 的设置，里面有个 DNSSEC，开启。需要你到域名的注册商那里增加一个对应记录。

2、找到 DNS-Records，找到里面的 DNS 记录，点编辑，把代理状态关闭后保存，再重新开启。

3、找到 SSL/TLS 下的 edge certificates 页面，底部有一个 Disable Universal SSL，禁用后再重新开启。
