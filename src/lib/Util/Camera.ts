import { exec as nonPromiseExec } from "child_process";
import { promisify } from "util";
import * as fs from "fs";
const exec = promisify(nonPromiseExec);

export default class Camera {
    public static async picture(options: CameraOptions) {
        const filename = Camera.generateFilename(options);
        await exec(`fswebcam -r 320x240 --fps 25 -F 50 -S 20 --no-banner ${filename}`);
        return fs.promises.readFile(filename);
    }

    private static generateFilename(options: CameraOptions): string {
        return `${options.dir}/${Date.now().toString(36)}${String.fromCharCode((1 % 26) + 97)}.${options.type}`;
    }
}

export type CameraOptions = {
    dir: string;
    type: string;
};
