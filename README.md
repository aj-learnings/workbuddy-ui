# Worbuddy Application
Here, we have the UI of a workbuddy app.

With the help of this app, you can add/delete/update an workitem and also add comments to it.

<br>

## Docker image
This code is also deployed as a docker image. Use the below command to run it as a container
```bash
docker run -d -p <your-port>:80 --name workbuddy-ui ajlearnings/workbuddy-ui:v1
```
Check [here](https://hub.docker.com/r/ajlearnings/workbuddy-ui) for the environment variables.
