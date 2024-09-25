# [Worbuddy Application](https://www.youtube.com/watch?v=0F-E_kD6Spw)

Here, we have the UI of a workbuddy app.

With the help of this app, you can add/delete/update an workitem and also add comments to it.

<br>

## Docker image
This code is also deployed as a docker image. Use the below command to run it as a container
```bash
docker run -d -p <your-port>:80 --name workbuddy-ui ajlearnings/workbuddy-ui:latest
```
Check [here](https://hub.docker.com/r/ajlearnings/workbuddy-ui) for the environment variables.
