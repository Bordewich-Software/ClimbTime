import React from "react";
import {Grid, Typography} from "@mui/material";
import Image from "next/image";
import tkkWhite from "../public/TKKWhiteTransparent.svg";
import climbTime from "../public/climb-time.png";
import Link from "next/link";


export default function Header() {
    return (
        <Grid container alignItems={"center"} justifyContent={"space-between"}>
            <Link href={"/"}><Image src={climbTime} alt={"tkk-logo"} width={100}/></Link>
            <Image src={tkkWhite} alt={"tkk-logo"} width={100}/>
        </Grid>
    );
}