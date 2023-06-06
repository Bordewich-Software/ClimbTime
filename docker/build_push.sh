#!/bin/bash

# # Collect image tag from first argument input.
source version.sh

# Build image
source build.sh $IMAGE_TAG

# Push image to GHCR
source push.sh $IMAGE_TAG
