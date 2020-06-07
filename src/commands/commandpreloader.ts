import CommandClass from "../types/Command";
import fs from "fs";
import path from "path";

const cmdlist: any[] = [];

async function addCommandToCmdList(type: String, privilege: Number) {
    const generalCommands = await fs.promises.readdir(path.join(__dirname, type as string));
    for (let cmd of generalCommands) {
        cmd = cmd.substr(0, cmd.length - 3); // Remove .ts extension
        const source: CommandClass = new (require(`./${type}/${cmd}`).default);

        cmdlist.push({
            aliases: [cmd.toLowerCase(), ...source.properties.aliases],
            executor: source.executor,
            privilege,
            type: source.properties.type,
            description: source.properties.description
        });
    }
}

export default async () => {
    /* Pre-load all commands */

    addCommandToCmdList('general', 0);
    addCommandToCmdList('admin', 1);
    addCommandToCmdList('dev', 2);

    return cmdlist;
}