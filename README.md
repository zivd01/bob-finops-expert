# Bob - FinOps Expert Dashboard

This repository contains a sleek, containerized web dashboard designed for FinOps-to-DevOps visual analysis. It provides an interactive interface with resource usage gauges and expert recommendations, optimized for deployment on a Kubernetes (k3s) cluster running on RHEL 9.7.

## Project Structure

- **`index.html`**: The main structure of the dashboard UI.
- **`styles.css`**: Styling rules utilizing a light theme, CSS variables, and layout formatting.
- **`app.js`**: JavaScript logic for drawing the dynamic circular gauges on HTML5 Canvas elements.
- **`Dockerfile`**: Container definition using `nginx:alpine` to serve the static assets.
- **`k3s-dashboard.yaml`**: Kubernetes manifest containing a Deployment and NodePort Service for deploying the container to a k3s cluster.
- **`deployment.yaml`** / **`main.tf`**: Example workloads showing the implementation of the recommended FinOps resource optimization (reducing requests/limits).

## Running Locally

To preview the dashboard locally without containerization, simply open `index.html` in any modern web browser.

## Deploying to k3s

To deploy this dashboard to your k3s cluster, follow these steps on your RHEL 9.7 node:

### 1. Build the Docker Image
Build the container image using Docker or Containerd/Nerdctl.
```bash
# Using Docker
docker build -t finops-dashboard:latest .

# Using Nerdctl (if using containerd directly on k3s)
nerdctl build -t finops-dashboard:latest .
```

### 2. Apply the Kubernetes Manifest
Deploy the application and service to your cluster:
```bash
kubectl apply -f k3s-dashboard.yaml
```

### 3. Access the Dashboard
Find the auto-assigned NodePort for the service:
```bash
kubectl get svc finops-dashboard-svc
```
Navigate to `http://<your-node-ip>:<node-port>` in your web browser.

## Customization

- To change the gauge values, edit the percentage values passed to the `drawGauge` function in `app.js`.
- To update the FinOps recommendations, modify the text within the `.analysis-section` in `index.html`.
