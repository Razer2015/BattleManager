import { Tag, Tooltip } from "antd";

export function renderRoles(roles) {
    if (!roles.length) return <></>

    return (<span>
        {roles.map(role => {
            const roleName = role?.name;
            let color = 'green';
            if (roleName === 'super') {
                color = 'red';
            }
            else if (roleName === 'admin') {
                color = 'orange';
            }
            return (
                <Tooltip title={role?.description} key={role?.id}>
                    <Tag color={color} key={role?.id}>
                        {roleName.toUpperCase()}
                    </Tag>
                </Tooltip>
            );
        })}
    </span>);
}