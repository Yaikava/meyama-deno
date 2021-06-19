import {
  BotConfig,
  Client,
  Collection,
  config,
  db,
  DiscordenoMember,
  Manager,
  snowflakeToBigint,
  UniversityButtonInteraction,
  UniversitySlashInteraction,
} from "../../deps.ts";
import { musicQueue } from "../types/musicQueue.ts";
import { command } from "../types/command.ts";
import { reminder } from "../types/reminder.ts";

export class BotClient extends Client {
  fullyReady: boolean;
  brandingColor: number;
  musicManager: Manager;
  //deno-lint-ignore no-explicit-any
  dbcache: Collection<bigint, any>;
  slashcommands: Collection<
    string,
    {
      run(
        interaction: UniversitySlashInteraction,
        member: DiscordenoMember,
        client: BotClient,
      ): void;
    }
  >;
  buttons: Collection<
    string,
    {
      run(
        interaction: UniversityButtonInteraction,
        member: DiscordenoMember,
        client: BotClient,
      ): void;
    }
  >;
  musicQueue: Collection<string, musicQueue>;
  commands: Collection<string, command>;
  aliases: Collection<string, string>;
  reminders: reminder[];

  constructor(botConfig: Omit<BotConfig, "eventHandlers">) {
    super(botConfig);

    //creating collections
    this.slashcommands = new Collection();
    this.musicQueue = new Collection();
    this.buttons = new Collection();
    this.aliases = new Collection();
    this.reminders = [];
    this.commands = new Collection();
    this.dbcache = new Collection();
    this.brandingColor = 3092790;

    //loading stuff
    this.loadEvents();
    this.loadSlashCommands();
    this.loadButtons();
    this.loadCommands();
    this.loadReminders();

    //music
    this.musicManager = new Manager(config.nodes, {
      send: (id, payload) => {
        const shardId = this.guilds.get(snowflakeToBigint(id))?.shardId;
        if (shardId === undefined) return;
        this.gateway.get(shardId)?.sendShardMessage(payload);
      },
    });
    this.musicManager.on("socketReady", (socket) => {
      console.log(`Socket ${socket.id} ready`);
    });

    this.fullyReady = false;

    this.connect();
  }

  async loadEvents() {
    console.log("Loading events...");
    for (const event of Deno.readDirSync("./src/events")) {
      const name = event.name.slice(0, -3);
      let e = await import(`../events/${event.name}`);
      e = e.default;
      if (e.once) {
        this.once(name, (...args) => {
          e.run(...args, this);
        });
      } else {
        this.on(name, (...args) => {
          e.run(...args, this);
        });
      }
      console.log(`Event ${name} loaded`);
    }
    console.log("All events have been loaded!");
  }

  async loadSlashCommands() {
    console.log("Loading slash commands...");
    for (const command of Deno.readDirSync("./src/slashcommands")) {
      const name = command.name.slice(0, -3);
      let e = await import(`../slashcommands/${command.name}`);
      e = e.default;
      this.slashcommands.set(name, e);
      console.log(`Slash command ${name} loaded`);
    }
    console.log("All slash commands have been loaded!");
  }

  async loadButtons() {
    console.log("Loading buttons...");
    for (const button of Deno.readDirSync("./src/buttons")) {
      const name = button.name.slice(0, -3);
      let e = await import(`../buttons/${button.name}`);
      e = e.default;
      this.buttons.set(name, e);
      console.log(`Button ${name} loaded!`);
    }
    console.log("All buttons have been loaded!");
  }

  async loadCommands() {
    console.log("Loading commands...");
    for (const command of Deno.readDirSync("./src/commands")) {
      const name = command.name.slice(0, -3);
      const e: command = (await import(`../commands/${command.name}`)).default;
      this.commands.set(name, e);
      if (e.aliases[0]) {
        e.aliases.forEach((alias) => {
          this.aliases.set(alias, name);
        });
      }
      console.log(`Command ${name} loaded`);
    }
    console.log("All commands have been loaded!");
  }

  async loadReminders() {
    console.log("Caching reminders...");
    const reminders = await db.getReminders();
    this.reminders = reminders as reminder[];
    console.log("Reminders cached!");
  }
}
