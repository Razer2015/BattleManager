import Publisher from "../publisher.mjs";
import { hasRole } from "../utils/authentication.mjs";
import { NotFoundError } from "../utils/errors.mjs";
import BaseLogic from "./baseLogic.mjs";

const pubsub = Publisher.getInstance()

export default class Chat extends BaseLogic {
    constructor(...args) {
        super(...args)
    }

    async newChatMessage(data) {
        const { Chat } = data
        console.log(Chat);

        let visibility = Chat?.vis
        let teamId = null
        let squadId = null
        if (typeof visibility === 'object') {
            if (visibility.hasOwnProperty('Team')) {
                visibility = 'Team'
                teamId = Chat?.vis?.Team
            }
            else if (visibility.hasOwnProperty('Squad')) {
                visibility = 'Squad'
                teamId = Chat?.vis?.Squad[0]
                squadId = Chat?.vis?.Squad[1]
            }
        }

        pubsub.publish('CHAT_MESSAGE_RECEIVED', {
            chatMessageReceived: {
                visibility: visibility,
                message: Chat?.msg,
                player: Chat?.player?.name,
                teamId: teamId,
                squadId: squadId,
                timestamp: new Date()
            }
        });

        return Promise.resolve("ok");
    }
}