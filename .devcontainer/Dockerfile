# Use the official Node.js image as base
FROM mcr.microsoft.com/devcontainers/javascript-node:22-bullseye

# Install additional tools that might be useful for web development
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
        git \
        curl \
        wget \
        zip \
        unzip \
        build-essential \
    && apt-get autoremove -y && apt-get clean -y

# Install global npm packages commonly used with web development
RUN npm install -g \
    prettier \
    typescript \
    serve \
    npm@latest

# Create workspace directory
WORKDIR /workspaces

# Set the default shell to bash for better compatibility
SHELL ["/bin/bash", "-c"]

# Add helpful aliases
RUN echo 'alias ll="ls -la"' >> /home/node/.bashrc \
    && echo 'alias astro-dev="npm run dev"' >> /home/node/.bashrc \
    && echo 'alias astro-build="npm run build"' >> /home/node/.bashrc \
    && echo 'alias astro-preview="npm run preview"' >> /home/node/.bashrc

# Ensure node user owns the workspace
RUN chown -R node:node /workspaces

USER node
