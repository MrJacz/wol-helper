import { Client } from "klasa";
import { WolConfig } from "./lib/types/WolConfig";

const config: WolConfig = require("../config.json");

new Client({
    prefix: config.prefix,
    regexPrefix: /^Wol,/i,
    commandEditing: true,
    commandLogging: true,
    messageCacheMaxSize: 20,
    messageCacheLifetime: 60 * 10,
    messageSweepInterval: 3600,
    console: { useColor: true },
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
    presence: { activity: { name: "Jacz's home", type: "WATCHING" } },
    pieceDefaults: { commands: { deletable: true, promptLimit: 3, promptTime: 10000 } }
}).login(config.token);
