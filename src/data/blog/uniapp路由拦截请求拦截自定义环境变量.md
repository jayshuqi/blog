```javascript
import App from './App.vue'

const app = createSSRApp(App)
app.use(roueInterceptor)

const navigateToInterceptor = {
    invoke({ url }: { url: string }) {
        const path = url.split('?')[0]

        const isNeedLogin = needLoginPages.includes(path)
        if (!isNeedLogin) {
            return true
        }
        const redirectRoute = `${loginRoute}?redirect=${encodeURIComponent(url)}`
        uni.navigateTo({ url: redirectRoute })
        return false
    },
}

export const routeInterceptor = {
    install() {
        uni.addInterceptor('navigateTo', navigateToInterceptor)
    }
}
```

```javascript
const httpInterceptor: UniApp.InterceptorOptions = {
    // 拦截前触发
    invoke(options: CustomRequestOptions) {
        options.timeout = 60000 // 10s
        options.header = {
            'Content-Type': 'application/json',
            ...options.header,
        }
        options.header.Authorization = `${token || tokenCache}`
    },
}

export const requestInterceptor = {
    install() {
        // 拦截 request 请求
        uni.addInterceptor('request', httpInterceptor)
    },
}
```

```typescript
export const http = <T>(options: CustomRequestOptions) => {
    return new Promise<T>((resolve, reject) => {
        uni.request({
            ...options,
            dataType: 'json',
            // #ifndef MP-WEIXIN
            responseType: 'json',
            // #endif
            // 响应成功
            success(res) {
                const resData = res.data as AnyObject
                // 状态码 2xx，参考 axios 的设计
                if (resData.code === 200) {
                    resolve(res.data as T)
                } else if (resData.code === 401) {
                    uni.showToast({
                        icon: 'none',
                        title: '登录已过期,重新登录',
                    })
                    uni.redirectTo({ url: '/pages/login/relogin' })
                    reject(res)
                } else {
                    uni.showToast({
                        icon: 'none',
                        title: errorTxt,
                    })
                    reject(res)
                }
            },
            // 响应失败
            fail(err) {
                uni.showToast({
                    icon: 'none',
                    title: '网络错误，换个网络试试',
                })
                reject(err)
            },
            complete() {
                uni.hideLoading()
            },
        })
    })
}

http<IResponse<IType>>({
    url: 'a.com',
    method: 'POST',
    data
})
```

## 自定义环境变量

```json
//package.json
{
  "uni-app": {
    "scripts": {
      "third-party": {
        "title": "第三方平台",
        "env": {
          "UNI_PLATFORM": "h5",
          "IS_THIRD_PARTY": true
        }
      }
    }
  }
}
```

```typescript
export default ({ command, mode }) => {
    const customDefine = process.env.UNI_CUSTOM_DEFINE
    const isThirdParty = customDefine ? JSON.parse(customDefine).IS_THIRD_PARTY : false
    
    return defineConfig({
        // ...
        define: {
            'process.env.IS_THIRD_PARTY': isThirdParty,
        },
    })
}
```
