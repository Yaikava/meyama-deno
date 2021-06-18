import {
  DiscordInteractionResponseTypes,
  Player,
  UniversityButtonInteraction,
  UniversityMember,
} from "../../deps.ts";
import { BotClient } from "../classes/Client.ts";
import { musicQueue } from "../types/musicQueue.ts";

export default (
  interaction: UniversityButtonInteraction,
  member: UniversityMember,
  client: BotClient,
): { manager: Player; queue: musicQueue } | undefined => {
  if (!interaction.guildId) return;
  const manager = client.musicManager.players.get(interaction.guildId);
  const queue = client.musicQueue.get(interaction.guildId);
  if (!manager || !queue) return;
  if (queue.requester[0] !== member.id) {
    interaction.send({
      type: DiscordInteractionResponseTypes.ChannelMessageWithSource,
      data: {
        content:
          "You need to be the requester of the current song in order to do this!",
        flags: 64,
      },
    });
    return;
  }
  return {
    manager,
    queue,
  };
};
