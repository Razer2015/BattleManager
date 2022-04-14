import { Tooltip, Typography } from 'antd';

export function renderGameMode(gameMode) {
    switch (gameMode) {
        case "RushLarge0":
            return <Tooltip title={gameMode}>
                <Typography.Text>Rush</Typography.Text>
            </Tooltip>
        default:
            return `Unknown game mode: ${gameMode}`
    }
}
