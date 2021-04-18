import { cron, log } from "./dep.ts";
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
