FROM jenkins/jenkins:lts
# Passer en root pour installer les paquets
USER root

# Installation du client Docker, Python, kubectl et nettoyage
RUN apt-get update && \
    apt-get install -y \
    docker.io \
    python3 \
    python3-venv \
    python3-pip \
    curl && \
    # --- Installation de kubectl ---
    curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" && \
    chmod +x kubectl && \
    mv kubectl /usr/local/bin/ && \
    # --- Nettoyage pour réduire la taille ---
    rm -rf /var/lib/apt/lists/* && \
    # --- Configuration Git ---
    git config --global --add safe.directory '*' && \
    # --- Création du virtualenv pour Ansible ---
    python3 -m venv /opt/ansible-venv && \
    /opt/ansible-venv/bin/pip install --upgrade pip && \
    /opt/ansible-venv/bin/pip install ansible && \
    # --- Gestion des permissions ---
    usermod -aG docker jenkins

USER jenkins
