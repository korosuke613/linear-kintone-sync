import { Env } from "@humanwhocodes/env";
import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import {
  KintoneAppConfig,
  KintoneApps,
  KintoneAppTypes,
  RecordForParameter,
} from "./types";

export const getKintoneAppsFromEnv = (): KintoneApps => {
  const env = new Env();

  const baseUrl = env.require("KINTONE_BASE_URL");
  const issue: KintoneAppConfig = {
    id: env.require("KINTONE_ISSUE_APP_ID"),
    token: env.require("KINTONE_ISSUE_APP_TOKEN"),
    fieldCodeOfPrimaryKey: "id",
  };
  const project: KintoneAppConfig = {
    id: env.require("KINTONE_PROJECT_APP_ID"),
    token: env.require("KINTONE_PROJECT_APP_TOKEN"),
    fieldCodeOfPrimaryKey: "id",
  };

  return {
    baseUrl,
    issue,
    project,
  };
};

export const getKintoneClient = (apps: KintoneApps, type: KintoneAppTypes) => {
  let apiToken = "";
  switch (type) {
    case "issue":
      apiToken = apps.issue.token;
      break;
    case "project":
      apiToken = apps.project.token;
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

export const addRecord = async (
  client: KintoneRestAPIClient,
  apps: KintoneApps,
  appType: KintoneAppTypes,
  data: Record<string, unknown>,
  name: string
) => {
  const record = generateKintoneRecordParam(data);
  const param = {
    app: apps[appType].id,
    record: record,
  };
  console.debug(JSON.stringify(param, null, 2));

  let result = { id: "unknown", revision: "unknown" };
  await client.record.addRecord(param).then((event) => {
    console.info(`${name}\n` + event.id, event.revision);
    result = event;
  });

  return { param, result };
};
