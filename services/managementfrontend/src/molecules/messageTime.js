import { Tooltip, Typography } from 'antd';
import { DateTime } from 'luxon'

export function renderMessageTime({ timestamp }) {
    if (!timestamp) return <Typography.Text>Error</Typography.Text>

    const dt = DateTime.fromMillis(timestamp)
    if (dt.diffNow().as('seconds') > -10) return 'Just now';
    return (
        <Tooltip title={dt.toLocaleString(DateTime.DATETIME_MED)}>
            {dt.toRelative()}
        </Tooltip>
    );
}