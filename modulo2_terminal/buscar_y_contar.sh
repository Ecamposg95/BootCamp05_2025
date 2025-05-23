#!/bin/bash
echo "Archivos .txt encontrados:"
find . -type f -name "*.txt"

echo -e "\nConteo de líneas por archivo:"
find . -type f -name "*.txt" -exec wc -l {} \;

echo -e "\nBuscar palabra 'Danna':"
grep -r "Danna" *.txt dir* 2>/dev/null

