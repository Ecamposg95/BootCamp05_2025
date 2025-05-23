#!/bin/bash
LOG_DIR="/var/log"
OUTPUT_LOG="monitor_log.txt"

echo "Monitoreando cambios en $LOG_DIR.."
inotifywait -m -e create -e modify -e delete "$LOG_DIR" --format '%T %w %e' --timefmt '%Y-%m-%d %H:%M:%S' >> "$OUTPUT_LOG"
