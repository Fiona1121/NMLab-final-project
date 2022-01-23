# NMLab-final-project

## Set up environment
```bash
# Install dependencies
$ yarn
$ pip install -r jetson/requirements.txt
```

## Get required private keys for the services
### Get api key from google
1. Go to [Google Cloud Platform](https://cloud.google.com/docs/authentication/getting-started)
2. Follow the instructions to create a API key for Youtube Data Api
3. Copy the key and paste it into the `api_keys` variable in the `jetson/comment.py` file

### Get Youtube channel id
1. Go to [Find your YouTube user & channel IDs](https://support.google.com/youtube/answer/3250431?hl=en)
2. Follow the instructions to find your channel ID
3. Copy the channel ID and paste it into the `channel_id` variable in the `jetson/comment.py` file

### Get Youtube stream key
1. Go to [Find your YouTube stream key](https://restream.io/integrations/youtube/how-to-find-youtube-stream-key/)
2. Follow the instructions to find your stream key
3. Copy the stream key and paste it after the `rtmp://a.rtmp.youtube.com/live2/` url in the `jetson/main-stream.py` file line `227`
   - For example, the url of the stream should be `rtmp://a.rtmp.youtube.com/live2/<stream key>` 

### Get the video id
1. The video id is the part after `/video/` of the url of the youtube studio stream page
   - For example, the url of the stream page is `https://studio.youtube.com/video/5ycgmjTa_eY/livestreaming`, the video id is `5ycgmjTa_eY`
1. Copy the video id and paste it into the `stream_id` variable in the `jetson/comment.py` file


### Get Binance API key
1. Go to [How to Create Binance API](https://www.binance.com/en/support/faq/360002502072)
2. Follow the instructions to get API key and secret key for Binance
3. Copy the API key and paste it into the `api_key` variable in the `mqtt/publisher.py` file
4. Copy the secret key and paste it into the `api_secret` variable in the `mqtt/publisher.py` file

### Get EMQX MQTT broker credentials
1. Go to [EMQX MQTT broker](https://www.emqx.io/)
2. Create a new account
3. Get the host, port, username and password
4. Copy the host, port, username and password and paste them into the `mqttHost`, `mqttPort`, `username` and `password` variables in the `mqtt/publisher.py` file
5. Copy the host, port, username and password and paste them into the `MQTTHOST`, `MQTTPORT`, `MQTTUSER` and `MQTTPASS` variables in the `.env` file

## Run the project
### Run the main stream
```bash
$ cd jetson
$ python main-stream.py
```

### Run the binance part
```bash
$ cd jetson
$ sudo python3 arduino.py
```

### Run the Web App
```bash
$ yarn start
```


