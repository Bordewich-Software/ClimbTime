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
    timerState: "STARTED" | "STOPPED";
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

export default function StopwatchComponent(props: Props) {

    const id = props?.stopwatch?.id ?? "";
    const {data} = useQuery(STOPWATCH_CONFIG, {
        variables: {
            id
        }
    })

    const [toggleTimer, {error: startTimerError}] = useMutation(TOGGLE_TIMER, {
        variables: {
            input: {
                id
            }
        }
    });

    const [resetTimer, {error: resetTimerError}] = useMutation(RESET_TIMER, {
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

    if (startTimerError)
        return (<Typography>{`Oh no, an error occured: ${startTimerError?.message}`}</Typography>)

    if (resetTimerError)
        return (<Typography>{`Oh no, an error occured: ${resetTimerError?.message}`}</Typography>)

    const timerState = props.timerState;

    const swConfig = data.stopwatchConfig;
    const stopwatchFormat = swConfig?.format ?? "MINUTES";
    const hours = swConfig?.hours ?? 0;
    const minutes = swConfig?.minutes ?? 0;
    const seconds = swConfig?.seconds ?? 0;

    const sw = props.stopwatch;
    const timeSpan = sw?.timeSpan ?? {hours, minutes, seconds};


    const elapsedTime = formatFor(stopwatchFormat, timeSpan);

    const isTimerRunning = timerState === "STARTED";

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
                        onClick={() => resetTimer()}>{"Reset"}</Button>
            </Grid>

            <Grid item pt={4} sx={{width: '100%'}}>
                <BorderLinearProgress variant={"determinate"} value={timerProgress}/>
            </Grid>

            <Grid item mt={0} mb={0}>
                <Typography mt={0} mb={0} variant={fontVariant}>{elapsedTime}</Typography>
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