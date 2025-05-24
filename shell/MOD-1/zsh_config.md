Ejecuté los siguientes comandos para instalar zsh y oh-my-zsh:

sudo apt update && sudo apt install zsh git -y
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
chsh -s $(which zsh)
exec zsh
