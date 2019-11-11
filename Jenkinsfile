pipeline {
    agent { docker { image 'node:13-alpine' } }
    stages {
        stage('Test') {
            steps {
                sh 'yarn'
                sh 'yarn test'
            }
        }
    }
}