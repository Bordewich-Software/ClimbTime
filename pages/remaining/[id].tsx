import Typography from "@mui/material/Typography";
import {gql, useSubscription} from "@apollo/client";
import {useRouter} from "next/router";
import {Stopwatch} from "../../utility/stopwatch/models";
import StopwatchComponent from "../_lib/stopwatch-component";

import {MutableRefObject, useEffect, useRef} from "react";


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
    const audioTickRef = useRef(null);
    const audioTimesUpRef = useRef(null);
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
        const playAudio = async (audioRef: MutableRefObject<any>) => {
            try {
                await audioRef.current.play();
                // Audio playback started successfully
            } catch (error) {

            }
        };
        if (remainingHours === 0 && remainingMinutes === 0) {
            if ([1, 2, 3].includes(remainingSeconds))
                playAudio(audioTickRef)
            if (remainingSeconds <= 0 && timerState === "STOPPED")
                playAudio(audioTimesUpRef)
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
        <audio ref={audioTickRef} src={"/tick.mp3"} />
        <audio ref={audioTimesUpRef} src={"/airhorn.mp3"} />
        <StopwatchComponent stopwatch={stopwatch} timerState={timerState}/>
    </>)
}