#!/bin/bash

# v0.0.3

# Colours for echo
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
PURPLE='\033[0;35m'
RESET='\033[0m'

PACKAGE_NAME='vue_site'
STAR_LINE='****************************************'
CWD=$(pwd)

# $1 string - error message
error_close() {
	echo -e "\n${RED}ERROR - EXITED: ${YELLOW}$1${RESET}\n";
	exit 1
}

# $1 string - question to ask
ask_yn () {
	printf "%b%s? [y/N]:%b " "${GREEN}" "$1" "${RESET}"
}

ask_continue () {
	ask_yn "continue"
	if [[ ! "$(user_input)" =~ ^y$ ]] 
	then 
		exit
	fi
}

# return user input
user_input() {
	read -r data
	echo "$data"
}

update_major () {
	local bumped_major
	bumped_major=$((MAJOR + 1))
	echo "${bumped_major}.0.0"
}

update_minor () {
	local bumped_minor
	bumped_minor=$((MINOR + 1))
	echo "${MAJOR}.${bumped_minor}.0"
}

update_patch () {
	local bumped_patch
	bumped_patch=$((PATCH + 1))
	echo "${MAJOR}.${MINOR}.${bumped_patch}"
}

get_git_remote_url() {
	REMOTE_ORIGIN=$(git config --get remote.origin.url)
	TO_REMOVE=".git"
	GIT_REPO_URL="${REMOTE_ORIGIN//$TO_REMOVE}"
}

check_git() {
	CURRENT_GIT_BRANCH=$(git branch --show-current)
	GIT_CLEAN=$(git status --porcelain)
	if [[ -n $GIT_CLEAN ]]
	then
		error_close "git dirty"
	fi
	if [[ ! "$CURRENT_GIT_BRANCH" =~ ^dev$ ]]
	then
		error_close "not on dev branch"
	fi
}

ask_changelog_update() {
	echo "${STAR_LINE}"
	RELEASE_BODY_TEXT=$(sed '/# <a href=/Q' CHANGELOG.md)
	printf "%s" "$RELEASE_BODY_TEXT"
	printf "\n%s\n" "${STAR_LINE}"
	ask_yn "accept release body"
	if [[ "$(user_input)" =~ ^y$ ]] 
	then
		update_release_body_and_changelog "$RELEASE_BODY_TEXT"
	else
		exit
	fi
}

# $1 RELEASE_BODY
update_release_body_and_changelog () {
	echo -e
	DATE_SUBHEADING="### $(date +'%Y-%m-%d')\n\n"
	RELEASE_BODY_ADDITION="${DATE_SUBHEADING}$1"
	echo -e "${RELEASE_BODY_ADDITION}\n\nsee <a href='${GIT_REPO_URL}/blob/main/CHANGELOG.md'> CHANGELOG.md</a> for more details" > .github/release-body.md
	echo -e "# <a href='${GIT_REPO_URL}/releases/tag/${NEW_TAG_VERSION}'>${NEW_TAG_VERSION}</a>\n${DATE_SUBHEADING}${CHANGELOG_ADDITION}$(cat CHANGELOG.md)" > CHANGELOG.md
	sed -i -E "s|(\s)([0-9a-f]{40})| [\2](${GIT_REPO_URL}/commit/\2)|g" ./CHANGELOG.md
}

update_json () {
	local json_file="./package.json"
	NEW_JSON=$(jq ".version = \"${NEW_TAG_VERSION:1}\"" "${json_file}")
	echo "$NEW_JSON" > "$json_file"
}

# $1 pacakge_name
update_api_version_ts () {
	NODE_FILE="./src/config/api_version.ts"
	if [[ -f "$NODE_FILE" ]]; then
		echo "export const api_version = '${NEW_TAG_VERSION:1}';" > "$NODE_FILE"
	fi
}

