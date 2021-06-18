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
    const manager = check.manager, track = check.queue.songs[0].info;
    await interaction.send({
      type: DiscordInteractionResponseTypes.ChannelMessageWithSource,
      data: {
        content: `Song **${track.title}** skipped by ${member.tag}`,
      },
    });
    manager.stop();
  },
};
