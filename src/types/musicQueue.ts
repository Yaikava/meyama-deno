import { Track, UniversityMessage } from "../../deps.ts";

export type musicQueue = {
  songs: Track[];
  textChannelId: bigint;
  npmsg?: UniversityMessage;
  requester: bigint[];
};
export default musicQueue;
