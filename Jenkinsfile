// ====================================================================
// CORRECTED JENKINS PIPELINE
// ====================================================================
// This pipeline builds a single application image and deploys it
// using the provided docker-compose.yml file.
// ====================================================================
pipeline {
    agent any

    environment {
        // 🔹 Docker Hub credential (Username with password)
        DOCKER_HUB = credentials('dockerhub-name')
        
        // 🔹 SSH Key to EC2
        SERVER_SSH_KEY = credentials('server-ssh-key')

        // 🔹 Host EC2
        SERVER_HOST = '3.106.188.212'
        SERVER_USERNAME = 'ubuntu'

        // 🔹 Docker Hub repo name and image name
        DOCKER_USERNAME = 'phamvantien'
        // *** THAY ĐỔI 1: Tên image phải khớp với docker-compose.yml ***
        DOCKER_IMAGE_NAME = 'sell-project' 
    }

    stages {
        stage('Checkout source code') {
            steps {
                echo "📦 Checking out source code..."
                checkout scm
            }
        }

        stage('Build Docker image') { // *** THAY ĐỔI 2: Chỉ build 1 image ***
            steps {
                echo "🧱 Building Docker image..."
                sh '''
                echo "--- Listing files in workspace ---"
                ls -la
                echo "------------------------------------"
                # Build the single application image from the root Dockerfile
                # Tên image phải là phamvantien/sell-project:latest
                docker build --no-cache -t $DOCKER_USERNAME/$DOCKER_IMAGE_NAME:latest .
                '''
            }
        }

        stage('Push image to Docker Hub') { // *** THAY ĐỔI 3: Chỉ push 1 image ***
            steps {
                echo "🐳 Logging in & pushing image to Docker Hub..."
                sh '''
                echo $DOCKER_HUB_PSW | docker login -u $DOCKER_HUB_USR --password-stdin

                docker push $DOCKER_USERNAME/$DOCKER_IMAGE_NAME:latest
                '''
            }
        }

        stage('Deploy to EC2 Server') {
            steps {
                echo "🚀 Deploying to EC2..."
                sshagent (credentials: ['server-ssh-key']) {
                    sh '''
                    ssh -o StrictHostKeyChecking=no ${SERVER_USERNAME}@${SERVER_HOST} "
                    set -e
                    echo '📂 Moving to project directory...'
                    # Tạo thư mục chứa code và docker-compose.yml
                    mkdir -p ~/sell-project-prod
                    cd ~/sell-project-prod

                    # *** QUAN TRỌNG: Đảm bảo file docker-compose.yml và .env.prod tồn tại ở đây ***
                    # Bạn cần phải tự tạo 2 file này trên server trước.

                    echo '🐳 Pulling latest image from Docker Hub...'
                    # *** THAY ĐỔI 4: Chỉ pull 1 image ***
                    docker pull $DOCKER_USERNAME/$DOCKER_IMAGE_NAME:latest

                    echo '🛑 Stopping old containers...'
                    docker compose down || true

                    echo '🔥 Starting new containers...'
                    # Lệnh này sẽ tự động đọc file docker-compose.yml
                    docker compose up -d

                    echo '🧹 Cleaning old images...'
                    docker image prune -f
                    "
                    '''
                }
            }
        }
    }

    post {
        always {
            echo "🧼 Cleanup..."
            sh 'docker logout || true'
        }
    }
}