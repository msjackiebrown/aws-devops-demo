// Jenkinsfile
pipeline {
    agent any

    environment {
        // Set any required environment variables here
        // Example: AWS_DEFAULT_REGION = 'us-east-1'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Verify buildspec.yml') {
            steps {
                sh '''
                    echo "Current directory: $(pwd)"
                    ls -l
                    cat buildspec.yml
                '''
            }
        }

        stage('CodeBuild Local Build') {
            steps {
                sh '''
                    # Download the official CodeBuild local build script
                    curl -O https://raw.githubusercontent.com/aws/aws-codebuild-docker-images/master/local_builds/codebuild_build.sh
                    chmod +x ./codebuild_build.sh

                    # Patch the script to remove -t (no TTY in Jenkins)
                    sed -i 's/-it /-i /' codebuild_build.sh

                    # Run CodeBuild Local using the standard image
                    ./codebuild_build.sh -i aws/codebuild/standard:7.0 -a ./artifacts -b buildspec.yml
                '''
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished.'
        }
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}