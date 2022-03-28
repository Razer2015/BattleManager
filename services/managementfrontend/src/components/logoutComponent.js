import { Button, Form } from "antd";
import { useContext } from "react";
import { AuthContext } from "./authComponent";

export function LogoutComponent() {
    const { logout } = useContext(AuthContext);

    return (
        <Form
            name="normal_logout"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={logout}
            style={{ minWidth: '368px' }}
        >
            <Form.Item>
                <Button type="primary" htmlType="submit" className="logout-form-button">
                    Logout
                </Button>
            </Form.Item>
        </Form>
    );
}