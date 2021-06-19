import { Player, Track, UniversitySlashInteraction } from "../../deps.ts";
import { BotClient } from "../classes/Client.ts";
import npmsg from "./npmsg.ts";

/** Convert milliseconds to MM:SS */
export function getMusicLength(milliseconds: number) {
  return milliseconds >= 3600000
    ? new Date(milliseconds).toISOString().substr(11, 8)
    : new Date(milliseconds).toISOString().substr(14, 5);
}

async function execQueue(
  interaction: UniversitySlashInteraction,
  player: Player,
  client: BotClient,
) {
  if (!interaction.guildId || !interaction.channelId) {
    return console.log("no interaction guild id");
  }
  const queue = client.musicQueue.get(interaction.guildId);
  if (!queue || queue.songs.length === 0) return;
  const guild = client.guilds.get(BigInt(interaction.guildId));
  if (!guild) return;
  let channel = guild.channels.get(queue.textChannelId);
  if (!channel) {
    await client.helpers.channels.getChannel(
      BigInt(interaction.channelId),
      true,
    );
    channel = guild.channels.get(queue.textChannelId);
  }

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
    if (!channel) return;
    await client.musicManager.destroy(interaction.guildId);
    await channel.send("I have been disconnected from the channel.");
  });

  player.on("start", async () => {
    if (!channel) return;
    queue.npmsg = await npmsg(interaction, client, channel);
  });

  player.on("end", async () => {
    if (!interaction.guildId) return;
    if (!channel) return;
    if (queue.loop == "disabled") {
      queue.songs.shift();
      queue.requester.shift();
    } else if (queue.loop == "track") {
      "h";
    } else { //deno-lint-ignore no-explicit-any
      let elt: any = queue.songs.shift();
      if (elt) {
        queue.songs = queue.songs.concat([elt]);
      }
      elt = queue.requester.shift();
      if (elt) {
        queue.requester = queue.requester.concat([elt]);
      }
    }
    if (queue.npmsg) {
      await queue.npmsg.delete();
    }
    if (queue.songs.length == 0) { //lave vc
      await client.musicManager.destroy(interaction.guildId);
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
      `${interaction.member.user.id} ${interaction.member.user.username}#${interaction.member.user.discriminator}`,
    );
    await editInteraction();
  } else {
    client.musicQueue.set(interaction.guildId, {
      textChannelId: BigInt(interaction.channelId),
      songs: [track],
      requester: [
        `${interaction.member.user.id} ${interaction.member.user.username}#${interaction.member.user.discriminator}`,
      ],
      loop: "disabled",
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
  if (!interaction.guildId || !interaction.channelId) {
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
  const member = interaction.member;
  if (!member) return;
  if (queue) {
    queue.songs = queue.songs.concat(tracks);
    queue.requester = queue.requester.concat(
      Array.from({ length: tracks.length }).map(() =>
        `${member.user.id} ${member.user.username}#${member.user.discriminator}`
      ),
    );
    await editInteraction();
  } else {
    client.musicQueue.set(interaction.guildId, {
      textChannelId: BigInt(interaction.channelId),
      songs: tracks,
      requester: Array.from({ length: tracks.length }).map(() =>
        `${member.user.id} ${member.user.username}#${member.user.discriminator}`
      ),
      loop: "disabled",
    });
    await editInteraction();
    execQueue(interaction, player, client);
  }
}
