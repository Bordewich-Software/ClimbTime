import * as React from 'react';
import type {AppProps} from "next/app";
import {Box, Container, CssBaseline, Grid, ThemeProvider, Typography} from "@mui/material";
import darkTheme from "../styles/theme/dark-theme";
import Head from 'next/head';
import {ApolloProviderWrapper} from "../components/apollo-provider-wrapper";
import {CacheProvider, EmotionCache} from "@emotion/react";
import createEmotionCache from "../utility/createEmotionCache";
import Copyright from "../components/copyright";
import Header from "../components/header";

export interface MyAppProps extends AppProps {
    emotionCache?: EmotionCache;
}

const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props: MyAppProps) {
    const {Component, emotionCache = clientSideEmotionCache, pageProps} = props;
    return (
        <CacheProvider value={emotionCache}>
            <Head>
                <meta name="viewport" content="initial-scale=1, width=device-width"/>
            </Head>
            <ThemeProvider theme={darkTheme}>
                <ApolloProviderWrapper>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100vh',
                        }}
                    >
                        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                        <CssBaseline/>
                        <Box component={"header"}
                             sx={{
                                 py: 3,
                                 px: 2,
                                 backgroundColor: (theme) =>
                                     theme.palette.mode === 'light'
                                         ? theme.palette.grey[200]
                                         : theme.palette.grey[800],
                             }}>
                            <Container>
                                <Header/>
                            </Container>
                        </Box>
                        <Box component="main" sx={{
                            height: '100%',
                        }}  >
                            <Component {...pageProps} />
                        </Box>
                        <Box
                            component="footer"
                            sx={{
                                py: 3,
                                px: 2,
                                mt: 'auto',
                                backgroundColor: (theme) =>
                                    theme.palette.mode === 'light'
                                        ? theme.palette.grey[200]
                                        : theme.palette.grey[800],
                            }}
                        >
                            <Container maxWidth="sm">
                                <Copyright/>
                            </Container>
                        </Box>
                    </Box>
                </ApolloProviderWrapper>
            </ThemeProvider>
        </CacheProvider>
    );
}