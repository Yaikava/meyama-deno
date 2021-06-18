import {command} from "../types/command.ts"
export const com: command = {
    aliases: ["p"],
    owner: true,
    run (message,_client,args){
      try {
        const evaal = eval(args.join(" "));
        message.reply("```ts\n" + String(evaal) + "```", false);
      } catch (e) {
        message.reply("```ts\n" + e + "```", false);
      }
    }
}
export default com