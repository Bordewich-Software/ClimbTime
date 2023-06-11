import {Stopwatch} from "../../utility/stopwatch/models";
import Typography from "@mui/material/Typography";
import {formatFor, TimeSpan} from "../../utility/stopwatch/format-stopwatch-time";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import PauseCircleFilledIcon from "@mui/icons-material/PauseCircleFilled";
import {pink} from "@mui/material/colors";
import LinearProgress, {linearProgressClasses} from "@mui/material/LinearProgress";
import darkTheme from "../../styles/theme/dark-theme";
import {styled} from "@mui/system";


type Props = {
    stopwatch: Stopwatch;
    end: TimeSpan;
    timerState: "STARTED" | "STOPPED";
    resetTimer: () => void;
    toggleTimer: () => void;
}

export default function StopwatchComponent(props: Props) {

    const timerState = props.timerState;
    const sw = props.stopwatch;
    const stopwatchFormat = sw?.stopwatchFormat ?? "MINUTES";
    const hours = props.end?.hours ?? 0;
    const minutes = props.end?.minutes ?? 0;
    const seconds = props.end?.seconds ?? 0;
    const timeSpan = sw?.timeSpan ?? { hours, minutes, seconds};


    const elapsedTime = formatFor(stopwatchFormat, timeSpan);

    const isTimerRunning = timerState === "STARTED";

    const remainingHours = timeSpan.hours;
    const remainingMinutes = timeSpan.minutes;
    const remainingSeconds = timeSpan.seconds;
    const totalMinutes = (remainingHours*60) + remainingMinutes + (remainingSeconds / 60);
    const currentDuration = (hours * 60) + minutes + (seconds / 60);

    const timerProgress = (totalMinutes * 100) / currentDuration;

    const fontVariant = stopwatchFormat === "HOURS" ? "hourTimer" : "minuteTimer";

    return (
        <Grid container direction={"column"} sx={{height: '100%', pb: 1, pt: 0}} justifyContent={"space-between"}
              alignItems={"center"}>
            <Grid item>
                <Button id={"reset-timer-button"} name={"reset-timer-button"} type={"button"}
                        onClick={() => props.resetTimer()}>{"Reset"}</Button>
            </Grid>

            <Grid item pt={4} sx={{width: '100%'}}>
                <BorderLinearProgress variant={"determinate"} value={timerProgress}/>
            </Grid>

            <Grid item mt={0} mb={0}>
                <Typography mt={0} mb={0} variant={fontVariant}>{elapsedTime}</Typography>
            </Grid>

            <Grid item justifyContent={"flex-end"} p={0}>
                {!isTimerRunning && <IconButton onClick={() => props.toggleTimer()}>
                    <PlayCircleOutlineIcon color={"success"} sx={{fontSize: 90}}></PlayCircleOutlineIcon>
                </IconButton>}
                {isTimerRunning && <IconButton onClick={() => props.toggleTimer()}>
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