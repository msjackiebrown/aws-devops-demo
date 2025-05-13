#!/bin/bash
# Before Install script for AWS CodeDeploy

# Install dependencies if needed
echo "Running before_install.sh..."

# Ensure Apache is installed
if ! command -v httpd &> /dev/null; then
    echo "Installing Apache..."
    yum update -y
    yum install -y httpd
fi

# Stop Apache service if it's running
systemctl stop httpd

# Clean the deployment directory
if [ -d /var/www/html ]; then
    echo "Cleaning deployment directory..."
    rm -rf /var/www/html/*
fi

echo "before_install.sh completed"
