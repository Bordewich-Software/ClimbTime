import {Stopwatch} from "../../utility/stopwatch/models";
import Typography from "@mui/material/Typography";
import {formatFor} from "../../utility/stopwatch/format-stopwatch-time";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import PauseCircleFilledIcon from "@mui/icons-material/PauseCircleFilled";
import {pink} from "@mui/material/colors";
import LinearProgress, {linearProgressClasses} from "@mui/material/LinearProgress";
import darkTheme from "../../styles/theme/dark-theme";
import {styled} from "@mui/system";
import {gql, useMutation, useQuery} from "@apollo/client";


type Props = {
    stopwatch: Stopwatch;
    stopwatchState: "STARTED" | "STOPPED";
}

const STOPWATCH_CONFIG = gql`
    query StopwatchConfig($id: String!) {
        stopwatchConfig(id: $id) {
            id
            format
            hours
            minutes
            seconds
        }
    }
`;

const TOGGLE_STOPWATCH = gql`
    mutation ToggleStopwatch($input: ToggleInput!) {
        toggle(input: $input) {
            timerState
        }
    }
`;

const RESET_STOPWATCH = gql`
    mutation ResetStopwatch($input: ResetInput!) {
        reset(input: $input) {
            timerState
        }
    }
`;

export default function StopwatchComponent(props: Props) {

    const id = props?.stopwatch?.id ?? "";
    const {data} = useQuery(STOPWATCH_CONFIG, {
        variables: {
            id
        }
    })

    const [toggleStopwatch, {error: startStopwatchError}] = useMutation(TOGGLE_STOPWATCH, {
        variables: {
            input: {
                id
            }
        }
    });

    const [resetStopwatch, {error: resetStopwatchError}] = useMutation(RESET_STOPWATCH, {
        variables: {
            input: {
                id
            }
        }
    });

    if (data?.stopwatchConfig == null) {
        return (
            <Typography>{`Oh no, the stopwatch with id: ${id} does not seem to exists. Try the go-back button, and see if you need to create a new stopwatch`}</Typography>)
    }

    if (startStopwatchError)
        return (<Typography>{`Oh no, an error occured: ${startStopwatchError?.message}`}</Typography>)

    if (resetStopwatchError)
        return (<Typography>{`Oh no, an error occured: ${resetStopwatchError?.message}`}</Typography>)

    const stopwatchState = props.stopwatchState;

    const swConfig = data.stopwatchConfig;
    const stopwatchFormat = swConfig?.format ?? "MINUTES";
    const hours = swConfig?.hours ?? 0;
    const minutes = swConfig?.minutes ?? 0;
    const seconds = swConfig?.seconds ?? 0;

    const sw = props.stopwatch;
    const timeSpan = sw?.timeSpan ?? {hours, minutes, seconds};


    const elapsedTime = formatFor(stopwatchFormat, timeSpan);

    const isStopwatchRunning = stopwatchState === "STARTED";

    const remainingHours = timeSpan.hours;
    const remainingMinutes = timeSpan.minutes;
    const remainingSeconds = timeSpan.seconds;
    const totalMinutes = (remainingHours * 60) + remainingMinutes + (remainingSeconds / 60);
    const currentDuration = (hours * 60) + minutes + (seconds / 60);

    const timerProgress = (totalMinutes * 100) / currentDuration;

    const fontVariant = stopwatchFormat === "HOURS" ? "hourTimer" : "minuteTimer";

    return (
        <Grid container direction={"column"} sx={{height: '100%', pb: 1, pt: 0}} justifyContent={"space-between"}
              alignItems={"center"}>
            <Grid item>
                <Button id={"reset-timer-button"} name={"reset-timer-button"} type={"button"}
                        onClick={() => resetStopwatch()}>{"Reset"}</Button>
            </Grid>

            <Grid item pt={4} sx={{width: '100%'}}>
                <BorderLinearProgress variant={"determinate"} value={timerProgress}/>
            </Grid>

            <Grid item mt={0} mb={0}>
                <Typography mt={0} mb={0} variant={fontVariant}>{elapsedTime}</Typography>
            </Grid>

            <Grid item justifyContent={"flex-end"} p={0}>
                {!isStopwatchRunning && <IconButton onClick={() => toggleStopwatch()}>
                    <PlayCircleOutlineIcon color={"success"} sx={{fontSize: 90}}></PlayCircleOutlineIcon>
                </IconButton>}
                {isStopwatchRunning && <IconButton onClick={() => toggleStopwatch()}>
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