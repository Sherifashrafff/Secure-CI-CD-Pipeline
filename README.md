# my-jenkins-app

A React application with a fully automated secure CI/CD pipeline powered by Jenkins and deployed to AWS ECS Fargate.

---

## Tech Stack

- **Frontend:** React 18
- **CI/CD:** Jenkins (webhook-triggered)
- **Containerization:** Docker + Nginx Alpine
- **Registry:** AWS ECR
- **Deployment:** AWS ECS Fargate

---

## Pipeline Overview

The pipeline is triggered automatically via a **GitHub Webhook** on every push. Jenkins runs the following stages:

| # | Stage | Description |
|---|---|---|
| 1 | Secrets Scan | Scans source code for hardcoded secrets using Gitleaks |
| 2 | SAST - Semgrep | Static application security testing with OWASP and security-audit rules, outputs SARIF report |
| 3 | Unit Tests | Runs `npm run test:ci` inside a Node.js container, publishes JUnit results |
| 4 | SCA Scanning | Scans dependencies for known vulnerabilities using Snyk |
| 5 | Build | Runs `npm run build` inside a Node.js container |
| 6 | E2E Tests | Runs Playwright end-to-end tests against the production build, publishes JUnit results |
| 7 | Build Docker Image | Builds a Docker image tagged with `BUILD_NUMBER` |
| 8 | Trivy Scan | Scans the Docker image for HIGH and CRITICAL CVEs before pushing |
| 9 | Push to ECR | Authenticates to AWS ECR and pushes `ECR_REPO:BUILD_NUMBER` |
| 10 | Deploy to ECS | Updates `image.json` with the new tag, registers the ECS task definition, and runs a Fargate task |

---

## Project Structure

```
├── src/                  # React source code
├── public/               # Static assets
├── e2e/                  # Playwright E2E tests
├── Dockerfile            # Nginx-based production image
├── Jenkinsfile           # CI/CD pipeline definition
├── image.json            # ECS task definition input
└── package.json
```

---

## Infrastructure

| Resource | Value |
|---|---|
| AWS Region | `<your-aws-region>` |
| ECR Repository | `<your-account-id>.dkr.ecr.<your-aws-region>.amazonaws.com/<your-ecr-repo>` |
| ECS Cluster | `<your-ecs-cluster>` |
| Task Family | `<your-task-family>` |
| Launch Type | Fargate |
| CPU / Memory | 256 / 512 |

---

## Local Development

```bash
npm install
npm start        # dev server at http://localhost:3000
npm test         # unit tests
npm run build    # production build
```

---

## CI/CD Setup Requirements

- Jenkins with Docker available on the agent
- AWS credentials stored in Jenkins as `my-aws` (username = Access Key ID, password = Secret Access Key)
- GitHub Webhook pointing to `http://<jenkins-host>/github-webhook/`
- ECR repository and ECS cluster already provisioned in AWS
