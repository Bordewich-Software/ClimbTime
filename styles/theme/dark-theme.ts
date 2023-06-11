import * as React from "react";
import {Roboto} from 'next/font/google';
import {createTheme, responsiveFontSizes} from '@mui/material/styles';
import {red} from '@mui/material/colors';

export const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
    fallback: ['Helvetica', 'Arial', 'sans-serif'],
});

// Create a theme instance.
const theme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: '#556cd6',
        },
        secondary: {
            main: '#19857b',
        },
        error: {
            main: red.A400,
        },
    },
    typography: {
        fontFamily: roboto.style.fontFamily,
    }
});

theme.typography.minuteTimer = {
    ...theme.typography.h1,
    fontSize: '9.5rem',
    [theme.breakpoints.up('sm')]: {
        fontSize: '15rem',
    },
    [theme.breakpoints.up('md')]: {
        fontSize: '22.5rem',
    },
    [theme.breakpoints.up('lg')]: {
        fontSize: '27rem',
    },
    [theme.breakpoints.up('xl')]: {
        fontSize: '30rem',
    },
};

theme.typography.hourTimer = {
    ...theme.typography.h1,
    fontSize: '5.5rem',
    [theme.breakpoints.up('sm')]: {
        fontSize: '9rem',
    },
    [theme.breakpoints.up('md')]: {
        fontSize: '15rem',
    },
    [theme.breakpoints.up('lg')]: {
        fontSize: '19rem',
    },
    [theme.breakpoints.up('xl')]: {
        fontSize: '25rem',
    },
};

declare module '@mui/material/styles' {
    interface TypographyVariants {
        minuteTimer: React.CSSProperties;
        hourTimer: React.CSSProperties;
    }

    // allow configuration using `createTheme`
    interface TypographyVariantsOptions {
        minuteTimer?: React.CSSProperties;
        hourTimer?: React.CSSProperties;
    }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
    interface TypographyPropsVariantOverrides {
        minuteTimer: true;
        hourTimer: true;
    }
}

const darkTheme = responsiveFontSizes(theme);

export default darkTheme;