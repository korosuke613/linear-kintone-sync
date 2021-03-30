import { LinearKintoneSync } from "../../LinearKintoneSync";
import { getKintoneAppsFromEnv } from "../../libs";
import { createProject } from "../data/createProject";

(async () => {
  const config = getKintoneAppsFromEnv();
  const lks = new LinearKintoneSync(config);

  try {
    await lks.handle(createProject);
  } catch (e) {
    console.error(JSON.stringify(e, null, 2));
  }
})();
