
import { Col, Row, Typography } from 'antd';
import { TeamTable } from '../molecules/teamTable';

export function LiveScoreboard({ listPlayers, loadingListPlayers, serverInfo }) {
    const filterByTeamId = (data, teamId) => {
        if (!data?.length || !teamId) return [];

        return data.filter(player => player.team === teamId);
    }

    const gameMode = serverInfo?.game_mode;

    switch (gameMode) {
        case "RushLarge0": {
            return <>
                <Row>
                    <Col span={12}>
                        <TeamTable
                            serverInfo={serverInfo}
                            players={filterByTeamId(listPlayers?.listPlayers, 1)}
                            loading={loadingListPlayers}
                            teamId={1}
                            style={{ marginRight: 8 }}
                        />
                    </Col>
                    <Col span={12}>
                        <TeamTable
                            serverInfo={serverInfo}
                            players={filterByTeamId(listPlayers?.listPlayers, 2)}
                            loading={loadingListPlayers}
                            teamId={2}
                            style={{ marginLeft: 8 }}
                        />
                    </Col>
                </Row>
            </>;
        }
        default:
            return <Typography>{`Unsupported game mode: ${gameMode}`}</Typography>
    }
}