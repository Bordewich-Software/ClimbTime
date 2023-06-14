import React, {useEffect, useRef} from "react";
import Typography from "@mui/material/Typography";
import {gql, useSubscription} from "@apollo/client";
import {useRouter} from "next/router";
import {Stopwatch} from "../../utility/stopwatch/models";
import StopwatchComponent from "../_lib/stopwatch-component";


const REMAINING_TIMER_SUBSCRIPTION = gql`
    subscription RemainingTimeSubscription($id: String!) {
        remainingTime(id: $id) {
            hours
            minutes
            seconds
            timerState
        }
    }
`;

export default function Id() {
    const router = useRouter();
    const stopwatchId: string = router.query.id instanceof Array ? router.query.id?.[0] : router.query.id ?? "";

    const {data, error, loading} = useSubscription(REMAINING_TIMER_SUBSCRIPTION, {
        variables: {
            id: stopwatchId
        }
    });

    const remainingHours = data?.remainingTime.hours ?? 0;
    const remainingMinutes = data?.remainingTime.minutes ?? 0;
    const remainingSeconds = data?.remainingTime.seconds ?? 0;
    const stopwatchState = data?.remainingTime.stopwatchState

    const tickingAudioRef = useRef<HTMLAudioElement | null>(null);
    const hornAudioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const tick = new Audio("/tick.mp3")
        const horn = new Audio("/airhorn.mp3")

        tickingAudioRef.current = tick;
        hornAudioRef.current = horn;
        // Play tick the last 3 seconds
        if (stopwatchState === "STARTED" && remainingHours === 0 && remainingMinutes === 0 && remainingSeconds <= 3) {
            tick.play().catch(console.log);
        }

        // Play horn sound when countdown is complete
        if (stopwatchState === "STARTED" && remainingHours === 0 && remainingMinutes === 0 && remainingSeconds === 0) {
            tick.pause(); // Stop the ticking sound
            tick.currentTime = 0; // Reset the ticking sound
            horn.play().catch(console.log);
        }
    }, [remainingHours, remainingMinutes, remainingSeconds, stopwatchState])

    if (loading && !error)
        return (<Typography>{"Loading..."}</Typography>)

    if (error)
        return (<Typography>{`Oh no, an error occured: ${error?.message}`}</Typography>)

    const stopwatch: Stopwatch = {
        id: stopwatchId,
        timeSpan: {
            hours: remainingHours,
            minutes: remainingMinutes,
            seconds: remainingSeconds
        }
    }

    return (<>
        <StopwatchComponent stopwatch={stopwatch} stopwatchState={stopwatchState}/>
    </>)
}