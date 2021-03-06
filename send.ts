import { dayjs, SmtpClient } from "./dep.ts";
import { MaybeNil, nil, readFile } from "./utils.ts";

export interface Config {
  auth: {
    user: string;
    pass: string;
  };
  to: string;
  syncToRemote: boolean;
  notify: boolean;
}

export function readConfig(path: string): MaybeNil<[Config, Error]> {
  try {
    const str = readFile(path);
    return [JSON.parse(str), nil];
  } catch (error) {
    return [null, error];
  }
}

export async function sendMail(config: Config, html: string) {
  const client = new SmtpClient();

  await client.connect({
    hostname: "smtp.qq.com",
    port: 587,
    username: config.auth.user,
    password: config.auth.pass,
  });

  await client.send({
    from: config.auth.user,
    to: config.to,
    subject: `一周新书推荐 ${dayjs().format("YYYY-MM-DD")}`,
    content: "",
    html: html,
  });

  await client.close();
}
