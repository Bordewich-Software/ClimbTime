import * as React from "react";
import {useState} from "react";
import Button from "@mui/material/Button";
import {gql, useMutation, useQuery} from "@apollo/client";
import Typography from "@mui/material/Typography";
import {useRouter} from "next/router";
import difference from "lodash/difference";
import sortBy from "lodash/sortBy";
import {Grid, TextField} from "@mui/material";


const EXISTING_TIMERS = gql`
    query ExistingTimers {
        currentStopwatches
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

export default function Home() {

    const {data, error} = useQuery(EXISTING_TIMERS);

    const [createStopwatch, {error: createError}] = useMutation(CREATE_TIMER);

    const router = useRouter();

    const defaultMinutes = 6;
    const defaultSeconds = 0;
    let [minutes, setMinutes] = useState<number>(defaultMinutes);
    let [seconds, setSeconds] = useState<number>(defaultSeconds);

    const createNewStopwatch = async (id: string) => {
        await createStopwatch({variables: {input: {id, minutes, seconds}}})
        await router.replace(`/timer/${id}?minutes=${minutes}&seconds=${seconds}`, undefined, {shallow: true});
    }

    const navigateToTimer = async (id: string) => await router.push(`/timer/${id}`);

    const currentStopwatches = data?.currentStopwatches;
    const currentTimerIds: string[] = sortBy(currentStopwatches ?? []);
    const hasStopwatches = currentTimerIds.length > 0;

    const nextTimerIds = difference(AllowedTimerIds, currentTimerIds).sort();
    const nextTimerId = nextTimerIds.length > 0 ? nextTimerIds[0] : "";

    return (<Grid container direction={"column"} alignItems={"center"} rowGap={2}>

        {!hasStopwatches &&
            <Typography>{"There are currently no existing stopwatches. Click 'Add new timer' to create a new one"}</Typography>}

        {currentTimerIds.map((id: string) => (<Grid key={id} item><Button variant={"contained"} key={`go-to-timer-button-${id}`}
                                                                 onClick={() => navigateToTimer(id)}>{`Go to timer ${id}`}</Button></Grid>))}

        {nextTimerId !== "" &&
            <Grid pt={20} container direction={"row"} alignItems={"center"} justifyContent={"center"}>
                <TextField id="minutes" label="Minutes" type={"number"}
                           onChange={(v) => setMinutes(+v.target.value)}
                           value={minutes}/>
                <TextField id="seconds" label="Seconds" type={"number"}
                           onChange={(v) => setSeconds(+v.target.value)}
                           value={seconds}/>
                <Button key={"create-new-timer"}
                        onClick={() => createNewStopwatch(nextTimerId)}>{"Add new timer"}</Button>
            </Grid>}

    </Grid>);
}