import * as log from "https://deno.land/std@0.93.0/log/mod.ts";
import { cron } from "https://deno.land/x/deno_cron/cron.ts";
import { doJob } from "./job.ts";

// 每星期六早10点
cron("1 0 10 * * 6", async () => {
  log.info("run");
  try {
    await doJob();
    log.info("success");
  } catch (error) {
    log.error(error);
  }
});
