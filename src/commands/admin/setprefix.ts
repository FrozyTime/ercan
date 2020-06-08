import Command from "../../types/Command";
import { Message } from "discord.js";
import { Db } from "mongodb";
import Database from "../../database";
import GuildData from "../../types/GuildData";
import Responses from '../../response'
import CommandProperties from "../../types/CommandProperties";
import response from "../../response";

export default class implements Command {
    async executor(msg: Message, args: String[], db: Db) {
        const res = await Database.updatePrefix(db, msg.guild?.id as String, args[0]);       
        if(res.success) Responses.Success(msg);
        else response.Error(msg, "You do not have permission to execute this command.");
    }
    
    properties: CommandProperties = {
        aliases: ["changeprefix"],
        description: "Change the command prefix for Ercan.",
        type: "utility"
    }
}