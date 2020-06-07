import { Db } from "mongodb";
import GuildData from "./types/GuildData";
import { Guild, Message } from "discord.js";
import BankData from "./types/BankData";

const getGuildData = async (db: Db, id: String) => {
    return (await db.collection('guilds').findOne({ guild_id: id }));
}

const updatePrefix = async (db: Db, id: String, prefix: String) => {
    const guild: GuildData = await getGuildData(db, id);
    if(guild.prefix == prefix) return { success: true, message: "Updated prefix successfully." };
    if(prefix.length > 12 || prefix.length <= 0) return { success: false, message: "The prefix must be 1 to 12 characters long." }

    await db.collection('guilds').updateOne({ guild_id: id }, { $set: { prefix } });
    return {
        success: true,
        message: "Updated prefix successfully."
    }
}

const getBankAccount = async (db: Db, user_id: String, guild: Guild) => {
    const bank = await db.collection('bank').findOne({ guild_id: guild.id, user_id: user_id });

    if(!bank) {
        const data = {
            guild_id: guild.id,
            user_id: user_id,
            balance: 0,
            transactions: [{
                date: new Date(),
                description: "Opened bank account."
            }]
        }

        db.collection('bank').insertOne(data);
        return data;
    } else return bank;
}

const addBankHistory = async (db: Db, user_id: String, guild: Guild, description: String) => {
    const bank: BankData | null = await db.collection('bank').findOne({ guild_id: guild.id, user_id: user_id });
    if(bank) {
        await db.collection('bank').updateOne({ guild_id: guild.id, user_id: user_id }, { $set: { transactions: [{ description: description, date: new Date() }, ...bank.transactions] } });

        return true;
    }

    return false;
}

const updateBankBalance = async (db: Db, user_id: String, guild: Guild, amount: number) => {
    let bank: BankData | null = await db.collection('bank').findOne({ guild_id: guild.id, user_id: user_id });
    const guildData: GuildData = await getGuildData(db, guild.id);

    if(!bank) bank = await getBankAccount(db, user_id, guild) as BankData;

    await db.collection('bank').updateOne({ guild_id: guild.id, user_id: user_id }, { $set: { balance: bank.balance as number + amount } });
    await addBankHistory(db, user_id, guild, `${guildData.currencyInFront ? guildData.currency+amount.toLocaleString('en').replace('-', '') : guildData.currency+amount.toLocaleString('en').replace('-', '')} was ${amount>=0 ? "given" : "taken"} by a server admin.`);

    return false;
}

export default { getGuildData, updatePrefix, getBankAccount, addBankHistory, updateBankBalance }