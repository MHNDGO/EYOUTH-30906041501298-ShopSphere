# EYOUTH-30906041501298-ShopSphere — Task 2 Submission Guide

## Files included

- `EYOUTH-30906041501298-ShopSphere-Architecture-Diagram.svg`
- `EYOUTH-30906041501298-ShopSphere-Cloud-Service-Classification.docx`
- `aws-simulation.yaml`
- `gcp-simulation.yaml`

## Before submission

1. Open the architecture SVG and replace `[frontend Vercel URL]` and `[backend Vercel URL]` with the real deployed URLs from Task 1. Do not change the architecture components or traffic arrows.
2. Apply the two manifests from the repository's `task2/kubernetes/` directory:

```bash
kubectl apply -f aws-simulation.yaml
kubectl apply -f gcp-simulation.yaml
kubectl get all -n aws-simulation
kubectl get all -n gcp-simulation
```

3. Wait until each deployment is `1/1` ready. Use `kubectl port-forward` and a browser/curl as described in `task2/kubernetes/VERIFY-TASK2.md`.
4. Take screenshots of the two namespace listings and each successful backend response. These are your evidence for the namespace and isolation criterion.
