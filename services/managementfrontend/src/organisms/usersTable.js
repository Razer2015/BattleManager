import { ReloadOutlined, } from '@ant-design/icons';
import { useLazyQuery, useMutation } from '@apollo/client';
import { getOperationName } from '@apollo/client/utilities';
import { Button, Col, Popconfirm, Row, Table, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { DELETE_USER } from '../graphql/mutations';
import { GET_ALL_USERS } from '../graphql/queries';
import { renderSignedIn } from '../molecules/signedIn';
import { renderRoles } from '../molecules/roles';
import columnSearchProps from '../utilities/columnSearchProps';
import { notificationWithIcon } from '../utilities/notification';
import { UserModal } from './forms/userForm';

export function UsersTable() {
    const DEFAULT_PAGE_SIZE = 20;
    const [tableSearch, setTableSearch] = useState({ searchText: '', searchedColumn: '' });
    const [tableConfig, setTableConfig] = useState({ current: 1, pageSize: DEFAULT_PAGE_SIZE, sorter: { field: 'is_logged_in', order: 'descend' } });
    const [getUsers, { data: usersData, loading }] = useLazyQuery(GET_ALL_USERS, {
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

    const [deleteUser] = useMutation(DELETE_USER, {
        onCompleted: (data) => {
            notificationWithIcon('success', 'User deleted successfully.');
        },
        onError: (error) => {
            notificationWithIcon('error', error.message);
        },
        refetchQueries: [getOperationName(GET_ALL_USERS)]
    });

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

        fetchUsers(page, size, filters, { field, order });
    };

    useEffect(() => {
        fetchUsers(tableConfig.current, tableConfig.pageSize, tableConfig.filters, tableConfig.sorter);
        // eslint-disable-next-line
    }, [])

    const fetchUsers = (page, size, filters, sorter) => {
        getUsers({
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

    const handleDelete = (userId) => {
        deleteUser({
            variables: {
                userId: userId,
            },
        });
    }

    const columns = [
        {
            title: 'User',
            dataIndex: 'name',
            key: 'name',
            ...columnSearchProps('name', 'Search by name', [tableSearch, setTableSearch]),
            sorter: true,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            ...columnSearchProps('email', 'Search by email', [tableSearch, setTableSearch]),
            sorter: true,
        },
        {
            title: 'Roles',
            dataIndex: 'userRoles',
            key: 'userRoles',
            render: (roles, row) => renderRoles(roles)
        },
        {
            title: 'Signed in',
            dataIndex: 'is_logged_in',
            key: 'signedIn',
            sorter: true,
            defaultSortOrder: 'descend',
            render: (signedIn, row) => renderSignedIn(row?.signedIn)
        },
        {
            title: 'Actions',
            dataIndex: 'action',
            render: (_, record) =>
                <>
                    <UserModal id={record.userId} />
                    <Popconfirm title="Are you sure you want to delete?" onConfirm={() => handleDelete(record.userId)}>
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
                <UserModal />
            </Col>
            <Col span={2} offset={12} style={{ textAlign: 'right' }}>
                <Tooltip title={'Update list'}>
                    <Button type="primary" icon={<ReloadOutlined />} loading={loading} onClick={() => getUsers()} />
                </Tooltip>
            </Col>
        </Row>
        <Table
            rowKey={'userId'}
            size="small"
            loading={loading}
            dataSource={usersData?.allUsers?.data}
            columns={columns}
            onChange={handleTableChange}
            pagination={{
                showSizeChanger: false,
                total: usersData?.allUsers?.count,
                ...tableConfig,
                position: [/*'topRight', */'bottomRight'],
            }}
        />
    </>
        ;
}