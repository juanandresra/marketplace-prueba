#!/bin/sh
set -e

echo "Esperando a que la base de datos esté disponible..."

# Esperar a que el puerto 5432 esté listo (puedes usar nc o un script como wait-for-it)
while ! nc -z db 5432; do
  sleep 1
done

echo "Base de datos lista, corriendo migraciones..."

yarn prisma migrate deploy

echo "Ejecutando seeds..."

node prisma/seed.js &   # seed en background

echo "Iniciando la app..."

exec yarn start
