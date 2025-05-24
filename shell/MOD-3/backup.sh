#!/bin/bash

# Carpeta a respaldar
SOURCE_DIR="$HOME/Documentos/CV"

# Carpeta de destino
BACKUP_DIR="$HOME/Documentos/CV/backups"

# Timestamp para el nombre del archivo
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")

# Crear la carpeta de backups si no existe
mkdir -p "$BACKUP_DIR"

# Crear la copia de seguridad comprimida
tar -czf "$BACKUP_DIR/backup_$TIMESTAMP.tar.gz" "$SOURCE_DIR"

# Registrar la ejecución en backup_log.txt
echo "Backup realizado el $TIMESTAMP" >> shell/MOD-3/backup_log.txt

# Mensaje final
echo "✅ Copia de seguridad creada en $BACKUP_DIR/backup_$TIMESTAMP.tar.gz"

