import { Tooltip, Typography } from 'antd';
import { Duration } from 'luxon';
import { DateTime } from 'luxon'

export function renderDuration(uptime) {
    if (!uptime) return <Typography.Text>Error</Typography.Text>
    const duration = Duration.fromObject({ seconds: uptime })
    const dt = DateTime.now().minus({ seconds: uptime })
    return (
        <Tooltip title={`Since: ${dt.toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)}`}>
            {toHuman(duration)}
        </Tooltip>
    );
}

/* https://github.com/moment/luxon/issues/1134#issue-1128331010 */
function toHuman(dur, smallestUnit = "seconds") {
    const units = ["years", "months", "days", "hours", "minutes", "seconds", "milliseconds",];
    const smallestIdx = units.indexOf(smallestUnit);
    const entries = Object.entries(
        dur.shiftTo(...units).normalize().toObject()
    ).filter(([_unit, amount], idx) => amount > 0 && idx <= smallestIdx);
    const dur2 = Duration.fromObject(
        entries.length === 0 ? { [smallestUnit]: 0 } : Object.fromEntries(entries)
    );
    return dur2.toHuman();
}
