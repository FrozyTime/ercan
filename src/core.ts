import Discord from "discord.js";
import { MongoClient } from 'mongodb';
import { OnBotJoin } from './events';
import CommandHandler from './commands/commandhandler'

(async () => {
    const client = new Discord.Client();
    const mongo = await MongoClient.connect(process.env.MONGODB_URI as string, {useUnifiedTopology: true});
    const db = mongo.db(process.env.DB_NAME);
    
    /* Client setup  - Events */
    client.on("ready", () => {
        client.on("guildCreate", e => OnBotJoin(e, db));
    });

    /* Client setup - Commands */
    CommandHandler(client, db);
    
    client.login(process.env.BOT_TOKEN)
    .then(token => {
        console.log(`Signed into ${client ? client.user?.username : ''}`);
    });
})();