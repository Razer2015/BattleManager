import { PageHeader } from "antd";
import { LiveScoreboard } from "../organisms/liveScoreboard";
import { useLazyQuery } from '@apollo/client';
import { GET_SERVERINFO, LIST_PLAYERS } from '../graphql/queries';
import { useEffect, useState } from "react";
import { LiveServerInfo } from "../organisms/liveServerInfo";

export function HomeView() {
    const [getPlayers, { data: listPlayers, loadingListPlayers }] = useLazyQuery(LIST_PLAYERS);
    const [getServerInfo, { data: serverInfo, serverInfoLoading }] = useLazyQuery(GET_SERVERINFO);
    const [serverId, setServerId] = useState(1);

    useEffect(() => {
        getPlayers({
            fetchPolicy: 'network-only',
            pollInterval: 5 * 1000,
            variables: {
                serverId: serverId
            }
        });

        getServerInfo({
            fetchPolicy: 'network-only',
            pollInterval: 5 * 1000,
            variables: {
                serverId: serverId
            }
        });
        // eslint-disable-next-line
    }, [serverId])

    return (
        <div
            className="site-layout-background"
            style={{ padding: 0, minHeight: '100%' }}
        >
            <PageHeader
                className="site-page-header"
                title="Home"
                subTitle=""
            >
                <LiveServerInfo serverInfo={serverInfo?.serverInfo} loadingServerInfo={serverInfoLoading} />
                <LiveScoreboard listPlayers={listPlayers} loadingListPlayers={loadingListPlayers} serverInfo={serverInfo?.serverInfo} />
            </PageHeader>
        </div>
    );
}