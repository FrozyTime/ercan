import { Message } from "discord.js";
import { Db } from "mongodb";
import Additional from "./Additional";

export default interface CommandData {
    aliases: String[]
    executor: (msg: Message, args: String[], db: Db, additional?: Additional) => null
    privilege: Number
    type: string | null
    description: string | null
}