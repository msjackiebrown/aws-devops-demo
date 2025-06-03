// Jenkinsfile
pipeline {
    agent any // or a standard agent, NOT the CodeBuild Local image

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
        stage('Run CodeBuild Local') {
            steps {
                sh '''
                    # Download the official CodeBuild local build script
                    curl -O https://raw.githubusercontent.com/aws/aws-codebuild-docker-images/master/local_builds/codebuild_build.sh
                    chmod +x ./codebuild_build.sh

                    # Patch the script to remove -t (no TTY in Jenkins)
                    sed -i 's/-it /-i /' codebuild_build.sh

                    # Run CodeBuild Local using the correct build image
                    ./codebuild_build.sh -i public.ecr.aws/codebuild/standard:7.0-1.0 -a ./artifacts -b buildspec.yml
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