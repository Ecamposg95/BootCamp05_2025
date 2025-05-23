#!/bin/bash

# Carpeta origen que quieres respaldar
ORIGEN="./ejercicios"

# Carpeta destino donde guardarás el respaldo
DESTINO="./backups"

# Crear carpeta destino si no existe
mkdir -p "$DESTINO"

# Fecha y hora actual
FECHA=$(date +%Y-%m-%d_%H-%M-%S)

# Nombre del archivo de respaldo
ARCHIVO="$DESTINO/backup_$FECHA.tar.gz"

# Crear el respaldo
tar -czf "$ARCHIVO" "$ORIGEN"

# Registrar en log
echo "[$FECHA] Backup creado: $ARCHIVO" >> backup_log.txt

echo "✅ Respaldo completado."

