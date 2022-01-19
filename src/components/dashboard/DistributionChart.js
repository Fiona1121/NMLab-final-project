import { useEffect, useState } from "react";
import { merge } from "lodash";
import ReactApexChart from "react-apexcharts";
// material
import { useTheme, styled } from "@mui/material/styles";
import { Card, CardHeader } from "@mui/material";
// utils
import { fNumber } from "../../utils/formatNumber";
//
import { BaseOptionChart } from "../charts";

// ----------------------------------------------------------------------

const CHART_HEIGHT = 372;
const LEGEND_HEIGHT = 72;

const ChartWrapperStyle = styled("div")(({ theme }) => ({
    height: CHART_HEIGHT,
    marginTop: theme.spacing(5),
    "& .apexcharts-canvas svg": { height: CHART_HEIGHT },
    "& .apexcharts-canvas svg,.apexcharts-canvas foreignObject": {
        overflow: "visible",
    },
    "& .apexcharts-legend": {
        height: LEGEND_HEIGHT,
        alignContent: "center",
        position: "relative !important",
        borderTop: `solid 1px ${theme.palette.divider}`,
        top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
    },
}));
const LABELS = ["BANDUSDT", "DOTUSDT", "ETHUSDT", "BNBUSDT", "BTCUSDT"];

// ----------------------------------------------------------------------

export default function DistributionChart({ data }) {
    const theme = useTheme();
    const [distribution, setDistribution] = useState([]);

    const chartOptions = merge(BaseOptionChart(), {
        colors: [
            theme.palette.primary.main,
            theme.palette.info.main,
            theme.palette.warning.main,
            theme.palette.error.main,
        ],
        labels: LABELS,
        stroke: { colors: [theme.palette.background.paper] },
        legend: { floating: true, horizontalAlign: "center" },
        dataLabels: { enabled: true, dropShadow: { enabled: false } },
        tooltip: {
            fillSeriesColor: false,
            y: {
                formatter: (seriesName) => fNumber(seriesName),
                title: {
                    formatter: (seriesName) => `#${seriesName}`,
                },
            },
        },
        plotOptions: {
            pie: { donut: { labels: { show: false } } },
        },
    });

    useEffect(() => {
        const newDis = LABELS.map((label) => {
            var count = 0;
            data.forEach((item) => {
                if (item.message.symbol == label) {
                    count += item.message.quantity;
                }
            });
            return count;
        });
        console.log(newDis);
        setDistribution(newDis);
    }, [data]);

    return (
        <Card>
            <CardHeader title="Distribution" />
            <ChartWrapperStyle dir="ltr">
                <ReactApexChart
                    type="pie"
                    series={distribution}
                    options={chartOptions}
                    height={280}
                />
            </ChartWrapperStyle>
        </Card>
    );
}
