import { command } from "../types/command.ts";
export const com: command = {
  aliases: ["h"],
  owner: false,
  run(message, _client, _args) {
    message.reply(
      "Hi there! I am a bot made with University. I may be basic for the user, but the backend has needed a lot of work and patience for it to work properly. I currently have one slash command, as well as three commands: this one, ping and prefix.\n\n<https://github.com/lumap/meyama-deno>",
      false,
    );
  },
};
export default com;
