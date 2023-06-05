import * as React from "react";
import Button from "@mui/material/Button";
import {gql, useMutation, useQuery} from "@apollo/client";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {useRouter} from "next/router";
import difference from "lodash/difference";
import sortBy from "lodash/sortBy";



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

    const createNewStopwatch = async (id: string) => {
        await createStopwatch({variables: {input: {id}}})
        await router.replace(`/timer/${id}`, undefined, {shallow: true});
    }

    const navigateToTimer = async (id: string) => await router.push(`/timer/${id}`);

    const currentStopwatches = data?.currentStopwatches;
    const currentTimerIds: string[] = sortBy(currentStopwatches ?? []);
    const hasStopwatches = currentTimerIds.length >= 0;

    const nextTimerIds = difference(AllowedTimerIds, currentTimerIds).sort();
    const nextTimerId = nextTimerIds.length > 0 ? nextTimerIds[0] : "";

    if (data?.currentStopwatches == null || data?.currentStopwatches === 0) {
        return <Box>
            <Typography>{"There are currently no existing stopwatches. Click the button to create a new one"}</Typography>
            <Button onClick={() => createNewStopwatch("1")}>{"Add new timer"}</Button>
        </Box>
    }

    return (<Box>
        {!hasStopwatches && <Typography>{"There are currently no existing stopwatches. Click the button to create a new one"}</Typography>}
        {currentTimerIds.map((id: string) => (<Button variant={"contained"} key={`go-to-timer-button-${id}`} onClick={() => navigateToTimer(id)}>{`Go to timer ${id}`}</Button>))}
        {nextTimerId !== "" && <Button key={"create-new-timer"} onClick={() => createNewStopwatch(nextTimerId)}>{"Add new timer"}</Button>}
    </Box>);
}