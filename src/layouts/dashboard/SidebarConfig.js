import { Icon } from "@iconify/react";
import pieChart2Fill from "@iconify/icons-eva/pie-chart-2-fill";
import baselinePriceChange from "@iconify/icons-ic/baseline-price-change";
import baselineOndemandVideo from "@iconify/icons-ic/baseline-ondemand-video";

// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfig = [
    {
        title: "dashboard",
        path: "/dashboard",
        icon: getIcon(pieChart2Fill),
    },
    {
        title: "transaction",
        path: "/transaction",
        icon: getIcon(baselinePriceChange),
    },
    {
        title: "live stream",
        path: "/livestream",
        icon: getIcon(baselineOndemandVideo),
    },
];

export default sidebarConfig;
