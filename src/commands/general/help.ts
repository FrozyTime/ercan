import Command from "../../types/Command";
import { Message, MessageEmbed, Guild } from "discord.js";
import { Db } from "mongodb";
import commandpreloader from "../commandpreloader";
import CommandData from "../../types/CommandData";
import Additional from "../../types/Additional";
import database from "../../database";
import GuildData from "../../types/GuildData";
import response from "../../response";

const docsBuilder = async (commands: CommandData[], db: Db, msg: Message) => {
    const guild: GuildData = await database.getGuildData(db, msg.guild?.id as String);
    let message="";

    for(let cmd of commands) {
        if(cmd.privilege == 1 && !msg.member?.hasPermission("ADMINISTRATOR")) continue;
        message += `${guild.prefix}${cmd.aliases.join(', ')} - \`${cmd.description || "This command does not have a description."}\`\n`
    }

    return message || "No documentation found for this category.";
}

export default class Help implements Command {
    async executor(msg: Message, args: String[], db: Db, additional: Additional) {
        if(!args[0]) {

            response.Success(msg);

            const utility = additional.cmdlist.filter(c => c.type === "utility");
            const economy = additional.cmdlist.filter(c => c.type === "economy");
            const music = additional.cmdlist.filter(c => c.type === "music");
            const nsfw = additional.cmdlist.filter(c => c.type === "nsfw");

            const settingsEmbed = new MessageEmbed()
            .setTitle("Command list")
            .setColor('#2F3136')
            .addField("**Utility** :hammer_pick: ", await docsBuilder(utility, db, msg), true)
            .addField("**Economy** :moneybag:", await docsBuilder(economy, db, msg), false)
            .addField("**Music** :musical_note:", await docsBuilder(music, db, msg), true)
            .addField("**NSFW** :heart:", await docsBuilder(nsfw, db, msg), false);
            
            const res = await msg.channel.send(settingsEmbed);

        } else {
            switch(args[0]) {

            }
        }
    }

    properties = {
        aliases: ["commands"],
        type: "utility",
        description: "Show all commands available to you."
    }
}