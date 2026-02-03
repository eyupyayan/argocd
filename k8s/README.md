# Kubernetes + Argo CD Læringsprosjekt

Dette prosjektet er laget for å lære **hele flyten** rundt moderne container- og Kubernetes-drift:

- Lage egen applikasjon
- Bygge Docker-image
- Publisere image til registry
- Deploye til Kubernetes med YAML
- Bruke ConfigMap og Secret
- Eksponere app med Service / Ingress
- Bruke **Argo CD (GitOps)** til automatisk deploy
- Forstå hvordan endringer i Git påvirker klyngen

Prosjektet er ment som en **praktisk læringslab**, ikke produksjon.

---

## Mål

Når du er ferdig skal du forstå:

- Hva en **Pod, Deployment og Service** er
- Hvordan **ConfigMap** og **Secret** brukes
- Hvordan Docker-images bygges og pushes
- Hvordan **GitOps** fungerer med Argo CD
- Hvordan rulle ut nye versjoner av en app
- Grunnleggende feilsøking i Kubernetes

---

## Krav / Forutsetninger

- Windows med **WSL2**
- **Docker Desktop** (Kubernetes aktivert)
- `kubectl`
- `git`
- Docker Hub eller annet container-registry
- Internett

---

## Prosjektstruktur

```

k8s-argocd-lab/
│
├─ app/
│  ├─ server.js
│  ├─ package.json
│  └─ Dockerfile
│
├─ k8s/
│  └─ base/
│     ├─ namespace.yaml
│     ├─ configmap.yaml
│     ├─ secret.yaml
│     ├─ deployment.yaml
│     ├─ service.yaml
│     └─ ingress.yaml
│
└─ argocd/
└─ application.yaml

````

---

## Steg 1 – Bygg Docker Image

Bygg image:

```bash
docker build -t <brukernavn>/k8s-argocd-lab:1.0.0 ./app
````

Test lokalt:

```bash
docker run -p 8080:8080 <brukernavn>/k8s-argocd-lab:1.0.0
```

Åpne:

```
http://localhost:8080
```

---

## Steg 2 – Push til Registry

Logg inn:

```bash
docker login
```

Push image:

```bash
docker push <brukernavn>/k8s-argocd-lab:1.0.0
```

---

## Steg 3 – Deploy til Kubernetes (Manuelt)

Opprett namespace:

```bash
kubectl apply -f k8s/base/namespace.yaml
```

Deploy resten:

```bash
kubectl apply -f k8s/base/
```

Sjekk status:

```bash
kubectl -n lab get all
```

Port-forward for testing:

```bash
kubectl -n lab port-forward svc/lab-app-svc 8080:80
```

---

## Steg 4 – Installer Argo CD

```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

Åpne UI:

```bash
kubectl -n argocd port-forward svc/argocd-server 8081:443
```

URL:

```
https://localhost:8081
```

Hent admin-passord:

```bash
kubectl -n argocd get secret argocd-initial-admin-secret \
-o jsonpath="{.data.password}" | base64 -d; echo
```

---

## Steg 5 – GitOps med Argo CD

Oppdater `argocd/application.yaml` med ditt Git-repo og kjør:

```bash
kubectl apply -f argocd/application.yaml
```

Argo CD vil nå:

* Lese YAML fra Git
* Deploye til Kubernetes
* Automatisk oppdatere ved endringer

---

## Oppdatere Applikasjonen

1. Endre kode
2. Bygg nytt image:

   ```bash
   docker build -t <brukernavn>/k8s-argocd-lab:1.0.1 ./app
   docker push <brukernavn>/k8s-argocd-lab:1.0.1
   ```
3. Oppdater image-tag i `deployment.yaml`
4. Commit + push til Git

Argo CD ruller automatisk ut ny versjon.

---

## Viktige Kubernetes-Konsepter

| Ressurs    | Forklaring                          |
| ---------- | ----------------------------------- |
| Pod        | En container som kjører i klyngen   |
| Deployment | Håndterer replicas og oppdateringer |
| Service    | Gir stabil IP/DNS til pods          |
| ConfigMap  | Ikke-hemmelig konfigurasjon         |
| Secret     | Hemmelig data                       |
| Ingress    | HTTP routing og domener             |
| Namespace  | Isolasjon mellom prosjekter         |

---

## Feilsøking

Sjekk pods:

```bash
kubectl -n lab get pods
```

Se logs:

```bash
kubectl -n lab logs <podnavn>
```

Beskriv ressurs:

```bash
kubectl -n lab describe pod <podnavn>
```

Se events:

```bash
kubectl -n lab get events --sort-by=.lastTimestamp
```

---

## Videre Læring (Valgfritt)

* Horizontal Pod Autoscaler
* Kustomize
* Helm
* Network Policies
* Argo Rollouts
* CI/CD pipelines

---

## Hva du har lært etter dette prosjektet

* Docker-bygging og registry-flyt
* Kubernetes YAML-struktur
* GitOps tankegang
* Argo CD deploy-modell
* Oppdateringer og rollback
* Praktisk feilsøking

Dette prosjektet gir et solid fundament for videre arbeid med Kubernetes i både hobby- og profesjonell sammenheng.

```
```
