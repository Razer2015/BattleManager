import { useLazyQuery } from '@apollo/client';
import { Table } from 'antd';
import { useEffect, useState } from 'react';
import { GET_ALL_PLAYERS } from '../graphql/queries';
import { renderLastOnline } from '../molecules/lastOnline';
import { renderSoldierNameWithTag } from '../molecules/soldierNameWithTag';
import columnSearchProps from '../utilities/columnSearchProps';

export function PlayersTable() {
    const [tableSearch, setTableSearch] = useState({ searchText: '', searchedColumn: '' });
    const [tableConfig, setTableConfig] = useState({ current: 1, pageSize: 10 });
    const [getPlayers, { data: playersData, loading }] = useLazyQuery(GET_ALL_PLAYERS, {
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

        fetchPlayers(page, size, filters);
    };

    useEffect(() => {
        fetchPlayers();
    }, [])

    const fetchPlayers = (page, size, filters) => {
        const search = filters?.SoldierName?.length ? filters?.SoldierName[0] : null
        getPlayers({
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
            title: 'Soldier',
            dataIndex: 'SoldierName',
            key: 'SoldierName',
            ...columnSearchProps('SoldierName', 'Search by soldiername', [tableSearch, setTableSearch]),
            render: (data, row) => renderSoldierNameWithTag(row),
        },
        {
            title: 'Rank',
            dataIndex: 'GlobalRank',
            key: 'GlobalRank',
        },
        {
            title: 'Last online',
            dataIndex: 'updated_at',
            key: 'updated_at',
            render: (timestamp, row) => renderLastOnline(row)
        },
    ];

    return <Table
        rowKey={'PlayerID'}
        loading={loading}
        dataSource={playersData?.allPlayers?.data}
        columns={columns}
        onChange={handleTableChange}
        pagination={{
            showSizeChanger: false,
            total: playersData?.allPlayers?.count,
            ...tableConfig,
            position: ['topRight', 'bottomRight'],
        }}
    />;
}