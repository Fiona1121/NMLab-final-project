import { useEffect, useState } from "react";
// material
import {
    Card,
    Table,
    Stack,
    TableRow,
    TableBody,
    TableCell,
    Container,
    Typography,
    TableContainer,
    TablePagination,
} from "@mui/material";
// components
import Page from "../components/Page";
import Scrollbar from "../components/Scrollbar";
import TransListHead from "../components/TransListHead";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: "time", label: "Time", alignRight: false },
    { id: "symbol", label: "Symbol", alignRight: false },
    { id: "avgPrice", label: "Average Price", alignRight: false },
    { id: "quantity", label: "Quantity", alignRight: false },
    { id: "" },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

export default function Transaction({ transactionData }) {
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState("desc");
    const [orderBy, setOrderBy] = useState("time");
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [data, setData] = useState([]);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        setData(
            transactionData.map((item) => {
                return {
                    topic: item.topic,
                    symbol: item.message.symbol,
                    quantity: item.message.quantity,
                    avgPrice: item.message.avgPrice,
                    time: item.date + " " + item.time,
                };
            })
        );
    }, [transactionData]);

    return (
        <Page title="Transaction | Hamster-Office">
            <Container>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={5}
                >
                    <Typography variant="h3" gutterBottom>
                        Transaction
                    </Typography>
                </Stack>

                <Card>
                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <TransListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    onRequestSort={handleRequestSort}
                                />
                                <TableBody>
                                    {stableSort(
                                        data,
                                        getComparator(order, orderBy)
                                    )
                                        .slice(
                                            page * rowsPerPage,
                                            page * rowsPerPage + rowsPerPage
                                        )
                                        .map((row, index) => {
                                            return (
                                                <TableRow
                                                    hover
                                                    key={`trans_${index}`}
                                                    tabIndex={-1}
                                                    role="checkbox"
                                                >
                                                    <TableCell align="left">
                                                        {row.time}
                                                    </TableCell>
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                    >
                                                        <Stack
                                                            direction="row"
                                                            alignItems="center"
                                                            spacing={2}
                                                        >
                                                            <Typography
                                                                variant="subtitle2"
                                                                noWrap
                                                            >
                                                                {row.symbol}
                                                            </Typography>
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        {row.avgPrice}
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        {row.quantity}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Scrollbar>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={data.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>
            </Container>
        </Page>
    );
}
