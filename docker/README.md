# Run the Service with Docker

    docker run --rm -p 8080:80 ghcr.io/bordewich-software/climb_time:latest

After the service has started, visit [http://localhost:8080/graphql]()

## Build and Push the Docker Image

Run the following scripts based on yor needs

- `build.sh` -> Build a labeled docker image. Pass a first argument to set a label (optional): `./build.sh label`
- `push.sh` -> Push a labeled docker image. Pass a first argument to set a label (optional): `./push.sh label`
- `build_push.sh` -> Build and push a labeled docker image. Pass a first argument to set a label (optional): `./build_push.sh label`

If the scrips are not executable, run `chmod +x build.sh` and try again :)
