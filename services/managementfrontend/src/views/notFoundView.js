import { PageHeader } from "antd";

export function NotFound() {
    return (
        <div
            className="site-layout-background"
            style={{ padding: 0, minHeight: '100%' }}
        >
            <PageHeader
                className="site-page-header"
                title="404 Not found"
                subTitle="The page you were looking for does not exist."
            >
            </PageHeader>
        </div>
    );
}