import { Command, KlasaClient, CommandStore, CommandOptions, KlasaMessage, util, Stopwatch, Type } from "klasa";
import { inspect } from "util";
import WolUtil from "../../lib/Util/Util";

export default class EvalCommand extends Command {
    public depth: number;
    public showHidden: boolean;

    public constructor(client: KlasaClient, store: CommandStore, file: string[], core: boolean, options: CommandOptions) {
        super(client, store, file, core, {
            aliases: ["ev"],
            permissionLevel: 10,
            guarded: true,
            description: msg => msg.language.get("COMMAND_EVAL_DESCRIPTION"),
            extendedHelp: msg => msg.language.get("COMMAND_EVAL_EXTENDEDHELP"),
            usage: "<expression:str>"
        });

        this.depth = 0;
        this.showHidden = true;
    }

    public async run(msg: KlasaMessage, [code]: [string]): Promise<KlasaMessage | KlasaMessage[]> {
        const { success, result, time, type } = await this.eval(msg, code);
        const output = msg.language.get(success ? "COMMAND_EVAL_OUTPUT" : "COMMAND_EVAL_ERROR",
            time, util.codeBlock("js", result), type);
        const silent = "silent" in msg.flags;

        // Handle errors
        if (!success) {
            if (!silent) return msg.sendMessage(output);
        }

        if (silent) return null;

        // Handle too-long-messages
        if (output.length > 2000) {
            return msg.sendMessage(`\`${type} ${time}\`\n**Eval output was too long so here you go:** ${await WolUtil.haste(result)}`);
        }

        // If it's a message that can be sent correctly, send it
        return msg.sendMessage(output);
    }

    // Eval the input
    public async eval(msg: KlasaMessage, code: string): Promise<evalResults> {
        /* tslint:disable */
        const message = msg;
        const client = this.client;
        const guild = msg.guild;
        const gateways = this.client.gateways;
        /* tslint:enable */

        const stopwatch = new Stopwatch();
        let success, syncTime, asyncTime, result;
        let thenable = false;
        let type;
        try {
            if (msg.flags.async) code = `(async () => {\n${code}\n})();`;
            result = eval(code);
            syncTime = stopwatch.toString();
            type = new Type(result);
            if (util.isThenable(result)) {
                thenable = true;
                stopwatch.restart();
                result = await result;
                asyncTime = stopwatch.toString();
            }
            success = true;
        } catch (error) {
            if (!type) type = new Type(error);
            if (!syncTime) syncTime = stopwatch.toString();
            if (thenable && !asyncTime) asyncTime = stopwatch.toString();
            result = error;
            success = false;
        }

        stopwatch.stop();
        if (typeof result !== "string") {
            result = result instanceof Error ? result.stack : inspect(result, {
                depth: msg.flags.depth ? Number(msg.flags.depth) : this.depth,
                showHidden: msg.flags.showHidden ? Boolean(msg.flags.showHidden) : this.showHidden,
                showProxy: true
            });
        }
        return { success, type, time: this.formatTime(syncTime, asyncTime), result: util.clean(result) };
    }

    public formatTime(syncTime: string, asyncTime: string): string {
        return asyncTime ? `⏱ ${asyncTime}<${syncTime}>` : `⏱ ${syncTime}`;
    }

}

type evalResults = {
    success: boolean;
    type: Type;
    time: string;
    result: string;
};
