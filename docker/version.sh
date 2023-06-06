# Made for reuse in executable scripts
# Collect image tag from first argument input. If not set, use latest
IMAGE_TAG="latest"

if [ ! -z "$1" ]
then
    IMAGE_TAG=$1
fi

IMAGE_VERSION="ghcr.io/bordewich-software/climb_time:$IMAGE_TAG"
