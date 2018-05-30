import WOL from "./wol";
import { Client, ClientOptions } from "discord.js";

class WolClient extends Client {

    public wol: WOL;

    public constructor(options?: ClientOptions) {
        super(options);

        this.wol = new WOL({
            mac: "f0:79:59:8f:82:89"
        });

        this.on("ready", () => console.log(`${this.user.username} is ready.`));
        this.on("error", console.error);
        this.on("warn", console.warn);
    }
}
