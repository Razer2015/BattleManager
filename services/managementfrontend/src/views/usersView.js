import { PageHeader } from "antd";
import { UsersTable } from "../organisms/usersTable";

export function UsersView() {
    return (
        <div
            className="site-layout-background"
            style={{ padding: 0, minHeight: '100%' }}
        >
            <PageHeader
                className="site-page-header"
                title="Users"
                subTitle="Here you can manager the BattleManager users."
            >
                <UsersTable style={{ padding: '16px 24px' }} />
            </PageHeader>
        </div>
    );
}