import { ReloadOutlined, UserAddOutlined } from '@ant-design/icons';
import { useLazyQuery } from '@apollo/client';
import { Button, Col, Row, Table, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { GET_ALL_USERS } from '../graphql/queries';
import { renderLastOnline } from '../molecules/lastOnline';
import { renderLoggedIn } from '../molecules/loggedIn';
import { renderRoles } from '../molecules/roles';
import { renderSoldierNameWithTag } from '../molecules/soldierNameWithTag';
import columnSearchProps from '../utilities/columnSearchProps';
import { CreateUserModal } from './forms/createUserForm';

export function UsersTable() {
    const [tableSearch, setTableSearch] = useState({ searchText: '', searchedColumn: '' });
    const [tableConfig, setTableConfig] = useState({ current: 1, pageSize: 10 });
    const [getUsers, { data: usersData, loading }] = useLazyQuery(GET_ALL_USERS, {
        fetchPolicy: 'no-cache',
        variables: {
            limit: tableConfig.pageSize,
            skip: (tableConfig.current - 1) * tableConfig.pageSize,
        },
    });

    const handleTableChange = (pagination, filters, sorter) => {
        const page = pagination?.current ?? 1;
        const size = pagination?.pageSize ?? 10;
        setTableConfig({
            current: page,
            pageSize: size,
        });

        fetchUsers(page, size, filters);
    };

    useEffect(() => {
        fetchUsers(tableConfig.current, tableConfig.pageSize);
    }, [])

    const fetchUsers = (page, size, filters) => {
        const search = filters?.SoldierName?.length ? filters?.SoldierName[0] : null
        getUsers({
            fetchPolicy: 'no-cache',
            variables: {
                limit: size,
                skip: (page - 1) * size,
                search,
            },
        });
    }

    const columns = [
        {
            title: 'User',
            dataIndex: 'name',
            key: 'name',
            ...columnSearchProps('name', 'Search by name', [tableSearch, setTableSearch]),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Roles',
            dataIndex: 'userRoles',
            key: 'userRoles',
            render: (roles, row) => renderRoles(roles)
        },
        {
            title: 'Logged in',
            dataIndex: 'is_logged_in',
            key: 'is_logged_in',
            render: (timestamp, row) => renderLoggedIn(row)
        },
    ];

    return <>
        <Row>
            <Col span={10}>
                <CreateUserModal />
            </Col>
            <Col span={2} offset={12} style={{ textAlign: 'right' }}>
                <Tooltip title={'Update list'}>
                    <Button type="primary" icon={<ReloadOutlined />} loading={loading} onClick={() => getUsers()} />
                </Tooltip>
            </Col>
        </Row>
        <Table
            rowKey={'userId'}
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