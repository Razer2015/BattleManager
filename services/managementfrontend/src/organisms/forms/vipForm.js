import { UserAddOutlined } from "@ant-design/icons";
import { useLazyQuery, useMutation, } from "@apollo/client";
import { getOperationName } from "@apollo/client/utilities";
import { Button, Col, DatePicker, Form, Input, InputNumber, Modal, Row, Select, Space, } from "antd";
import Text from "antd/lib/typography/Text";
import { useEffect, useState } from "react";
import { CREATE_VIP, UPDATE_VIP } from "../../graphql/mutations";
import { GET_ALL_VIPS, GET_GAMES, GET_SERVERS_BY_GAMEID, GET_VIP } from "../../graphql/queries";
import { notificationWithIcon } from "../../utilities/notification";
import moment from 'moment';
import TextArea from "antd/lib/input/TextArea";

export function VipModal({ id }) {
    const isEditMode = !!id;
    const [visible, setVisible] = useState(false);
    const [formData, setFormData] = useState({});
    const [gameData, setGameData] = useState([]);
    const [serverData, setServerData] = useState([]);
    const [selectedGame, setSelectedGame] = useState(null);
    const [selectedServer, setSelectedServer] = useState(null);
    const [form] = Form.useForm();

    const [getGames, { data: games, }] = useLazyQuery(GET_GAMES, {
        fetchPolicy: 'no-cache',
    });

    const [getServers, { data: servers, }] = useLazyQuery(GET_SERVERS_BY_GAMEID, {
        fetchPolicy: 'no-cache',
    });

    useEffect(() => {
        if (visible && !isEditMode) {
            getGames({
                fetchPolicy: 'no-cache',
            });
        }
    }, [visible, getGames, isEditMode]);

    useEffect(() => {
        if (!games?.getGames?.length) {
            setGameData([]);
        }
        else {
            setGameData(games.getGames.map(game => {
                return {
                    label: game.Name,
                    value: game.GameID
                }
            }));
        }
    }, [visible, games]);

    useEffect(() => {
        if (!servers?.getServersByGameID?.length) {
            setServerData([]);
        }
        else {
            setServerData(servers.getServersByGameID.map(server => {
                return {
                    label: server.ServerName,
                    value: server.ServerGroup
                }
            }));
        }
    }, [visible, servers]);

    const handleGameTypeChange = (value) => {
        getServers({
            fetchPolicy: 'no-cache',
            variables: {
                gameId: value
            },
        });

        setSelectedGame(value);
    }

    const handleServerChange = (value) => {
        setSelectedServer(value);
    }

    const setValidUntilDays = (days) => {
        form.setFields([{
            name: 'timestamp',
            value: moment(vipData?.getVip?.timestamp).add(days, 'days')
        }]);

        form.validateFields(['timestamp']);
    }

    const [createVip] = useMutation(CREATE_VIP, {
        onCompleted: (data) => {
            notificationWithIcon('success', 'Vip created successfully.');
            handleCancel();
        },
        onError: (error) => {
            notificationWithIcon('error', error.message);
        },
        refetchQueries: [getOperationName(GET_ALL_VIPS)]
    });

    const [updateVip] = useMutation(UPDATE_VIP, {
        onCompleted: (data) => {
            notificationWithIcon('success', 'Vip updated successfully.');
            handleCancel();
        },
        onError: (error) => {
            notificationWithIcon('error', error.message);
        },
        refetchQueries: [getOperationName(GET_ALL_VIPS)]
    });

    const [getVipById, { data: vipData, }] = useLazyQuery(GET_VIP, {
        fetchPolicy: 'no-cache',
    });

    useEffect(() => {
        if (visible && isEditMode) {
            getVipById({
                fetchPolicy: 'no-cache',
                variables: {
                    vipId: id
                }
            });
        }
    }, [visible, id, getVipById, isEditMode]);

    useEffect(() => {
        setFormData({
            ...vipData?.getVip,
            timestamp: moment(vipData?.getVip?.timestamp)
        });
    }, [vipData]);

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
        setGameData([]);
        setServerData([]);
        setSelectedGame(null);
        setSelectedServer(null);
        form.resetFields();
    };

    const onFinish = (values) => {
        if (isEditMode) {
            updateVip({
                variables: {
                    vipId: id,
                    vip: values,
                },
            });
        }
        else {
            createVip({
                variables: {
                    vip: values
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
                    <UserAddOutlined />Add vip
                </Button>
            )}

            <Modal
                title={isEditMode
                    ?
                    (
                        <Text>
                            <Text>Update</Text>
                            <Text style={{ fontWeight: "bold" }}> {vipData?.getUser?.name}</Text>
                        </Text>
                    )
                    : "Add vip"}
                visible={visible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={isEditMode ? 'Update' : 'Add'}
            >
                <Form
                    name="vip_addOrUpdate"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    initialValues={isEditMode ? formData : { status: 'active' }}
                    form={form}
                >
                    {!isEditMode &&
                        (
                            <>
                                <Form.Item
                                    label="Game Type"
                                    name="gametype"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please select the gametype',
                                        },
                                    ]}
                                >
                                    <Select
                                        options={gameData}
                                        onChange={handleGameTypeChange}
                                    >
                                    </Select>
                                </Form.Item>
                            </>
                        )
                    }

                    {(selectedGame || isEditMode) &&
                        (
                            <>
                                {!isEditMode &&
                                    (
                                        <>
                                            <Form.Item
                                                label="Server"
                                                name="servergroup"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Please select the server',
                                                    },
                                                ]}
                                            >
                                                <Select
                                                    options={serverData}
                                                    onChange={handleServerChange}
                                                >
                                                </Select>
                                            </Form.Item>
                                        </>
                                    )
                                }

                                {(selectedServer || isEditMode) &&
                                    (
                                        <>
                                            <Form.Item
                                                label="Playername"
                                                name="playername"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Please enter the soldiername',
                                                    },
                                                ]}
                                            >
                                                <Input placeholder="Soldiername from Battlelog" />
                                            </Form.Item>

                                            <Form.Item
                                                label="Valid until"
                                                name="timestamp"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Please enter how long the VIP slot is valid for',
                                                    },
                                                ]}
                                            >
                                                <DatePicker style={{ width: '100%' }} showTime allowClear={false} showNow={false} placeholder="Valid until date" format={'DD.MM.YYYY HH:mm:ss'} renderExtraFooter={() => <ValidUntilFooter />} />
                                            </Form.Item>

                                            <Form.Item
                                                label="Status"
                                                name="status"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Please select the status',
                                                    },
                                                ]}
                                            >
                                                <Select
                                                    defaultValue="active"
                                                >
                                                    <Select.Option value="active" style={{ color: '#6abe39', background: '#162312', borderColor: '#274916' }}>Active</Select.Option>
                                                    <Select.Option value="inactive" style={{ color: '#e84749', background: '#2a1215', borderColor: '#58181c' }}>Inactive</Select.Option>
                                                    <Select.Option value="expired" style={{ backgroundColor: '#2f2f2f' }}>Expired</Select.Option>
                                                </Select>
                                            </Form.Item>

                                            <Form.Item
                                                label="Comment"
                                                name="comment"
                                            >
                                                <TextArea placeholder="Enter optional comment (e.g. how much the user donated and when)" />
                                            </Form.Item>

                                            <Form.Item
                                                label="Discord ID"
                                                name="discord_id"
                                            >
                                                <Input placeholder="Discord user id for /vip command in Discord" />
                                            </Form.Item>
                                        </>
                                    )
                                }

                            </>
                        )
                    }

                </Form>
            </Modal>
        </>
    );

    function ValidUntilFooter() {
        return <>
            <Row>
                <Col>
                    <Button type="link" size="small" onClick={() => {
                        setValidUntilDays(30);
                    }}>+30 days</Button>
                    <Button type="link" size="small" onClick={() => {
                        setValidUntilDays(60);
                    }}>+60 days</Button>
                    <Button type="link" size="small" onClick={() => {
                        setValidUntilDays(90);
                    }}>+90 days</Button>
                    <Button type="link" size="small" onClick={() => {
                        setValidUntilDays(180);
                    }}>+180 days</Button>
                    <Button type="link" size="small" onClick={() => {
                        setValidUntilDays(365);
                    }}>+365 days</Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Space>
                        <InputNumber addonBefore="+" addonAfter="days" defaultValue={3} min={0} onChange={(days) => {
                            setValidUntilDays(days);
                        }} />
                    </Space>
                </Col>
            </Row>
        </>
    }
}
