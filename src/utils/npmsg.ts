import {
  CreateMessage,
  DiscordButtonStyles,
  DiscordInteractionResponseTypes,
  InteractionApplicationCommandCallbackData,
  UniversityButtonInteraction,
  UniversityChannel,
  UniversitySlashInteraction,
} from "../../deps.ts";
import { BotClient } from "../classes/Client.ts";
import duration from "./duration.ts";

export default async (
  interaction: UniversityButtonInteraction | UniversitySlashInteraction,
  client: BotClient,
  channel?: UniversityChannel,
) => {
  if (!interaction.guildId) return;
  const player = client.musicManager.players.get(interaction.guildId),
    queue = client.musicQueue.get(interaction.guildId);
  if (!player || !queue) return;
  const track = queue.songs[0].info;
  const npmsg: CreateMessage = {
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
          }\n**Requester:** ${
            queue.requester[0].split(" ").slice(1).join(" ")
          }\n**Paused:** ${player.paused}`,
        fields: [
          {
            name: "State",
            value: track.isStream
              ? "Live Stream"
              : player.paused
              ? "Paused"
              : "Playing",
            inline: true,
          },
          { name: "Loop", value: queue.loop, inline: true },
          {
            name: "Volume", value: String(player.volume), inline: true 
          }
        ],
      },
    ],
    components: [{
      type: 1,
      components: [
        {
          type: 2,
          customId: "music_pause_play",
          label: "Pause/Play",
          style: DiscordButtonStyles.Secondary,
          emoji: {
            name: "⏯️",
            id: undefined,
          },
          disabled: track.isStream,
        },
        {
          type: 2,
          customId: "music_skip",
          label: "Skip",
          style: DiscordButtonStyles.Secondary,
          emoji: {
            name: "⏩",
            id: undefined,
          },
        },
        {
          type: 2,
          customId: "music_stop",
          label: "Stop",
          style: DiscordButtonStyles.Danger,
          emoji: {
            name: "🛑",
            id: undefined,
          },
        },
        {
          type: 2,
          customId: "music_loop",
          label: "Loop",
          style: DiscordButtonStyles.Secondary,
          emoji: {
            name: "🔁",
            id: undefined,
          },
        },
      ],
    }, {
      type: 1,
      components: [
        {
          type: 2,
          customId: "music_volume_minus25",
          label: "-25",
          style: DiscordButtonStyles.Primary,
          disabled: player.volume<25,
          emoji: {
            name: "🔈",
            id: undefined
          }
        },
        {
          type: 2,
          customId: "music_volume_minus10",
          label: "-10",
          style: DiscordButtonStyles.Primary,
          disabled: player.volume<10,
          emoji: {
            name: "🔉",
            id: undefined
          }
        },
        {
          type: 2,
          customId: "music_volume_default",
          label: "Default Volume",
          style: DiscordButtonStyles.Success,
        },
        {
          type: 2,
          customId: "music_volume_plus10",
          label: "+10",
          style: DiscordButtonStyles.Primary,
          disabled: player.volume>190,
          emoji: {
            name: "🔉",
            id: undefined
          }
        },
        {
          type: 2,
          customId: "music_volume_plus25",
          label: "+25",
          style: DiscordButtonStyles.Primary,
          disabled: player.volume>175,
          emoji: {
            name: "🔊",
            id: undefined
          }
        },
      ],
    }],
  };

  if (interaction instanceof UniversityButtonInteraction) {
    return await interaction.send({
      type: DiscordInteractionResponseTypes.UpdateMessage,
      data: npmsg as InteractionApplicationCommandCallbackData,
    });
  } else {
    if (!channel) return;
    return await channel.send(npmsg);
  }
};
