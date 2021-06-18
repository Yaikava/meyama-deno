import { config } from "../../deps.ts";
import { BotClient } from "../classes/Client.ts";
import { reminder } from "../types/reminder.ts";

export async function getGuild(id: bigint) {
  const req = await fetch("http://localhost:55525/guilds/" + String(id), {
    method: "GET",
    headers: {
      Authorization: config.superSecretAuthKeyForDB,
      "Content-Type": "application/json",
    },
  });
  const res = await req.json();
  return res.data;
}

/**
 * Sets a property in the db
 * @param guildId the guild ID
 * @param property The path to the property (idk just try shit and it will probably work)
 * @param value the value to set
 * @returns boolean if it succeeded or not
 */

export async function setProperty(
  guildId: bigint,
  property: string, //deno-lint-ignore no-explicit-any
  value: any,
  client: BotClient,
) {
  const req = await fetch("http://localhost:55525/guilds/" + String(guildId), {
    method: "POST",
    headers: {
      Authorization: config.superSecretAuthKeyForDB,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      property: property,
      value: value,
    }),
  });
  const dbcache = client.dbcache.get(guildId);
  dbcache;
  eval(`dbcache.${property} = ${JSON.stringify(value)}`);
  return req.ok;
}

export async function getReminders(): Promise<reminder[]> {
  const req = await fetch("http://localhost:55525/reminders", {
    method: "GET",
    headers: {
      Authorization: config.superSecretAuthKeyForDB,
      "Content-Type": "application/json",
    },
  });
  const res = await req.json();
  return res as reminder[];
}

export async function createReminder(
  id: string,
  userid: string,
  content: string,
  time: string,
  client: BotClient,
) {
  const req = await fetch("http://localhost:55525/reminders/" + id, {
    method: "POST",
    headers: {
      Authorization: config.superSecretAuthKeyForDB,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ID: id,
      userid: userid,
      content: content,
      time: time,
    }),
  });
  client.reminders.push({
    ID: id,
    userid: userid,
    content: content,
    time: time,
  } as reminder);
  return req.ok;
}

export async function deleteReminder(
  id: string,
  client: BotClient,
) {
  const req = await fetch("http://localhost:55525/reminders/" + id, {
    method: "DELETE",
    headers: {
      Authorization: config.superSecretAuthKeyForDB,
      "Content-Type": "application/json",
    },
  });
  client.reminders = client.reminders.filter((c) => c.ID !== id);
  return req.ok;
}
