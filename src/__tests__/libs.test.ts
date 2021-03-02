import { getKintoneAppsFromEnv, KintoneApps } from "../libs";

process.env.KINTONE_BASE_URL = "a";
process.env.KINTONE_ISSUE_APP_ID = "b";
process.env.KINTONE_ISSUE_APP_TOKEN = "c";

test("#getKintoneAppsFromEnv", () => {
  const actual = getKintoneAppsFromEnv();
  const expected: KintoneApps = {
    baseUrl: "a",
    issue: {
      id: "b",
      token: "c",
    },
  };

  expect(actual).toEqual(expected);
});
