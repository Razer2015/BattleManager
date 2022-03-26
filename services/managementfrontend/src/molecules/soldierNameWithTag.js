import { Typography } from "antd";

export function renderSoldierNameWithTag({ SoldierName, ClanTag }) {
    if (ClanTag) return <Typography.Text>{`[${ClanTag}] ${SoldierName}`}</Typography.Text>
    return <Typography.Text>{SoldierName}</Typography.Text>
}