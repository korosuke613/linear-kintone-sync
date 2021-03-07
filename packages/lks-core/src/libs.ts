import { Env } from "@humanwhocodes/env";
import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { KintoneAppConfig, KintoneApps, RecordForParameter } from "./types";

export const getKintoneAppsFromEnv = (): KintoneApps => {
  const env = new Env();

  const baseUrl = env.require("KINTONE_BASE_URL");
  const issue: KintoneAppConfig = {
    id: env.require("KINTONE_ISSUE_APP_ID"),
    token: env.require("KINTONE_ISSUE_APP_TOKEN"),
    fieldCodeOfPrimaryKey: "id",
  };

  return {
    baseUrl,
    issue,
  };
};

export const getKintoneClient = (apps: KintoneApps, type: "Issue") => {
  let apiToken = "";
  switch (type) {
    case "Issue":
      apiToken = apps.issue.token;
  }

  return new KintoneRestAPIClient({
    baseUrl: apps.baseUrl,
    auth: {
      apiToken,
    },
  });
};

export const generateKintoneRecordParam = (data: Record<string, any>) => {
  const record: RecordForParameter = {};

  for (const [key, value] of Object.entries(data)) {
    const stringValue = value.toString();
    if (typeof value === "object" && stringValue === "[object Object]") {
      continue;
    }
    record[key] = {
      value: stringValue,
    };
  }
  return record;
};
