pipeline {
    agent { docker { image 'node:13.1.0-alpine' } }
    stages {
        stage('build') {
            steps {
                sh 'node --version'
            }
        }
    }
}