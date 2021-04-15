import { SmtpClient } from "https://deno.land/x/smtp/mod.ts";
import dayjs from "https://cdn.skypack.dev/dayjs@1.10.4";
import { MaybeNil, nil } from "./error.ts";

export interface Config {
  auth: {
    user: string;
    pass: string;
  };
  to: string;
  commitToGit: boolean;
}

export function readConfig(path: string): MaybeNil<[Config, Error]> {
  const decoder = new TextDecoder("utf-8");
  const data = Deno.readFileSync(path);
  const str = decoder.decode(data);
  try {
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
    subject: ["一周新书推荐", dayjs().format("YYYY-MM-DD")].join(" "),
    content: "",
    html: html,
  });

  await client.close();
}
