@echo off
echo Starting Travel Booking System on Kubernetes...

kubectl apply -f setup-env.yaml
kubectl apply -f database.yaml
timeout /t 10 /nobreak > nul
kubectl apply -f backend.yaml
kubectl apply -f frontend.yaml

echo Waiting for pods to start...
timeout /t 5 /nobreak > nul
kubectl get pods -n travel-booking-system
kubectl get svc -n travel-booking-system

pause