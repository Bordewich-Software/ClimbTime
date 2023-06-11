import Typography from "@mui/material/Typography";
import {gql, useMutation, useSubscription} from "@apollo/client";
import {useRouter} from "next/router";
import {getKind, Stopwatch, StopwatchFormat} from "../../utility/stopwatch/models";
import {TimeSpan} from "../../utility/stopwatch/format-stopwatch-time";
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

const TOGGLE_TIMER = gql`
    mutation ToggleTimer($input: ToggleInput!) {
        toggle(input: $input) {
            timerState
        }
    }
`;

const RESET_TIMER = gql`
    mutation ResetTimer($input: ResetInput!) {
        reset(input: $input) {
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

    if (loading)
        return (<Typography>{"Loading..."}</Typography>)

    if (error)
        return (<Typography>{`Oh no, an error occured: ${error?.message}`}</Typography>)

    const remainingHours = data?.remainingTime.hours ?? 0;
    const remainingMinutes = data?.remainingTime.minutes ?? 0;
    const remainingSeconds = data?.remainingTime.seconds ?? 0;

    const stopwatch: Stopwatch = {
        id: timerId,
        timeSpan: {
            hours: remainingHours,
            minutes: remainingMinutes,
            seconds: remainingSeconds
        }
    }

    return (<StopwatchComponent stopwatch={stopwatch} timerState={data?.remainingTime.timerState}/>)
}