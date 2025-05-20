# Setup AWS CodePipeline with separate test and build phases
# This script helps configure the AWS CodePipeline for the project

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
$gitHubOwner = Read-Host -Prompt "Enter GitHub owner/organization name"
$gitHubRepo = Read-Host -Prompt "Enter GitHub repository name"
$gitHubBranch = Read-Host -Prompt "Enter GitHub branch name (default: main)" -Default "main"
$noGitHubConnection = $false

# Create S3 bucket for artifacts if needed
$bucketName = "$projectName-artifacts-$account-$region"
Write-Host "Creating S3 bucket for artifacts: $bucketName"

try {
    aws s3api head-bucket --bucket $bucketName 2>&1 | Out-Null
    Write-Host "Bucket already exists."
}
catch {
    Write-Host "Creating new bucket..."
    aws s3 mb "s3://$bucketName" --region $region
    aws s3api put-bucket-versioning --bucket $bucketName --versioning-configuration Status=Enabled
}

# Create CodeBuild projects
Write-Host "`nCreating CodeBuild projects..."

# Test project
$testProjectName = "$projectName-test"
$testProject = aws codebuild batch-get-projects --names $testProjectName | ConvertFrom-Json

if ($testProject.projects.Count -eq 0) {
    Write-Host "Creating test project: $testProjectName"
    
    aws codebuild create-project `
        --name $testProjectName `
        --description "Test phase for $projectName" `
        --source "{""type"": ""CODEPIPELINE"", ""buildspec"": ""testspec.yml""}" `
        --artifacts "{""type"": ""CODEPIPELINE""}" `
        --environment "{""type"": ""LINUX_CONTAINER"", ""image"": ""aws/codebuild/amazonlinux2-x86_64-standard:4.0"", ""computeType"": ""BUILD_GENERAL1_SMALL"", ""privilegedMode"": false}" `
        --service-role "arn:aws:iam::$account:role/service-role/codebuild-$projectName-service-role" `
        --logs-config "{""cloudWatchLogs"": {""status"": ""ENABLED"", ""groupName"": ""/aws/codebuild/$testProjectName""}}" `
        --region $region
}
else {
    Write-Host "Test project already exists: $testProjectName"
}

# Build project
$buildProjectName = "$projectName-build"
$buildProject = aws codebuild batch-get-projects --names $buildProjectName | ConvertFrom-Json

if ($buildProject.projects.Count -eq 0) {
    Write-Host "Creating build project: $buildProjectName"
    
    aws codebuild create-project `
        --name $buildProjectName `
        --description "Build phase for $projectName" `
        --source "{""type"": ""CODEPIPELINE"", ""buildspec"": ""buildspec.yml""}" `
        --artifacts "{""type"": ""CODEPIPELINE""}" `
        --environment "{""type"": ""LINUX_CONTAINER"", ""image"": ""aws/codebuild/amazonlinux2-x86_64-standard:4.0"", ""computeType"": ""BUILD_GENERAL1_SMALL"", ""privilegedMode"": false}" `
        --service-role "arn:aws:iam::$account:role/service-role/codebuild-$projectName-service-role" `
        --logs-config "{""cloudWatchLogs"": {""status"": ""ENABLED"", ""groupName"": ""/aws/codebuild/$buildProjectName""}}" `
        --region $region
}
else {
    Write-Host "Build project already exists: $buildProjectName"
}

# Create CodePipeline
$pipelineName = "$projectName-pipeline"
$pipeline = aws codepipeline get-pipeline --name $pipelineName 2>&1

if ($pipeline -match "ResourceNotFoundException") {
    Write-Host "`nCreating CodePipeline: $pipelineName"
    
    # Create pipeline JSON definition
    $pipelineConfig = @"
{
    "pipeline": {
        "name": "$pipelineName",
        "roleArn": "arn:aws:iam::$account:role/service-role/AWSCodePipelineServiceRole-$region-$pipelineName",
        "artifactStore": {
            "type": "S3",
            "location": "$bucketName"
        },
        "stages": [
            {
                "name": "Source",
                "actions": [
                    {
                        "name": "Source",
                        "actionTypeId": {
                            "category": "Source",
                            "owner": "AWS", 
                            "provider": "CodeStarSourceConnection", 
                            "version": "1"
                        },
                        "configuration": {
                            "ConnectionArn": "arn:aws:codestar-connections:$region:$account:connection/YOUR_CONNECTION_ID",
                            "FullRepositoryId": "$gitHubOwner/$gitHubRepo",
                            "BranchName": "$gitHubBranch"
                        },
                        "outputArtifacts": [
                            {
                                "name": "SourceCode"
                            }
                        ],
                        "region": "$region"
                    }
                ]
            },
            {
                "name": "Test",
                "actions": [
                    {
                        "name": "Test",
                        "actionTypeId": {
                            "category": "Build",
                            "owner": "AWS",
                            "provider": "CodeBuild",
                            "version": "1"
                        },
                        "configuration": {
                            "ProjectName": "$testProjectName"
                        },
                        "inputArtifacts": [
                            {
                                "name": "SourceCode"
                            }
                        ],
                        "outputArtifacts": [
                            {
                                "name": "TestOutput"
                            }
                        ],
                        "region": "$region"
                    }
                ]
            },
            {
                "name": "Build",
                "actions": [
                    {
                        "name": "Build",
                        "actionTypeId": {
                            "category": "Build",
                            "owner": "AWS",
                            "provider": "CodeBuild",
                            "version": "1"
                        },
                        "configuration": {
                            "ProjectName": "$buildProjectName",
                            "PrimarySource": "SourceCode"
                        },
                        "inputArtifacts": [
                            {
                                "name": "SourceCode"
                            },
                            {
                                "name": "TestOutput"
                            }
                        ],
                        "outputArtifacts": [
                            {
                                "name": "BuildOutput"
                            }
                        ],
                        "region": "$region"
                    }
                ]
            }
        ]
    }
}
"@
    
    # Save to temp file
    $tempFile = New-TemporaryFile
    $pipelineConfig | Out-File -FilePath $tempFile.FullName

    # Create pipeline
    Write-Host "Creating CI/CD pipeline..."
    aws codepipeline create-pipeline --cli-input-json "file://$($tempFile.FullName)" --region $region

    # Clean up
    Remove-Item $tempFile.FullName
}
else {
    Write-Host "`nCodePipeline already exists: $pipelineName"
}

Write-Host "`n✅ Setup completed!"
Write-Host "IMPORTANT: Before using the pipeline, you need to:"
Write-Host "1. Create a CodeStar Connection to your GitHub account in the AWS Console"
Write-Host "2. Update the ConnectionArn in the pipeline configuration"
Write-Host "3. Create the necessary IAM roles if they don't exist already"
Write-Host "   - Service role for CodeBuild: codebuild-$projectName-service-role"
Write-Host "   - Service role for CodePipeline: AWSCodePipelineServiceRole-$region-$pipelineName"
Write-Host "`nTo update the pipeline with these changes, use AWS Console or AWS CLI."
