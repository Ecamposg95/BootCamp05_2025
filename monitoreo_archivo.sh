#!/bin/bash
ARCHIVO="shell/Modulo3/backup_log.txt"
LOG_SALIDA="shell/Modulo4/monitor_log.txt"

echo "Monitoreando cambios en $ARCHIVO..."
inotifywait -m -e modify -e delete -e create "$ARCHIVO" --format '%T %w %f %e' --timefmt '%Y-%m-%d %H:%M:%S' >> "$LOG_SALIDA"
