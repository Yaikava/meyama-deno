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
        const evaal = eval(message.content.slice(prefix.length+4).trim());
        message.send("```ts\n" + String(evaal) + "```");
      } catch (e) {
        message.send("```ts\n" + e + "```");
      }
    }
    if (message.content == prefix + "ping") {
      message.send(`Pong! ${Date.now() - message.timestamp}ms`);
    }
    if (message.content == `<@!${client.bot?.id}>`) {
      message.send("Hey there! My prefix here is "+prefix)
    }
    if (message.content == prefix+"help") {
      message.send("Hi there! I am a bot made with University. I may be basic for the user, but the backend has needed a lot of work and patience for it to work properly. I currently have one slash command, as well as two commands: this one and `ping`.")
    }
  },
};
