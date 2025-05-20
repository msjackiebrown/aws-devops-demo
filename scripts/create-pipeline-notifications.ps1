# Create CloudWatch Events rule to monitor pipeline status and send notifications

# Check for AWS CLI
$awsInstalled = Get-Command aws -ErrorAction SilentlyContinue
if (-not $awsInstalled) {
    Write-Host "AWS CLI is not installed. Please install it and configure your AWS credentials."
    exit 1
}

# Check AWS profile
Write-Host "Checking AWS configuration..."
try {
    $account = aws sts get-caller-identity --query "Account" --output text
    Write-Host "Using AWS account: $account"
}
catch {
    Write-Host "AWS CLI is not properly configured. Please run 'aws configure' to set up your credentials."
    exit 1
}

# Set variables
$projectName = "aws-devops-demo"
$region = Read-Host -Prompt "Enter AWS region (e.g., us-east-1)"
$pipelineName = "$projectName-pipeline"
$snsTopicName = "$projectName-pipeline-notifications"

# Create SNS topic if it doesn't exist
Write-Host "`nCreating SNS topic for notifications: $snsTopicName"
$topicArn = aws sns create-topic --name $snsTopicName --region $region | ConvertFrom-Json | Select-Object -ExpandProperty TopicArn

Write-Host "Topic ARN: $topicArn"

# Add email subscription
$email = Read-Host -Prompt "Enter email address for notifications"
Write-Host "Adding email subscription for: $email"
aws sns subscribe --topic-arn $topicArn --protocol email --notification-endpoint $email --region $region

Write-Host "Please check your email to confirm the subscription."

# Create CloudWatch Events rule for pipeline state changes
$ruleName = "$projectName-pipeline-events"
Write-Host "`nCreating CloudWatch Events rule: $ruleName"

# Create rule pattern json
$rulePattern = @"
{
  "source": ["aws.codepipeline"],
  "detail-type": ["CodePipeline Action Execution State Change"],
  "detail": {
    "pipeline": ["$pipelineName"],
    "state": ["FAILED"]
  }
}
"@

# Save to temp file
$tempFile = New-TemporaryFile
$rulePattern | Out-File -FilePath $tempFile.FullName

# Create rule
Write-Host "Creating CloudWatch Events rule for pipeline failures..."
aws events put-rule --name $ruleName --event-pattern file://$tempFile.FullName --region $region

# Create target for rule (SNS topic)
$target = @"
[
  {
    "Id": "1", 
    "Arn": "$topicArn",
    "InputTransformer": {
      "InputPathsMap": {
        "pipeline": "$.detail.pipeline",
        "stage": "$.detail.stage",
        "action": "$.detail.action",
        "state": "$.detail.state",
        "region": "$.region",
        "time": "$.time"
      },
      "InputTemplate": "\"Pipeline '<pipeline>' encountered a failure in the '<stage>' stage, action '<action>' at <time>. Region: <region>. State: <state>.\"" 
    }
  }
]
"@

# Save to temp file
$targetFile = New-TemporaryFile
$target | Out-File -FilePath $targetFile.FullName

# Set target
Write-Host "Setting SNS topic as the target for the CloudWatch Events rule..."
aws events put-targets --rule $ruleName --targets file://$targetFile.FullName --region $region

# Create specific rule for test stage failures
$testRuleName = "$projectName-test-stage-events"
Write-Host "`nCreating CloudWatch Events rule for test stage failures: $testRuleName"

$testRulePattern = @"
{
  "source": ["aws.codepipeline"],
  "detail-type": ["CodePipeline Action Execution State Change"],
  "detail": {
    "pipeline": ["$pipelineName"],
    "stage": ["Test"],
    "state": ["FAILED"]
  }
}
"@

# Save to temp file
$testTempFile = New-TemporaryFile
$testRulePattern | Out-File -FilePath $testTempFile.FullName

# Create rule
Write-Host "Creating CloudWatch Events rule for test stage failures..."
aws events put-rule --name $testRuleName --event-pattern file://$testTempFile.FullName --region $region

# Create target for rule (SNS topic)
$testTarget = @"
[
  {
    "Id": "1", 
    "Arn": "$topicArn",
    "InputTransformer": {
      "InputPathsMap": {
        "pipeline": "$.detail.pipeline",
        "stage": "$.detail.stage",
        "action": "$.detail.action",
        "state": "$.detail.state",
        "region": "$.region",
        "time": "$.time"
      },
      "InputTemplate": "\"CRITICAL: Test stage '<stage>' in pipeline '<pipeline>' has FAILED at <time>. Please check the test reports in CodeBuild for details. Region: <region>.\"" 
    }
  }
]
"@

# Save to temp file
$testTargetFile = New-TemporaryFile
$testTarget | Out-File -FilePath $testTargetFile.FullName

# Set target
Write-Host "Setting SNS topic as the target for the test stage CloudWatch Events rule..."
aws events put-targets --rule $testRuleName --targets file://$testTargetFile.FullName --region $region

# Clean up
Remove-Item $tempFile.FullName
Remove-Item $targetFile.FullName
Remove-Item $testTempFile.FullName
Remove-Item $testTargetFile.FullName

Write-Host "`n✅ Notification setup completed!"
Write-Host "You will receive email notifications for:"
Write-Host "- Pipeline failures in any stage"
Write-Host "- Specific notifications for test stage failures"
Write-Host "`nMake sure to confirm the SNS subscription in your email."
