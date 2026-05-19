terraform {
  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = ">= 2.0.0"
    }
  }
}

provider "kubernetes" {
  config_path = "~/.kube/config" # Adjust to your k3s kubeconfig path on RHEL 9.7
}

resource "kubernetes_namespace" "production" {
  metadata {
    name = "production"
  }
}

resource "kubernetes_deployment" "k3s_backend_rhel" {
  metadata {
    name      = "k3s-rhel-9-7-backend"
    namespace = kubernetes_namespace.production.metadata[0].name
    labels = {
      app = "backend"
    }
  }
  spec {
    replicas = 2
    selector {
      match_labels = {
        app = "backend"
      }
    }
    template {
      metadata {
        labels = {
          app = "backend"
        }
      }
      spec {
        container {
          name  = "app-container"
          image = "nginx:alpine" # Replace with your actual image

          # Optimized resources based on FinOps analysis
          resources {
            requests = {
              cpu    = "500m"
              memory = "1Gi"
            }
            limits = {
              cpu    = "1000m"
              memory = "2Gi"
            }
          }
          
          port {
            container_port = 80
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "k3s_backend_service" {
  metadata {
    name      = "k3s-rhel-9-7-backend-svc"
    namespace = kubernetes_namespace.production.metadata[0].name
  }
  spec {
    selector = {
      app = kubernetes_deployment.k3s_backend_rhel.metadata[0].labels.app
    }
    port {
      port        = 80
      target_port = 80
    }
    type = "ClusterIP"
  }
}
