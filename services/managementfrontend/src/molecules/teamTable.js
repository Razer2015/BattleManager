import { Col, Row, Table } from "antd";
import { renderPing } from "./ping";

export function TeamTable({ serverInfo, players, loading, teamId, style }) {
    const gameMode = serverInfo?.game_mode;
    
    const teamName = () => {
        switch (gameMode) {
            case "RushLarge0":
                return teamId === 1 ? "attackers" : "defenders";
            default:
                return `Unknown gameMode ${gameMode}`;
        }
    }

    const teamScore = () => {
        switch (gameMode) {
            case "RushLarge0":
                return teamId === 1 ? "" : serverInfo?.scores?.scores[0];
            default:
                return `Unknown gameMode ${gameMode}`;
        }
    }

    const columns = [
        {
            title: <Row>
                <Col span={12} style={{ textAlign: 'left', textTransform: 'uppercase' }}>{teamName()} - {players.length}</Col>
                <Col span={12} style={{ textAlign: 'right' }}>{teamScore()}</Col>
            </Row>,
            className: teamName(),
            children: [
                {
                    title: 'Soldier',
                    key: 'index',
                    colSpan: 2,
                    align: 'left',
                    render: (value, item, index) => index + 1
                },
                {
                    title: '',
                    colSpan: 0,
                    dataIndex: 'player_name',
                    key: 'player_name',
                    sorter: (a, b) => a?.player_name - b?.player_name,
                },
                {
                    title: 'Kills',
                    dataIndex: 'kills',
                    key: 'kills',
                    sorter: (a, b) => a?.kills - b?.kills,
                },
                {
                    title: 'Deaths',
                    dataIndex: 'deaths',
                    key: 'deaths',
                    sorter: (a, b) => a?.deaths - b?.deaths,
                },
                {
                    title: 'Score',
                    dataIndex: 'score',
                    key: 'score',
                    defaultSortOrder: 'descend',
                    sorter: (a, b) => a?.score - b?.score,
                },
                {
                    title: 'Rank',
                    dataIndex: 'rank',
                    key: 'rank',
                    sorter: (a, b) => a?.rank - b?.rank,
                },
                {
                    title: 'Ping',
                    dataIndex: 'ping',
                    key: 'ping',
                    sorter: (a, b) => a?.ping - b?.ping,
                    render: (ping) => renderPing(ping),
                },
            ]
        }
    ];

    return <Table
        rowKey={'player_name'}
        size="small"
        loading={loading}
        dataSource={players}
        columns={columns}
        style={style}
        pagination={false}
    />
}