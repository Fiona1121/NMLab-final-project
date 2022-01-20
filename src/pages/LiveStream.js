// material
import { styled } from "@mui/material/styles";
import { Box, Container, Stack, Typography } from "@mui/material";
// components
import { MotionContainer } from "../components/animate";
import Page from "../components/Page";
import YoutubeLiveEmbed from "../components/YoutubeLiveEmbed";

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
    display: "flex",
    minHeight: "100%",
    alignItems: "center",
}));

// ----------------------------------------------------------------------

export default function LiveStream() {
    return (
        <RootStyle title="Live Stream | Hamster-Office">
            <Container maxWidth="md">
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={5}
                >
                    <Typography variant="h3" gutterBottom>
                        Youtube Live Stream
                    </Typography>
                </Stack>
                <Box
                    sx={{
                        maxWidth: 960,
                        margin: "auto",
                        textAlign: "center",
                    }}
                >
                    <YoutubeLiveEmbed embedId="o4HG30JmFKM"></YoutubeLiveEmbed>
                </Box>
            </Container>
        </RootStyle>
    );
}
