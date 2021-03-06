import {
  DiscordInteractionResponseTypes,
  UniversityButtonInteraction,
  UniversityMember,
} from "../../deps.ts";
import { BotClient } from "../classes/Client.ts";
import buttonsVoiceCheck from "../utils/buttons_voicecheck.ts";

export default {
  run: async (
    interaction: UniversityButtonInteraction,
    member: UniversityMember,
    client: BotClient,
  ) => {
    const check = buttonsVoiceCheck(interaction, member, client);
    if (!check) return;
    const queue = check.queue, manager = check.manager;
    queue.songs = [];
    await interaction.send({
      type: DiscordInteractionResponseTypes.ChannelMessageWithSource,
      data: {
        content: `Queue stopped by ${member.tag}`,
      },
    });
    manager.stop();
  },
};
