import { Tag, Tooltip, Typography } from 'antd';
import { DateTime } from 'luxon'

export function renderTimestamp({ status, timestamp }) {
    if (!timestamp) return <Typography.Text>Error</Typography.Text>
    let color = status === 'active' ? 'green' : status === 'inactive' ? 'red' : '#2f2f2f';

    const dt = DateTime.fromMillis(timestamp)
    return (
        <Tooltip title={dt.toLocaleString(DateTime.DATETIME_MED)}>
            <Tag color={color} key={timestamp}>
                {dt.toRelative({ unit: "days", padding: 21_600_000 })}
            </Tag>
        </Tooltip>
    );
}