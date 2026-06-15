pipeline {
    agent any

    options {
        timestamps()
        ansiColor('xterm')
    }

    environment {
        DOCKER_REGISTRY = '127.0.0.1:5001'
        DOCKER_IMAGE = 'cloud-task-manager-react'
        VITE_API_BASE_URL = 'http://localhost:8081'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Validate Tooling') {
            steps {
                sh '''
                    node --version
                    npm --version
                    docker version
                    docker info
                '''
            }
        }
        stage('Install Dependencies') {
            steps {
                sh '''
                    npm ci
                '''
            }
        }

        stage('Run Tests') {
            steps {
                sh '''
                    npm test -- --run
                '''
            }
        }

        stage('Build React App') {
            steps {
                sh '''
                    npm run build
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    IMAGE_TAG="${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${BUILD_NUMBER}"
                    LATEST_TAG="${DOCKER_REGISTRY}/${DOCKER_IMAGE}:latest"

                    docker build \
                      --build-arg VITE_API_BASE_URL="${VITE_API_BASE_URL}" \
                      -t "${IMAGE_TAG}" \
                      -t "${LATEST_TAG}" \
                      .
                '''
            }
        }

        stage('Push Docker Image') {
            steps {
                sh '''
                    IMAGE_TAG="${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${BUILD_NUMBER}"
                    LATEST_TAG="${DOCKER_REGISTRY}/${DOCKER_IMAGE}:latest"

                    docker push "${IMAGE_TAG}"
                    docker push "${LATEST_TAG}"
                '''
            }
        }

        stage('Verify Registry Pull') {
            steps {
                sh '''
                    IMAGE_TAG="${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${BUILD_NUMBER}"

                    docker image rm "${IMAGE_TAG}" || true
                    docker pull "${IMAGE_TAG}"
                '''
            }
        }
    }

    post {
        success {
            echo 'React CI pipeline passed.'
        }

        failure {
            echo 'React CI pipeline failed.'
        }

        always {
            sh '''
                docker image prune -f || true
            '''
        }
    }
}
