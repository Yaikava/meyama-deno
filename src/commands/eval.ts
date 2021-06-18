import { command } from "../types/command.ts";
import * as deps from "../../deps.ts";
export const com: command = {
  aliases: ["e"],
  owner: true,
  run(message, client, args) {
    try {
      const evaal = eval(args.join(" "));
      message.reply("```ts\n" + String(evaal).slice(0, 1990) + "```", false);
    } catch (e) {
      message.reply("```ts\n" + e + "```", false);
    }
  },
};
export default com;
