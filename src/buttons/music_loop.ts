import {
  DiscordInteractionResponseTypes,
  UniversityButtonInteraction,
  UniversityMember,
} from "../../deps.ts";
import { BotClient } from "../classes/Client.ts";
import buttonsVoiceCheck from "../utils/buttons_voicecheck.ts";
import duration from "../utils/duration.ts";

export default {
  run: (
    interaction: UniversityButtonInteraction,
    member: UniversityMember,
    client: BotClient,
  ) => {
    const check = buttonsVoiceCheck(interaction, member, client);
    if (!check) return;
    const manager = check.manager,
      queue = check.queue,
      track = queue.songs[0].info;
    if (queue.loop == "disabled") {
      queue.loop = "track";
    } else if (queue.loop == "track") {
      queue.loop = "queue";
    } else {
      queue.loop = "disabled";
    }
    interaction.send({
      type: DiscordInteractionResponseTypes.UpdateMessage,
      data: {
        embeds: [
          {
            author: {
              name: "Meyama",
              iconUrl: client.bot?.avatarURL,
            },
            footer: {
              text: "©2020-2021 - Made by Lumap#0001",
            },
            color: client.brandingColor,
            title: "Now Playing",
            description:
              `**Title:** [${track.title}](${track.uri})\n**Author:** ${track.author}\n**Duration:** ${
                track.isStream ? "Live stream" : duration(track.length)
              }\n**Requester:** ${member.tag}`,
            fields: [
              {
                name: "State",
                value: manager.paused ? "Paused" : "Playing",
                inline: true,
              },
              { name: "Loop", value: queue.loop, inline: true },
            ],
          },
        ],
      },
    });
  },
};
