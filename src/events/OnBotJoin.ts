/*
    #  When the bot joins the server fire this function.
*/

import { Guild } from "discord.js";
import { Db } from "mongodb";

export default async (e: Guild, db: Db) => {

    const guild = await db.collection('guilds').findOne({ guild_id: e.id });

    if(!guild) {
        console.log('guild does not exist');

        await db.collection('guilds').insertOne({
            guild_id: e.id,
            owner_id: e.ownerID,
            prefix: '!',
            currency: '$'
        });
    }

}