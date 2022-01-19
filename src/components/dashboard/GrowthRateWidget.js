import { Icon } from "@iconify/react";
import AreaChartOutlined from "@iconify/icons-ant-design/area-chart-outlined";
// material
import { alpha, styled } from "@mui/material/styles";
import { Card, Typography } from "@mui/material";
// utils
import { fShortenNumber } from "../../utils/formatNumber";

export default function GrowthRateWidget({ value }) {
    const RootStyle = styled(Card)(({ theme }) => ({
        boxShadow: "none",
        textAlign: "center",
        padding: theme.spacing(5, 0),
        color:
            value >= 0 ? theme.palette.primary.dark : theme.palette.error.dark,
        backgroundColor:
            value >= 0
                ? theme.palette.primary.lighter
                : theme.palette.error.lighter,
    }));

    const IconWrapperStyle = styled("div")(({ theme }) => ({
        margin: "auto",
        display: "flex",
        borderRadius: "50%",
        alignItems: "center",
        width: theme.spacing(8),
        height: theme.spacing(8),
        justifyContent: "center",
        marginBottom: theme.spacing(3),
        color:
            value >= 0 ? theme.palette.primary.dark : theme.palette.error.dark,
        backgroundImage: `linear-gradient(135deg, ${alpha(
            value >= 0 ? theme.palette.primary.dark : theme.palette.error.dark,
            0
        )} 0%, ${alpha(
            value >= 0 ? theme.palette.primary.dark : theme.palette.error.dark,
            0.24
        )} 100%)`,
    }));

    return (
        <RootStyle>
            <IconWrapperStyle>
                <Icon icon={AreaChartOutlined} width={24} height={24} />
            </IconWrapperStyle>
            <Typography variant="h3">
                {fShortenNumber(value)}
                {"%"}
            </Typography>
            <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
                Asset Growth
            </Typography>
        </RootStyle>
    );
}
