import Command from "../../types/Command";
import { Message, Guild } from "discord.js";
import { Db } from "mongodb";
import database from "../../database";
import response from "../../response";

export default class implements Command {
    executor(msg: Message, args: String[], db: Db) {

        const target = msg.client.users.cache.find(user => user.username.toLowerCase() == args[0].toLowerCase() || user.id == args[0]);
        if(target) {
            args.shift();
            switch(args[0].toLowerCase()) {
                case "add":
                case "give":
                    if(Number(args[1])) {
                        database.updateBankBalance(db, target.id, msg.guild as Guild, Number(args[1]));
                        response.Success(msg);
                    } else {
                        response.Error(msg, `Please provide a valid number`);
                    }
                break;
                case "remove":
                case "take":
                    if(Number(args[1])) {
                        database.updateBankBalance(db, target.id, msg.guild as Guild, Number(args[1]) * -1);
                        response.Success(msg);
                    } else {
                        response.Error(msg, `Please provide a valid number`);
                    }    
                break;
                default:
    
                break;
            }
        } else {
            response.Error(msg, `Unable to find user "${args[0]}"`);
        }


    }

    properties = {
        aliases: ["economny"],
        description: "Server economy management.",
        type: "economy"
    }
}