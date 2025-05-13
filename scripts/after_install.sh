#!/bin/bash
# After Install script for AWS CodeDeploy

echo "Running after_install.sh..."

# Set proper permissions
echo "Setting proper permissions..."
chown -R apache:apache /var/www/html/
find /var/www/html -type d -exec chmod 755 {} \;
find /var/www/html -type f -exec chmod 644 {} \;

echo "after_install.sh completed"
