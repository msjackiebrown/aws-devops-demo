# AWS CI/CD Pipeline Manual Setup Guide

This document provides detailed instructions for manually setting up the complete CI/CD pipeline for the AWS DevOps Demo project using the AWS Management Console.

## Overview

The pipeline consists of the following components:

1. **GitHub repository** as the source code repository
2. **Amazon S3 bucket** for storing build artifacts
3. **AWS CodeBuild projects** for test and build phases
4. **AWS CodePipeline** for orchestrating the entire CI/CD process
5. **AWS SNS topics** for pipeline notifications

## Prerequisites

Before you begin, ensure you have:

- An AWS account with administrative permissions
- A GitHub account with your forked copy of this repository
- Basic familiarity with AWS services (S3, CodeBuild, CodePipeline)

## Step 1: Create S3 Artifact Bucket

The pipeline requires an S3 bucket to store build artifacts.

1. Sign in to the [AWS Management Console](https://console.aws.amazon.com/)
2. Navigate to the Amazon S3 service
3. Click **Create bucket**
4. Enter a unique bucket name (e.g., `aws-devops-demo-artifacts-{your-account-id}-{region}`)
5. Select your preferred AWS region
6. Enable versioning under **Advanced settings**
7. Click **Create bucket**

## Step 2: Create IAM Service Roles

Create IAM roles for CodeBuild and CodePipeline services:

### CodeBuild Service Role

1. Navigate to the IAM console
2. Select **Roles** > **Create role**
3. Choose **AWS service** as the trusted entity type
4. Select **CodeBuild** as the use case
5. Click **Next**
6. Attach the following policies:
   - `AmazonS3FullAccess`
   - `CloudWatchLogsFullAccess`
7. Click **Next**
8. Name the role `codebuild-aws-devops-demo-service-role`
9. Click **Create role**

### CodePipeline Service Role

1. Navigate to the IAM console
2. Select **Roles** > **Create role**
3. Choose **AWS service** as the trusted entity type
4. Select **CodePipeline** as the use case
5. Click **Next**
6. Attach the following policies:
   - `AmazonS3FullAccess`
   - `AWSCodeBuildAdminAccess`
   - `AWSCodeStarFullAccess`
7. Click **Next**
8. Name the role `AWSCodePipelineServiceRole-{region}-aws-devops-demo-pipeline`
9. Click **Create role**

## Step 3: Create CodeBuild Projects

You'll need to create two CodeBuild projects: one for testing and one for building.

### Test Phase Project

1. Navigate to the CodeBuild console
2. Click **Create build project**
3. Enter project configuration:
   - **Project name**: `aws-devops-demo-test`
   - **Description**: `Test phase for aws-devops-demo`
4. Under **Source**:
   - **Source provider**: Select **AWS CodePipeline**
   - The source will be configured when setting up the pipeline
5. Under **Environment**:
   - **Environment image**: Managed image
   - **Operating system**: Amazon Linux 2
   - **Runtime**: Standard
   - **Image**: `aws/codebuild/amazonlinux2-x86_64-standard:4.0`
   - **Image version**: Always use the latest
   - **Environment type**: Linux
   - **Service role**: Select the CodeBuild service role created earlier
   - **BuildSpec**: Use a buildspec file
   - **Buildspec name**: `testspec.yml`
6. Under **Artifacts**:
   - **Type**: Amazon S3
   - **Bucket name**: Choose the artifact bucket created earlier
   - **Name**: `TestOutput`
   - **Packaging**: None
7. Under **Logs**:
   - Enable **CloudWatch logs**
   - **Group name**: `/aws/codebuild/aws-devops-demo-test`
   - **Stream name**: leave default
8. Click **Create build project**

### Build Phase Project

1. Navigate to the CodeBuild console
2. Click **Create build project**
3. Enter project configuration:
   - **Project name**: `aws-devops-demo-build`
   - **Description**: `Build phase for aws-devops-demo`
4. Under **Source**:
   - **Source provider**: Select **AWS CodePipeline**
   - The source will be configured when setting up the pipeline
5. Under **Environment**:
   - **Environment image**: Managed image
   - **Operating system**: Amazon Linux 2
   - **Runtime**: Standard
   - **Image**: `aws/codebuild/amazonlinux2-x86_64-standard:4.0`
   - **Image version**: Always use the latest
   - **Environment type**: Linux
   - **Service role**: Select the CodeBuild service role created earlier
   - **BuildSpec**: Use a buildspec file
   - **Buildspec name**: `buildspec.yml`
6. Under **Artifacts**:
   - **Type**: Amazon S3
   - **Bucket name**: Choose the artifact bucket created earlier
   - **Name**: `BuildOutput`
   - **Packaging**: None
7. Under **Logs**:
   - Enable **CloudWatch logs**
   - **Group name**: `/aws/codebuild/aws-devops-demo-build`
   - **Stream name**: leave default
8. Click **Create build project**

## Step 4: Create Connection to GitHub

To connect your AWS CodePipeline to GitHub:

1. Navigate to **Developer Tools** > **Settings** in the AWS Console
2. Under **Connections**, click **Create connection**
3. Select **GitHub** as the provider
4. Give your connection a name (e.g., `GitHub-aws-devops-demo`)
5. Click **Connect to GitHub**
6. You'll be redirected to GitHub to authorize the connection
7. Select the GitHub account/organization where your repository is located
8. Click **Install a new app** if requested
9. Configure which repositories the app can access (select the aws-devops-demo repository)
10. Finalize the connection and note the **Connection ARN** for later use

## Step 5: Create CodePipeline

Now create the pipeline that will orchestrate the entire CI/CD process:

1. Navigate to the CodePipeline console
2. Click **Create pipeline**
3. Enter pipeline settings:
   - **Pipeline name**: `aws-devops-demo-pipeline`
   - **Service role**: Choose the CodePipeline role created earlier
   - **Role ARN**: Select the ARN for the CodePipeline service role created earlier
4. Under **Advanced settings**:
   - **Artifact store**: Custom location
   - **Bucket**: Select the S3 bucket created earlier
   - **Encryption key**: Default AWS Managed Key
5. Click **Next**

### Source Stage

6. Configure the source stage:
   - **Source provider**: GitHub (Version 2)
   - **Connection**: Select the GitHub connection created earlier
   - **Repository name**: Select your repository
   - **Branch name**: `main` (or your default branch)
   - **Output artifact format**: CodePipeline default
7. Click **Next**

### Build Stages

8. Add the test stage:
   - Click **Add stage**
   - **Stage name**: `Test`
   - Click **Add action group**
   - **Action name**: `Test`
   - **Action provider**: AWS CodeBuild
   - **Region**: Your AWS region
   - **Input artifacts**: SourceArtifact
   - **Project name**: Select `aws-devops-demo-test`
   - **Output artifacts**: TestOutput
   - Click **Done**

9. Add the build stage:
   - Click **Add stage**
   - **Stage name**: `Build`
   - Click **Add action group**
   - **Action name**: `Build`
   - **Action provider**: AWS CodeBuild
   - **Region**: Your AWS region
   - **Input artifacts**: Select both `SourceArtifact` AND `TestOutput`
   - **Project name**: Select `aws-devops-demo-build`
   - **Output artifacts**: BuildOutput
   - Click **Done**

10. Review the pipeline configuration and click **Create pipeline**

## Step 6: Set Up Pipeline Notifications

To set up notifications for your pipeline:

### Create an SNS Topic

1. Navigate to the Amazon SNS console
2. Click **Topics** > **Create topic**
3. Select **Standard** type
4. Enter a name: `aws-devops-demo-pipeline-notifications`
5. Click **Create topic**

### Create Subscriptions

1. Select the newly created topic
2. Click **Create subscription**
3. Select **Email** as the protocol
4. Enter your email address in the Endpoint field
5. Click **Create subscription**
6. Check your email and confirm the subscription

### Configure CloudWatch Events for Pipeline Notifications

1. Navigate to the CloudWatch console
2. Select **Rules** under **Events**
3. Click **Create rule**
4. For the **Event Source**:
   - Select **Event Pattern**
   - Choose **Custom event pattern**
   - Paste the following JSON:

```json
{
  "source": [
    "aws.codepipeline"
  ],
  "detail-type": [
    "CodePipeline Pipeline Execution State Change"
  ],
  "detail": {
    "state": [
      "FAILED",
      "SUCCEEDED"
    ],
    "pipeline": [
      "aws-devops-demo-pipeline"
    ]
  }
}
```

5. For **Targets**:
   - Click **Add target**
   - Select **SNS topic**
   - Select the topic created earlier
   - For **Configure input**, select **Input Transformer**
   - In **Input Path**:
```json
{
  "pipeline": "$.detail.pipeline",
  "state": "$.detail.state",
  "executionId": "$.detail.execution-id"
}
```
   - In **Input Template**:
```
"The pipeline <pipeline> has <state>. Execution ID: <executionId>. For more details, visit the AWS CodePipeline console."
```

6. Click **Configure details**
7. Name the rule `aws-devops-demo-pipeline-status-change`
8. Click **Create rule**

## Step 7: Create Additional Event Rules for Test Failures

To receive notifications specifically for test failures:

1. Navigate to the CloudWatch console
2. Select **Rules** under **Events**
3. Click **Create rule**
4. For the **Event Source**:
   - Select **Event Pattern**
   - Choose **Custom event pattern**
   - Paste the following JSON:

```json
{
  "source": [
    "aws.codepipeline"
  ],
  "detail-type": [
    "CodePipeline Action Execution State Change"
  ],
  "detail": {
    "state": [
      "FAILED"
    ],
    "pipeline": [
      "aws-devops-demo-pipeline"
    ],
    "stage": [
      "Test"
    ]
  }
}
```

5. For **Targets**:
   - Click **Add target**
   - Select **SNS topic**
   - Select the topic created earlier
   - For **Configure input**, select **Input Transformer**
   - In **Input Path**:
```json
{
  "pipeline": "$.detail.pipeline",
  "stage": "$.detail.stage", 
  "action": "$.detail.action"
}
```
   - In **Input Template**:
```
"ALERT: Tests have failed in the <pipeline> pipeline during the <stage> stage (<action> action). Please investigate the test failures immediately."
```

6. Click **Configure details**
7. Name the rule `aws-devops-demo-test-failure-alert`
8. Click **Create rule**

## Verifying Your Setup

After completing all these steps:

1. Make a small change to your repository and push it to GitHub
2. Go to the CodePipeline console and verify that your pipeline starts automatically
3. Monitor the progress through the Test and Build phases
4. Check your email for any notifications when the pipeline completes

## Setting Up In-Place Deployment (Recommended)

To enable in-place deployment with CodeDeploy:

1. Navigate to the CloudFormation console
2. Click **Create stack** > **With new resources**
3. Upload the `infrastructure.yml` file from your repository (this template provisions EC2 instances and CodeDeploy resources for in-place deployment)
4. Follow the prompts to configure and deploy the stack
5. After deployment, add a **Deploy** stage to your pipeline that uses the CodeDeploy application and deployment group created by CloudFormation
6. In the Deploy stage configuration:
   - **Provider**: AWS CodeDeploy
   - **Application name**: Select the CodeDeploy application created by the stack
   - **Deployment group**: Select the deployment group created by the stack
   - **Input artifacts**: Use the output from your Build stage
7. Save and update your pipeline

## Setting Up Blue/Green Deployment (Advanced, Optional)

For Blue/Green deployment implementation:

1. Navigate to CloudFormation console
2. Click **Create stack** > **With new resources**
3. Upload the `infrastructure-blue-green.yml` file from your repository
4. Follow the prompts to configure and deploy the stack
5. After deployment, add a Deployment stage to your pipeline that uses the Blue/Green deployment resources created by CloudFormation

## Troubleshooting

If you encounter any issues during setup:

- **CodeBuild projects failing**: Check the CloudWatch Logs for detailed error messages
- **Pipeline not triggering**: Verify your GitHub connection is working correctly
- **Permissions errors**: Review the IAM roles to ensure they have the correct policies attached
- **Notification not working**: Confirm your SNS subscription was confirmed via email

## Next Steps

After setting up your pipeline:

- Add automated testing improvements
- Set up deployment to production environments
- Configure application monitoring
- Implement security scanning in your pipeline
