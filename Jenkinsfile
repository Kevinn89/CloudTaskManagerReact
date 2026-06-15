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
        NODE_IMAGE = 'node:22-alpine'
    }

    stages {
        stage('Verify Project Files') {
            steps {
                sh '''
                    test -f package.json
                    test -f package-lock.json
                    test -f Dockerfile
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    docker run --rm \
                      -v "$PWD":/app \
                      -w /app \
                      "${NODE_IMAGE}" \
                      sh -c "node --version && npm --version && npm ci"
                '''
            }
        }

        stage('Run Tests') {
            steps {
                sh '''
                    docker run --rm \
                      -v "$PWD":/app \
                      -w /app \
                      "${NODE_IMAGE}" \
                      sh -c "npm test -- --run"
                '''
            }
        }

        stage('Build React App') {
            steps {
                sh '''
                    docker run --rm \
                      -v "$PWD":/app \
                      -w /app \
                      -e VITE_API_BASE_URL="${VITE_API_BASE_URL}" \
                      "${NODE_IMAGE}" \
                      sh -c "npm run build"
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