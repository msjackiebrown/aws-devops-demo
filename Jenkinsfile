// Jenkinsfile
pipeline {
    agent any

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
            agent (
                docker {
                    image 'public.ecr.aws/codebuild/local-builds:latest'
                    args '-v /var/run/docker.sock:/var/run/docker.sock -v $HOME/.aws:/root/.aws -v $WORKSPACE:/workspace'
                }
            )
            steps {
                sh ''''
                    # Run CodeBuild Local using the standard image
                    ./codebuild_build.sh -i public.ecr.aws/codebuild/standard:7.0 -a ./artifacts -b buildspec.yml
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