import { Icon } from "@iconify/react";
import BarChartOutlined from "@iconify/icons-ant-design/bar-chart-outlined";
// material
import { alpha, styled } from "@mui/material/styles";
import { Card, Typography } from "@mui/material";
// utils
import { fShortenNumber } from "../../utils/formatNumber";

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
    boxShadow: "none",
    textAlign: "center",
    padding: theme.spacing(5, 0),
    color: theme.palette.secondary.darker,
    backgroundColor: theme.palette.secondary.lighter,
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
    color: theme.palette.secondary.dark,
    backgroundImage: `linear-gradient(135deg, ${alpha(
        theme.palette.secondary.dark,
        0
    )} 0%, ${alpha(theme.palette.secondary.dark, 0.24)} 100%)`,
}));

// ----------------------------------------------------------------------

export default function ROIWidget({ value }) {
    return (
        <RootStyle>
            <IconWrapperStyle>
                <Icon icon={BarChartOutlined} width={24} height={24} />
            </IconWrapperStyle>
            <Typography variant="h3">
                {fShortenNumber(value)}
                {"%"}
            </Typography>
            <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
                Return of Investment (ROI)
            </Typography>
        </RootStyle>
    );
}
