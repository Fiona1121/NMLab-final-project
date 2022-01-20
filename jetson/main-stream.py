# !/usr/bin/python
# -*-coding:utf-8 -*-
import cv2
import numpy as np
import argparse
import requests
import multiprocessing
import threading

import serial 
import time
from lcd_control import lcd
from comment import comment_Publisher

ang = 0
prev_angle = 0
ang_threshold = 45
pairs = ["BANDUSDT", "DOTUSDT", "ETHUSDT", "BNBUSDT", "BTCUSDT"]
prev_pair = "BANDUSDT"
cur_pair = "BANDUSDT"
lcd_controller = lcd()
comment_controller = comment_Publisher()

def bw_filter(frame):
    vid_gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    thresh = 70
    vid_bw = cv2.threshold(vid_gray, thresh, 255, cv2.THRESH_BINARY)[1]

    return g2rgb(vid_bw)

def line_filter(frame):
    img = frame
    global ang
    global prev_angle
    global ang_threshold
    
    gray = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (3, 3), 0)
    blurred = cv2.GaussianBlur(blurred, (5, 5), 0)
    edges = cv2.Canny(blurred,50,150,apertureSize = 3)
    minLineLength = 75
    maxLineGap = 80
    lines = cv2.HoughLinesP(edges, rho=1, theta=np.pi/180, threshold=100, minLineLength=minLineLength, maxLineGap=maxLineGap)
    if lines is not None :
        for line in lines:
            line = line[0]
            x_slope = line[2] - line[0]
            y_slope = line[3] - line[1]
            length = np.sqrt(x_slope**2+y_slope**2)
            x_slope = x_slope + 0.01
            tan = (y_slope/x_slope)
            angle = np.arctan(tan)*180/np.pi
            #if 20>length and length>15 :
            angle_diff = 0
            if int(angle) != 0 :
                angle_diff = angle+90 - prev_angle
                if abs(angle_diff) <= ang_threshold :
                    ang = ang - angle_diff
                prev_angle = angle+90
            cv2.line(img,(line[0],line[1]),(line[2],line[3]),(0,255,0),2)
            break

    return img

def circle_filter(frame):
    img = frame

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    minDist = 100
    param1 = 30 #500
    param2 = 100 #200 #smaller value-> more false circles
    minRadius = 1
    maxRadius = 100 #10

    circles = cv2.HoughCircles(gray, cv2.HOUGH_GRADIENT, 1, minDist, param1=param1, param2=param2, minRadius=minRadius, maxRadius=maxRadius)

    if circles is not None:
        circles = np.uint16(np.around(circles))
        print(len(circles[0]))
        for i in circles[0,:]:
            cv2.circle(img, (i[0], i[1]), i[2], (0, 255, 0), 2)

    return img

