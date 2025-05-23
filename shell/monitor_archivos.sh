#!/bin/bash

LOG_DIR="/var/log"
OUTPUT_LOG="monitor_log.txt"

echo "🕵️‍♂️ Monitoreando cambios en $LOG_DIR..."
inotifywait -m -e create -e modify -e delete --timefmt '%F %T' --format '%T %w%f %e' "$LOG_DIR"

