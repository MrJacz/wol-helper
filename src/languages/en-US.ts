import { Language, KlasaClient, LanguageStore, LanguageOptions, Type } from "klasa";

export default class EnUSLanguage extends Language {

    public constructor(client: KlasaClient, store: LanguageStore, file: string | string[], core: boolean, options: LanguageOptions) {
        super(client, store, file, core, options);

        this.language = {
            COMMAND_EVAL_ERROR: (time: string, output: string, type: Type) => `\`${type} ${time}\`\n**Error:**\n${output}`,
            COMMAND_EVAL_OUTPUT: (time: string, output: string, type: Type) => `\`${type} ${time}\`\n**Output:**\n${output}`
        };
    }

    public async init() {
        await super.init();
    }
}
