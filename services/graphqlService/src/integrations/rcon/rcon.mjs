import axios from "axios";

export default class RCON {
    async getServerInfo(serverEndpoint) {
        return await axios({
            method: 'get',
            url: `${serverEndpoint}/serverInfo`,
        })
        .then(response => response?.data);
    }

    async getServerPlayers(serverEndpoint) {
        return await axios({
            method: 'get',
            url: `${serverEndpoint}/listPlayers`,
        })
        .then(response => response?.data);
    }
}
