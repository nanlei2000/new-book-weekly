import Mail from "nodemailer/lib/mailer";

export type ReadConfig = () => Promise<Config>;
export type SendMail = (text: string, config: Config, transporter: Mail) => Promise<void>;
export interface Config {
    "auth": {
        "user": string,
        "pass": string;
    },
    "to": string;
}