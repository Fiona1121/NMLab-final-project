import React, { createContext, useEffect, useState } from "react";
import Connection from "./Connection";
import Publisher from "./Publisher";
import Subscriber from "./Subscriber";
import Receiver from "./Receiver";
import mqtt from "mqtt";

export const TopicOption = createContext([]);
const topicOption = [
    {
        label: "transactions/buy",
        value: "transactions/buy",
    },
    {
        label: "transactions/sell",
        value: "transactions/sell",
    },
];

const MqttContent = () => {
    const [client, setClient] = useState(null);
    const [isSubed, setIsSub] = useState(false);
    const [payload, setPayload] = useState({});
    const [connectStatus, setConnectStatus] = useState("Connect");

    const mqttConnect = (host, mqttOption) => {
        setConnectStatus("Connecting");
        setClient(mqtt.connect(host, mqttOption));
    };

    useEffect(() => {
        if (client) {
            client.on("connect", () => {
                setConnectStatus("Connected");
            });
            client.on("error", (err) => {
                console.error("Connection error: ", err);
                client.end();
            });
            client.on("reconnect", () => {
                setConnectStatus("Reconnecting");
            });
            client.on("message", (topic, message) => {
                const payload = { topic, message: message.toString() };
                setPayload(payload);
            });
        }
    }, [client]);

    const mqttDisconnect = () => {
        if (client) {
            client.end(() => {
                setConnectStatus("Connect");
            });
        }
    };

    const mqttPublish = (context) => {
        if (client) {
            const { topic, payload } = context;
            client.publish(topic, payload, (error) => {
                if (error) {
                    console.log("Publish error: ", error);
                }
            });
        }
    };

    const mqttSub = (subscription) => {
        if (client) {
            const { topic } = subscription;
            client.subscribe(topic, (error) => {
                if (error) {
                    console.log("Subscribe to topics error", error);
                    return;
                }
                setIsSub(true);
            });
        }
    };

    const mqttUnSub = (subscription) => {
        if (client) {
            const { topic } = subscription;
            client.unsubscribe(topic, (error) => {
                if (error) {
                    console.log("Unsubscribe error", error);
                    return;
                }
                setIsSub(false);
            });
        }
    };

    return (
        <>
            <Connection
                connect={mqttConnect}
                disconnect={mqttDisconnect}
                connectBtn={connectStatus}
            />
            <TopicOption.Provider value={topicOption}>
                <Subscriber
                    sub={mqttSub}
                    unSub={mqttUnSub}
                    showUnsub={isSubed}
                />
                <Publisher publish={mqttPublish} />
            </TopicOption.Provider>
            <Receiver payload={payload} />
        </>
    );
};

export default MqttContent;
