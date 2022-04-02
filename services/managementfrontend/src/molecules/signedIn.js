import { Tag } from "antd";

export function renderSignedIn(signedIn) {
    let color = signedIn ? 'green' : 'red';
    
    return (
        <Tag color={color} key={signedIn}>
            {signedIn ? "Signed in" : "Signed out"}
        </Tag>
    );
}