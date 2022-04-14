import { Tooltip, Typography } from 'antd';

export function renderMap(map) {
    return <Tooltip title={map}>
        <Typography.Text style={{ textTransform: 'capitalize' }}>{mapCodeToName(map).toLowerCase()}</Typography.Text>
    </Tooltip>
}

function mapCodeToName(mapCode) {
    switch (mapCode) {
        case "MP_Abandoned": return "Zavod 311"
        case "MP_Damage": return "Lancang Dam"
        case "MP_Flooded": return "Flood Zone"
        case "MP_Journey": return "Golmud Railway"
        case "MP_Naval": return "Paracel Storm"
        case "MP_Prison": return "Operation Locker"
        case "MP_Resort": return "Hainan Resort"
        case "MP_Siege": return "Siege of Shanghai"
        case "MP_TheDish": return "Rogue Transmission"
        case "MP_Tremors": return "Dawnbreaker"

        case "XP1_001": return "SILK ROAD"
        case "XP1_002": return "ALTAI RANGE"
        case "XP1_003": return "GUILIN PEAKS"
        case "XP1_004": return "DRAGON PASS"

        case "XP0_Caspian": return "CASPIAN BORDER 2014"
        case "XP0_Firestorm": return "OPERATION FIRESTORM 2014"
        case "XP0_Metro": return "OPERATION METRO 2014"
        case "XP0_Oman": return "GULF OF OMAN 2014"

        case "XP2_001": return "LOST ISLANDS"
        case "XP2_002": return "NANSHA STRIKE"
        case "XP2_003": return "WAVE BREAKER"
        case "XP2_004": return "OPERATION MORTAR"

        case "XP3_MarketPl": return "PEARL MARKET"
        case "XP3_Prpganda": return "PROPAGANDA"
        case "XP3_UrbanGdn": return "LUMPHINI GARDEN"
        case "XP3_WtrFront": return "SUNKEN DRAGON"

        case "XP4_Arctic": return "OPERATION WHITEOUT"
        case "XP4_SubBase": return "HAMMERHEAD"
        case "XP4_Titan": return "HANGAR 21"
        case "XP4_WlkrFtry": return "GIANTS OF KARELIA"

        case "XP7_Valley": return "DRAGON VALLEY 2015"
        case "XP6_CMP": return "OPERATION OUTBREAK"
        case "XP5_Night_01": return "ZAVOD: GRAVEYARD SHIFT"

        default: return "Unknown"
    }
}
