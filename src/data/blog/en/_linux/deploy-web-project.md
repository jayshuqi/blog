---
pubDatetime: 2021-07-22T09:01:09Z
modDatetime: 2021-07-22T09:01:09Z
title: Web Project Deployment from Scratch
slug: deploy-web-project
featured: false
draft: false
tags:
  - linux
  - deploy
  - domain
  - nginx
description:
  This article mainly shares how to deploy web projects to servers, including server connection, file upload, nginx installation and configuration, domain purchase and resolution.
---

## Server Connection

1. Download [WindTerm](https://github.com/kingToolbox/WindTerm/releases), after downloading find the software in the root directory and run it.

2. Create a new session. Enter the server's public IP in the host field, other settings generally don't need to be changed. Click authentication in the left menu, find the authentication file, and select the server's connection key file. After connecting, enter the username in the pop-up box.

## Create root user

First run: `sudo passwd root`, then enter the password you want to set.

Switch to root, `su root`.

## Upload Project Package Files to Server

### Add Public Key to Server
First, add the locally generated public key to the server. The public key is generally in the pub suffix file under C:\Users\[your username]\.ssh\. After opening, copy the content and add it to the ~/.ssh/authorized_keys file on the server.

In Linux, you can use the vi command to edit file content. Here, run `vi authorized_keys`, after running it will display the file content, but it's not editable at this time. Press `o` to enter edit mode,
then press enter to open a new line and paste the copied content into it, then enter `:wq` to exit edit mode.

### Create Folder

Creating folders and uploading files to opt requires permissions. If the user you logged in as doesn't have permissions, you need to run the following commands.

Create: `sudo mkdir blog`, change the owner of the blog folder to admin, `sudo chown -R admin:admin /opt/blog`.

### Upload Package Files
Uploading files requires the scp command. Specifically: `scp -r file_path username@server_ip:server_path_to_upload_to`. For example: `scp -r D:/code/shop-admin/dist admin@3.3.3.188:/opt/blog`.

The first run will prompt to add the server's fingerprint to the local machine, just agree. When transmission starts, it will output logs, such as:

```
404.html                                                                                                                                                                                                                          100%   14KB  95.3KB/s   00:00    
index.html                                                                                                                                                                                                                        100%   14KB  96.7KB/s   00:00    
index.html                                                                                                                                                                                                                        100%   21KB 144.2KB/s   00:00    
forrest-gump-quote.webp                                                                                                                                                                                                           100%   27KB 184.0KB/s   00:00    
astropaper-og.jpg                                                                                                                                                                                                                 100%  145KB 337.1KB/s   00:00    
```

## nginx
After files are transferred to the server, nginx is needed to implement reverse proxy.

Install: `apt install nginx`

Check running status: `systemctl status nginx`[nginx.conf](..%2F..%2F..%2F..%2F..%2F..%2Fnginx.conf)

Check if nginx configuration syntax is correct: `sudo nginx -t`

Restart: `systemctl reload nginx`

Set to start on boot: `systemctl enable nginx`

### Modify Configuration
First backup the configuration: `cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup`

Then modify the configuration of /etc/nginx/nginx.conf. You can refer to the following, just change the root configuration to the path of your project files.

```
user  nginx; # linux username
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

### Add Inbound Rules
In the server control panel's security group, add an inbound rule for HTTP port 80. After that, you can access the nginx-proxied webpage by visiting http:// + your IP address.

## Domain

### Domain Purchase

I bought my domain on spaceship. After purchase, open launchpad-domain manager-click domain-name servers and DNS-advanced DNS, add a record, select type A, fill in the server's public IP,
and then you can access the deployed webpage through the domain.

### Add HTTPS Support

Follow the [acme.sh](https://github.com/acmesh-official/acme.sh/wiki/%E8%AF%B4%E6%98%8E) documentation, using the HTTP validation method.

Change the default CA to Let's Encrypt. Also, nginx needs to allow requests for validation files, otherwise the certificate cannot be successfully issued.

```
location ~ ^/\.well-known/acme-challenge {
        allow all;
        default_type "text/plain";
    }
```

After the certificate is successfully issued, modify the nginx configuration as follows:

```
user nginx; # Enter your username
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

    # Redirect all HTTP requests to HTTPS
    server {
        listen 80;
        server_name your_domain.com www.your_domain.com;
        # Handle ACME certificate renewal
        location ~ ^/\.well-known/acme-challenge {
            allow all;
            default_type "text/plain";
        }
        # Redirect all other HTTP requests to HTTPS
        location / {
            return 301 https://$server_name$request_uri;
        }
    }

    # HTTPS server configuration
    server {
        listen 443 ssl;
        server_name your_domain.com www.your_domain.com;

        # SSL certificate path (example path, actual path needs to be modified)
        ssl_certificate /etc/ssl/private/your_domain/fullchain.cer;
        ssl_certificate_key /etc/ssl/private/your_domain/private.key;

        # Website root directory
        root /opt/your_project/dist;

        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        # Custom error pages
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

### Prevent Access via IP Address

Add a server in the http block, place it first:

```
server {
        listen 80 default_server;
        listen 443 ssl default_server;  # Also handle HTTPS IP access
        server_name _;  # Match all unspecified domains
        
        ssl_certificate /path/to/fullchain.cer;
        ssl_certificate_key /path/to/a.com.key;
        
        return 444;  # Close connection directly, do not return any content
    }
```
