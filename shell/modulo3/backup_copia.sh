#!/bin/bash

# Carpeta a respaldar
ORIGEN=~/Documentos

# Carpeta donde se guardarán los respaldos
DESTINO=~/respaldos

# Crear la carpeta de destino si no existe
mkdir -p "$DESTINO"

# Fecha y hora del respaldo
FECHA=$(date +"%Y-%m-%d_%H-%M-%S")

# Nombre del archivo comprimido
ARCHIVO="respaldo_$FECHA.tar.gz"

# Ejecutar respaldo
tar -czf "$DESTINO/$ARCHIVO" "$ORIGEN"

# Log de respaldo
echo "Respaldo creado: $DESTINO/$ARCHIVO - $FECHA" >> backup_log.txt
