import { ReloadOutlined } from '@ant-design/icons';
import { useLazyQuery, useMutation, } from '@apollo/client';
import { getOperationName } from '@apollo/client/utilities';
import { Button, Col, Popconfirm, Row, Table, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { DELETE_VIP } from '../graphql/mutations';
import { GET_ALL_VIPS } from '../graphql/queries';
import { renderStatus } from '../molecules/status';
import { renderTimestamp } from '../molecules/timestamp';
import { notificationWithIcon } from '../utilities/notification';
import { VipModal } from './forms/vipForm';

export function VipsTable() {
    // const [tableSearch, setTableSearch] = useState({ searchText: '', searchedColumn: '' });
    const [tableConfig, /*setTableConfig */] = useState({ current: 1, pageSize: 10 });
    const [getVips, { data: vipsData, loading }] = useLazyQuery(GET_ALL_VIPS, {
        fetchPolicy: 'no-cache',
        variables: {
            limit: tableConfig.pageSize,
            skip: (tableConfig.current - 1) * tableConfig.pageSize,
        },
    });

    const [deleteVip] = useMutation(DELETE_VIP, {
        onCompleted: (data) => {
            notificationWithIcon('success', 'Vip deleted successfully.');
        },
        onError: (error) => {
            notificationWithIcon('error', error.message);
        },
        refetchQueries: [getOperationName(GET_ALL_VIPS)]
    });

    useEffect(() => {
        fetchVips(tableConfig.current, tableConfig.pageSize);
        // eslint-disable-next-line
    }, []);

    const fetchVips = (page, size, filters) => {
        getVips({
            fetchPolicy: 'no-cache',
            variables: {
                limit: size,
                skip: (page - 1) * size,
            },
        });
    }

    const handleDelete = (vipId) => {
        deleteVip({
            variables: {
                vipId: vipId,
            },
        });
    }

    const columns = [
        {
            title: 'Soldier',
            dataIndex: 'playername',
            key: 'playername',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: status => renderStatus(status)
        },
        {
            title: 'Expiration',
            dataIndex: 'timestamp',
            key: 'timestamp',
            render: (timestamp, row) => renderTimestamp(row)
        },
        {
            title: 'Admin',
            dataIndex: 'admin',
            key: 'admin',
        },
        {
            title: 'Comment',
            dataIndex: 'comment',
            key: 'comment',
        },
        {
            title: 'Discord ID',
            dataIndex: 'discord_id',
            key: 'discord_id',
        },
        {
            title: 'Actions',
            dataIndex: 'action',
            render: (_, record) =>
                <>
                    <VipModal id={record.ID} />
                    <Popconfirm title="Are you sure you want to delete?" onConfirm={() => handleDelete(record.ID)}>
                        <Button danger>
                            Delete
                        </Button>
                    </Popconfirm>
                </>
        },
    ];

    return <>
        <Row>
            <Col span={10}>
                <VipModal />
            </Col>
            <Col span={2} offset={12} style={{ textAlign: 'right' }}>
                <Tooltip title={'Update list'}>
                    <Button type="primary" icon={<ReloadOutlined />} loading={loading} onClick={() => getVips()} />
                </Tooltip>
            </Col>
        </Row>
        <Table size="small" rowKey={'ID'} loading={loading} dataSource={vipsData?.allVips} columns={columns} />
    </>;
}