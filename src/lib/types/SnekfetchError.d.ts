export default class SnekfetchError extends Error {
    public readonly body?: Buffer | object | string;
    public raw: Buffer;
    public ok: boolean;
    public headers: { [key: string]: any };
    public statusCode?: number;
    public statusText?: string;
}