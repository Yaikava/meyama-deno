export * from "../university/mod.ts";
export { Manager, Player } from "https://deno.land/x/lavadeno@2.1.1/mod.ts";
export type { Track } from "https://deno.land/x/lavadeno@2.1.1/mod.ts";
export const config = JSON.parse(Deno.readTextFileSync("./config.json"));
export * as db from "./src/utils/db.ts";
export { ms } from "https://deno.land/x/ms@v0.1.0/ms.ts";
