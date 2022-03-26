import { useQuery } from '@apollo/client';
import { Table } from 'antd';
import { GET_ALL_VIPS } from '../graphql/queries';
import { renderStatus } from '../molecules/status';
import { renderTimestamp } from '../molecules/timestamp';

export function VipsTable() {
    const { loading, error, data } = useQuery(GET_ALL_VIPS);

    // if (loading) return <p>Loading...</p>;
    if (error) return <p>{JSON.stringify(error)}</p>;

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
    ];

    return <Table rowKey={'ID'} loading={loading} dataSource={data?.allVips} columns={columns} />;
}