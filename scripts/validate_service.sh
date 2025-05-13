#!/bin/bash
# Validate Service script for AWS CodeDeploy

echo "Running validate_service.sh..."

# Check if Apache is running
if systemctl is-active httpd >/dev/null 2>&1; then
    echo "Apache is running successfully"
else
    echo "Error: Apache is not running"
    exit 1
fi

# Check if we can access the website
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost)
if [ $HTTP_CODE -eq 200 ]; then
    echo "Website is accessible (HTTP 200 OK)"
else
    echo "Error: Website is not accessible (HTTP $HTTP_CODE)"
    exit 1
fi

echo "validate_service.sh completed successfully"
exit 0
