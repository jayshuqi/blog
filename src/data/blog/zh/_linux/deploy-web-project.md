---
pubDatetime: 2021-07-22T09:01:09Z
modDatetime: 2021-07-22T09:01:09Z
title: 从零开始的 Web 项目部署
slug: deploy-web-project
featured: false
draft: false
tags:
  - linux
  - deploy
  - domain
  - nginx
description:
  文章主要分享如何将 web 项目部署到服务器上，包括服务器的连接、文件的上传、nginx的安装和配置、域名购买和解析。
---

## 服务器的连接

1、下载 [WindTerm](https://github.com/kingToolbox/WindTerm/releases)，下载后在根目录下找到软件并运行。

2、新建会话。主机输入服务器公网ip、其他一般不用动。在左侧菜单点击验证，找到身份验证文件，选择服务器的连接密钥文件。连接后在弹出框内输入用户名即可。

## 创建 root 用户

先运行：`sudo passwd root`，接着输入你要设置的密码。

切换到 root，`su root`。

## 上传项目打包文件到服务器

### 添加公钥到服务器
先将本地生成的公钥添加到服务器中。公钥一般在 C:\Users\[你的用户名]\.ssh\ 下面的 pub 后缀的文件中。打开后复制将内容添加到服务器上 ~/.ssh/authorized_keys 文件内。

在 linux 中编辑文件内容可以用 vi 命令，这里运行`vi authorized_keys`，运行后会显示文件内容，但此时不可编辑，需要按 `o` 进入编辑模式，
然后回车开新行将刚刚复制的内容粘贴到里面，再输入 `:wq` 退出编辑模式就可以了。

### 创建文件夹

创建文件夹和上传文件到 opt 内需要权限，如果你登录的用户没有权限的话需要运行下面的命令。

创建：`sudo mkdir blog`, 将 blog 文件夹所有者改为 admin，`sudo chown -R admin:admin /opt/blog`。

### 上传打包文件
上传文件需要用到 scp 命令。具体是：`scp -r 文件路径 用户名@服务器ip:需要上传到的服务器路径`。如：`scp -r D:/code/shop-admin/dist admin@3.3.3.188:/opt/blog`。

第一次运行会提示添加服务器的指纹到本地，同意即可。开始传输时会输出日志，如：

```
404.html                                                                                                                                                                                                                          100%   14KB  95.3KB/s   00:00    
index.html                                                                                                                                                                                                                        100%   14KB  96.7KB/s   00:00    
index.html                                                                                                                                                                                                                        100%   21KB 144.2KB/s   00:00    
forrest-gump-quote.webp                                                                                                                                                                                                           100%   27KB 184.0KB/s   00:00    
astropaper-og.jpg                                                                                                                                                                                                                 100%  145KB 337.1KB/s   00:00    
```

## nginx
文件传到服务器后，这时候需要 nginx 实现反向代理。

安装：`apt install nginx`

检查运行状态：`systemctl status nginx`[nginx.conf](..%2F..%2F..%2F..%2F..%2F..%2Fnginx.conf)

检查 nginx 配置语法是否正确：`sudo nginx -t`

重启：`systemctl reload nginx`

设置开机启动：`systemctl enable nginx`

### 修改配置
先备份一下配置：`cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup`

然后修改 /etc/nginx/nginx.conf 的配置，可以参考下面的，改一下 root 配置为你的项目文件的路径就行。

```
user  nginx; # linux用户名
worker_processes  auto;
worker_rlimit_nofile 8192;

error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;

events {
    worker_connections  1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    access_log  /var/log/nginx/access.log;
    error_log   /var/log/nginx/error.log;

    sendfile        on;
    tcp_nopush      on;
    tcp_nodelay     on;

    #gzip  on;

    server {
        listen       80;
        root         /opt/your_project/dist;

        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;

        location / {
            try_files $uri $uri/ /index.html;
        }

        error_page 404 /404.html;
            location = /40x.html {
        }

        error_page 500 502 503 504 /50x.html;
            location = /50x.html {
        }
    }
}
```

### 添加入站规则
在服务器控制面板的安全组里，添加 http 的 80 端口的入站规则，之后就能通过访问 http:// + 你的ip地址 来访问 nginx 代理的网页了。

## 域名

### 域名购买

我是在 spaceship 上买的域名，购买后打开 launchpad-域名管理器-点击域名-名称服务器和DNS-高级DNS，添加一条记录，类型选A，填上服务器公网IP后
就能通过域名访问部署的网页了。

### 增加 https 的支持

根据 [acme.sh](https://github.com/acmesh-official/acme.sh/wiki/%E8%AF%B4%E6%98%8E) 文档操作即可，用 HTTP 验证的方法。

默认 CA 改 Let's Encrypt， 另外 nginx 中要开放对验证文件的请求，否则无法成功签发证书。

```
location ~ ^/\.well-known/acme-challenge {
        allow all;
        default_type "text/plain";
    }
```

证书签发成功后，修改 nginx 配置如下：

```
user nginx; # 填入你的用户名
worker_processes auto;
worker_rlimit_nofile 8192;

error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    access_log /var/log/nginx/access.log;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;

    # 重定向所有 HTTP 请求到 HTTPS
    server {
        listen 80;
        server_name your_domain.com www.your_domain.com;
        # 处理 ACME 证书续签
        location ~ ^/\.well-known/acme-challenge {
            allow all;
            default_type "text/plain";
        }
        # 将所有其他 HTTP 请求重定向到 HTTPS
        location / {
            return 301 https://$server_name$request_uri;
        }
    }

    # HTTPS 服务器配置
    server {
        listen 443 ssl;
        server_name your_domain.com www.your_domain.com;

        # SSL 证书路径 (示例路径，实际需修改)
        ssl_certificate /etc/ssl/private/your_domain/fullchain.cer;
        ssl_certificate_key /etc/ssl/private/your_domain/private.key;

        # 网站根目录
        root /opt/your_project/dist;

        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        # 自定义错误页面
        error_page 404 /404.html;
        location = /404.html {
            internal;
        }

        error_page 500 502 503 504 /50x.html;
        location = /50x.html {
            internal;
        }
    }
}

```

### 禁止通过 IP 地址访问

在 http 块中添加一个 server，排第一个：

```
server {
        listen 80 default_server;
        listen 443 ssl default_server;  # 同样处理HTTPS的IP访问
        server_name _;  # 匹配所有未指定的域名
        
        ssl_certificate /path/to/fullchain.cer;
        ssl_certificate_key /path/to/a.com.key;
        
        return 444;  # 直接关闭连接，不返回任何内容
    }
```
