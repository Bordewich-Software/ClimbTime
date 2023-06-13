import Typography from "@mui/material/Typography";
import {gql, useSubscription} from "@apollo/client";
import {useRouter} from "next/router";
import {Stopwatch} from "../../utility/stopwatch/models";
import StopwatchComponent from "../_lib/stopwatch-component";

import {useEffect} from "react";

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
    const timerId: string = router.query.id instanceof Array ? router.query.id?.[0] : router.query.id ?? "";

    const {data, error, loading} = useSubscription(REMAINING_TIMER_SUBSCRIPTION, {
        variables: {
            id: timerId
        }
    });

    const remainingHours = data?.remainingTime.hours ?? 0;
    const remainingMinutes = data?.remainingTime.minutes ?? 0;
    const remainingSeconds = data?.remainingTime.seconds ?? 0;
    const timerState = data?.remainingTime.timerState

    useEffect(() => {
        if (remainingHours === 0 && remainingMinutes === 0 && remainingSeconds <= 2) {
            const tick = new Audio("/tick.mp3")
            const horn = new Audio("/airhorn.mp3")
            if ([0, 1, 2].includes(remainingSeconds))
                tick.play().finally()
            if (remainingSeconds <= 0 && timerState === "STOPPED")
                horn.play().finally()
        }
    }, [remainingHours, remainingMinutes, remainingSeconds, timerState])

    if (loading)
        return (<Typography>{"Loading..."}</Typography>)

    if (error)
        return (<Typography>{`Oh no, an error occured: ${error?.message}`}</Typography>)

    const stopwatch: Stopwatch = {
        id: timerId,
        timeSpan: {
            hours: remainingHours,
            minutes: remainingMinutes,
            seconds: remainingSeconds
        }
    }

    return (<>
        <StopwatchComponent stopwatch={stopwatch} timerState={timerState}/>
    </>)
}