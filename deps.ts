export * from "../university/mod.ts";
export { Manager, Player } from "https://deno.land/x/lavadeno@2.1.1/mod.ts";
export type { Track } from "https://deno.land/x/lavadeno@2.1.1/mod.ts";
export const config = JSON.parse(Deno.readTextFileSync("./config.json"));
