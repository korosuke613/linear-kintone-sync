import { UpdateIssueWebhook, Webhook } from "linear-webhook";
import {
  addRecord,
  generateKintoneRecordParam,
  getKintoneClient,
} from "./libs";
import { KintoneApps, KintoneAppTypes } from "./types";

const getKeyValue = (
  data: Webhook["data"],
  apps: KintoneApps,
  appType: KintoneAppTypes
) => {
  const keyValue = data[apps[appType].fieldCodeOfPrimaryKey] as string | number;
  if (keyValue === undefined) {
    throw new Error(
      `fieldCodeOfPrimaryKey is invalid: ${apps[appType].fieldCodeOfPrimaryKey}`
    );
  }
  return keyValue;
};

const addProjectIfProjectNotFound = async (
  apps: KintoneApps,
  data: { id: string; name: string }
) => {
  const projectRecord = await getRecordById(apps, "project", data.id);
  if (projectRecord === undefined) {
    await addProjectByRecord(apps, data);
  }
};

export const addIssue = async (webhook: Webhook, apps: KintoneApps) => {
  const client = getKintoneClient(apps, "issue");
  const data = webhook.data;

  if (data.project !== undefined) {
    await addProjectIfProjectNotFound(
      apps,
      data.project as { id: string; name: string }
    );
  }
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

  const keyValue = getKeyValue(data, apps, appType);

  const param = {
    app: apps[appType].id,
    query: `${apps[appType].fieldCodeOfPrimaryKey} = "${keyValue}"`,
  };

  console.debug(JSON.stringify(param, null, 2));
  const { records } = await client.record.getRecords(param);
  if (records.length > 1) {
    // レコードが複数返る場合、ユニークなフィールドでないのでエラーを出す
    throw new Error(`${apps.issue.fieldCodeOfPrimaryKey} is not uniq field`);
  }

  return records[0];
};

const getRecordById = async (
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

export const updateIssue = async (
  webhook: UpdateIssueWebhook,
  apps: KintoneApps
) => {
  const client = getKintoneClient(apps, "issue");
  const data = webhook.data;

  if (data.project !== undefined) {
    await addProjectIfProjectNotFound(
      apps,
      data.project as { id: string; name: string }
    );
  }

  const existsIssue = await getRecord(webhook, apps, "issue");
  if (existsIssue === undefined) {
    console.info(
      `Create Issue, ${apps.issue.fieldCodeOfPrimaryKey}: ${
        data[apps.issue.fieldCodeOfPrimaryKey]
      }`
    );
    return addIssue(webhook, apps);
  }

  const record = generateKintoneRecordParam(data);
  delete record[apps.issue.fieldCodeOfPrimaryKey];
  const updateKeyValue = getKeyValue(data, apps, "issue");

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

  return addRecord(client, apps, "project", data, "createProject");
};

export const addProjectByRecord = async (
  apps: KintoneApps,
  data: Record<string, unknown>
) => {
  const client = getKintoneClient(apps, "project");

  return addRecord(client, apps, "project", data, "createProject");
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
      `Create Project, ${apps.project.fieldCodeOfPrimaryKey}: ${
        data[apps.project.fieldCodeOfPrimaryKey]
      }`
    );
    return addProject(webhook, apps);
  }

  const record = generateKintoneRecordParam(data);
  delete record[apps.project.fieldCodeOfPrimaryKey];
  const updateKeyValue = getKeyValue(data, apps, "project");

  const param = {
    app: apps.project.id,
    updateKey: {
      field: apps.project.fieldCodeOfPrimaryKey,
      value: updateKeyValue,
    },
    record: record,
  };
  console.debug(JSON.stringify(param, null, 2));

  await client.record.updateRecord(param).then((event) => {
    console.info("updateProject\n", event.revision);
  });

  return param;
};
