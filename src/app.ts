import WOL from "./wol";
import { Client, ClientOptions, Message } from "discord.js";

const config: WolConfig = require("../config.json");

class WolClient extends Client {

    public wol: WOL;

    public constructor(options?: ClientOptions) {
        super(options);

        this.wol = new WOL({ mac: config.mac });

        this.on("ready", () => console.log(`${this.user.username} is ready.`));
        this.on("message", this.onMessage.bind(this));
        this.on("error", console.error);
        this.on("warn", console.warn);
    }

    public onMessage(msg: Message) {
        if (msg.author.id !== config.ownerID) return;
        if (!msg.content.startsWith(config.prefix)) return;
        const args = msg.content.slice(config.prefix.length).trim().split(/ +/g);
        const cmd = args.shift().toLowerCase();

        if (cmd === "wol" || cmd === "wakeonlan") return this.wakeonlan(msg);
    }

    private async wakeonlan(msg: Message) {
        const result: string = await this.wol.wake()
            .then(() => "Your PC has successfully been turned on via WOL")
            .catch((error: Error) => `Error while turning on pc: \`${error.message}\``);

        return msg.channel.send(result);
    }
}

new WolClient({
    messageCacheMaxSize: 20,
    messageCacheLifetime: 60 * 10,
    messageSweepInterval: 3600,
    disabledEvents: [
        "GUILD_SYNC",
        "GUILD_BAN_ADD",
        "GUILD_BAN_REMOVE",
        "CHANNEL_PINS_UPDATE",
        "MESSAGE_DELETE_BULK",
        "MESSAGE_REACTION_ADD",
        "MESSAGE_REACTION_REMOVE",
        "MESSAGE_REACTION_REMOVE_ALL",
        "USER_NOTE_UPDATE",
        "USER_SETTINGS_UPDATE",
        "VOICE_STATE_UPDATE",
        "TYPING_START",
        "VOICE_SERVER_UPDATE",
        "RELATIONSHIP_ADD",
        "RELATIONSHIP_REMOVE"
    ],
    presence: { activity: { name: "Jacz's home", type: "WATCHING" } }
}).login(config.token);

type WolConfig = {
    token: string;
    ownerID: string;
    prefix: string;
    mac: string;
};
