import { merge } from "lodash";
import ReactApexChart from "react-apexcharts";
// material
import { Card, CardHeader, Box } from "@mui/material";
//
import { BaseOptionChart } from "../charts";
import { useEffect, useState } from "react";

const initAsset = 200;

// ----------------------------------------------------------------------

export default function DailyRecordChart({ data, sellData, buyData }) {
    const [options, setOptions] = useState({});
    const [charData, setCharData] = useState([]);

    const updateData = () => {
        var l = [];
        var newBuy = {};
        var newSell = {};
        data.forEach((item) => {
            l.push(item.date);
        });

        const newLabel = [...new Set(l)];
        console.log(newLabel);

        sellData.forEach((item) => {
            if (newSell[item.date]) {
                newSell[item.date] +=
                    Math.round(
                        item.message.quantity * item.message.avgPrice * 10
                    ) / 10;
            } else {
                newSell[item.date] =
                    Math.round(
                        item.message.quantity * item.message.avgPrice * 10
                    ) / 10;
            }
        });
        buyData.forEach((item) => {
            if (newBuy[item.date]) {
                newBuy[item.date] +=
                    Math.round(
                        item.message.quantity * item.message.avgPrice * 10
                    ) / 10;
            } else {
                newBuy[item.date] =
                    Math.round(
                        item.message.quantity * item.message.avgPrice * 10
                    ) / 10;
            }
        });
        console.log(newSell);
        console.log(newBuy);

        const newOptions = {
            stroke: { width: [0, 2, 3] },
            plotOptions: { bar: { columnWidth: "11%", borderRadius: 4 } },
            fill: { type: ["solid", "gradient", "solid"] },
            labels: newLabel,
            xaxis: { type: "datetime" },
            yaxis: [
                {
                    show: true,
                },
                {
                    show: false,
                },
                {
                    show: true,
                    opposite: true,
                },
            ],
            tooltip: {
                shared: true,
                intersect: false,
                y: {
                    formatter: (y) => {
                        if (typeof y !== "undefined") {
                            return `$ ${y}`;
                        }
                        return y;
                    },
                },
            },
        };
        setOptions(newOptions);
        var curAsset = initAsset;
        const chart_data = [
            {
                name: "Buy",
                type: "column",
                data: newLabel.map((item) => (newBuy[item] ? newBuy[item] : 0)),
            },
            {
                name: "Sell",
                type: "column",
                data: newLabel.map((item) =>
                    newSell[item] ? newSell[item] : 0
                ),
            },
            {
                name: "Asset",
                type: "line",
                data: newLabel.map((item) => {
                    curAsset =
                        curAsset +
                        (newSell[item] ? newSell[item] : 0) -
                        (newBuy[item] ? newBuy[item] : 0);
                    return curAsset;
                }),
            },
        ];
        console.log(chart_data);
        setCharData(chart_data);
    };

    useEffect(() => {
        updateData();
    }, [data]);

    return (
        <Card>
            <CardHeader title="Daily Records" />
            <Box sx={{ p: 3, pb: 1 }} dir="ltr">
                <ReactApexChart
                    type="line"
                    series={charData}
                    options={options}
                    height={364}
                />
            </Box>
        </Card>
    );
}
