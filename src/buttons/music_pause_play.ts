import {
  DiscordInteractionResponseTypes,
  UniversityButtonInteraction,
  UniversityMember,
} from "../../deps.ts";
import { BotClient } from "../classes/Client.ts";
import buttonsVoiceCheck from "../utils/buttons_voicecheck.ts";

export default {
  run: (
    interaction: UniversityButtonInteraction,
    member: UniversityMember,
    client: BotClient,
  ) => {
    const check = buttonsVoiceCheck(interaction, member, client);
    if (!check) return;
    const manager = check.manager;
    manager.paused ? manager.resume() : manager.pause();
    interaction.send({
      type: DiscordInteractionResponseTypes.ChannelMessageWithSource,
      data: {
        content: "Succesfully paused/resumed the song!",
        flags: 64,
      },
    });
  },
};
