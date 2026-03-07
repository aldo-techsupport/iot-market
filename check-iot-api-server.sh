#!/bin/bash

echo "==================================="
echo "IoT API Server Diagnostic Script"
echo "==================================="
echo ""

# Check if directory exists
if [ -d "/www/wwwroot/api-iot" ]; then
    echo "✅ Directory exists: /www/wwwroot/api-iot"
    echo ""
    
    # List directory contents
    echo "📁 Directory contents:"
    ls -la /www/wwwroot/api-iot
    echo ""
    
    # Check if it's a Laravel project
    if [ -f "/www/wwwroot/api-iot/artisan" ]; then
        echo "✅ Laravel project detected (artisan file found)"
        echo ""
        
        # Check routes
        if [ -f "/www/wwwroot/api-iot/routes/api.php" ]; then
            echo "✅ API routes file exists"
            echo ""
            echo "📄 API Routes preview:"
            head -50 /www/wwwroot/api-iot/routes/api.php
            echo ""
        else
            echo "❌ API routes file NOT found"
        fi
        
        # Check .env
        if [ -f "/www/wwwroot/api-iot/.env" ]; then
            echo "✅ .env file exists"
            echo ""
            echo "📄 Environment configuration:"
            grep -E "APP_NAME|APP_ENV|APP_DEBUG|APP_URL|DB_" /www/wwwroot/api-iot/.env
            echo ""
        else
            echo "❌ .env file NOT found"
        fi
        
        # Check public directory
        if [ -d "/www/wwwroot/api-iot/public" ]; then
            echo "✅ Public directory exists"
            echo ""
            echo "📁 Public directory contents:"
            ls -la /www/wwwroot/api-iot/public
            echo ""
        else
            echo "❌ Public directory NOT found"
        fi
        
        # Check if index.php exists
        if [ -f "/www/wwwroot/api-iot/public/index.php" ]; then
            echo "✅ index.php exists"
        else
            echo "❌ index.php NOT found"
        fi
        
    else
        echo "❌ NOT a Laravel project (artisan file not found)"
        echo ""
        echo "📁 Files in directory:"
        ls -la /www/wwwroot/api-iot
    fi
    
else
    echo "❌ Directory NOT found: /www/wwwroot/api-iot"
fi

echo ""
echo "==================================="
echo "Web Server Configuration Check"
echo "==================================="
echo ""

# Check Nginx configuration
if [ -f "/etc/nginx/sites-available/api-iot.digitaltekno.cloud" ]; then
    echo "✅ Nginx config found"
    echo ""
    echo "📄 Nginx configuration:"
    cat /etc/nginx/sites-available/api-iot.digitaltekno.cloud
    echo ""
elif [ -f "/etc/nginx/conf.d/api-iot.digitaltekno.cloud.conf" ]; then
    echo "✅ Nginx config found"
    echo ""
    echo "📄 Nginx configuration:"
    cat /etc/nginx/conf.d/api-iot.digitaltekno.cloud.conf
    echo ""
else
    echo "❌ Nginx config NOT found"
    echo ""
    echo "Available Nginx configs:"
    ls -la /etc/nginx/sites-available/ 2>/dev/null || echo "Directory not found"
    ls -la /etc/nginx/conf.d/ 2>/dev/null || echo "Directory not found"
fi

echo ""
echo "==================================="
echo "Test API Endpoint"
echo "==================================="
echo ""

echo "Testing: https://api-iot.digitaltekno.cloud/api/devices"
curl -s -I https://api-iot.digitaltekno.cloud/api/devices
echo ""

echo "Testing: https://api-iot.digitaltekno.cloud/api/iot/data"
curl -s -I https://api-iot.digitaltekno.cloud/api/iot/data
echo ""

echo "==================================="
echo "Diagnostic Complete"
echo "==================================="
