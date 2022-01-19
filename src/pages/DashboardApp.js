// material
import { Box, Grid, Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import {
    AssetWidget,
    DailyRecordChart,
    DistributionChart,
    GrowthRateWidget,
    ROIWidget,
    TotalOrderWidget,
} from "../components/dashboard";
// components
import Page from "../components/Page";
const initAsset = 200;

// ----------------------------------------------------------------------

export default function DashboardApp({ transactionData }) {
    const [data, setData] = useState([]);
    const [sellData, setSellData] = useState([]);
    const [buyData, setBuyData] = useState([]);
    const [ROI, setROI] = useState(0);
    const [growthRate, setGrowthRate] = useState(0);
    const [asset, setAsset] = useState(0);

    const updateData = () => {
        const buy = transactionData.filter(
            (item) => item.topic === "transactions/buy"
        );
        const sell = transactionData.filter(
            (item) => item.topic === "transactions/sell"
        );
        console.log(buy);
        setData(transactionData);
        setBuyData(buy);
        setSellData(sell);
        var totalBuy = 0;
        var totalSell = 0;
        for (var i = 0; i < buy.length; i++) {
            totalBuy += buy[i].message.quantity * buy[i].message.avgPrice;
        }
        for (var i = 0; i < sell.length; i++) {
            totalSell += sell[i].message.quantity * sell[i].message.avgPrice;
        }
        var flow = totalSell - totalBuy;
        setROI((flow / totalBuy) * 100);
        setGrowthRate((flow / initAsset) * 100);
        setAsset(initAsset + flow);
    };

    useEffect(() => {
        updateData();
    }, [transactionData]);

    return (
        <Page title="Dashboard | Hamster-Office">
            <Container maxWidth="xl">
                <Box sx={{ pb: 5 }}>
                    <Typography variant="h3">
                        Hi, Welcome to Hamster Office
                    </Typography>
                </Box>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                        <TotalOrderWidget value={data.length} />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <AssetWidget value={asset} />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <ROIWidget value={ROI} />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <GrowthRateWidget value={growthRate} />
                    </Grid>

                    <Grid item xs={12} md={6} lg={8}>
                        <DailyRecordChart
                            data={data}
                            sellData={sellData}
                            buyData={buyData}
                        />
                    </Grid>

                    <Grid item xs={12} md={6} lg={4}>
                        <DistributionChart data={data} />
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
}
