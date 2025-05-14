#!/bin/bash
# This script stops the application if it's running
# For first-time deployments, it exits gracefully

# Check if httpd is running
if systemctl is-active --quiet httpd; then
    echo "Stopping httpd service..."
    systemctl stop httpd
else
    echo "No application currently running, skipping stop phase."
fi

# Always exit with success code to allow first-time deployments to proceed
exit 0
