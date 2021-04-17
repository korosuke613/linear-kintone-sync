import { LinearKintoneSync } from "../../LinearKintoneSync";
import { getKintoneAppsFromEnv } from "../../libs";
import { createIssue } from "../data/createIssue";

(async () => {
  const config = getKintoneAppsFromEnv();
  const lks = new LinearKintoneSync(config);

  try {
    await lks.handle(createIssue);
  } catch (e) {
    console.error(JSON.stringify(e, null, 2));
  }
})();
