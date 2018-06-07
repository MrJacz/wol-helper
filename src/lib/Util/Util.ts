import { post } from "snekfetch";
import SnekfetchError from "../types/SnekfetchError";

export default class Util {
    public static haste(data: string | object | Buffer, extension: string = "js") {
        return post("https://hastebin.com/documents")
            .send(data)
            .then(res => `https://hastebin.com/${(res.body as HasteBody).key}.${extension}`)
            .catch((error: SnekfetchError) => error.statusText ? error.statusText : error.message);
    }
}

type HasteBody = { key: string; };
