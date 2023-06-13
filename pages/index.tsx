import * as React from "react";
import {useState} from "react";
import Button from "@mui/material/Button";
import {gql, useMutation, useQuery} from "@apollo/client";
import Typography from "@mui/material/Typography";
import {useRouter} from "next/router";
import difference from "lodash/difference";
import sortBy from "lodash/sortBy";
import {Grid, TextField} from "@mui/material";
import {StopwatchFormat} from "../utility/stopwatch/models";
import {formatFor, TimeSpan} from "../utility/stopwatch/format-stopwatch-time";


const EXISTING_TIMERS = gql`
    query ExistingTimers {
        stopwatchConfigs {
            id
            hours
            minutes
            seconds
            stopwatchFormat: format
        }
    }
`;

const CREATE_TIMER = gql`
    mutation AddTimer($input: CreateStopWatchInput!) {
        createStopWatch(input: $input) {
            boolean
            errors {
                ...on StopwatchExistsError {
                    message
                }
            }
        }
    }
`;

const AllowedTimerIds = ["1", "2", "3", "4", "5", "6"];

type StopwatchType = "Remaining" | "Elapsed";

export default function Home() {

    const {data, error} = useQuery(EXISTING_TIMERS);

    const [createStopwatch, {error: createError}] = useMutation(CREATE_TIMER);

    const router = useRouter();

    const defaultBoulderTimer: TimeSpan = {hours: 2, minutes: 30, seconds: 0};
    const defaultLeadTimer: TimeSpan = {hours: 0, minutes: 6, seconds: 0};

    const defaultHours = 0
    const defaultMinutes = 6;
    const defaultSeconds = 0;

    let [hours, setHours] = useState<number>(defaultHours);
    let [minutes, setMinutes] = useState<number>(defaultMinutes);
    let [seconds, setSeconds] = useState<number>(defaultSeconds);

    const navigateToRemainingTimer = async (id: string) => await router.push(`/remaining/${id}`, undefined, {shallow: true});
    const navigateToElapsedTimer = async (id: string) => await router.push(`/elapsed/${id}`, undefined, {shallow: true});

    const createNewStopwatch = async (id: string, end: TimeSpan, format: StopwatchFormat, type: StopwatchType) => {
        await createStopwatch({variables: {input: {id, format, ...end}}})
        if (type === "Remaining")
            await navigateToRemainingTimer(id);
        else
            await navigateToElapsedTimer(id);
    }

    const stopwatchConfigs = sortBy(data?.stopwatchConfigs ?? [], "id");
    const currentTimerIds: string[] = stopwatchConfigs.map(c => c.id);
    const hasStopwatches = currentTimerIds.length > 0;

    const nextTimerIds = difference(AllowedTimerIds, currentTimerIds).sort();
    const nextTimerId = nextTimerIds.length > 0 ? nextTimerIds[0] : "";

    return (<Grid container direction={"column"} alignItems={"center"} justifyContent={"center"} rowGap={2}>
        {!hasStopwatches &&
            <Typography>{"There are currently no existing stopwatches. Click 'Add new timer' to create a new one"}</Typography>}

        {stopwatchConfigs.map((sc) => (
            <Grid key={sc.id} item container direction={"row"} alignItems={"center"} justifyContent={"center"} columnGap={1}>
                    <Typography>{`Timer ${sc.id} - ${formatFor(sc.stopwatchFormat, {hours: sc.hours, minutes: sc.minutes, seconds: sc.seconds})}`}</Typography>
                    <Button variant={"contained"} key={`go-to-remaining-timer-button-${sc.id}`}
                            onClick={() => navigateToRemainingTimer(sc.id)}>{`Up`}</Button>
                    <Button variant={"contained"} key={`go-to-elapsed-timer-button-${sc.id}`}
                            onClick={() => navigateToElapsedTimer(sc.id)}>{`Down`}</Button>
            </Grid>
        ))}

        {nextTimerId !== "" &&
            <Grid pt={5} container alignItems={"center"} direction={"column"} rowGap={3} justifyContent={"center"}>
                <Button key={"create-new-minutes-timer"}
                        onClick={() => createNewStopwatch(nextTimerId, defaultLeadTimer, "MINUTES", "Remaining")}>{"Add new lead climb stopwatch (6 minutes)"}</Button>
                <Button key={"create-new-hours-timer"}
                        onClick={() => createNewStopwatch(nextTimerId, defaultBoulderTimer, "HOURS", "Remaining")}>{"Add new boulder stopwatch (2,5 hours)"}</Button>
                <Grid container direction={"row"} alignItems={"center"} justifyContent={"center"}>
                    <Grid container item direction={"column"} alignItems={"center"}>
                        <TextField id="hours" label="Hours" type={"number"} variant={"filled"}
                                   onChange={(v) => setHours(+v.target.value)}
                                   value={hours}/>
                        <TextField id="minutes" label="Minutes" type={"number"} variant={"filled"}
                                   onChange={(v) => setMinutes(+v.target.value)}
                                   value={minutes}/>
                        <TextField id="seconds" label="Seconds" type={"number"} variant={"filled"}
                                   onChange={(v) => setSeconds(+v.target.value)}
                                   value={seconds}/>
                    </Grid>
                    <Button key={"create-new-timer"}
                            onClick={() => hours > 0 ? createNewStopwatch(nextTimerId, {
                                hours,
                                minutes,
                                seconds
                            }, "HOURS", "Remaining") : createNewStopwatch(nextTimerId, {
                                hours,
                                minutes,
                                seconds
                            }, "MINUTES", "Remaining")}>{"Add new"}</Button>
                </Grid>
            </Grid>}

    </Grid>);
}