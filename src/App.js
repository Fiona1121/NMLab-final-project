import React from "react";
import MqttContent from "./components/mqttContent";

import "./App.css";
import YoutubeEmbed from "./components/youtubeEmbed";

const App = () => {
    return (
        <div className="App">
            <h1 className="title">Hamster Office</h1>
            <YoutubeEmbed embedId="rokGy0huYEA" />
            <h2 className="title">MQTT Dashboard</h2>
            <MqttContent></MqttContent>
        </div>
    );
};

export default App;
