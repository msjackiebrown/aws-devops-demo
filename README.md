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
├── tests/               # Test files
│   ├── unit/            # Unit tests for JavaScript functions
│   ├── integration/     # Integration tests for application flow
│   └── setup.js         # Common test setup
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
3. **Test**: Automated testing with Jest for unit and integration tests
4. **Deployment**: AWS CodeDeploy to EC2 instances using appspec.yml

## Testing

The application uses Jest for comprehensive testing:

### Test Structure

- `tests/unit/`: Unit tests for individual JavaScript functions
- `tests/integration/`: Integration tests for application flow
- `tests/setup.js`: Common setup for all tests

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode (development)
npm run test:watch
```

### Test Coverage

Our test suite aims for high code coverage with:

- Unit tests for individual functions in main.js
- Integration tests for complete application flow
- DOM event handling tests
- User interaction simulation

Current coverage metrics:
- Statement coverage: ~90%
- Branch coverage: ~56%
- Function coverage: ~84%
- Line coverage: ~90%

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
- Test automation and coverage reporting
- Deployment automation
- Deployment strategies
- Rollback procedures

## License

This project is open-source and available for educational purposes.

## Author

Created for AWS DevOps Engineer Professional certification study.

# Repository Notifications

Repository notifications keep team members informed about changes to the codebase and pipeline status. This project implements notifications across multiple layers for comprehensive visibility.

## 1. GitHub Repository Notifications

GitHub's built-in notification system provides team awareness of repository activities:

### 📣 Watching Repositories
| Feature | Description |
|---------|-------------|
| **Watch Repository** | Receive notifications for issues, PRs, and commits |
| **Configuration** | Repository → "Watch" dropdown → Select notification level |
| **Options** | All Activity, Releases Only, Ignore |

### 📧 Email and Web Notifications
| Type | Description |
|------|-------------|
| **Email** | Notifications delivered based on GitHub settings |
| **Web** | Accessible via bell icon in GitHub navigation bar |
| **Setup** | GitHub Settings → Notifications |

### 🔍 Custom Notification Routing
* Filter by repository, activity type, or reason
* Create rules to direct specific notifications to different email addresses

## 2. AWS CodePipeline Notifications

Pipeline execution notifications use Amazon SNS (Simple Notification Service):

### ⚙️ SNS Topic Configuration
```bash
# Create a dedicated topic for pipeline notifications
aws sns create-topic --name pipeline-notifications
```

* **Subscription Types**: 
  - Email
  - SMS
  - Third-party integrations (Slack, Teams)

### 🔄 CodePipeline Integration

Pipeline events published to SNS include:
* Pipeline started
* Pipeline succeeded
* Pipeline failed
* Approval needed

### 📋 Notification Rules Setup
1. AWS Console → CodePipeline → Select Pipeline → Settings → Notification Rules
2. Configure event types (state changes, approvals)
3. Select SNS topic as target

## 3. Status Monitoring

Visual indicators provide at-a-glance status information:

### 🏷️ Status Badge
GitHub status badge in README showing current build status:

![Build Status](https://codebuild.us-east-1.amazonaws.com/badges?uuid=example-badge-id)

### 📊 HTML Status Dashboard
* Simple dashboard for pipeline status and recent deployments
* Location: `/status/index.html`

## Implementation Guide

### GitHub Webhook Configuration
```bash
# Navigate to: Repository Settings → Webhooks → Add webhook
# Configure the following:
# - Payload URL: [Your endpoint]
# - Content type: application/json
# - Events: [Select relevant events]
```

### AWS SNS Setup
```bash
# Create SNS topic
aws sns create-topic --name pipeline-notifications

# Add email subscription
aws sns subscribe \
  --topic-arn [topic-arn] \
  --protocol email \
  --notification-endpoint your-email@example.com
```

### CodePipeline Notification Rule
```bash
# Navigate to: AWS Console → CodePipeline → Pipeline → Settings → Notification Rules
# Configure:
# - Detail type: Basic or Full
# - Events: Pipeline state changes, approvals needed
# - Targets: SNS topic
```

### Validation Process
1. Make a minor repository change
2. Push to trigger the pipeline
3. Verify notification delivery via configured channels

## Documentation Links

| Service | Documentation |
|---------|---------------|
| **GitHub Webhooks** | [GitHub Webhook Documentation](https://docs.github.com/en/developers/webhooks-and-events/webhooks/about-webhooks) |
| **AWS SNS** | [AWS SNS Developer Guide](https://docs.aws.amazon.com/sns/latest/dg/welcome.html) |
| **CodePipeline** | [CodePipeline Notifications Documentation](https://docs.aws.amazon.com/codepipeline/latest/userguide/notification-rule-create.html) |

## Future Enhancements

- [ ] EventBridge integration for advanced event routing (Domain 5)
- [ ] Slack/Teams webhook integration for team communication
- [ ] Custom notification formatting with Lambda functions
- [ ] Status monitoring dashboard with CloudWatch metrics