FROM jenkins/jenkins:lts
# Passer en root pour installer les paquets
USER root

# Installation du client Docker et de Python pour Ansible
# Nous regroupons tout en un seul RUN pour optimiser la taille de l'image
RUN apt-get update && \
    apt-get install -y \
    docker.io \
    python3 \
    python3-venv \
    python3-pip && \
    rm -rf /var/lib/apt/lists/* && \
    git config --global --add safe.directory '*' && \
    # Création du virtualenv pour Ansible dans /opt/ansible-venv
    python3 -m venv /opt/ansible-venv && \
    /opt/ansible-venv/bin/pip install --upgrade pip && \
    /opt/ansible-venv/bin/pip install ansible && \
    # Ajout de l'utilisateur jenkins au groupe docker
    usermod -aG docker jenkins

USER jenkins
