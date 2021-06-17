import { DiscordenoMessage } from "../../deps.ts";
import { BotClient } from "../classes/Client.ts";
import { getGuild, setProperty } from "../utils/db.ts";

export default {
  once: false,
  async run(message: DiscordenoMessage, client: BotClient) {
    if (!client.fullyReady) return;
    setProperty;
    if (message.isBot || message.webhookId) return;
    if (!client.dbcache.get(message.guildId)) {
      const guild = await getGuild(message.guildId);
      client.dbcache.set(message.guildId, guild);
    }

    const prefix: string = client.dbcache.get(message.guildId)?.config?.prefix;
    if (message.content.startsWith(prefix + "eval")) {
      if (message.authorId != 635383782576357407n) return;
      try {
        const evaal = eval(message.content.slice(prefix.length + 4).trim());
        message.reply("```ts\n" + String(evaal) + "```", false);
      } catch (e) {
        message.reply("```ts\n" + e + "```", false);
      }
    }
    if (message.content == prefix + "ping") {
      message.reply(`Pong! ${Date.now() - message.timestamp}ms`, false);
    }
    if (message.content == `<@!${client.bot?.id}>`) {
      message.reply("Hey there! My prefix here is " + prefix, false);
    }
    if (message.content == prefix + "help") {
      message.reply(
        "Hi there! I am a bot made with University. I may be basic for the user, but the backend has needed a lot of work and patience for it to work properly. I currently have one slash command, as well as two commands: this one and `ping`.\n\n<https://github.com/lumap/meyama-deno>",
        false,
      );
    }
  },
};
