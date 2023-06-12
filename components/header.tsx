import React from "react";
import {Grid, Typography} from "@mui/material";
import Image from "next/image";
import tkkWhite from "../public/TKKWhiteTransparent.svg";


export default function Header() {
    return (
    <Grid container  alignItems={"center"} justifyContent={"space-between"}>
        <Typography variant="h4" color="text.secondary" align="center">
            {'Climb Timer'}
        </Typography>
        <Image src={tkkWhite} alt={"itema-logo"} width={100}/>
    </Grid>
    );
}