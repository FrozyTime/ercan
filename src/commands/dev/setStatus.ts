import CommandClass from "../../types/Command";
import { Message, Activity, ActivityType } from "discord.js";
import { Db } from "mongodb";
import responses from "../../response";
import CommandProperties from "../../types/CommandProperties";
import Command from "../../types/Command";
import fs from 'fs'
import path from 'path'

export default class status implements Command {
    executor(msg: Message, args: String[], db: Db) {

        let type;

        if(["PLAYING", "WATCHING", "STREAMING", "LISTENING"].includes(args[0].toUpperCase() as string)) {
            type = args[0].toUpperCase();
            args.shift();
            if(args[0].toLowerCase() === "to") args.shift();
        } 

        msg.client.user?.setPresence({
            activity: { 
                name: args.join(' '),
                type: type as ActivityType || "PLAYING",
                url: "https://www.twitch.tv/jackzeys"
            }
        });

        fs.promises.writeFile(path.join(__dirname, "../../presence.json"), JSON.stringify({
            type,
            text: args.join(' ')
        }, null, "\t"));

        responses.Success(msg);

    }
    
    properties: CommandProperties = {
        aliases:["changestatus"]
    }
}