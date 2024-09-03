#!/bin/bash

echo API_URL=[$API_URL]
sed -i s#API_URL#$API_URL#g /usr/share/nginx/html/main*.js

# Start Nginx
nginx -g 'daemon off;'
