import { UniversityButtonInteraction, UniversityMember } from "../../deps.ts";
import { BotClient } from "../classes/Client.ts";
import buttonsVoiceCheck from "../utils/buttons_voicecheck.ts";
import npmsg from "../utils/npmsg.ts";

export default {
  run: async (
    interaction: UniversityButtonInteraction,
    member: UniversityMember,
    client: BotClient,
  ) => {
    const check = buttonsVoiceCheck(interaction, member, client);
    if (!check) return;
    const manager = check.manager;
    await manager.setVolume(100);
    await npmsg(interaction, client);
  },
};
