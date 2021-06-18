import {
  DiscordInteractionResponseTypes,
  UniversityButtonInteraction,
  UniversityMember,
} from "../../deps.ts";
import { BotClient } from "../classes/Client.ts";
import buttonsVoiceCheck from "../utils/buttons_voicecheck.ts";
import duration from "../utils/duration.ts"

export default {
  run: (
    interaction: UniversityButtonInteraction,
    member: UniversityMember,
    client: BotClient,
  ) => {
    const check = buttonsVoiceCheck(interaction, member, client);
    if (!check) return;
    const manager = check.manager, track = check.queue.songs[0].info;
    manager.paused ? manager.resume() : manager.pause();
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
                }\n**Requester:** ${member.tag}\n**Paused:** ${manager.paused}`,
            },
          ]
      },
    });
  },
};
