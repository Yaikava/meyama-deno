import { command } from "../types/command.ts";
import { db } from "../../deps.ts";

export const com: command = {
  aliases: [],
  owner: false,
  async run(message, client, args) {
    if (!message.guildId) return;
    const hasPerms = await client.hasGuildPermissions(
      message.guildId,
      message.authorId,
      ["ADMINISTRATOR"],
    );
    if (!hasPerms) {
      return message.send("You need ADMINISTRATOR perms to do this uwu");
    }
    if (!args.join(" ")) {
      return message.send("Woops, no prefix has been provided!");
    }
    await db.setProperty(
      message.guildId,
      "config.prefix",
      args.join(" "),
      client,
    );
    message.send(`Prefix succesfully updated to **${args.join(" ")}**`);
  },
};
export default com;
