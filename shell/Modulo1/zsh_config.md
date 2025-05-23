# Módulo 1: Configuración y Personalización de oh-my-zsh

## Objetivo
Personalizar la terminal usando oh-my-zsh, instalar plugins útiles, aplicar un nuevo tema y dejar configuraciones adicionales para mejorar la productividad en el uso de la terminal.

## 1. Instalación de Zsh y oh-my-zsh

Ejecuté los siguientes comandos para instalar Zsh y oh-my-zsh:

Instalar Zsh y Git:
sudo apt update && sudo apt install zsh git -y

Instalar oh-my-zsh:
sh -c "$(curl -fsSL
https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

## 2 Modifiqué el archivo ~/.zshrc para usar el siguiente tema:

ZSH_THEME="gnzh"

## 3 Añadí los plugins zsh-autosuggestions y zsh-syntax-highlighting:

git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions

git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting

Y active los plugins en el archivo:
plugins=(git zsh-autosuggestions zsh-syntax-highlighting)

