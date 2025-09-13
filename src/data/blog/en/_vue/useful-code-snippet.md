---
pubDatetime: 2022-09-23T15:22:00Z
modDatetime: 2025-03-22T06:25:46.734Z
title: Useful Code Snippet
slug: Code Snippet
featured: false
draft: true
tags:
  - vue
description:
  Some useful code snippet in vue
---

## hoc in vue


```javascript
import { getCurrentInstance, useTemplateRef } from 'vue';

// call after defineExpose
export default function useForwardRef(refAttr) {
    const instanceRef = useTemplateRef(refAttr);

    const currentInstance = getCurrentInstance();
    if (currentInstance) {
        const currentExposed = currentInstance.exposed
        function getMatchedExposed(property){//获取最终的exposed
            if(currentExposed[property]) return currentExposed;
            if(instanceRef?.value&&instanceRef?.value[property]) return instanceRef?.value;
            return currentExposed;
        }
        currentInstance.exposed = new Proxy(currentExposed, {
            get(target, property, ...args) {
                return Reflect.get(getMatchedExposed(property), property, ...args);
            },
            has(target, property, ...args) {
                return Reflect.has(getMatchedExposed(property),property, ...args)
            },
        });
    }
    return instanceRef;
}
```

https://mp.weixin.qq.com/s/loBVuH4BCRvOKg0bLD1raQ
