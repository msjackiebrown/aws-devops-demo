// Jenkinsfile
pipeline {
    agent any // or a standard agent, NOT the CodeBuild Local image

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            agent {
                docker {
                    image 'nodejs:18'
                }
            }

            steps {
                sh '''
                    npm install
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