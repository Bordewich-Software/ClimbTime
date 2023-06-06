#!/bin/bash

# # Collect image tag from first argument input.
source version.sh

echo "building image: $IMAGE_VERSION"

# Build docker image.
docker build -t $IMAGE_VERSION -f Dockerfile --build-arg owner=bordewich-software ../
