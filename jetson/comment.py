import requests
from lcd_control import lcd
import os

api_keys = "AIzaSyB15-OwpB5w2-uvqboibJwf1Lab3t90zz0"
stream_id = "0BH1rXp1_sY"
channel_id = "UCmDybKWIZ1l7Q-p3qOPgVfg"

class comment_Publisher:
    def __init__(self):
        try:
            self.comment_count, self.comments = self.get_liveChat_comment()
        except: 
            self.comment_count = 0
            self.comments = []

    def get_streamId(self):
        res =requests.get("https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=" + channel_id + "&liveBroadcastContent=live&key=" + api_keys)
        if res.status_code == 200:
            return res.json()['items'][0]
        else:
            return stream_id

    def get_chatId(self):
        res = requests.get("https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&key=" + api_keys + "&id=" + stream_id)
        try :
            return res.json()['items'][0]['liveStreamingDetails']['activeLiveChatId']
        except :
            return "0"

    def get_liveChat_comment(self):
        chatId = self.get_chatId()
        res = requests.get("https://www.googleapis.com/youtube/v3/liveChat/messages?part=id%2C%20snippet&key=" + api_keys + "&liveChatId=" + chatId)
        res = res.json()
        try :
            comment_count = res['pageInfo']['totalResults']
            comments = []
            for i in res['items']:
                username_res = requests.get("https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails&id=" + i['snippet']['authorChannelId'] + "&key=" + api_keys).json()
                username = username_res['items'][0]['snippet']['title']
                comments.append((username, i['snippet']['displayMessage']))
            return (comment_count, comments)
        except :
            return (self.comment_count, self.comments)
        

    

if __name__ == '__main__':
    com = comment_Publisher()
    print(com.comment_count)
    print(com.comments)
    #
