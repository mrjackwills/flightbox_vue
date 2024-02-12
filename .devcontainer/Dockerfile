FROM mcr.microsoft.com/devcontainers/typescript-node:20

RUN printf "alias cls='clear'\nalias ll='ls -l --human-readable --color=auto --group-directories-first --classify --time-style=long-iso -all'" >> /etc/bash.bashrc

RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm install --lts"

RUN su node -c "npm install -g jest ts-node-dev npm-check-updates npm@latest"