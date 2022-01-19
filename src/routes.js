import { useEffect, useState } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import mqtt from "mqtt";
// layouts
import DashboardLayout from "./layouts/dashboard";
import LogoOnlyLayout from "./layouts/LogoOnlyLayout";
// pages
import DashboardApp from "./pages/DashboardApp";
import Transaction from "./pages/Transaction";
import NotFound from "./pages/Page404";
import "./data/transactions.json";
import LiveStream from "./pages/LiveStream";

// ----------------------------------------------------------------------
const { MQTTHOST, MQTTPORT, MQTTUSER, MQTTPASS } = process.env;
export default function Router() {
    const [client, setClient] = useState(null);
    const [transactionData, setTransactionData] = useState([]);
    const [payload, setPayload] = useState({});
    const [connectStatus, setConnectStatus] = useState("Connecting");

    const mqttConnect = () => {
        const url = `ws://${MQTTHOST}:${MQTTPORT}/mqtt`;
        const mqttOption = {
            username: MQTTUSER,
            password: MQTTPASS,
        };
        setConnectStatus("Connecting...");
        setClient(mqtt.connect(url, mqttOption));
    };

    const mqttDisconnect = () => {
        if (client) {
            client.end(() => {
                setConnectStatus("Connect");
            });
        }
    };

    const loadTransactionData = () => {
        fetch("transactions.json", {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
            .then(function (response) {
                console.log(response);
                return response.json();
            })
            .then(function (myJson) {
                console.log(myJson);
                setTransactionData(myJson.transactions);
            });
    };

    const mqttSub = (subscription) => {
        if (client) {
            const { topic } = subscription;
            client.subscribe(topic, (error) => {
                if (error) {
                    console.log("Subscribe to topics error", error);
                    return;
                }
            });
        }
    };

    useEffect(() => {
        mqttConnect();
        loadTransactionData();
    }, []);

    useEffect(() => {
        if (client) {
            client.on("connect", () => {
                setConnectStatus("Connected");
                mqttSub({ topic: "transactions/buy", qos: 0 });
                mqttSub({ topic: "transactions/sell", qos: 0 });
            });
            client.on("error", (err) => {
                console.error("Connection error: ", err);
                setConnectStatus("Connection Error");
                client.end();
            });
            client.on("reconnect", () => {
                setConnectStatus("Reconnecting...");
            });
            client.on("message", (topic, message) => {
                const payload = {
                    topic,
                    message: message.toString(),
                    date: new Date().toLocaleDateString(),
                    time: new Date().toLocaleTimeString(),
                };
                setTransactionData([...transactionData, payload]);
                fs.writeFile(
                    "transaction.json",
                    JSON.stringify({
                        transaactions: [...transactionData, payload],
                    }),
                    (err) => {
                        if (err) console.log("Error writing file:", err);
                    }
                );
            });
        }
    }, [client]);

    return useRoutes([
        {
            path: "/",
            element: <DashboardLayout connectStatus={connectStatus} />,
            children: [
                { element: <Navigate to="/dashboard" replace /> },
                {
                    path: "dashboard",
                    element: <DashboardApp transactionData={transactionData} />,
                },
                {
                    path: "transaction",
                    element: <Transaction transactionData={transactionData} />,
                },
                {
                    path: "livestream",
                    element: <LiveStream />,
                },
                { path: "404", element: <NotFound /> },
                { path: "/", element: <Navigate to="/dashboard" /> },
                { path: "*", element: <Navigate to="/404" /> },
            ],
        },
        { path: "*", element: <Navigate to="/404" replace /> },
    ]);
}
