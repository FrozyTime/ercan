import Discord, { ActivityType, Message } from "discord.js";
import { MongoClient } from 'mongodb';
import { OnBotJoin } from './events';
import CommandHandler from './commands/commandhandler'
import presence from './presence.json'
import { ErelaClient, Utils } from "erela.js";

(async () => {
    const client = new Discord.Client();
    const mongo = await MongoClient.connect(process.env.MONGODB_URI as string, { useUnifiedTopology: true });
    const db = mongo.db(process.env.DB_NAME);

    client.on("ready", () => {
        const erela: ErelaClient = new ErelaClient(client, [{ host: "localhost", port: 3440, password: "ercanmusicbot123" }])
            .on("nodeError", console.log)
            .on("nodeConnect", () => console.log("Successfully created a new lavalink node"))
            .on("queueEnd", player => {
                player.textChannel.send("Queue has ended.");
                return erela.players.destroy(player.guild.id);
            })
            .on("trackStart", ({ textChannel }, { title, duration }) => textChannel.send(`Now playing **${title}** \`${Utils.formatTime(duration, true)}\``).then((m: Message) => m.delete()));

        client.user?.setPresence({
            activity: {
                name: presence.text,
                type: presence.type.toUpperCase() as ActivityType || "PLAYING",
                url: "https://www.twitch.tv/jackzeys"
            }
        });

        /* Client setup  - Events */
        client.on("guildCreate", e => OnBotJoin(e, db));

        /* Client setup - Commands */
        CommandHandler(client, db, erela);
    });

    client.login(process.env.BOT_TOKEN)
        .then(token => {
            console.log(`Signed into ${client ? client.user?.username : ''}`);
        });
})();