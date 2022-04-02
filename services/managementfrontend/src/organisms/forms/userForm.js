import { UserAddOutlined } from "@ant-design/icons";
import { useLazyQuery, useMutation, } from "@apollo/client";
import { getOperationName } from "@apollo/client/utilities";
import { Button, Form, Input, Modal, Select } from "antd";
import Text from "antd/lib/typography/Text";
import { useEffect, useState } from "react";
import { CREATE_USER, UPDATE_USER } from "../../graphql/mutations";
import { GET_ALL_USERS, GET_USER } from "../../graphql/queries";
import { notificationWithIcon } from "../../utilities/notification";


export function UserModal({ id }) {
    const isEditMode = !!id;
    const [visible, setVisible] = useState(false);
    const [formData, setFormData] = useState({});
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

    const [updateUser] = useMutation(UPDATE_USER, {
        onCompleted: (data) => {
            notificationWithIcon('success', 'User updated successfully.');
            handleCancel();
        },
        onError: (error) => {
            notificationWithIcon('error', error.message);
        },
        refetchQueries: [getOperationName(GET_ALL_USERS)]
    });

    const [getUserById, { data: userData, }] = useLazyQuery(GET_USER, {
        fetchPolicy: 'no-cache',
    });

    useEffect(() => {
        if (visible && isEditMode) {
            getUserById({
                fetchPolicy: 'no-cache',
                variables: {
                    userId: id
                }
            });
        }
    }, [visible, id, getUserById, isEditMode]);


    useEffect(() => {
        setFormData({
            ...userData?.getUser,
            roles: userData?.getUser?.userRoles?.map(x => x.id)
        });
    }, [userData]);

    // Update the values in the form once the new form data has been prepared
    useEffect(() => form.resetFields(), [formData, form]);

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
        if (isEditMode) {
            updateUser({
                variables: {
                    userId: id,
                    user: values,
                },
            });
        }
        else {
            createUser({
                variables: {
                    user: values
                },
            });
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            {isEditMode && (
                <Button
                    onClick={showModal}
                    type="primary"
                    ghost
                    style={{ marginRight: '4px' }}
                >
                    Edit
                </Button>
            )}
            {!isEditMode && (
                <Button
                    onClick={showModal}
                    type="primary"
                    style={{
                        marginBottom: 16,
                    }}
                >
                    <UserAddOutlined />Add user
                </Button>
            )}

            <Modal
                title={isEditMode
                    ?
                    (
                        <Text>
                            <Text>Update</Text>
                            <Text style={{ fontWeight: "bold" }}> {userData?.getUser?.name}</Text>
                        </Text>
                    )
                    : "Create user"}
                visible={visible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={isEditMode ? 'Update' : 'Create'}
            >
                <Form
                    name="user_createOrUpdate"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    initialValues={isEditMode ? formData : {}}
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

                    {!isEditMode &&
                        (
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
                        )
                    }

                    <Form.Item
                        label="Roles"
                        name="roles"
                        rules={[
                            {
                                required: true,
                                message: 'Please select the role(s)',
                            },
                        ]}
                    // initialValue={userData?.getUser?.userRoles?.map(x => x.id)}
                    >
                        <Select
                            mode="multiple"
                        // initialValue={userData?.getUser?.userRoles?.map(x => x.id)}
                        >
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