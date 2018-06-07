import { Configuration } from "klasa";

export class ClientStorageSchema extends Configuration {
    public schedules: Schedule[];
}

export type Schedule = {
    id: string;
    taskName: string;
    time: number;
    catchUp: boolean;
    repeat: string;
    data: object;
};
