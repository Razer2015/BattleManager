import { ReloadOutlined } from '@ant-design/icons';
import { useLazyQuery, useMutation, } from '@apollo/client';
import { getOperationName } from '@apollo/client/utilities';
import { Button, Col, Popconfirm, Row, Table, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { DELETE_VIP } from '../graphql/mutations';
import { GET_ALL_VIPS } from '../graphql/queries';
import { renderStatus } from '../molecules/status';
import { renderTimestamp } from '../molecules/timestamp';
import columnSearchProps from '../utilities/columnSearchProps';
import { notificationWithIcon } from '../utilities/notification';
import { VipModal } from './forms/vipForm';

export function VipsTable() {
    const DEFAULT_PAGE_SIZE = 20;
    const [tableSearch, setTableSearch] = useState({ searchText: '', searchedColumn: '' });
    const [tableConfig, setTableConfig] = useState({ current: 1, pageSize: DEFAULT_PAGE_SIZE, sorter: { field: 'timestamp', order: 'descend' } });
    const [getVips, { data: vipsData, loading }] = useLazyQuery(GET_ALL_VIPS, {
        fetchPolicy: 'no-cache',
        variables: {
            queryParams: {
                limit: tableConfig.pageSize,
                skip: (tableConfig.current - 1) * tableConfig.pageSize,
                filters: tableConfig.filters,
                sorter: tableConfig.sorter,
            }
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
        fetchVips(tableConfig.current, tableConfig.pageSize, tableConfig.filters, tableConfig.sorter);
        // eslint-disable-next-line
    }, []);

    const fetchVips = (page, size, filters, sorter) => {
        getVips({
            fetchPolicy: 'no-cache',
            variables: {
                queryParams: {
                    limit: size,
                    skip: (page - 1) * size,
                    filters,
                    sorter,
                }
            },
        });
    }

    const handleTableChange = (pagination, filters, sorter) => {
        const page = pagination?.current ?? 1;
        const size = pagination?.pageSize ?? DEFAULT_PAGE_SIZE;
        const { field, order } = sorter;
        setTableConfig({
            current: page,
            pageSize: size,
            filters,
            sorter: { field, order },
        });

        fetchVips(page, size, filters, { field, order });
    };

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
            sorter: true,
            ...columnSearchProps('name', 'Search by name', [tableSearch, setTableSearch]),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            sorter: true,
            ...columnSearchProps('status', 'Search by status', [tableSearch, setTableSearch]),
            render: status => renderStatus(status),
        },
        {
            title: 'Expiration',
            dataIndex: 'timestamp',
            key: 'timestamp',
            sorter: true,
            defaultSortOrder: 'descend',
            render: (timestamp, row) => renderTimestamp(row)
        },
        {
            title: 'Admin',
            dataIndex: 'admin',
            key: 'admin',
            sorter: true,
            ...columnSearchProps('admin', 'Search by admin', [tableSearch, setTableSearch]),
        },
        {
            title: 'Comment',
            dataIndex: 'comment',
            key: 'comment',
            sorter: true,
            ...columnSearchProps('comment', 'Search by comment', [tableSearch, setTableSearch]),
        },
        {
            title: 'Discord ID',
            dataIndex: 'discord_id',
            key: 'discord_id',
            sorter: true,
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
        <Table
            size="small"
            rowKey={'ID'}
            loading={loading}
            dataSource={vipsData?.allVips?.data}
            onChange={handleTableChange}
            columns={columns}
            pagination={{
                showSizeChanger: false,
                total: vipsData?.allVips?.count,
                ...tableConfig,
                position: [/*'topRight', */'bottomRight'],
            }}
        />
    </>;
}