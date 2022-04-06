import { Tag } from "antd";

export function renderStatus(status) {
    let color = status === 'active' ? 'green' : status === 'inactive' ? 'red' : '#2f2f2f';
    
    return (
        <Tag color={color} key={status}>
            {status.toUpperCase()}
        </Tag>
    );
}