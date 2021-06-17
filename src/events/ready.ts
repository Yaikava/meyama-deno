import { BotClient } from "../classes/Client.ts";
import { DiscordActivityTypes } from "../../deps.ts";

export default {
  once: true,
  run(client: BotClient) {
    console.log("Ready!");
    client.fullyReady = true;
    client.musicManager.init(String(client.botId));
    function activity() {
      client.helpers.editBotStatus({
        status: "dnd",
        activities: [
          {
            name: "deno rewrite idk",
            createdAt: Date.now(),
            type: DiscordActivityTypes.Watching,
          },
        ],
      });
    }
    setInterval(activity, 180000);
    activity();
  },
};
