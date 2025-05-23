# Configuración y Personalización de oh-my-zsh

## Instalación
- Instalé Zsh y Git con:
  sudo apt update && sudo apt install zsh git -y
- Instalé oh-my-zsh usando el script oficial:
  sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

## Personalización
- Cambié el tema a "agnoster" editando ~/.zshrc:
  ZSH_THEME="agnoster"
- Activé plugins, por ejemplo:
  plugins=(git z)

## Resultado
- El prompt cambió mostrando el nuevo estilo y funcionalidades.
- Se mejoró la experiencia en la terminal con autocompletados y colores.
