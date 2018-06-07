import { Command, util, KlasaClient, CommandStore, CommandOptions, KlasaMessage } from "klasa";

export default class ExecCommand extends Command {

    public constructor(client: KlasaClient, store: CommandStore, file: string[], core: boolean, options: CommandOptions) {
        super(client, store, file, core, {
            aliases: ["execute", "sh", "shell", "bash"],
            description: "Execute commands in the terminal, use with EXTREME CAUTION.",
            guarded: true,
            permissionLevel: 10,
            usage: "<expression:string>"
        });
    }

    public async run(msg: KlasaMessage, [input]: [string]): Promise<KlasaMessage | KlasaMessage[]> {
        const result = await util.exec(input, { timeout: "timeout" in msg.flags ? Number(msg.flags.timeout) : 60000 })
            .catch(error => ({ stdout: null, stderr: error }));

        const output = result.stdout ? `**\`OUTPUT\`**${util.codeBlock("prolog", result.stdout)}` : "";
        const outerr = result.stderr ? `**\`ERROR\`**${util.codeBlock("prolog", result.stderr)}` : "";

        return msg.sendMessage([output, outerr].join("\n"));
    }

}
