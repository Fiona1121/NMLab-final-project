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
        mqttHost = "localhost"
        mqttPort = 1883
        try:
            self.client = mqtt.Client()
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
            # Should quit or raise flag to quit or retry

    def on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            client.connected_flag = True  # set flag
            print("MQTT connected")
        else:
            print("Bad connection Returned code= ", rc)

    def buy_order(self, symbol, quantity):
        try:
            res = self.trade_client.get_ticker(symbol=symbol)
            # get the current price
            # price = res['price']
            print(json.dumps(res, indent=2))
        except BinanceAPIException as e:
            print(e.status_code)
            print(e.message)
        self.client.publish(topic="transactions/buy", payload=f"symbol: {symbol}, quantity: {quantity}")
        # self.client.publish(topic="transactions/buy", payload=f"symbol: {symbol}, quantity: {quantity}, avgPrice: {price}")
        print("Order Placed")

    def sell_order(self, symbol, quantity):
        try:
            res = self.trade_client.get_ticker(symbol=symbol)
            # get the current price
            # price = res['price']
            print(json.dumps(res, indent=2))
        except BinanceAPIException as e:
            print(e.status_code)
            print(e.message)
        self.client.publish(topic="transactions/sell", payload=f"symbol: {symbol}, quantity: {quantity}")
        # self.client.publish(topic="transactions/sell", payload=f"symbol: {symbol}, quantity: {quantity}, avgPrice: {price}")

    def close_connection(self):
        self.client.loop_stop()


if __name__ == "__main__":
    pb = binance_Publisher()
    time.sleep(4)
    pb.buy_order("BTCUSDT", "0.01")
    pb.sell_order("BTCUSDT", "0.01")
    pb.close_connection()
