# Bob - FinOps Expert Dashboard

This repository contains a sleek, containerized, enterprise-grade web dashboard designed for FinOps-to-DevOps visual analysis. It provides an interactive interface to parse cloud telemetry exports, calculates resource wastage, and provides AI-driven, actionable right-sizing recommendations.

Optimized for **k3s environments running on RHEL 9.7**, the architecture is fully client-side and serverless, relying on robust ES6 classes and a custom zero-dependency CSV state machine parser.

## Core Capabilities

- 🧠 **Dynamic FinOps Analysis**: Extracts actual `limits` vs `requests` from your telemetry to dynamically calculate exact wastage percentages.
- 💬 **Conversational AI Guide**: A built-in chat interface that breaks down complex FinOps insights into simple analogies, including what to do and how it impacts performance.
- 🌍 **GreenOps & Sustainability**: Translates wasted CPU/Memory capacity into estimated Carbon Footprint (CO2) savings.
- 📉 **Purchasing Model Recommendations**: Automatically detects stateless workloads and suggests advanced FinOps optimizations like Spot Node Pools.
- 🏗️ **Infrastructure as Code (IaC)**: Generates precise, copy-pasteable Terraform configuration snippets tailored to the recommended resource limits.

## Project Structure

```text
bob-finops-expert/                      # Root project directory for the FinOps Expert Dashboard
├── .git/                               # Git version control directory
├── tests/                              # Directory containing automated E2E test suites
│   └── finops-dashboard.spec.js        # Playwright UI test script to validate dashboard behavior
├── index.html                          # Main HTML structure and dynamic DOM injection targets
├── styles.css                          # Premium visual styling, dynamic chat tags, and layout
├── app.js                              # Core business logic: SOLID architecture, CSV state machine, AI Chat
├── deploy_k3s.sh                       # Automated bash script for building and deploying to k3s on RHEL 9
├── Dockerfile                          # Defines the lightweight nginx:alpine-slim container image
├── k3s-dashboard.yaml                  # Kubernetes manifest defining the Deployment and NodePort Service
├── deployment.yaml                     # Example Kubernetes workload for testing IaC right-sizing
├── main.tf                             # Example Terraform configuration for testing IaC right-sizing
├── test_data.csv                       # Mock telemetry CSV data used to validate the parsing engine
└── README.md                           # Comprehensive documentation and automated deployment guide
```

## Architecture Diagram

```text
+-------------------------------------------------------------+
|                     User / Analyst Environment              |
|                                                             |
|   +-------------------+         +-----------------------+   |
|   |  Browser Client   |         | Local CSV/JSON File   |   |
|   | (FinOps Dashboard)| <...... | (Cloudability/Turbo)  |   |
|   +---------+---------+         +-----------------------+   |
|             |                                               |
+-------------|-----------------------------------------------+
              |
              | (HTTP Request / NodePort 3xxxx)
              v
+-------------------------------------------------------------+
|                 k3s Kubernetes Cluster (RHEL 9.7)           |
|                                                             |
|   +-----------------------------------------------------+   |
|   |  finops-dashboard-svc (NodePort Service)            |   |
|   +-------------------------+---------------------------+   |
|                             |                               |
|                             v                               |
|   +-----------------------------------------------------+   |
|   |  Deployment: finops-dashboard (Pod)                 |   |
|   |  +-----------------------------------------------+  |   |
|   |  | Container: nginx:alpine-slim                  |  |   |
|   |  |  - Serves index.html, styles.css, app.js      |  |   |
|   |  +-----------------------------------------------+  |   |
|   +-----------------------------------------------------+   |
+-------------------------------------------------------------+

**Execution Flow**:
1. User accesses the k3s NodePort URL via their web browser.
2. The `nginx` container inside the k3s Pod serves the static client-side application.
3. The User uploads a telemetry CSV/JSON file directly into the Browser.
4. `app.js` (`FinOpsDataParser`) processes the file entirely locally in-memory (zero backend dependencies).
5. `app.js` (`UIController` & `GaugeRenderer`) updates the DOM with right-sizing recommendations and dynamically generates the Terraform (IaC) configuration snippet.
```

## Running Locally

To preview the dashboard without any cluster infrastructure, simply double-click `index.html` to open it in any modern web browser.

## Automated Deployment (k3s / RHEL 9)

We have streamlined the deployment process specifically for RHEL 9 k3s environments. You do not need to push to an external container registry.

1. Ensure the script has execution permissions:
   ```bash
   chmod +x deploy_k3s.sh
   ```
2. Run the automated installer:
   ```bash
   ./deploy_k3s.sh
   ```

The script will automatically detect `podman` or `docker`, build the `nginx:alpine-slim` image, import it directly into the k3s containerd socket, apply the `k3s-dashboard.yaml` manifest, and output the dynamic NodePort URL.

## Running UI Tests

To run the automated UI tests to verify the dashboard components and AI Chat sequencing:

```bash
npm init -y
npm init playwright@latest
npx playwright test tests/finops-dashboard.spec.js --headed
```
