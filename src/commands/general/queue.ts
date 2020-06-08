import Command from "../../types/Command";
import { Message, MessageEmbed } from "discord.js";
import { Db } from "mongodb";
import CommandProperties from "../../types/CommandProperties";
import Additional from "../../types/Additional";
import response from "../../response";
import { Track, Utils } from "erela.js";

export default class Queue implements Command {
    executor(msg: Message, args: String[], db: Db, additional: Additional) {

        const player = additional.music.players.get(msg.guild?.id as string);

        if(player) {

            let embedMsg = "";
            const queue: Track[] = player.queue;

            for(let i in player.queue) {
                const songIndex = Number(i);
                if(Number(songIndex) == 0) continue;

                const song: Track = player.queue[songIndex];
                if(song) embedMsg += `\`${songIndex}\` ${msg.author.toString()} \`[${Utils.formatTime(song.duration || 1, true)}]\` [${song.title}](${song.uri})\n`
            }

            const queueEmbed = new MessageEmbed()
            .setTitle("Music queue")
            .setDescription(embedMsg)
            .addField("Now playing", `**[${queue[0].title}](${queue[0].uri})**`)
            .setColor('#2F3136');

            msg.channel.send(queueEmbed);

        } else response.Error(msg, "There is currently nothing playing.");

    }

    properties: CommandProperties = {
        aliases:["q"],
        type:"music",
        description:"See all songs in the music queue."
    }
}