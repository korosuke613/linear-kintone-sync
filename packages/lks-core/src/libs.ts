import { Env } from "@humanwhocodes/env";
import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import {
  KintoneAppConfig,
  KintoneApps,
  KintoneAppTypes,
  RecordForParameter,
} from "./types";
import {
  CreateIssueWebhook,
  UpdateIssueWebhook,
  Webhook,
} from "linear-webhook";
import { addProjectByRecord } from "./callbacks";

export const getKintoneAppsFromEnv = (): KintoneApps => {
  const env = new Env();

  const baseUrl = env.require("KINTONE_BASE_URL");
  const issue: KintoneAppConfig = {
    id: env.require("KINTONE_ISSUE_APP_ID"),
    token: [
      env.require("KINTONE_ISSUE_APP_TOKEN"),
      env.require("KINTONE_PROJECT_APP_TOKEN"),
      env.require("KINTONE_STATE_APP_TOKEN"),
      env.require("KINTONE_ISSUE_LABEL_APP_TOKEN"),
    ],
    fieldCodeOfPrimaryKey: "$id",
  };
  const project: KintoneAppConfig = {
    id: env.require("KINTONE_PROJECT_APP_ID"),
    token: env.require("KINTONE_PROJECT_APP_TOKEN"),
    fieldCodeOfPrimaryKey: "id",
  };
  const comment: KintoneAppConfig = {
    id: env.require("KINTONE_COMMENT_APP_ID"),
    token: [
      env.require("KINTONE_COMMENT_APP_TOKEN"),
      env.require("KINTONE_ISSUE_APP_TOKEN"),
    ],
    fieldCodeOfPrimaryKey: "id",
  };
  const issueLabel: KintoneAppConfig = {
    id: env.require("KINTONE_ISSUE_LABEL_APP_ID"),
    token: [env.require("KINTONE_ISSUE_LABEL_APP_TOKEN")],
    fieldCodeOfPrimaryKey: "id",
  };

  return {
    baseUrl,
    issue,
    project,
    comment,
    issueLabel,
  };
};

export const getKintoneClient = (apps: KintoneApps, type: KintoneAppTypes) => {
  let apiToken: string | string[];
  switch (type) {
    case "issue":
      apiToken = apps.issue.token;
      break;
    case "project":
      apiToken = apps.project.token;
      break;
    case "comment":
      apiToken = apps.comment.token;
      break;
    case "issueLabel":
      apiToken = apps.issueLabel.token;
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

    // labelIdsの場合のみデータ構造が違うので変換する
    // テーブルのフィールドコードを`LabelIdsTable`とする
    if (Array.isArray(value) && value.length !== 0 && key === "labelIds") {
      const tableValue = convertLabelIdsToTable(value);
      record.LabelIdsTable = { value: tableValue };
      continue;
    }

    record[key] = {
      value: stringValue,
    };
  }
  return record;
};

// labelIdsをkintoneのテーブル形式に直す
const convertLabelIdsToTable = (labelIds: string[]) => {
  const tableValue: Array<{
    value: {
      labelId: {
        value: string;
      };
    };
  }> = labelIds.map((labelId) => {
    return {
      value: {
        labelId: {
          value: labelId,
        },
      },
    };
  });

  return tableValue;
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
    console.debug(`${name}\n` + event.id, event.revision);
    result = event;
  });

  return { param, result };
};

export async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export const getKeyValue = (
  data: Webhook["data"],
  apps: KintoneApps,
  appType: KintoneAppTypes
) => {
  if (appType === "issue") {
    // Issueの場合、kintoneレコードIDとIssue numberを一致させたいので number を返す
    return data.number as string;
  }

  const keyValue = data[apps[appType].fieldCodeOfPrimaryKey] as string | number;
  if (keyValue === undefined) {
    throw new Error(
      `fieldCodeOfPrimaryKey is invalid: ${apps[appType].fieldCodeOfPrimaryKey}`
    );
  }
  return keyValue;
};

export const addProjectIfProjectNotFound = async (
  apps: KintoneApps,
  data: { id: string; name: string }
) => {
  const projectRecord = await getRecordById(apps, "project", data.id);
  if (projectRecord === undefined) {
    await addProjectByRecord(apps, data);
  }
};

export const getRecord = async (
  webhook: Webhook,
  apps: KintoneApps,
  appType: KintoneAppTypes
) => {
  const client = getKintoneClient(apps, appType);
  const data = webhook.data;

  const keyValue = getKeyValue(data, apps, appType);

  const param = {
    app: apps[appType].id,
    query: `${apps[appType].fieldCodeOfPrimaryKey} = "${keyValue}"`,
  };

  console.debug(JSON.stringify(param, null, 2));
  const { records } = await client.record.getRecords(param);
  console.debug(JSON.stringify(records, null, 2));

  if (records.length > 1) {
    // レコードが複数返る場合、ユニークなフィールドでないのでエラーを出す
    throw new Error(`${apps.issue.fieldCodeOfPrimaryKey} is not uniq field`);
  }

  return records[0];
};

export const getRecordById = async (
  apps: KintoneApps,
  appType: KintoneAppTypes,
  id: string
) => {
  const client = getKintoneClient(apps, appType);

  const param = {
    app: apps[appType].id,
    query: `${apps[appType].fieldCodeOfPrimaryKey} = "${id}"`,
  };

  console.debug(JSON.stringify(param, null, 2));
  const { records } = await client.record.getRecords(param);
  if (records.length > 1) {
    // レコードが複数返る場合、ユニークなフィールドでないのでエラーを出す
    throw new Error(`${apps[appType].fieldCodeOfPrimaryKey} is not uniq field`);
  }

  return records[0];
};

export const addIssue = async (
  webhook: CreateIssueWebhook | UpdateIssueWebhook,
  apps: KintoneApps
) => {
  const client = getKintoneClient(apps, "issue");

  const param = {
    app: apps.issue.id,
    record: {
      id: {
        value: webhook.data.id,
      },
    },
  };
  console.debug(JSON.stringify(param, null, 2));

  await client.record.addRecord(param).then((event) => {
    console.info("createIssue\n" + event.id, event.revision);
  });

  return param;
};
