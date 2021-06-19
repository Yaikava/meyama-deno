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
    const queue = check.queue;
    if (queue.loop == "disabled") {
      queue.loop = "track";
    } else if (queue.loop == "track") {
      queue.loop = "queue";
    } else {
      queue.loop = "disabled";
    }
    await npmsg(interaction, client);
  },
};
