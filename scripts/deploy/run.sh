#!/bin/bash
# export AWS_ACCESS_KEY_ID=AKIA3GMRGG2JF3GB26WD
# export AWS_SECRET_ACCESS_KEY=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
# export AWS_DEFAULT_REGION=ap-southeast-1
# export DOCKER_HUB_USER=lamhq
# export DOCKER_HUB_PASSWORD=
# export DOCKER_HUB_REPO=rest-api
export DOCKER_TAG=latest
export NODE_ENV=production

# build react app
yarn build

# # build docker image
export IMAGE=${DOCKER_HUB_USER}/${DOCKER_HUB_REPO}:${DOCKER_TAG}
docker build -t ${IMAGE} .

# # push image to docker hub
echo ${DOCKER_HUB_PASSWORD} | docker login -u ${DOCKER_HUB_USER} --password-stdin
docker push ${IMAGE}
