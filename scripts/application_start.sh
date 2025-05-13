#!/bin/bash
# Application Start script for AWS CodeDeploy

echo "Running application_start.sh..."

# Start Apache service
echo "Starting Apache web server..."
systemctl start httpd
systemctl enable httpd

echo "application_start.sh completed"
