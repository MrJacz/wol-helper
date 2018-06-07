import { Command, KlasaClient, CommandStore, CommandOptions, KlasaMessage } from "klasa";
import WOL from "../../lib/Util/wol";
import { WolConfig } from "../../lib/types/WolConfig";

const config: WolConfig = require("../../../config.json");

export default class WolCommand extends Command {
    public wol: WOL;

    public constructor(client: KlasaClient, store: CommandStore, file: string[], core: boolean, options: CommandOptions) {
        super(client, store, file, core, {
            aliases: ["wol"],
            description: "Remotely turns on specified MAC address from config",
            guarded: true,
            permissionLevel: 10
        });

        this.wol = new WOL({ mac: config.mac });
    }

    public async run(msg: KlasaMessage): Promise<KlasaMessage | KlasaMessage[]> {
        const result: string = await this.wol.wake()
            .then(() => "Your PC has successfully been turned on via WOL")
            .catch((error: Error) => `Error while turning on pc: \`${error.message}\``);

        return msg.sendMessage(result);
    }

}
