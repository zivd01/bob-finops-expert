# ---------------------------------------------------------
# FinOps Dashboard Dockerfile
# ---------------------------------------------------------
# We use the official lightweight Nginx image based on Alpine Linux.
# Alpine is chosen for its extremely small footprint, reducing the 
# attack surface and saving storage space/bandwidth.
FROM nginx:alpine

# The default directory where Nginx serves static files is /usr/share/nginx/html.
# We copy our three frontend files directly into this directory.
# These files do not require a build step (like Node/React) as they are vanilla HTML/JS/CSS.
COPY index.html /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/
COPY app.js /usr/share/nginx/html/

# Expose port 80 to the Docker host so traffic can be routed into the Nginx server
EXPOSE 80

# Start Nginx in the foreground so the container does not exit immediately.
# 'daemon off' is required for Nginx to run inside a Docker container.
CMD ["nginx", "-g", "daemon off;"]
