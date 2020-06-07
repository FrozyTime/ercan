import { Message } from "discord.js";
import { Db } from "mongodb";
import CommandProperties from "./CommandProperties";
import Additional from "./Additional";

export default interface Command {
    executor(msg: Message, args: String[], db: Db, additional: Additional): void
    properties: CommandProperties
}