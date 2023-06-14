import * as React from "react";
import {useEffect, useState} from "react";
import Button from "@mui/material/Button";
import {gql, useLazyQuery, useMutation} from "@apollo/client";
import Typography from "@mui/material/Typography";
import {useRouter} from "next/router";
import difference from "lodash/difference";
import sortBy from "lodash/sortBy";
import {Grid, TextField} from "@mui/material";
import {StopwatchFormat} from "../utility/stopwatch/models";
import {formatFor, TimeSpan} from "../utility/stopwatch/format-stopwatch-time";
import {GetServerSidePropsContext} from "next";
import {getSession} from "next-auth/react";


const EXISTING_STOPWATCHES = gql`
    query ExistingStopwatches {
        stopwatchConfigs {
            id
            hours
            minutes
            seconds
            stopwatchFormat: format
        }
    }
`;

const CREATE_STOPWATCH = gql`
    mutation CreateStopwatch($input: CreateStopWatchInput!) {
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

const AllowedStopwatchIds = ["1", "2", "3", "4", "5", "6"];

type StopwatchType = "Remaining" | "Elapsed";

export default function Home() {
    const [fetchStopwatches, {data, error}] = useLazyQuery(EXISTING_STOPWATCHES, {fetchPolicy: "cache-and-network"});

    const [createStopwatch, {error: createError}] = useMutation(CREATE_STOPWATCH);

    const router = useRouter();

    useEffect(() => {
        fetchStopwatches()
    }, [fetchStopwatches])

    const defaultBoulderStopwatch: TimeSpan = {hours: 2, minutes: 30, seconds: 0};
    const defaultLeadStopwatch: TimeSpan = {hours: 0, minutes: 6, seconds: 0};

    const defaultHours = 0
    const defaultMinutes = 6;
    const defaultSeconds = 0;

    let [hours, setHours] = useState<number>(defaultHours);
    let [minutes, setMinutes] = useState<number>(defaultMinutes);
    let [seconds, setSeconds] = useState<number>(defaultSeconds);

    const navigateToCountdown = async (id: string) => await router.push(`/remaining/${id}`, undefined, {shallow: true});
    const navigateToStopwatch = async (id: string) => await router.push(`/elapsed/${id}`, undefined, {shallow: true});

    const createNewStopwatch = async (id: string, end: TimeSpan, format: StopwatchFormat, type: StopwatchType) => {
        await createStopwatch({variables: {input: {id, format, ...end}}})
        // await fetchStopwatches({refetchWritePolicy: "overwrite"})
        if (type === "Remaining")
            await navigateToCountdown(id);
        else
            await navigateToStopwatch(id);
    }

    const stopwatchConfigs = sortBy(data?.stopwatchConfigs ?? [], "id");
    const currentStopwatchIds: string[] = stopwatchConfigs.map(c => c.id);
    const hasStopwatches = currentStopwatchIds.length > 0;

    const nextStopwatchIds = difference(AllowedStopwatchIds, currentStopwatchIds).sort();
    const nextStopwatchId = nextStopwatchIds.length > 0 ? nextStopwatchIds[0] : "";

    return (<Grid container direction={"column"} alignItems={"center"} justifyContent={"center"} rowGap={2}>
        {!hasStopwatches &&
            <Typography>{"Click one of the 'Add new' to create a stopwatch"}</Typography>}

        {stopwatchConfigs.map((sc) => (
            <Grid key={sc.id} item container direction={"row"} alignItems={"center"} justifyContent={"center"}
                  columnGap={1}>
                <Typography>{`Stopwatch ${sc.id} - ${formatFor("HOURS", {
                    hours: sc.hours,
                    minutes: sc.minutes,
                    seconds: sc.seconds
                })}`}</Typography>
                <Button variant={"contained"} key={`go-to-stopwatch-button-${sc.id}`}
                        onClick={() => navigateToStopwatch(sc.id)}>{`Up`}</Button>
                <Button variant={"contained"} key={`go-to-countdown-button-${sc.id}`}
                        onClick={() => navigateToCountdown(sc.id)}>{`Down`}</Button>
            </Grid>
        ))}

        {nextStopwatchId !== "" &&
            <Grid pt={5} container alignItems={"center"} direction={"column"} rowGap={3} justifyContent={"center"}>
                <Button key={"create-new-minutes-stopwatch"}
                        onClick={() => createNewStopwatch(nextStopwatchId, defaultLeadStopwatch, "MINUTES", "Remaining")}>{"Add new lead climb stopwatch (6 minutes)"}</Button>
                <Button key={"create-new-hours-stopwatch"}
                        onClick={() => createNewStopwatch(nextStopwatchId, defaultBoulderStopwatch, "HOURS", "Remaining")}>{"Add new boulder stopwatch (2,5 hours)"}</Button>
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
                    <Button key={"create-new-stopwatch"}
                            onClick={() => hours > 0 ? createNewStopwatch(nextStopwatchId, {
                                hours,
                                minutes,
                                seconds
                            }, "HOURS", "Remaining") : createNewStopwatch(nextStopwatchId, {
                                hours,
                                minutes,
                                seconds
                            }, "MINUTES", "Remaining")}>{"Add new"}</Button>
                </Grid>
            </Grid>}

    </Grid>);
}

export const getServerSideProps = async (
    context: GetServerSidePropsContext
) => {
    const session = await getSession({req: context.req});

    if (!session) {
        return {
            redirect: {
                destination: '/api/auth/signin',
                permanent: false,
            },
        };
    }

    return {
        props: {session},
    };
};