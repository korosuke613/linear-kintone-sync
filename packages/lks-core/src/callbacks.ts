import {
  CreateCommentWebhook,
  UpdateCommentWebhook,
  UpdateIssueWebhook,
} from "linear-webhook";
import {
  addIssue,
  addProjectIfProjectNotFound,
  addRecord,
  generateKintoneRecordParam,
  getKeyValue,
  getKintoneClient,
  getRecord,
  sleep,
} from "./libs";
import { KintoneApps } from "./types";

export const updateIssue = async (
  webhook: UpdateIssueWebhook,
  apps: KintoneApps
) => {
  const client = getKintoneClient(apps, "issue");
  const data = webhook.data;

  if (data.project !== undefined) {
    console.log("--- Call addProjectIfProjectNotFound() ---");
    await addProjectIfProjectNotFound(
      apps,
      data.project as { id: string; name: string }
    );
  }

  for (let i = 0; i < 10; i++) {
    console.log("--- Call getRecord() ---");
    const existsIssue = await getRecord(webhook, apps, "issue");
    if (existsIssue === undefined) {
      console.info(
        `Create Issue, ${apps.issue.fieldCodeOfPrimaryKey}: ${
          data[apps.issue.fieldCodeOfPrimaryKey]
        }`
      );
      await addIssue(webhook, apps);
      await sleep(1000);
    } else {
      break;
    }
  }

  if ("url" in webhook && webhook.url !== undefined) {
    data.Url = encodeURI(webhook.url);
  }

  console.log("--- Exec updateRecord ---");
  const record = generateKintoneRecordParam(data);
  delete record[apps.issue.fieldCodeOfPrimaryKey];
  const updateKeyValue = getKeyValue(data, apps, "issue");

  const param = {
    app: apps.issue.id,
    id: updateKeyValue,
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

  if ("url" in webhook) {
    data.Url = webhook.url;
  }

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

  console.log("--- Call getRecord() ---");
  const existsProject = await getRecord(webhook, apps, "project");
  if (existsProject === undefined) {
    console.info(
      `Create Project, ${apps.project.fieldCodeOfPrimaryKey}: ${
        data[apps.project.fieldCodeOfPrimaryKey]
      }`
    );
    console.log("--- Call addProject() ---");
    return addProject(webhook, apps);
  }

  if ("url" in webhook) {
    data.Url = webhook.url;
  }

  console.log("--- Exec updateRecord ---");
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

export const addComment = async (
  webhook: CreateCommentWebhook | UpdateCommentWebhook,
  apps: KintoneApps
) => {
  const client = getKintoneClient(apps, "comment");
  const data = webhook.data;

  if ("url" in webhook) {
    data.Url = webhook.url;
  }

  return addRecord(client, apps, "comment", data, "createComment");
};

export const updateComment = async (
  webhook: UpdateCommentWebhook,
  apps: KintoneApps
) => {
  const client = getKintoneClient(apps, "comment");
  const data = webhook.data;

  console.log("--- Call getRecord() ---");
  const existsComment = await getRecord(webhook, apps, "comment");
  if (existsComment === undefined) {
    console.info(
      `Create Comment, ${apps.comment.fieldCodeOfPrimaryKey}: ${
        data[apps.comment.fieldCodeOfPrimaryKey]
      }`
    );
    console.log("--- Call addComment() ---");
    return addComment(webhook, apps);
  }

  if ("url" in webhook) {
    data.Url = webhook.url;
  }

  console.log("--- Exec updateRecord ---");
  const record = generateKintoneRecordParam(data);
  delete record[apps.comment.fieldCodeOfPrimaryKey];
  const updateKeyValue = getKeyValue(data, apps, "comment");

  const param = {
    app: apps.comment.id,
    updateKey: {
      field: apps.comment.fieldCodeOfPrimaryKey,
      value: updateKeyValue,
    },
    record: record,
  };
  console.debug(JSON.stringify(param, null, 2));

  await client.record.updateRecord(param).then((event) => {
    console.info("updateComment\n", event.revision);
  });

  return param;
};
