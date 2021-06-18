import { config, UniversityMessage, db } from "../../deps.ts";
import { BotClient } from "../classes/Client.ts";

export default {
  once: false,
  async run(message: UniversityMessage, client: BotClient) {
    if (!client.fullyReady || !message.guildId) return;
    if (message.isBot || message.webhookId) return;
    if (!client.dbcache.get(message.guildId)) {
      const guild = await db.getGuild(message.guildId);
      client.dbcache.set(message.guildId, guild);
    }
    const prefix: string = client.dbcache.get(message.guildId)?.config?.prefix;
    if (message.content === `<@!${client.bot?.id}>` || message.content === `<@${client.bot?.id}>`) {
      return message.reply(
        `Hi! My prefix in this server is \`${prefix}\`\nGet started with \`${prefix}help!\``,
      );
    }
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(" "),
      commandName = args.shift();
    if (!commandName) return;
    const command = client.commands.get(commandName) ||
      client.commands.get(client.aliases.get(commandName) || "");
    if (!command) return;
    if (command.owner) {
      if (!config.owners.includes(String(message.authorId))) return;
    }
    try {
      command.run(message, client, args);
    } catch (e) {
      message.send(`Woops, something bad happened: ${e}`);
    }
  },
};
