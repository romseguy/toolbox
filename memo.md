# AppImage

mkdir ~/Applications
cd ~/Applications
wget https://github.com/TheAssassin/AppImageLauncher/releases/download/continuous/appimagelauncher-lite-2.2.0-gha111-d9d4c73-x86_64.AppImage
chmod +x appimagelauncher-lite-2.2.0-gha111-d9d4c73-x86_64.AppImage
./appimagelauncher-lite-2.2.0-gha111-d9d4c73-x86_64.AppImage install


After this install, when you run the first time an appimage it shows up in menu and from there you can add it to the panel by the right click menu
Depending from how the appimage has been packaged, from the menu you can also update the ones that allow update (right click menu on the appimage name).

# MySQL

ALTER USER 'root'@'localhost' IDENTIFIED WITH caching_sha2_password BY 'x';

# Xterm

Since some programs still use the old gnome-terminal the best way to get around the problem is to symlink it to xterm:

mkdir ~/.local/bin
ln -s /usr/bin/xterm ~/.local/bin/gnome-terminal
