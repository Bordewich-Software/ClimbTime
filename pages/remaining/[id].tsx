import React, {MutableRefObject, useEffect, useRef} from "react";
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
            stopwatchState: timerState
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
        // Play tick the last 3 seconds
        if (stopwatchState === "STARTED" && remainingHours === 0 && remainingMinutes === 0 && remainingSeconds <= 3 && tickingAudioRef.current != null) {
            tickingAudioRef.current.pause(); // Stop the ticking sound
            tickingAudioRef.current.currentTime = 0; // Reset the ticking sound
            tickingAudioRef.current.play().catch(console.log);
        }

        // Play horn sound when countdown is complete
        if (stopwatchState === "STARTED"
            && remainingHours === 0
            && remainingMinutes === 0
            && remainingSeconds === 0
            && tickingAudioRef.current != null
            && hornAudioRef.current != null) {
            tickingAudioRef.current.pause(); // Stop the ticking sound
            tickingAudioRef.current.currentTime = 0; // Reset the ticking sound
            hornAudioRef.current.play().catch(console.log);
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
        <audio ref={tickingAudioRef} src={"/tick.mp3"} preload={"auto"} />
        <audio ref={hornAudioRef} src={"/airhorn.mp3"} preload={"auto"} />
        <StopwatchComponent stopwatch={stopwatch} stopwatchState={stopwatchState}/>
    </>)
}