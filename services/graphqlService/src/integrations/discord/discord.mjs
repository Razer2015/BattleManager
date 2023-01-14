import md5 from 'md5';
import pkg, { MessageBuilder } from 'discord-webhook-node';
const { Webhook } = pkg;
const hook = new Webhook(process.env.DISCORD_WEBHOOK_URL);

export default class Discord {
    async postTestWebhook() {
        const embed = new MessageBuilder()
            .setTitle('My title here')
            .setAuthor('Author here', 'https://cdn.discordapp.com/embed/avatars/0.png', 'https://www.google.com')
            .setURL('https://www.google.com')
            .addField('First field', 'this is inline', true)
            .addField('Second field', 'this is not inline')
            .setColor('#00b0f4')
            .setThumbnail('https://cdn.discordapp.com/embed/avatars/0.png')
            .setDescription('Oh look a description :)')
            .setImage('https://cdn.discordapp.com/embed/avatars/0.png')
            .setFooter('Hey its a footer', 'https://cdn.discordapp.com/embed/avatars/0.png')
            .setTimestamp();

        hook.send(embed);
    }

    async postVipCreate(vip, user) {
        try {
            const embed = new MessageBuilder()
                .setTitle(`VIP created for ${vip.playername}`)
                .setAuthor(user.name, this.getGravatarUrl(user.email))
                .setURL(this.getVipUrl())
                .addField('SoldierName', vip.playername)
                .addField('Status', vip.status, true)
                .addField('Expiration', this.getRelativeTime(vip.timestamp), true)
                .setColor(this.getVipEmbedColor(vip.status))
                .setDescription(vip.comment)
                .setFooter('BattleManager by xfileFIN')
                .setTimestamp();

            if (vip.discord_id) {
                embed.addField("Linked Discord user", `<@${vip.discord_id}>`);
            }

            hook.send(embed);
        }
        catch (ex) {
            console.error(ex);
        }
    }

    async postVipUpdate(vip, user) {
        try {
            const embed = new MessageBuilder()
                .setTitle(`VIP updated for ${vip.playername}`)
                .setAuthor(user.name, this.getGravatarUrl(user.email))
                .setURL(this.getVipUrl())
                .addField('SoldierName', vip.playername)
                .addField('Status', vip.status, true)
                .addField('Expiration', this.getRelativeTime(vip.timestamp), true)
                .setColor(this.getVipEmbedColor(vip.status))
                .setDescription(vip.comment)
                .setFooter('BattleManager by xfileFIN')
                .setTimestamp();

            if (vip.discord_id) {
                embed.addField("Linked Discord user", `<@${vip.discord_id}>`);
            }

            hook.send(embed);
        }
        catch (ex) {
            console.error(ex);
        }
    }

    async postVipDelete(vip, user) {
        try {
            const embed = new MessageBuilder()
                .setTitle(`VIP deleted for ${vip.playername}`)
                .setAuthor(user.name, this.getGravatarUrl(user.email))
                .setURL(this.getVipUrl())
                .addField('SoldierName', vip.playername)
                .addField('Status', vip.status, true)
                .addField('Expiration', this.getRelativeTime(vip.timestamp), true)
                .setColor(this.getVipEmbedColor(vip.status))
                .setDescription(vip.comment)
                .setFooter('BattleManager by xfileFIN')
                .setTimestamp();

            if (vip.discord_id) {
                embed.addField("Linked Discord user", `<@${vip.discord_id}>`);
            }

            hook.send(embed);
        }
        catch (ex) {
            console.error(ex);
        }
    }

    getGravatarUrl(email) {
        const trimmedEmail = email?.trim()?.toLowerCase();
        const hash = !trimmedEmail ? '' : md5(trimmedEmail, { encoding: "binary" })
        return `https://gravatar.com/avatar/${hash}`;
    }

    getVipUrl() {
        if (process.env.APPLICATION_URL) {
            return `${process.env.APPLICATION_URL}/vips`;
        }

        return null;
    }

    getRelativeTime(timestamp) {
        if (!timestamp) {
            return '';
        }

        return `<t:${Math.floor(new Date(timestamp).getTime() / 1000)}:R>`;
    }

    getVipEmbedColor(status) {
        switch (status) {
            case "active":
                return "#6ABE39";
            case "inactive":
                return "#E84749";
            case "expired":
                return "#2F2F2F";
            default:
                return "#2F2F2F";
        }
    }
}
