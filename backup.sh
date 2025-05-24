#!/bin/bash

ORIGEN="/home/palmac/BootCamp05_2025/shell"
DESTINO="/home/palmac/BootCamp05_2025/backups"

# Crear carpeta
mkdir -p "$DESTINO"

TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S)

# Nombre del archivo de respaldo
ARCHIVO="respaldo_$TIMESTAMP.tar.gz"
RUTA="$DESTINO/$ARCHIVO"
LOG="/home/palmac/BootCamp05_2025/shell/Modulo3/backup_log.txt"


tar -czf "$RUTA" "$ORIGEN" 2>> "$LOG"
if [ $? -eq 0 ]; then
    echo "[$(date)] Copia de seguridad creada: $RUTA" >> "$LOG"
else
    echo "[$(date)] Error al crear la copia de seguridad" >> "$LOG"
fi
