import { Form, Input, Button, Card, Col, Row } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Navigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../components/authComponent';

export function LoginView() {
    const { login/*, isAuthenticated*/ } = useContext(AuthContext);
    const location = useLocation();

    return (
        false /* Plan was to try and make it so that if logged in, redirect to the app. But didn't get it working without it always redirecting to home page instead of the "last page". */ ? (
            <Navigate to="/" replace state={{ from: location }} />
        ) : (
            <Row type="flex" justify="center" align="middle" style={{ minHeight: '100vh' }}>
                <Col>
                    <Card title="Login">
                        <Form
                            name="normal_login"
                            className="login-form"
                            initialValues={{ remember: true }}
                            onFinish={login}
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
        )
    );
}