import { command } from "../types/command.ts";
import { db, hasGuildPermissions } from "../../deps.ts";
export const com: command = {
  aliases: ["p"],
  owner: false,
  async run(message, client, args) {
    if (!message.guildId) return;
    const hasPerms = await hasGuildPermissions(
      message.guildId,
      message.authorId,
      ["ADMINISTRATOR"],
    );
    if (!hasPerms) {
      return message.send("You need ADMINISTRATOR perms to do this uwu");
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
