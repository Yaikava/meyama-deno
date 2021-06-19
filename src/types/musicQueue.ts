import { Track, UniversityMessage } from "../../deps.ts";

export type musicQueue = {
  songs: Track[];
  textChannelId: bigint;
  npmsg?: UniversityMessage;
  requester: string[];
  loop: "disabled" | "track" | "queue";
};
export default musicQueue;
