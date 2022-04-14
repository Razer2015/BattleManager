import { useLazyQuery } from '@apollo/client';
import { Table } from 'antd';
import { useEffect, useState } from 'react';
import { GET_ALL_PLAYERS } from '../graphql/queries';
import { renderLastOnline } from '../molecules/lastOnline';
import { renderSoldierNameWithTag } from '../molecules/soldierNameWithTag';
import columnSearchProps from '../utilities/columnSearchProps';

export function PlayersTable() {
    const DEFAULT_PAGE_SIZE = 20;
    const [tableSearch, setTableSearch] = useState({ searchText: '', searchedColumn: '' });
    const [tableConfig, setTableConfig] = useState({ current: 1, pageSize: DEFAULT_PAGE_SIZE, sorter: { field: 'updated_at', order: 'descend' } });
    const [getPlayers, { data: playersData, loading }] = useLazyQuery(GET_ALL_PLAYERS, {
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

        fetchPlayers(page, size, filters, { field, order });
    };

    useEffect(() => {
        fetchPlayers(tableConfig.current, tableConfig.pageSize, tableConfig.filters, tableConfig.sorter);
        // eslint-disable-next-line
    }, [])

    const fetchPlayers = (page, size, filters, sorter) => {
        getPlayers({
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

    const columns = [
        {
            title: 'Soldier',
            dataIndex: 'SoldierName',
            key: 'SoldierName',
            ...columnSearchProps('SoldierName', 'Search by soldiername', [tableSearch, setTableSearch]),
            sorter: true,
            render: (data, row) => renderSoldierNameWithTag(row),
        },
        {
            title: 'Rank',
            dataIndex: 'GlobalRank',
            key: 'GlobalRank',
            sorter: true,
        },
        {
            title: 'Last online',
            dataIndex: 'updated_at',
            key: 'updated_at',
            sorter: true,
            defaultSortOrder: 'descend',
            render: (timestamp, row) => renderLastOnline(row)
        },
    ];

    return <Table
        rowKey={'PlayerID'}
        size="small"
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