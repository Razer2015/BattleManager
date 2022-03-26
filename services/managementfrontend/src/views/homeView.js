import { PageHeader } from "antd";

export function HomeView() {
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
            </PageHeader>
        </div>
    );
}