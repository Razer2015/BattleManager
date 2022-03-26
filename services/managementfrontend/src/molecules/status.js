import { Tag } from "antd";

export function renderStatus(status) {
    let color = status === 'active' ? 'green' : 'red';
    
    return (
        <Tag color={color} key={status}>
            {status.toUpperCase()}
        </Tag>
    );
}