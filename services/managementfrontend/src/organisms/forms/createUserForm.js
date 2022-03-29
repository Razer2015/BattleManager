import { UserAddOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { getOperationName } from "@apollo/client/utilities";
import { Button, Form, Input, Modal, Select } from "antd";
import { createRef, useState } from "react";
import { CREATE_USER } from "../../graphql/mutations";
import { GET_ALL_USERS } from "../../graphql/queries";
import { notificationWithIcon } from "../../utilities/notification";


export function CreateUserModal() {
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [form] = Form.useForm();

    const [createUser] = useMutation(CREATE_USER, {
        onCompleted: (data) => {
            notificationWithIcon('success', 'User created successfully.');
            handleCancel();
        },
        onError: (error) => {
            notificationWithIcon('error', error.message);
        },
        refetchQueries: [getOperationName(GET_ALL_USERS)]
    });

    const showModal = () => {
        setVisible(true);
    };

    const handleOk = () => {
        form.submit();
    };

    const handleCancel = () => {
        setVisible(false);
        form.resetFields();
    };

    const onFinish = (values) => {
        createUser({
            variables: {
                user: values
            },
        });
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            <Button
                onClick={showModal}
                type="primary"
                style={{
                    marginBottom: 16,
                }}
            >
                <UserAddOutlined />Add user
            </Button>
            <Modal
                title="Create user"
                visible={visible}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                okText={'Create'}
            >
                <Form
                    name="user_create"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    form={form}
                >
                    <Form.Item
                        label="Name"
                        name="name"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {
                                type: 'email',
                                required: true,
                                message: 'Please input your email',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password',
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="Roles"
                        name="roles"
                        rules={[
                            {
                                required: true,
                                message: 'Please select the role(s)',
                            },
                        ]}
                    >
                        <Select mode="multiple">
                            <Select.Option value={1}>Super</Select.Option>
                            <Select.Option value={2}>Admin</Select.Option>
                            <Select.Option value={3}>User</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}