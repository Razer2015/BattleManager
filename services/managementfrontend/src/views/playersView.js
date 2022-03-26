import { PageHeader } from "antd";
import { PlayersTable } from "../organisms/playersTable";

export function PlayersView() {
    return (
        <div
            className="site-layout-background"
            style={{ padding: 0, minHeight: '100%' }}
        >
            <PageHeader
                className="site-page-header"
                title="Users"
                subTitle=""
            >
                <PlayersTable style={{ padding: '16px 24px' }} />
            </PageHeader>
        </div>
    );
}