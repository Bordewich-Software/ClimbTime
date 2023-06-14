import Typography from "@mui/material/Typography";
import {gql, useSubscription} from "@apollo/client";
import {useRouter} from "next/router";
import {Stopwatch} from "../../utility/stopwatch/models";
import StopwatchComponent from "../_lib/stopwatch-component";


const ELAPSED_TIMER_SUBSCRIPTION = gql`
    subscription ElapsedTimeSubscription($id: String!) {
        elapsedTime(id: $id) {
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

    const {data, error, loading} = useSubscription(ELAPSED_TIMER_SUBSCRIPTION, {
        variables: {
            id: timerId
        }
    });

    if (loading && !error)
        return (<Typography>{"Loading..."}</Typography>)

    if (error)
        return (<Typography>{`Oh no, an error occured: ${error?.message}`}</Typography>)

    const elapsedHours = data?.elapsedTime.hours ?? 0;
    const elapsedMinutes = data?.elapsedTime.minutes ?? 0;
    const elapsedSeconds = data?.elapsedTime.seconds ?? 0;

    const stopwatch: Stopwatch = {
        id: timerId,
        timeSpan: {
            hours: elapsedHours,
            minutes: elapsedMinutes,
            seconds: elapsedSeconds
        }
    }

    return (<StopwatchComponent stopwatch={stopwatch} stopwatchState={data?.elapsedTime.timerState}/>)
}
