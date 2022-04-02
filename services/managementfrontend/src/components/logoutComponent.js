import { CaretDownOutlined, LogoutOutlined } from "@ant-design/icons";
import { Avatar, Button, Col, Divider, Dropdown, Menu, Row, Space, Typography } from "antd";
import { useContext } from "react";
import { AuthContext } from "./authComponent";
import md5 from 'md5'
import Text from "antd/lib/typography/Text";

export function LogoutComponent() {
    const { userProfile, logout } = useContext(AuthContext);

    const menu = (
        <Menu>
            <Typography style={{ paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8 }}>
                <Row>
                    <Col>
                        <Text>
                            <Text>Signed in as</Text>
                            <Text style={{ fontWeight: "bold" }}> {userProfile?.name}</Text>
                        </Text>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Text>{userProfile?.email}</Text>
                    </Col>
                </Row>
            </Typography>
            <Divider style={{ margin: 0 }} />
            <Menu.Item key="profile" disabled>Profile</Menu.Item>
            <Divider style={{ margin: 0 }} />
            <Menu.Item key="sign_out" danger onClick={logout}><LogoutOutlined /> Sign out</Menu.Item>
        </Menu>
    );

    return (
        <Dropdown overlay={menu}>
            <Button type="link" className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                <Space size={4}>
                    <Avatar src={getGravatarUrl(userProfile?.email)} /> <CaretDownOutlined style={{ fontSize: 10, color: 'white' }} />
                </Space>
            </Button>
        </Dropdown>
    );
}

function getGravatarUrl(email) {
    const trimmedEmail = email?.trim()?.toLowerCase();
    const hash = !trimmedEmail ? '' : md5(trimmedEmail, { encoding: "binary" })
    return `https://gravatar.com/avatar/${hash}`;
}