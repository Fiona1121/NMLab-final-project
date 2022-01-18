import os
import json
import time
import paho.mqtt.client as mqtt
from binance import Client
from binance.exceptions import BinanceAPIException

api_key = os.getenv("BINANCE_API")
api_secret = os.getenv("BINANCE_SECRET")


class binance_Publisher:
    def __init__(self):
        mqttHost = os.getenv("MQTTHOST")
        mqttPort = 15558
        username = os.getenv("MQTTUSER")
        password = os.getenv("MQTTPASS")
        try:
            self.client = mqtt.Client()
            self.client.username_pw_set(username, password)
            self.client.connected_flag = False  # create flag in class
            self.client.on_connect = self.on_connect
            self.client.connect(mqttHost, mqttPort)
            self.client.loop_start()
            while not self.client.connected_flag:  # wait in loop
                time.sleep(1)
                print("MQTT Client Connecting...")

            self.trade_client = Client(api_key, api_secret)
        except:
            print("connection failed")

    def on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            client.connected_flag = True  # set flag
            print("MQTT connected")
        else:
            print("Bad connection Returned code= ", rc)

    def get_avgPrice(self, res, quantity):
        # check if field fills exist
        if "fills" in res.keys():
            # check if field fills is not empty
            if len(res["fills"]) > 0:
                # get the average price
                total = 0
                for fill in res["fills"]:
                    total += float(fill["qty"]) * float(fill["price"])
                avgPrice = total / quantity
                return avgPrice
            else:
                return 0

    def buy_order(self, symbol, quantity):
        try:
            # res = self.trade_client.order_market_buy(symbol=symbol, quantity=quantity)
            res = self.trade_client.get_symbol_ticker(symbol=symbol)
            print(res)
            # get average price
            avgPrice = self.get_avgPrice(res, quantity)
            resDict = {"symbol": symbol, "quantity": quantity, "avgPrice": avgPrice}
            payload = json.dumps(resDict, indent=2)
            print(payload)
<<<<<<< HEAD
            result = self.client.publish(topic="transactions/buy", payload=payload)
            status = result[0]
            if status == 0:
                print(f"Send `{payload}` to topic `transactions/buy`")
                print("Buy Order Placed")
            else:
                print(f"Failed to send message to topic `transactions/buy`")
=======
            self.client.publish(topic="transactions/buy", payload=payload)
            print("Buy Order Placed")
>>>>>>> master
        except BinanceAPIException as e:
            print(e.status_code)
            print(e.message)

    def sell_order(self, symbol, quantity):
        try:
            #res = self.trade_client.order_market_sell(symbol=symbol, quantity=quantity)
            res = self.trade_client.get_symbol_ticker(symbol=symbol)
            # get average price
            avgPrice = self.get_avgPrice(res, quantity)
            resDict = {"symbol": symbol, "quantity": quantity, "avgPrice": avgPrice}
            payload = json.dumps(resDict, indent=2)
            print(payload)
            result = self.client.publish(topic="transactions/sell", payload=payload)
            status = result[0]
            if status == 0:
                print(f"Send `{payload}` to topic `transactions/sell`")
                print("Sell Order Placed")
            else:
                print(f"Failed to send message to topic `transactions/sell`")
        except BinanceAPIException as e:
            print(e.status_code)
            print(e.message)

    def close_connection(self):
        self.client.loop_stop()


if __name__ == "__main__":
    pb = binance_Publisher()
    time.sleep(4)
    pb.buy_order("BUSDUSDT", 15)
    pb.sell_order("BUSDUSDT", 15)
    pb.close_connection()
