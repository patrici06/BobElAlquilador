#!/bin/bash

# Inicia Spring Boot en segundo plano
./mvnw spring-boot:run &

# Guarda el PID para luego poder cerrarlo si quieres
SPRING_PID=$!

# Espera un poco para asegurarse que Spring Boot comienza
sleep 5

# Navega al directorio Angular y ejecuta ng serve
cd src/main/resources/front-bobelalquilador
npm start &

# Guarda el PID de Angular
ANGULAR_PID=$!

# Espera a que el usuario presione CTRL+C para finalizar ambos procesos
trap "kill $SPRING_PID $ANGULAR_PID" SIGINT
wait