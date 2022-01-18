import requests
from lcd_control import lcd

api_keys = "AIzaSyB15-OwpB5w2-uvqboibJwf1Lab3t90zz0"
stream_id = "_coTdkGk7GE"


class comment_Publisher:
    def __init__(self):
        self.comment_count, self.comments = self.get_liveChat_comment()

    def get_chatId(self, stream_id):
        res = requests.get("https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&key=" + api_keys + "&id=" + stream_id)
        return res.json()['items'][0]['liveStreamingDetails']['activeLiveChatId']

    def get_liveChat_comment(self):
        chatId = self.get_chatId(stream_id)
        res = requests.get("https://www.googleapis.com/youtube/v3/liveChat/messages?part=id%2C%20snippet&key=" + api_keys + "&liveChatId=" + chatId)
        res = res.json()
        comment_count = res['pageInfo']['totalResults']
        comments = []
        for i in res['items']:
            username_res = requests.get("https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails&id=" + i['snippet']['authorChannelId'] + "&key=" + api_keys).json()
            username = username_res['items'][0]['snippet']['title']
            comments.append((username, i['snippet']['displayMessage']))
        return (comment_count, comments)
        

    

if __name__ == '__main__':
    com = comment_Publisher()
    print(com.comment_count)
    print(com.comments)
