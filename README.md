# AWS DevOps Demo Web Application

This is a sample web application for demonstrating AWS CI/CD pipelines using AWS CodePipeline, CodeBuild, and CodeDeploy.

## Quick Links

| Setup Guides | Configuration Files | Related Resources |
|--------------|---------------------|-------------------|
| [CodePipeline Setup Guide](../CodePipeline-WebApp-Guide.md) | [buildspec.yml](buildspec.yml) | [Domain 1: SDLC Automation](../../Domain%201%20-%20SDLC%20Automation/) |
| [Project Implementation Guide](../AWS-DevOps-Certification-Project-Guide.md) | [appspec.yml](appspec.yml) | [CodePipeline Resources](../../Domain%201%20-%20SDLC%20Automation/CodePipeline/) |
| [CloudFormation Template](infrastructure.yml) | [Deployment Scripts](scripts/) | [Weekly Schedule](../../Study-Resources/Detailed-Weekly-Schedule.md) |

## Overview

This project provides a practical implementation of CI/CD concepts covered in Domain 1 of the AWS DevOps Engineer Professional certification. It includes:
- A simple static website with HTML, CSS, and JavaScript
- AWS CodeBuild configuration (buildspec.yml)
- AWS CodeDeploy configuration (appspec.yml)
- CloudFormation template for infrastructure setup
- Deployment scripts for various lifecycle hooks

## Project Structure

```
sample-web-app/
├── index.html           # Main HTML file
├── css/
│   └── styles.css       # CSS styles
├── js/
│   └── main.js          # JavaScript functionality
├── images/              # Image assets
├── scripts/             # Deployment scripts for CodeDeploy
│   ├── before_install.sh
│   ├── after_install.sh
│   ├── application_start.sh
│   └── validate_service.sh
├── buildspec.yml        # AWS CodeBuild configuration
├── appspec.yml          # AWS CodeDeploy configuration
└── README.md            # Project documentation
```

## CI/CD Pipeline Overview

This application is designed to be deployed using an AWS CI/CD pipeline:

1. **Source Control**: GitHub repository
2. **Build**: AWS CodeBuild using buildspec.yml
3. **Deployment**: AWS CodeDeploy to EC2 instances using appspec.yml

## Deployment Instructions

### Prerequisites
- AWS Account
- AWS CLI configured with appropriate permissions
- GitHub account

### Setting Up the Pipeline

1. Push this repository to your GitHub account
2. Create an AWS CodePipeline with the following stages:
   - Source: Connect to your GitHub repository
   - Build: Use AWS CodeBuild with the included buildspec.yml
   - Deploy: Use AWS CodeDeploy with the included appspec.yml

## Local Development

To run this application locally, simply open the index.html file in a web browser.

## AWS DevOps Professional Certification Study Notes

This project serves as a practical example for the following AWS DevOps Professional certification topics:

- CI/CD Pipeline implementation
- Source control integration
- Build process automation
- Deployment automation
- Deployment strategies
- Rollback procedures

## License

This project is open-source and available for educational purposes.

## Author

Created for AWS DevOps Engineer Professional certification study.
