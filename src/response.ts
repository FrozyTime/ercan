import { Message, Emoji, EmojiResolvable } from "discord.js";

const Success = (msg: Message) => msg.react(msg.guild?.emojis.cache.get('718489103578038294') as EmojiResolvable);

const Reply = async (msg: Message, text: String) => await msg.channel.send(`**${msg.author.username}#${msg.author.discriminator}** - ${text}`);

const Error = async (msg: Message, text: String) => {
    const error = await msg.channel.send(`**${msg.author.username}#${msg.author.discriminator}** - ${text}`);
    setTimeout(() => {
        msg.delete();
        error.delete();
    }, 5000);
}

export default { Success, Reply, Error }