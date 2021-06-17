import { BotClient } from "./src/classes/Client.ts";
import { config } from "./deps.ts";

new BotClient({
  intents: [
    "Guilds",
    "GuildMembers",
    "GuildMessageReactions",
    "GuildMessages",
    "GuildVoiceStates",
  ],
  token: config.token,
});
