# screenshot-docker
Opinionated screenshot Docker Image

example docker-compose.yml:
````yaml
version: '3'

services:
  puppeteer:
    image: pluswerk/screenshot
    ports:
    - 8999:3000
````

To take a screenshot from an url send a Request with your url and options in the body.
````bash
curl -X POST --header "Content-Type: application/json" -d '{"url":"https://github.com/pluswerk/screenshot-docker","width":1024,"height":1301,"isMobile":false}' http://localhost:8999/ > screenshot.png
````
#### Options

| Option       | Type          | Default     | Description                                                  |
| ------------ | ------------- | ----------- | ------------------------------------------------------------ |
| `url`        | String        | N/A         | URL to the website from which a screenshot should be taken   |
| `width`      | Number        | 1024        | width of the target window                                   |
| `height`     | Number        | 1301        | height of the target window                                  |
| `isMobile`   | Boolean       | false       | show target Page in mobile view                              |
