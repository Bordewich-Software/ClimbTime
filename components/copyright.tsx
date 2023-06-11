import {Grid, Typography} from "@mui/material";
import Image from "next/image";
import skalle from "../public/skalle.svg";
import skalleLogo from "../public/skalle-logo-square.svg";
import itemaLogo from "../public/Itema_logo.png";
import React from "react";

export default function Copyright() {
    return (
        <Grid container direction={"row"} alignItems={"center"} justifyContent={"space-evenly"}>
            <Grid item>
                <Typography variant="body2" color="text.secondary">
                    {'Copyright © Trond Bordewich'}
                </Typography>
                <Image src={itemaLogo} alt={"itema-logo"} width={170} height={50}/>
            </Grid>
            <Grid item>
                <Typography variant="body2" color="text.secondary">
                    {'John A. Fossum'}
                </Typography>
                <Image src={skalle} alt={"skalle"} height={50}/>
                <Image src={skalleLogo} alt={"skalle-logo"} height={50}/>
            </Grid>
        </Grid>

    );
}