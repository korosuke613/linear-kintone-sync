import { getKintoneAppsFromEnv } from "../libs";
import { KintoneApps } from "../types";

process.env.KINTONE_BASE_URL = "a";
process.env.KINTONE_ISSUE_APP_ID = "b";
process.env.KINTONE_ISSUE_APP_TOKEN = "c";
process.env.KINTONE_PROJECT_APP_ID = "b";
process.env.KINTONE_PROJECT_APP_TOKEN = "c";

test("#getKintoneAppsFromEnv", () => {
  const actual = getKintoneAppsFromEnv();
  const expected: KintoneApps = {
    baseUrl: "a",
    issue: {
      id: "b",
      token: "c",
      fieldCodeOfPrimaryKey: "$id",
    },
    project: {
      id: "b",
      token: "c",
      fieldCodeOfPrimaryKey: "id",
    },
  };

  expect(actual).toEqual(expected);
});
