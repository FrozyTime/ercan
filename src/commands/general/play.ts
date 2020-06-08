import Command from "../../types/Command";
import { Message, GuildMember, User, MessageEmbed, MessageReaction, ReactionEmoji } from "discord.js";
import { Db } from "mongodb";
import CommandProperties from "../../types/CommandProperties";
import Erela, { Utils, SearchResult } from 'erela.js'
import response from "../../response";
import Additional from "../../types/Additional";

export default class Play implements Command {
    async executor(msg: Message, args: String[], db: Db, additional: Additional) {
        if (msg.member) {
            const vc = msg.member.voice.channel;
            if (!vc) return response.Error(msg, "You must be in a voice channel to play music!");

            const perms = vc.permissionsFor(msg.client.user as User);
            if (!perms?.has("CONNECT") || !perms?.has("SPEAK")) return response.Error(msg, "I cannot connect to your voice channel, it seems to be a permission issue.");

            if (!args[0]) return response.Reply(msg, "Please provide a song name or link to search.");

            let res: SearchResult;

            const player = additional.music.players.spawn({
                guild: msg.guild,
                textChannel: msg.channel,
                voiceChannel: vc
            });

            try {
                res = await additional.music.search(args.join(" "), msg.author);
            } catch (e) {
                return response.Error(msg, e);
            };

            switch (res.loadType) {

                case "TRACK_LOADED":
                case "SEARCH_RESULT":
                    player.queue.add(res.tracks[0]);
                    response.Reply(msg, `Enqueuing \`${res.tracks[0].title}\` \`${Utils.formatTime(res.tracks[0].duration, true)}\``);
                    response.Success(msg);
                    if (!player.playing) player.play();
                    break;

                /*
                case "SEARCH_RESULT":
                    const tracks = res.tracks.slice(0, 5);

                    const trackEmbed = new MessageEmbed()
                        .setAuthor("Song selection", msg.author.avatarURL() as string)
                        .setDescription(tracks.map(video => `**${index++}** - ${video.title}`))
                        .setFooter("Your response time closes within the next 30 seconds.")
                        .setColor('#2F3136');

                    const embedMsg = await msg.channel.send(trackEmbed);

                    if (!embedMsg.deleted) embedMsg.react("1️⃣");
                    if (!embedMsg.deleted) embedMsg.react("2️⃣");
                    if (!embedMsg.deleted) embedMsg.react("3️⃣");
                    if (!embedMsg.deleted) embedMsg.react("4️⃣");
                    if (!embedMsg.deleted) embedMsg.react("5️⃣");

                    const collected = await embedMsg.awaitReactions((r: MessageReaction, user: User) => msg.author.id == user.id, { max: 1, time: 30000, errors: ['time'] });
                    const reaction = collected.first();

                    const selectedSong = Number(reaction?.emoji.identifier.replace('%EF%B8%8F%E2%83%A3', '')) - 1;

                    embedMsg.delete();
                    player.queue.add(res.tracks[selectedSong]);
                    response.Success(msg);
                    response.Reply(msg, `Enqueuing \`${res.tracks[selectedSong].title}\` \`${Utils.formatTime(res.tracks[selectedSong].duration, true)}\``);
                    if (!player.playing) player.play();

                    break;
                    */
                case "PLAYLIST_LOADED":
                    res.playlist.tracks.forEach(track => player.queue.add(track));
                    const duration = Utils.formatTime(res.playlist.tracks.reduce((acc, cur) => ({ duration: acc.duration + cur.duration } as any)).duration, true);
                    response.Success(msg);
                    response.Reply(msg, `Enqueuing \`${res.tracks.length}\` from playlist ${res.playlist.info.name} \`${duration}\``);
                    if (!player.playing) player.play();
                    break;
            }



        }
    }
    properties: CommandProperties = {
        aliases: ["p"],
        type: "music",
        description: "Play any song by providing name or link."
    }
}