import { LinearKintoneSync } from "../../LinearKintoneSync";
import { getKintoneAppsFromEnv } from "../../libs";
import { updateIssueForLabel } from "../data/updateIssue";

(async () => {
  const config = getKintoneAppsFromEnv();
  const lks = new LinearKintoneSync(config);

  try {
    await lks.handle(updateIssueForLabel);
  } catch (e) {
    console.error(JSON.stringify(e, null, 2));
  }
})();
