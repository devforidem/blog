---
title: "{{ replace .File.ContentBaseName "-" " " | title }}"
date: {{ .Date }}
draft: true
tags: []
categories: []
images: ["https://og-image.YOUR-SUBDOMAIN.workers.dev/?title={{ replace .File.ContentBaseName "-" " " | title | urlquery }}"]
---
