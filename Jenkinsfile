pipeline {
    agent { docker { image 'node:13-alpine' } }
    stages {
        stage('build') {
            steps {
                sh 'node --version'
            }
        }
    }
}