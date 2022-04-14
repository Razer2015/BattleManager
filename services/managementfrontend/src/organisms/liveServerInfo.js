
import { Badge, Col, Descriptions, Row, Skeleton, Typography } from 'antd';
import { renderDuration } from '../molecules/duration';
import { renderGameMode } from '../molecules/gameMode';
import { renderMap } from '../molecules/map';

export function LiveServerInfo({ serverInfo, loadingServerInfo }) {
    const roundRunning = () => {
        return serverInfo?.roundtime > 0 ? <Badge status="success" text="Running" /> : <Badge status="error" text="Idle" />;
    }

    const booleanBadge = (value) => {
        return value ? <Badge status="success" text="Yes" /> : <Badge status="error" text="No" />;
    }

    const gameMode = serverInfo?.game_mode;

    switch (gameMode) {
        case "RushLarge0": {
            return <>
                <Row>
                    <Col><Typography.Title level={4}>{serverInfo?.server_name}</Typography.Title></Col>
                </Row>
                <Row style={{ paddingBottom: 8 }}>
                    <Col span={12}>
                        {loadingServerInfo && (
                            <Skeleton />
                        )}
                        {!loadingServerInfo && (
                            <>
                                <Descriptions title={'Round information'} bordered size={'small'} column={2} style={{ marginRight: 8 }}>
                                    <Descriptions.Item label="Round">
                                        {roundRunning()}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Round time">
                                        {renderDuration(serverInfo?.roundtime)}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Real players">
                                        {serverInfo?.playercount}/{serverInfo?.max_playercount}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Blaze players">
                                        {serverInfo?.blaze_player_count}/{serverInfo?.max_playercount}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Game mode">
                                        {renderGameMode(serverInfo?.game_mode)}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Map">
                                        {renderMap(serverInfo?.map)}
                                    </Descriptions.Item>
                                </Descriptions>
                            </>
                        )}
                    </Col>
                    <Col span={12}>
                        {loadingServerInfo && (
                            <Skeleton />
                        )}
                        {!loadingServerInfo && (
                            <>
                                <Descriptions title={'Server information'} bordered size={'small'} column={2} style={{ marginLeft: 8 }}>
                                    <Descriptions.Item label="Server uptime" span={2}>
                                        {renderDuration(serverInfo?.server_uptime)}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Region">
                                        {serverInfo?.region}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Country">
                                        {serverInfo?.country}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Ranked">{booleanBadge(serverInfo?.ranked)}</Descriptions.Item>
                                    <Descriptions.Item label="Punkbuster">{booleanBadge(serverInfo?.punkbuster)}</Descriptions.Item>
                                    <Descriptions.Item label="Password">{booleanBadge(serverInfo?.has_gamepassword)}</Descriptions.Item>
                                    <Descriptions.Item label="Join queue">{booleanBadge(serverInfo?.join_queue_enabled)}</Descriptions.Item>
                                </Descriptions>
                            </>
                        )}
                    </Col>
                </Row>
            </>;
        }
        default:
            return <Typography>{`Unsupported game mode: ${gameMode}`}</Typography>
    }
}