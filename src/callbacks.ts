import { CreateIssueWebhook, UpdateIssueWebhook } from "linear-webhook";
import { generateKintoneRecordParam, getKintoneClient } from "./libs";
import { KintoneApps } from "./types";

export const addIssue = async (
  webhook: CreateIssueWebhook,
  apps: KintoneApps
) => {
  const client = getKintoneClient(apps, "Issue");
  const data = webhook.data;

  const record = generateKintoneRecordParam(data);
  const param = {
    app: apps.issue.id,
    record: record,
  };
  console.debug(JSON.stringify(param, null, 2));

  await client.record.addRecord(param).then((event) => {
    console.info("createIssue\n" + event.id, event.revision);
  });

  return param;
};

export const updateIssue = async (
  webhook: UpdateIssueWebhook,
  apps: KintoneApps
) => {
  const client = getKintoneClient(apps, "Issue");
  const data = webhook.data;

  const record = generateKintoneRecordParam(data);
  delete record[apps.issue.fieldCodeOfPrimaryKey];
  const updateKeyValue = data[apps.issue.fieldCodeOfPrimaryKey] as
    | string
    | number;
  if (data === undefined) {
    throw new Error(
      `fieldCode is invalid. ${apps.issue.fieldCodeOfPrimaryKey}`
    );
  }
  const param = {
    app: apps.issue.id,
    updateKey: {
      field: apps.issue.fieldCodeOfPrimaryKey,
      value: updateKeyValue,
    },
    record: record,
  };
  console.debug(JSON.stringify(param, null, 2));

  await client.record.updateRecord(param).then((event) => {
    console.info("updateIssue\n", event.revision);
  });

  return param;
};
