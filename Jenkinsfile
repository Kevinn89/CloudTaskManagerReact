pipeline {
    agent any

    options {
        timestamps()
        ansiColor('xterm')
    }

    environment {
        DOCKER_REGISTRY = 'localhost:5002'
        DOCKER_IMAGE = 'cloud-task-manager-react'
        VITE_API_BASE_URL = 'http://localhost:8081'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Validate Docker') {
            steps {
                sh '''
                    docker version
                    docker info
                '''
            }
        }

        stage('NPM Install') {
            steps {
                sh '''
                    node --version
                    npm --version
                    npm ci
                '''
            }
        }

        stage('Unit and Integration Tests') {
            steps {
                sh '''
                    npm test -- --run
                '''
            }
        }

        stage('React Build') {
            steps {
                sh '''
                    npm run build
                '''
            }
        }

        stage('Publish Docker Image') {
            steps {
                sh '''
                    IMAGE_TAG="${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${BUILD_NUMBER}"
                    LATEST_TAG="${DOCKER_REGISTRY}/${DOCKER_IMAGE}:latest"

                    docker build \
                        --build-arg VITE_API_BASE_URL="${VITE_API_BASE_URL}" \
                        -t "${IMAGE_TAG}" \
                        -t "${LATEST_TAG}" \
                        .

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
    }
}
