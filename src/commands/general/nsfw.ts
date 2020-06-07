import Command from "../../types/Command";
import { Message, GuildChannel, TextChannel, MessageEmbed } from "discord.js";
import { Db } from "mongodb";
import responses from "../../response";

export default class NSFW implements Command {
    async executor(msg: Message, args: String[], db:  Db) {
        const channel = msg.channel as TextChannel;
        if(!channel.nsfw) return responses.Error(msg, "This command can only be executed in an NSFW channel.");
        

        msg.channel.send('wip');

    
    }

    properties = {
        aliases: ["porn"]
    }
}