import {Grid, Typography} from "@mui/material";
import Image from "next/image";
import skalleLogo from "../public/kodeskalle.svg";
import itemaLogo from "../public/Itema_logo.png";
import React from "react";

export default function Copyright() {
    return (
        <Grid container direction={"column"} alignItems={"flex-end"} justifyContent={"center"}>

            <Grid container direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                <Grid item>
                    <Typography variant="body2" color="text.secondary">
                        {'Trond Bordewich'}
                    </Typography>
                    <Image src={itemaLogo} alt={"itema-logo"} width={136} height={40}/>
                </Grid>
                <Grid item>
                    <Typography variant="body2" color="text.secondary">
                        {'John A. Fossum & Erling Neset'}
                    </Typography>
                    <Image src={skalleLogo} alt={"skalle"} height={40}/>
                </Grid>
            </Grid>
            <Typography variant="body2" color="text.secondary">
                {'Copyright © 2023'}
            </Typography>
        </Grid>

    );
}