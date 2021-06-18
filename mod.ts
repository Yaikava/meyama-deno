import { BotClient } from "./src/classes/Client.ts";
import { config } from "./deps.ts";
import { fileLoader, importDirectory } from "./src/utils/load.ts";

await Promise.all(
  [
    "./src/commands",
    "./src/buttons",
    "./src/events",
    "./src/classes",
    "./src/slashcommands",
    "./src/types",
    "./src/utils",
  ].map((path) => importDirectory(Deno.realPathSync(path))),
);
await fileLoader();

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
