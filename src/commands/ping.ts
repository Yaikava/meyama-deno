import { command } from "../types/command.ts";
export const com: command = {
  aliases: ["p"],
  owner: false,
  run(message, _client, _args) {
    message.reply(`Pong! ${Date.now() - message.timestamp}ms`, false);
  },
};
export default com;
