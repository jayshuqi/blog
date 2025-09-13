---
pubDatetime: 2021-09-23T15:22:00Z
modDatetime: 2021-09-23T15:22:00Z
title: Solution for edge certificate pending validation issue in Cloudflare
slug: cloudflare-pending-validation-solution
featured: true
draft: false
tags:
  - cloudflare
description:
  Solution for edge certificate pending validation issue in Cloudflare
---

## Solution for edge certificate pending validation

1. Find the DNS settings in the Cloudflare control panel, there is a DNSSEC option, enable it. You need to add a corresponding record at your domain registrar.

2. Find DNS-Records, locate the DNS records, click edit, turn off the proxy status and save, then re-enable it.

3. Find the edge certificates page under SSL/TLS, there is a Disable Universal SSL at the bottom, disable it and then re-enable it.
