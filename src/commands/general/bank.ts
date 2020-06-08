import CommandClass from "../../types/Command";
import { Message, MessageEmbed, EmojiResolvable, ReactionEmoji, MessageReaction, User, Guild } from "discord.js";
import { Db } from "mongodb";
import database from "../../database";
import GuildData from "../../types/GuildData";
import CommandProperties from "../../types/CommandProperties";
import responses from "../../response";
import BankData from "../../types/BankData";
import moment from 'moment'

export default class Bank implements CommandClass {
    async executor(msg: Message, args: String[], db: Db) {
        responses.Success(msg);

        const guild: GuildData = await database.getGuildData(db, msg.guild?.id as string);

        const bank: BankData = await database.getBankAccount(db, msg.author.id, msg.guild as Guild);
        let bankHistory = "";
        for (let t of bank.transactions) {
            bankHistory += `[${moment(t.date).format('LL')}] \`${t.description}\`\n`
        }

        const bankEmbed = new MessageEmbed()
            .setTitle(`${msg.author.username}'s bank account.`)
            .setColor('#2F3136')
            .addField("Account balance", `||${guild.currencyInFront ? `\`${guild.currency}${bank.balance.toLocaleString('en')}\`` : `\`${bank.balance.toLocaleString('en')}${guild.currency}\``}||\nPress to reveal`, true)
            .addField("Latest activity", bankHistory, true)

        if (!args[0] || args[0].toLowerCase() !== "chat" && args[0].toLowerCase() !== "dm") {

            const confirmation = await responses.Reply(msg, "Are you sure you want to reveal your bank balance publicly? If not I will send it in DMs");
            await confirmation.react(msg.guild?.emojis.cache.get('718520743444611215') as EmojiResolvable);
            await confirmation.react(msg.guild?.emojis.cache.get('718520790185672734') as EmojiResolvable);

            const filter = (reaction: MessageReaction, user: User) => {
                return user.id == msg.author.id
            }

            const collected = await confirmation.awaitReactions(filter, { max: 1, time: 20000, errors: ['time'] })
            const reaction = collected.first();

            if (reaction?.emoji.name === "yespls") msg.channel.send(bankEmbed);
            else if (reaction?.emoji.name === "no") msg.author.send(bankEmbed);

            confirmation.delete();
        } 
        else if(args[0].toLowerCase() === "chat") msg.channel.send(bankEmbed);
        else if(args[0].toLowerCase() === "dm") msg.author.send(bankEmbed);
    }

    properties: CommandProperties = {
        aliases: ["money"],
        description: "Check bank balance & history.",
        type: "economy"
    }
}