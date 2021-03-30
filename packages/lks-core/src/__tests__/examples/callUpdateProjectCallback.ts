import { LinearKintoneSync } from "../../LinearKintoneSync";
import { getKintoneAppsFromEnv } from "../../libs";
import { updateProject } from "../data/updateProject";

(async () => {
  const config = getKintoneAppsFromEnv();
  const lks = new LinearKintoneSync(config);

  try {
    await lks.handle(updateProject);
  } catch (e) {
    console.error(JSON.stringify(e, null, 2));
  }
})();
