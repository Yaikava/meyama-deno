import { BotClient } from "../classes/Client.ts";
import { snakelize, VoiceServerUpdate, VoiceState } from "../../deps.ts";

export default {
  once: false,
  //deno-lint-ignore no-explicit-any
  run(data: any, client: BotClient) {
    if (data.t === "VOICE_SERVER_UPDATE") {
      client.musicManager.serverUpdate(snakelize(data.d as VoiceServerUpdate));
    } else if (data.t === "VOICE_STATE_UPDATE") {
      client.musicManager.stateUpdate(snakelize(data.d as VoiceState));
    }
  },
};
