import {
  CreateIssueWebhook,
  UpdateIssueWebhook,
  Webhook,
  WebhookEventsUnion,
  WebhookHandler,
} from "linear-webhook";
import {
  KintoneRestAPIClient,
  KintoneRestAPIError,
} from "@kintone/rest-api-client";
import { getKintoneAppsFromEnv, KintoneApps, RecordForParameter } from "./libs";

export class LinearKintoneSync {
  private handler: WebhookHandler;
  private apps: KintoneApps;

  constructor(kintoneApps?: KintoneApps) {
    this.handler = new WebhookHandler();
    this.apps =
      kintoneApps === undefined ? getKintoneAppsFromEnv() : kintoneApps;
    this.addCallbacks();
  }

  async handle(webhook: Webhook) {
    let result;
    try {
      result = this.handler.execCallback(webhook);
    } catch (e) {
      if (e instanceof KintoneRestAPIError) {
        e.headers = {};
      }
      throw e;
    }
    return result;
  }

  private addCallbacks() {
    this.addCallbackCreateIssue();
    this.addCallbackUpdateIssue();
  }

  private getKintoneClient() {
    return new KintoneRestAPIClient({
      baseUrl: this.apps.baseUrl,
      auth: {
        apiToken: this.apps.issue.token,
      },
    });
  }

  private static generateKintoneRecordParam(data: Record<string, any>) {
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
  }

  addCallbackCreateIssue() {
    const callback = async (webhook: CreateIssueWebhook) => {
      const client = this.getKintoneClient();
      const data = webhook.data;
      const record = LinearKintoneSync.generateKintoneRecordParam(data);
      const param = {
        app: this.apps.issue.id,
        record: record,
      };
      console.debug(JSON.stringify(param, null, 2));

      await client.record.addRecord(param).then((event) => {
        console.info("createIssue\n" + event.id, event.revision);
      });

      return param;
    };

    this.handler.addCallback("CreateIssueWebhook", callback);
  }

  addCallbackUpdateIssue() {
    const callback = async (webhook: UpdateIssueWebhook) => {
      const client = this.getKintoneClient();
      const data = webhook.data;
      const record = LinearKintoneSync.generateKintoneRecordParam(data);
      delete record[this.apps.issue.fieldCodeOfPrimaryKey];

      const param = {
        app: this.apps.issue.id,
        updateKey: {
          field: this.apps.issue.fieldCodeOfPrimaryKey,
          value: data.id,
        },
        record: record,
      };
      console.debug(JSON.stringify(param, null, 2));

      await client.record.updateRecord(param).then((event) => {
        console.info("updateIssue\n", event.revision);
      });

      return param;
    };

    this.handler.addCallback("UpdateIssueWebhook", callback);
  }

  addCustomCallback<T extends Webhook>(
    webhookEvent: WebhookEventsUnion,
    callback: (webhook: Webhook) => any
  ) {
    this.handler.addCallback<T>(webhookEvent, callback);
  }
}
