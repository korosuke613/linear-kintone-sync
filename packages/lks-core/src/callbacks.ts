import { UpdateIssueWebhook, Webhook } from "linear-webhook";
import { generateKintoneRecordParam, getKintoneClient } from "./libs";
import { KintoneApps, KintoneAppTypes } from "./types";

const getKeyValue = (data: Webhook["data"], apps: KintoneApps) => {
  const keyValue = data[apps.issue.fieldCodeOfPrimaryKey] as string | number;
  if (keyValue === undefined) {
    throw new Error(
      `fieldCodeOfPrimaryKey is invalid: ${apps.issue.fieldCodeOfPrimaryKey}`
    );
  }
  return keyValue;
};

export const addIssue = async (webhook: Webhook, apps: KintoneApps) => {
  const client = getKintoneClient(apps, "issue");
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

const getRecord = async (
  webhook: Webhook,
  apps: KintoneApps,
  appType: KintoneAppTypes
) => {
  const client = getKintoneClient(apps, appType);
  const data = webhook.data;

  const issueKeyValue = getKeyValue(data, apps);

  const param = {
    app: apps[appType].id,
    query: `${apps[appType].fieldCodeOfPrimaryKey} = "${issueKeyValue}"`,
  };

  console.debug(JSON.stringify(param, null, 2));
  const { records } = await client.record.getRecords(param);
  if (records.length > 1) {
    // レコードが複数返る場合、ユニークなフィールドでないのでエラーを出す
    throw new Error(`${apps.issue.fieldCodeOfPrimaryKey} is not uniq field`);
  }

  return records[0];
};

export const updateIssue = async (
  webhook: UpdateIssueWebhook,
  apps: KintoneApps
) => {
  const client = getKintoneClient(apps, "issue");
  const data = webhook.data;

  const existsIssue = await getRecord(webhook, apps, "issue");
  if (existsIssue === undefined) {
    console.info(
      `Create Issue, ${apps.issue.fieldCodeOfPrimaryKey}: ${
        data[apps.issue.fieldCodeOfPrimaryKey]
      }`
    );
    await addIssue(webhook, apps);
  }

  const record = generateKintoneRecordParam(data);
  delete record[apps.issue.fieldCodeOfPrimaryKey];
  const updateKeyValue = getKeyValue(data, apps);

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

export const addProject = async (
  webhook: UpdateIssueWebhook,
  apps: KintoneApps
) => {
  const client = getKintoneClient(apps, "project");
  const data = webhook.data;

  const record = generateKintoneRecordParam(data);
  const param = {
    app: apps.project.id,
    record: record,
  };
  console.debug(JSON.stringify(param, null, 2));

  await client.record.addRecord(param).then((event) => {
    console.info("createProject\n" + event.id, event.revision);
  });

  return param;
};

export const updateProject = async (
  webhook: UpdateIssueWebhook,
  apps: KintoneApps
) => {
  const client = getKintoneClient(apps, "project");
  const data = webhook.data;

  const existsProject = await getRecord(webhook, apps, "project");
  if (existsProject === undefined) {
    console.info(
      `Create Issue, ${apps.issue.fieldCodeOfPrimaryKey}: ${
        data[apps.issue.fieldCodeOfPrimaryKey]
      }`
    );
    await addIssue(webhook, apps);
  }

  const record = generateKintoneRecordParam(data);
  delete record[apps.issue.fieldCodeOfPrimaryKey];
  const updateKeyValue = getKeyValue(data, apps);

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
