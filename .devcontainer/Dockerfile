# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.202.1/containers/typescript-node/.devcontainer/base.Dockerfile

ARG VARIANT="16-bullseye"
FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:0-${VARIANT}

ARG YQ_BINARY="yq_linux_amd64"
ARG YQ_VERSION="v4.18.1"

RUN printf "alias cls='clear'\nalias ll='ls -l --human-readable --color=auto --group-directories-first --classify --time-style=long-iso -all'" >> /etc/bash.bashrc

RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm install --lts"

RUN su node -c "npm install -g jest ts-node-dev npm-check-updates npm@latest"

RUN wget https://github.com/mikefarah/yq/releases/download/${YQ_VERSION}/${YQ_BINARY} -O /usr/bin/yq \
	&& chmod +x /usr/bin/yq

RUN mkdir $HOME/logs