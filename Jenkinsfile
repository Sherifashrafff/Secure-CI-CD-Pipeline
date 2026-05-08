pipeline {
    agent any

    environment {
        ECR_REGISTRY = '<ACCOUNT_ID>.dkr.ecr.<AWS_REGION>.amazonaws.com'
        ECR_REPO     = '<ECR_REPO>'
        AWS_REGION   = '<AWS_REGION>'
    }

    stages {

        stage('Secrets Scan') {
            steps {
                sh '''
                    docker run --rm \
                        -v $(pwd):/app \
                        zricethezav/gitleaks:latest \
                        dir -v /app
                '''
            }
        }

        stage('SAST - Semgrep') {
            steps {
                sh '''
                    docker run --rm \
                        -v $WORKSPACE:/src \
                        -w /src \
                        semgrep/semgrep \
                        semgrep --config=p/security-audit \
                                --config=p/owasp-top-ten \
                                --sarif --output=/src/semgrep.sarif \
                                --severity=ERROR \
                                --error \
                                .
                '''
            }
            post {
                always {
                    archiveArtifacts artifacts: 'semgrep.sarif', allowEmptyArchive: true
                }
            }
        }

        stage('Unit Tests') {
            steps {
                sh '''
                    docker run --rm \
                        --network=host \
                        -v $WORKSPACE:/app \
                        -w /app \
                        node:20-alpine \
                        sh -c "npm config set registry https://registry.npmmirror.com && npm ci --no-audit --no-fund && npm run test:ci"
                '''
            }
            post {
                always {
                    junit allowEmptyResults: true, testResults: 'jest-results/junit.xml'
                }
            }
        }

        stage('SCA Scanning') {
            environment {
                SNYK_TOKEN = credentials('SNYK_TOKEN')
            }
            steps {
                sh '''
                    docker run --rm \
                        -e SNYK_TOKEN=$SNYK_TOKEN \
                        -v $(pwd):/app \
                        -w /app \
                        --entrypoint="" \
                        snyk/snyk:docker \
                        snyk test --severity-threshold=high
                '''
            }
        }

        stage('Build') {
            steps {
                sh '''
                    docker run --rm \
                        --network=host \
                        -v $WORKSPACE:/app \
                        -w /app \
                        node:20-alpine \
                        sh -c "npm config set registry https://registry.npmmirror.com && npm run build"
                '''
            }
        }

        stage('E2E Tests') {
            steps {
                sh '''
                    docker run --rm \
                        --network=host \
                        -v $WORKSPACE:/app \
                        -w /app \
                        mcr.microsoft.com/playwright:v1.39.0-jammy \
                        sh -c "npx serve -s build -l 3000 & npx wait-on http://localhost:3000 && npx playwright test"
                '''
            }
            post {
                always {
                    junit allowEmptyResults: true, testResults: 'playwright-results/junit.xml'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $ECR_REPO:$BUILD_NUMBER .'
            }
        }

        stage('Trivy Scan') {
            steps {
                sh '''
                    docker run --rm \
                        -v /var/run/docker.sock:/var/run/docker.sock \
                        aquasec/trivy:latest image \
                        --exit-code 1 \
                        --severity HIGH,CRITICAL \
                        $ECR_REPO:$BUILD_NUMBER
                '''
            }
        }

        stage('Push to ECR') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'my-aws',
                    passwordVariable: 'AWS_SECRET_ACCESS_KEY',
                    usernameVariable: 'AWS_ACCESS_KEY_ID'
                )]) {
                    sh '''
                        docker run --rm \
                            -e AWS_ACCESS_KEY_ID \
                            -e AWS_SECRET_ACCESS_KEY \
                            amazon/aws-cli:latest \
                            ecr get-login-password --region $AWS_REGION \
                        | docker login --username AWS --password-stdin $ECR_REGISTRY

                        docker tag $ECR_REPO:$BUILD_NUMBER $ECR_REGISTRY/$ECR_REPO:$BUILD_NUMBER
                        docker push $ECR_REGISTRY/$ECR_REPO:$BUILD_NUMBER
                    '''
                }
            }
        }

        stage('Deploy to ECS') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'my-aws',
                    passwordVariable: 'AWS_SECRET_ACCESS_KEY',
                    usernameVariable: 'AWS_ACCESS_KEY_ID'
                )]) {
                    sh '''
                        sed -i "s|$ECR_REGISTRY/$ECR_REPO:[0-9a-zA-Z._-]*|$ECR_REGISTRY/$ECR_REPO:$BUILD_NUMBER|" image.json

                        SG_ID=<SECURITY_GROUP_ID>

                        SUBNET_ID=$(docker run --rm \
                            -e AWS_ACCESS_KEY_ID \
                            -e AWS_SECRET_ACCESS_KEY \
                            amazon/aws-cli:latest ec2 describe-subnets \
                            --filters "Name=default-for-az,Values=true" \
                            --query "Subnets[0].SubnetId" --output text \
                            --region $AWS_REGION)

                        docker run --rm \
                            -e AWS_ACCESS_KEY_ID \
                            -e AWS_SECRET_ACCESS_KEY \
                            -v $(pwd):/work -w /work \
                            amazon/aws-cli:latest ecs register-task-definition \
                            --cli-input-json file://image.json \
                            --region $AWS_REGION

                        docker run --rm \
                            -e AWS_ACCESS_KEY_ID \
                            -e AWS_SECRET_ACCESS_KEY \
                            amazon/aws-cli:latest ecs run-task \
                            --cluster <ECS_CLUSTER> \
                            --task-definition <TASK_FAMILY> \
                            --launch-type FARGATE \
                            --network-configuration "awsvpcConfiguration={subnets=[$SUBNET_ID],securityGroups=[$SG_ID],assignPublicIp=ENABLED}" \
                            --region $AWS_REGION
                    '''
                }
            }
        }
    }
}
