import { Command, KlasaClient, CommandStore, CommandOptions, KlasaMessage } from "klasa";
import Camera from "../../lib/Util/Camera";

export default class WolCommand extends Command {
    public constructor(client: KlasaClient, store: CommandStore, file: string[], core: boolean, options: CommandOptions) {
        super(client, store, file, core, {
            description: "Takes a picture",
            guarded: true,
            permissionLevel: 10
        });
    }

    public async run(msg: KlasaMessage): Promise<KlasaMessage | KlasaMessage[]> {
        const picture = await Camera.picture({ dir: `${process.cwd()}/pictures`, type: "jpg" });

        return msg.send({ files: [{ attachment: picture, name: "picture.jpg" }] });
    }

}
