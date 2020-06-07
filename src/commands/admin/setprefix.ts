import Command from "../../types/Command";
import { Message } from "discord.js";
import { Db } from "mongodb";
import Database from "../../database";
import GuildData from "../../types/GuildData";
import Responses from '../../response'
import CommandProperties from "../../types/CommandProperties";

export default class implements Command {
    async executor(msg: Message, args: String[], db: Db) {
        const res = await Database.updatePrefix(db, msg.guild?.id as String, args[0]);       
        if(res.success) Responses.Success(msg);
        else {
            msg.channel.send(`:warning: **::** ${res.message}`);
        }
    }
    
    properties: CommandProperties = {
        aliases: ["changeprefix"]
    }
}