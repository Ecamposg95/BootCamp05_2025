#!/bin/bash

# Nombre de la rama
rama="CPS"

# Mensaje de commit por defecto
mensaje_commit="Script automatico"

# Mostrar el estado actual
echo "Estado actual del repositorio:"
git status

# Agregar todos los cambios
echo "Agregando todos los archivos..."
git add .

# Hacer el commit
echo "Haciendo commit con mensaje: '$mensaje_commit'"
git commit -m "$mensaje_commit"

# Hacer push a la rama especificada
echo "Enviando cambios a la rama '$rama'..."
git push origin "$rama"

# Confirmación final
echo "Cambios enviados correctamente."
