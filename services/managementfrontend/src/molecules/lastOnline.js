import { Tag, Tooltip, Typography } from 'antd';
import { Interval } from 'luxon';
import { DateTime } from 'luxon'

export function renderLastOnline({ updated_at }) {
    if (!updated_at) return <Typography.Text>Error</Typography.Text>

    const dateNow = DateTime.now().toUTC()
    const dt = DateTime.fromMillis(updated_at)
    const diff = Interval.fromDateTimes(dt, dateNow);
    const diffHours = diff.length('hours');
    let color = diffHours > 168 ? 'red' : 'green';

    return (
        <Tooltip title={dt.toLocaleString(DateTime.DATETIME_MED)}>
            <Tag color={color} key={updated_at}>
                {dt.toRelative()}
            </Tag>
        </Tooltip>
    );
}