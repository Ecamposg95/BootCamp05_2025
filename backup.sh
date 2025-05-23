#!/bin/bash

# Carpeta origen
ORIGEN="$HOME/Documentos_Danna"

# Carpeta destino
DESTINO="$HOME/backups"
mkdir -p "$DESTINO"

# Timestamp
FECHA=$(date +"%Y-%m-%d_%H-%M-%S")

# Nombre del archivo de respaldo
ARCHIVO="respaldo_$FECHA.tar.gz"

# Ruta completa al archivo de respaldo
RUTA="$DESTINO/$ARCHIVO"

# Archivo de log
LOG="$HOME/backup_log.txt"

# Crear el respaldo
tar -czf "$RUTA" "$ORIGEN"

# Verificar y registrar en el log
if [ $? -eq 0 ]; then
    echo "[$FECHA] Copia de seguridad creada: $ARCHIVO" >> "$LOG"
else
    echo "[$FECHA] Error al crear la copia de seguridad" >> "$LOG"
fi

