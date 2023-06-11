import {StopwatchFormat} from "./models";

export type TimeSpan = { hours: number, minutes: number, seconds: number }


function formatForHours(timeSpan?: TimeSpan) {
    if (timeSpan == null)
        return "00:00:00";

    const d = new Date();
    d.setHours(timeSpan.hours)
    d.setMinutes(timeSpan.minutes);
    d.setSeconds(timeSpan.seconds);

    return Intl.DateTimeFormat("nb-NO", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    }).format(d);
}

function formatForMinutes(elapsedTime?: TimeSpan) {
    if (elapsedTime == null)
        return "00:00:00";

    const d = new Date();
    d.setMinutes(elapsedTime.minutes);
    d.setSeconds(elapsedTime.seconds);

    return Intl.DateTimeFormat("nb-NO", {
        minute: "2-digit",
        second: "2-digit"
    }).format(d);
}

export function formatFor(stopwatchType: StopwatchFormat, elapsedTime?: TimeSpan) {
    if (stopwatchType === "HOURS")
        return formatForHours(elapsedTime)

    return formatForMinutes(elapsedTime)
}