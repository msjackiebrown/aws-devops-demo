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
                script {
                    // Pull the latest CodeBuild local agent image (optional, for freshness)
                    sh 'docker pull public.ecr.aws/codebuild/local-builds:latest'

                    // Run the buildspec using the local agent
                    sh '''
                    docker run --rm -t \
                        -v "$PWD":/LocalBuild \
                        -e IMAGE_NAME=aws/codebuild/standard:7.0 \
                        -e ARTIFACTS=/LocalBuild/artifacts \
                        -e SOURCE=/LocalBuild \
                        public.ecr.aws/codebuild/local-builds:latest
                    '''
                }
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