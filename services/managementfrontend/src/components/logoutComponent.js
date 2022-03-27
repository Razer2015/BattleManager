import { useMutation } from "@apollo/client";
import { Button, Form } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { LOGOUT } from "../graphql/mutations";
import { deleteTokens } from "../utilities/tokens";

export function LogoutComponent() {
    const [logout, { data }] = useMutation(LOGOUT);
    const navigate = useNavigate();
    const location = useLocation();

    async function submitLogout(values) {
        const { loading, error, data } = await logout();

        if (data && data.logout) {
            deleteTokens();

            navigate('/login');
        }
    };

    return (
        <Form
            name="normal_logout"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={submitLogout}
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