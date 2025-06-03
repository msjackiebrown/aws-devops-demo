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

        stage('CodeBuild Local Build') {
            steps {
                sh '''
                    curl -O https://raw.githubusercontent.com/aws/aws-codebuild-docker-images/master/local_builds/codebuild_build.sh
                    chmod +x ./codebuild_build.sh
                    sed -i 's/-it /-i /' codebuild_build.sh
                    ./codebuild_build.sh -i public.ecr.aws/codebuild/amazonlinux2-x86_64-standard:5.0 -a ./artifacts -b buildspec.yml
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