import { Task, Colors, KlasaClient, TaskStore, TaskOptions } from "klasa";
import { Util } from "discord.js";
import { ClientStorageSchema } from "../lib/types/ClientStorageSchema";
import Channel from "../lib/types/Channel";

// THRESHOLD equals to 30 minutes in milliseconds:
//     - 1000 milliseconds = 1 second
//     - 60 seconds        = 1 minute
//     - 30 minutes
const THRESHOLD = 1000 * 60 * 30,
    EPOCH = 1420070400000,
    EMPTY = "0000100000000000000000";

export default class MemorySweeper extends Task {

    public header: string;
    public green: Colors;
    public lightYellow: Colors;
    public lightRed: Colors;
    public grey: Colors;

    public constructor(client: KlasaClient, store: TaskStore, file: string, core: boolean, options?: TaskOptions) {
        super(client, store, file, core, options);

        // Header
        this.header = new Colors({ text: "lightblue" }).format("[CACHE CLEANUP]");
        // Colors for numbers
        this.green = new Colors({ text: "green" });
        this.lightYellow = new Colors({ text: "lightyellow" });
        this.lightRed = new Colors({ text: "lightred" });
        this.grey = new Colors({ text: "grey" });
    }

    public async run(): Promise<void> {
        const OLD_SNOWFLAKE = Util.binaryToID(((Date.now() - THRESHOLD) - EPOCH).toString(2).padStart(42, "0") + EMPTY);
        let presences = 0, guildMembers = 0, emojis = 0, lastMessages = 0, users = 0;

        // Per-Guild sweeper
        for (const guild of this.client.guilds.values()) {
            // Clear presences
            presences += guild.presences.size;
            guild.presences.clear();

            // Clear members that haven't send a message in the last 30 minutes
            const { me } = guild;
            for (const [id, member] of guild.members) {
                if (member === me) continue;
                if (member.lastMessageID && member.lastMessageID > OLD_SNOWFLAKE) continue;
                guildMembers++;
                guild.members.delete(id);
            }

            // Clear emojis
            emojis += guild.emojis.size;
            guild.emojis.clear();
        }

        // Per-Channel sweeper
        for (const channel of this.client.channels.values()) {
            if ((channel  as Channel).lastMessageID) {
                (channel  as Channel).lastMessageID = null;
                lastMessages++;
            }
        }

        // Per-User sweeper
        for (const user of this.client.users.values()) {
            if (user.lastMessageID && user.lastMessageID > OLD_SNOWFLAKE) continue;
            this.client.users.delete(user.id);
            this.client.gateways.users.cache.delete(user.id);
            users++;
        }

        // Emit a log
        this.client.console.log(`${this.header} ${
            this.setColor(presences)} ${this.formatType("[Presence]s")} | ${
            this.setColor(guildMembers)} ${this.formatType("[GuildMember]s")} | ${
            this.setColor(users)} ${this.formatType("[User]s")} | ${
            this.setColor(emojis)} ${this.formatType("[Emoji]s")} | ${
            this.setColor(lastMessages)} ${this.formatType("[Last Message]s.")}`);
    }

    public setColor(number: number): string {
        const text = String(number).padStart(5, " ");
        // Light Red color
        if (number > 1000) return this.lightRed.format(text);
        // Light Yellow color
        if (number > 100) return this.lightYellow.format(text);
        // Green color
        return this.green.format(text);
    }

    public formatType(type: string): string {
        return this.grey.format(type);
    }

    public async init(): Promise<void> {
        if (!(this.client.configs as ClientStorageSchema).schedules.some(task => task.taskName === "memorySweeper")) {
            await this.client.schedule.create("memorySweeper", "*/10 * * * *", {});
        }
    }

}
