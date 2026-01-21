# Logrotate - Oscar

## Configuration

La rotation de log utilise le Logging Driver de Docker en mode 'json-file'
Elle est donc configurée dans `docker-compose.yml` :

Par exemple :

```yaml
logging:
  driver: "json-file"
  options:
    max-size: "2m"    # 2 MB
    max-file: "3"      # 3 fichiers
```

Dans ce cas, dès que le fichier de log dépasse 2 MB il est renommé id-cont.log.1
L'ancien id-cont.log.1 est renommé id-cont.log.2
L'ancien id-cont.log.2 est supprimé.

## Proof of Concept

Par exemple ;
```bash
root@iutnc-503-05:/var/lib/docker/containers/e2dc2c# ls -ll *.log*
-rw-r----- 1 root root 1786324 21 janv. 10:40 e2dc2c-json.log
-rw-r----- 1 root root 2000144 21 janv. 10:40 e2dc2c-json.log.1
-rw-r----- 1 root root 2000123 21 janv. 10:38 e2dc2c-json.log.2
```

On lance quelques requête pour dépasser les 2MB :

```bash
seq 1 5000 | xargs -P 50 -I {} curl -s http://localhost:3000 > /dev/null 2>&1
```

Puis on regarde de nouveau le poids des fichiers de logs :
```bash
root@iutnc-503-05:/var/lib/docker/containers/e2dc2c# ls -ll *.log*
-rw-r----- 1 root root  630646 21 janv. 10:40 e2dc2c-json.log
-rw-r----- 1 root root 2000144 21 janv. 10:40 e2dc2c-json.log.1
-rw-r----- 1 root root 2000123 21 janv. 10:38 e2dc2c-json.log.2
```

## Consulter les logs

Sur le disque, les logs sont dans :
```bash
/var/lib/docker/containers/${container_id}/
```

On peut connaitre l'id des conteneurs avec :
```bash
root@iutnc-503-05:/# docker ps
CONTAINER ID   IMAGE                   COMMAND                  CREATED          STATUS          PORTS                                             NAMES
e2dc2c2808c4   cv_builder-cv-builder   "/docker-entrypoint.…"   13 minutes ago   Up 13 minutes   0.0.0.0:3000->80/tcp, [::]:3000->80/tcp           cv-builder-app
4d4d071384d6   mongo-express:latest    "/sbin/tini -- /dock…"   13 minutes ago   Up 13 minutes   0.0.0.0:8081->8081/tcp, [::]:8081->8081/tcp       cv-builder-mongo-express
eb940fc83e20   cv_builder-backend      "docker-entrypoint.s…"   13 minutes ago   Up 13 minutes   0.0.0.0:5001->5000/tcp, [::]:5001->5000/tcp       cv-builder-backend
80c93e856789   mongo:7                 "docker-entrypoint.s…"   13 minutes ago   Up 13 minutes   0.0.0.0:27017->27017/tcp, [::]:27017->27017/tcp   cv-builder-mongo
```

Ensuite pour les visualiser (on peut utiliser le nom ou l'identifiant du conteneur) :
```bash
docker logs cv-builder-app
```
On peut aussi directement `tail`, `cat` ou `more` les fichiers .log.x