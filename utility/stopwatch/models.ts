import {TimeSpan} from "./format-stopwatch-time";

export type StopwatchFormat = "HOURS" | "MINUTES";

export type Stopwatch = { id: string, timeSpan: TimeSpan };

export type StopwatchConfig = {
    id: string,
    hours: number,
    minutes: number,
    seconds: number,
    stopwatchFormat: StopwatchFormat
}

export const getKind = (stopwatchFormatString: string | string[]) => {
    if (stopwatchFormatString instanceof Array)
        return stopwatchFormatString?.[0] === "HOURS" ? "HOURS" : "MINUTES"
    return stopwatchFormatString === "HOURS" ? "HOURS" : "MINUTES"
};