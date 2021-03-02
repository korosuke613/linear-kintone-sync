import {
  CreateIssueWebhook,
  Webhook,
  WebhookEventsUnion,
  WebhookHandler,
} from "linear-webhook";
import { KintoneRestAPIClient } from "@kintone/rest-api-client";
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
    return this.handler.execCallback(webhook);
  }

  private addCallbacks() {
    this.addCallbackCreateIssue();
  }

  private getKintoneClient() {
    return new KintoneRestAPIClient({
      baseUrl: this.apps.baseUrl,
      auth: {
        apiToken: this.apps.issue.token,
      },
    });
  }

  addCallbackCreateIssue() {
    const callback = async (webhook: CreateIssueWebhook) => {
      const client = this.getKintoneClient();
      const data = webhook.data;
      const record: RecordForParameter = {};

      for (const [key, value] of Object.entries(data)) {
        record[key] = {
          value: value.toString(),
        };
      }
      const addRecordParam = {
        app: this.apps.issue.id,
        record: record,
      };
      console.debug(JSON.stringify(addRecordParam, null, 2));

      await client.record.addRecord(addRecordParam).then((event) => {
        console.info("createCard\n" + event.id, event.revision);
      });

      return addRecordParam;
    };

    this.handler.addCallback("CreateIssueWebhook", callback);
  }

  addCustomCallback<T extends Webhook>(
    webhookEvent: WebhookEventsUnion,
    callback: (webhook: Webhook) => any
  ) {
    this.handler.addCallback<T>(webhookEvent, callback);
  }
}
