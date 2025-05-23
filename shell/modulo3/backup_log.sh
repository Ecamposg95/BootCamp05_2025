#!/bin/bash

# Carpeta que quieres respaldar (ajusta la ruta)
ORIGEN=~/Documentos/mis_archivos

# Carpeta donde se guardarán los backups (puedes cambiarla)
DESTINO=~/Backups

# Timestamp
FECHA=$(date +'%Y-%m-%d_%H-%M-%S')

# Nombre del archivo de backup
NOMBRE_BACKUP="respaldo_$FECHA.tar.gz"

# Crear el directorio de destino si no existe
mkdir -p "$DESTINO"

# Crear el backup
tar -czf "$DESTINO/$NOMBRE_BACKUP" "$ORIGEN"

# Verifica si se creó correctamente
if [ $? -eq 0 ]; then
    MENSAJE="[$FECHA] Backup exitoso: $NOMBRE_BACKUP"
else
    MENSAJE="[$FECHA] ERROR al crear backup"
fi

# Guardar mensaje en el log
echo "$MENSAJE" >> backup_log.txt

# Mostrar resultado
echo "$MENSAJE"