update_yaml () {
	DOCKER_COMPOSE="./docker-compose.yml"
	if [[ -f "$DOCKER_COMPOSE" ]]
	then
	yq e -i ".services.$PACKAGE_NAME.image = \"$PACKAGE_NAME:${NEW_TAG_VERSION:1}\"" ${DOCKER_COMPOSE}
	fi
}

# $1 new_version
bump_version () {
	update_json
	update_api_version_ts
	update_yaml
}

check_tag () {
	LATEST_TAG=$(git describe --tags --abbrev=0 --always)
	echo -e "\nCurrent tag: ${PURPLE}${LATEST_TAG}${RESET}\n"
	echo -e "${YELLOW}Choose new tag version:${RESET}\n"
	if [[ $LATEST_TAG =~ ^v(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)(-((0|[1-9][0-9]*|[0-9]*[a-zA-Z-][0-9a-zA-Z-]*)(\.(0|[1-9][0-9]*|[0-9]*[a-zA-Z-][0-9a-zA-Z-]*))*))?(\+([0-9a-zA-Z-]+(\.[0-9a-zA-Z-]+)*))?$ ]]
	then
		IFS="." read -r MAJOR MINOR PATCH <<< "${LATEST_TAG:1}"
	else
		MAJOR="0"
		MINOR="0"
		PATCH="0"
	fi
	MAJOR_TAG=v$(update_major)
	MINOR_TAG=v$(update_minor)
	PATCH_TAG=v$(update_patch)
	OP_MAJOR="major___$MAJOR_TAG"
	OP_MINOR="minor___$MINOR_TAG"
	OP_PATCH="patch___$PATCH_TAG"
	OPTIONS=("$OP_MAJOR" "$OP_MINOR" "$OP_PATCH")
	select choice in "${OPTIONS[@]}"
	do
		case $choice in
			"$OP_MAJOR" )
				NEW_TAG_VERSION="$MAJOR_TAG"
				# IFS="." read -ra UPDATE_NGINX  <<< "${NEW_TAG_VERSION:1}"
				break;;
			"$OP_MINOR")
				NEW_TAG_VERSION="$MINOR_TAG"
				break;;
			"$OP_PATCH")
				NEW_TAG_VERSION="$PATCH_TAG"
				break;;
			*)
				error_close "invalid option $REPLY"
				break;;
		esac
	done
}

linter () {
	npm run lint
}

npm_build () {
	npm run build
}

npm_test () {
	npm run testAllSilent
}

release_flow() {
	check_git
	get_git_remote_url
	linter
	ask_continue
	npm_build
	ask_continue
	# npm_test
	# ask_continue
	cd "${CWD}" || error_close "Can't find ${CWD}"
	check_tag
	printf "\nnew tag chosen: %s\n\n" "${NEW_TAG_VERSION}"
	RELEASE_BRANCH=release-$NEW_TAG_VERSION
	echo -e
	ask_changelog_update
	git checkout -b "$RELEASE_BRANCH"
	bump_version
	# if [[ ${UPDATE_NGINX[0]} ]]
	# then
	# 	update_nginx_and_vue "${UPDATE_NGINX[0]}"
	# fi
	git add .
	git commit -m "chore: release $NEW_TAG_VERSION"
	git checkout main
	git merge --no-ff "$RELEASE_BRANCH" -m "chore: merge ${RELEASE_BRANCH} into main"
	git tag -a -m "${RELEASE_BRANCH}" "$NEW_TAG_VERSION"
	git push --atomic origin main "$NEW_TAG_VERSION"
	git checkout dev
	git merge --no-ff main -m 'chore: merge main into dev'
	git branch -d "$RELEASE_BRANCH"
	npm run build
}


main () {
	select opt in "lint" "tsc" "test" "release" "exit"
	do
		case $opt in
			"lint" )
				linter
				main
				break;;
			"tsc")
				npm_build
				main
				break;;
			"test")
				npm_test
				main
				break;;
			"release")
				release_flow
				break;;
			"exit")
				break;;
			*)
				error_close "invalid choice"
				break;;
		esac
	done
}

main