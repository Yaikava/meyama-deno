import {
  DiscordButtonStyles,
  Player,
  Track,
  UniversitySlashInteraction,
} from "../../deps.ts";
import { BotClient } from "../classes/Client.ts";
import duration from "./duration.ts";

/** Convert milliseconds to MM:SS */
export function getMusicLength(milliseconds: number) {
  return milliseconds >= 3600000
    ? new Date(milliseconds).toISOString().substr(11, 8)
    : new Date(milliseconds).toISOString().substr(14, 5);
}

function execQueue(
  interaction: UniversitySlashInteraction,
  player: Player,
  client: BotClient,
) {
  if (!interaction.guildId) return;
  const queue = client.musicQueue.get(interaction.guildId);
  if (!queue || queue.songs.length === 0) {
    return;
  }
  const guild = client.guilds.get(BigInt(interaction.guildId));
  if (!guild) return;
  const channel = guild.channels.get(queue.textChannelId);
  if (!channel) return;
  const member = guild.members.get(queue.requester[0]);
  if (!member) return;

  player.play(queue.songs[0].track);

  // Handle if bot gets kicked from the voice channel
  player.once("closed", async () => {
    if (!interaction.guildId) return;
    const queue = client.musicQueue.get(interaction.guildId);
    if (!queue) return;
    if (queue.npmsg) {
      await queue.npmsg.delete();
    }
    client.musicQueue.delete(interaction.guildId);
    await client.musicManager.destroy(interaction.guildId);
    await channel.send("I have been disconnected from the channel.");
  });

  player.on("start", async () => {
    const track = queue.songs[0].info;
    queue.npmsg = await channel.send(
      {
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
              }\n**Requester:** ${member.tag}\n**Paused:** ${player.paused}`,
              fields: [
                {name: "State", value: player.paused?"Paused":"Playing", inline: true},
                {name: "Loop", value: queue.loop, inline: true}
              ]
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
              style: DiscordButtonStyles.Primary,
              emoji: {
                name: "🔁",
                id: undefined
              }
            }
          ],
        }],
      },
    );
  });

  player.on("end", async () => {
    if (!interaction.guildId) return;
    if (queue.loop == "disabled") { 
    queue.songs.shift();
    queue.requester.shift();
    } else if (queue.loop == "track") {
      "h"
    } else { //deno-lint-ignore no-explicit-any
      let elt: any = queue.songs.shift()
       if (elt) {
      queue.songs=queue.songs.concat([elt])
       }
       elt = queue.requester.shift()
       if (elt) {
        queue.requester=queue.requester.concat([elt])
       }
    }
    if (queue.npmsg) {
      await queue.npmsg.delete();
    }
    if (queue.songs.length == 0) { //lave vc
      await client.musicManager.destroy(interaction.guildId.toString());
      client.musicQueue.delete(interaction.guildId);
      channel.send("Queue is apparently empty idk");
      return;
    } else {
      player.play(queue.songs[0].track);
    }
  });
}

export async function addSoundToQueue(
  interaction: UniversitySlashInteraction,
  track: Track,
  client: BotClient,
) {
  if (!interaction.guildId || !interaction.channelId || !interaction.member) {
    return;
  }
  const player = client.musicManager.players.get(
    interaction.guildId.toString(),
  );
  const queue = client.musicQueue.get(interaction.guildId);
  if (!player) return;
  async function editInteraction() {
    return await interaction.edit({
      content:
        `Added **${track.info.title}** by **${track.info.author}** to the queue!`,
    });
  }
  if (queue) {
    queue.songs = queue.songs.concat(track);
    queue.requester = queue.requester.concat(
      BigInt(interaction.member.user.id),
    );
    await editInteraction();
  } else {
    client.musicQueue.set(interaction.guildId, {
      textChannelId: BigInt(interaction.channelId),
      songs: [track],
      requester: [BigInt(interaction.member.user.id)],
      loop: "disabled"
    });
    await editInteraction();
    execQueue(interaction, player, client);
  }
}

export async function addPlaylistToQueue(
  interaction: UniversitySlashInteraction,
  playlistName: string,
  tracks: Track[],
  client: BotClient,
) {
  if (!interaction.guildId || !interaction.channelId || !interaction.member) {
    return;
  }
  const player = client.musicManager.players.get(
    interaction.guildId.toString(),
  );
  const queue = client.musicQueue.get(interaction.guildId);
  if (!player) return;
  async function editInteraction() {
    return await interaction.edit({
      content:
        `Added ${tracks.length} songs from the playlist: ${playlistName} to the queue!`,
    });
  }
  if (queue) {
    queue.songs = queue.songs.concat(tracks);
    queue.requester = queue.requester.concat(
      Array.from({ length: tracks.length }).map(() =>
        BigInt(interaction.member?.user.id)
      ),
    );
    await editInteraction();
  } else {
    client.musicQueue.set(interaction.guildId, {
      textChannelId: BigInt(interaction.channelId),
      songs: tracks,
      requester: Array.from({ length: tracks.length }).map(() =>
        BigInt(interaction.member?.user.id)
      ),
      loop: "disabled"
    });
    await editInteraction();
    execQueue(interaction, player, client);
  }
}
