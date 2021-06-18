import { UniversityMessage } from "../../deps.ts";
import { BotClient } from "../classes/Client.ts";

export type command = {
  aliases: string[];
  owner: boolean;
  run(message: UniversityMessage, client: BotClient, args: string[]): void;
};
