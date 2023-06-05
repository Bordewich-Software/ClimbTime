import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import LinearProgress, {linearProgressClasses} from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import {gql, useMutation, useSubscription} from "@apollo/client";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';
import {pink} from "@mui/material/colors";
import styled from "@emotion/styled";
import darkTheme from "../../styles/theme/dark-theme";
import {useRouter} from "next/router";


const TIMER_SUBSCRIPTION = gql`
    subscription ElapsedTimeSubscription($id: String!) {
        elapsedTime(id: $id) {
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

type ElapsedTime = { minutes: number, seconds: number }

function formatElapsedTime(elapsedTime?: ElapsedTime) {
    if (elapsedTime == null)
        return "00:00";

    const d = new Date();
    d.setMinutes(elapsedTime.minutes);
    d.setSeconds(elapsedTime.seconds);

    return Intl.DateTimeFormat("nb-NO", {
        minute: "2-digit",
        second: "2-digit"
    }).format(d);
}

export default function Id() {

    const router = useRouter();
    const timerId = router.query.id;
    const {data, error, loading} = useSubscription(TIMER_SUBSCRIPTION, {
        variables: {
            id: timerId
        }
    });
    const [toggleTimer, {error: startTimerError}] = useMutation(TOGGLE_TIMER, {
        variables: {
            input: {
                id: timerId
            }
        }
    });
    const [resetTimer, {error: resetTimerError}] = useMutation(RESET_TIMER, {
        variables: {
            input: {
                id: timerId
            }
        }
    });


    if (loading)
        return (<Typography>{"Loading..."}</Typography>)

    if (error)
        return (<Typography>{`Oh no, an error occured: ${error?.message}`}</Typography>)

    if (startTimerError)
        return (<Typography>{`Oh no, an error occured: ${startTimerError?.message}`}</Typography>)

    if (resetTimerError)
        return (<Typography>{`Oh no, an error occured: ${resetTimerError?.message}`}</Typography>)

    const elapsedTime = formatElapsedTime(data?.elapsedTime);

    const isTimerRunning = data?.elapsedTime.timerState === "STARTED";

    const minutes = data?.elapsedTime.minutes ?? 0;
    const seconds = data?.elapsedTime.seconds ?? 0;
    const totalTime = minutes + (seconds / 60);

    const timerProgress = (totalTime * 100) / 6;

    return (
        <Grid container direction={"column"} sx={{height: '100%', pb: 1, pt: 0}} justifyContent={"space-between"}
              alignItems={"center"}>
            <Grid item>
                <Button id={"reset-timer-button"} name={"reset-timer-button"} type={"button"}
                        onClick={() => resetTimer()}>{"Reset"}</Button>
            </Grid>

            <Grid item pt={4} sx={{width: '100%'}}>
                <BorderLinearProgress variant={"determinate"} value={timerProgress}/>
            </Grid>

            <Grid item mt={0} mb={0}>
                <Typography mt={0} mb={0} variant={"timer"}>{elapsedTime}</Typography>
            </Grid>

            <Grid item justifyContent={"flex-end"} p={0}>
                {!isTimerRunning && <IconButton onClick={() => toggleTimer()}>
                    <PlayCircleOutlineIcon color={"success"} sx={{fontSize: 90}}></PlayCircleOutlineIcon>
                </IconButton>}
                {isTimerRunning && <IconButton onClick={() => toggleTimer()}>
                    <PauseCircleFilledIcon sx={{color: pink[500], fontSize: 90}}></PauseCircleFilledIcon>
                </IconButton>}
            </Grid>

        </Grid>
    )
}

const BorderLinearProgress = styled(LinearProgress)(({theme}) => ({
    height: 20,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: darkTheme.palette.background.default,
    },
    [`& .${linearProgressClasses.bar}`]: {
        backgroundColor: darkTheme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
    },
}));