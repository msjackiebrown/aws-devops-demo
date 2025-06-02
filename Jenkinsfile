// Jenkinsfile
pipeline {
    agent any

    environment {
        // Define environment variables here if needed
        // EXAMPLE_VAR = 'value'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            agent {
                docker: {
                    image: 'codebuild/standard:latest'
                }
            }
            steps {
                echo 'Building the project...'
                sh '''
                ./codebuild.sh buildspec.yml
                ''' 
                // sh 'make build'
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests...'
                // Add your test commands here, e.g.:
                // sh 'make test'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying the application...'
                // Add your deploy commands here, e.g.:
                // sh 'make deploy'
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