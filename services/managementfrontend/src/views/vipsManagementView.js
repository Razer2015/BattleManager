import { PageHeader } from "antd";
import { VipsTable } from "../organisms/vipsTable";

export function VipsManagementView() {
    return (
        <div
            className="site-layout-background"
            style={{ padding: 0, minHeight: '100%' }}
        >
            <PageHeader
                className="site-page-header"
                title="Vips"
                subTitle="Here you can see all the current Vips in the server."
            >
                <VipsTable style={{ padding: '16px 24px' }} />
            </PageHeader>
        </div>
    );
}