import serial 
import time
from mqtt.publisher import binance_Publisher

#arduino = serial.Serial('/dev/ttyACM1', 115200, timeout=5, bytesize=serial.EIGHTBITS, parity=serial.PARITY_NONE, stopbits=serial.STOPBITS_ONE, xonxoff=False, rtscts=False, dsrdtr=False)


def arduino_control(pb) :
    arduino = serial.Serial('/dev/ttyACM0', 115200, timeout=1)
    prev_state = "nothing"
    state = "nothing"
    buy_val = 0
    sell_val = 0
    try:
        while True:
            time.sleep(0.001)
            try:
                data = arduino.readline()
                while not "\\n" in str(data) :
                    time.sleep(0.001)
                    temp = arduino.readline()
                    if not not temp.decode() :
                        data = (data.decode()+temp.decode()).encode()
                data = data.decode()
                data = data.strip()
                if data:
                    #data = '0 0\xff'
                    temp = ""
                    for i in data :
                        if i.isnumeric() or i == " " :
                            temp = temp + i
                    data = temp
                    try:
                        buy_val = int(data.split(" ")[0])
                        sell_val = int(data.split(" ")[1])
                    except:
                        buy_val = 0
                        sell_val = 0
                    if buy_val > 400 :
                        #print(buy_val, sell_val)
                        state = "buying"
                    elif sell_val > 120 :
                        #print(buy_val, sell_val)
                        state = "selling"
                    else :
                        state = "nothing"
                if prev_state != state :
                    print("State :", state)
                    if prev_state == "nothing" and state == "buying" :
                        pb.buy_order("BUSDUSDT", 15)
                    elif prev_state == "nothing" and state == "selling" :
                        pb.sell_order("BUSDUSDT", 15)
                    time.sleep(6)
                prev_state = state
                print(buy_val, sell_val)
            except Exception as e:
                print("Arduino not connected", e)
                time.sleep(6)
    except KeyboardInterrupt as e:
        pb.close_connection()
        arduino.close()