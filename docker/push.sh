#!/bin/bash

# # Collect image tag from first argument input.
source version.sh

echo "pushing image: $IMAGE_VERSION"

# Push image to GHCR
docker push $IMAGE_VERSION
