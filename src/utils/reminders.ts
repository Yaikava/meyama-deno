import { BotClient } from "../classes/Client.ts";
import { db } from "../../deps.ts";
import { reminder } from "../types/reminder.ts";

async function reminders(client: BotClient) {
  async function delReminder(reminder: reminder) {
    await db.deleteReminder(reminder.ID, client);
    client.reminders = client.reminders.filter((elt) => elt.ID !== reminder.ID);
  }
  for (const reminder of client.reminders) {
    if (Number(reminder.time) < Date.now()) {
      await client.helpers.members.sendDirectMessage(BigInt(reminder.userid),{
        content: "A reminder arrived!",
        embeds: [
          {
            color: client.brandingColor,
            description: reminder.content,
          },
        ],
      }).catch(() => {});
      await delReminder(reminder);
    }
  }
}

export default (client: BotClient) => {
  reminders(client);
  setInterval(reminders, 60000, client);
};
