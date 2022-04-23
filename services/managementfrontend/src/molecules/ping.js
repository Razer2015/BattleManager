import { Tag } from "antd";

export function renderPing(ping) {
    let color = ping < 80 ? 'green' : ping < 140 ? 'yellow' : 'red';
    
    if (ping === 65535) {
        ping = '—';
    }
    return (
        <Tag color={color} key={ping}>
            {ping}
        </Tag>
    );
}