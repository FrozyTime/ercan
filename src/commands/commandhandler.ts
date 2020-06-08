import { Client, Message } from "discord.js";
import { Db } from "mongodb";
import Database from "../database"
import GuildData from "../types/GuildData"
import CommandData from "../types/CommandData";
import CommandPreloader from "./commandpreloader"
import response from "../response";
import { ErelaClient, Utils } from 'erela.js'

export default async (client: Client, db: Db, erela: ErelaClient) => {

    const cmdlist: CommandData[] = await CommandPreloader();

    /* Message event */
    client.on("message", async msg => {
        if (msg.author.bot) return;
        if (msg.channel.type === "dm") return;
        const guildData: GuildData = await Database.getGuildData(db, msg.guild?.id as string);

        if (msg.content == `<@!${msg.client.user?.id}>`) {
            msg.channel.send(`My prefix is \`${guildData.prefix}\``);
            return;
        }

        if (!msg.content.startsWith(guildData.prefix)) return;

        const foundCommands: CommandData[] = cmdlist.filter(c => c.aliases.includes(msg.content.replace(guildData.prefix, '').split(' ')[0].toLowerCase()));
        const args = msg.content.split(' '); args.shift();

        const additional = {
            cmdlist,
            music: erela
        }

        if (foundCommands.length > 0) {
            for (let cmd of foundCommands) {
                if (cmd.privilege == 0) cmd.executor(msg, args, db, additional);
                else if (cmd.privilege == 1) {
                    if (msg.member?.hasPermission("ADMINISTRATOR")) {
                        cmd.executor(msg, args, db, additional);
                        continue;
                    }

                    response.Error(msg, "You do not have permission to execute this command.");
                }
                else if (cmd.privilege >= 2 && msg.author.id === process.env.DEVELOPER?.toString()) cmd.executor(msg, args, db);
            }
        }

    });
}