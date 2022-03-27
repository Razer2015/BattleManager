import { Form, Input, Button, Checkbox, Card, Col, Row } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../graphql/mutations';
import { saveTokens } from '../utilities/tokens';
import { useLocation, useNavigate } from 'react-router-dom';
import { notificationWithIcon } from '../utilities/notification';

export function LoginView() {
    const [login, { data }] = useMutation(LOGIN, {
        onError: (error) => notificationWithIcon('error', error.message),
    });
    const navigate = useNavigate();
    const location = useLocation();

    async function submitLogin(values) {
        const { loading, error, data } = await login({
            variables: {
                email: values?.email,
                password: values?.password
            }
        });

        if (data && data.loginSafe) {
            saveTokens(data.loginSafe);

            if (location.state?.from) {
                navigate(location.state.from);
            }
            else {
                navigate('/');
            }
        }
    };

    return (
        <Row type="flex" justify="center" align="middle" style={{ minHeight: '100vh' }}>
            <Col>
                <Card title="Login">
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{ remember: true }}
                        onFinish={submitLogin}
                        style={{ minWidth: '368px' }}
                    >
                        <Form.Item
                            name="email"
                            rules={[{ required: true, message: 'Please input your email!' }]}
                        >
                            <Input prefix={<MailOutlined className="site-form-item-icon" />} type="email" placeholder="Email" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Please input your Password!' }]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="Password"
                            />
                        </Form.Item>
                        {/* <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <a className="login-form-forgot" href="">
                    Forgot password
                </a>
            </Form.Item> */}

                        <Form.Item>
                            <Button block type="primary" htmlType="submit" className="login-form-button">
                                Log in
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Col>
        </Row>
    );
}