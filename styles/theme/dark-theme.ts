import * as React from "react";
import {Roboto} from 'next/font/google';
import {createTheme} from '@mui/material/styles';
import {red} from '@mui/material/colors';

export const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
    fallback: ['Helvetica', 'Arial', 'sans-serif'],
});

// Create a theme instance.
const darkTheme = createTheme({
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

darkTheme.typography.timer = {
    fontSize: '9.5rem',
    [darkTheme.breakpoints.up('sm')]: {
        fontSize: '15rem',
    },
    [darkTheme.breakpoints.up('md')]: {
        fontSize: '22.5rem',
    },
    [darkTheme.breakpoints.up('lg')]: {
        fontSize: '27rem',
    },
    [darkTheme.breakpoints.up('xl')]: {
        fontSize: '30rem',
    },
};

declare module '@mui/material/styles' {
    interface TypographyVariants {
        timer: React.CSSProperties;
    }

    // allow configuration using `createTheme`
    interface TypographyVariantsOptions {
        timer?: React.CSSProperties;
    }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
    interface TypographyPropsVariantOverrides {
        timer: true;
    }
}

export default darkTheme;