def overlay_img_filter(frame, img_path="img/roulette.png"):
    global ang
    global prev_angle
    global pairs
    global prev_pair
    global cur_pair

    prev_pair = cur_pair
    
    img = cv2.imread(img_path, -1)
    scale_percent = 16
    width = int(img.shape[1] * scale_percent / 100)
    height = int(img.shape[0] * scale_percent / 100)
    dim = (width, height)
    
    # resize image
    img = cv2.resize(img, dim, interpolation = cv2.INTER_AREA)
    img = rotate_image(img, ang)

    wheel_offset = -(ang//360)*360 + ang
    if 72 >= wheel_offset and wheel_offset >= 0 :
        cur_pair = pairs[0]
    elif 144 >= wheel_offset and wheel_offset >= 72 :
        cur_pair = pairs[1]
    elif 216 >= wheel_offset and wheel_offset >= 144 :
        cur_pair = pairs[2]
    elif 288 >= wheel_offset and wheel_offset >= 216 :
        cur_pair = pairs[3]
    elif 360 >= wheel_offset and wheel_offset >= 288 :
        cur_pair = pairs[4]
    else : 
        cur_pair = pairs[2]
        print("Wheel angle weird", wheel_offset)

    if prev_pair != cur_pair :
        set_LCD_top(cur_pair)
        print(cur_pair)

    x_offset = 470
    y_offset = 180
    y1, y2 = y_offset, y_offset + img.shape[0]
    x1, x2 = x_offset, x_offset + img.shape[1]
    x_center = x_offset + img.shape[1]/2
    y_center = y_offset + img.shape[0]/2

    alpha_s = img[:, :, 3] / 255.0
    alpha_l = 1.0 - alpha_s

    for c in range(0, 3):
        frame[y1:y2, x1:x2, c] = (alpha_s * img[:, :, c] +
                                alpha_l * frame[y1:y2, x1:x2, c])
    frame = cv2.line(frame,(x_center,y_center),(x_center,y_center-50),(0,0,255),5)
    return frame

def set_LCD_Text_2(cur_pair):
    print(cur_pair)
    res = requests.get("https://api.binance.com/api/v3/ticker/price?symbol=" + cur_pair)
    price = str(float(res.json()["price"])).split(".")[0] + "." + str(float(res.json()["price"])).split(".")[1][:4]
    count, comments = comment_controller.get_liveChat_comment()
    print(comments)
    if len(comments) > 0:
        lastComment = comments[-1]
        lcd_controller.setText(cur_pair[:-4] + ":" + price + "\n" + lastComment[0] + ":" + lastComment[1])

def set_LCD_top(cur_pair):
    res = requests.get("https://api.binance.com/api/v3/ticker/price?symbol=" + cur_pair)
    price = str(float(res.json()["price"])).split(".")[0] + "." + str(float(res.json()["price"])).split(".")[1][:4]
    empty_len = 16 - len(cur_pair[:-4] + ":" + price)
    lcd_controller.setText_top(cur_pair[:-4] + ":" + price + " "*empty_len + "\n" )

def set_LCD_bottom():
    count, comments = comment_controller.get_liveChat_comment()
    print(comments)
    if len(comments) > 0:
        lastComment = comments[-1]
        lower_text = lastComment[0] + ":" + lastComment[1]
        framebuffer = ["", lower_text]
        if len(lower_text) < 16 :
            lcd_controller.setText_bottom(framebuffer[1] + " "*(16-len(lower_text)))
        for i in range(len(lower_text) - 16 + 1):
            framebuffer[1] = lower_text[i:i+16]
            lcd_controller.setText_bottom(framebuffer[1])
            time.sleep(0.05)

def g2rgb(frame):
    return np.stack((frame, frame, frame), axis=-1)

def rotate_image(img, angle):
    img_center = tuple(np.array(img.shape[1::-1]) / 2)
    rot_mat = cv2.getRotationMatrix2D(img_center, angle, 1.0)
    result = cv2.warpAffine(img, rot_mat, img.shape[1::-1], flags=cv2.INTER_LINEAR)
    return result

def gstreamer_camera(queue):
    pipeline = (
        "nvarguscamerasrc ! "
            "video/x-raw(memory:NVMM), "
            "width=(int)720, height=(int)400, "
            "format=(string)NV12, framerate=(fraction)30/1 ! "
        "queue ! "
            "nvvidconv flip-method=2 ! "
                "video/x-raw, "
                "width=(int)720, height=(int)400, "
                "format=(string)BGRx, framerate=(fraction)30/1 ! "
            "videoconvert ! "
                "video/x-raw, format=(string)BGR ! "
            "appsink"
        )
    print("Start cam")
    cap = cv2.VideoCapture(pipeline, cv2.CAP_GSTREAMER)
    print("Start cap")
    while True:
        ret, frame = cap.read()
        if not ret:
            print("Broken")
            break
        queue.put(frame)
        #print("[CAM] READ")


def gstreamer_rtmpstream(queue):
    global ang
    pipeline = (
        "appsrc ! "
            "video/x-raw, format=(string)BGR ! "
        "queue ! "
            "videoconvert ! "
                "video/x-raw, format=RGBA ! "
            "nvvidconv ! "
            "nvv4l2h264enc bitrate=8000000 ! "
            "h264parse ! "
            "flvmux ! "
            'rtmpsink location="rtmp://localhost/rtmp/live live=1"'
        )
    pipeline = (
        "appsrc is-live=true ! "
            "video/x-raw, format=(string)BGR ! "    
        "queue ! "
            "videoconvert ! "
                "video/x-raw, format=RGBA ! "
            "nvvidconv ! "
            "nvv4l2h264enc bitrate=8000000 ! "
            "h264parse ! "
            "flvmux name=mux streamable=true ! "
            "rtmpsink sync=true async=true location='rtmp://a.rtmp.youtube.com/live2/2jh9-jt7x-ypew-akwb-38vc live=true' audiotestsrc is-live=true ! "
            "audioconvert ! audioresample ! audio/x-raw,rate=48000 ! voaacenc bitrate=96000 ! audio/mpeg ! aacparse ! audio/mpeg, mpegversion=4 ! mux."
    )

    writer = cv2.VideoWriter(pipeline, cv2.CAP_GSTREAMER, 0, 10.0, (720, 400))
    while True:
        # try:
        #     data = arduino.readline()
        #     if data:
        #         print(data)
        #         print('Hi Arduino')
        # except:
        #     arduino.close() 
            
        frame = queue.get()
        if frame is None:
            break
        frame = apply_filters(frame)
        writer.write(frame)
        #print("[RTMP] WRITE")

def apply_filters(frame) :
    orig_frame = frame
    frame = bw_filter(frame)
    frame = cv2.GaussianBlur(frame, (5, 5), 5)
    frame = line_filter(frame)
    frame = overlay_img_filter(orig_frame)
    return frame

def lcd_control() :
    while True:
        set_LCD_bottom()
        time.sleep(10)




if __name__ == "__main__":
    
    queue = multiprocessing.Queue(maxsize=1)
    reader = multiprocessing.Process(target=gstreamer_camera, args=(queue, ))
    reader.start()
    writer = multiprocessing.Process(target=gstreamer_rtmpstream, args=(queue,))
    writer.start()
    lcd_process = multiprocessing.Process(target=lcd_control)
    lcd_process.start()



    try:
        reader.join()
        writer.join()
        lcd_process.join()
    except KeyboardInterrupt as e:
        reader.terminate()
        writer.terminate()
        lcd_process.terminate()
        #
