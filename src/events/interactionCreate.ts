import {
  DiscordenoMember,
  UniversityButtonInteraction,
  UniversitySlashInteraction,
} from "../../deps.ts";
import { BotClient } from "../classes/Client.ts";

export default {
  once: false,
  run(
    interaction: UniversitySlashInteraction | UniversityButtonInteraction,
    member: DiscordenoMember,
    client: BotClient,
  ) {
    if (client.fullyReady == false) return;
    if (interaction instanceof UniversitySlashInteraction) {
      if (!interaction.data.name) return;
      const slashcommand = client.slashcommands.get(interaction.data.name);
      if (!slashcommand) return;
      slashcommand.run(interaction, member, client);
    } else if (interaction instanceof UniversityButtonInteraction) {
      const button = client.buttons.get(interaction.data.customId);
      if (!button) return;
      button.run(interaction, member, client);
    }
  },
};
