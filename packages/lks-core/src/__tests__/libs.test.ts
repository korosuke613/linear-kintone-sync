import { getKintoneAppsFromEnv } from "../libs";
import { KintoneApps } from "../types";

process.env.KINTONE_BASE_URL = "a";
process.env.KINTONE_ISSUE_APP_ID = "b";
process.env.KINTONE_ISSUE_APP_TOKEN = "c";
process.env.KINTONE_PROJECT_APP_ID = "b";
process.env.KINTONE_PROJECT_APP_TOKEN = "c";
process.env.KINTONE_STATE_APP_ID = "b";
process.env.KINTONE_STATE_APP_TOKEN = "c";
process.env.KINTONE_COMMENT_APP_ID = "d";
process.env.KINTONE_COMMENT_APP_TOKEN = "e";

test("#getKintoneAppsFromEnv", () => {
  const actual = getKintoneAppsFromEnv();
  const expected: KintoneApps = {
    baseUrl: "a",
    issue: {
      id: "b",
      token: ["c", "c", "c"],
      fieldCodeOfPrimaryKey: "$id",
    },
    project: {
      id: "b",
      token: "c",
      fieldCodeOfPrimaryKey: "id",
    },
    comment: {
      id: "d",
      token: ["e", "c"],
      fieldCodeOfPrimaryKey: "id",
    },
  };

  expect(actual).toEqual(expected);
});
