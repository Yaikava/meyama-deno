import {
  DiscordApplicationCommandOptionTypes,
  DiscordenoMember,
  snowflakeToBigint,
  UniversitySlashInteraction,
} from "../../deps.ts";
import { BotClient } from "../classes/Client.ts";
import { isURL } from "../utils/string.ts";
import { addPlaylistToQueue, addSoundToQueue } from "../utils/voice.ts";

export default {
  async run(
    interaction: UniversitySlashInteraction,
    member: DiscordenoMember,
    client: BotClient,
  ) {
    if (
      !interaction.guildId
    ) {
      return;
    }
    let player = client.musicManager.players.get(
      interaction.guildId.toString(),
    );
    const guild = client.guilds.get(snowflakeToBigint(interaction.guildId));
    const voiceState = guild?.voiceStates.get(member.id);
    if (!voiceState?.channelId) { //the user is not in a vc
      return interaction.send({
        type: 4,
        data: {
          content: "You are not in a voice channel!",
          flags: 64,
        },
      });
    }
    if (player && player.channel != String(voiceState.channelId)) {
      return interaction.send({
        type: 4,
        data: {
          content: "Please connect in the same voice channel as mine!",
          flags: 64,
        },
      });
    }
    if (!player) {
      player = client.musicManager.create(
        interaction.guildId.toString(),
      );
    }
    player.connect(voiceState.channelId.toString(), { selfDeaf: true });

    if (!interaction.data.options) return;
    let song = "";
    const opt = interaction.data.options.find((elt) => elt.name == "song");
    if (opt && opt.type == DiscordApplicationCommandOptionTypes.String) {
      song = opt.value;
    }
    await interaction.send({
      type: 5,
    }); //think
    const result = await client.musicManager.search(
      isURL(song) ? song : `ytsearch:${song}`,
    );
    switch (result.loadType) {
      case "TRACK_LOADED":
      case "SEARCH_RESULT": {
        return addSoundToQueue(interaction, result.tracks[0], client);
      }
      case "PLAYLIST_LOADED": {
        return addPlaylistToQueue(
          interaction,
          result.playlistInfo!.name,
          result.tracks,
          client,
        );
      }
      default:
        return await interaction.edit({
          content: "Couldn't find anything :(",
        });
    }
  },
};
