import { Tag } from "antd";

export function renderLoggedIn(loggedIn) {
    let color = loggedIn ? 'green' : 'red';
    
    return (
        <Tag color={color} key={loggedIn}>
            {loggedIn ? "Logged in" : "Logged out"}
        </Tag>
    );
}