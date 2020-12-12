export type ReadConfig = () => Promise<Config>;
export type SendMail = (text: string, config: Config) => Promise<void>;
export interface Config {
    "auth": {
        "user": string,
        "pass": string;
    },
    "to": string;
}