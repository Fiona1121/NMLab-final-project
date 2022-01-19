import os
import paho.mqtt.client as mqtt


def on_message(client, obj, msg):
    print(f"TOPIC:{msg.topic}, VALUE:{msg.payload}")


def on_connect(client, obj, flags, rc):
    print(f"Connected with result code {rc}")
    client.subscribe("transactions/buy")
    client.subscribe("transactions/sell")


def main():
    # Establish connection to mqtt broker
    mqttHost = os.getenv("MQTT_HOST", "localhost")
    mqttPort = 15558
    username = os.getenv("MQTTUSER")
    password = os.getenv("MQTTPASS")
    try:
        client = mqtt.Client()
        client.username_pw_set(username, password)
        client.on_connect = on_connect
        client.on_message = on_message
        client.connect(mqttHost, mqttPort)
        client.loop_forever()
    except Exception as e:
        print(e)


if __name__ == "__main__":
    main()
