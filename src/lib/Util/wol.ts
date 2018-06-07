import { isIPv6 } from "net";
import { Socket, createSocket } from "dgram";
import { resolve } from "path";

const MAC_LENGTH: number = 0x06;
const MAC_REPEAT: number = 0x16;
const PACKET_HEADER: number = 0x06;
const MAC_REGEX: RegExp = /[0-9a-fA-F]{2}/g;

export default class WOL {

    public options: WolOptions;

    public constructor(options?: WolOptions) {

        this.options = {
            ...options,
            ip: "255.255.255.255",
            port: 9,
            mac: null
        };
    }

    public wake(mac: string = this.options.mac): Promise<number> {
        return new Promise((res, rej) => {
            const magicPacket: Buffer = WOL.createMagicPacket(mac);
            const socket: Socket = createSocket(isIPv6(this.options.ip) ? "udp6" : "udp4");
            socket.on("error", (error: Error) => {
                socket.close();
                return rej(error);
            });
            socket.on("listening", () => socket.setBroadcast(true));
            return socket.send(magicPacket, this.options.port, this.options.ip, (error: Error, bytes: number) => {
                if (error) rej(error);
                else res(bytes);
            });
        });
    }

    public static createMagicPacket(mac: string): Buffer {
        const parts: RegExpMatchArray = mac.match(MAC_REGEX);
        if (!parts || parts.length !== MAC_LENGTH) throw new Error(`malformed MAC address '${mac}'`);
        let buffer: Buffer = Buffer.alloc(PACKET_HEADER);
        const bufMac: Buffer = Buffer.from(parts.map(p => parseInt(p, 16)));
        buffer.fill(0xff);
        for (let i = 0; i < MAC_REPEAT; i++) buffer = Buffer.concat([buffer, bufMac]);
        return buffer;
    }
}

type WolOptions = {
    ip?: string;
    port?: number;
    mac?: string;
};
