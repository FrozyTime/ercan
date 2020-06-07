import CommandClass from "../../types/Command";
import { Message, MessageReaction, User, CollectorFilter } from "discord.js";
import { Db } from "mongodb";
import CommandProperties from "../../types/CommandProperties";
import Command from "../../types/Command";

export default class Test implements Command {

    async executor(msg: Message, args: String[], db: Db) {

        const mymessage = await msg.channel.send('Debit is a bender');

        mymessage.react('🟩').then(() => mymessage.react('🟥'));

        const collected = await mymessage.awaitReactions((reaction: MessageReaction, user: User) => user != msg.client.user, { max: 1, time: 20000, errors: ['time'] });
        const reaction = collected.first();

        if(reaction?.emoji.name === '🟩') {
            msg.channel.send(`I am glad you agreed. Debit is a proper gay boy.`);
        } else if(reaction?.emoji.name === '🟥') {
            msg.channel.send("You are wrong. Do not disagree. ")
        }

    }

    properties: CommandProperties = {
        aliases: ["debug"]
    }

}