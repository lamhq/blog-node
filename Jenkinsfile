pipeline {
    agent any
    stages {
        stage('Test') {
            agent {
                docker { image 'node:13-alpine' }
            }
            steps {
                sh 'jenkins/test.sh'
            }
        }
    }
}