import {
  ApplicationCommandInteractionDataOptionWithValue,
  db,
  DiscordApplicationCommandOptionTypes,
  Embed,
  InteractionResponseTypes,
  ms,
  UniversityMember,
  UniversitySlashInteraction,
} from "../../deps.ts";
import { BotClient } from "../classes/Client.ts";
import duration from "../utils/duration.ts";

export default {
  async run(
    interaction: UniversitySlashInteraction,
    member: UniversityMember,
    client: BotClient,
  ) {
    if (!interaction.data.options) return;
    let subcommand = "";
    const opt = interaction.data.options[0];
    let suboptions: ApplicationCommandInteractionDataOptionWithValue[] = [];
    if (opt && opt.type == DiscordApplicationCommandOptionTypes.SubCommand) {
      subcommand = opt.name;
      suboptions = opt.options || [];
    }
    switch (subcommand) {
      case "create": {
        const content = suboptions.find((opt) =>
          opt.name === "content" &&
          opt.type == DiscordApplicationCommandOptionTypes.String
        )?.value as string;
        const time = suboptions.find((opt) =>
          opt.name === "time" &&
          opt.type == DiscordApplicationCommandOptionTypes.String
        )?.value as string;
        const date = time.split(" ").map((timestamp) => ms(timestamp)).reduce(
          (a, b) => Number(a) + Number(b),
          0,
        ) as number | undefined;
        if (!date) {
          return interaction.send({
            type: InteractionResponseTypes.ChannelMessageWithSource,
            data: {
              content: "Invalid timestamp :(",
              flags: 64,
            },
          });
        }
        let reminderID = Math.max(
          ...client.reminders.map((rem) => Number(rem.ID)),
        );
        if (reminderID<0) reminderID=0
        const worked = await db.createReminder(
          String(reminderID),
          String(member.id),
          content,
          String(Date.now() + date),
          client,
        );
        if (worked) {
          interaction.send({
            type: InteractionResponseTypes.ChannelMessageWithSource,
            data: {
              content: `Reminder succesfully created!\n\nID: ${reminderID}`,
              flags: 64,
            },
          });
        } else {
          interaction.send({
            type: InteractionResponseTypes.ChannelMessageWithSource,
            data: {
              content: "Something weird happened when creating the reminder :(",
              flags: 64,
            },
          });
        }
        break;
      }
      case "delete": {
        const id = suboptions.find((opt) =>
          opt.name === "content" &&
          opt.type == DiscordApplicationCommandOptionTypes.Integer
        )?.value as number
        const reminder = client.reminders.find(rem => rem.ID == String(id))
        if (!reminder || reminder.userid !== String(member.id)) return await interaction.send({
          type: InteractionResponseTypes.ChannelMessageWithSource,
          data: {
            content: "Either this reminder does nto exist or it's not yours!",
            flags: 64
          }
        })
        const deleted = await db.deleteReminder(String(id),client)
        if (deleted) {
          interaction.send({
            type: InteractionResponseTypes.ChannelMessageWithSource,
            data: {
              content: `Reminder succesfully deleted!`,
              flags: 64,
            },
          });
        } else {
          interaction.send({
            type: InteractionResponseTypes.ChannelMessageWithSource,
            data: {
              content: `Something weird happened when deleting the reminder :(`,
              flags: 64,
            },
          });
        }
        break;
      }
      case "show": {
        const emb = {
          title: `**__Ongoing Reminders:__**:`,
          description: "",
        };
        client.reminders.filter((rem) => rem.userid === String(member.id))
          .forEach((r) => {
            emb.description +=
              `\n\n> **ID:** ${r.ID}\n> Content: \`${r.content}\`\n> Time: ${
                Number(r.time) - Date.now()>0?duration(Number(r.time) - Date.now()):"In a matter of seconds! (60 secs max owo)"
              }`;
          });
        if (!emb.description) emb.description = "No reminders for you :(";
        interaction.send({
          type: InteractionResponseTypes.ChannelMessageWithSource,
          data: {
            embeds: [emb as Embed],
            flags: 64,
          },
        });
        break;
      }
    }
  },
};
