#!/bin/bash

# Ruta de origen que deseas respaldar (ajusta según tu necesidad)
ORIGEN=~/BootCamp05_2025/shell/modulo3

# Carpeta donde se guardarán los backups
DESTINO=~/BootCamp05_2025/shell/modulo3/backups

# Timestamp para nombre del backup
FECHA=$(date +'%Y-%m-%d_%H-%M-%S')

# Nombre del archivo backup
NOMBRE_BACKUP="respaldo_$FECHA.tar.gz"

# Crear carpeta de backups si no existe
mkdir -p "$DESTINO"

# Crear el archivo comprimido del backup
tar -czf "$DESTINO/$NOMBRE_BACKUP" "$ORIGEN"

# Verificar si se creó correctamente
if [ $? -eq 0 ]; then
    MENSAJE="[$FECHA] Backup exitoso: $NOMBRE_BACKUP"
else
    MENSAJE="[$FECHA] ERROR al crear backup"
fi

# Registrar en el log
echo "$MENSAJE" >> backup_log.txt

# Mostrar mensaje
echo "$MENSAJE"
